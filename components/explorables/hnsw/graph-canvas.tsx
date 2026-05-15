'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { type HnswGraph, type SearchStep, type Vec2 } from '@/lib/hnsw';

interface Props {
  graph: HnswGraph;
  query: Vec2;
  onQueryChange: (q: Vec2) => void;
  resultIds: number[];
  searchSteps: SearchStep[];
  truth: number[];
}

const W = 720;
const H = 420;
const PAD = 24;

export function GraphCanvas({ graph, query, onQueryChange, resultIds, searchSteps, truth }: Props) {
  const resultSet = useMemo(() => new Set(resultIds), [resultIds]);
  const truthSet = useMemo(() => new Set(truth), [truth]);
  const traversalSet = useMemo(() => new Set(searchSteps.map((s) => s.bestId)), [searchSteps]);
  const maxLayer = useMemo(
    () => graph.nodes.reduce((m, n) => Math.max(m, n.maxLayer), 0),
    [graph],
  );

  const xCoord = (v: number) => PAD + v * (W - 2 * PAD);
  const yCoord = (v: number) => PAD + v * (H - 2 * PAD);

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = (e.clientX - rect.left) / rect.width;
    const sy = (e.clientY - rect.top) / rect.height;
    const vx = (sx * W - PAD) / (W - 2 * PAD);
    const vy = (sy * H - PAD) / (H - 2 * PAD);
    onQueryChange({ x: Math.max(0, Math.min(1, vx)), y: Math.max(0, Math.min(1, vy)) });
  };

  return (
    <div className="space-y-2 rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
          HNSW graph · click to move query
        </div>
        <div className="flex flex-wrap gap-3 font-mono-tabular text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1 text-fg-muted">
            <span className="inline-block size-2 rounded-full bg-fg-muted" /> indexed
          </span>
          <span className="flex items-center gap-1 text-accent">
            <span className="inline-block size-2 rounded-full bg-accent" /> traversed
          </span>
          <span className="flex items-center gap-1 text-[color:var(--color-signal-ok)]">
            <span className="inline-block size-2 rounded-full bg-[color:var(--color-signal-ok)]" /> result (in top-k)
          </span>
          <span className="flex items-center gap-1 text-[color:var(--color-signal-warn)]">
            <span className="inline-block size-2 rounded-full border-2 border-[color:var(--color-signal-warn)]" /> true neighbor (brute-force)
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full cursor-crosshair rounded bg-bg" onClick={onClick}>
        {graph.nodes.map((node) =>
          (node.neighbors[0] ?? []).map((neighborId) => {
            const nb = graph.nodes[neighborId];
            return (
              <line
                key={`e-${node.id}-${neighborId}`}
                x1={xCoord(node.vec.x)}
                y1={yCoord(node.vec.y)}
                x2={xCoord(nb.vec.x)}
                y2={yCoord(nb.vec.y)}
                stroke="currentColor"
                className="text-border"
                opacity={0.4}
              />
            );
          }),
        )}

        {graph.nodes.map((node) => {
          const isResult = resultSet.has(node.id);
          const isTruth = truthSet.has(node.id);
          const isTraversed = traversalSet.has(node.id);
          const layerFactor = maxLayer > 0 ? node.maxLayer / maxLayer : 0;
          const r = 3 + layerFactor * 3.5;
          return (
            <g key={`n-${node.id}`}>
              {isTruth && (
                <circle
                  cx={xCoord(node.vec.x)}
                  cy={yCoord(node.vec.y)}
                  r={r + 4}
                  fill="none"
                  className="stroke-[color:var(--color-signal-warn)]"
                  strokeWidth={1.5}
                />
              )}
              <circle
                cx={xCoord(node.vec.x)}
                cy={yCoord(node.vec.y)}
                r={r}
                className={
                  isResult
                    ? 'fill-[color:var(--color-signal-ok)]'
                    : isTraversed
                    ? 'fill-accent'
                    : 'fill-fg-muted'
                }
                opacity={isResult || isTraversed ? 1 : 0.6}
              />
            </g>
          );
        })}

        <g>
          <circle
            cx={xCoord(query.x)}
            cy={yCoord(query.y)}
            r={10}
            fill="none"
            className="stroke-fg"
            strokeWidth={2}
          />
          <line
            x1={xCoord(query.x) - 14}
            y1={yCoord(query.y)}
            x2={xCoord(query.x) + 14}
            y2={yCoord(query.y)}
            className="stroke-fg"
            strokeWidth={1.5}
          />
          <line
            x1={xCoord(query.x)}
            y1={yCoord(query.y) - 14}
            x2={xCoord(query.x)}
            y2={yCoord(query.y) + 14}
            className="stroke-fg"
            strokeWidth={1.5}
          />
        </g>
      </svg>

      <div className="font-mono-tabular text-[10px] uppercase tracking-wider text-muted">
        dot size = node's max layer · higher layers = sparser long-range jumps
      </div>
    </div>
  );
}
