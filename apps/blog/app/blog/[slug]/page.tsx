import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { Notebook } from '@/components/notebook';
import { posts } from '@/content/posts';
import { readNotebook } from '@/lib/notebooks';
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
            <a href={notebookDownloadUrl(post.notebook)} download className="primary-link">
              Download Python notebook ↓
            </a>
          </div>
          <p className="saved-note">
            These are saved Python results. To run the downloaded notebook in the project
            environment, clone{' '}
            <a href="https://github.com/sunitdev/sunitdev.github.io" className="journal-link">
              this repository
            </a>
            , run <code>make notebook</code>, and open JupyterLab at <code>localhost:8888</code>{' '}
            using the token shown in the logs. Run <code>make</code> to see the other Docker
            commands.
          </p>
        </header>
        <Notebook cells={readNotebook(post.notebook)} figureAlt={post.previewImage?.alt} />
      </main>
      <Footer />
    </>
  );
}
