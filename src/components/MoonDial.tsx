import type { MoonInfo } from "../lib/moon";

/** Illuminated-disc moon indicator built from two SVG arcs (the classic
 * "half-circle + terminator ellipse" construction) rather than an emoji glyph. */
export function MoonDial({ moon, size = 96 }: { moon: MoonInfo; size?: number }) {
  const r = 40;
  const cx = 50;
  const cy = 50;
  const angle = moon.age * 2 * Math.PI;
  const rx = Math.abs(r * Math.cos(angle));
  const sweep = Math.cos(angle) > 0 ? 1 : 0;

  const brightPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={moon.phaseName}>
      <defs>
        <radialGradient id="moonGlow" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#f6f1de" />
          <stop offset="100%" stopColor="#cfe6ec" />
        </radialGradient>
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r + 7} fill="rgba(207,230,236,0.07)" />
      <g clipPath="url(#moonClip)">
        <circle cx={cx} cy={cy} r={r} fill="#182420" />
        <path d={brightPath} fill="url(#moonGlow)" />
        <circle cx={cx - 12} cy={cy - 9} r={3.4} fill="#0d1410" opacity={0.18} />
        <circle cx={cx + 6} cy={cy + 12} r={5.2} fill="#0d1410" opacity={0.14} />
        <circle cx={cx + 14} cy={cy - 4} r={2.2} fill="#0d1410" opacity={0.16} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(10,15,11,0.55)" strokeWidth="1.5" />
    </svg>
  );
}
