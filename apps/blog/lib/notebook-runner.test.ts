import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { appendOutput } from './notebook-runner';
import {
  outputText,
  parseNotebook,
  savedOutputImage,
  type NotebookOutput,
} from './notebook-format';

test('stream fragments join without crossing stderr and figures', () => {
  let outputs: NotebookOutput[] = [];
  for (const text of ['Points: ', '10,000', '\n', 'Estimate: ', '3.126000', '\n']) {
    outputs = appendOutput(outputs, { output_type: 'stream', name: 'stdout', text });
  }
  assert.equal(outputs.length, 1);
  assert.equal(outputText(outputs[0]), 'Points: 10,000\nEstimate: 3.126000\n');
  const figure: NotebookOutput = {
    output_type: 'display_data',
    data: { 'image/svg+xml': '<svg/>' },
  };
  outputs = appendOutput(outputs, { output_type: 'stream', name: 'stderr', text: 'Warning\n' });
  outputs = appendOutput(outputs, figure);
  outputs = appendOutput(outputs, { output_type: 'stream', name: 'stdout', text: 'Done\n' });
  assert.equal(outputs.length, 4);
  assert.equal(outputs[2], figure);
});

test('SVG data URLs preserve Unicode and markup delimiters', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text>π # &amp; %</text></svg>';
  const image = savedOutputImage({ output_type: 'display_data', data: { 'image/svg+xml': [svg] } });
  assert.equal(decodeURIComponent(image!.split(',')[1]), svg);
  assert.equal(
    savedOutputImage({ output_type: 'display_data', data: { 'image/png': ['YWJj'] } }),
    'data:image/png;base64,YWJj',
  );
});

test('saved and live errors render text without terminal colours', () => {
  assert.equal(
    outputText({ output_type: 'error', ename: 'NameError', evalue: 'points is undefined' }),
    'NameError: points is undefined',
  );
  assert.equal(
    outputText({
      output_type: 'error',
      traceback: ['\u001b[31mTraceback\u001b[0m\n', 'NameError: points\n'],
    }),
    'Traceback\nNameError: points\n',
  );
});

test('published text and SVG parse, and malformed error details are rejected', () => {
  const notebook = parseNotebook(
    readFileSync(new URL('../../../notebooks/estimating-pi.ipynb', import.meta.url), 'utf8'),
    'π example',
  );
  const code = notebook.cells.filter((cell) => cell.cell_type === 'code');
  assert.equal(code.length, 3);
  assert.match(outputText(code[0].outputs![0]), /Estimate of pi: 3.126000/);
  assert.ok(savedOutputImage(code[1].outputs![0]));
  const malformed = structuredClone(notebook);
  malformed.cells.find((cell) => cell.cell_type === 'code')!.outputs![0].traceback = [
    12 as unknown as string,
  ];
  assert.throws(
    () => parseNotebook(JSON.stringify(malformed), 'broken'),
    /invalid stream name or error details/,
  );
});
