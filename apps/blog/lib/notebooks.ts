import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Post } from '@/content/posts';
import { parseNotebook, type NotebookOutput } from './notebook-format';

export type { NotebookCell, NotebookOutput } from './notebook-format';
export function cellText(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value.join('') : (value ?? '');
}
// Only registered local notebooks are read; cells are displayed, never executed by Next.js.
export function readNotebook(filename: Post['notebook']) {
  const notebook = parseNotebook(
    readFileSync(join(process.cwd(), 'public', 'notebooks', filename), 'utf8'),
    filename,
  );
  return notebook.cells;
}

export function savedOutputImage(output: NotebookOutput): string | undefined {
  if (output.data?.['image/svg+xml']) {
    return `data:image/svg+xml;base64,${Buffer.from(cellText(output.data['image/svg+xml'])).toString('base64')}`;
  }
  if (output.data?.['image/png']) {
    return `data:image/png;base64,${cellText(output.data['image/png'])}`;
  }
}

export function notebookPreviewImage(filename: Post['notebook']): string | undefined {
  for (const cell of readNotebook(filename)) {
    for (const output of cell.outputs ?? []) {
      const image = savedOutputImage(output);
      if (image) return image;
    }
  }
}
