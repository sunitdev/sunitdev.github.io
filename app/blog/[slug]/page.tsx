import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { Notebook } from '@/components/notebook';
import { posts } from '@/content/posts';
import { readNotebook } from '@/lib/notebooks';

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  return post
    ? {
        title: post.title,
        description: post.description,
        alternates: { canonical: `/blog/${post.slug}/` },
      }
    : {};
}
export default async function Post({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);
  if (!post) notFound();
  return (
    <>
      <Nav active="journal" />
      <main id="main" className="container-prose">
        <header className="post-header">
          <Link href="/blog/" className="journal-link">
            ← Back to the journal
          </Link>
          <p className="eyebrow text-fg-muted mt-8">
            {post.topic} / {post.label}
          </p>
          <h1 className="headline">{post.title}</h1>
          <p className="description">{post.description}</p>
          <div className="post-actions">
            <a href={`/notebooks/${post.notebook}`} download className="primary-link">
              Download Python notebook ↓
            </a>
          </div>
          <p className="saved-note">
            These are saved Python results. Open the .ipynb in Jupyter to run the simulation, change
            a parameter, or explore your own variation.
          </p>
        </header>
        <Notebook cells={readNotebook(post.notebook)} figureAlt={post.previewImage?.alt} />
      </main>
      <Footer />
    </>
  );
}
