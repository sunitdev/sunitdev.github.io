export interface OrSetElement {
  value: string;
  uniqueTag: string;
}

export interface OrSetReplicaState {
  id: string;
  added: OrSetElement[];
  removed: OrSetElement[];
}

export interface OrSetOp {
  type: 'add' | 'remove';
  replicaId: string;
  value: string;
  tag: string;
  timestamp: number;
  visible: boolean;
}

export function createReplica(id: string): OrSetReplicaState {
  return { id, added: [], removed: [] };
}

export function generateTag(replicaId: string, value: string, counter: number): string {
  return `${replicaId}:${value}:${counter}`;
}

export function applyOp(state: OrSetReplicaState, op: OrSetOp): OrSetReplicaState {
  if (op.type === 'add') {
    if (state.added.some((e) => e.uniqueTag === op.tag)) return state;
    return { ...state, added: [...state.added, { value: op.value, uniqueTag: op.tag }] };
  } else {
    if (state.removed.some((e) => e.uniqueTag === op.tag)) return state;
    return { ...state, removed: [...state.removed, { value: op.value, uniqueTag: op.tag }] };
  }
}

export function materializeSet(state: OrSetReplicaState): string[] {
  const removedTags = new Set(state.removed.map((e) => e.uniqueTag));
  const visible = state.added.filter((e) => !removedTags.has(e.uniqueTag));
  return [...new Set(visible.map((e) => e.value))].sort();
}

export function mergeReplicas(a: OrSetReplicaState, b: OrSetReplicaState): OrSetReplicaState {
  const addedMap = new Map<string, OrSetElement>();
  for (const e of [...a.added, ...b.added]) addedMap.set(e.uniqueTag, e);
  const removedMap = new Map<string, OrSetElement>();
  for (const e of [...a.removed, ...b.removed]) removedMap.set(e.uniqueTag, e);
  return {
    id: a.id,
    added: [...addedMap.values()],
    removed: [...removedMap.values()],
  };
}

export interface LwwElement {
  value: string;
  timestamp: number;
  isAdd: boolean;
}

export interface LwwState {
  id: string;
  entries: Map<string, LwwElement>;
}

export function createLwwReplica(id: string): LwwState {
  return { id, entries: new Map() };
}

export function lwwApply(state: LwwState, op: { value: string; isAdd: boolean; timestamp: number }): LwwState {
  const existing = state.entries.get(op.value);
  if (!existing || op.timestamp > existing.timestamp) {
    const newMap = new Map(state.entries);
    newMap.set(op.value, { value: op.value, timestamp: op.timestamp, isAdd: op.isAdd });
    return { ...state, entries: newMap };
  }
  return state;
}

export function lwwMaterialize(state: LwwState): string[] {
  return [...state.entries.values()]
    .filter((e) => e.isAdd)
    .map((e) => e.value)
    .sort();
}

export function lwwMerge(a: LwwState, b: LwwState): LwwState {
  let merged = createLwwReplica(a.id);
  merged = { ...merged, entries: new Map(a.entries) };
  for (const [value, e] of b.entries) {
    merged = lwwApply(merged, { value, isAdd: e.isAdd, timestamp: e.timestamp });
  }
  return merged;
}
