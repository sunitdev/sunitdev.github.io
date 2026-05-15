export function formatInt(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function formatPercent(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return '—';
  return `${(value * 100).toFixed(digits)}%`;
}
