import type { Metadata } from 'next';
import { SiteShell } from '@/components/site-shell';
import { BlogIndex } from '@/components/blog-index';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Notes on learning, exploration, and ideas understood through hands-on experiments.',
  alternates: { canonical: '/blog/' },
};

export default function Blog() {
  return (
    <SiteShell active="journal" mainClassName="journal-container">
      <header className="index-header">
        <div className="eyebrow">The journal / ideas in progress</div>
        <h1 className="headline">
          Notes from the
          <br />
          rabbit hole<span className="text-accent">.</span>
        </h1>
        <p>
          A growing collection of things I’m learning and questions I’m exploring. Read along, try
          an experiment, and follow your own curiosity.
        </p>
      </header>
      <BlogIndex />
    </SiteShell>
  );
}
