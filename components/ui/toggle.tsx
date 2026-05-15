'use client';

import * as React from 'react';

export function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border px-3 py-1.5 font-mono-tabular text-xs uppercase tracking-wider transition-colors ${
        active
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-[color:var(--color-border)] text-fg-muted hover:border-fg-muted hover:text-fg'
      }`}
    >
      {children}
    </button>
  );
}
