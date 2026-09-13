export type IconKey = "whitetail" | "mule-deer" | "blacktail" | "coues" | "sika" | "axis";

export interface DeerSpecies {
  id: IconKey;
  name: string;
  latinName: string;
  region: string;
  avgWeight: string;
  icon: IconKey;
  summary: string;
  weatherAdaptation: string;
  moonAdaptation: string;
  antlerNote: string;
  bestConditions: string[];
}

export const SPECIES: DeerSpecies[] = [
  {
    id: "whitetail",
    name: "Whitetail Deer",
    latinName: "Odocoileus virginianus",
    region: "Eastern & central North America",
    avgWeight: "130–220 lb (bucks)",
    icon: "whitetail",
    summary:
      "The most widespread deer in North America. Edge-and-cover specialists that thrive anywhere fields meet timber.",
    weatherAdaptation:
      "Whitetails feed hard ahead of falling barometric pressure and cold fronts, then bed tight through wind and heavy rain. A 15°F+ overnight temperature drop reliably triggers a daylight feeding push.",
    moonAdaptation:
      "Movement clusters around moonrise and moonset. Full and new moons intensify dawn/dusk feeding, while a mid-sky moon at midday can pull nocturnal deer into a brief daytime lull-break.",
    antlerNote: "Typical frames run 8–10 points; mass and tine length build fastest at 4.5–6.5 years old.",
    bestConditions: ["Falling pressure", "Post-cold-front mornings", "Light or no wind", "Rut window (late Oct–Dec)"],
  },
  {
    id: "mule-deer",
    name: "Mule Deer",
    latinName: "Odocoileus hemionus",
    region: "Western North America, high plains & mountains",
    avgWeight: "150–300 lb (bucks)",
    icon: "mule-deer",
    summary:
      "Big-eared, big-country deer known for stotting bounds and wide, heavy-beamed antlers. Elevation migrators that follow the snow line.",
    weatherAdaptation:
      "Highly sensitive to elevation and snowpack — early snow pushes herds off high basins toward wintering ground days before a storm actually arrives. Bucks bed on lee slopes in high wind.",
    moonAdaptation:
      "Feeds in open sage and alpine basins under bright moonlight, shifting activity later into the morning on dark, new-moon nights when visibility is poor.",
    antlerNote: "Bifurcated (forked) tine structure rather than points off a single beam; width and mass define trophy class.",
    bestConditions: ["First snow at elevation", "Clear, calm mornings", "Pre-rut (Nov)", "Migration corridors"],
  },
  {
    id: "blacktail",
    name: "Columbia Blacktail",
    latinName: "Odocoileus hemionus columbianus",
    region: "Pacific coastal rainforest, US & Canada",
    avgWeight: "120–200 lb (bucks)",
    icon: "blacktail",
    summary:
      "A mule-deer subspecies adapted to dense, wet coastal timber. Secretive and thick-cover oriented — widely considered the hardest North American deer to pattern.",
    weatherAdaptation:
      "Thrives in the coastal drizzle-and-fog cycle; a rare clear, calm break in weeks of rain often triggers a strong feeding push in clearcuts and forest edges.",
    moonAdaptation:
      "Cloud cover common to its range mutes lunar influence most nights, but on the rare clear night around a full moon, blacktail activity shifts noticeably later toward moonrise.",
    antlerNote: "Smaller-bodied and smaller-antlered than interior mule deer, but proportionally heavy-beamed.",
    bestConditions: ["Break in rain", "Fog lifting at dawn", "Rut (mid-Nov)", "Clearcut edges at last light"],
  },
  {
    id: "coues",
    name: "Coues Deer",
    latinName: "Odocoileus virginianus couesi",
    region: "Sky-island mountains, AZ/NM & northern Mexico",
    avgWeight: "65–110 lb (bucks)",
    icon: "coues",
    summary:
      'The "gray ghost" of the Southwest — a small, desert-adapted whitetail subspecies famous for vanishing into sparse oak and manzanita cover.',
    weatherAdaptation:
      "Monsoon-dependent: summer rains green up feed and concentrate deer near new growth. Extreme heat pushes almost all movement into the first and last hour of daylight.",
    moonAdaptation:
      "Because desert nights are so exposed, bright moon phases push Coues deer to feed almost entirely after dark, making dark, new-moon mornings the best bet for daylight glassing.",
    antlerNote: "Small-bodied, tall-tined frames — a mature Coues buck can look enormous relative to its body size.",
    bestConditions: ["Cool mornings after monsoon rain", "New moon", "Late Jan rut", "Glassing from elevation at first light"],
  },
  {
    id: "sika",
    name: "Sika Deer",
    latinName: "Cervus nippon",
    region: "East Asia native; established Atlantic coast, US",
    avgWeight: "80–140 lb (stags)",
    icon: "sika",
    summary:
      "A small, elk-like deer known for an eerie, whistling rut call. Marsh and swamp specialists in its introduced Atlantic-coast range.",
    weatherAdaptation:
      "Comfortable in cold, wet marsh conditions; a hard frost after a warm spell often triggers a strong rutting push in stags.",
    moonAdaptation:
      "Marsh cover keeps sika active around the clock, but bright full moons still concentrate feeding activity into shorter, more intense dawn and dusk windows.",
    antlerNote: "Simple 3x3 typical frame — trophy quality is judged on beam length, mass and brow-tine height rather than point count.",
    bestConditions: ["First hard frost", "Rut (Sept–Oct)", "Dawn fog over marsh", "Calm, humid evenings"],
  },
  {
    id: "axis",
    name: "Axis Deer",
    latinName: "Axis axis",
    region: "India native; established Texas Hill Country",
    avgWeight: "150–250 lb (stags)",
    icon: "axis",
    summary:
      "The spotted deer — strikingly marked and unusual among deer for breeding year-round rather than on a single autumn rut.",
    weatherAdaptation:
      "Because breeding isn't locked to a fall rut, axis activity tracks rainfall and forage green-up more than temperature — a rain event can trigger a rut response in any season.",
    moonAdaptation:
      "Herding behavior around water sources means moon phase mostly shifts timing rather than volume of movement — bright nights push feeding later into the morning.",
    antlerNote: "Classic 3-tine (6-point) frame; trophy quality is almost entirely about main beam length and mass.",
    bestConditions: ["48–72 hrs after rain", "Any-season stags in hard antler", "Cool early mornings", "Near permanent water"],
  },
];

export function getSpecies(id: string): DeerSpecies | undefined {
  return SPECIES.find((s) => s.id === id);
}
