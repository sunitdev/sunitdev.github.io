import * as React from 'react';
import Link from 'next/link';

export function Callout({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  const body = (
    <div className="rounded-md border border-[color:var(--color-border)] bg-bg-elev px-4 py-3 text-sm leading-relaxed text-fg-muted transition-colors hover:border-accent hover:text-fg">
      <span className="mr-2 font-mono-tabular text-[10px] uppercase tracking-widest text-accent">
        in real life
      </span>
      {children}
      {href && <span className="ml-1 text-accent">↗</span>}
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
