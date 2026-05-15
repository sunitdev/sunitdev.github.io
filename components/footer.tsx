import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="container-prose flex flex-wrap items-baseline justify-between gap-3 border-t border-[color:var(--color-border)] py-10 font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
      <span>
        © {new Date().getFullYear()} {site.name.toLowerCase()}
      </span>
      <span>no analytics · no popup · one engineer</span>
      <span>
        press <kbd className="rounded border border-[color:var(--color-border)] px-1.5 py-0.5 text-fg">?</kbd> for shortcuts
      </span>
    </footer>
  );
}
