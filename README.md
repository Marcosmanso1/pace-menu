# Pace Menu

A focused running-session menu based on current race fitness.

[Open the website](https://marcosmanso1.github.io/pace-menu/)

Enter a recent race result, estimate VDOT, and explore key sessions for your race. There are **108 dedicated key sessions** plus **20 supporting sessions**. The dedicated menus contain 20 sessions for 1500 m / mile, 21 for 5K, 21 for 10K, 22 for half marathon and 24 for marathon.

The interface focuses on finding and executing workouts: race selection, focus, session load, total duration, search and sorting. Each detail view contains the calculated prescription, a session profile, exact block paces, rep splits, recoveries and easy preparation. Research and rationale pages are intentionally absent from the product.

## Units

Distances are metric-native numbers. Selecting km or mi changes the prescription, block distances, recovery distances, totals, pace values and distance-bearing execution cues. Numeric summaries are generated from the same structured data that drives calculations. The two older imperial marathon examples have been deliberately rounded into metric sessions. No hardcoded imperial workout prescription is displayed in km mode.

## Development

Use Node 22.13 or newer.

```sh
npm ci
npm run dev
```

Before publishing:

```sh
npm test
npm run build
```

The build runs TypeScript and prepares GitHub Pages output in the repository root. Commit handwritten source and generated index.html / app-* assets together. GitHub Pages hosts the main branch, root directory. No server, database, API keys or account is required.

- App.tsx: calculator, filters, cards and streamlined session view.
- running.ts: race-performance model, unit helpers and 128 structured sessions.
- styles.css: responsive visual system and reduced-motion support.
- running.test.mjs: performance, unit conversion, summary consistency and recovery checks.
- running-campaign-male.webp: optimized original campaign visual.
- ASSETS.md: image provenance.
- CATALOGUE-REVIEW.md: internal research and adaptation ledger, outside the browser bundle.

## Calculation assumptions

VDOT uses the Daniels–Gilbert performance equations. It is a performance estimate, not measured VO2max. Equivalent results assume event-specific preparation and comparable conditions. These training estimates do not reproduce licensed VDOT tables. The sub-threshold bands are estimates rather than measured lactate response.

All non-easy running counts towards quality volume, including steady floats. Written easy floats count towards the main set but not quality. Recoveries appear only between efforts. Estimated total time includes separate easy preparation unless it is already embedded. A race result sets the pace, not personal readiness for a demanding workload.

Race inputs are calculated locally and are not collected or stored.
