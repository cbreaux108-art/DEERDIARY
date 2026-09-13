import type { MoonInfo } from "./moon";
import type { WeatherSnapshot } from "./weather";

export interface ActivityForecast {
  score: number; // 0..100
  grade: "Slow" | "Fair" | "Good" | "Prime" | "Peak";
  factors: { label: string; impact: number; note: string }[];
  bestWindows: string[];
}

/**
 * Rule-based "movement forecast" blending solunar theory (moon phase & major/minor
 * periods) with barometric-pressure and temperature deer-movement heuristics
 * commonly cited by whitetail biologists. This is a heuristic estimate, not a guarantee.
 */
export function forecastActivity(moon: MoonInfo, weather: WeatherSnapshot | null, month: number): ActivityForecast {
  const factors: ActivityForecast["factors"] = [];
  let score = 45;

  const moonImpact = Math.round(moon.proximityToExtreme * 26) - 6;
  score += moonImpact;
  factors.push({
    label: "Moon phase",
    impact: moonImpact,
    note:
      moon.phaseName === "New Moon" || moon.phaseName === "Full Moon"
        ? `${moon.phaseName} — deer feed heavily under strong lunar pull, expect a dawn/dusk surge.`
        : `${moon.phaseName} — moderate lunar influence on movement timing.`,
  });

  if (weather) {
    let pressureImpact = 0;
    if (weather.pressureTrend === "falling") {
      pressureImpact = 18;
      factors.push({
        label: "Barometric pressure",
        impact: pressureImpact,
        note: "Falling pressure ahead of a front — deer often move early to feed before weather turns.",
      });
    } else if (weather.pressureTrend === "rising") {
      pressureImpact = 10;
      factors.push({
        label: "Barometric pressure",
        impact: pressureImpact,
        note: "Rising pressure after a front clears — a reliable green light for daylight movement.",
      });
    } else {
      pressureImpact = -4;
      factors.push({
        label: "Barometric pressure",
        impact: pressureImpact,
        note: "Stable/high pressure — deer settle into normal, less predictable patterns.",
      });
    }
    score += pressureImpact;

    let windImpact = 0;
    if (weather.windMph <= 8) {
      windImpact = 8;
      factors.push({ label: "Wind", impact: windImpact, note: "Calm wind — deer move confidently and scent travels predictably." });
    } else if (weather.windMph <= 15) {
      windImpact = 0;
      factors.push({ label: "Wind", impact: windImpact, note: "Moderate wind — movement continues but deer stay a bit more alert." });
    } else {
      windImpact = -14;
      factors.push({ label: "Wind", impact: windImpact, note: "Strong wind — deer bed down more and shift to thicker cover." });
    }
    score += windImpact;

    const rutBoost = isRutWindow(month) ? 10 : 0;
    if (rutBoost) {
      score += rutBoost;
      factors.push({ label: "Season", impact: rutBoost, note: "Rut window — bucks are cruising and daylight movement spikes." });
    }

    const coldSnapImpact = weather.tempF < seasonalNormF(month) - 12 ? 10 : 0;
    if (coldSnapImpact) {
      score += coldSnapImpact;
      factors.push({ label: "Cold snap", impact: coldSnapImpact, note: "Temps well below normal — deer move more in daylight to feed and conserve energy at night." });
    }
  }

  score = Math.max(4, Math.min(98, Math.round(score)));

  const grade: ActivityForecast["grade"] =
    score >= 85 ? "Peak" : score >= 68 ? "Prime" : score >= 48 ? "Good" : score >= 28 ? "Fair" : "Slow";

  const bestWindows = buildWindows(moon, grade);

  return { score, grade, factors, bestWindows };
}

function isRutWindow(month: number): boolean {
  // Northern-hemisphere whitetail rut roughly runs late Oct through Dec (months 10-12, 1-indexed).
  return month === 10 || month === 11 || month === 12;
}

function seasonalNormF(month: number): number {
  const normals = [32, 36, 45, 55, 65, 75, 80, 78, 70, 58, 46, 35];
  return normals[(month - 1 + 12) % 12];
}

function buildWindows(moon: MoonInfo, grade: ActivityForecast["grade"]): string[] {
  const base = ["Dawn — first light to 8:30am", "Dusk — last 90 minutes of shooting light"];
  if (moon.proximityToExtreme > 0.75) {
    base.push("Midday lull is shorter than usual — stay alert through the day");
  }
  if (grade === "Peak" || grade === "Prime") {
    base.push("Consider an all-day sit — movement likely stays elevated");
  }
  return base;
}
