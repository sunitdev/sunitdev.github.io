import type { ReactNode } from 'react';
import { Nav } from './nav';
import { Footer } from './footer';

export function SiteShell({
  children,
  active,
  mainClassName,
}: {
  children: ReactNode;
  active?: 'journal';
  mainClassName?: string;
}) {
  return (
    <>
      <Nav active={active} />
      <main id="main" className={mainClassName}>
        {children}
      </main>
      <Footer />
    </>
  );
}
