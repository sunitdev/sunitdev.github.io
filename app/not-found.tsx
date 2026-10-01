import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="container-prose py-24">
        <div className="font-mono-tabular text-fg-muted text-[11px] tracking-widest uppercase">
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
      </main>
      <Footer />
    </>
  );
}
