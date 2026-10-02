import type { HTMLManager } from '@jupyter-widgets/html-manager';

export type WidgetState = Parameters<HTMLManager['set_state']>[0];

export type NotebookText = string | string[];
export type NotebookOutput = {
  output_type: string;
  name?: string;
  ename?: string;
  evalue?: string;
  traceback?: string[];
  text?: NotebookText;
  data?: {
    'application/vnd.jupyter.widget-view+json'?: {
      model_id: string;
      version_major: number;
      version_minor: number;
    };
    'image/svg+xml'?: NotebookText;
    'image/png'?: NotebookText;
    'text/plain'?: NotebookText;
    [mime: string]: unknown;
  };
};
export type NotebookCell = {
  cell_type: 'markdown' | 'code' | 'raw';
  source: NotebookText;
  metadata?: { tags?: string[]; [key: string]: unknown };
  execution_count?: number | null;
  outputs?: NotebookOutput[];
};
export type NotebookDocument = {
  nbformat: number;
  nbformat_minor: number;
  metadata: Record<string, unknown>;
  cells: NotebookCell[];
};

export function cellText(value: NotebookText | undefined): string {
  return Array.isArray(value) ? value.join('') : (value ?? '');
}

export function savedOutputImage(output: NotebookOutput): string | undefined {
  if (output.data?.['image/svg+xml']) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cellText(output.data['image/svg+xml']))}`;
  }
  if (output.data?.['image/png']) {
    return `data:image/png;base64,${cellText(output.data['image/png'])}`;
  }
}

export function outputText(output: NotebookOutput): string {
  const text =
    output.output_type === 'error'
      ? output.traceback?.map((line) => (line.endsWith('\n') ? line : `${line}\n`)).join('') ||
        `${output.ename ?? 'Python error'}: ${output.evalue ?? ''}`
      : cellText(output.text ?? output.data?.['text/plain']);
  // IPython tracebacks in saved notebooks can contain terminal colour escapes.
  return text.replace(/\u001b\[[0-9;]*m/g, '');
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function notebookText(value: unknown): value is NotebookText {
  return (
    typeof value === 'string' ||
    (Array.isArray(value) && value.every((part) => typeof part === 'string'))
  );
}

// Validate the format and the fields consumed by the lightweight renderer.
// Ordinary cell outputs display text, PNG, SVG, and standard Jupyter widget views.
export function parseNotebook(text: string, label: string): NotebookDocument {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(`${label}: invalid notebook JSON`);
  }
  const invalid = (detail: string): never => {
    throw new Error(`${label}: malformed notebook (${detail})`);
  };
  if (!record(value)) return invalid('expected an object');
  if (
    value.nbformat !== 4 ||
    !Number.isInteger(value.nbformat_minor) ||
    (value.nbformat_minor as number) < 0 ||
    !record(value.metadata) ||
    !Array.isArray(value.cells)
  ) {
    return invalid('expected nbformat 4, metadata, and cells');
  }
  notebookWidgetState(value.metadata);
  for (const [index, cell] of value.cells.entries()) {
    if (
      !record(cell) ||
      !['markdown', 'code', 'raw'].includes(cell.cell_type as string) ||
      !notebookText(cell.source) ||
      !record(cell.metadata)
    ) {
      return invalid(`cell ${index}: invalid type, source, or metadata`);
    }
    if (
      cell.metadata.tags !== undefined &&
      (!Array.isArray(cell.metadata.tags) ||
        !cell.metadata.tags.every((tag) => typeof tag === 'string'))
    ) {
      return invalid(`cell ${index}: invalid metadata tags`);
    }
    if (cell.cell_type !== 'code') continue;
    if (
      !Array.isArray(cell.outputs) ||
      (cell.execution_count !== null &&
        (!Number.isInteger(cell.execution_count) || (cell.execution_count as number) < 0))
    ) {
      return invalid(`cell ${index}: invalid outputs or execution count`);
    }
    for (const output of cell.outputs) {
      if (
        !record(output) ||
        !['stream', 'display_data', 'execute_result', 'error'].includes(
          output.output_type as string,
        )
      ) {
        return invalid(`cell ${index}: invalid output type`);
      }
      if (output.text !== undefined && !notebookText(output.text)) {
        return invalid(`cell ${index}: invalid output text`);
      }
      if (
        (output.name !== undefined && typeof output.name !== 'string') ||
        (output.ename !== undefined && typeof output.ename !== 'string') ||
        (output.evalue !== undefined && typeof output.evalue !== 'string') ||
        (output.traceback !== undefined &&
          (!Array.isArray(output.traceback) ||
            !output.traceback.every((line) => typeof line === 'string')))
      ) {
        return invalid(`cell ${index}: invalid stream name or error details`);
      }
      if (output.output_type === 'stream' && !notebookText(output.text)) {
        return invalid(`cell ${index}: missing stream text`);
      }
      if (
        ['display_data', 'execute_result'].includes(output.output_type as string) &&
        !record(output.data)
      ) {
        return invalid(`cell ${index}: missing MIME output data`);
      }
      if (output.data !== undefined) {
        if (!record(output.data)) return invalid(`cell ${index}: invalid MIME output data`);
        const widget = output.data['application/vnd.jupyter.widget-view+json'];
        if (
          widget !== undefined &&
          (!record(widget) ||
            typeof widget.model_id !== 'string' ||
            widget.version_major !== 2 ||
            !Number.isInteger(widget.version_minor))
        ) {
          return invalid(`cell ${index}: invalid widget view`);
        }
        for (const mime of ['text/plain', 'image/png', 'image/svg+xml']) {
          if (output.data[mime] !== undefined && !notebookText(output.data[mime])) {
            return invalid(`cell ${index}: invalid ${mime} output`);
          }
        }
      }
    }
  }
  return value as NotebookDocument;
}

export function notebookDownloadUrl(filename: string): string {
  return `/notebooks/${filename.split('/').map(encodeURIComponent).join('/')}`;
}

export function notebookWidgetState(metadata: Record<string, unknown>): WidgetState | undefined {
  const widgets = metadata.widgets;
  if (!record(widgets)) return;
  const state = widgets['application/vnd.jupyter.widget-state+json'];
  if (state === undefined) return;
  if (
    !record(state) ||
    state.version_major !== 2 ||
    !Number.isInteger(state.version_minor) ||
    !record(state.state)
  ) {
    throw new Error('Invalid notebook widget state');
  }
  for (const model of Object.values(state.state)) {
    if (
      !record(model) ||
      typeof model.model_name !== 'string' ||
      typeof model.model_module !== 'string' ||
      typeof model.model_module_version !== 'string' ||
      !record(model.state)
    ) {
      throw new Error('Invalid notebook widget model');
    }
  }
  return state as unknown as WidgetState;
}
