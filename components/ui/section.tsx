import * as React from 'react';

export function Section({
  id,
  eyebrow,
  title,
  children,
  className = '',
}: {
  id?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`container-prose py-16 ${className}`}>
      {(eyebrow || title) && (
        <header className="mb-8">
          {eyebrow && (
            <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="mt-2 text-2xl font-semibold text-fg sm:text-3xl">
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
