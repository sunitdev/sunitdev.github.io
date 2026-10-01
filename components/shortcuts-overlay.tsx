'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

const shortcuts: { keys: string[]; label: string }[] = [
  { keys: ['?'], label: 'show / hide this list' },
  { keys: ['g', 'b'], label: 'open blog' },
  { keys: ['g', 'a'], label: 'jump to about' },
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
        if (e.key === 'b') window.location.assign('/blog/');
        if (e.key === 'a') {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        prefix = null;
        return;
      }
      if (e.key === 't') {
        const btn = document.querySelector<HTMLButtonElement>('button[aria-label*="theme" i]');
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-bg-elev w-[min(420px,90vw)] rounded-2xl border border-[color:var(--color-border)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        <div className="mb-5 flex items-baseline justify-between">
          <div className="text-fg text-[15px] font-semibold">Shortcuts</div>
          <button
            onClick={() => setOpen(false)}
            className="text-fg-muted hover:text-fg text-[13px] transition-colors"
            aria-label="Close shortcuts"
          >
            Esc
          </button>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-[15px]">
          {shortcuts.map((s, i) => (
            <React.Fragment key={i}>
              <dt className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <kbd
                    key={j}
                    className="bg-bg-alt text-fg rounded-md border border-[color:var(--color-border)] px-1.5 py-0.5 text-[12px]"
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
