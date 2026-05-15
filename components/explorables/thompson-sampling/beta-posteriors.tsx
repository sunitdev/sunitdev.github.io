'use client';

import * as React from 'react';
import { betaPdf, type Arm } from '@/lib/thompson-sampling';

interface Props {
  arms: Arm[];
  bestArmId: string;
}

const COLORS = ['#5bc0eb', '#fde74c', '#9bc53d', '#e55934', '#c47ac0'];

export function BetaPosteriors({ arms, bestArmId }: Props) {
  const W = 720;
  const H = 220;
  const PADL = 36;
  const PADR = 16;
  const PADT = 14;
  const PADB = 28;

  const steps = 100;
  const xs = Array.from({ length: steps }, (_, i) => (i + 0.5) / steps);

  const allPdfValues = arms.flatMap((arm) =>
    xs.map((x) => betaPdf(x, arm.alpha, arm.beta)),
  );
  const maxPdf = Math.max(1e-3, ...allPdfValues);

  const xCoord = (v: number) => PADL + v * (W - PADL - PADR);
  const yCoord = (v: number) => PADT + (1 - v / maxPdf) * (H - PADT - PADB);

  const armPaths = arms.map((arm, i) => {
    const pdfs = xs.map((x) => betaPdf(x, arm.alpha, arm.beta));
    const path = pdfs
      .map((p, k) => `${k === 0 ? 'M' : 'L'} ${xCoord(xs[k])} ${yCoord(p)}`)
      .join(' ');
    return { id: arm.id, color: COLORS[i % COLORS.length], path, trueCtr: arm.trueCtr, isBest: arm.id === bestArmId };
  });

  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
          beta posteriors · density over true CTR
        </div>
        <div className="flex flex-wrap gap-3 font-mono-tabular text-[10px] uppercase tracking-wider">
          {armPaths.map((a) => (
            <span key={a.id} className="flex items-center gap-1" style={{ color: a.color }}>
              <span className="inline-block h-0.5 w-3" style={{ backgroundColor: a.color }} />
              arm {a.id}
              {a.isBest && <span className="text-accent">★</span>}
            </span>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Beta posteriors per arm">
        <line
          x1={PADL}
          y1={H - PADB}
          x2={W - PADR}
          y2={H - PADB}
          stroke="currentColor"
          className="text-border"
        />
        <line
          x1={PADL}
          y1={PADT}
          x2={PADL}
          y2={H - PADB}
          stroke="currentColor"
          className="text-border"
        />
        {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((tick) => (
          <g key={tick}>
            <line
              x1={xCoord(tick)}
              y1={H - PADB}
              x2={xCoord(tick)}
              y2={H - PADB + 4}
              stroke="currentColor"
              className="text-border"
            />
            <text
              x={xCoord(tick)}
              y={H - 10}
              textAnchor="middle"
              className="fill-muted font-mono-tabular text-[10px]"
            >
              {(tick * 100).toFixed(0)}%
            </text>
          </g>
        ))}

        {armPaths.map((a) => (
          <g key={a.id}>
            <line
              x1={xCoord(a.trueCtr)}
              y1={PADT}
              x2={xCoord(a.trueCtr)}
              y2={H - PADB}
              stroke={a.color}
              strokeDasharray="3 4"
              opacity={0.4}
            />
            <path d={a.path} fill="none" stroke={a.color} strokeWidth={2} />
          </g>
        ))}
      </svg>
    </div>
  );
}
