export interface BloomConfig {
  bitArraySize: number;
  hashFunctions: number;
  insertedItems: number;
}

export interface BloomOutput {
  bitsSet: number;
  estimatedFillRatio: number;
  falsePositiveRate: number;
  optimalHashFunctions: number;
  memoryBytes: number;
  bitsPerItem: number;
}

export function modelBloomFilter(config: BloomConfig): BloomOutput {
  const { bitArraySize: m, hashFunctions: k, insertedItems: n } = config;

  const fillRatio = m > 0 ? 1 - Math.pow(1 - 1 / m, k * n) : 0;
  const bitsSet = Math.round(fillRatio * m);

  const falsePositiveRate = Math.pow(fillRatio, k);

  const optimalK = n > 0 ? Math.max(1, Math.round((m / n) * Math.LN2)) : 1;

  return {
    bitsSet,
    estimatedFillRatio: fillRatio,
    falsePositiveRate,
    optimalHashFunctions: optimalK,
    memoryBytes: Math.ceil(m / 8),
    bitsPerItem: n > 0 ? m / n : 0,
  };
}

function fnv1a(seed: number, value: string): number {
  let hash = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

export function bloomHashes(value: string, k: number, m: number): number[] {
  const h1 = fnv1a(0x9747b28c, value);
  const h2 = fnv1a(0x85ebca6b, value);
  const out: number[] = [];
  for (let i = 0; i < k; i++) {
    const combined = (h1 + i * h2 + i * i) >>> 0;
    out.push(combined % m);
  }
  return out;
}

export interface BloomState {
  bits: Uint8Array;
  inserted: string[];
}

export function createBloom(m: number): BloomState {
  return { bits: new Uint8Array(m), inserted: [] };
}

export function bloomInsert(state: BloomState, value: string, k: number): number[] {
  const positions = bloomHashes(value, k, state.bits.length);
  for (const p of positions) state.bits[p] = 1;
  state.inserted.push(value);
  return positions;
}

export function bloomQuery(
  state: BloomState,
  value: string,
  k: number,
): { found: boolean; positions: number[]; allSet: boolean } {
  const positions = bloomHashes(value, k, state.bits.length);
  const allSet = positions.every((p) => state.bits[p] === 1);
  return { found: allSet, positions, allSet };
}
