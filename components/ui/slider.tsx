'use client';

import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { AnimatedNumber } from './animated-number';

export interface ExplorableSliderProps {
  label: string;
  techLabel?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format: (value: number) => string;
}

export function ExplorableSlider({
  label,
  techLabel,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
}: ExplorableSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-base font-medium text-fg sm:text-lg">{label}</div>
          {techLabel && (
            <div className="font-mono-tabular text-[11px] uppercase tracking-wider text-muted">
              {techLabel}
            </div>
          )}
        </div>
        <AnimatedNumber
          value={value}
          format={format}
          className="font-mono-tabular text-lg font-medium text-fg sm:text-xl"
        />
      </div>
      <RadixSlider.Root
        className="relative flex h-6 w-full touch-none select-none items-center"
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? value)}
        min={min}
        max={max}
        step={step}
        aria-label={label}
      >
        <RadixSlider.Track className="relative h-1 grow rounded-full bg-border">
          <RadixSlider.Range className="absolute h-full rounded-full bg-accent" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="block size-4 rounded-full bg-fg shadow-sm ring-offset-2 ring-offset-bg transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={label}
        />
      </RadixSlider.Root>
    </div>
  );
}
