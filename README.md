# Pace Menu

A focused running-workout library paced to a recent race result.

Enter a race distance and finish time to estimate VDOT. Choose a target distance, then explore race-specific sessions and a curated set of supporting workouts. Every session includes its purpose, pacing, splits, recovery and main-set volume.

## Website

[Open Pace Menu](https://marcosmanso1.github.io/pace-menu/)

Hosted by GitHub Pages from the `main` branch, repository root. No server, API keys, account creation, database or ChatGPT subscription is needed to use the website.

The library contains 53 fixed workouts, with distinct menus for 1500 m / mile, 5K, 10K, half marathon and marathon. Race menus lead with their own sessions, followed by selected foundations. Each session has a proportional workout timeline, preparation, pacing, recovery, coaching rationale, progression context and direct source notes. This is a workout menu, not an automatically prescribed weekly training plan.

The research register contains 32 reviewed publications: coaching manuals, first-hand workout guidance and original studies. Adaptations are identified for each session. These sources inform the selection; they do not establish a universally best workout. See [RESEARCH.md](RESEARCH.md) for the full register and editorial decisions.

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
- `research.ts` — source register and rationale / attribution for all 53 sessions.
- `RESEARCH.md` — evidence review and editorial decisions.
- `styles.css` — responsive layout and accessibility styles.
- `main.tsx` and `development.html` — local development entry.
- `build.mjs` — type-check, build and prepare the static website.

All files are deliberately in one directory so the complete project can also be uploaded through GitHub's file-upload interface.

## Calculation notes

VDOT uses the Daniels–Gilbert performance equations. Race equivalents assume comparable preparation and conditions. The training pace estimates are not a reproduction of the official licensed VDOT tables. Sub-threshold estimates cannot determine an individual lactate threshold. Main-set totals include written easy floats, and timed rests are counted only between repetitions or blocks. Detailed assumptions and coaching references are linked in the website. Duration prompts are editorial comparisons to help choose a dose; they are not physiological limits or a personal readiness assessment.

The automated checks cover the performance equations, distance and time recovery, multi-pace sets, embedded warm-ups, source coverage, and numerical behaviour throughout the supported VDOT range. The production build also runs TypeScript checks.

Entered results are calculated locally in the browser and are not collected or stored.
