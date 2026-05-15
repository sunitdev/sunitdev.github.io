'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Toggle theme'}
      className="rounded-md border border-[color:var(--color-border)] px-2.5 py-1 font-mono-tabular text-[11px] uppercase tracking-widest text-fg-muted transition-colors hover:border-fg-muted hover:text-fg"
    >
      {mounted ? (isDark ? '◐ dark' : '◑ light') : '◐'}
    </button>
  );
}
