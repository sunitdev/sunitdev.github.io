'use client';

import * as React from 'react';

interface Props {
  bits: Uint8Array;
  queryPositions: number[];
  queryFound: boolean;
}

export function BitArrayViz({ bits, queryPositions, queryFound }: Props) {
  const queryPosSet = new Set(queryPositions);
  const cols = Math.min(64, Math.ceil(Math.sqrt(bits.length * 2)));
  const cellSize = 12;
  const gap = 2;
  const rows = Math.ceil(bits.length / cols);
  const W = cols * (cellSize + gap);
  const H = rows * (cellSize + gap) + 4;

  return (
    <div className="space-y-2 rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
          bit array · {bits.length} bits
        </div>
        <div className="font-mono-tabular text-[10px] uppercase tracking-wider text-muted">
          query lookups in {queryFound ? 'green' : 'red'}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Bloom filter bit array">
        {Array.from(bits).map((bit, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = col * (cellSize + gap);
          const y = row * (cellSize + gap);
          const isQuery = queryPosSet.has(i);
          const set = bit === 1;
          let cls = 'fill-border';
          if (isQuery && queryFound) cls = 'fill-[color:var(--color-signal-ok)]';
          else if (isQuery && !queryFound) cls = 'fill-[color:var(--color-signal-crit)]';
          else if (set) cls = 'fill-accent';
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              rx={2}
              className={`${cls} transition-colors`}
            />
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-3 font-mono-tabular text-[10px] uppercase tracking-wider text-muted">
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-border" /> unset
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-accent" /> set
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-[color:var(--color-signal-ok)]" /> query hit
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded-sm bg-[color:var(--color-signal-crit)]" /> query miss
        </span>
      </div>
    </div>
  );
}
