'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  createArm,
  step,
  type Arm,
  type BanditState,
} from '@/lib/thompson-sampling';
import { formatInt, formatPercent } from '@/lib/format';
import { ExplorableSlider } from '@/components/ui/slider';
import { MetricRow } from '@/components/ui/metric';
import { Callout } from '@/components/ui/callout';
import { Toggle } from '@/components/ui/toggle';
import { BetaPosteriors } from './beta-posteriors';

type Strategy = 'thompson' | 'epsilon-greedy';

interface UiState {
  strategy: Strategy;
  epsilon: number;
  trueCtrs: number[];
  running: boolean;
  speed: number;
}

const DEFAULT_CTRS = [0.06, 0.18, 0.32, 0.12];

function makeState(trueCtrs: number[]): BanditState {
  return {
    arms: trueCtrs.map((p, i) => createArm(String.fromCharCode(65 + i), `arm ${String.fromCharCode(65 + i)}`, p)),
    totalPulls: 0,
    totalSuccesses: 0,
    totalRegret: 0,
  };
}

export function ThompsonSamplingExplorable() {
  const [ui, setUi] = useState<UiState>({
    strategy: 'thompson',
    epsilon: 0.1,
    trueCtrs: DEFAULT_CTRS,
    running: false,
    speed: 5,
  });

  const banditRef = useRef<BanditState>(makeState(ui.trueCtrs));
  const seedRef = useRef({ v: 17 });
  const [, setTick] = useState(0);
  const ctrsKey = ui.trueCtrs.join('|');

  useEffect(() => {
    banditRef.current = makeState(ctrsKey.split('|').map(Number));
    seedRef.current = { v: 17 };
    setTick((t) => t + 1);
  }, [ctrsKey]);

  useEffect(() => {
    if (!ui.running) return;
    let stopped = false;
    let last = performance.now();
    const loop = (now: number) => {
      if (stopped) return;
      const elapsed = now - last;
      const targetStepMs = Math.max(8, 200 / ui.speed);
      if (elapsed >= targetStepMs) {
        const stepsThisFrame = Math.min(50, Math.floor(elapsed / targetStepMs));
        for (let i = 0; i < stepsThisFrame; i++) {
          step(banditRef.current, ui.strategy, ui.epsilon, seedRef.current);
        }
        last = now;
        setTick((t) => t + 1);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => {
      stopped = true;
    };
  }, [ui.running, ui.strategy, ui.epsilon, ui.speed]);

  const state = banditRef.current;
  const bestTrue = Math.max(...state.arms.map((a) => a.trueCtr));
  const bestArm = state.arms.find((a) => a.trueCtr === bestTrue)!;
  const overallCtr = state.totalPulls > 0 ? state.totalSuccesses / state.totalPulls : 0;
  const averageRegret = state.totalPulls > 0 ? state.totalRegret / state.totalPulls : 0;

  const reset = () => {
    banditRef.current = makeState(ui.trueCtrs);
    seedRef.current = { v: Math.floor(Math.random() * 0xfffffff) };
    setUi((u) => ({ ...u, running: false }));
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-7" data-explorable="thompson-sampling">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
            03 · Thompson Sampling
          </div>
          <h3 className="mt-1 text-xl font-semibold text-fg sm:text-2xl">
            Beta posteriors that decide what to try next
          </h3>
        </div>
        <div className="hidden font-mono-tabular text-[11px] text-muted sm:block">
          multi-armed bandit
        </div>
      </header>

      <p className="text-[15px] leading-relaxed text-fg-muted">
        Four ranking variants, each with a true (hidden) click-through rate.
        Thompson sampling keeps a Beta posterior per arm and{' '}
        <em>samples from it</em> to decide which arm to pull. Posteriors of
        good arms tighten and shift right; posteriors of bad arms shift left.
        Total regret stays low because the algorithm naturally{' '}
        <em>explores when uncertain</em>.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {state.arms.map((arm, i) => (
          <ArmCtrInput
            key={arm.id}
            label={`Arm ${arm.id} true CTR`}
            value={ui.trueCtrs[i]}
            onChange={(v) =>
              setUi((u) => ({
                ...u,
                trueCtrs: u.trueCtrs.map((c, idx) => (idx === i ? v : c)),
              }))
            }
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
          strategy:
        </span>
        <Toggle active={ui.strategy === 'thompson'} onClick={() => setUi((u) => ({ ...u, strategy: 'thompson' }))}>
          Thompson sampling
        </Toggle>
        <Toggle active={ui.strategy === 'epsilon-greedy'} onClick={() => setUi((u) => ({ ...u, strategy: 'epsilon-greedy' }))}>
          ε-greedy (ε={ui.epsilon.toFixed(2)})
        </Toggle>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ExplorableSlider
          label="Pulls / second"
          techLabel="simulation speed"
          value={ui.speed}
          onChange={(v) => setUi((u) => ({ ...u, speed: v }))}
          min={1}
          max={50}
          step={1}
          format={(v) => `${Math.round(v)}× speed`}
        />
        {ui.strategy === 'epsilon-greedy' && (
          <ExplorableSlider
            label="Epsilon"
            techLabel="explore rate"
            value={ui.epsilon}
            onChange={(v) => setUi((u) => ({ ...u, epsilon: v }))}
            min={0}
            max={0.5}
            step={0.01}
            format={(v) => formatPercent(v, 0)}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setUi((u) => ({ ...u, running: !u.running }))}
          className={`rounded-md border px-4 py-2 font-mono-tabular text-xs uppercase tracking-wider transition-colors ${
            ui.running
              ? 'border-[color:var(--color-signal-warn)] bg-[color:var(--color-signal-warn)]/10 text-[color:var(--color-signal-warn)]'
              : 'border-accent bg-accent/10 text-accent'
          }`}
        >
          {ui.running ? '⏸ pause' : '▶ run'}
        </button>
        <button
          onClick={reset}
          className="rounded-md border border-[color:var(--color-border)] px-3 py-2 font-mono-tabular text-xs uppercase tracking-wider text-fg-muted transition-colors hover:border-fg-muted hover:text-fg"
        >
          ↻ reset
        </button>
        <span className="ml-auto font-mono-tabular text-[11px] uppercase tracking-wider text-muted">
          pulls: <span className="text-fg">{formatInt(state.totalPulls)}</span>
        </span>
      </div>

      <BetaPosteriors arms={state.arms} bestArmId={bestArm.id} />

      <div className="grid gap-2">
        {state.arms.map((arm) => (
          <ArmRow key={arm.id} arm={arm} isBest={arm.id === bestArm.id} totalPulls={state.totalPulls} />
        ))}
      </div>

      <div className="grid gap-2 border-t border-[color:var(--color-border)] pt-4">
        <MetricRow
          label="Overall click-through rate achieved"
          techLabel="successes / pulls"
          value={overallCtr}
          format={(v) => formatPercent(v, 2)}
          color="ok"
          bar={{ value: overallCtr, max: bestTrue }}
        />
        <MetricRow
          label="Cumulative regret"
          techLabel="vs always-pick-best oracle"
          value={state.totalRegret}
          format={(v) => `${v.toFixed(1)} clicks lost`}
          color={state.totalRegret > 50 ? 'crit' : state.totalRegret > 10 ? 'warn' : 'ok'}
        />
        <MetricRow
          label="Avg regret per pull"
          techLabel="should approach 0"
          value={averageRegret}
          format={(v) => formatPercent(v, 3)}
          color="muted"
        />
      </div>

      <p className="font-mono-tabular text-xs leading-relaxed text-muted">
        thompson is Bayesian-optimal for many bandit setups · regret grows
        logarithmically vs the ε-greedy linear growth at high ε
      </p>

      <Callout>
        Bandit-style rollouts power recommendation ranking experimentation at
        scale. At Reddit I rolled out the Provisional E rating surface-by-surface
        with holdback groups, measuring engagement delta and safety incident
        rate before expanding — the same explore/exploit shape, deployed for
        safety rather than CTR.
      </Callout>

      <p className="font-mono-tabular text-[11px] text-muted">
        live simulation · real beta posteriors update on each pull · regret computed against the true CTR oracle
      </p>
    </div>
  );
}

function ArmCtrInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="font-mono-tabular text-[11px] uppercase tracking-wider text-muted">{label}</span>
        <span className="font-mono-tabular text-sm tabular-nums text-fg">
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <input
        type="range"
        min={0.01}
        max={0.5}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[color:var(--color-accent)]"
      />
    </label>
  );
}

function ArmRow({ arm, isBest, totalPulls }: { arm: Arm; isBest: boolean; totalPulls: number }) {
  const pullFrac = totalPulls > 0 ? arm.pulls / totalPulls : 0;
  const empCtr = arm.pulls > 0 ? arm.successes / arm.pulls : 0;
  return (
    <div
      className={`grid grid-cols-[40px_1fr_auto] gap-3 rounded-md px-2 py-1.5 ${
        isBest ? 'bg-accent/5' : ''
      }`}
    >
      <span className={`font-mono-tabular text-sm ${isBest ? 'text-accent' : 'text-fg'}`}>
        arm {arm.id}
      </span>
      <div className="space-y-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full transition-[width] duration-150 ${
              isBest ? 'bg-accent' : 'bg-fg-muted'
            }`}
            style={{ width: `${pullFrac * 100}%` }}
          />
        </div>
        <div className="flex justify-between font-mono-tabular text-[10px] uppercase tracking-wider text-muted">
          <span>{formatInt(arm.pulls)} pulls · {(empCtr * 100).toFixed(1)}% empirical</span>
          <span>true {(arm.trueCtr * 100).toFixed(1)}%</span>
        </div>
      </div>
      <span className="font-mono-tabular text-[10px] tabular-nums text-fg-muted">
        α={arm.alpha} β={arm.beta}
      </span>
    </div>
  );
}
