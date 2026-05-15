export interface Arm {
  id: string;
  label: string;
  trueCtr: number;
  alpha: number;
  beta: number;
  pulls: number;
  successes: number;
}

export interface BanditState {
  arms: Arm[];
  totalPulls: number;
  totalSuccesses: number;
  totalRegret: number;
}

export function createArm(id: string, label: string, trueCtr: number): Arm {
  return { id, label, trueCtr, alpha: 1, beta: 1, pulls: 0, successes: 0 };
}

function rng(seed: { v: number }): number {
  seed.v = (seed.v * 1664525 + 1013904223) % 0xffffffff;
  return seed.v / 0xffffffff;
}

function gammaSample(shape: number, seed: { v: number }): number {
  if (shape < 1) {
    const u = rng(seed);
    return gammaSample(shape + 1, seed) * Math.pow(u, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x = 0;
    let v = 0;
    do {
      const u1 = rng(seed);
      const u2 = rng(seed);
      x = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-12))) * Math.cos(2 * Math.PI * u2);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng(seed);
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

export function sampleBeta(alpha: number, beta: number, seed: { v: number }): number {
  const x = gammaSample(alpha, seed);
  const y = gammaSample(beta, seed);
  return x / (x + y);
}

export function thompsonPickArm(state: BanditState, seed: { v: number }): Arm {
  let best: Arm | null = null;
  let bestSample = -Infinity;
  for (const arm of state.arms) {
    const s = sampleBeta(arm.alpha, arm.beta, seed);
    if (s > bestSample) {
      bestSample = s;
      best = arm;
    }
  }
  return best!;
}

export function epsilonGreedyPickArm(state: BanditState, epsilon: number, seed: { v: number }): Arm {
  if (rng(seed) < epsilon) {
    const idx = Math.floor(rng(seed) * state.arms.length);
    return state.arms[Math.min(idx, state.arms.length - 1)];
  }
  let best: Arm | null = null;
  let bestRate = -Infinity;
  for (const arm of state.arms) {
    const rate = arm.pulls > 0 ? arm.successes / arm.pulls : 0;
    if (rate > bestRate) {
      bestRate = rate;
      best = arm;
    }
  }
  return best!;
}

export function pull(arm: Arm, seed: { v: number }): boolean {
  const success = rng(seed) < arm.trueCtr;
  arm.pulls += 1;
  if (success) {
    arm.alpha += 1;
    arm.successes += 1;
  } else {
    arm.beta += 1;
  }
  return success;
}

export interface StepResult {
  pulledArmId: string;
  success: boolean;
  regret: number;
}

export function step(
  state: BanditState,
  strategy: 'thompson' | 'epsilon-greedy',
  epsilon: number,
  seed: { v: number },
): StepResult {
  const arm =
    strategy === 'thompson'
      ? thompsonPickArm(state, seed)
      : epsilonGreedyPickArm(state, epsilon, seed);
  const bestTrue = Math.max(...state.arms.map((a) => a.trueCtr));
  const success = pull(arm, seed);
  const regret = bestTrue - arm.trueCtr;
  state.totalPulls += 1;
  if (success) state.totalSuccesses += 1;
  state.totalRegret += regret;
  return { pulledArmId: arm.id, success, regret };
}

export function betaPdf(x: number, alpha: number, beta: number): number {
  if (x <= 0 || x >= 1) return 0;
  const logBeta = lnGamma(alpha) + lnGamma(beta) - lnGamma(alpha + beta);
  const logPdf = (alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - x) - logBeta;
  return Math.exp(logPdf);
}

function lnGamma(z: number): number {
  const g = 7;
  const c = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  }
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
