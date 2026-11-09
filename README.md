# Pace Menu

A focused running-workout library paced to a recent race result.

Enter a race distance and finish time to estimate VDOT. Choose a target distance, then explore race-specific sessions and a curated set of supporting workouts. Every session includes its purpose, pacing, splits, recovery and main-set volume.

## Website

[Open Pace Menu](https://marcosmanso1.github.io/pace-menu/)

Hosted by GitHub Pages from the `main` branch, repository root. No server, API keys, account creation, database or ChatGPT subscription is needed to use the website.

The library contains 45 fixed workouts, including race-pace ladders, mixed-distance sets, easy floats and a marathon fast-finish run. Race menus lead with their own sessions, followed by selected foundations. This is a workout menu, not an automatically prescribed weekly training plan.

## Development

Use Node 22.13 or newer.

```sh
npm ci
npm run dev
```

Before publishing changes:

```sh
npm test
npm run build
```

Commit the handwritten source and generated `index.html`, `app-*.js` and `app-*.css` together. GitHub Pages publishes the committed output automatically.

- `App.tsx` — calculator, race filters and workout detail interface.
- `running.ts` — performance equations and fixed workout definitions.
- `styles.css` — responsive layout and accessibility styles.
- `main.tsx` and `development.html` — local development entry.
- `build.mjs` — type-check, build and prepare the static website.

All files are deliberately in one directory so the complete project can also be uploaded through GitHub's file-upload interface.

## Calculation notes

VDOT uses the Daniels–Gilbert performance equations. Race equivalents assume comparable preparation and conditions. The training pace estimates are not a reproduction of the official licensed VDOT tables. Sub-threshold estimates cannot determine an individual lactate threshold. Main-set totals include written easy floats, and timed rests are counted only between repetitions or blocks. Detailed assumptions and coaching references are linked in the website.

Entered results are calculated locally in the browser and are not collected or stored.
