'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import {
  modelBloomFilter,
  createBloom,
  bloomInsert,
  bloomQuery,
  type BloomState,
} from '@/lib/bloom-filter';
import { formatInt, formatPercent } from '@/lib/format';
import { ExplorableSlider } from '@/components/ui/slider';
import { MetricRow } from '@/components/ui/metric';
import { Callout } from '@/components/ui/callout';
import { BitArrayViz } from './bit-array-viz';

interface BloomUiState {
  bitArraySize: number;
  hashFunctions: number;
  insertedItems: number;
  query: string;
}

const defaults: BloomUiState = {
  bitArraySize: 256,
  hashFunctions: 4,
  insertedItems: 20,
  query: 'apple',
};

const SEED_ITEMS = [
  'apple',
  'banana',
  'cherry',
  'date',
  'elderberry',
  'fig',
  'grape',
  'honeydew',
  'kiwi',
  'lemon',
  'mango',
  'nectarine',
  'orange',
  'papaya',
  'quince',
  'raspberry',
  'strawberry',
  'tangerine',
  'ugli',
  'vanilla',
];

function buildState(ui: BloomUiState): { state: BloomState; lastPositions: number[] } {
  const state = createBloom(ui.bitArraySize);
  for (let i = 0; i < ui.insertedItems; i++) {
    const item = SEED_ITEMS[i % SEED_ITEMS.length] + (i >= SEED_ITEMS.length ? `-${Math.floor(i / SEED_ITEMS.length)}` : '');
    bloomInsert(state, item, ui.hashFunctions);
  }
  return { state, lastPositions: [] };
}

export function BloomFilterExplorable() {
  const [ui, setUi] = useState<BloomUiState>(defaults);

  const { state } = useMemo(
    () => buildState(ui),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ui.bitArraySize, ui.hashFunctions, ui.insertedItems],
  );

  const queryResult = useMemo(
    () => bloomQuery(state, ui.query, ui.hashFunctions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, ui.query, ui.hashFunctions],
  );

  const theoretical = useMemo(
    () =>
      modelBloomFilter({
        bitArraySize: ui.bitArraySize,
        hashFunctions: ui.hashFunctions,
        insertedItems: ui.insertedItems,
      }),
    [ui.bitArraySize, ui.hashFunctions, ui.insertedItems],
  );

  const isFalsePositive =
    queryResult.found && !state.inserted.includes(ui.query);

  return (
    <div className="space-y-7" data-explorable="bloom-filter">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
            01 · Bloom Filter
          </div>
          <h3 className="mt-1 text-xl font-semibold text-fg sm:text-2xl">
            A probabilistic "definitely-not" filter
          </h3>
        </div>
        <div className="hidden font-mono-tabular text-[11px] text-muted sm:block">
          space vs false-positive tradeoff
        </div>
      </header>

      <p className="text-[15px] leading-relaxed text-fg-muted">
        A Bloom filter says <em>"definitely not in the set"</em> or{' '}
        <em>"probably in the set"</em>. It uses k hash functions, a single bit
        array, and zero pointers — so it fits where a hash set wouldn't. The
        tradeoff: false positives. The sliders control everything.
      </p>

      <div className="grid gap-5 sm:grid-cols-3">
        <ExplorableSlider
          label="Bit array size"
          techLabel="m · bits"
          value={ui.bitArraySize}
          onChange={(v) => setUi((s) => ({ ...s, bitArraySize: Math.round(v) }))}
          min={32}
          max={1024}
          step={16}
          format={(v) => `${formatInt(v)} bits`}
        />
        <ExplorableSlider
          label="Hash functions"
          techLabel="k"
          value={ui.hashFunctions}
          onChange={(v) => setUi((s) => ({ ...s, hashFunctions: Math.round(v) }))}
          min={1}
          max={12}
          step={1}
          format={(v) => `${Math.round(v)} hashes`}
        />
        <ExplorableSlider
          label="Items inserted"
          techLabel="n"
          value={ui.insertedItems}
          onChange={(v) => setUi((s) => ({ ...s, insertedItems: Math.round(v) }))}
          min={1}
          max={200}
          step={1}
          format={(v) => `${Math.round(v)} items`}
        />
      </div>

      <BitArrayViz
        bits={state.bits}
        queryPositions={queryResult.positions}
        queryFound={queryResult.found}
      />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block space-y-1">
          <span className="font-mono-tabular text-[11px] uppercase tracking-wider text-muted">
            test a query
          </span>
          <input
            type="text"
            value={ui.query}
            onChange={(e) => setUi((s) => ({ ...s, query: e.target.value }))}
            className="w-full rounded-md border border-[color:var(--color-border)] bg-bg px-3 py-2 font-mono-tabular text-sm text-fg focus:border-accent focus:outline-none"
            placeholder="apple, banana, ..."
          />
        </label>
        <div className="flex items-end">
          <div
            className={`rounded-md border px-4 py-2 font-mono-tabular text-xs uppercase tracking-wider ${
              isFalsePositive
                ? 'border-[color:var(--color-signal-warn)] bg-[color:var(--color-signal-warn)]/10 text-[color:var(--color-signal-warn)]'
                : queryResult.found
                ? 'border-[color:var(--color-signal-ok)] bg-[color:var(--color-signal-ok)]/10 text-[color:var(--color-signal-ok)]'
                : 'border-[color:var(--color-signal-crit)] bg-[color:var(--color-signal-crit)]/10 text-[color:var(--color-signal-crit)]'
            }`}
          >
            {isFalsePositive
              ? 'false positive!'
              : queryResult.found
              ? 'probably in set'
              : 'definitely not in set'}
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <MetricRow
          label="Bits set"
          techLabel="m · fill"
          value={theoretical.bitsSet}
          format={(v) => `${formatInt(v)} / ${formatInt(ui.bitArraySize)}`}
          color="muted"
          bar={{ value: theoretical.estimatedFillRatio, max: 1 }}
        />
        <MetricRow
          label="False positive rate (theoretical)"
          techLabel="(1 − (1 − 1/m)^(kn))^k"
          value={theoretical.falsePositiveRate}
          format={(v) => formatPercent(v, 2)}
          color={theoretical.falsePositiveRate > 0.1 ? 'crit' : theoretical.falsePositiveRate > 0.01 ? 'warn' : 'ok'}
        />
        <MetricRow
          label="Memory used"
          techLabel="m / 8 bytes"
          value={theoretical.memoryBytes}
          format={(v) => `${formatInt(v)} B`}
          color="muted"
        />
        <MetricRow
          label="Optimal k for this m, n"
          techLabel="(m/n) · ln 2"
          value={theoretical.optimalHashFunctions}
          format={(v) => `${Math.round(v)} hashes`}
          color="muted"
        />
      </div>

      <p className="font-mono-tabular text-xs leading-relaxed text-muted">
        bloom never says "definitely yes" · k too low → many collisions, k too high → array saturates fast
      </p>

      <Callout>
        At Workday I worked with Grafana Mimir's bucket-index, which uses
        Bloom-filter-style pruning to skip irrelevant blocks during PromQL
        queries — querying long-range time series in S3 without scanning
        millions of blocks.
      </Callout>

      <p className="font-mono-tabular text-[11px] text-muted">
        live filter · same hash functions used in the bit array · query result reflects real bit lookups
      </p>
    </div>
  );
}
