import { createContext, useContext, type ReactNode } from "react";
import { SEED_SIGHTINGS, SEED_TROPHIES } from "../data/seed";
import type { Sighting, Trophy } from "../lib/types";
import { useLocalCollection } from "./useLocalCollection";

interface AppDataValue {
  sightings: ReturnType<typeof useLocalCollection<Sighting>>;
  trophies: ReturnType<typeof useLocalCollection<Trophy>>;
}

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const sightings = useLocalCollection<Sighting>("deerdiary.sightings.v1", SEED_SIGHTINGS);
  const trophies = useLocalCollection<Trophy>("deerdiary.trophies.v1", SEED_TROPHIES);

  return <AppDataContext.Provider value={{ sightings, trophies }}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
