import { describe, it, expect } from 'vitest';
import {
  modelBloomFilter,
  bloomHashes,
  createBloom,
  bloomInsert,
  bloomQuery,
} from './bloom-filter';

describe('modelBloomFilter', () => {
  it('FP rate increases as inserts grow', () => {
    const low = modelBloomFilter({ bitArraySize: 1000, hashFunctions: 5, insertedItems: 50 });
    const high = modelBloomFilter({ bitArraySize: 1000, hashFunctions: 5, insertedItems: 500 });
    expect(high.falsePositiveRate).toBeGreaterThan(low.falsePositiveRate);
  });

  it('larger bit array reduces FP rate', () => {
    const small = modelBloomFilter({ bitArraySize: 500, hashFunctions: 5, insertedItems: 100 });
    const big = modelBloomFilter({ bitArraySize: 5000, hashFunctions: 5, insertedItems: 100 });
    expect(big.falsePositiveRate).toBeLessThan(small.falsePositiveRate);
  });

  it('optimal hash functions hits near (m/n) * ln(2)', () => {
    const r = modelBloomFilter({ bitArraySize: 1000, hashFunctions: 7, insertedItems: 100 });
    expect(r.optimalHashFunctions).toBe(7);
  });

  it('no NaN at extremes', () => {
    const cases = [
      { bitArraySize: 1, hashFunctions: 1, insertedItems: 0 },
      { bitArraySize: 1000000, hashFunctions: 20, insertedItems: 1000000 },
    ];
    for (const c of cases) {
      const r = modelBloomFilter(c);
      for (const v of Object.values(r)) {
        expect(Number.isFinite(v as number)).toBe(true);
      }
    }
  });
});

describe('bloomHashes', () => {
  it('returns k distinct-ish positions in [0, m)', () => {
    const positions = bloomHashes('test', 5, 1024);
    expect(positions).toHaveLength(5);
    for (const p of positions) {
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(1024);
    }
  });

  it('same input → same output', () => {
    expect(bloomHashes('hello', 4, 256)).toEqual(bloomHashes('hello', 4, 256));
  });
});

describe('bloom insert/query', () => {
  it('inserted items are always found', () => {
    const state = createBloom(2048);
    const words = ['alpha', 'beta', 'gamma', 'delta', 'epsilon'];
    for (const w of words) bloomInsert(state, w, 5);
    for (const w of words) {
      expect(bloomQuery(state, w, 5).found).toBe(true);
    }
  });

  it('definitely-absent items mostly return false at low fill', () => {
    const state = createBloom(4096);
    bloomInsert(state, 'only-thing', 5);
    let falsePositives = 0;
    for (let i = 0; i < 100; i++) {
      if (bloomQuery(state, `probe-${i}`, 5).found) falsePositives++;
    }
    expect(falsePositives).toBeLessThan(5);
  });
});
