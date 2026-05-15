'use client';

import * as React from 'react';

interface Props {
  name: string;
  peerName: string;
  set: string[];
  allItems: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  onSyncFrom: () => void;
}

export function ReplicaCard({ name, peerName, set, allItems, onAdd, onRemove, onSyncFrom }: Props) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h4 className="font-medium text-fg">{name}</h4>
        <button
          onClick={onSyncFrom}
          className="rounded-md border border-[color:var(--color-border)] px-2.5 py-1 font-mono-tabular text-[10px] uppercase tracking-wider text-fg-muted transition-colors hover:border-accent hover:text-accent"
        >
          ← sync from {peerName}
        </button>
      </div>

      <div className="mb-3 space-y-1">
        <div className="font-mono-tabular text-[10px] uppercase tracking-wider text-muted">
          current set
        </div>
        {set.length === 0 ? (
          <div className="font-mono-tabular text-xs text-muted">∅ empty</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {set.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-md border border-[color:var(--color-border)] bg-bg px-2 py-0.5 font-mono-tabular text-xs text-fg"
              >
                {v}
                <button
                  onClick={() => onRemove(v)}
                  aria-label={`remove ${v}`}
                  className="text-[color:var(--color-signal-crit)] transition-colors hover:opacity-70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="font-mono-tabular text-[10px] uppercase tracking-wider text-muted">
          add item
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allItems.map((v) => (
            <button
              key={v}
              onClick={() => onAdd(v)}
              className="rounded-md border border-[color:var(--color-border)] bg-bg px-2 py-0.5 font-mono-tabular text-xs text-fg-muted transition-colors hover:border-accent hover:text-accent"
            >
              + {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
