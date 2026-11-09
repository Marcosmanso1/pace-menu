# Pace Menu

A focused running-session menu based on current race fitness.

[Open the website](https://marcosmanso1.github.io/pace-menu/)

Enter a recent race result, estimate VDOT, and explore key sessions for your race. There are **108 dedicated key sessions** plus **49 shared training sessions**. The dedicated menus contain 20 sessions for 1500 m / mile, 21 for 5K, 21 for 10K, 22 for half marathon and 24 for marathon.

The image-free cream and lime interface puts all six workout types directly in the main menu: sub-threshold, threshold, VO₂max, speed and economy, race-specific, and easy and endurance. Choose a distance, then a type. All 49 shared training sessions remain accessible at every distance; the selected event filters the race-specific sessions. Search is always visible, while load, total duration and sorting sit behind an optional Filters control. Each detail view contains the calculated prescription, a session profile, exact block paces, rep splits, recoveries and easy preparation. Research and rationale pages are intentionally absent from the product.

## Sub-threshold menu

35 fixed choices: 20 timed and 15 distance-based. The format selector switches between authored Minutes and Kilometres (or Miles) presets; it does not change the pace-unit control or silently convert prescriptions. Distance repetitions extend to 5 km, including 2 × 5 km and 3 × 5 km. Cards show quality minutes and longest-rep duration at current fitness. Larger doses are labelled Demanding, with a direct route to the other format from session details. SUBTHRESHOLD-REVIEW.md records research, editorial adaptations and calculation limits outside the browser bundle.

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
- running.ts: race-performance model, unit helpers and 157 structured sessions.
- styles.css / details.css: responsive visual system, workout instructions and reduced-motion support.
- menu.ts: event/type selection and normalized search.
- running.test.mjs: performance, unit conversion, summary consistency and recovery checks.
- The hero uses an animated SVG track, with a pause control and reduced-motion preference support. Cards, workout profiles and dialogs use brief entry and hover transitions. Photographic campaign assets are archived and are not imported or downloaded by the website.
- CATALOGUE-REVIEW.md: internal research and adaptation ledger, outside the browser bundle.

## Calculation assumptions

VDOT uses the Daniels–Gilbert performance equations. It is a performance estimate, not measured VO2max. Equivalent results assume event-specific preparation and comparable conditions. These training estimates do not reproduce licensed VDOT tables. The sub-threshold bands are editorial starting estimates rather than measured lactate response or a validated Norwegian Singles pace table. Distance-based sub-threshold repetitions select a family from their estimated duration: under 5 minutes, 5 to under 8 minutes, or 8 minutes and longer. These boundaries match the menu’s timed families and are not physiological cutoffs. Explicit timed prescriptions, including the gentler opening of a progression, retain their authored bands. Adjusted race paces show their signed adjustment in the chosen units on both cards and details. See PACE-AUDIT.md for the evidence and limits.

All non-easy running counts towards quality volume, including steady floats. Written easy floats count towards the main set but not quality. Recoveries appear only between efforts. Estimated total time includes separate easy preparation unless it is already embedded. A race result sets the pace, not personal readiness for a demanding workload.

Race inputs are calculated locally and are not collected or stored.
