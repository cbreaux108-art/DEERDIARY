# DeerDiary

A field journal for deer hunters — track sightings, decode how moon phase and
weather drive deer movement, and score trophy antlers.

**Live:** https://cbreaux108-art.github.io/DEERDIARY/ (deployed automatically
by `.github/workflows/deploy-pages.yml` — see [Deployment](#deployment)).

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

## Deployment

Pushing to `main` (or this branch) triggers
`.github/workflows/deploy-pages.yml`, which builds the site with
`GH_PAGES=true` (so asset paths are prefixed for `/DEERDIARY/`) and deploys
it via GitHub Pages. It can also be run manually from the **Actions** tab.

**One-time setup required:** in the repo's **Settings → Pages**, set
**Build and deployment → Source** to **GitHub Actions**. Until that's set,
the workflow will run but Pages won't actually serve the result.

## Mobile app (Android / iOS)

The web app is wrapped with [Capacitor](https://capacitorjs.com) into native
`android/` and `ios/` projects, so it can be built and submitted as a real
App Store / Play Store app. App id: `com.deerdiary.app`.

```bash
npm run cap:sync     # build the web app and copy it into android/ + ios/
```

Run this after any change to `src/` before rebuilding either native app —
the native projects load a bundled copy of `dist/`, not the dev server.

### Android (Play Store)

Easiest path — no local Android Studio needed:

1. Push this branch (or merge to `main`) so GitHub Actions runs
   `.github/workflows/android-build.yml`, or trigger it manually from the
   **Actions** tab (**Build Android APK** → **Run workflow**).
2. Download the `deerdiary-debug-apk` artifact from the finished run — it's
   installable on any Android device/emulator for testing (`adb install
   app-debug.apk`, or just open the file on the phone).

To build a **release** build for the Play Store, or to make UI changes to
the native shell (permissions, app name, etc.), install
[Android Studio](https://developer.android.com/studio), then:

```bash
npm run android:open   # builds the web app and opens android/ in Android Studio
```

From there: `Build > Generate Signed App Bundle`, following Android Studio's
signing-key wizard, then upload the resulting `.aab` to the [Play
Console](https://play.google.com/console) ($25 one-time developer fee).

### iOS (App Store)

Requires a Mac with [Xcode](https://developer.apple.com/xcode/) installed —
this can't be built on Linux/Windows. On a Mac:

```bash
npm run ios:open   # builds the web app and opens ios/App/App.xcworkspace in Xcode
```

From Xcode: set your Apple Developer team under **Signing & Capabilities**,
then `Product > Archive` to build, and use the Organizer window to upload to
[App Store Connect](https://appstoreconnect.apple.com). Requires an [Apple
Developer Program](https://developer.apple.com/programs/) membership
($99/year).

### App icon & splash screen

Source art lives in `resources/icon.png` (1024×1024) and
`resources/splash.png` (2732×2732). To regenerate all platform sizes after
changing either file:

```bash
npx capacitor-assets generate --android --ios
```
