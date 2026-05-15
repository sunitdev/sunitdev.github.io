'use client';

import * as React from 'react';
import { useMemo, useReducer, useState } from 'react';
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
  type OrSetReplicaState,
  type OrSetOp,
  type LwwState,
} from '@/lib/crdt-or-set';
import { Callout } from '@/components/ui/callout';
import { Toggle } from '@/components/ui/toggle';
import { ReplicaCard } from './replica-card';

type Strategy = 'or-set' | 'lww';

interface Event {
  id: number;
  replicaId: 'A' | 'B';
  op: 'add' | 'remove';
  value: string;
  timestamp: number;
  syncedTo: ('A' | 'B')[];
}

interface SimState {
  events: Event[];
  nextId: number;
  logicalClock: number;
}

type Action =
  | { type: 'add'; replicaId: 'A' | 'B'; value: string }
  | { type: 'remove'; replicaId: 'A' | 'B'; value: string }
  | { type: 'sync'; from: 'A' | 'B'; to: 'A' | 'B' }
  | { type: 'reset' };

const ITEMS = ['🍎 apple', '🍌 banana', '🍇 grape', '🍒 cherry'];

function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case 'add':
    case 'remove': {
      const op = action.type;
      const event: Event = {
        id: state.nextId,
        replicaId: action.replicaId,
        op,
        value: action.value,
        timestamp: state.logicalClock + 1,
        syncedTo: [action.replicaId],
      };
      return {
        events: [...state.events, event],
        nextId: state.nextId + 1,
        logicalClock: state.logicalClock + 1,
      };
    }
    case 'sync': {
      const updated = state.events.map((e) =>
        e.syncedTo.includes(action.from) && !e.syncedTo.includes(action.to)
          ? { ...e, syncedTo: [...e.syncedTo, action.to] }
          : e,
      );
      return { ...state, events: updated };
    }
    case 'reset':
      return { events: [], nextId: 0, logicalClock: 0 };
  }
}

function rebuildOrSet(events: Event[], who: 'A' | 'B'): OrSetReplicaState {
  let state = createReplica(who);
  const sorted = [...events]
    .filter((e) => e.syncedTo.includes(who))
    .sort((a, b) => a.timestamp - b.timestamp);
  for (const e of sorted) {
    const tag = generateTag(e.replicaId, e.value, e.id);
    const op: OrSetOp = {
      type: e.op,
      replicaId: e.replicaId,
      value: e.value,
      tag,
      timestamp: e.timestamp,
      visible: true,
    };
    if (e.op === 'remove') {
      const matchingAdd = sorted.find(
        (x) => x.op === 'add' && x.value === e.value && x.timestamp < e.timestamp,
      );
      if (matchingAdd) {
        op.tag = generateTag(matchingAdd.replicaId, matchingAdd.value, matchingAdd.id);
      }
    }
    state = applyOp(state, op);
  }
  return state;
}

function rebuildLww(events: Event[], who: 'A' | 'B'): LwwState {
  let state = createLwwReplica(who);
  const sorted = [...events]
    .filter((e) => e.syncedTo.includes(who))
    .sort((a, b) => a.timestamp - b.timestamp);
  for (const e of sorted) {
    state = lwwApply(state, { value: e.value, isAdd: e.op === 'add', timestamp: e.timestamp });
  }
  return state;
}

export function CrdtExplorable() {
  const [sim, dispatch] = useReducer(reducer, { events: [], nextId: 0, logicalClock: 0 });
  const [strategy, setStrategy] = useState<Strategy>('or-set');

  const aOrSet = useMemo(() => rebuildOrSet(sim.events, 'A'), [sim.events]);
  const bOrSet = useMemo(() => rebuildOrSet(sim.events, 'B'), [sim.events]);
  const merged = useMemo(() => mergeReplicas(aOrSet, bOrSet), [aOrSet, bOrSet]);

  const aLww = useMemo(() => rebuildLww(sim.events, 'A'), [sim.events]);
  const bLww = useMemo(() => rebuildLww(sim.events, 'B'), [sim.events]);
  const mergedLww = useMemo(() => lwwMerge(aLww, bLww), [aLww, bLww]);

  const aSet = strategy === 'or-set' ? materializeSet(aOrSet) : lwwMaterialize(aLww);
  const bSet = strategy === 'or-set' ? materializeSet(bOrSet) : lwwMaterialize(bLww);
  const mergedSet = strategy === 'or-set' ? materializeSet(merged) : lwwMaterialize(mergedLww);

  const converged = JSON.stringify(aSet) === JSON.stringify(bSet);

  return (
    <div className="space-y-7" data-explorable="crdt-or-set">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
            02 · CRDT · OR-Set
          </div>
          <h3 className="mt-1 text-xl font-semibold text-fg sm:text-2xl">
            Two replicas, no coordinator, automatic convergence
          </h3>
        </div>
        <div className="hidden font-mono-tabular text-[11px] text-muted sm:block">
          observed-remove set
        </div>
      </header>

      <p className="text-[15px] leading-relaxed text-fg-muted">
        A Conflict-free Replicated Data Type lets two replicas accept writes
        independently — and converge on the same result regardless of merge
        order. Add to A, remove from B, sync in either direction: the OR-Set
        gets the right answer every time. Compare to Last-Write-Wins to see
        when "use a timestamp" silently drops data.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
          strategy:
        </span>
        <Toggle active={strategy === 'or-set'} onClick={() => setStrategy('or-set')}>
          OR-Set (CRDT)
        </Toggle>
        <Toggle active={strategy === 'lww'} onClick={() => setStrategy('lww')}>
          Last-Write-Wins
        </Toggle>
        <button
          onClick={() => dispatch({ type: 'reset' })}
          className="ml-auto rounded-md border border-[color:var(--color-border)] px-3 py-1.5 font-mono-tabular text-xs uppercase tracking-wider text-fg-muted transition-colors hover:border-fg-muted hover:text-fg"
        >
          reset
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ReplicaCard
          name="Replica A"
          set={aSet}
          allItems={ITEMS}
          onAdd={(v) => dispatch({ type: 'add', replicaId: 'A', value: v })}
          onRemove={(v) => dispatch({ type: 'remove', replicaId: 'A', value: v })}
          onSyncFrom={() => dispatch({ type: 'sync', from: 'B', to: 'A' })}
          peerName="B"
        />
        <ReplicaCard
          name="Replica B"
          set={bSet}
          allItems={ITEMS}
          onAdd={(v) => dispatch({ type: 'add', replicaId: 'B', value: v })}
          onRemove={(v) => dispatch({ type: 'remove', replicaId: 'B', value: v })}
          onSyncFrom={() => dispatch({ type: 'sync', from: 'A', to: 'B' })}
          peerName="A"
        />
      </div>

      <div className="rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-4">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
            merged view
          </div>
          <div
            className={`font-mono-tabular text-[10px] uppercase tracking-wider ${
              converged ? 'text-[color:var(--color-signal-ok)]' : 'text-[color:var(--color-signal-warn)]'
            }`}
          >
            {converged ? 'replicas converged' : 'replicas diverged'}
          </div>
        </div>
        {mergedSet.length === 0 ? (
          <div className="font-mono-tabular text-sm text-muted">∅ empty set</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {mergedSet.map((v) => (
              <span
                key={v}
                className="rounded-md border border-accent bg-accent/10 px-2.5 py-1 font-mono-tabular text-sm text-accent"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-4">
        <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
          event log · {sim.events.length} ops
        </div>
        {sim.events.length === 0 ? (
          <p className="text-[13px] text-fg-muted">
            Add or remove items on each replica. Sync between them. Watch the
            merged view stay correct.
          </p>
        ) : (
          <ol className="space-y-1 font-mono-tabular text-[11px] text-fg-muted">
            {sim.events.map((e) => (
              <li key={e.id} className="grid grid-cols-[40px_1fr_1fr_auto] gap-2">
                <span className="tabular-nums text-muted">t={e.timestamp}</span>
                <span>
                  {e.replicaId} · {e.op}{' '}
                  <span className="text-fg">{e.value}</span>
                </span>
                <span className="text-muted">tag {e.replicaId}:{e.id}</span>
                <span className="text-accent">visible on: {e.syncedTo.join(',')}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <p className="font-mono-tabular text-xs leading-relaxed text-muted">
        OR-Set: each add carries a unique tag · remove only kills the specific tag · concurrent adds survive · LWW: timestamp wins, concurrent edits get dropped
      </p>

      <Callout>
        At Zaya Learning Labs I built an offline-first sync algorithm between a
        primary DB and N tablet replicas — same shape as a CRDT: per-device
        op-log, deterministic merge, no central coordinator needed during
        offline windows.
      </Callout>

      <p className="font-mono-tabular text-[11px] text-muted">
        live CRDT · materialized sets recompute from the event log on every
        change
      </p>
    </div>
  );
}
