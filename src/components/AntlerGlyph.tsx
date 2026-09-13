import type { IconKey } from "../data/species";

interface AntlerConfig {
  tines: number;
  spread: number; // 0..1, how wide the rack fans
  height: number; // 0..1, how tall beams sweep
  forked: boolean;
  massy: boolean;
}

const CONFIG: Record<IconKey, AntlerConfig> = {
  whitetail: { tines: 4, spread: 0.55, height: 0.9, forked: false, massy: false },
  "mule-deer": { tines: 4, spread: 0.95, height: 0.75, forked: true, massy: true },
  blacktail: { tines: 3, spread: 0.7, height: 0.65, forked: true, massy: false },
  coues: { tines: 3, spread: 0.4, height: 1, forked: false, massy: false },
  sika: { tines: 3, spread: 0.45, height: 0.7, forked: false, massy: false },
  axis: { tines: 3, spread: 0.35, height: 1, forked: false, massy: false },
};

/** Procedurally draws a stylized front-facing antler mark, shaped from a small
 * per-species config (tine count / spread / sweep) rather than a fixed image. */
export function AntlerGlyph({
  species,
  className,
  strokeWidth = 3,
}: {
  species: IconKey;
  className?: string;
  strokeWidth?: number;
}) {
  const cfg = CONFIG[species] ?? CONFIG.whitetail;
  const cx = 50;
  const baseY = 92;
  const topY = baseY - 60 * cfg.height;
  const spreadX = 34 * cfg.spread;

  const beam = (dir: 1 | -1) => {
    const midX = cx + dir * spreadX * 0.55;
    const midY = baseY - 34 * cfg.height;
    const endX = cx + dir * spreadX * (cfg.forked ? 1.05 : 0.85);
    const endY = topY;
    return `M ${cx + dir * 3} ${baseY} C ${cx + dir * 6} ${baseY - 18}, ${midX} ${midY + 10}, ${midX} ${midY} S ${endX} ${topY + 14}, ${endX} ${endY}`;
  };

  const tinesFor = (dir: 1 | -1) => {
    const nodes = [];
    const count = cfg.tines;
    for (let i = 0; i < count; i++) {
      const t = (i + 1) / (count + 0.6);
      const x = cx + dir * spreadX * (0.35 + 0.65 * t);
      const y = baseY - (60 * cfg.height) * t - 6;
      const tipX = x + dir * (10 + 6 * (1 - t));
      const tipY = y - (16 + 10 * t);
      nodes.push(<path key={`${dir}-${i}`} d={`M ${x} ${y} L ${tipX} ${tipY}`} strokeLinecap="round" />);
    }
    if (cfg.forked) {
      const forkX = cx + dir * spreadX * 1.0;
      const forkY = topY + 6;
      nodes.push(
        <path
          key={`${dir}-fork`}
          d={`M ${forkX} ${forkY} L ${forkX + dir * 10} ${forkY - 16} M ${forkX} ${forkY} L ${forkX - dir * 4} ${forkY - 18}`}
          strokeLinecap="round"
        />,
      );
    }
    return nodes;
  };

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={beam(-1)} stroke="currentColor" strokeWidth={cfg.massy ? strokeWidth + 1.5 : strokeWidth} strokeLinecap="round" />
      <path d={beam(1)} stroke="currentColor" strokeWidth={cfg.massy ? strokeWidth + 1.5 : strokeWidth} strokeLinecap="round" />
      <g stroke="currentColor" strokeWidth={strokeWidth - 0.75}>
        {tinesFor(-1)}
        {tinesFor(1)}
      </g>
      <circle cx={cx} cy={baseY + 3} r={4} fill="currentColor" opacity={0.85} />
    </svg>
  );
}
