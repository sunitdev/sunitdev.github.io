import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { site } from '@/lib/site';

export function Nav() {
  return (
    <nav className="container-prose flex items-center justify-between pt-8 pb-4">
      <Link
        href="/"
        className="font-mono-tabular text-sm text-fg-muted transition-colors hover:text-fg"
      >
        {site.name.toLowerCase()}
      </Link>
      <div className="flex items-center gap-5 font-mono-tabular text-[11px] uppercase tracking-widest">
        <Link
          href="/#experience"
          className="text-fg-muted transition-colors hover:text-fg"
        >
          experience
        </Link>
        <Link
          href="/#skills"
          className="text-fg-muted transition-colors hover:text-fg"
        >
          skills
        </Link>
        <Link
          href="/#contact"
          className="text-fg-muted transition-colors hover:text-fg"
        >
          contact
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
