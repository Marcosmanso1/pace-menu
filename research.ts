export type Source={id:string;title:string;author:string;url:string;kind:'Coaching'|'Research';note:string};
export type SessionNote={sources:string[];why:string;when:string;progression:string;phase:'Foundation'|'Build'|'Sharpen'|'Race week';attribution:string;sourceNote:string;maxRepMinutes?:number;maxQualityMinutes?:number;timedAlternative?:string};
export const SOURCES:Source[]=[
  {
    "id": "daniels",
    "title": "Training intensities: what and why",
    "author": "Dr Jack Daniels · V.O2",
    "url": "https://vdoto2.com/learn-more/training-definitions",
    "kind": "Coaching",
    "note": "Defines the purpose, duration and recovery of E, M, T, I and R running."
  },
  {
    "id": "economy",
    "title": "Improving running speed and economy",
    "author": "V.O2 coaching team",
    "url": "https://news.vdoto2.com/2025/07/how-to-effectively-improve-running-speed-and-economy/",
    "kind": "Coaching",
    "note": "Short, relaxed repetitions and enough recovery to repeat good mechanics."
  },
  {
    "id": "rubio",
    "title": "Fundamental Training Principles for the Competitive 1500m Runner",
    "author": "Joe Rubio",
    "url": "https://img.runningwarehouse.com.au/lc/middle_distance_guide.pdf",
    "kind": "Coaching",
    "note": "A specialist manual for experienced runners; competition-phase examples, pp. 64–68."
  },
  {
    "id": "mahon",
    "title": "Preparing for International Success in 800/1500",
    "author": "Terence Mahon · British Milers Club",
    "url": "https://enteronline.britishmilersclub.com/bmcnews/2012spring.pdf",
    "kind": "Coaching",
    "note": "Race-specific middle-distance practice; article on printed pp. 30–31."
  },
  {
    "id": "m5",
    "title": "The Best 5K Workout",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/best-5k-workout/",
    "kind": "Coaching",
    "note": "A progression from shorter repetitions towards longer 5K-rhythm work."
  },
  {
    "id": "fresh",
    "title": "Light and Fresh 400s",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/light-and-fresh-400s/",
    "kind": "Coaching",
    "note": "Faster repetitions paired with progressively longer recoveries."
  },
  {
    "id": "raceweek",
    "title": "5K Race Week Workouts",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/5k-race-week-workouts-fine-tuning-for-your-fastest-3-1-miler/",
    "kind": "Coaching",
    "note": "Sharpening examples for runners already accustomed to faster sessions."
  },
  {
    "id": "sisson",
    "title": "Race-Specific Training: A Workout for 5K Runners",
    "author": "Steve Sisson · Telos / COROS",
    "url": "https://coros.com/stories/athlete-stories/c/race-specific-training-a-workout-for-5k-runners",
    "kind": "Coaching",
    "note": "A change-up workout mixing 10K and 3K rhythm inside 1200 m reps."
  },
  {
    "id": "gaudette",
    "title": "Specific Training to Master the 5K and 10K",
    "author": "Jeff Gaudette",
    "url": "https://www.outsideonline.com/running/training/workouts/specific-training-for-5k-and-10k/?scope=anon",
    "kind": "Coaching",
    "note": "Shows how race-specific repetition lengths and recoveries progress."
  },
  {
    "id": "lemoncello",
    "title": "The 5K Simulation Workout",
    "author": "Andrew Lemoncello",
    "url": "https://www.mcmillanrunning.com/the-5k-simulation-workout/",
    "kind": "Coaching",
    "note": "Reviewed but not selected: a very demanding simulation used infrequently by its author."
  },
  {
    "id": "duration",
    "title": "Work duration and physiological responses in self-paced intervals",
    "author": "Seiler & Sjursen · 2004",
    "url": "https://pubmed.ncbi.nlm.nih.gov/15387806/",
    "kind": "Research",
    "note": "Original acute study; full abstract read. Does not rank long-term race improvements."
  },
  {
    "id": "rest",
    "title": "Rest duration, work intensity and perceived exertion",
    "author": "Seiler & Hetlelid · 2005",
    "url": "https://pubmed.ncbi.nlm.nih.gov/16177614/",
    "kind": "Research",
    "note": "Original acute uphill study; full abstract read. Small trained male sample."
  },
  {
    "id": "cutdown",
    "title": "The Mile Cut-Down",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/the-mile-cut-down/",
    "kind": "Coaching",
    "note": "Changing repetition lengths can serve several distances; not automatically a miler-only session."
  },
  {
    "id": "combos",
    "title": "Combo Workouts",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/combo-workouts/",
    "kind": "Coaching",
    "note": "Mixed training purposes; demanding examples require deliberate adaptation."
  },
  {
    "id": "m10",
    "title": "The Best 10K Workout",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/the-best-10k-workout/",
    "kind": "Coaching",
    "note": "Long-repetition progression; its final rehearsal uses 5-minute jog recoveries."
  },
  {
    "id": "m10guide",
    "title": "10K Training Plan Guide",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/10k-training-plan-guide/",
    "kind": "Coaching",
    "note": "Balances race rhythm, stamina, aerobic power and endurance."
  },
  {
    "id": "halfguide",
    "title": "Half-Marathon Training Plan Guide",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/half-marathon-training-plan-guide/",
    "kind": "Coaching",
    "note": "The event combines sustained aerobic work with practice at its own race rhythm."
  },
  {
    "id": "trainingguide",
    "title": "Training Plan Guide",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/training-plan-guide/",
    "kind": "Coaching",
    "note": "Distinguishes training purposes and intensities; terminology can differ between coaches."
  },
  {
    "id": "threshold",
    "title": "Get the Most Out of Your Threshold Training",
    "author": "V.O2 coaching team",
    "url": "https://news.vdoto2.com/2025/06/get-the-most-out-of-your-threshold-training/",
    "kind": "Coaching",
    "note": "Longer tempo efforts need slower pacing than shorter threshold work."
  },
  {
    "id": "baa10",
    "title": "B.A.A. 10K Training",
    "author": "Boston Athletic Association",
    "url": "https://www.baa.org/races/boston-10k/info-for-athletes/b-a-a-10k-training/",
    "kind": "Coaching",
    "note": "Graduated timed work, measured repetitions and mixed race-pace blocks."
  },
  {
    "id": "baahalf",
    "title": "Boston Half Training",
    "author": "Boston Athletic Association",
    "url": "https://www.baa.org/races/boston-half/info-for-athletes/boston-half-training/",
    "kind": "Coaching",
    "note": "Race-rhythm introductions, longer repetitions and specific work inside longer runs."
  },
  {
    "id": "runnersconnect",
    "title": "Half-Marathon Specific Training",
    "author": "Jeff Gaudette · RunnersConnect",
    "url": "https://runnersconnect.net/coach-corner/half-marathon-specific-training/",
    "kind": "Coaching",
    "note": "Broken race-pace work, alternations and the progression towards longer specific efforts."
  },
  {
    "id": "festa",
    "title": "Effects of different training-intensity distributions in recreational runners",
    "author": "Festa et al. · 2020",
    "url": "https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2019.00070/full",
    "kind": "Research",
    "note": "Original eight-week randomized study: both groups improved, without clear between-group performance differences."
  },
  {
    "id": "marathonlong",
    "title": "5 Proven Marathon Long Runs",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/5-proven-marathon-long-runs/",
    "kind": "Coaching",
    "note": "Different long-run formats serve different purposes; aggressive examples are advanced."
  },
  {
    "id": "longest",
    "title": "Longest Long Run for the Marathon?",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/longest-long-run-marathon/",
    "kind": "Coaching",
    "note": "Elapsed duration and preparation matter; do not prescribe identical long runs to everyone."
  },
  {
    "id": "predictors",
    "title": "3 Great Marathon Predictor Workouts",
    "author": "Greg McMillan",
    "url": "https://www.mcmillanrunning.com/3-great-marathon-predictor-workouts/",
    "kind": "Coaching",
    "note": "Its examples assume the underlying marathon preparation has already been completed."
  },
  {
    "id": "baamarathon",
    "title": "Boston Marathon Training",
    "author": "Boston Athletic Association",
    "url": "https://www.baa.org/races/boston-marathon/info-for-athletes/boston-marathon-training/",
    "kind": "Coaching",
    "note": "Includes substantial marathon-pace rehearsals inside established training builds."
  },
  {
    "id": "higdon",
    "title": "Intermediate 1 Marathon",
    "author": "Hal Higdon",
    "url": "https://www.halhigdon.com/training-programs/marathon-training/intermediate-1-marathon/",
    "kind": "Coaching",
    "note": "A contrasting approach: separate marathon-pace runs and mostly easier long runs."
  },
  {
    "id": "higdonadvanced",
    "title": "Advanced 2 Marathon",
    "author": "Hal Higdon",
    "url": "https://www.halhigdon.com/training-programs/marathon-training/advanced-2-marathon/",
    "kind": "Coaching",
    "note": "Experience and existing hard work affect the choice of long-run intensity."
  },
  {
    "id": "bakken",
    "title": "The Norwegian Model",
    "author": "Marius Bakken",
    "url": "https://www.mariusbakken.com/the-norwegian-model.html",
    "kind": "Coaching",
    "note": "An empirical coaching account centred on individual intensity control."
  },
  {
    "id": "casado",
    "title": "Lactate-Guided Threshold Interval Training",
    "author": "Casado, Foster, Bakken & Tjelta · 2023",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10000870/",
    "kind": "Research",
    "note": "A descriptive framework and narrative review, not a trial proving superiority."
  },
  {
    "id": "tonnessen",
    "title": "Training Session Models in Endurance Sports",
    "author": "Tønnessen et al. · 2024",
    "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11560996/",
    "kind": "Research",
    "note": "Original interviews and training-log study of successful coaches; descriptive, not an experiment ranking workouts."
  }
];
export const SESSION_NOTES:Record<string,SessionNote>={
  "s1": {
    "sources": [
      "bakken",
      "casado",
      "tonnessen"
    ],
    "why": "Repeated controlled work builds familiarity with a sustainable aerobic effort. The pace band is an estimate, not a measured lactate zone.",
    "when": "Use when controlled sessions are already part of your training; finish with more available.",
    "progression": "Begin with the shorter option. Add duration only when effort stays stable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The rep count and pace offsets are our examples, informed by intensity-control principles rather than copied elite volumes.",
    "maxQualityMinutes": 36,
    "timedAlternative": "s6"
  },
  "s2": {
    "sources": [
      "bakken",
      "casado",
      "tonnessen"
    ],
    "why": "Repeated controlled work builds familiarity with a sustainable aerobic effort. The pace band is an estimate, not a measured lactate zone.",
    "when": "Use when controlled sessions are already part of your training; finish with more available.",
    "progression": "Begin with the shorter option. Add duration only when effort stays stable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The rep count and pace offsets are our examples, informed by intensity-control principles rather than copied elite volumes.",
    "maxQualityMinutes": 36,
    "timedAlternative": "s6"
  },
  "s3": {
    "sources": [
      "bakken",
      "casado",
      "tonnessen"
    ],
    "why": "Repeated controlled work builds familiarity with a sustainable aerobic effort. The pace band is an estimate, not a measured lactate zone.",
    "when": "Use when controlled sessions are already part of your training; finish with more available.",
    "progression": "Begin with the shorter option. Add duration only when effort stays stable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The rep count and pace offsets are our examples, informed by intensity-control principles rather than copied elite volumes.",
    "maxQualityMinutes": 36,
    "timedAlternative": "s6"
  },
  "s4": {
    "sources": [
      "bakken",
      "casado",
      "tonnessen"
    ],
    "why": "Repeated controlled work builds familiarity with a sustainable aerobic effort. The pace band is an estimate, not a measured lactate zone.",
    "when": "Use when controlled sessions are already part of your training; finish with more available.",
    "progression": "Begin with the shorter option. Add duration only when effort stays stable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The rep count and pace offsets are our examples, informed by intensity-control principles rather than copied elite volumes.",
    "maxQualityMinutes": 36,
    "timedAlternative": "s6"
  },
  "s5": {
    "sources": [
      "bakken",
      "casado",
      "tonnessen"
    ],
    "why": "Repeated controlled work builds familiarity with a sustainable aerobic effort. The pace band is an estimate, not a measured lactate zone.",
    "when": "Use when controlled sessions are already part of your training; finish with more available.",
    "progression": "Begin with the shorter option. Add duration only when effort stays stable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The rep count and pace offsets are our examples, informed by intensity-control principles rather than copied elite volumes.",
    "maxQualityMinutes": 36,
    "timedAlternative": "s6"
  },
  "s6": {
    "sources": [
      "bakken",
      "casado",
      "tonnessen"
    ],
    "why": "Repeated controlled work builds familiarity with a sustainable aerobic effort. The pace band is an estimate, not a measured lactate zone.",
    "when": "Use when controlled sessions are already part of your training; finish with more available.",
    "progression": "Begin with the shorter option. Add duration only when effort stays stable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The rep count and pace offsets are our examples, informed by intensity-control principles rather than copied elite volumes.",
    "maxQualityMinutes": 36,
    "timedAlternative": "s6"
  },
  "t1": {
    "sources": [
      "daniels",
      "threshold"
    ],
    "why": "A steady, comfortably hard effort targets sustained endurance; short breaks make the effort easier to control.",
    "when": "Useful across distance builds. Threshold means roughly one-hour effort, not whichever race distance you selected.",
    "progression": "Keep pace stable. Increase accumulated work before making the effort harder.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "Our interval dose follows threshold principles; the continuous 20-minute format is directly described by Daniels.",
    "maxQualityMinutes": 30,
    "timedAlternative": "t2"
  },
  "t2": {
    "sources": [
      "daniels",
      "threshold"
    ],
    "why": "A steady, comfortably hard effort targets sustained endurance; short breaks make the effort easier to control.",
    "when": "Useful across distance builds. Threshold means roughly one-hour effort, not whichever race distance you selected.",
    "progression": "Keep pace stable. Increase accumulated work before making the effort harder.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "Our interval dose follows threshold principles; the continuous 20-minute format is directly described by Daniels.",
    "maxQualityMinutes": 30,
    "timedAlternative": "t2"
  },
  "t3": {
    "sources": [
      "daniels",
      "threshold"
    ],
    "why": "A steady, comfortably hard effort targets sustained endurance; short breaks make the effort easier to control.",
    "when": "Useful across distance builds. Threshold means roughly one-hour effort, not whichever race distance you selected.",
    "progression": "Keep pace stable. Increase accumulated work before making the effort harder.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "Our interval dose follows threshold principles; the continuous 20-minute format is directly described by Daniels.",
    "maxQualityMinutes": 30,
    "timedAlternative": "t2"
  },
  "t4": {
    "sources": [
      "daniels",
      "threshold"
    ],
    "why": "A steady, comfortably hard effort targets sustained endurance; short breaks make the effort easier to control.",
    "when": "Useful across distance builds. Threshold means roughly one-hour effort, not whichever race distance you selected.",
    "progression": "Keep pace stable. Increase accumulated work before making the effort harder.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "Our interval dose follows threshold principles; the continuous 20-minute format is directly described by Daniels.",
    "maxQualityMinutes": 30,
    "timedAlternative": "t2"
  },
  "v1": {
    "sources": [
      "daniels",
      "duration",
      "rest"
    ],
    "why": "Hard, repeatable minutes provide an aerobic-power stimulus without requiring the same measured rep distance at every fitness level.",
    "when": "Supporting work for milers, 5K and 10K runners already accustomed to faster running.",
    "progression": "Choose fewer hard minutes first. Keep the later reps as repeatable as the early ones.",
    "phase": "Build",
    "attribution": "Coaching-principle example",
    "sourceNote": "The exact count is ours. The supporting studies describe acute responses, not a universally superior workout.",
    "maxRepMinutes": 5,
    "maxQualityMinutes": 20,
    "timedAlternative": "v2"
  },
  "v2": {
    "sources": [
      "daniels",
      "duration",
      "rest"
    ],
    "why": "Hard, repeatable minutes provide an aerobic-power stimulus without requiring the same measured rep distance at every fitness level.",
    "when": "Supporting work for milers, 5K and 10K runners already accustomed to faster running.",
    "progression": "Choose fewer hard minutes first. Keep the later reps as repeatable as the early ones.",
    "phase": "Build",
    "attribution": "Coaching-principle example",
    "sourceNote": "The exact count is ours. The supporting studies describe acute responses, not a universally superior workout.",
    "maxRepMinutes": 5,
    "maxQualityMinutes": 20,
    "timedAlternative": "v2"
  },
  "v3": {
    "sources": [
      "daniels",
      "duration",
      "rest"
    ],
    "why": "Hard, repeatable minutes provide an aerobic-power stimulus without requiring the same measured rep distance at every fitness level.",
    "when": "Supporting work for milers, 5K and 10K runners already accustomed to faster running.",
    "progression": "Choose fewer hard minutes first. Keep the later reps as repeatable as the early ones.",
    "phase": "Build",
    "attribution": "Coaching-principle example",
    "sourceNote": "The exact count is ours. The supporting studies describe acute responses, not a universally superior workout.",
    "maxRepMinutes": 5,
    "maxQualityMinutes": 20,
    "timedAlternative": "v2"
  },
  "v4": {
    "sources": [
      "daniels",
      "duration",
      "rest"
    ],
    "why": "Hard, repeatable minutes provide an aerobic-power stimulus without requiring the same measured rep distance at every fitness level.",
    "when": "Supporting work for milers, 5K and 10K runners already accustomed to faster running.",
    "progression": "Choose fewer hard minutes first. Keep the later reps as repeatable as the early ones.",
    "phase": "Build",
    "attribution": "Coaching-principle example",
    "sourceNote": "The exact count is ours. The supporting studies describe acute responses, not a universally superior workout.",
    "maxRepMinutes": 5,
    "maxQualityMinutes": 20,
    "timedAlternative": "v2"
  },
  "r1": {
    "sources": [
      "economy",
      "daniels"
    ],
    "why": "Relaxed fast running rehearses coordination and economical mechanics. Recovery preserves the quality of each repetition.",
    "when": "A small supporting dose when already warmed up and comfortable with faster running.",
    "progression": "Start with short controlled reps; extend only while you can stay relaxed.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The exact dose is ours; short repetitions and full recovery follow the source principles.",
    "maxRepMinutes": 2,
    "maxQualityMinutes": 10,
    "timedAlternative": "r2"
  },
  "r2": {
    "sources": [
      "economy",
      "daniels"
    ],
    "why": "Relaxed fast running rehearses coordination and economical mechanics. Recovery preserves the quality of each repetition.",
    "when": "A small supporting dose when already warmed up and comfortable with faster running.",
    "progression": "Start with short controlled reps; extend only while you can stay relaxed.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The exact dose is ours; short repetitions and full recovery follow the source principles.",
    "maxRepMinutes": 2,
    "maxQualityMinutes": 10,
    "timedAlternative": "r2"
  },
  "r3": {
    "sources": [
      "economy",
      "daniels"
    ],
    "why": "Relaxed fast running rehearses coordination and economical mechanics. Recovery preserves the quality of each repetition.",
    "when": "A small supporting dose when already warmed up and comfortable with faster running.",
    "progression": "Start with short controlled reps; extend only while you can stay relaxed.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "The exact dose is ours; short repetitions and full recovery follow the source principles.",
    "maxRepMinutes": 2,
    "maxQualityMinutes": 10,
    "timedAlternative": "r2"
  },
  "e1": {
    "sources": [
      "daniels",
      "higdon"
    ],
    "why": "Comfortable running supports aerobic development with a lower demand than quality sessions.",
    "when": "Choose a duration that fits your established training and the day’s recovery needs.",
    "progression": "Extend easy running gradually. The pace band is a guide; slower is acceptable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "These fixed durations are menu examples, not personalized volume prescriptions."
  },
  "e2": {
    "sources": [
      "daniels",
      "higdon"
    ],
    "why": "Comfortable running supports aerobic development with a lower demand than quality sessions.",
    "when": "Choose a duration that fits your established training and the day’s recovery needs.",
    "progression": "Extend easy running gradually. The pace band is a guide; slower is acceptable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "These fixed durations are menu examples, not personalized volume prescriptions."
  },
  "e3": {
    "sources": [
      "daniels",
      "higdon"
    ],
    "why": "Comfortable running supports aerobic development with a lower demand than quality sessions.",
    "when": "Choose a duration that fits your established training and the day’s recovery needs.",
    "progression": "Extend easy running gradually. The pace band is a guide; slower is acceptable.",
    "phase": "Foundation",
    "attribution": "Coaching-principle example",
    "sourceNote": "These fixed durations are menu examples, not personalized volume prescriptions."
  },
  "m1": {
    "sources": [
      "economy",
      "daniels"
    ],
    "why": "Short reps let you practise mile rhythm while keeping the individual efforts small.",
    "when": "An entry to measured fast running, after an easy warm-up.",
    "progression": "Become comfortable here before moving to the 300s.",
    "phase": "Foundation",
    "attribution": "Source structure",
    "sourceNote": "Uses the source’s 8 × 200 m with 200 m jog; current equivalent mile rhythm is our pacing estimate.",
    "maxRepMinutes": 2,
    "timedAlternative": "r2"
  },
  "mi2": {
    "sources": [
      "rubio",
      "mahon"
    ],
    "why": "A slightly longer repetition asks you to hold race mechanics without accumulating a large total distance.",
    "when": "Sharpening for runners with an established base and experience of shorter fast reps.",
    "progression": "Graduate from 200s; keep the final rep technically controlled.",
    "phase": "Sharpen",
    "attribution": "Source structure",
    "sourceNote": "Rubio describes five 300s with three-minute recoveries. The manual targets experienced runners; our paces use current fitness.",
    "maxRepMinutes": 2.5,
    "timedAlternative": "m1"
  },
  "mi5": {
    "sources": [
      "rubio"
    ],
    "why": "Longer race-speed reps increase the uninterrupted demand while equal-time rests keep a clear work–recovery structure.",
    "when": "Experienced middle-distance runners in specific preparation.",
    "progression": "Establish 200s and 300s first; do not use faster-than-current pace to force progress.",
    "phase": "Sharpen",
    "attribution": "Source structure",
    "sourceNote": "The lower endpoint of Rubio’s 6–8 × 400 m at 1500 pace, with equal-time standing recovery.",
    "maxRepMinutes": 2.5,
    "timedAlternative": "mi2"
  },
  "mi3": {
    "sources": [
      "rubio"
    ],
    "why": "Short intra-pair recovery links two race-speed efforts; the long reset separates the sets.",
    "when": "A demanding specialist session after single 400s are already established.",
    "progression": "Use the single-repetition 300s or 400s before paired work.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Reduced from Rubio’s four pairs to three. The recovery structure is retained; current fitness determines pace.",
    "maxRepMinutes": 2.5,
    "timedAlternative": "mi2"
  },
  "mi6": {
    "sources": [
      "rubio"
    ],
    "why": "Longer race-speed exposure has a different demand from short economy reps and requires substantial recovery.",
    "when": "Prepared competitive middle-distance runners, late in a specific build.",
    "progression": "Keep short reps controlled before considering this longer race-specific option.",
    "phase": "Sharpen",
    "attribution": "Source structure",
    "sourceNote": "The lower endpoint of Rubio’s 4–5 × 600 m with twice-time recovery. It is deliberately classified as demanding.",
    "maxRepMinutes": 3,
    "timedAlternative": "mi2"
  },
  "mi4": {
    "sources": [
      "rubio"
    ],
    "why": "Fewer race-rhythm laps reduce the dose while maintaining a familiar movement pattern.",
    "when": "Near a race, only if this kind of faster running is already familiar.",
    "progression": "Do not introduce a new speed session in race week.",
    "phase": "Race week",
    "attribution": "Source structure",
    "sourceNote": "Uses Rubio’s four 400s with a 400 m jog, retaining current pace rather than his optional faster variation.",
    "maxRepMinutes": 2.5,
    "timedAlternative": "m1"
  },
  "5e": {
    "sources": [
      "gaudette",
      "daniels"
    ],
    "why": "Short timed bouts keep the individual dose manageable while introducing current 5K rhythm.",
    "when": "An introduction before longer measured repetitions.",
    "progression": "Move to two-minute work or measured 400s once rhythm is repeatable.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "An independently shortened time-based example, informed by race-specific progression principles.",
    "maxQualityMinutes": 15
  },
  "5d": {
    "sources": [
      "gaudette",
      "daniels",
      "duration"
    ],
    "why": "A fixed work duration lets runners at different speeds practise a similar-sized effort.",
    "when": "A bridge between short introductions and measured race repetitions.",
    "progression": "Progress to measured reps if the resulting work duration still fits your training.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "A Pace Menu timed adaptation. The studies support considering rep duration, not this exact count as optimal.",
    "maxQualityMinutes": 20
  },
  "5a": {
    "sources": [
      "m5",
      "gaudette"
    ],
    "why": "Shorter measured reps establish precision before the uninterrupted running gets longer.",
    "when": "Earlier specific preparation, after timed race-effort work is familiar.",
    "progression": "The 800 m session is a progression in uninterrupted work, not a faster version.",
    "phase": "Build",
    "attribution": "Source structure",
    "sourceNote": "Uses the lower end of McMillan’s 10–12 reps and 200–300 m recovery range; goal pace becomes current equivalent pace.",
    "maxRepMinutes": 5,
    "maxQualityMinutes": 30,
    "timedAlternative": "5d"
  },
  "5b": {
    "sources": [
      "m5"
    ],
    "why": "Longer repetitions reduce the number of breaks while retaining the same race-speed target.",
    "when": "A development session after shorter race repetitions are controlled.",
    "progression": "Build from the 400s before attempting the kilometre rehearsal.",
    "phase": "Build",
    "attribution": "Source structure",
    "sourceNote": "McMillan’s six 800s, using the lower 400 m endpoint of his recovery range; current fitness replaces an untested goal.",
    "maxRepMinutes": 5,
    "maxQualityMinutes": 30,
    "timedAlternative": "5d"
  },
  "5c": {
    "sources": [
      "m5"
    ],
    "why": "Kilometre reps demand longer concentration at race rhythm than the shorter progression steps.",
    "when": "Prepared runners late in specific preparation, with time to recover before racing.",
    "progression": "Earn the longer rep through repeatable 400s and 800s.",
    "phase": "Sharpen",
    "attribution": "Source structure",
    "sourceNote": "Retains five 1000s and the lower recovery endpoint. We omit the source’s prediction promise and use current fitness.",
    "maxRepMinutes": 5,
    "maxQualityMinutes": 30,
    "timedAlternative": "5d"
  },
  "5f": {
    "sources": [
      "sisson"
    ],
    "why": "Changing speed inside a repetition adds a race-specific gear change rather than simply extending a constant pace.",
    "when": "Experienced 5K runners who already tolerate both paces.",
    "progression": "Use steady race repetitions first. Retain the recovery and avoid an all-out finish.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Reduced from Sisson’s five 1200s to four structured reps; the source’s final all-out repetition is deliberately removed.",
    "maxRepMinutes": 6,
    "maxQualityMinutes": 25,
    "timedAlternative": "5d"
  },
  "5g": {
    "sources": [
      "fresh",
      "raceweek"
    ],
    "why": "As speed rises, recovery rises too, helping preserve controlled mechanics rather than turning the finish into a sprint.",
    "when": "Sharpening for runners already accustomed to regular quality sessions.",
    "progression": "Keep familiar speeds and reduce work if freshness starts to disappear.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Uses the conservative end of McMillan’s speed changes, anchored to current fitness rather than a goal. Both links describe the same protocol family.",
    "maxRepMinutes": 3,
    "maxQualityMinutes": 25,
    "timedAlternative": "5e"
  },
  "10e": {
    "sources": [
      "baa10"
    ],
    "why": "A time-based introduction exposes race rhythm without a long distance-based commitment.",
    "when": "Before longer measured race-pace work.",
    "progression": "Move towards measured kilometres only when the session feels controlled.",
    "phase": "Build",
    "attribution": "Source structure",
    "sourceNote": "Retains the B.A.A. six-by-two-minute structure; our pace comes from current equivalent fitness.",
    "maxQualityMinutes": 20
  },
  "10a": {
    "sources": [
      "baa10"
    ],
    "why": "Repeated kilometres develop pacing consistency without the uninterrupted demand of longer blocks.",
    "when": "Development work once timed race-rhythm sessions are comfortable.",
    "progression": "Progress in repetition length rather than chasing a faster pace.",
    "phase": "Build",
    "attribution": "Source structure",
    "sourceNote": "Chooses five reps from the B.A.A. range and retains the 400 m jog recovery; current fitness sets pace.",
    "maxRepMinutes": 8,
    "maxQualityMinutes": 40,
    "timedAlternative": "10e"
  },
  "10d": {
    "sources": [
      "m10",
      "m10guide"
    ],
    "why": "Longer repetitions increase uninterrupted race-rhythm running at a similar total distance.",
    "when": "Prepared runners moving from kilometres to longer specific work.",
    "progression": "Keep the total dose familiar before extending the next repetition.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "A reduced-volume adaptation of McMillan’s six 1500 m repeats: four repetitions, with a three-minute jog.",
    "maxRepMinutes": 12,
    "maxQualityMinutes": 40,
    "timedAlternative": "10e"
  },
  "10b": {
    "sources": [
      "m10",
      "trainingguide"
    ],
    "why": "Fewer breaks make the race rhythm more sustained even when total quality distance stays moderate.",
    "when": "Established runners with a specific endurance base.",
    "progression": "Build from kilometres or 1500 m repeats before extending to 2 km.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Our shorter long-repetition variant, informed by McMillan’s progression; this exact recipe is not copied from the article.",
    "maxRepMinutes": 15,
    "maxQualityMinutes": 40,
    "timedAlternative": "10e"
  },
  "10c": {
    "sources": [
      "m10"
    ],
    "why": "Long race-speed stretches approach the concentration and sustained work of the event.",
    "when": "Late specific preparation, only after a gradual build towards this workload.",
    "progression": "Complete lower-dose repetitions comfortably before considering 9 km of race-rhythm work.",
    "phase": "Sharpen",
    "attribution": "Source structure",
    "sourceNote": "McMillan’s three 3 km reps with five-minute jogs; current fitness replaces goal pace and the prediction guarantee is omitted.",
    "maxRepMinutes": 15,
    "maxQualityMinutes": 45,
    "timedAlternative": "10e"
  },
  "10f": {
    "sources": [
      "baa10"
    ],
    "why": "The second set introduces faster turnover after sustained race-rhythm work, with a clear reset between purposes.",
    "when": "Development work for runners comfortable with both paces.",
    "progression": "Establish each set separately before combining them.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "A smaller independently assembled version of B.A.A. mixed 10K/5K work: 16 minutes of quality running.",
    "maxQualityMinutes": 25,
    "timedAlternative": "10e"
  },
  "ha": {
    "sources": [
      "baahalf",
      "halfguide"
    ],
    "why": "Shorter repeats introduce event rhythm before long race-specific blocks.",
    "when": "Early specific work, with enough preparation for the overall session.",
    "progression": "Move to longer repetitions when pace and effort stay even.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Rounded metric adaptation of B.A.A. half-mile repetitions, choosing six reps and current equivalent fitness.",
    "maxRepMinutes": 8,
    "maxQualityMinutes": 40,
    "timedAlternative": "hd"
  },
  "hb": {
    "sources": [
      "baahalf"
    ],
    "why": "Longer repetitions ask for more sustained concentration with regular easy resets.",
    "when": "Development after shorter half-rhythm reps.",
    "progression": "Keep the accumulated work controlled before moving to 3200 m blocks.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "A metric rounding of four mile repetitions. Each rep is 1600 m, not a claimed exact mile.",
    "maxRepMinutes": 14,
    "maxQualityMinutes": 45,
    "timedAlternative": "hd"
  },
  "hc": {
    "sources": [
      "runnersconnect"
    ],
    "why": "Long blocks reduce interruptions and rehearse maintaining rhythm over time.",
    "when": "Established half-marathon runners after shorter repetitions feel controlled.",
    "progression": "Progress through shorter measured reps before doubling the uninterrupted distance.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Rounded metric adaptation of Gaudette’s two-by-two-mile format: two 3200 m blocks.",
    "maxRepMinutes": 22,
    "maxQualityMinutes": 45,
    "timedAlternative": "hd"
  },
  "hd": {
    "sources": [
      "halfguide",
      "runnersconnect"
    ],
    "why": "An uninterrupted effort builds rhythm without the workload being set by an arbitrary number of kilometres.",
    "when": "A time-based alternative when long measured repeats would take too long.",
    "progression": "Extend only when the current duration is well controlled.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "An independently shortened sustained-rhythm example informed by the coaches’ specific-work principles.",
    "maxQualityMinutes": 35
  },
  "he": {
    "sources": [
      "runnersconnect"
    ],
    "why": "The slower portions remain steady running, creating continuous stamina work rather than full recovery.",
    "when": "Experienced runners already comfortable with sustained race-specific work.",
    "progression": "Use ordinary broken half-rhythm reps first; do not treat the marathon portions as free recovery.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Metric adaptation of Gaudette’s alternating-mile structure. It contains 4.8 km at half rhythm plus 3.2 km at marathon rhythm.",
    "maxQualityMinutes": 50,
    "timedAlternative": "hd"
  },
  "hf": {
    "sources": [
      "baahalf",
      "halfguide"
    ],
    "why": "Moving into race rhythm after easy running adds accumulated fatigue while bounding the faster duration.",
    "when": "Runners already comfortable with a comparable total long-run duration.",
    "progression": "Establish the easy duration first, then the shorter race-rhythm portion.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "An independently shortened timed simulation: 70 minutes total, including all warm-up and cool-down.",
    "maxQualityMinutes": 25,
    "timedAlternative": "hd"
  },
  "hg": {
    "sources": [
      "baahalf",
      "combos"
    ],
    "why": "Combining sustained running with shorter faster work changes the demand rather than only adding more distance.",
    "when": "Experienced runners who already tolerate the individual components.",
    "progression": "Build the components separately before combining them.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Metric and reduced-volume adaptation of mixed-pace preparation, not a literal reproduction of a B.A.A. session.",
    "maxRepMinutes": 20,
    "maxQualityMinutes": 40,
    "timedAlternative": "hd"
  },
  "me": {
    "sources": [
      "higdon",
      "predictors"
    ],
    "why": "A separate pace run lets you practise rhythm without making the long run hard.",
    "when": "Before longer specific work, when the duration fits your current running.",
    "progression": "Move to broken timed work before large measured blocks.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "A time-bounded reduction of the separate marathon-pace-run concept; not Higdon’s literal mileage prescription.",
    "maxQualityMinutes": 30
  },
  "m2": {
    "sources": [
      "baamarathon",
      "higdon"
    ],
    "why": "Breaking the work allows a reset while keeping the faster running bounded in time.",
    "when": "A step from a short continuous rehearsal towards longer specific sessions.",
    "progression": "Extend duration only after effort remains stable across both blocks.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "An independently time-bounded adaptation of broken marathon-rhythm work; not a copied B.A.A. prescription.",
    "maxQualityMinutes": 40,
    "timedAlternative": "me"
  },
  "mb": {
    "sources": [
      "baamarathon"
    ],
    "why": "Longer blocks provide extended race-rhythm practice with one interruption.",
    "when": "Established-volume marathon runners comfortable with comparable specific work.",
    "progression": "Use timed blocks first if this distance would create a much larger session.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "Reduced from a source five-mile format to five-kilometre blocks, with our shorter recovery for the smaller volume.",
    "maxQualityMinutes": 60,
    "timedAlternative": "m2"
  },
  "mc": {
    "sources": [
      "marathonlong"
    ],
    "why": "Moving easy recoveries make this a continuous run with repeated returns to the specific rhythm.",
    "when": "Runners prepared for the full 11 km main set plus their usual easy preparation.",
    "progression": "Use shorter continuous or broken rhythm work before extending the total distance.",
    "phase": "Build",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "A simplified adaptation of pace-change long runs. Easy floats deliberately replace the source’s harder alternating paces.",
    "maxQualityMinutes": 45,
    "timedAlternative": "m2"
  },
  "md": {
    "sources": [
      "marathonlong",
      "longest"
    ],
    "why": "The race-rhythm portion begins with some accumulated fatigue, adding specificity without an all-out finish.",
    "when": "Runners already comfortable with a similar easy long-run duration.",
    "progression": "First establish the total easy duration. This replaces a long-run session rather than being an extra.",
    "phase": "Sharpen",
    "attribution": "Pace Menu adaptation",
    "sourceNote": "A reduced, controlled adaptation of McMillan’s fast-finish concept; the finish is MP rather than his aggressive fastest-possible variant.",
    "maxQualityMinutes": 30,
    "timedAlternative": "m2"
  },
  "mx": {
    "sources": [
      "baamarathon",
      "predictors"
    ],
    "why": "Two long specific blocks rehearse sustained rhythm inside a much larger running load.",
    "when": "Experienced marathon runners after substantial, consistent preparation; VDOT alone cannot establish readiness.",
    "progression": "Do not jump here from shorter races or small pace sessions.",
    "phase": "Sharpen",
    "attribution": "Source structure",
    "sourceNote": "Retains B.A.A.’s two five-mile blocks, five-minute jog, and easy running before and after. Pacing uses current equivalent fitness.",
    "maxQualityMinutes": 75,
    "timedAlternative": "m2"
  },
  "ms": {
    "sources": [
      "baamarathon",
      "longest"
    ],
    "why": "An extended specific section inside easy running combines sustained rhythm and accumulated fatigue.",
    "when": "Marathon runners already prepared for a comparable total long-run duration.",
    "progression": "Use the shorter timed fast-finish session before considering this larger measured simulation.",
    "phase": "Sharpen",
    "attribution": "Source structure",
    "sourceNote": "Chooses the lower-volume combination inside B.A.A.’s published simulation ranges; current equivalent fitness sets MP.",
    "maxQualityMinutes": 60,
    "timedAlternative": "md"
  }
};
