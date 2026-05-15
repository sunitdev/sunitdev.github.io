'use client';

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createHnsw,
  insertHnsw,
  searchHnsw,
  bruteForceSearch,
  recall,
  type HnswGraph,
  type Vec2,
} from '@/lib/hnsw';
import { formatInt, formatPercent } from '@/lib/format';
import { ExplorableSlider } from '@/components/ui/slider';
import { MetricRow } from '@/components/ui/metric';
import { Callout } from '@/components/ui/callout';
import { GraphCanvas } from './graph-canvas';

interface UiState {
  numPoints: number;
  M: number;
  ef: number;
  k: number;
  query: Vec2;
}

const defaults: UiState = {
  numPoints: 80,
  M: 6,
  ef: 30,
  k: 5,
  query: { x: 0.5, y: 0.5 },
};

function buildGraph(numPoints: number, M: number): HnswGraph {
  const g = createHnsw(M, 40);
  let s = 31415;
  for (let i = 0; i < numPoints; i++) {
    s = (s * 16807) % 2147483647;
    const x = (s % 1000) / 1000;
    s = (s * 16807) % 2147483647;
    const y = (s % 1000) / 1000;
    insertHnsw(g, { x, y }, s);
  }
  return g;
}

export function HnswExplorable() {
  const [ui, setUi] = useState<UiState>(defaults);
  const graphRef = useRef<HnswGraph>(buildGraph(defaults.numPoints, defaults.M));

  useEffect(() => {
    graphRef.current = buildGraph(ui.numPoints, ui.M);
  }, [ui.numPoints, ui.M]);

  const searchResult = useMemo(
    () => searchHnsw(graphRef.current, ui.query, ui.k, ui.ef),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ui.query, ui.k, ui.ef, ui.numPoints, ui.M],
  );

  const truth = useMemo(
    () => bruteForceSearch(graphRef.current, ui.query, ui.k),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ui.query, ui.k, ui.numPoints, ui.M],
  );

  const searchRecall = recall(searchResult.resultIds, truth);
  const speedup = ui.numPoints / Math.max(searchResult.totalDistanceComputations, 1);

  return (
    <div className="space-y-7" data-explorable="hnsw">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
            04 · HNSW vector search
          </div>
          <h3 className="mt-1 text-xl font-semibold text-fg sm:text-2xl">
            Approximate nearest neighbors via a navigable graph
          </h3>
        </div>
        <div className="hidden font-mono-tabular text-[11px] text-muted sm:block">
          hierarchical small-world
        </div>
      </header>

      <p className="text-[15px] leading-relaxed text-fg-muted">
        Modern vector retrieval — embedding search underneath every LLM-powered
        system — uses graph indexes rather than scanning every point. HNSW
        builds a hierarchy: a sparse top layer for big jumps, dense bottom
        layer for fine search. Click anywhere to fire a query. Watch the
        traversal hop through layers and bottom-out at the k nearest.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ExplorableSlider
          label="Points indexed"
          techLabel="dataset size"
          value={ui.numPoints}
          onChange={(v) => setUi((s) => ({ ...s, numPoints: Math.round(v) }))}
          min={20}
          max={300}
          step={10}
          format={(v) => `${formatInt(v)} vecs`}
        />
        <ExplorableSlider
          label="M"
          techLabel="neighbors / layer"
          value={ui.M}
          onChange={(v) => setUi((s) => ({ ...s, M: Math.round(v) }))}
          min={2}
          max={16}
          step={1}
          format={(v) => `${Math.round(v)} neighbors`}
        />
        <ExplorableSlider
          label="ef (search)"
          techLabel="candidates explored"
          value={ui.ef}
          onChange={(v) => setUi((s) => ({ ...s, ef: Math.round(v) }))}
          min={1}
          max={100}
          step={1}
          format={(v) => `${Math.round(v)} probes`}
        />
        <ExplorableSlider
          label="k results"
          techLabel="nearest neighbors returned"
          value={ui.k}
          onChange={(v) => setUi((s) => ({ ...s, k: Math.round(v) }))}
          min={1}
          max={20}
          step={1}
          format={(v) => `${Math.round(v)}`}
        />
      </div>

      <GraphCanvas
        graph={graphRef.current}
        query={ui.query}
        onQueryChange={(q) => setUi((s) => ({ ...s, query: q }))}
        resultIds={searchResult.resultIds}
        searchSteps={searchResult.steps}
        truth={truth}
      />

      <div className="grid gap-2">
        <MetricRow
          label="Recall@k vs brute-force truth"
          techLabel="how many true neighbors we found"
          value={searchRecall}
          format={(v) => formatPercent(v, 0)}
          color={searchRecall > 0.95 ? 'ok' : searchRecall > 0.7 ? 'warn' : 'crit'}
          bar={{ value: searchRecall, max: 1 }}
        />
        <MetricRow
          label="Distance computations"
          techLabel="HNSW probes vs brute force"
          value={searchResult.totalDistanceComputations}
          format={(v) => `${formatInt(v)} / ${formatInt(ui.numPoints)} (brute force)`}
          color="muted"
        />
        <MetricRow
          label="Speedup over brute force"
          techLabel="dataset / probes"
          value={speedup}
          format={(v) => `${v.toFixed(1)}×`}
          color={speedup > 5 ? 'ok' : speedup > 2 ? 'warn' : 'muted'}
        />
        <MetricRow
          label="Layers traversed"
          techLabel="hierarchy depth"
          value={searchResult.steps.length}
          format={(v) => `${Math.round(v)}`}
          color="muted"
        />
      </div>

      <p className="font-mono-tabular text-xs leading-relaxed text-muted">
        higher ef → better recall but more probes · drop ef and watch recall fall · M trades index build cost for query speed
      </p>

      <Callout>
        Vector search is the substrate underneath any embedding-based system.
        At Reddit, the LLM classification pipeline I built used Google Gemini
        for semantic understanding of community metadata; the same kind of
        embedding-based retrieval would power related-community discovery and
        candidate generation in the ranking stack.
      </Callout>

      <p className="font-mono-tabular text-[11px] text-muted">
        live HNSW · real graph build + greedy traversal · recall computed against an actual brute-force baseline
      </p>
    </div>
  );
}
