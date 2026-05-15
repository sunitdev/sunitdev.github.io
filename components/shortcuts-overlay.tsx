'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

const shortcuts: { keys: string[]; label: string; action?: () => void }[] = [
  { keys: ['?'], label: 'show / hide this list' },
  { keys: ['g', 'e'], label: 'jump to experience' },
  { keys: ['g', 's'], label: 'jump to skills' },
  { keys: ['g', 'c'], label: 'jump to contact' },
  { keys: ['t'], label: 'toggle theme' },
];

export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isEditable = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      if (el.isContentEditable) return true;
      const tag = el.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select';
    };
    let prefix: 'g' | null = null;
    let prefixTimer: number | null = null;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditable(e.target)) return;
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === 'g') {
        prefix = 'g';
        if (prefixTimer) window.clearTimeout(prefixTimer);
        prefixTimer = window.setTimeout(() => (prefix = null), 800);
        return;
      }
      if (prefix === 'g') {
        const map: Record<string, string> = { e: 'experience', s: 'skills', c: 'contact' };
        const target = map[e.key];
        if (target) {
          document
            .getElementById(target)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        prefix = null;
        return;
      }
      if (e.key === 't') {
        const btn = document.querySelector<HTMLButtonElement>(
          'button[aria-label*="theme" i]',
        );
        btn?.click();
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (prefixTimer) window.clearTimeout(prefixTimer);
    };
  }, []);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Keyboard shortcuts"
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(420px,90vw)] rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-6 shadow-xl"
      >
        <div className="mb-4 flex items-baseline justify-between">
          <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
            shortcuts
          </div>
          <button
            onClick={() => setOpen(false)}
            className="font-mono-tabular text-[11px] uppercase tracking-widest text-fg-muted hover:text-fg"
            aria-label="Close shortcuts"
          >
            esc
          </button>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-sm">
          {shortcuts.map((s, i) => (
            <React.Fragment key={i}>
              <dt className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <kbd
                    key={j}
                    className="rounded border border-[color:var(--color-border)] bg-bg px-1.5 py-0.5 font-mono-tabular text-[11px] text-fg"
                  >
                    {k}
                  </kbd>
                ))}
              </dt>
              <dd className="text-fg-muted">{s.label}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </div>
  );
}
