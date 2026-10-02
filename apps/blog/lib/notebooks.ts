import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Post } from '@/content/posts';
import { notebookDownloadUrl, notebookWidgetState, parseNotebook } from './notebook-format';
import { findNotebookPreview } from './notebook-preview';

export type { NotebookCell, NotebookOutput } from './notebook-format';
// Only registered local notebooks are read; execution happens in the visitor's browser.
export function readNotebook(filename: Post['notebook']) {
  const notebook = parseNotebook(
    readFileSync(join(process.cwd(), 'public', 'notebooks', filename), 'utf8'),
    filename,
  );
  return { cells: notebook.cells, widgetState: notebookWidgetState(notebook.metadata) };
}

export function notebookPreviewImage(filename: Post['notebook']): string | undefined {
  const preview = findNotebookPreview(readNotebook(filename).cells);
  if (preview) return `${notebookDownloadUrl(filename)}.preview.${preview.extension}`;
}
