export interface Vec2 {
  x: number;
  y: number;
}

export interface HnswNode {
  id: number;
  vec: Vec2;
  maxLayer: number;
  neighbors: number[][];
}

export interface HnswGraph {
  nodes: HnswNode[];
  entryPoint: number | null;
  M: number;
  efConstruction: number;
  mL: number;
}

export interface SearchStep {
  layer: number;
  visited: number;
  bestId: number;
  bestDist: number;
}

export interface SearchResult {
  resultIds: number[];
  steps: SearchStep[];
  totalDistanceComputations: number;
}

function dist(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function makeRng(seed: number) {
  let v = seed;
  return () => {
    v = (v * 1664525 + 1013904223) % 0xffffffff;
    return v / 0xffffffff;
  };
}

export function createHnsw(M: number, efConstruction: number, mL = 1 / Math.log(2)): HnswGraph {
  return { nodes: [], entryPoint: null, M, efConstruction, mL };
}

function pickLayer(mL: number, rand: () => number): number {
  return Math.floor(-Math.log(Math.max(rand(), 1e-9)) * mL);
}

function searchLayerInternal(
  graph: HnswGraph,
  query: Vec2,
  entry: number,
  ef: number,
  layer: number,
  computations: { n: number },
): number[] {
  const visited = new Set<number>([entry]);
  const candidates: { id: number; d: number }[] = [
    { id: entry, d: dist(query, graph.nodes[entry].vec) },
  ];
  computations.n += 1;
  const best: { id: number; d: number }[] = [...candidates];

  while (candidates.length > 0) {
    candidates.sort((a, b) => a.d - b.d);
    const cur = candidates.shift()!;
    best.sort((a, b) => b.d - a.d);
    const worstBest = best[0];
    if (best.length >= ef && cur.d > worstBest.d) break;
    const node = graph.nodes[cur.id];
    const neighbors = node.neighbors[layer] ?? [];
    for (const nId of neighbors) {
      if (visited.has(nId)) continue;
      visited.add(nId);
      const d = dist(query, graph.nodes[nId].vec);
      computations.n += 1;
      best.sort((a, b) => b.d - a.d);
      if (best.length < ef || d < (best[0]?.d ?? Infinity)) {
        candidates.push({ id: nId, d });
        best.push({ id: nId, d });
        if (best.length > ef) best.shift();
      }
    }
  }
  best.sort((a, b) => a.d - b.d);
  return best.map((b) => b.id);
}

function selectNeighbors(graph: HnswGraph, query: Vec2, candidates: number[], M: number): number[] {
  const scored = candidates.map((id) => ({ id, d: dist(query, graph.nodes[id].vec) }));
  scored.sort((a, b) => a.d - b.d);
  return scored.slice(0, M).map((s) => s.id);
}

export function insertHnsw(graph: HnswGraph, vec: Vec2, seed: number): HnswNode {
  const rand = makeRng(seed);
  const layer = pickLayer(graph.mL, rand);
  const id = graph.nodes.length;
  const node: HnswNode = {
    id,
    vec,
    maxLayer: layer,
    neighbors: Array.from({ length: layer + 1 }, () => []),
  };
  graph.nodes.push(node);

  if (graph.entryPoint === null) {
    graph.entryPoint = id;
    return node;
  }

  let entry = graph.entryPoint;
  const entryNode = graph.nodes[entry];

  for (let lc = entryNode.maxLayer; lc > layer; lc--) {
    const w = searchLayerInternal(graph, vec, entry, 1, lc, { n: 0 });
    if (w[0] != null) entry = w[0];
  }

  for (let lc = Math.min(entryNode.maxLayer, layer); lc >= 0; lc--) {
    const candidates = searchLayerInternal(graph, vec, entry, graph.efConstruction, lc, { n: 0 });
    const neighborIds = selectNeighbors(graph, vec, candidates, graph.M);
    node.neighbors[lc] = neighborIds;
    for (const nId of neighborIds) {
      const nNode = graph.nodes[nId];
      if (!nNode.neighbors[lc]) nNode.neighbors[lc] = [];
      nNode.neighbors[lc].push(id);
      if (nNode.neighbors[lc].length > graph.M) {
        nNode.neighbors[lc] = selectNeighbors(graph, nNode.vec, nNode.neighbors[lc], graph.M);
      }
    }
    if (candidates[0] != null) entry = candidates[0];
  }

  if (layer > entryNode.maxLayer) graph.entryPoint = id;
  return node;
}

export function searchHnsw(graph: HnswGraph, query: Vec2, k: number, ef: number): SearchResult {
  const steps: SearchStep[] = [];
  if (graph.entryPoint === null) return { resultIds: [], steps, totalDistanceComputations: 0 };

  let entry = graph.entryPoint;
  const computations = { n: 0 };

  for (let lc = graph.nodes[entry].maxLayer; lc > 0; lc--) {
    const w = searchLayerInternal(graph, query, entry, 1, lc, computations);
    if (w[0] != null) entry = w[0];
    steps.push({ layer: lc, visited: w.length, bestId: entry, bestDist: dist(query, graph.nodes[entry].vec) });
  }

  const final = searchLayerInternal(graph, query, entry, Math.max(ef, k), 0, computations);
  if (final[0] != null) {
    steps.push({ layer: 0, visited: final.length, bestId: final[0], bestDist: dist(query, graph.nodes[final[0]].vec) });
  }

  return { resultIds: final.slice(0, k), steps, totalDistanceComputations: computations.n };
}

export function bruteForceSearch(graph: HnswGraph, query: Vec2, k: number): number[] {
  return graph.nodes
    .map((n) => ({ id: n.id, d: dist(query, n.vec) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((s) => s.id);
}

export function recall(approx: number[], truth: number[]): number {
  if (truth.length === 0) return 1;
  const truthSet = new Set(truth);
  let hits = 0;
  for (const id of approx) if (truthSet.has(id)) hits++;
  return hits / truth.length;
}
