'use client';

import { useEffect, useRef, useState } from 'react';
import type { HTMLManager } from '@jupyter-widgets/html-manager';
import type { WidgetState } from '@/lib/notebook-format';

type WidgetModel = Awaited<ReturnType<HTMLManager['get_model']>>;
type WidgetComm = NonNullable<WidgetModel['comm']>;

type Send = (modelId: string, data: Record<string, unknown>, buffers: number[][]) => Promise<void>;

export function WidgetOutput({
  modelId,
  state,
  live,
  busy,
  onSend,
}: {
  modelId: string;
  state?: WidgetState;
  live: boolean;
  busy: boolean;
  onSend: Send;
}) {
  const root = useRef<HTMLDivElement>(null);
  const manager = useRef<Promise<HTMLManager> | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const wired = useRef(new WeakSet<WidgetModel>());
  const sender = useRef(onSend);
  const connected = useRef(live);
  const mounted = useRef(false);
  const lifetime = useRef(0);
  const [error, setError] = useState('');
  sender.current = onSend;
  connected.current = live;

  useEffect(() => {
    if (!state) return;
    let cancelled = false;
    if (!manager.current) {
      manager.current = import('@jupyter-widgets/html-manager').then(
        ({ HTMLManager }) => new HTMLManager(),
      );
    }
    const current = manager.current;
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        if (cancelled) return;
        const renderer = await current;
        const models = await renderer.set_state(structuredClone(state));
        for (const model of models) {
          if (wired.current.has(model)) continue;
          const comm: WidgetComm = {
            comm_id: model.model_id,
            target_name: 'jupyter.widget',
            open: () => '',
            on_close: () => {},
            on_msg: () => {},
            close: () => '',
            send: (data, callbacks, _metadata?, buffers?) => {
              const id = crypto.randomUUID();
              if (!connected.current || !mounted.current) return id;
              const bytes = (buffers ?? []).map((buffer) =>
                Array.from(
                  new Uint8Array(
                    ArrayBuffer.isView(buffer)
                      ? (buffer.buffer.slice(
                          buffer.byteOffset,
                          buffer.byteOffset + buffer.byteLength,
                        ) as ArrayBuffer)
                      : buffer,
                  ),
                ),
              );
              void sender
                .current(model.model_id, data as Record<string, unknown>, bytes)
                .catch((reason) => setError(String(reason)))
                .finally(() =>
                  callbacks?.iopub?.status?.({
                    content: { execution_state: 'idle' },
                  } as Parameters<WidgetModel['_handle_status']>[0]),
                );
              return id;
            },
          };
          model.comm = comm;
          model.comm_live = true;
          wired.current.add(model);
        }
        if (cancelled || !root.current) return;
        if (!root.current.childElementCount) {
          const model = await renderer.get_model(modelId);
          const view = await renderer.create_view(model);
          if (cancelled || !root.current) {
            view.remove();
            return;
          }
          await renderer.display_view(view, root.current);
        }
        setError('');
      })
      .catch((reason) => {
        if (!cancelled) setError(`Could not render notebook widgets: ${String(reason)}`);
      });
    return () => {
      cancelled = true;
    };
  }, [modelId, state]);

  useEffect(() => {
    const token = lifetime;
    const generation = ++token.current;
    mounted.current = true;
    return () => {
      mounted.current = false;
      void queue.current
        .catch(() => {})
        .then(() => (token.current === generation ? manager.current : null))
        .then((renderer) => renderer?.clear_state())
        .catch(() => {});
    };
  }, []);

  return (
    <div className="notebook-widgets">
      {!live && (
        <p className="notebook-status">
          Saved notebook widgets. Use Run all to connect them to Python.
        </p>
      )}
      {error && (
        <p className="notebook-status cell-error" role="alert">
          {error}
        </p>
      )}
      <div ref={root} inert={!live || busy} aria-busy={busy} />
    </div>
  );
}
