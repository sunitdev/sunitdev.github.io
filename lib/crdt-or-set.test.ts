import { describe, it, expect } from 'vitest';
import {
  createReplica,
  applyOp,
  materializeSet,
  mergeReplicas,
  generateTag,
  createLwwReplica,
  lwwApply,
  lwwMaterialize,
  lwwMerge,
} from './crdt-or-set';

describe('OR-Set CRDT', () => {
  it('add wins over concurrent remove of a different add-tag', () => {
    let A = createReplica('A');
    let B = createReplica('B');

    const tagA = generateTag('A', 'apple', 0);
    A = applyOp(A, { type: 'add', replicaId: 'A', value: 'apple', tag: tagA, timestamp: 1, visible: true });
    B = applyOp(B, { type: 'add', replicaId: 'A', value: 'apple', tag: tagA, timestamp: 1, visible: true });

    const tagB = generateTag('B', 'apple', 0);
    B = applyOp(B, { type: 'add', replicaId: 'B', value: 'apple', tag: tagB, timestamp: 2, visible: true });
    A = applyOp(A, { type: 'remove', replicaId: 'A', value: 'apple', tag: tagA, timestamp: 3, visible: true });

    const merged = mergeReplicas(A, B);
    expect(materializeSet(merged)).toContain('apple');
  });

  it('converges regardless of merge order', () => {
    let A = createReplica('A');
    let B = createReplica('B');
    let C = createReplica('C');

    const tag1 = generateTag('A', 'x', 0);
    const tag2 = generateTag('B', 'y', 0);
    const tag3 = generateTag('C', 'z', 0);

    A = applyOp(A, { type: 'add', replicaId: 'A', value: 'x', tag: tag1, timestamp: 1, visible: true });
    B = applyOp(B, { type: 'add', replicaId: 'B', value: 'y', tag: tag2, timestamp: 1, visible: true });
    C = applyOp(C, { type: 'add', replicaId: 'C', value: 'z', tag: tag3, timestamp: 1, visible: true });

    const order1 = mergeReplicas(mergeReplicas(A, B), C);
    const order2 = mergeReplicas(A, mergeReplicas(B, C));
    const order3 = mergeReplicas(mergeReplicas(C, A), B);

    expect(materializeSet(order1)).toEqual(materializeSet(order2));
    expect(materializeSet(order2)).toEqual(materializeSet(order3));
  });

  it('merge is idempotent', () => {
    let A = createReplica('A');
    A = applyOp(A, {
      type: 'add',
      replicaId: 'A',
      value: 'q',
      tag: generateTag('A', 'q', 0),
      timestamp: 1,
      visible: true,
    });
    const once = mergeReplicas(A, A);
    const twice = mergeReplicas(once, A);
    expect(materializeSet(once)).toEqual(materializeSet(twice));
  });
});

describe('LWW comparison', () => {
  it('add then remove with later timestamp removes', () => {
    let s = createLwwReplica('A');
    s = lwwApply(s, { value: 'a', isAdd: true, timestamp: 1 });
    s = lwwApply(s, { value: 'a', isAdd: false, timestamp: 2 });
    expect(lwwMaterialize(s)).toEqual([]);
  });

  it('concurrent add+remove resolved by timestamp (can drop the add)', () => {
    let A = createLwwReplica('A');
    let B = createLwwReplica('B');
    A = lwwApply(A, { value: 'x', isAdd: true, timestamp: 1 });
    B = lwwApply(B, { value: 'x', isAdd: false, timestamp: 2 });
    const merged = lwwMerge(A, B);
    expect(lwwMaterialize(merged)).toEqual([]);
  });
});
