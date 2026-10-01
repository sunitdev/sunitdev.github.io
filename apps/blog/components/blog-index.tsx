/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { posts, type Post } from '@/content/posts';
import { notebookPreviewImage } from '@/lib/notebooks';

function EssayRow({ post, number }: { post: Post; number: number }) {
  const previewSrc = post.previewImage ? notebookPreviewImage(post.notebook) : undefined;
  return (
    <article className="essay-row">
      <span className="eyebrow text-fg-muted">{String(number).padStart(2, '0')}</span>
      <div>
        <p className="eyebrow text-fg-muted">
          Essay <span className="text-accent">/ {post.topic}</span> · {post.label}
        </p>
        <div className="row-link">
          <h2 className="headline">
            <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
          </h2>
          <Link
            href={`/blog/${post.slug}/`}
            className="row-arrow"
            aria-label={`Read ${post.title}`}
          >
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p>{post.description}</p>
      </div>
      {post.previewImage && previewSrc && (
        <figure>
          <Link href={`/blog/${post.slug}/`} tabIndex={-1} aria-hidden="true">
            <img src={previewSrc} alt="" className="plot-image plot-surface" loading="lazy" />
          </Link>
          <figcaption className="plot-caption">{post.previewImage.caption}</figcaption>
        </figure>
      )}
    </article>
  );
}

export function BlogIndex() {
  return (
    <div className="blog-index">
      {posts.length === 0 && <p className="text-fg-muted">No published notebooks yet.</p>}
      {posts.map((post, index) => (
        <EssayRow key={post.slug} post={post} number={index + 1} />
      ))}
    </div>
  );
}
