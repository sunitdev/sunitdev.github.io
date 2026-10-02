// GitHub Pages serves this worker without a Python backend.
const indexURL = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
let runtime;
let activeRequest;
let activeCell;
let executionCount = 0;
let busy = false;
const widgetCells = new Map();

const bootstrap = String.raw`
import io
import json
import sys
import traceback
from contextlib import redirect_stdout, redirect_stderr
from IPython.core.interactiveshell import InteractiveShell
from IPython.core.displaypub import DisplayPublisher
from IPython.core.displayhook import DisplayHook
from notebook_bridge import emit

_output_stack = []
_error_seen = False

def _emit(output):
    if _output_stack:
        widget = _output_stack[-1]
        previous = () if getattr(widget, '_notebook_clear_wait', False) else widget.outputs
        widget._notebook_clear_wait = False
        if previous and output.get('output_type') == 'stream' and previous[-1].get('output_type') == 'stream' and previous[-1].get('name') == output.get('name'):
            output = {**output, 'text': previous[-1]['text'] + output['text']}
            previous = previous[:-1]
        widget.outputs = (*previous, output)
    else:
        emit(json.dumps(output))

def _rich(output_type, data):
    # Widget Output areas use the official Jupyter MIME renderer.
    supported = data if _output_stack else {key: value for key, value in data.items()
        if key in ('text/plain', 'image/png', 'image/svg+xml', 'application/vnd.jupyter.widget-view+json')}
    if supported:
        _emit({'output_type': output_type, 'data': supported, 'metadata': {}})

def _clear_output(wait=False):
    if _output_stack:
        widget = _output_stack[-1]
        if wait:
            widget._notebook_clear_wait = True
        else:
            widget.outputs = ()
    else:
        emit(json.dumps({'output_type': 'clear_output', 'wait': wait}))

class _Publisher(DisplayPublisher):
    def publish(self, data, metadata=None, **kwargs):
        _rich('display_data', data)

    def clear_output(self, wait=False):
        _clear_output(wait)

class _Hook(DisplayHook):
    def write_output_prompt(self):
        pass

    def write_format_data(self, format_dict, md_dict=None):
        _rich('execute_result', format_dict)

    def finish_displayhook(self):
        self._is_active = False

class _Stream(io.TextIOBase):
    def __init__(self, name):
        self.name = name

    def write(self, text):
        if text:
            _emit({'output_type': 'stream', 'name': self.name, 'text': text})
        return len(text)

    def flush(self):
        pass

_shell = InteractiveShell.instance(display_pub_class=_Publisher,
    displayhook_class=_Hook, history_load_length=0)

def _report_error(error):
    global _error_seen
    _error_seen = True
    _emit({'output_type': 'error', 'ename': type(error).__name__, 'evalue': str(error),
        'traceback': traceback.format_exception(type(error), error, error.__traceback__)})

def _show_error(*args, **kwargs):
    error = args[0][1] if args and isinstance(args[0], tuple) else sys.exc_info()[1]
    if error is not None:
        _report_error(error)

_shell.showtraceback = _show_error
_shell.showsyntaxerror = lambda *args, **kwargs: None

# A web worker has no IPython kernel/iopub channel. Capture Output contexts directly
# while keeping actual ipywidgets traits, validation, observers, and callbacks.
import ipywidgets as widgets
from ipywidgets.widgets.widget import _instances

def _output_enter(widget):
    _output_stack.append(widget)
    return widget

def _output_exit(widget, etype, error, tb):
    if error is not None:
        _report_error(error)
    _output_stack.pop()
    return error is not None

def _output_clear(widget, *args, **kwargs):
    with widget:
        _clear_output(kwargs.get('wait', False))

widgets.Output.__enter__ = _output_enter
widgets.Output.__exit__ = _output_exit
widgets.Output.clear_output = _output_clear

def _reset():
    for widget in list(_instances.values()):
        widget.close()
    _output_stack.clear()
    _shell.reset(new_session=True)

def _execute(source):
    global _error_seen
    _error_seen = False
    with redirect_stdout(_Stream('stdout')), redirect_stderr(_Stream('stderr')):
        result = _shell.run_cell(source, store_history=True)
    error = result.error_before_exec or result.error_in_exec
    if error is not None and not _error_seen:
        _report_error(error)
    return error is None and not _error_seen

def _widget_message(payload):
    global _error_seen
    _error_seen = False
    request = json.loads(payload)
    widget = _instances.get(request['modelId'])
    if widget is None:
        raise RuntimeError('Widget session expired. Use Run all to reconnect.')
    message = {'content': {'data': request['data']},
        'buffers': [memoryview(bytes(buffer)) for buffer in request.get('buffers', [])]}
    with redirect_stdout(_Stream('stdout')), redirect_stderr(_Stream('stderr')):
        widget._handle_msg(message)
    return not _error_seen

def _widget_state():
    return json.dumps(widgets.Widget.get_manager_state(drop_defaults=False))
`;

async function initialize() {
  const { loadPyodide } = await import(`${indexURL}pyodide.mjs`);
  const pyodide = await loadPyodide({ indexURL });
  await pyodide.loadPackage(['ipython', 'micropip']);
  // These pure-Python wheels use IPython and traitlets already supplied by Pyodide.
  await pyodide.runPythonAsync(`import micropip
await micropip.install(['comm==0.2.3', 'ipywidgets==8.1.9'], deps=False)`);
  pyodide.registerJsModule('notebook_bridge', {
    emit: (payload) => {
      const output = JSON.parse(payload);
      self.postMessage(
        output.output_type === 'clear_output'
          ? { type: 'clear-output', id: activeRequest, index: activeCell, wait: output.wait }
          : { type: 'output', id: activeRequest, index: activeCell, output },
      );
    },
  });
  pyodide.runPython(bootstrap);
  pyodide.setStdin({ error: true });
  return pyodide;
}

/** @param {MessageEvent<import('../lib/notebook-runner').RunRequest | import('../lib/notebook-runner').WidgetRequest>} event */
self.onmessage = async ({ data: request }) => {
  if (!['run', 'widget'].includes(request.type) || busy) return;
  busy = true;
  activeRequest = request.id;
  const send = (event) => self.postMessage({ ...event, id: request.id });
  function publishWidgets(pyodide) {
    const state = JSON.parse(pyodide.runPython('_widget_state()'));
    for (const id of Object.keys(state.state)) {
      if (!widgetCells.has(id)) widgetCells.set(id, activeCell);
    }
    send({ type: 'widgets', state });
  }
  try {
    if (!runtime) {
      send({ type: 'loading' });
      runtime = initialize();
    }
    const pyodide = await runtime;
    if (request.type === 'widget') {
      activeCell = widgetCells.get(request.modelId);
      if (activeCell === undefined) throw new Error('Widget session expired. Use Run all.');
      pyodide.globals.set('_widget_payload', JSON.stringify(request));
      let success;
      try {
        success = pyodide.runPython('_widget_message(_widget_payload)');
      } finally {
        pyodide.globals.delete('_widget_payload');
      }
      publishWidgets(pyodide);
      send({ type: 'done', success });
      return;
    }
    if (request.reset) {
      pyodide.runPython('_reset()');
      widgetCells.clear();
      executionCount = 0;
    }
    for (const cell of request.cells) {
      activeCell = cell.index;
      send({ type: 'cell-start', index: cell.index, executionCount: ++executionCount });
      let success;
      try {
        await pyodide.loadPackagesFromImports(cell.source);
        pyodide.globals.set('_cell_source', cell.source);
        success = pyodide.runPython('_execute(_cell_source)');
      } catch (error) {
        send({
          type: 'output',
          index: cell.index,
          output: {
            output_type: 'error',
            ename: 'Python error',
            evalue: String(error),
          },
        });
        success = false;
      } finally {
        pyodide.globals.delete('_cell_source');
      }
      publishWidgets(pyodide);
      send({ type: 'cell-end', index: cell.index, success });
      if (!success) {
        send({ type: 'done', success: false });
        return;
      }
    }
    send({ type: 'done', success: true });
  } catch (error) {
    runtime = undefined;
    send({ type: 'error', message: String(error) });
  } finally {
    busy = false;
    activeCell = undefined;
    activeRequest = undefined;
  }
};
