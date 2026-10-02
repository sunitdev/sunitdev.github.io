import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Post } from '../content/posts';
import { parseNotebook } from './notebook-format';

export function discoverPublishedNotebooks(sourceDirectory: string): Post[] {
  const posts: Post[] = [];
  const slugs = new Set<string>();
  function visit(directory: string, prefix = '') {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      if (entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
      const filename = `${prefix}${entry.name}`;
      if (entry.isDirectory()) {
        visit(join(directory, entry.name), `${filename}/`);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.ipynb')) continue;
      // Private notebooks need not conform to the website's publication format.
      const raw = JSON.parse(readFileSync(join(directory, entry.name), 'utf8'));
      const journal = raw.metadata?.journal;
      if (journal?.published !== true) continue;
      parseNotebook(JSON.stringify(raw), filename);
      const invalid = () => {
        throw new Error(`${filename}: invalid journal publication metadata`);
      };
      for (const field of ['slug', 'title', 'description', 'topic', 'label']) {
        if (typeof journal[field] !== 'string' || !journal[field].trim()) invalid();
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(journal.slug) || slugs.has(journal.slug)) invalid();
      if (journal.featured !== undefined && typeof journal.featured !== 'boolean') invalid();
      const preview = journal.previewImage;
      if (
        preview !== undefined &&
        (!preview || typeof preview.alt !== 'string' || typeof preview.caption !== 'string')
      )
        invalid();
      slugs.add(journal.slug);
      posts.push({
        slug: journal.slug,
        title: journal.title,
        description: journal.description,
        topic: journal.topic,
        label: journal.label,
        featured: journal.featured ?? false,
        notebook: filename,
        ...(preview ? { previewImage: preview } : {}),
      });
    }
  }
  visit(sourceDirectory);
  return posts;
}
