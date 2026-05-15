import { describe, it, expect } from 'vitest';
import {
  createArm,
  pull,
  step,
  betaPdf,
  sampleBeta,
} from './thompson-sampling';

const seed = (n: number) => ({ v: n });

describe('Thompson Sampling', () => {
  it('beta sample is in (0, 1)', () => {
    const s = seed(42);
    for (let i = 0; i < 50; i++) {
      const v = sampleBeta(2, 5, s);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('beta PDF integrates near 1', () => {
    let area = 0;
    const steps = 200;
    for (let i = 0; i < steps; i++) {
      const x = (i + 0.5) / steps;
      area += betaPdf(x, 4, 6) / steps;
    }
    expect(area).toBeGreaterThan(0.9);
    expect(area).toBeLessThan(1.1);
  });

  it('pulling arm updates alpha or beta', () => {
    const arm = createArm('A', 'A', 0.5);
    const before = arm.alpha + arm.beta;
    pull(arm, seed(7));
    expect(arm.alpha + arm.beta).toBe(before + 1);
    expect(arm.pulls).toBe(1);
  });

  it('Thompson sampling converges to best arm over many steps', () => {
    const arms = [
      createArm('A', 'A', 0.2),
      createArm('B', 'B', 0.5),
      createArm('C', 'C', 0.05),
    ];
    const state = { arms, totalPulls: 0, totalSuccesses: 0, totalRegret: 0 };
    const s = seed(123);
    for (let i = 0; i < 2000; i++) step(state, 'thompson', 0.1, s);

    const winner = arms.reduce((best, a) => (a.pulls > best.pulls ? a : best));
    expect(winner.id).toBe('B');
  });

  it('epsilon-greedy with eps=0 always exploits leader after warmup', () => {
    const arms = [
      createArm('A', 'A', 0.8),
      createArm('B', 'B', 0.1),
    ];
    const state = { arms, totalPulls: 0, totalSuccesses: 0, totalRegret: 0 };
    const s = seed(9);
    for (let i = 0; i < 50; i++) step(state, 'epsilon-greedy', 0.5, s);
    let bArmPulls = 0;
    for (let i = 0; i < 200; i++) {
      const r = step(state, 'epsilon-greedy', 0, s);
      if (r.pulledArmId === 'B') bArmPulls++;
    }
    expect(bArmPulls).toBeLessThan(50);
  });
});
