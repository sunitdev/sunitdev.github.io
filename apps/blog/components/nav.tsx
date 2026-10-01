import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { site } from '@/lib/site';

export function Nav({ active }: { active?: 'journal' }) {
  return (
    <nav className="journal-nav" aria-label="Main navigation">
      <div className="journal-container nav-inner">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`}>
          {site.name}
          <span>.</span>
        </Link>
        <div className="nav-links">
          <Link href="/blog/" aria-current={active === 'journal' ? 'page' : undefined}>
            Journal
          </Link>
          <Link href="/#about">About</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
