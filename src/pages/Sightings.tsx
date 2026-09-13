import { useMemo, useState } from "react";
import { AntlerGlyph } from "../components/AntlerGlyph";
import { PhotoInput } from "../components/PhotoInput";
import { SPECIES, getSpecies, type IconKey } from "../data/species";
import { useConditions } from "../lib/useConditions";
import type { DeerClass, Sighting } from "../lib/types";
import { windCompass } from "../lib/weather";
import { useAppData } from "../store/AppData";
import { makeId } from "../store/useLocalCollection";

const TIME_WINDOWS: Sighting["timeOfDay"][] = ["dawn", "morning", "midday", "afternoon", "dusk", "night"];

export function Sightings() {
  const { sightings } = useAppData();
  const { moon, weather } = useConditions();
  const [formOpen, setFormOpen] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState<IconKey | "all">("all");
  const [filterClass, setFilterClass] = useState<DeerClass | "all">("all");

  const filtered = useMemo(() => {
    return sightings.items.filter(
      (s) => (filterSpecies === "all" || s.speciesId === filterSpecies) && (filterClass === "all" || s.deerClass === filterClass),
    );
  }, [sightings.items, filterSpecies, filterClass]);

  const handleSubmit = (draft: Omit<Sighting, "id" | "createdAt" | "moonPhaseName" | "moonIllumination" | "weatherTempF" | "weatherCondition" | "weatherWindMph">) => {
    const now = new Date().toISOString();
    sightings.add({
      ...draft,
      id: makeId(),
      createdAt: now,
      moonPhaseName: moon.phaseName,
      moonIllumination: moon.illumination,
      weatherTempF: weather?.tempF ?? null,
      weatherCondition: weather?.conditionLabel ?? null,
      weatherWindMph: weather?.windMph ?? null,
    });
    setFormOpen(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-rise">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="stamp text-xs uppercase tracking-[0.35em]">Sightings Log</p>
          <h1 className="font-display mt-2 text-3xl text-parchment sm:text-4xl">Every deer, on the record.</h1>
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full bg-rust-500 px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-rust-400"
        >
          {formOpen ? "Close form" : "+ Log a sighting"}
        </button>
      </header>

      {formOpen && (
        <div className="mt-6">
          <SightingForm
            moonLabel={moon.phaseName}
            weatherLabel={weather ? `${weather.tempF}°F, ${weather.conditionLabel}, wind ${weather.windMph}mph ${windCompass(weather.windDirDeg)}` : "unavailable"}
            onSubmit={handleSubmit}
          />
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
        <FilterPill active={filterSpecies === "all"} onClick={() => setFilterSpecies("all")} label="All species" />
        {SPECIES.map((s) => (
          <FilterPill key={s.id} active={filterSpecies === s.id} onClick={() => setFilterSpecies(s.id)} label={s.name.split(" ")[0]} />
        ))}
        <span className="mx-1 h-4 w-px bg-amber-300/15" />
        {(["all", "buck", "doe", "fawn", "shed"] as const).map((c) => (
          <FilterPill key={c} active={filterClass === c} onClick={() => setFilterClass(c)} label={c === "all" ? "All" : c} />
        ))}
      </div>

      <ol className="relative mt-8 space-y-5 border-l border-amber-300/15 pl-6">
        {filtered.length === 0 && (
          <p className="text-sm text-parchment/50">No sightings match these filters yet.</p>
        )}
        {filtered.map((s) => (
          <SightingRow key={s.id} sighting={s} onDelete={() => sightings.remove(s.id)} />
        ))}
      </ol>
    </div>
  );
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition ${
        active ? "border-amber-300/50 bg-fern-600/25 text-amber-200" : "border-amber-300/10 text-parchment/60 hover:border-amber-300/25"
      }`}
    >
      {label}
    </button>
  );
}

function SightingRow({ sighting, onDelete }: { sighting: Sighting; onDelete: () => void }) {
  const species = getSpecies(sighting.speciesId);
  return (
    <li className="relative">
      <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-ink-900 bg-amber-300" />
      <div className="panel texture-grain p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <AntlerGlyph species={sighting.speciesId} className="h-10 w-10 shrink-0 text-fern-400" />
            <div>
              <p className="font-display text-lg text-parchment">
                {species?.name} <span className="text-sm font-normal capitalize text-parchment/55">· {sighting.deerClass}</span>
                {sighting.points ? <span className="ml-1 text-sm text-amber-300">· {sighting.points}pt</span> : null}
              </p>
              <p className="text-xs text-parchment/45">
                {new Date(sighting.dateISO).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} ·{" "}
                <span className="capitalize">{sighting.timeOfDay}</span> · {sighting.locationLabel}
              </p>
            </div>
          </div>
          <button onClick={onDelete} className="text-xs text-parchment/35 hover:text-rust-400">
            Remove
          </button>
        </div>

        {sighting.photo && <img src={sighting.photo} alt="" className="mt-3 h-40 w-full rounded-lg object-cover" />}
        {sighting.notes && <p className="mt-3 text-sm text-parchment/70">{sighting.notes}</p>}

        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono text-parchment/50">
          <span className="rounded-full bg-ink-700/50 px-2.5 py-1">{sighting.moonPhaseName}</span>
          {sighting.weatherTempF !== null && (
            <span className="rounded-full bg-ink-700/50 px-2.5 py-1">
              {sighting.weatherTempF}°F · {sighting.weatherCondition}
            </span>
          )}
          {sighting.weatherWindMph !== null && (
            <span className="rounded-full bg-ink-700/50 px-2.5 py-1">wind {sighting.weatherWindMph}mph</span>
          )}
        </div>
      </div>
    </li>
  );
}

function SightingForm({
  onSubmit,
  moonLabel,
  weatherLabel,
}: {
  onSubmit: (draft: Omit<Sighting, "id" | "createdAt" | "moonPhaseName" | "moonIllumination" | "weatherTempF" | "weatherCondition" | "weatherWindMph">) => void;
  moonLabel: string;
  weatherLabel: string;
}) {
  const [speciesId, setSpeciesId] = useState<IconKey>("whitetail");
  const [deerClass, setDeerClass] = useState<DeerClass>("buck");
  const [points, setPoints] = useState("");
  const [dateISO, setDateISO] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeOfDay, setTimeOfDay] = useState<Sighting["timeOfDay"]>("dawn");
  const [locationLabel, setLocationLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationLabel.trim()) return;
    onSubmit({
      speciesId,
      deerClass,
      points: deerClass === "buck" && points ? Number(points) : null,
      dateISO: new Date(dateISO).toISOString(),
      timeOfDay,
      locationLabel: locationLabel.trim(),
      lat: null,
      lon: null,
      notes: notes.trim(),
      photo,
    });
  };

  return (
    <form onSubmit={submit} className="panel texture-grain space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Species">
          <select
            value={speciesId}
            onChange={(e) => setSpeciesId(e.target.value as IconKey)}
            className="input"
          >
            {SPECIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Class">
          <div className="flex gap-2">
            {(["buck", "doe", "fawn", "shed"] as const).map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setDeerClass(c)}
                className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium capitalize transition ${
                  deerClass === c ? "border-amber-300/50 bg-fern-600/25 text-amber-200" : "border-amber-300/10 text-parchment/60"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        {deerClass === "buck" && (
          <Field label="Points (optional)">
            <input type="number" min={0} max={30} value={points} onChange={(e) => setPoints(e.target.value)} className="input" placeholder="e.g. 8" />
          </Field>
        )}
        <Field label="Date">
          <input type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} className="input" />
        </Field>
        <Field label="Time of day">
          <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value as Sighting["timeOfDay"])} className="input">
            {TIME_WINDOWS.map((t) => (
              <option key={t} value={t} className="capitalize">
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input value={locationLabel} onChange={(e) => setLocationLabel(e.target.value)} className="input" placeholder="e.g. Cedar Creek bottom" required />
        </Field>
      </div>

      <Field label="Notes">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input resize-none" placeholder="Behavior, direction of travel, wind..." />
      </Field>

      <Field label="Photo (optional)">
        <PhotoInput value={photo} onChange={setPhoto} />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-300/10 pt-4">
        <p className="text-xs text-parchment/45 font-mono">
          Auto-tagging: {moonLabel} · {weatherLabel}
        </p>
        <button type="submit" className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-amber-300">
          Save sighting
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-parchment/50">{label}</span>
      {children}
    </label>
  );
}
