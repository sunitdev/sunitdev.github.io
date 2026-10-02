/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';
import { Hero } from '@/components/hero';
import { featuredPost } from '@/content/posts';
import { notebookPreviewImage } from '@/lib/notebooks';

export default function Home() {
  const previewSrc = featuredPost?.previewImage
    ? notebookPreviewImage(featuredPost.notebook)
    : undefined;
  return (
    <SiteShell>
      <Hero />
      <div className="journal-container">
        {featuredPost && (
          <section className="featured" aria-labelledby="featured-title">
            <div>
              <div className="featured-labels">
                <span className="eyebrow">Featured essay</span>
                <span className="eyebrow text-accent">{featuredPost.topic}</span>
                <span className="eyebrow text-fg-muted">{featuredPost.label}</span>
              </div>
              <h2 id="featured-title" className="headline">
                <Link href={`/blog/${featuredPost.slug}/`}>{featuredPost.title}</Link>
              </h2>
              <p className="featured-description">{featuredPost.description}</p>
              <Link href={`/blog/${featuredPost.slug}/`} className="journal-link">
                Read the notebook ↗
              </Link>
            </div>
            {featuredPost.previewImage && previewSrc && (
              <figure className="featured-plot">
                <img
                  src={previewSrc}
                  alt={featuredPost.previewImage.alt}
                  className="plot-image plot-surface"
                  width="480"
                  height="480"
                />
                <figcaption className="plot-caption">
                  {featuredPost.previewImage.caption}
                </figcaption>
              </figure>
            )}
            <aside className="featured-aside">
              <h3>A simple simulation</h3>
              <p>
                Small experiments can reveal big ideas. Follow the explanation, inspect the Python,
                and try a variation of your own.
              </p>
            </aside>
          </section>
        )}
        <section id="about" className="about-journal" aria-labelledby="about-title">
          <div>
            <p className="eyebrow">About this space</p>
            <h2 id="about-title" className="headline">
              Follow the curiosity.
            </h2>
          </div>
          <p>
            I&apos;m Sunit. This is a place to learn out loud, follow curiosity, and share what I
            discover along the way. Some ideas become notes; others become experiments you can try
            for yourself.
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
