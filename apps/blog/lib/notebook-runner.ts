import type { NotebookOutput } from './notebook-format';

export type RunRequest = {
  type: 'run';
  id: number;
  reset: boolean;
  cells: { index: number; source: string }[];
};

export type RunnerEvent = { id: number } & (
  | { type: 'loading' }
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
