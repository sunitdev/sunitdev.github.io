import { cellText, type NotebookCell } from './notebook-format';

export function findNotebookPreview(
  cells: NotebookCell[],
): { extension: 'svg' | 'png'; content: string } | undefined {
  for (const cell of cells) {
    for (const output of cell.outputs ?? []) {
      if (output.data?.['image/svg+xml']) {
        return { extension: 'svg', content: cellText(output.data['image/svg+xml']) };
      }
      if (output.data?.['image/png']) {
        return { extension: 'png', content: cellText(output.data['image/png']) };
      }
    }
  }
}
