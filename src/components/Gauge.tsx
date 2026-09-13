export function Gauge({ score, size = 150 }: { score: number; size?: number }) {
  const r = 60;
  const circumference = Math.PI * r; // half circle
  const filled = (score / 100) * circumference;
  const color = score >= 68 ? "#d9a94f" : score >= 48 ? "#7fa570" : "#7fabb8";

  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 160 100" className="overflow-visible">
      <path
        d="M 20 90 A 60 60 0 0 1 140 90"
        fill="none"
        stroke="rgba(232,194,122,0.12)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M 20 90 A 60 60 0 0 1 140 90"
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference}`}
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <text x="80" y="78" textAnchor="middle" className="font-display" fontSize="34" fill="#ece2c9">
        {score}
      </text>
    </svg>
  );
}
