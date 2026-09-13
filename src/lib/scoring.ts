export interface AntlerSideMeasurements {
  mainBeam: number;
  points: number[]; // G1 (brow) ... Gn, inches, one entry per typical point on this side
  circumferences: number[]; // H1..H4, inches
}

export interface AntlerMeasurements {
  speciesId: string;
  insideSpread: number;
  left: AntlerSideMeasurements;
  right: AntlerSideMeasurements;
  abnormalPoints: number; // total inches of non-typical/kicker points
}

export interface ScoreBreakdownRow {
  label: string;
  left?: number;
  right?: number;
  deduction?: number;
}

export interface ScoreResult {
  grossScore: number;
  netScore: number;
  symmetryDeduction: number;
  spreadCredit: number;
  pointCount: number;
  tier: ScoreTier;
  narrative: string[];
  rows: ScoreBreakdownRow[];
}

export interface ScoreTier {
  key: "cull" | "developing" | "respectable" | "trophy" | "book";
  label: string;
  description: string;
  color: string;
}

export interface ScoringProfile {
  speciesId: string;
  displayName: string;
  bookMinimum: number; // record-book style net-score threshold
  tiers: { max: number; tier: ScoreTier }[];
  massHint: number; // typical circumference sum, both sides, for narrative comparisons
  spreadHint: number; // typical inside spread for narrative comparisons
}

const TIER_LIBRARY: Record<ScoreTier["key"], ScoreTier> = {
  cull: {
    key: "cull",
    label: "Cull / Immature",
    description: "Young or management-class animal — plenty of growing left to do.",
    color: "var(--color-ink-500)",
  },
  developing: {
    key: "developing",
    label: "Developing",
    description: "Solid young deer starting to show real antler potential.",
    color: "var(--color-fern-500)",
  },
  respectable: {
    key: "respectable",
    label: "Respectable",
    description: "A mature, well-formed animal most hunters would be proud of.",
    color: "var(--color-amber-400)",
  },
  trophy: {
    key: "trophy",
    label: "Trophy Class",
    description: "A true wall-hanger — well above average for the species.",
    color: "var(--color-rust-400)",
  },
  book: {
    key: "book",
    label: "Record Book Range",
    description: "Scoring in the neighborhood of record-book territory. Exceptional.",
    color: "var(--color-moon-400)",
  },
};

export const SCORING_PROFILES: ScoringProfile[] = [
  {
    speciesId: "whitetail",
    displayName: "Whitetail",
    bookMinimum: 170,
    massHint: 18,
    spreadHint: 18,
    tiers: [
      { max: 100, tier: TIER_LIBRARY.cull },
      { max: 125, tier: TIER_LIBRARY.developing },
      { max: 150, tier: TIER_LIBRARY.respectable },
      { max: 170, tier: TIER_LIBRARY.trophy },
      { max: Infinity, tier: TIER_LIBRARY.book },
    ],
  },
  {
    speciesId: "mule-deer",
    displayName: "Mule Deer",
    bookMinimum: 190,
    massHint: 20,
    spreadHint: 24,
    tiers: [
      { max: 110, tier: TIER_LIBRARY.cull },
      { max: 140, tier: TIER_LIBRARY.developing },
      { max: 165, tier: TIER_LIBRARY.respectable },
      { max: 190, tier: TIER_LIBRARY.trophy },
      { max: Infinity, tier: TIER_LIBRARY.book },
    ],
  },
  {
    speciesId: "blacktail",
    displayName: "Blacktail",
    bookMinimum: 130,
    massHint: 14,
    spreadHint: 15,
    tiers: [
      { max: 75, tier: TIER_LIBRARY.cull },
      { max: 95, tier: TIER_LIBRARY.developing },
      { max: 115, tier: TIER_LIBRARY.respectable },
      { max: 130, tier: TIER_LIBRARY.trophy },
      { max: Infinity, tier: TIER_LIBRARY.book },
    ],
  },
  {
    speciesId: "coues",
    displayName: "Coues Deer",
    bookMinimum: 110,
    massHint: 10,
    spreadHint: 14,
    tiers: [
      { max: 60, tier: TIER_LIBRARY.cull },
      { max: 80, tier: TIER_LIBRARY.developing },
      { max: 95, tier: TIER_LIBRARY.respectable },
      { max: 110, tier: TIER_LIBRARY.trophy },
      { max: Infinity, tier: TIER_LIBRARY.book },
    ],
  },
  {
    speciesId: "sika",
    displayName: "Sika Deer",
    bookMinimum: 90,
    massHint: 9,
    spreadHint: 12,
    tiers: [
      { max: 50, tier: TIER_LIBRARY.cull },
      { max: 65, tier: TIER_LIBRARY.developing },
      { max: 78, tier: TIER_LIBRARY.respectable },
      { max: 90, tier: TIER_LIBRARY.trophy },
      { max: Infinity, tier: TIER_LIBRARY.book },
    ],
  },
  {
    speciesId: "axis",
    displayName: "Axis Deer",
    bookMinimum: 90,
    massHint: 8,
    spreadHint: 12,
    tiers: [
      { max: 55, tier: TIER_LIBRARY.cull },
      { max: 68, tier: TIER_LIBRARY.developing },
      { max: 80, tier: TIER_LIBRARY.respectable },
      { max: 90, tier: TIER_LIBRARY.trophy },
      { max: Infinity, tier: TIER_LIBRARY.book },
    ],
  },
];

export function getScoringProfile(speciesId: string): ScoringProfile {
  return SCORING_PROFILES.find((p) => p.speciesId === speciesId) ?? SCORING_PROFILES[0];
}

/**
 * Deterministic, rule-based antler scoring engine modeled on the Boone & Crockett
 * "typical" whitetail/mule-deer scoring method: gross score credits main beams,
 * spread, point lengths and mass circumferences; net score subtracts a symmetry
 * deduction for left/right differences plus non-typical (abnormal) point length.
 * Marketed in-app as the "DeerDiary AI Score" — it's an algorithmic scoring
 * assistant, not a live model call.
 */
export function scoreAntlers(m: AntlerMeasurements): ScoreResult {
  const profile = getScoringProfile(m.speciesId);
  const { left, right } = m;

  const spreadCredit = Math.min(m.insideSpread, Math.max(left.mainBeam, right.mainBeam));

  const pointRows: ScoreBreakdownRow[] = [];
  const maxPoints = Math.max(left.points.length, right.points.length);
  let pointDeduction = 0;
  let pointSum = 0;
  for (let i = 0; i < maxPoints; i++) {
    const l = left.points[i] ?? 0;
    const r = right.points[i] ?? 0;
    pointSum += l + r;
    pointDeduction += Math.abs(l - r);
    pointRows.push({ label: `Point G${i + 1}`, left: l, right: r, deduction: Math.abs(l - r) });
  }

  const circRows: ScoreBreakdownRow[] = [];
  const maxCirc = Math.max(left.circumferences.length, right.circumferences.length);
  let circDeduction = 0;
  let circSum = 0;
  for (let i = 0; i < maxCirc; i++) {
    const l = left.circumferences[i] ?? 0;
    const r = right.circumferences[i] ?? 0;
    circSum += l + r;
    circDeduction += Math.abs(l - r);
    circRows.push({ label: `Mass H${i + 1}`, left: l, right: r, deduction: Math.abs(l - r) });
  }

  const beamDeduction = Math.abs(left.mainBeam - right.mainBeam);

  const grossScore = left.mainBeam + right.mainBeam + spreadCredit + pointSum + circSum;
  const symmetryDeduction = beamDeduction + pointDeduction + circDeduction;
  const netScore = Math.max(0, grossScore - symmetryDeduction - m.abnormalPoints);

  const tierEntry = profile.tiers.find((t) => netScore <= t.max) ?? profile.tiers[profile.tiers.length - 1];

  const pointCount =
    left.points.filter((p) => p > 0).length + right.points.filter((p) => p > 0).length;

  const narrative = buildNarrative({ m, profile, netScore, grossScore, symmetryDeduction, pointCount, circSum, spreadCredit });

  const rows: ScoreBreakdownRow[] = [
    { label: "Main beams", left: left.mainBeam, right: right.mainBeam, deduction: beamDeduction },
    ...pointRows,
    ...circRows,
  ];

  return {
    grossScore: round1(grossScore),
    netScore: round1(netScore),
    symmetryDeduction: round1(symmetryDeduction),
    spreadCredit: round1(spreadCredit),
    pointCount,
    tier: tierEntry.tier,
    narrative,
    rows,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function buildNarrative(args: {
  m: AntlerMeasurements;
  profile: ScoringProfile;
  netScore: number;
  grossScore: number;
  symmetryDeduction: number;
  pointCount: number;
  circSum: number;
  spreadCredit: number;
}): string[] {
  const { profile, netScore, grossScore, symmetryDeduction, pointCount, circSum, spreadCredit } = args;
  const lines: string[] = [];

  lines.push(
    `Net typical score of ${round1(netScore)}" against a gross of ${round1(grossScore)}" puts this ${profile.displayName.toLowerCase()} in the "${TIER_LIBRARY[tierKeyFor(profile, netScore)].label}" class.`,
  );

  if (symmetryDeduction < grossScore * 0.03) {
    lines.push("Left and right sides are remarkably symmetrical — very little deducted for asymmetry.");
  } else if (symmetryDeduction > grossScore * 0.08) {
    lines.push("Noticeable side-to-side asymmetry cost real inches — a slightly more even rack would have scored much higher.");
  }

  if (circSum > profile.massHint * 1.15) {
    lines.push("Mass circumferences are well above average for the species — heavy, powerful beams.");
  }

  if (spreadCredit > profile.spreadHint * 1.1) {
    lines.push("Spread credit is well above typical — this one carries width most hunters never see.");
  }

  if (pointCount >= 10) {
    lines.push(`${pointCount} scoreable points is an exceptional tine count.`);
  } else if (pointCount <= 4) {
    lines.push("A clean, basic frame — fewer points but often very symmetrical.");
  }

  if (netScore >= profile.bookMinimum) {
    lines.push(`This score clears the ${profile.bookMinimum}" line commonly used as a record-book benchmark for ${profile.displayName.toLowerCase()}.`);
  }

  return lines;
}

function tierKeyFor(profile: ScoringProfile, score: number): ScoreTier["key"] {
  const entry = profile.tiers.find((t) => score <= t.max) ?? profile.tiers[profile.tiers.length - 1];
  return entry.tier.key;
}
