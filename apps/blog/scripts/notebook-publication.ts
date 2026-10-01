import { mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import type { Post } from '../content/posts';
import { parseNotebook } from '../lib/notebook-format';

function inside(root: string, path: string): boolean {
  const pathFromRoot = relative(root, path);
  return (
    pathFromRoot !== '' &&
    pathFromRoot !== '..' &&
    !pathFromRoot.startsWith(`..${sep}`) &&
    !isAbsolute(pathFromRoot)
  );
}

export async function prepareNotebooks({
  posts,
  sourceDirectory,
  outputDirectory,
}: {
  posts: Pick<Post, 'slug' | 'notebook'>[];
  sourceDirectory: string;
  outputDirectory: string;
}): Promise<string[]> {
  const sourceRoot = await realpath(sourceDirectory);
  const slugs = new Set<string>();
  const downloads = new Set<string>();
  const selected: { filename: string; bytes: Buffer }[] = [];

  // Read and validate every source before touching the last successful publication.
  for (const post of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
      throw new Error(`Invalid post slug: ${post.slug}`);
    }
    if (slugs.has(post.slug)) throw new Error(`Duplicate post slug: ${post.slug}`);
    slugs.add(post.slug);

    const filename = post.notebook;
    if (
      typeof filename !== 'string' ||
      !filename.endsWith('.ipynb') ||
      /[\\:\u0000]/.test(filename) ||
      filename.split('/').some((part) => part === '' || part === '.' || part === '..')
    ) {
      throw new Error(`Invalid notebook source path: ${filename}`);
    }
    const source = resolve(sourceRoot, filename);
    if (!inside(sourceRoot, source))
      throw new Error(`Notebook escapes source directory: ${filename}`);
    if (downloads.has(filename)) throw new Error(`Duplicate notebook download path: ${filename}`);
    downloads.add(filename);

    let bytes: Buffer;
    try {
      if (!inside(sourceRoot, await realpath(source))) {
        throw new Error('symlink target escapes the notebook source directory');
      }
      bytes = await readFile(source);
    } catch (error) {
      throw new Error(`Cannot read notebook ${filename}: ${(error as Error).message}`);
    }
    parseNotebook(bytes.toString('utf8'), filename);
    selected.push({ filename, bytes });
  }

  // This directory is generated and contains only the current explicit allowlist.
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  for (const { filename, bytes } of selected) {
    const target = resolve(outputDirectory, filename);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
  return selected.map(({ filename }) => filename);
}
