import { scoreAntlers } from "../lib/scoring";
import type { Sighting, Trophy } from "../lib/types";

export const SEED_SIGHTINGS: Sighting[] = [
  {
    id: "seed-s1",
    speciesId: "whitetail",
    deerClass: "buck",
    points: 10,
    dateISO: daysAgo(2),
    timeOfDay: "dusk",
    locationLabel: "Cedar Creek bottom, back 40",
    lat: null,
    lon: null,
    notes: "Cruising the fence line hard, chasing a doe. Didn't stop long enough for a shot.",
    photo: null,
    moonPhaseName: "Waxing Gibbous",
    moonIllumination: 0.78,
    weatherTempF: 41,
    weatherCondition: "Clear",
    weatherWindMph: 4,
    createdAt: daysAgo(2),
  },
  {
    id: "seed-s2",
    speciesId: "mule-deer",
    deerClass: "buck",
    points: 4,
    dateISO: daysAgo(6),
    timeOfDay: "dawn",
    locationLabel: "Sage basin, north rim",
    lat: null,
    lon: null,
    notes: "Bedded on the lee slope out of the wind, moved into the open around 7:15am.",
    photo: null,
    moonPhaseName: "First Quarter",
    moonIllumination: 0.5,
    weatherTempF: 28,
    weatherCondition: "Partly cloudy",
    weatherWindMph: 11,
    createdAt: daysAgo(6),
  },
  {
    id: "seed-s3",
    speciesId: "whitetail",
    deerClass: "doe",
    points: null,
    dateISO: daysAgo(9),
    timeOfDay: "morning",
    locationLabel: "Oak flat, east ridge",
    lat: null,
    lon: null,
    notes: "Group of four does and two fawns feeding on acorns for almost an hour.",
    photo: null,
    moonPhaseName: "New Moon",
    moonIllumination: 0.02,
    weatherTempF: 52,
    weatherCondition: "Overcast",
    weatherWindMph: 6,
    createdAt: daysAgo(9),
  },
];

const whitetailMeasurements = {
  speciesId: "whitetail" as const,
  insideSpread: 19.2,
  left: { mainBeam: 23.4, points: [4.1, 8.6, 7.2, 5.0], circumferences: [4.8, 4.6, 4.3, 3.9] },
  right: { mainBeam: 23.0, points: [3.9, 8.9, 7.0, 4.6], circumferences: [4.9, 4.5, 4.2, 3.8] },
  abnormalPoints: 1.5,
};

const muleDeerMeasurements = {
  speciesId: "mule-deer" as const,
  insideSpread: 26.5,
  left: { mainBeam: 25.1, points: [10.2, 9.4], circumferences: [5.1, 4.7, 4.2, 3.6] },
  right: { mainBeam: 24.6, points: [9.8, 9.1], circumferences: [5.0, 4.6, 4.0, 3.5] },
  abnormalPoints: 0,
};

export const SEED_TROPHIES: Trophy[] = [
  {
    id: "seed-t1",
    hunterName: "Cody B.",
    speciesId: "whitetail",
    title: "Cedar Creek Ten-Point",
    dateISO: daysAgo(320),
    locationLabel: "Cedar Creek bottom, back 40",
    notes: "Caught him slipping through the fence row right at last light on a falling-pressure evening.",
    photo: null,
    measurements: whitetailMeasurements,
    score: scoreAntlers(whitetailMeasurements),
    createdAt: daysAgo(320),
  },
  {
    id: "seed-t2",
    hunterName: "Cody B.",
    speciesId: "mule-deer",
    title: "North Rim Wide-Nine",
    dateISO: daysAgo(650),
    locationLabel: "Sage basin, north rim",
    notes: "Glassed him bedded at 400 yards for two hours before he finally stood up.",
    photo: null,
    measurements: muleDeerMeasurements,
    score: scoreAntlers(muleDeerMeasurements),
    createdAt: daysAgo(650),
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
