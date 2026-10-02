import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';
import { Notebook } from '@/components/notebook';
import { posts } from '@/content/posts';
import { readNotebook } from '@/lib/notebooks';
import { highlightNotebookSources } from '@/lib/notebook-highlight';
import { notebookDownloadUrl } from '@/lib/notebook-format';

export const dynamicParams = false;
export function generateStaticParams() {
  // Next.js 15's static exporter requires at least one dynamic-route parameter.
  // With an empty registry this reserved, invalid post slug resolves to notFound().
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: '__no-posts__' }];
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
  const notebook = readNotebook(post.notebook);
  const cells = notebook.cells;
  return (
    <SiteShell active="journal" mainClassName="container-prose">
      <Notebook
        header={
          <>
            <Link href="/blog/" className="journal-link">
              ← Back to the journal
            </Link>
            <p className="eyebrow text-fg-muted mt-8">
              {post.topic} / {post.label}
            </p>
            <h1 className="headline">{post.title}</h1>
            <p className="description">{post.description}</p>
            <div className="post-actions">
              <a href={notebookDownloadUrl(post.notebook)} download className="primary-link">
                Download Python notebook ↓
              </a>
            </div>
          </>
        }
        cells={cells}
        highlightedSources={highlightNotebookSources(cells)}
        figureAlt={post.previewImage?.alt}
        savedWidgetState={notebook.widgetState}
      />
    </SiteShell>
  );
}
