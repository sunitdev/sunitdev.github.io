import { resolve } from 'node:path';
import { discoverPublishedNotebooks } from '../lib/notebook-catalog';

export type Post = {
  slug: string;
  title: string;
  description: string;
  topic: string;
  label: string;
  notebook: string;
  featured: boolean;
  previewImage?: { alt: string; caption: string };
};

// Both build scripts and Next run from apps/blog. A notebook explicitly opts into publication.
export const posts: Post[] = discoverPublishedNotebooks(resolve(process.cwd(), '../../notebooks'));
export const featuredPost: Post | undefined = posts.find((post) => post.featured) ?? posts[0];
