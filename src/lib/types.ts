import type { IconKey } from "../data/species";
import type { AntlerMeasurements, ScoreResult } from "./scoring";

export type DeerClass = "buck" | "doe" | "fawn" | "shed";

export interface Sighting {
  id: string;
  speciesId: IconKey;
  deerClass: DeerClass;
  points: number | null;
  dateISO: string;
  timeOfDay: "dawn" | "morning" | "midday" | "afternoon" | "dusk" | "night";
  locationLabel: string;
  lat: number | null;
  lon: number | null;
  notes: string;
  photo: string | null;
  moonPhaseName: string;
  moonIllumination: number;
  weatherTempF: number | null;
  weatherCondition: string | null;
  weatherWindMph: number | null;
  createdAt: string;
}

export interface Trophy {
  id: string;
  hunterName: string;
  speciesId: IconKey;
  title: string;
  dateISO: string;
  locationLabel: string;
  notes: string;
  photo: string | null;
  measurements: AntlerMeasurements;
  score: ScoreResult;
  createdAt: string;
}
