export function JournalArt() {
  const contours = Array.from({ length: 34 }, (_, ring) => {
    const radius = 18 + ring * 3.9;
    const points = Array.from({ length: 220 }, (_, step) => {
      const t = step / 219;
      const turn = t * Math.PI * 2;
      const blend = Math.pow(t, 2.5);
      const x = (1 - blend) * (165 + radius * Math.cos(turn)) + blend * (165 + 480 * t);
      const y =
        (1 - blend) * (175 + radius * Math.sin(turn)) +
        blend * (175 + Math.sin(t * 14 + ring * 0.075) * (45 + ring * 1.3));
      return `${step === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
    return <path key={ring} d={points} opacity={0.35 + ring / 100} />;
  });
  const dots = Array.from({ length: 210 }, (_, i) => {
    const x = 200 + ((i * 167 + 71) % 440);
    const y = 70 + ((i * 83 + 29) % 205);
    const envelope = 25 + 85 * Math.sin(((x - 200) / 440) * Math.PI);
    return Math.abs(y - 175) < envelope ? (
      <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.15 : 0.7} opacity={0.45} />
    ) : null;
  });
  return (
    <svg viewBox="0 0 680 350" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth=".75">
        {contours}
      </g>
      <g fill="currentColor">{dots}</g>
    </svg>
  );
}
