import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appendOutput, buildRunRequest } from './notebook-runner';
import { prepareNotebooks } from '../scripts/notebook-publication';
import {
  outputText,
  parseNotebook,
  notebookWidgetState,
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
  assert.equal(code.length, 4);
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

test('every notebook code cell runs unchanged, including widget definitions', () => {
  const notebook = parseNotebook(
    readFileSync(new URL('../../../notebooks/estimating-pi.ipynb', import.meta.url), 'utf8'),
    'π',
  );
  const request = buildRunRequest(9, notebook.cells);
  assert.equal(request.reset, true);
  assert.deepEqual(
    request.cells.map((cell) => cell.index),
    [1, 3, 5, 6],
  );
  assert.match(request.cells.at(-1)!.source, /import ipywidgets/);
  assert.equal('parameters' in request, false);
  const single = buildRunRequest(10, notebook.cells, 6);
  assert.equal(single.reset, false);
  assert.equal(single.cells[0].source, request.cells.at(-1)!.source);
});

test('widget view and state survive parsing, malformed views and tags fail validation', () => {
  const notebook = parseNotebook(
    readFileSync(new URL('../../../notebooks/estimating-pi.ipynb', import.meta.url), 'utf8'),
    'π',
  );
  assert.ok(notebookWidgetState(notebook.metadata));
  const widget =
    notebook.cells.at(-1)!.outputs![0].data!['application/vnd.jupyter.widget-view+json']!;
  assert.ok(notebookWidgetState(notebook.metadata)!.state[widget.model_id]);
  assert.ok(widget.model_id);
  notebook.cells[0].metadata = { tags: [123 as unknown as string] };
  assert.throws(() => parseNotebook(JSON.stringify(notebook), 'bad tags'), /invalid metadata tags/);
  notebook.cells[0].metadata = {};
  widget.model_id = 123 as unknown as string;
  assert.throws(() => parseNotebook(JSON.stringify(notebook), 'bad view'), /invalid widget view/);
  assert.throws(
    () =>
      notebookWidgetState({
        widgets: { 'application/vnd.jupyter.widget-state+json': { version_major: 2, state: [] } },
      }),
    /Invalid notebook widget state/,
  );
});

test('publication preserves Jupyter controls in the downloadable notebook', async () => {
  const outputDirectory = await mkdtemp(join(tmpdir(), 'pi-publication-'));
  try {
    await prepareNotebooks({
      posts: [{ slug: 'estimating-pi', notebook: 'estimating-pi.ipynb' }],
      sourceDirectory: fileURLToPath(new URL('../../../notebooks', import.meta.url)),
      outputDirectory,
    });
    const source = readFileSync(
      new URL('../../../notebooks/estimating-pi.ipynb', import.meta.url),
      'utf8',
    );
    const published = await readFile(join(outputDirectory, 'estimating-pi.ipynb'), 'utf8');
    assert.equal(published, source);
    assert.ok(notebookWidgetState(parseNotebook(published, 'download').metadata));
  } finally {
    await rm(outputDirectory, { recursive: true, force: true });
  }
});
