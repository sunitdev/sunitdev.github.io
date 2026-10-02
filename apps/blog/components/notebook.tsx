/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  cellText,
  outputText,
  savedOutputImage,
  type NotebookCell,
  type WidgetState,
} from '@/lib/notebook-format';
import { WidgetOutput } from './widget-output';
import {
  appendOutput,
  buildRunRequest,
  type CellRun,
  type RunnerEvent,
  type WidgetRequest,
} from '@/lib/notebook-runner';

export function Notebook({
  header,
  cells,
  highlightedSources,
  figureAlt,
  savedWidgetState,
}: {
  header: ReactNode;
  cells: NotebookCell[];
  highlightedSources?: Record<number, string>;
  figureAlt?: string;
  savedWidgetState?: WidgetState;
}) {
  const [interactive, setInteractive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [runTrigger, setRunTrigger] = useState<number | 'all' | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Saved results.');
  const [runs, setRuns] = useState<Record<number, CellRun>>({});
  const [widgetState, setWidgetState] = useState<WidgetState | undefined>(savedWidgetState);
  const [widgetsLive, setWidgetsLive] = useState(false);
  const [session, setSession] = useState(0);
  const widgetQueueRef = useRef<Promise<void>>(Promise.resolve());
  const widgetCompletionRef = useRef<{
    resolve: () => void;
    reject: (error: Error) => void;
  } | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const busyRef = useRef(false);
  const requestRef = useRef(0);
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadingTimer = useCallback(() => {
    if (loadingTimer.current !== null) clearTimeout(loadingTimer.current);
    loadingTimer.current = null;
  }, []);

  const disposeWorker = useCallback(
    (message: string) => {
      workerRef.current?.terminate();
      workerRef.current = null;
      widgetCompletionRef.current?.reject(new Error(message));
      widgetCompletionRef.current = null;
      clearLoadingTimer();
    },
    [clearLoadingTimer],
  );

  useEffect(() => {
    setInteractive(true);
    return () => {
      disposeWorker('Notebook closed.');
    };
  }, [disposeWorker]);

  function finish(message: string) {
    clearLoadingTimer();
    busyRef.current = false;
    setBusy(false);
    setRunTrigger(null);
    setLoading(false);
    setStatus(message);
    widgetCompletionRef.current?.resolve();
    widgetCompletionRef.current = null;
  }

  function fail(message: string) {
    setWidgetsLive(false);
    disposeWorker(message);
    setRuns((previous) =>
      Object.fromEntries(
        Object.entries(previous).map(([index, run]) => [
          index,
          { ...run, status: run.status === 'running' ? 'error' : 'previous' },
        ]),
      ),
    );
    finish(message);
  }

  function run(index?: number) {
    // Lock synchronously, including clicks before React updates disabled buttons.
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setRunTrigger(index ?? 'all');
    setLoading(true);
    setStatus('Loading Python… The first run downloads the browser runtime.');
    const id = ++requestRef.current;
    const reset = index === undefined;
    if (reset) {
      setWidgetsLive(false);
      setWidgetState(undefined);
      setSession((previous) => previous + 1);
      setRuns((previous) =>
        Object.fromEntries(
          Object.entries(previous).map(([key, value]) => [key, { ...value, status: 'previous' }]),
        ),
      );
    }

    try {
      if (!workerRef.current) {
        const worker = new Worker('/notebook-worker.mjs', { type: 'module' });
        workerRef.current = worker;
        worker.onerror = (event) => {
          event.preventDefault();
          if (workerRef.current === worker) {
            fail('Python could not start. Check your connection and click Run to retry.');
          }
        };
        worker.onmessageerror = () => {
          if (workerRef.current === worker) fail('Python stopped responding. Click Run to retry.');
        };
        worker.onmessage = ({ data: event }: MessageEvent<RunnerEvent>) => {
          if (workerRef.current !== worker || event.id !== requestRef.current || !busyRef.current)
            return;
          switch (event.type) {
            case 'loading':
              setStatus('Loading Python… The first run downloads the browser runtime.');
              break;
            case 'cell-start':
              clearLoadingTimer();
              setLoading(false);
              setStatus(
                `Running code cell ${cells.slice(0, event.index + 1).filter((cell) => cell.cell_type === 'code').length}…`,
              );
              setRuns((previous) => ({
                ...previous,
                [event.index]: {
                  status: 'running',
                  executionCount: event.executionCount,
                  outputs: [],
                },
              }));
              break;
            case 'clear-output':
              setRuns((previous) =>
                previous[event.index]
                  ? { ...previous, [event.index]: { ...previous[event.index], outputs: [] } }
                  : previous,
              );
              break;
            case 'output':
              setRuns((previous) => {
                const current = previous[event.index];
                if (!current) return previous;
                return {
                  ...previous,
                  [event.index]: {
                    ...current,
                    outputs: appendOutput(current.outputs, event.output),
                  },
                };
              });
              break;
            case 'cell-end':
              setRuns((previous) => ({
                ...previous,
                [event.index]: {
                  ...previous[event.index],
                  status: event.success ? 'completed' : 'error',
                },
              }));
              break;
            case 'widgets':
              setWidgetState(event.state);
              setWidgetsLive(true);
              break;
            case 'done':
              finish(
                event.success
                  ? 'Execution completed.'
                  : 'Execution stopped on a Python error. Use Run all to reconnect widgets or restore variables.',
              );
              break;
            case 'error':
              fail(
                `Python could not load: ${event.message}. Check your connection and click Run to retry.`,
              );
              break;
          }
        };
      }
      const request = buildRunRequest(id, cells, index);
      loadingTimer.current = setTimeout(() => {
        fail('Loading Python timed out. Check your connection and click Run to retry.');
      }, 90_000);
      workerRef.current.postMessage(request);
    } catch {
      fail('Python is unavailable in this browser. Try a current browser.');
    }
  }

  function sendWidget(
    modelId: string,
    data: Record<string, unknown>,
    buffers: number[][],
  ): Promise<void> {
    const operation = widgetQueueRef.current
      .catch(() => {})
      .then(
        () =>
          new Promise<void>((resolve, reject) => {
            if (!workerRef.current || busyRef.current) {
              reject(new Error('Python session is unavailable. Use Run all to reconnect widgets.'));
              return;
            }
            widgetCompletionRef.current = { resolve, reject };
            busyRef.current = true;
            setBusy(true);
            setStatus('Updating notebook widgets…');
            const request: WidgetRequest = {
              type: 'widget',
              id: ++requestRef.current,
              modelId,
              data,
              buffers,
            };
            workerRef.current.postMessage(request);
          }),
      );
    widgetQueueRef.current = operation;
    return operation;
  }

  function stop() {
    setWidgetsLive(false);
    disposeWorker('Python stopped. Use Run all to reconnect widgets.');
    setRuns((previous) =>
      Object.fromEntries(
        Object.entries(previous).map(([index, value]) => [
          index,
          { ...value, status: value.status === 'running' ? 'stopped' : 'previous' },
        ]),
      ),
    );
    finish('Stopped. Python variables were cleared; use Run all to start again.');
  }

  return (
    <>
      <header className="post-header">
        {header}
        <div className="notebook-toolbar">
          <div className="notebook-buttons">
            <button
              type="button"
              className="notebook-button"
              aria-label="Run all"
              title="Run every code cell in order with fresh Python variables"
              aria-busy={busy && runTrigger === 'all'}
              disabled={!interactive || busy || !cells.some((cell) => cell.cell_type === 'code')}
              onClick={() => run()}
            >
              {busy && runTrigger === 'all' && (
                <span className="notebook-spinner" aria-hidden="true" />
              )}
              {busy && runTrigger === 'all' ? (loading ? 'Loading…' : 'Running…') : 'Run all'}
            </button>
            {busy && (
              <button type="button" className="notebook-button" onClick={stop}>
                Stop
              </button>
            )}
          </div>
          <p className="notebook-status" role="status" aria-live="polite">
            {status}
          </p>
        </div>
        <noscript>
          <p className="notebook-status">Enable JavaScript to run Python here.</p>
        </noscript>
      </header>
      <div className="notebook">
        {cells.map((cell, index) => {
          const current = runs[index];
          const cellBusy =
            busy && (current?.status === 'running' || (loading && runTrigger === index));
          const outputs = current?.outputs ?? cell.outputs ?? [];
          const ordinal = cells
            .slice(0, index + 1)
            .filter((entry) => entry.cell_type === 'code').length;
          return (
            <section key={index}>
              {cell.cell_type === 'markdown' ? (
                <div className="markdown-cell">
                  {cellText(cell.source)
                    .split(/\n\s*\n/)
                    .map((paragraph, part) =>
                      paragraph.startsWith('## ') ? (
                        <h2 key={part}>{paragraph.slice(3)}</h2>
                      ) : (
                        <p key={part}>{paragraph}</p>
                      ),
                    )}
                </div>
              ) : cell.cell_type === 'code' ? (
                <div className="code-cell" aria-busy={current?.status === 'running'}>
                  <div className="cell-label">
                    <span>
                      PYTHON / {current ? 'Live' : 'Saved'} In [
                      {current?.executionCount ?? cell.execution_count ?? ' '}]{' '}
                      {current &&
                        ` / ${current.status === 'previous' ? 'previous session' : current.status}`}
                    </span>
                    <button
                      type="button"
                      className="notebook-button cell-run"
                      disabled={!interactive || busy}
                      aria-label={`Run code cell ${ordinal}`}
                      title="Run this cell using the current Python variables; run earlier cells first"
                      aria-busy={cellBusy}
                      onClick={() => run(index)}
                    >
                      {cellBusy && <span className="notebook-spinner" aria-hidden="true" />}
                      {cellBusy ? (loading ? 'Loading…' : 'Running…') : 'Run'}
                    </button>
                  </div>
                  <pre className="code-source">
                    {highlightedSources?.[index] !== undefined ? (
                      // Only markup generated from escaped source by the server highlighter.
                      <code
                        className="language-python"
                        dangerouslySetInnerHTML={{ __html: highlightedSources[index] }}
                      />
                    ) : (
                      <code className="language-python">{cellText(cell.source)}</code>
                    )}
                  </pre>
                  {outputs.map((output, outputIndex) => {
                    const image = savedOutputImage(output);
                    const widget = output.data?.['application/vnd.jupyter.widget-view+json'];
                    return (
                      <div
                        key={outputIndex}
                        className={[
                          'cell-output',
                          output.output_type === 'error' || output.name === 'stderr'
                            ? 'cell-error'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {widget ? (
                          <WidgetOutput
                            key={`${session}-${widget.model_id}`}
                            modelId={widget.model_id}
                            state={
                              widgetState?.state[widget.model_id] ? widgetState : savedWidgetState
                            }
                            live={widgetsLive && !!widgetState?.state[widget.model_id]}
                            busy={busy}
                            onSend={sendWidget}
                          />
                        ) : image ? (
                          <img
                            src={image}
                            alt={figureAlt ?? 'Figure generated by this Python cell'}
                          />
                        ) : (
                          <pre>
                            <code>{outputText(output)}</code>
                          </pre>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <pre className="code-source">{cellText(cell.source)}</pre>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
