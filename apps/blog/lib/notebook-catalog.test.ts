import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { discoverPublishedNotebooks } from './notebook-catalog';

function document(slug: string, published = true) {
  return JSON.stringify({
    nbformat: 4,
    nbformat_minor: 5,
    cells: [],
    metadata: {
      journal: {
        published,
        slug,
        title: `Notebook ${slug}`,
        description: 'A new simulation',
        topic: 'Experiment',
        label: 'Notebook',
      },
    },
  });
}

test('new notebooks publish from notebook metadata alone; private notebooks and checkpoints stay private', () => {
  const root = mkdtempSync(join(tmpdir(), 'notebook-catalog-'));
  try {
    writeFileSync(join(root, 'first.ipynb'), document('first'));
    writeFileSync(join(root, 'private.ipynb'), document('private', false));
    mkdirSync(join(root, 'experiments'));
    writeFileSync(join(root, 'experiments', 'second.ipynb'), document('second'));
    mkdirSync(join(root, '.ipynb_checkpoints'));
    writeFileSync(join(root, '.ipynb_checkpoints', 'copy.ipynb'), document('first'));
    assert.deepEqual(
      discoverPublishedNotebooks(root).map((post) => [post.slug, post.notebook]),
      [
        ['second', 'experiments/second.ipynb'],
        ['first', 'first.ipynb'],
      ],
    );
    writeFileSync(join(root, 'duplicate.ipynb'), document('first'));
    assert.throws(() => discoverPublishedNotebooks(root), /invalid journal publication metadata/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
