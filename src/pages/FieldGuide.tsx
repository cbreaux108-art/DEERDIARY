import { useState } from "react";
import { AntlerGlyph } from "../components/AntlerGlyph";
import { MoonDial } from "../components/MoonDial";
import { getMoonInfo } from "../lib/moon";
import { SPECIES, type DeerSpecies } from "../data/species";

export function FieldGuide() {
  const [activeId, setActiveId] = useState(SPECIES[0].id);
  const active = SPECIES.find((s) => s.id === activeId) as DeerSpecies;
  const moon = getMoonInfo();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 animate-rise">
      <header className="max-w-2xl">
        <p className="stamp text-xs uppercase tracking-[0.35em]">Field Guide</p>
        <h1 className="font-display mt-2 text-3xl text-parchment sm:text-4xl">Six deer, six sets of rules.</h1>
        <p className="mt-3 text-parchment/65">
          Every species reads weather and the moon a little differently. Pick one below to see how it adapts —
          and when it's most likely to be on its feet.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {SPECIES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              s.id === activeId
                ? "border-amber-300/50 bg-fern-600/25 text-amber-200"
                : "border-amber-300/10 bg-ink-800/40 text-parchment/65 hover:border-amber-300/25"
            }`}
          >
            <AntlerGlyph species={s.id} className="h-5 w-5" />
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="panel texture-grain p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-parchment">{active.name}</h2>
              <p className="mt-0.5 font-mono text-sm italic text-amber-300/80">{active.latinName}</p>
            </div>
            <AntlerGlyph species={active.id} className="h-16 w-16 shrink-0 text-amber-300" />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-amber-300/10 py-4 text-sm sm:grid-cols-3">
            <Field label="Range" value={active.region} />
            <Field label="Weight" value={active.avgWeight} />
            <Field label="Antler note" value={active.antlerNote} />
          </dl>

          <p className="mt-5 text-parchment/75">{active.summary}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoBlock icon="weather" title="Weather adaptation" text={active.weatherAdaptation} />
            <InfoBlock icon="moon" title="Moon adaptation" text={active.moonAdaptation} />
          </div>

          <div className="mt-6">
            <p className="stamp text-xs uppercase tracking-[0.3em]">Best conditions to hunt {active.name.split(" ")[0]}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {active.bestConditions.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-fern-500/30 bg-fern-600/10 px-3 py-1 text-xs text-fern-400"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="panel p-6">
          <p className="stamp text-xs uppercase tracking-[0.3em]">Right now</p>
          <div className="mt-4 flex items-center gap-4">
            <MoonDial moon={moon} size={70} />
            <div>
              <p className="font-display text-lg text-amber-200">{moon.phaseName}</p>
              <p className="text-xs text-parchment/55">{Math.round(moon.illumination * 100)}% illuminated</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-parchment/65">
            {moon.proximityToExtreme > 0.6
              ? `Strong lunar pull tonight — expect ${active.name.toLowerCase()} to feed hard around dawn and dusk.`
              : `Moderate lunar influence tonight — movement for ${active.name.toLowerCase()} will lean more on weather than the moon.`}
          </p>

          <div className="mt-6 border-t border-amber-300/10 pt-4">
            <p className="stamp text-xs uppercase tracking-[0.3em]">Compare species</p>
            <ul className="mt-3 space-y-2">
              {SPECIES.filter((s) => s.id !== active.id).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setActiveId(s.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-parchment/65 transition hover:bg-ink-700/50 hover:text-amber-200"
                  >
                    <AntlerGlyph species={s.id} className="h-5 w-5 text-fern-400" />
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-parchment/40">{label}</p>
      <p className="mt-0.5 text-parchment/85">{value}</p>
    </div>
  );
}

function InfoBlock({ icon, title, text }: { icon: "weather" | "moon"; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-amber-300/10 bg-ink-800/40 p-4">
      <div className="flex items-center gap-2 text-amber-300">
        {icon === "weather" ? <CloudIcon /> : <MoonIcon />}
        <p className="text-xs font-semibold uppercase tracking-wider">{title}</p>
      </div>
      <p className="mt-2 text-sm text-parchment/70">{text}</p>
    </div>
  );
}

function CloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 18a4 4 0 1 1 .7-7.94A5.5 5.5 0 0 1 18 12.5 3.5 3.5 0 0 1 17.5 18H7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
