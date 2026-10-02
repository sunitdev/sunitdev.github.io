import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { prepareNotebooks } from '../scripts/notebook-publication';
import { notebookDownloadUrl, type NotebookOutput } from './notebook-format';
import { findNotebookPreview } from './notebook-preview';

test('publication extracts previews, preserves downloads, and removes obsolete assets', async () => {
  const root = await mkdtemp(join(tmpdir(), 'notebook-previews-'));
  const sourceDirectory = join(root, 'source');
  const outputDirectory = join(root, 'public', 'notebooks');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text>π # &amp; %</text></svg>';
  const png = Buffer.from('iVBORw0KGgo=', 'base64');
  const fixtures: [string, NotebookOutput[]][] = [
    [
      'nested/π plot.ipynb',
      [{ output_type: 'display_data', data: { 'image/svg+xml': [svg], 'image/png': 'YWJj' } }],
    ],
    [
      'png.ipynb',
      [{ output_type: 'display_data', data: { 'image/png': [png.toString('base64')] } }],
    ],
    ['text.ipynb', [{ output_type: 'stream', name: 'stdout', text: 'No image' }]],
  ];
  try {
    await mkdir(join(sourceDirectory, 'nested'), { recursive: true });
    for (const [filename, outputs] of fixtures) {
      await writeFile(
        join(sourceDirectory, filename),
        JSON.stringify({
          nbformat: 4,
          nbformat_minor: 5,
          metadata: {},
          cells: [{ cell_type: 'code', source: '', metadata: {}, execution_count: 1, outputs }],
        }),
      );
    }
    const posts = fixtures.map(([notebook], index) => ({ slug: `post-${index}`, notebook }));
    assert.deepEqual(
      await prepareNotebooks({ posts, sourceDirectory, outputDirectory }),
      fixtures.map(([filename]) => filename),
    );
    for (const [filename] of fixtures) {
      assert.deepEqual(
        await readFile(join(outputDirectory, filename)),
        await readFile(join(sourceDirectory, filename)),
      );
    }
    assert.equal(
      await readFile(join(outputDirectory, 'nested/π plot.ipynb.preview.svg'), 'utf8'),
      svg,
    );
    assert.deepEqual(await readFile(join(outputDirectory, 'png.ipynb.preview.png')), png);
    assert.deepEqual((await readdir(join(outputDirectory, 'nested'))).sort(), [
      'π plot.ipynb',
      'π plot.ipynb.preview.svg',
    ]);
    assert.deepEqual((await readdir(outputDirectory)).sort(), [
      'nested',
      'png.ipynb',
      'png.ipynb.preview.png',
      'text.ipynb',
    ]);
    assert.equal(
      notebookDownloadUrl('nested/π plot.ipynb.preview.svg'),
      '/notebooks/nested/%CF%80%20plot.ipynb.preview.svg',
    );
    const { stdout } = await promisify(execFile)(
      process.execPath,
      [
        '-e',
        `import { notebookPreviewImage } from ${JSON.stringify(fileURLToPath(new URL('./notebooks.ts', import.meta.url)))};
        console.log(JSON.stringify(${JSON.stringify(fixtures.map(([filename]) => filename))}.map(notebookPreviewImage)));`,
      ],
      { cwd: root },
    );
    assert.deepEqual(JSON.parse(stdout), [
      '/notebooks/nested/%CF%80%20plot.ipynb.preview.svg',
      '/notebooks/png.ipynb.preview.png',
      null,
    ]);
    await writeFile(join(sourceDirectory, 'broken.ipynb'), '{');
    await assert.rejects(
      prepareNotebooks({
        posts: [{ slug: 'broken', notebook: 'broken.ipynb' }],
        sourceDirectory,
        outputDirectory,
      }),
      /invalid notebook JSON/,
    );
    assert.equal(
      await readFile(join(outputDirectory, 'nested/π plot.ipynb.preview.svg'), 'utf8'),
      svg,
    );
    await prepareNotebooks({ posts: [posts[2]], sourceDirectory, outputDirectory });
    assert.deepEqual(await readdir(outputDirectory), ['text.ipynb']);
    await prepareNotebooks({ posts: [], sourceDirectory, outputDirectory });
    assert.deepEqual(await readdir(outputDirectory), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('preview selection keeps the first image and returns nothing without images', () => {
  assert.equal(findNotebookPreview([]), undefined);
  assert.equal(findNotebookPreview([{ cell_type: 'markdown', source: 'Text' }]), undefined);
  assert.deepEqual(
    findNotebookPreview([
      {
        cell_type: 'code',
        source: '',
        outputs: [
          { output_type: 'stream', name: 'stdout', text: 'before image' },
          { output_type: 'display_data', data: { 'image/png': 'YWJj' } },
          { output_type: 'display_data', data: { 'image/svg+xml': '<svg/>' } },
        ],
      },
    ]),
    { extension: 'png', content: 'YWJj' },
  );
});
