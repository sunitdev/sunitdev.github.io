// Kept as a public module so the GitHub Pages export can serve it without a backend.
const indexURL = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
let runtime;
let activeRequest;
let activeCell;
let executionCount = 0;
let busy = false;

const bootstrap = String.raw`
import io
import json
import traceback
from contextlib import redirect_stdout, redirect_stderr
from IPython.core.interactiveshell import InteractiveShell
from IPython.core.displaypub import DisplayPublisher
from IPython.core.displayhook import DisplayHook
from notebook_bridge import emit

def _emit(output):
    emit(json.dumps(output))

def _rich(output_type, data):
    supported = {key: value for key, value in data.items()
                 if key in ('text/plain', 'image/png', 'image/svg+xml')}
    if supported:
        _emit({'output_type': output_type, 'data': supported})

class _Publisher(DisplayPublisher):
    def publish(self, data, metadata=None, **kwargs):
        _rich('display_data', data)

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
                                   displayhook_class=_Hook,
                                   history_load_length=0)
# Structured errors are emitted below, rather than printing coloured tracebacks.
_shell.showtraceback = lambda *args, **kwargs: None
_shell.showsyntaxerror = lambda *args, **kwargs: None

def _reset():
    _shell.reset(new_session=True)

def _execute(source):
    with redirect_stdout(_Stream('stdout')), redirect_stderr(_Stream('stderr')):
        result = _shell.run_cell(source, store_history=True)
    error = result.error_before_exec or result.error_in_exec
    if error is not None:
        _emit({'output_type': 'error', 'ename': type(error).__name__,
               'evalue': str(error),
               'traceback': traceback.format_exception(type(error), error, error.__traceback__)})
    return error is None
`;

async function initialize() {
  const { loadPyodide } = await import(`${indexURL}pyodide.mjs`);
  const pyodide = await loadPyodide({ indexURL });
  await pyodide.loadPackage('ipython');
  pyodide.registerJsModule('notebook_bridge', {
    emit: (payload) =>
      self.postMessage({
        type: 'output',
        id: activeRequest,
        index: activeCell,
        output: JSON.parse(payload),
      }),
  });
  pyodide.runPython(bootstrap);
  // Website cells are read-only and have no interactive stdin UI.
  pyodide.setStdin({ error: true });
  return pyodide;
}

/** @param {MessageEvent<import('../lib/notebook-runner').RunRequest>} event */
self.onmessage = async ({ data: request }) => {
  if (request.type !== 'run' || busy) return;
  busy = true;
  activeRequest = request.id;
  const send = (event) => self.postMessage({ ...event, id: request.id });
  try {
    if (!runtime) {
      send({ type: 'loading' });
      runtime = initialize();
    }
    const pyodide = await runtime;
    if (request.reset) {
      pyodide.runPython('_reset()');
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
