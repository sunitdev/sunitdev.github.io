import { describe, it, expect } from 'vitest';
import { createHnsw, insertHnsw, searchHnsw, bruteForceSearch, recall } from './hnsw';

function buildGraph(n: number, M = 6, ef = 40) {
  const g = createHnsw(M, ef);
  let seed = 1;
  for (let i = 0; i < n; i++) {
    seed = (seed * 16807) % 2147483647;
    const x = (seed % 1000) / 1000;
    seed = (seed * 16807) % 2147483647;
    const y = (seed % 1000) / 1000;
    insertHnsw(g, { x, y }, seed);
  }
  return g;
}

describe('HNSW', () => {
  it('returns k results', () => {
    const g = buildGraph(50);
    const r = searchHnsw(g, { x: 0.5, y: 0.5 }, 5, 20);
    expect(r.resultIds).toHaveLength(5);
  });

  it('higher ef gives better recall', () => {
    const g = buildGraph(200);
    const query = { x: 0.3, y: 0.7 };
    const truth = bruteForceSearch(g, query, 10);
    const lowEf = searchHnsw(g, query, 10, 10);
    const highEf = searchHnsw(g, query, 10, 100);
    expect(recall(highEf.resultIds, truth)).toBeGreaterThanOrEqual(recall(lowEf.resultIds, truth));
  });

  it('approximate search does fewer distance computations than brute force', () => {
    const g = buildGraph(300);
    const query = { x: 0.5, y: 0.5 };
    const r = searchHnsw(g, query, 10, 30);
    expect(r.totalDistanceComputations).toBeLessThan(300);
  });

  it('layers shrink upward', () => {
    const g = buildGraph(100);
    const layerCounts = new Map<number, number>();
    for (const n of g.nodes) {
      for (let l = 0; l <= n.maxLayer; l++) {
        layerCounts.set(l, (layerCounts.get(l) ?? 0) + 1);
      }
    }
    let prev = Infinity;
    for (const l of [...layerCounts.keys()].sort((a, b) => a - b)) {
      const c = layerCounts.get(l)!;
      expect(c).toBeLessThanOrEqual(prev);
      prev = c;
    }
  });
});
