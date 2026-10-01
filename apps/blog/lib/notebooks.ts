import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Post } from '@/content/posts';
import { parseNotebook, savedOutputImage } from './notebook-format';

export type { NotebookCell, NotebookOutput } from './notebook-format';
// Only registered local notebooks are read; execution happens in the visitor's browser.
export function readNotebook(filename: Post['notebook']) {
  const notebook = parseNotebook(
    readFileSync(join(process.cwd(), 'public', 'notebooks', filename), 'utf8'),
    filename,
  );
  return notebook.cells;
}

export function notebookPreviewImage(filename: Post['notebook']): string | undefined {
  for (const cell of readNotebook(filename)) {
    for (const output of cell.outputs ?? []) {
      const image = savedOutputImage(output);
      if (image) return image;
    }
  }
}
