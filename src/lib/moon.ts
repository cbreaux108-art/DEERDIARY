// Astronomical moon-phase math. No network calls — pure synodic-month calculation
// anchored to a known new moon (2000-01-06 18:14 UTC).

const SYNODIC_MONTH_DAYS = 29.530588853;
const KNOWN_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);

export type MoonPhaseName =
  | "New Moon"
  | "Waxing Crescent"
  | "First Quarter"
  | "Waxing Gibbous"
  | "Full Moon"
  | "Waning Gibbous"
  | "Last Quarter"
  | "Waning Crescent";

export interface MoonInfo {
  /** 0..1 fraction through the synodic month, 0 = new moon */
  age: number;
  ageDays: number;
  illumination: number; // 0..1
  phaseName: MoonPhaseName;
  /** how close to new or full, 0 = exactly on one, 1 = exactly at quarter */
  proximityToExtreme: number;
  glyph: string;
}

export function getMoonInfo(date: Date = new Date()): MoonInfo {
  const diffDays = (date.getTime() - KNOWN_NEW_MOON_UTC) / 86_400_000;
  const age = ((diffDays % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
  const fraction = age / SYNODIC_MONTH_DAYS;
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;

  const phaseName = phaseNameFromFraction(fraction);
  const glyph = glyphFromFraction(fraction);

  // distance (0..0.25) to nearest major point (new=0, full=0.5) folded to 0..1
  const distToNew = Math.min(fraction, 1 - fraction);
  const distToFull = Math.abs(fraction - 0.5);
  const distToNearestMajor = Math.min(distToNew, distToFull); // 0..0.25
  const proximityToExtreme = 1 - distToNearestMajor / 0.25;

  return {
    age: fraction,
    ageDays: Math.round(age * 10) / 10,
    illumination,
    phaseName,
    proximityToExtreme,
    glyph,
  };
}

function phaseNameFromFraction(f: number): MoonPhaseName {
  if (f < 0.02 || f > 0.98) return "New Moon";
  if (f < 0.24) return "Waxing Crescent";
  if (f < 0.26) return "First Quarter";
  if (f < 0.49) return "Waxing Gibbous";
  if (f < 0.51) return "Full Moon";
  if (f < 0.74) return "Waning Gibbous";
  if (f < 0.76) return "Last Quarter";
  return "Waning Crescent";
}

function glyphFromFraction(f: number): string {
  const glyphs = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  const idx = Math.round(f * 8) % 8;
  return glyphs[idx];
}
