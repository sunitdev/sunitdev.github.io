'use client';

import { useEffect, useRef, useState } from 'react';

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function useAnimatedNumber(target: number, ms = 180): number {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);

  useEffect(() => {
    if (!Number.isFinite(target) || REDUCED_MOTION) {
      displayRef.current = target;
      setDisplay(target);
      return;
    }
    const from = displayRef.current;
    if (from === target) return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      displayRef.current = v;
      setDisplay(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return display;
}

export function AnimatedNumber({
  value,
  format,
  className = '',
}: {
  value: number;
  format: (v: number) => string;
  className?: string;
}) {
  const animated = useAnimatedNumber(value);
  return <span className={className}>{format(animated)}</span>;
}
