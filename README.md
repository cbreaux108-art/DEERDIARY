# DeerDiary

A field journal for deer hunters — track sightings, decode how moon phase and
weather drive deer movement, and score trophy antlers.

## Features

- **Camp (home dashboard)** — live moon phase, a real-time weather snapshot
  (via [Open-Meteo](https://open-meteo.com), no API key required), and a
  rule-based "movement forecast" gauge that blends lunar phase, barometric
  pressure trend, wind, temperature and rut timing.
- **Field Guide** — six deer species/subspecies (whitetail, mule deer,
  Columbia blacktail, Coues deer, sika, axis), each with how it specifically
  adapts to weather and moon cycles.
- **Sightings log** — log a sighting with species, class (buck/doe/fawn/shed),
  point count, location, notes and an optional photo. Moon phase and current
  weather are auto-tagged onto every entry.
- **Trophy Room** — enter antler measurements (main beams, point lengths,
  mass circumferences, inside spread) and the **DeerDiary AI Score** engine —
  a deterministic, Boone & Crockett-style scoring algorithm — computes a
  gross/net score, symmetry deductions, a trophy tier, and narrative notes,
  then ranks your trophies on a leaderboard.

All antler glyphs, the moon phase dial, and the movement-forecast gauge are
hand-drawn SVG, procedurally shaped from each species' own data rather than
static images.

## Data & persistence

This is a client-only app: sightings and trophies are stored in the
browser's `localStorage`. There is no backend or account system.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router
- Open-Meteo (weather + geocoding, keyless)

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```
