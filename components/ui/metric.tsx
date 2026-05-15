'use client';

import * as React from 'react';
import { AnimatedNumber } from './animated-number';

type SignalColor = 'ok' | 'warn' | 'crit' | 'muted';

const COLOR_CLASS: Record<SignalColor, string> = {
  ok: 'text-[color:var(--color-signal-ok)]',
  warn: 'text-[color:var(--color-signal-warn)]',
  crit: 'text-[color:var(--color-signal-crit)]',
  muted: 'text-fg-muted',
};

export function MetricRow({
  label,
  techLabel,
  value,
  format,
  color = 'muted',
  bar,
}: {
  label: string;
  techLabel?: string;
  value: number;
  format: (v: number) => string;
  color?: SignalColor;
  bar?: { value: number; max: number };
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-2">
      <div className="text-sm text-fg sm:text-base">{label}</div>
      <AnimatedNumber
        value={value}
        format={format}
        className={`font-mono-tabular text-base font-medium tabular-nums sm:text-lg ${COLOR_CLASS[color]}`}
      />
      {bar && (
        <div className="col-span-2 h-1 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-[width] duration-200 ${BG_FROM_COLOR[color]}`}
            style={{ width: `${Math.min(100, (bar.value / bar.max) * 100)}%` }}
          />
        </div>
      )}
      {techLabel && (
        <div className="col-span-2 -mt-1 font-mono-tabular text-[11px] uppercase tracking-wider text-muted">
          {techLabel}
        </div>
      )}
    </div>
  );
}

const BG_FROM_COLOR: Record<SignalColor, string> = {
  ok: 'bg-[color:var(--color-signal-ok)]',
  warn: 'bg-[color:var(--color-signal-warn)]',
  crit: 'bg-[color:var(--color-signal-crit)]',
  muted: 'bg-fg-muted',
};
