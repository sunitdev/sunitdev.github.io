import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';

export default function NotFound() {
  return (
    <SiteShell mainClassName="container-prose py-24">
      <div className="font-mono-tabular text-fg-muted text-[11px] uppercase tracking-widest">
        404 · not found
      </div>
      <h1 className="headline mt-5 text-5xl sm:text-7xl">That page isn't here.</h1>
      <p className="text-fg-muted mt-3">
        Might have been moved or never existed.{' '}
        <Link href="/" className="text-accent underline underline-offset-4">
          Head home
        </Link>
        .
      </p>
    </SiteShell>
  );
}
