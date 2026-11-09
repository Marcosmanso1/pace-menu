# Pace audit — 9 November 2026

## Confirmed defects corrected

- Distance-based sub-threshold reps previously used a fixed authored family regardless of duration at current fitness. They now select the same family as comparable timed reps. Estimate at the short band, move to medium if the rep is at least five minutes, then long if at least eight minutes. This conservative upward pass avoids circular classification. The boundaries are editorial menu comparisons, not physiological cutoffs. Distances and counts are preserved.
- Card pace tags omitted explicit offsets. A prescription at marathon minus six seconds/km looked like an incorrect marathon pace. Cards and details now show the signed offset in selected units.
- A written `seconds per kilometre` cue escaped mi conversion. It now converts along with structured offsets.
- `workoutMetrics.range` discarded the first block’s resolved/adjusted range. It now agrees with that block.
- The top sub-T reference showed only the medium band. It now labels the short-to-long envelope as a guide. Session details identify the resolved family.
- Workout-profile heights use the same resolved block speed as pace labels, splits and totals.

## Numerical evidence

With a 30:00 5K result, five 1.6 km repeats previously used T+10–15 sec/km even though each rep was over ten minutes. They now match the timed long-rep family, T+15–20 sec/km. With a 15:00 result, two-kilometre repeats last roughly seven minutes and use the medium family instead of a fixed long label. These are consistency corrections within the existing model, not a newly validated physiological formula.

## Source checks and unresolved limits

Primary V.O2 definitions describe T near one-hour race intensity, I near 10–12-minute race intensity, and R near 1500m/mile intensity. The app uses corresponding continuous performance-model estimates; it does not reproduce the official licensed tables. No basis was found for a blanket change to race-specific or non-sub training paces. Exact race equivalents invert back to the input result.

Bakken’s first-person interview suggests estimated VDOT threshold plus about 5–7 sec/km as a fallback. Koens describes 5–10-minute sub-threshold blocks about 5–10 sec/km slower than threshold, and gentler starts for larger doses. Neither validates the app’s entire three-band table. The retained T+5–10 / +10–15 / +15–20 values are conservative editorial starting bands, not the best pace for every runner. No primary public source established an exact universal pace for 4–5 km sub-threshold repetitions. No invented long-rep formula or exact lactate estimate was added. Effort response takes precedence.

Primary sources checked:
- https://vdoto2.com/learn-more/training-definitions
- https://support.vdoto2.com/2017/12/whats-threshold-pace/
- https://news.vdoto2.com/2025/06/get-the-most-out-of-your-threshold-training/
- https://scientifictriathlon.com/tts719/
- https://gretekoens.nl/threshold-training/
- https://www.mariusbakken.com/the-norwegian-model.html

Verification: 27 calculation, catalogue, units, duration-family and offset regressions; TypeScript/production build; browser checks of changed fitness, card/detail agreement, km/mi labels and phone layout. Tests establish software consistency, not individual lactate validity.
