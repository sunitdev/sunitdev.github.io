import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <>
      <Nav />
      <section className="container-prose py-24">
        <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
          404 · not found
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-fg sm:text-4xl">
          That page isn't here.
        </h1>
        <p className="mt-3 text-fg-muted">
          Might have been moved or never existed.{' '}
          <Link href="/" className="text-accent underline underline-offset-4">
            Head home
          </Link>
          .
        </p>
      </section>
      <Footer />
    </>
  );
}
