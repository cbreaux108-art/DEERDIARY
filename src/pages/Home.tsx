import { Link } from "react-router-dom";
import { AntlerGlyph } from "../components/AntlerGlyph";
import { Gauge } from "../components/Gauge";
import { MoonDial } from "../components/MoonDial";
import { getSpecies, SPECIES } from "../data/species";
import { forecastActivity } from "../lib/activity";
import { useConditions } from "../lib/useConditions";
import { windCompass } from "../lib/weather";
import { useAppData } from "../store/AppData";

export function Home() {
  const { moon, weather, weatherStatus, usingFallbackLocation } = useConditions();
  const { sightings, trophies } = useAppData();
  const forecast = forecastActivity(moon, weather, new Date().getMonth() + 1);

  const speciesCounts = new Map<string, number>();
  for (const s of sightings.items) speciesCounts.set(s.speciesId, (speciesCounts.get(s.speciesId) ?? 0) + 1);
  const topSpeciesId = [...speciesCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const topSpecies = topSpeciesId ? getSpecies(topSpeciesId) : undefined;

  const bestTrophy = [...trophies.items].sort((a, b) => b.score.netScore - a.score.netScore)[0];

  return (
    <div className="animate-rise">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-amber-300/10">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]">
          <AntlerGlyph species="whitetail" className="h-[42rem] w-[42rem] text-amber-200" strokeWidth={1.4} />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="stamp text-sm uppercase tracking-[0.35em] text-amber-300/80">Est. in the deer stand</p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold leading-[1.05] text-parchment sm:text-6xl">
            Know the woods <span className="italic text-amber-300">before</span> you're in them.
          </h1>
          <p className="mt-5 max-w-xl text-base text-parchment/70 sm:text-lg">
            DeerDiary tracks how whitetail, mule deer, and their kin move with the moon and weather — log
            sightings, watch the movement forecast, and let the score engine judge your best bucks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/sightings"
              className="rounded-full bg-rust-500 px-6 py-3 text-sm font-semibold text-parchment shadow-panel transition hover:bg-rust-400"
            >
              Log a sighting
            </Link>
            <Link
              to="/trophies"
              className="rounded-full border border-amber-300/30 px-6 py-3 text-sm font-semibold text-amber-200 transition hover:bg-ink-700/50"
            >
              Score a trophy
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          {/* Conditions panel */}
          <div className="panel texture-grain p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl text-parchment">Tonight's Conditions</h2>
              <span className="rounded-full bg-ink-700/60 px-3 py-1 font-mono text-[11px] text-parchment/60">
                {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <MoonDial moon={moon} size={92} />
                <div>
                  <p className="font-display text-lg text-amber-200">{moon.phaseName}</p>
                  <p className="font-mono text-xs text-parchment/55">
                    {Math.round(moon.illumination * 100)}% illuminated · day {moon.ageDays} of cycle
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Gauge score={forecast.score} />
                <p className="font-mono text-xs uppercase tracking-widest text-parchment/60">
                  Movement forecast · <span className="text-amber-300">{forecast.grade}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatChip label="Temp" value={weather ? `${weather.tempF}°F` : "—"} />
              <StatChip label="Wind" value={weather ? `${weather.windMph} mph ${windCompass(weather.windDirDeg)}` : "—"} />
              <StatChip label="Pressure" value={weather ? weather.pressureTrend : "—"} />
              <StatChip label="Sky" value={weather ? weather.conditionLabel : "—"} />
            </div>

            {weatherStatus === "error" && (
              <p className="mt-4 text-xs text-rust-400/80">Couldn't reach the weather service — showing moon data only.</p>
            )}
            {weatherStatus === "ready" && (
              <p className="mt-4 text-xs text-parchment/40">
                {usingFallbackLocation ? "Using a general reference location." : weather?.locationLabel} · updated{" "}
                {weather ? new Date(weather.fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
              </p>
            )}

            <ul className="mt-5 space-y-2 border-t border-amber-300/10 pt-4">
              {forecast.factors.map((f) => (
                <li key={f.label} className="flex gap-3 text-sm">
                  <span
                    className={`mt-0.5 w-14 shrink-0 font-mono text-xs ${f.impact >= 0 ? "text-fern-400" : "text-rust-400"}`}
                  >
                    {f.impact >= 0 ? "+" : ""}
                    {f.impact}
                  </span>
                  <span className="text-parchment/70">{f.note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick stats + shortcuts */}
          <div className="flex flex-col gap-5">
            <div className="panel grid grid-cols-3 divide-x divide-amber-300/10 p-5 text-center">
              <StatBig value={sightings.items.length} label="Sightings logged" />
              <StatBig value={trophies.items.length} label="Trophies scored" />
              <StatBig value={topSpecies ? topSpecies.name.split(" ")[0] : "—"} label="Most spotted" small />
            </div>

            {bestTrophy && (
              <Link to="/trophies" className="panel texture-grain group relative overflow-hidden p-6">
                <p className="stamp text-xs uppercase tracking-[0.3em]">Top of the wall</p>
                <div className="mt-3 flex items-center gap-4">
                  <AntlerGlyph species={bestTrophy.speciesId} className="h-16 w-16 text-amber-300" />
                  <div>
                    <p className="font-display text-lg text-parchment group-hover:text-amber-200">{bestTrophy.title}</p>
                    <p className="font-mono text-sm text-amber-300">{bestTrophy.score.netScore}" net · {bestTrophy.score.tier.label}</p>
                  </div>
                </div>
              </Link>
            )}

            <div className="panel p-6">
              <p className="stamp text-xs uppercase tracking-[0.3em]">Field guide</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {SPECIES.slice(0, 6).map((s) => (
                  <Link
                    key={s.id}
                    to="/field-guide"
                    className="group flex flex-col items-center gap-1.5 rounded-xl border border-amber-300/10 bg-ink-800/40 py-3 transition hover:border-amber-300/30 hover:bg-ink-700/50"
                  >
                    <AntlerGlyph species={s.id} className="h-9 w-9 text-fern-400 group-hover:text-amber-300" />
                    <span className="text-center text-[11px] leading-tight text-parchment/65">{s.name.split(" ")[0]}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-amber-300/10 bg-ink-800/50 px-3 py-2.5 text-center">
      <p className="font-mono text-sm text-amber-200">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-parchment/45">{label}</p>
    </div>
  );
}

function StatBig({ value, label, small }: { value: string | number; label: string; small?: boolean }) {
  return (
    <div className="px-1">
      <p className={`font-display text-amber-200 ${small ? "text-lg" : "text-2xl"}`}>{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-parchment/45">{label}</p>
    </div>
  );
}
