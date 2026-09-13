import { useMemo, useState } from "react";
import { AntlerGlyph } from "../components/AntlerGlyph";
import { PhotoInput } from "../components/PhotoInput";
import { SPECIES, type IconKey } from "../data/species";
import { getScoringProfile, scoreAntlers, type AntlerMeasurements } from "../lib/scoring";
import type { Trophy } from "../lib/types";
import { useAppData } from "../store/AppData";
import { makeId } from "../store/useLocalCollection";

const emptyMeasurements = (speciesId: IconKey): AntlerMeasurements => ({
  speciesId,
  insideSpread: 0,
  left: { mainBeam: 0, points: [0, 0, 0, 0], circumferences: [0, 0, 0, 0] },
  right: { mainBeam: 0, points: [0, 0, 0, 0], circumferences: [0, 0, 0, 0] },
  abnormalPoints: 0,
});

export function Trophies() {
  const { trophies } = useAppData();
  const [formOpen, setFormOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ranked = useMemo(() => [...trophies.items].sort((a, b) => b.score.netScore - a.score.netScore), [trophies.items]);

  const handleSave = (t: Trophy) => {
    trophies.add(t);
    setFormOpen(false);
    setExpandedId(t.id);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-rise">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="stamp text-xs uppercase tracking-[0.35em]">Trophy Room</p>
          <h1 className="font-display mt-2 text-3xl text-parchment sm:text-4xl">Show off the wall.</h1>
          <p className="mt-2 max-w-lg text-sm text-parchment/60">
            Enter your measurements and the DeerDiary AI Score engine — a Boone &amp; Crockett-style
            algorithmic scorer — grades the rack and ranks it against the rest of camp.
          </p>
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-full bg-rust-500 px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-rust-400"
        >
          {formOpen ? "Close form" : "+ Submit a trophy"}
        </button>
      </header>

      {formOpen && (
        <div className="mt-6">
          <TrophyForm onSave={handleSave} />
        </div>
      )}

      <div className="mt-10 space-y-4">
        {ranked.length === 0 && <p className="text-sm text-parchment/50">No trophies scored yet — be the first.</p>}
        {ranked.map((t, i) => (
          <TrophyCard
            key={t.id}
            trophy={t}
            rank={i + 1}
            expanded={expandedId === t.id}
            onToggle={() => setExpandedId(expandedId === t.id ? null : t.id)}
            onDelete={() => trophies.remove(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TrophyCard({
  trophy,
  rank,
  expanded,
  onToggle,
  onDelete,
}: {
  trophy: Trophy;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="panel texture-grain overflow-hidden">
      <button onClick={onToggle} className="flex w-full flex-wrap items-center gap-4 p-5 text-left">
        <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full border border-amber-300/25 text-amber-300">
          {rank}
        </span>
        {trophy.photo ? (
          <img src={trophy.photo} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
        ) : (
          <AntlerGlyph species={trophy.speciesId} className="h-14 w-14 shrink-0 text-fern-400" />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-lg text-parchment">{trophy.title}</p>
          <p className="text-xs text-parchment/50">
            {trophy.hunterName} · {trophy.locationLabel} ·{" "}
            {new Date(trophy.dateISO).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl text-amber-300">{trophy.score.netScore}"</p>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: `${trophy.score.tier.color}22`, color: trophy.score.tier.color }}
          >
            {trophy.score.tier.label}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-amber-300/10 p-5 sm:p-6">
          {trophy.notes && <p className="text-sm text-parchment/70">{trophy.notes}</p>}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="stamp text-xs uppercase tracking-[0.3em]">AI Score notes</p>
              <ul className="mt-2 space-y-1.5 text-sm text-parchment/70">
                {trophy.score.narrative.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-300">›</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="stamp text-xs uppercase tracking-[0.3em]">Breakdown</p>
              <div className="mt-2 overflow-hidden rounded-lg border border-amber-300/10">
                <table className="w-full text-xs">
                  <thead className="bg-ink-800/60 text-parchment/50">
                    <tr>
                      <th className="px-2.5 py-1.5 text-left font-medium">Measure</th>
                      <th className="px-2.5 py-1.5 text-right font-medium">L</th>
                      <th className="px-2.5 py-1.5 text-right font-medium">R</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trophy.score.rows.map((r) => (
                      <tr key={r.label} className="border-t border-amber-300/5 text-parchment/70">
                        <td className="px-2.5 py-1.5">{r.label}</td>
                        <td className="px-2.5 py-1.5 text-right font-mono">{r.left?.toFixed(1)}</td>
                        <td className="px-2.5 py-1.5 text-right font-mono">{r.right?.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <MiniStat label="Gross" value={`${trophy.score.grossScore}"`} />
                <MiniStat label="Deductions" value={`-${trophy.score.symmetryDeduction}"`} />
                <MiniStat label="Net" value={`${trophy.score.netScore}"`} />
              </div>
            </div>
          </div>

          <button onClick={onDelete} className="mt-4 text-xs text-parchment/35 hover:text-rust-400">
            Remove trophy
          </button>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-800/50 py-2">
      <p className="font-mono text-sm text-amber-200">{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-parchment/40">{label}</p>
    </div>
  );
}

function TrophyForm({ onSave }: { onSave: (t: Trophy) => void }) {
  const [speciesId, setSpeciesId] = useState<IconKey>("whitetail");
  const [hunterName, setHunterName] = useState("");
  const [title, setTitle] = useState("");
  const [dateISO, setDateISO] = useState(() => new Date().toISOString().slice(0, 10));
  const [locationLabel, setLocationLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [m, setM] = useState<AntlerMeasurements>(() => emptyMeasurements("whitetail"));

  const profile = getScoringProfile(speciesId);
  const preview = scoreAntlers(m);

  const updateSide = (side: "left" | "right", patch: Partial<AntlerMeasurements["left"]>) => {
    setM((prev) => ({ ...prev, [side]: { ...prev[side], ...patch } }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hunterName.trim() || !locationLabel.trim()) return;
    onSave({
      id: makeId(),
      hunterName: hunterName.trim(),
      speciesId,
      title: title.trim(),
      dateISO: new Date(dateISO).toISOString(),
      locationLabel: locationLabel.trim(),
      notes: notes.trim(),
      photo,
      measurements: m,
      score: scoreAntlers(m),
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={submit} className="panel texture-grain space-y-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Species">
          <select
            value={speciesId}
            onChange={(e) => {
              const next = e.target.value as IconKey;
              setSpeciesId(next);
              setM((prev) => ({ ...prev, speciesId: next }));
            }}
            className="input"
          >
            {SPECIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Hunter">
          <input value={hunterName} onChange={(e) => setHunterName(e.target.value)} className="input" placeholder="Your name" required />
        </Field>
        <Field label="Trophy title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="e.g. Cedar Creek Ten-Point" required />
        </Field>
        <Field label="Date taken">
          <input type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} className="input" />
        </Field>
        <Field label="Location">
          <input value={locationLabel} onChange={(e) => setLocationLabel(e.target.value)} className="input" placeholder="Where'd you get him?" required />
        </Field>
      </div>

      <Field label="Story (optional)">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input resize-none" />
      </Field>

      <Field label="Photo (optional)">
        <PhotoInput value={photo} onChange={setPhoto} />
      </Field>

      <div className="border-t border-amber-300/10 pt-5">
        <p className="stamp text-xs uppercase tracking-[0.3em]">Antler measurements (inches)</p>
        <Field label="Inside spread">
          <input
            type="number"
            min={0}
            step={0.1}
            value={m.insideSpread || ""}
            onChange={(e) => setM((prev) => ({ ...prev, insideSpread: Number(e.target.value) || 0 }))}
            className="input mt-1 max-w-[10rem]"
          />
        </Field>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SideInputs label="Left side" side={m.left} onChange={(patch) => updateSide("left", patch)} />
          <SideInputs label="Right side" side={m.right} onChange={(patch) => updateSide("right", patch)} />
        </div>

        <Field label="Abnormal / kicker points, total inches (optional)">
          <input
            type="number"
            min={0}
            step={0.1}
            value={m.abnormalPoints || ""}
            onChange={(e) => setM((prev) => ({ ...prev, abnormalPoints: Number(e.target.value) || 0 }))}
            className="input mt-1 max-w-[10rem]"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-amber-300/10 pt-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-parchment/45">Live AI score preview</p>
          <p className="font-display text-3xl text-amber-300">
            {preview.netScore}" <span className="text-base font-sans text-parchment/50">net</span>
          </p>
          <p className="text-xs" style={{ color: preview.tier.color }}>
            {preview.tier.label} · book range starts at {profile.bookMinimum}"
          </p>
        </div>
        <button type="submit" className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-amber-300">
          Save trophy
        </button>
      </div>
    </form>
  );
}

function SideInputs({
  label,
  side,
  onChange,
}: {
  label: string;
  side: AntlerMeasurements["left"];
  onChange: (patch: Partial<AntlerMeasurements["left"]>) => void;
}) {
  return (
    <div className="rounded-xl border border-amber-300/10 bg-ink-800/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-parchment/60">{label}</p>
      <Field label="Main beam">
        <input
          type="number"
          min={0}
          step={0.1}
          value={side.mainBeam || ""}
          onChange={(e) => onChange({ mainBeam: Number(e.target.value) || 0 })}
          className="input mt-1"
        />
      </Field>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {side.points.map((p, i) => (
          <label key={i} className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-parchment/40">Point G{i + 1}</span>
            <input
              type="number"
              min={0}
              step={0.1}
              value={p || ""}
              onChange={(e) => {
                const points = [...side.points];
                points[i] = Number(e.target.value) || 0;
                onChange({ points });
              }}
              className="input"
            />
          </label>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {side.circumferences.map((c, i) => (
          <label key={i} className="block">
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-parchment/40">Mass H{i + 1}</span>
            <input
              type="number"
              min={0}
              step={0.1}
              value={c || ""}
              onChange={(e) => {
                const circumferences = [...side.circumferences];
                circumferences[i] = Number(e.target.value) || 0;
                onChange({ circumferences });
              }}
              className="input"
            />
          </label>
        ))}
      </div>
    </div>
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
