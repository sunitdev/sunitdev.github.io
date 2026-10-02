import {
  cellText,
  type NotebookCell,
  type NotebookOutput,
  type WidgetState,
} from './notebook-format';

export type RunRequest = {
  type: 'run';
  id: number;
  reset: boolean;
  cells: { index: number; source: string }[];
};

export function buildRunRequest(id: number, cells: NotebookCell[], index?: number): RunRequest {
  const reset = index === undefined;
  return {
    type: 'run',
    id,
    reset,
    cells: cells.flatMap((cell, cellIndex) =>
      cell.cell_type === 'code' && (reset || index === cellIndex)
        ? [{ index: cellIndex, source: cellText(cell.source) }]
        : [],
    ),
  };
}

export type WidgetRequest = {
  type: 'widget';
  id: number;
  modelId: string;
  data: Record<string, unknown>;
  buffers: number[][];
};

export type RunnerEvent = { id: number } & (
  | { type: 'loading' }
  | { type: 'clear-output'; index: number; wait: boolean }
  | { type: 'widgets'; state: WidgetState }
  | { type: 'cell-start'; index: number; executionCount: number }
  | { type: 'output'; index: number; output: NotebookOutput }
  | { type: 'cell-end'; index: number; success: boolean }
  | { type: 'done'; success: boolean }
  | { type: 'error'; message: string }
);

export type CellRun = {
  status: 'running' | 'completed' | 'error' | 'stopped' | 'previous';
  executionCount: number;
  outputs: NotebookOutput[];
};

export function appendOutput(outputs: NotebookOutput[], output: NotebookOutput): NotebookOutput[] {
  const last = outputs.at(-1);
  if (
    last?.output_type === 'stream' &&
    output.output_type === 'stream' &&
    last.name === output.name
  ) {
    const text = (value: NotebookOutput['text']) =>
      Array.isArray(value) ? value.join('') : (value ?? '');
    return [...outputs.slice(0, -1), { ...last, text: text(last.text) + text(output.text) }];
  }
  return [...outputs, output];
}
