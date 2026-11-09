export const RACES = [
  {id:'1500', label:'1500 m', meters:1500},
  {id:'mile', label:'Mile', meters:1609.344},
  {id:'3k', label:'3K', meters:3000},
  {id:'5k', label:'5K', meters:5000},
  {id:'10k', label:'10K', meters:10000},
  {id:'half', label:'Half marathon', meters:21097.5},
  {id:'marathon', label:'Marathon', meters:42195},
] as const;
export function parseTime(raw:string):number|null {
  const value=raw.trim();
  if(!/^\d{1,3}:\d{2}(?::\d{2})?$/.test(value)) return null;
  const parts=value.split(':').map(Number);
  if(parts.slice(1).some(p=>p>=60)) return null;
  const seconds=parts.length===3?parts[0]*3600+parts[1]*60+parts[2]:parts[0]*60+parts[1];
  return seconds>0?seconds:null;
}
// Daniels–Gilbert performance model. t is minutes; v is metres/minute.
export function vdot(meters:number,seconds:number):number {
  const t=seconds/60,v=meters/t;
  const oxygen=-4.6+0.182258*v+0.000104*v*v;
  const fraction=0.8+0.1894393*Math.exp(-0.012778*t)+0.2989558*Math.exp(-0.1932605*t);
  return oxygen/fraction;
}
export function raceSeconds(score:number,meters:number):number {
  let low=meters/10,high=meters*3;
  for(let i=0;i<90;i++){const mid=(low+high)/2;if(vdot(meters,mid)>score)low=mid;else high=mid;}
  return (low+high)/2;
}
export function durationPace(score:number,minutes:number):number {
  let low=50,high=600;
  for(let i=0;i<80;i++){const velocity=(low+high)/2;if(vdot(velocity*minutes,minutes*60)<score)low=velocity;else high=velocity;}
  return 60000/((low+high)/2);
}
export function oxygenPace(score:number,fraction:number):number {
  const v=(-0.182258+Math.sqrt(0.182258**2+4*0.000104*(4.6+score*fraction)))/(2*0.000104);
  return 60000/v;
}
export function formatTime(seconds:number):string {
  const s=Math.max(0,Math.round(seconds));
  return s>=3600?`${Math.floor(s/3600)}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`:`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
}
export type Category='easy'|'sub'|'threshold'|'vo2'|'speed'|'specific';
export type PaceKey='easy'|'subShort'|'subMedium'|'subLong'|'threshold'|'interval'|'repetition'|'5k'|'10k'|'half'|'marathon'|'1500'|'3k';
export type WorkBlock={reps:number;meters?:number;seconds?:number;pace:PaceKey;recovery:number;recoveryMeters?:number;recoveryRatio?:number;after?:number;afterMeters?:number;paceOffset?:number};
export type Workout={recoveryMeters?:number;recoveryRatio?:number;blocks?:WorkBlock[];prescription?:string;recoverySummary?:string;warmup?:number;cooldown?:number;id:string;name:string;category:Category;goals:string[];reps:number;meters?:number;seconds?:number;pace:PaceKey;recovery:number;recoveryType:string;level:'Light'|'Standard'|'Demanding';purpose:string;cue:string;note?:string};
export const CATEGORIES:{id:Category|'all';label:string;color:string}[]=[
 {id:'all',label:'All workouts',color:'#62645c'},
 {id:'sub',label:'Sub-threshold',color:'#8c9c31'},
 {id:'threshold',label:'Threshold',color:'#ca8645'},
 {id:'vo2',label:'VO₂max',color:'#8868aa'},
 {id:'speed',label:'Speed & economy',color:'#497eaa'},
 {id:'specific',label:'Race-specific',color:'#ba6c65'},
 {id:'easy',label:'Easy & endurance',color:'#568c76'},
];
const all=['mile','5k','10k','half','marathon'];
export const WORKOUTS:Workout[]=[
  {
    "id": "s1",
    "name": "Short & controlled",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k"
    ],
    "reps": 10,
    "seconds": 180,
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Accumulate aerobic work in short, repeatable blocks.",
    "cue": "Keep the first rep as relaxed as the last. Finish with something left."
  },
  {
    "id": "s2",
    "name": "The five-minute rhythm",
    "category": "sub",
    "goals": [
      "10k",
      "half"
    ],
    "reps": 6,
    "seconds": 300,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Build sustained aerobic strength without chasing threshold.",
    "cue": "Settle into a steady rhythm. Breathing should stay controlled."
  },
  {
    "id": "s3",
    "name": "Long aerobic blocks",
    "category": "sub",
    "goals": [
      "half",
      "marathon"
    ],
    "reps": 4,
    "seconds": 480,
    "pace": "subLong",
    "recovery": 90,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Extend time at a controlled intensity with longer repetitions.",
    "cue": "Use the slower end of the range first. Avoid a hard finish."
  },
  {
    "id": "s4",
    "name": "The ten-minute repeat",
    "category": "sub",
    "goals": [
      "marathon"
    ],
    "reps": 3,
    "seconds": 600,
    "pace": "subLong",
    "recovery": 90,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Practise patient pacing through longer aerobic intervals.",
    "cue": "This should feel sustainable, with at least one more rep in reserve."
  },
  {
    "id": "s5",
    "name": "Measured kilometres",
    "category": "sub",
    "goals": [
      "5k",
      "10k"
    ],
    "reps": 6,
    "meters": 1000,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Make controlled aerobic work easy to pace on a measured route.",
    "cue": "Stay below threshold effort. Choose a timed option if these reps feel too long.",
    "note": "A fixed-distance option: slower runners may prefer 6 × 5 min to limit work duration."
  },
  {
    "id": "s6",
    "name": "An introduction to control",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "half",
      "marathon"
    ],
    "reps": 6,
    "seconds": 180,
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "Explore sub-threshold effort with a smaller amount of work.",
    "cue": "Finish comfortable. The aim is control, not exhaustion."
  },
  {
    "id": "t1",
    "name": "Classic cruise intervals",
    "category": "threshold",
    "goals": [
      "mile",
      "5k"
    ],
    "reps": 4,
    "seconds": 300,
    "pace": "threshold",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Develop the ability to sustain a comfortably hard effort.",
    "cue": "Firm and even. Resist speeding up when a short recovery makes the first reps feel easy."
  },
  {
    "id": "t2",
    "name": "Three steady blocks",
    "category": "threshold",
    "goals": [
      "5k",
      "10k",
      "half"
    ],
    "reps": 3,
    "seconds": 360,
    "pace": "threshold",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Build threshold endurance with brief resets between repetitions.",
    "cue": "Aim for consistent effort across all three blocks."
  },
  {
    "id": "t3",
    "name": "The continuous tempo",
    "category": "threshold",
    "goals": [
      "10k",
      "half",
      "marathon"
    ],
    "reps": 1,
    "seconds": 1200,
    "pace": "threshold",
    "recovery": 0,
    "recoveryType": "continuous",
    "level": "Standard",
    "purpose": "Practise uninterrupted running around estimated one-hour race effort.",
    "cue": "Comfortably hard, not a time trial. Ease off if the effort keeps climbing."
  },
  {
    "id": "t4",
    "name": "A little more threshold",
    "category": "threshold",
    "goals": [
      "half",
      "marathon"
    ],
    "reps": 5,
    "seconds": 300,
    "pace": "threshold",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Extend threshold volume for runners already comfortable with shorter sessions.",
    "cue": "Add volume only when 4 × 5 min feels well controlled.",
    "note": "Higher-volume option. Work distance should fit your established weekly training."
  },
  {
    "id": "v1",
    "name": "The aerobic power classic",
    "category": "vo2",
    "goals": [
      "mile",
      "5k"
    ],
    "reps": 5,
    "seconds": 180,
    "pace": "interval",
    "recovery": 120,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Develop aerobic power with repeatable hard efforts.",
    "cue": "Hard, smooth and repeatable. Avoid sprinting the start."
  },
  {
    "id": "v2",
    "name": "Two-minute repeats",
    "category": "vo2",
    "goals": [
      "mile",
      "5k"
    ],
    "reps": 6,
    "seconds": 120,
    "pace": "interval",
    "recovery": 90,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "Introduce aerobic-power work in manageable repetitions.",
    "cue": "Stay at the target effort even if the early reps feel short."
  },
  {
    "id": "v3",
    "name": "Four-minute focus",
    "category": "vo2",
    "goals": [
      "5k",
      "10k"
    ],
    "reps": 4,
    "seconds": 240,
    "pace": "interval",
    "recovery": 180,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Spend longer in each aerobic-power repetition.",
    "cue": "Run evenly. The last minute should feel hard without losing form."
  },
  {
    "id": "v4",
    "name": "Extended aerobic power",
    "category": "vo2",
    "goals": [
      "10k"
    ],
    "reps": 5,
    "seconds": 240,
    "pace": "interval",
    "recovery": 180,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Increase hard running for athletes accustomed to interval sessions.",
    "cue": "Use this only after shorter interval sessions are consistently repeatable.",
    "note": "Higher-volume option. Keep interval work within roughly 8% of weekly distance."
  },
  {
    "id": "r1",
    "name": "Fast, relaxed 200s",
    "category": "speed",
    "goals": [
      "mile",
      "5k",
      "10k"
    ],
    "reps": 8,
    "meters": 200,
    "pace": "repetition",
    "recovery": 120,
    "recoveryType": "walk / jog",
    "level": "Light",
    "purpose": "Improve coordination and economy at a relaxed fast speed.",
    "cue": "Stay tall and loose. Take more recovery if you are not ready to run smoothly."
  },
  {
    "id": "r2",
    "name": "A short speed touch",
    "category": "speed",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 6,
    "seconds": 20,
    "pace": "repetition",
    "recovery": 80,
    "recoveryType": "walk / jog",
    "level": "Light",
    "purpose": "Add a small dose of fast running with little total volume.",
    "cue": "Build into the pace, hold relaxed form, then ease down. These are not sprints."
  },
  {
    "id": "r3",
    "name": "Thirty-second repetitions",
    "category": "speed",
    "goals": [
      "mile",
      "5k"
    ],
    "reps": 8,
    "seconds": 30,
    "pace": "repetition",
    "recovery": 90,
    "recoveryType": "walk / jog",
    "level": "Light",
    "purpose": "Practise efficient fast running with generous recovery.",
    "cue": "Prioritise good mechanics over forcing an exact distance."
  },
  {
    "id": "e1",
    "name": "The easy reset",
    "category": "easy",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 1,
    "seconds": 1800,
    "pace": "easy",
    "recovery": 0,
    "recoveryType": "continuous",
    "level": "Light",
    "purpose": "Add low-stress aerobic running and support recovery.",
    "cue": "Conversational throughout. Slower than the suggested range is fine.",
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "e2",
    "name": "Aerobic mileage",
    "category": "easy",
    "goals": [
      "10k",
      "half",
      "marathon"
    ],
    "reps": 1,
    "seconds": 2700,
    "pace": "easy",
    "recovery": 0,
    "recoveryType": "continuous",
    "level": "Standard",
    "purpose": "Build aerobic capacity through comfortable, steady running.",
    "cue": "Keep the effort easy even on hills or into a headwind.",
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "e3",
    "name": "Time on your feet",
    "category": "easy",
    "goals": [
      "half",
      "marathon"
    ],
    "reps": 1,
    "seconds": 4500,
    "pace": "easy",
    "recovery": 0,
    "recoveryType": "continuous",
    "level": "Demanding",
    "purpose": "Develop endurance at a conversational intensity.",
    "cue": "Choose this only when the duration fits your usual long run and weekly volume.",
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "m1",
    "name": "Relaxed race-rhythm 200s",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "pace": "repetition",
    "reps": 8,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "Fast running with room to stay relaxed.",
    "cue": "Let form dictate recovery. Take longer if you cannot repeat the same smooth mechanics.",
    "meters": 200,
    "recoveryMeters": 200
  },
  {
    "id": "mi2",
    "name": "Race-season 300s",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "pace": "1500",
    "reps": 5,
    "recovery": 180,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "A longer stretch of middle-distance race rhythm.",
    "cue": "Run at current 1500 m-equivalent pace, with a generous three-minute reset.",
    "meters": 300
  },
  {
    "id": "mi5",
    "name": "Sustained 1500 rhythm",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "pace": "1500",
    "reps": 6,
    "recovery": 0,
    "recoveryType": "standing / walking",
    "level": "Demanding",
    "purpose": "Hold 1500 m rhythm for a full lap.",
    "cue": "Recover for approximately the time taken by the previous rep. Keep each lap even.",
    "meters": 400,
    "recoveryRatio": 1
  },
  {
    "id": "mi3",
    "name": "Paired 400s",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "pace": "1500",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Regain race rhythm after a short moving reset.",
    "cue": "Use 100 m jog inside each pair and five minutes between pairs. The final rep has no added recovery.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "1500",
        "recovery": 0,
        "meters": 400,
        "afterMeters": 100,
        "after": 0
      },
      {
        "reps": 1,
        "pace": "1500",
        "recovery": 0,
        "meters": 400,
        "afterMeters": 0,
        "after": 300
      },
      {
        "reps": 1,
        "pace": "1500",
        "recovery": 0,
        "meters": 400,
        "afterMeters": 100,
        "after": 0
      },
      {
        "reps": 1,
        "pace": "1500",
        "recovery": 0,
        "meters": 400,
        "afterMeters": 0,
        "after": 300
      },
      {
        "reps": 1,
        "pace": "1500",
        "recovery": 0,
        "meters": 400,
        "afterMeters": 100,
        "after": 0
      },
      {
        "reps": 1,
        "pace": "1500",
        "recovery": 0,
        "meters": 400,
        "afterMeters": 0,
        "after": 300
      }
    ],
    "prescription": "3 × (2 × 400 m)",
    "recoverySummary": "100 m jog / 5 min reset"
  },
  {
    "id": "mi6",
    "name": "Long race-specific 600s",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "pace": "1500",
    "reps": 4,
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Develop sustained middle-distance race endurance.",
    "cue": "A specialist workout, not relaxed economy work. Use twice the preceding rep time as recovery.",
    "meters": 600,
    "recoveryRatio": 2
  },
  {
    "id": "mi4",
    "name": "Low-volume lap rehearsal",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "pace": "1500",
    "reps": 4,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "A brief reminder of familiar race rhythm.",
    "cue": "Stay at current equivalent 1500 pace. The purpose is freshness, not a last-minute fitness test.",
    "meters": 400,
    "recoveryMeters": 400
  },
  {
    "id": "5e",
    "name": "Timed 5K introduction",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "pace": "5k",
    "reps": 8,
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "Learn race effort without a measured course.",
    "cue": "Keep the effort even. Do not sprint because the reps are short.",
    "seconds": 60
  },
  {
    "id": "5d",
    "name": "Two-minute race rhythm",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "pace": "5k",
    "reps": 6,
    "recovery": 90,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Hold current race rhythm for a little longer.",
    "cue": "Keep the recovery easy; the session should not become an all-out test.",
    "seconds": 120
  },
  {
    "id": "5a",
    "name": "The 400 m rhythm builder",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "pace": "5k",
    "reps": 10,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Accumulate race-pace distance in short pieces.",
    "cue": "Hold the same race rhythm, with a genuinely easy 200 m jog.",
    "meters": 400,
    "recoveryMeters": 200
  },
  {
    "id": "5b",
    "name": "The 800 m step-up",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "pace": "5k",
    "reps": 6,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Extend uninterrupted running at 5K rhythm.",
    "cue": "Run evenly. A generous jog helps preserve race rhythm rather than forcing a hard float.",
    "meters": 800,
    "recoveryMeters": 400
  },
  {
    "id": "5c",
    "name": "The kilometre rehearsal",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "pace": "5k",
    "reps": 5,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Rehearse sustained race rhythm with clear resets.",
    "cue": "Choose only after a specific build. Completion does not guarantee a future race result.",
    "meters": 1000,
    "recoveryMeters": 400
  },
  {
    "id": "5f",
    "name": "Controlled 1200 change-ups",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "pace": "5k",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Change gears from 10K to 3K rhythm inside each rep.",
    "cue": "No break inside each 1200. Keep the faster finish controlled; there is no all-out final rep.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 800
      },
      {
        "reps": 1,
        "pace": "3k",
        "recovery": 0,
        "meters": 400,
        "after": 180
      },
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 800
      },
      {
        "reps": 1,
        "pace": "3k",
        "recovery": 0,
        "meters": 400,
        "after": 180
      },
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 800
      },
      {
        "reps": 1,
        "pace": "3k",
        "recovery": 0,
        "meters": 400,
        "after": 180
      },
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 800
      },
      {
        "reps": 1,
        "pace": "3k",
        "recovery": 0,
        "meters": 400,
        "after": 180
      }
    ],
    "prescription": "4 × (800 m + 400 m)",
    "recoverySummary": "3 min between 1200s"
  },
  {
    "id": "5g",
    "name": "Light-and-fresh 400s",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "pace": "5k",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Rehearse controlled faster gears with more recovery.",
    "cue": "The second set is 2 sec per lap faster; the third is 4 sec faster. Jog 400 m between sets.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 3,
        "pace": "5k",
        "recovery": 0,
        "meters": 400,
        "recoveryMeters": 100,
        "afterMeters": 400
      },
      {
        "reps": 3,
        "pace": "5k",
        "recovery": 0,
        "meters": 400,
        "recoveryMeters": 200,
        "afterMeters": 400,
        "paceOffset": -5
      },
      {
        "reps": 3,
        "pace": "5k",
        "recovery": 0,
        "meters": 400,
        "recoveryMeters": 400,
        "paceOffset": -10
      }
    ],
    "prescription": "3 sets × 3 × 400 m",
    "recoverySummary": "100 / 200 / 400 m jog"
  },
  {
    "id": "10e",
    "name": "First taste of 10K rhythm",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "pace": "10k",
    "reps": 6,
    "recovery": 120,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "An approachable time-based race-rhythm session.",
    "cue": "Two minutes at current equivalent 10K pace, then two minutes easy. Keep every rep repeatable.",
    "seconds": 120
  },
  {
    "id": "10a",
    "name": "Measured race kilometres",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "pace": "10k",
    "reps": 5,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Settle into an even, measurable 10K rhythm.",
    "cue": "The recovery is 400 m, not a fixed invented number of seconds.",
    "meters": 1000,
    "recoveryMeters": 400
  },
  {
    "id": "10d",
    "name": "Longer fifteen-hundreds",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "pace": "10k",
    "reps": 4,
    "recovery": 180,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Spend longer at 10K rhythm before each reset.",
    "cue": "A measured step beyond kilometres. Keep the three-minute jog genuinely easy.",
    "meters": 1500
  },
  {
    "id": "10b",
    "name": "Extended two-kilometre blocks",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "pace": "10k",
    "reps": 3,
    "recovery": 180,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Practise sustained race effort in longer blocks.",
    "cue": "This is a substantial session. Stay at current rhythm and avoid making the final block a race.",
    "meters": 2000
  },
  {
    "id": "10c",
    "name": "Long 10K race rehearsal",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "pace": "10k",
    "reps": 3,
    "recovery": 300,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "A substantial rehearsal for prepared 10K runners.",
    "cue": "Keep the five-minute jog. This is an advanced choice, not a default session or a guaranteed predictor.",
    "meters": 3000
  },
  {
    "id": "10f",
    "name": "Race strength, then quicker rhythm",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "pace": "10k",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Switch from 10K rhythm to a short faster finish.",
    "cue": "Jog three minutes between the two sets. The faster minutes stay controlled at current 5K rhythm.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 4,
        "pace": "10k",
        "recovery": 120,
        "seconds": 180,
        "after": 180
      },
      {
        "reps": 4,
        "pace": "5k",
        "recovery": 60,
        "seconds": 60
      }
    ],
    "prescription": "4 × 3 min + 4 × 1 min",
    "recoverySummary": "2 min / 1 min jog"
  },
  {
    "id": "ha",
    "name": "Half-rhythm introduction",
    "category": "specific",
    "goals": [
      "half"
    ],
    "pace": "half",
    "reps": 6,
    "recovery": 90,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "Get familiar with half-marathon rhythm in small pieces.",
    "cue": "Stay patient. The target is half-marathon race rhythm, not automatically threshold.",
    "meters": 800
  },
  {
    "id": "hb",
    "name": "Half-marathon metric miles",
    "category": "specific",
    "goals": [
      "half"
    ],
    "pace": "half",
    "reps": 4,
    "recovery": 120,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Practise longer, even event-rhythm repetitions.",
    "cue": "Run each 1600 m at the same effort. Do not accelerate the final rep to prove fitness.",
    "meters": 1600
  },
  {
    "id": "hc",
    "name": "Broken long half rhythm",
    "category": "specific",
    "goals": [
      "half"
    ],
    "pace": "half",
    "reps": 2,
    "recovery": 240,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Hold race rhythm through two substantial blocks.",
    "cue": "Take the four-minute easy jog. Choose this for sustained control, not a fast last rep.",
    "meters": 3200
  },
  {
    "id": "hd",
    "name": "Continuous half rhythm",
    "category": "specific",
    "goals": [
      "half"
    ],
    "pace": "half",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "An uninterrupted, time-bounded event-rhythm effort.",
    "cue": "Half-marathon pace is event-specific. Its physiological intensity changes with your finishing duration.",
    "seconds": 1500
  },
  {
    "id": "he",
    "name": "Alternating half and marathon rhythm",
    "category": "specific",
    "goals": [
      "half"
    ],
    "pace": "half",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Keep moving between two purposeful race rhythms.",
    "cue": "Alternate half / marathon / half / marathon / half. The marathon portions are work, not easy rest.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "half",
        "recovery": 0,
        "meters": 1600
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1600
      },
      {
        "reps": 1,
        "pace": "half",
        "recovery": 0,
        "meters": 1600
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1600
      },
      {
        "reps": 1,
        "pace": "half",
        "recovery": 0,
        "meters": 1600
      }
    ],
    "prescription": "5 × 1600 m alternating",
    "recoverySummary": "Marathon-pace floats"
  },
  {
    "id": "hf",
    "name": "Half rhythm on tired legs",
    "category": "specific",
    "goals": [
      "half"
    ],
    "pace": "half",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Find race rhythm after some comfortable running.",
    "cue": "The opening and closing easy blocks are already your warm-up and cool-down.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "seconds": 2400
      },
      {
        "reps": 1,
        "pace": "half",
        "recovery": 0,
        "seconds": 1200
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "seconds": 600
      }
    ],
    "prescription": "40 easy + 20 half + 10 easy",
    "recoverySummary": "Continuous",
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "hg",
    "name": "Half-marathon mixed-pace finish",
    "category": "specific",
    "goals": [
      "half"
    ],
    "pace": "half",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Practise controlled gear changes after sustained work.",
    "cue": "Use half rhythm, then 10K rhythm, then controlled 5K reps. No all-out finish.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "half",
        "recovery": 0,
        "meters": 3000,
        "after": 180
      },
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 2000,
        "after": 180
      },
      {
        "reps": 4,
        "pace": "5k",
        "recovery": 120,
        "meters": 400
      }
    ],
    "prescription": "3000 + 2000 + 4 × 400 m",
    "recoverySummary": "3 min / 2 min jog"
  },
  {
    "id": "me",
    "name": "Marathon-rhythm introduction",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "pace": "marathon",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "A smaller, standalone rehearsal of current marathon rhythm.",
    "cue": "A race-time equivalent is not proof of marathon endurance. Match the effort to the preparation you actually have.",
    "seconds": 1200
  },
  {
    "id": "m2",
    "name": "Broken timed marathon rhythm",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "pace": "marathon",
    "reps": 2,
    "recovery": 180,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Two controlled blocks with a clear easy reset.",
    "cue": "Settle into rhythm, jog three minutes, then repeat without chasing a quicker second block.",
    "seconds": 900
  },
  {
    "id": "mb",
    "name": "Sustained marathon blocks",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "pace": "marathon",
    "reps": 2,
    "recovery": 180,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Extend marathon-rhythm running with one easy reset.",
    "cue": "Practise pacing and fuelling. The elapsed work matters as much as the 10 km distance.",
    "meters": 5000
  },
  {
    "id": "mc",
    "name": "Continuous marathon alternations",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "pace": "marathon",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Return to marathon rhythm while keeping the run continuous.",
    "cue": "Six marathon kilometres, with an easy kilometre between the first five. There is no final float.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 1000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000
      }
    ],
    "prescription": "6 × 1000 m / 1000 m easy",
    "recoverySummary": "1 km easy floats"
  },
  {
    "id": "md",
    "name": "Controlled marathon fast finish",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "pace": "marathon",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Move into race rhythm after an established easy duration.",
    "cue": "The finish stays controlled at current marathon rhythm. Practise fuelling rather than racing the final minutes.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "seconds": 3600
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "seconds": 1200
      }
    ],
    "prescription": "60 min easy + 20 min MP",
    "recoverySummary": "Continuous",
    "warmup": 0,
    "cooldown": 300
  },
  {
    "id": "mx",
    "name": "Experienced runner’s split rehearsal",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "pace": "marathon",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "A substantial specific rehearsal inside a complete run.",
    "cue": "Includes 2 miles easy before and after. Read the full calculated duration before choosing this advanced option.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 3218.688
      },
      {
        "reps": 2,
        "pace": "marathon",
        "recovery": 300,
        "meters": 8046.72
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 3218.688
      }
    ],
    "prescription": "2 × 5 miles at marathon pace",
    "recoverySummary": "5 min easy jog",
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "ms",
    "name": "Marathon-rhythm long-run simulation",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "pace": "marathon",
    "reps": 1,
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "purpose": "Rehearse race rhythm, kit and fuelling in a complete longer run.",
    "cue": "The easy opening and finish are included. This is not a warm-up plus another long run.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 8046.72
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 9656.064
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 1609.344
      }
    ],
    "prescription": "5 mi easy + 6 mi MP + 1 mi easy",
    "recoverySummary": "Continuous",
    "warmup": 0,
    "cooldown": 0
  }
];
export function paceRange(score:number,key:PaceKey):[number,number]{
 const t=durationPace(score,60);
 if(key==='easy')return [oxygenPace(score,.74),oxygenPace(score,.59)];
 if(key==='subShort')return [t+5,t+10];
 if(key==='subMedium')return [t+10,t+15];
 if(key==='subLong')return [t+15,t+20];
 if(key==='threshold')return [t,t+3];
 if(key==='interval'){const p=durationPace(score,11);return[p,p+3];}
 if(key==='repetition'){const p=raceSeconds(score,1609.344)/1.609344;return[p,p+2];}
 const r=RACES.find(r=>r.id===key)!;const p=raceSeconds(score,r.meters)/(r.meters/1000);return[p,p+2];
}
export const PACE_LABELS:Record<PaceKey,string>={easy:'Easy',subShort:'Short sub-threshold',subMedium:'Sub-threshold',subLong:'Long sub-threshold',threshold:'Threshold',interval:'Aerobic power',repetition:'Mile rhythm','5k':'5K pace','10k':'10K pace',half:'Half-marathon pace',marathon:'Marathon pace','1500':'1500 m pace','3k':'3K pace'};
export function workoutBlocks(w:Workout):WorkBlock[]{return w.blocks??[{reps:w.reps,meters:w.meters,seconds:w.seconds,pace:w.pace,recovery:w.recovery,recoveryMeters:w.recoveryMeters,recoveryRatio:w.recoveryRatio}];}
export function blockMetrics(b:WorkBlock,score:number){
 const range=paceRange(score,b.pace).map(p=>p+(b.paceOffset??0)) as [number,number],mid=(range[0]+range[1])/2;
 const repSeconds=b.seconds??b.meters!/1000*mid;
 const repMeters=b.meters??b.seconds!/mid*1000;
 return {range,repSeconds,repMeters,workSeconds:repSeconds*b.reps,workMeters:repMeters*b.reps};
}
export function recoveryDuration(b:WorkBlock,score:number):number {
 if(b.recoveryMeters)return b.recoveryMeters/1000*(paceRange(score,'easy').reduce((a,b)=>a+b)/2);
 if(b.recoveryRatio)return blockMetrics(b,score).repSeconds*b.recoveryRatio;
 return b.recovery;
}
export function transitionDuration(b:WorkBlock,score:number):number {
 return b.afterMeters?b.afterMeters/1000*(paceRange(score,'easy').reduce((a,b)=>a+b)/2):(b.after??0);
}
export function workoutMetrics(w:Workout,score:number){
 const blocks=workoutBlocks(w),first=blockMetrics(blocks[0],score);
 let workSeconds=0,workMeters=0,recoverySeconds=0,qualityMeters=0,qualitySeconds=0,specificMeters=0,specificSeconds=0,longestRepSeconds=0;
 blocks.forEach((b,i)=>{const m=blockMetrics(b,score);workSeconds+=m.workSeconds;workMeters+=m.workMeters;if(b.pace!=='easy'){qualityMeters+=m.workMeters;qualitySeconds+=m.workSeconds;longestRepSeconds=Math.max(longestRepSeconds,m.repSeconds)}if(b.pace===w.pace){specificMeters+=m.workMeters;specificSeconds+=m.workSeconds}recoverySeconds+=(b.reps-1)*recoveryDuration(b,score)+(i<blocks.length-1?transitionDuration(b,score):0);});
 return {...first,range:paceRange(score,w.pace),workSeconds,workMeters,recoverySeconds,qualityMeters,qualitySeconds,specificMeters,specificSeconds,longestRepSeconds,totalSeconds:workSeconds+recoverySeconds+(w.warmup??900)+(w.cooldown??600)};
}
export function prescription(w:Workout):string{return w.prescription??`${w.reps>1?w.reps+' × ':''}${w.meters?w.meters.toLocaleString('en-GB')+' m':w.seconds!<60?w.seconds+' sec':w.seconds!/60+' min'}`;}
export function recoveryLabel(w:Workout):string{return w.recoverySummary??(w.recoveryMeters?`${w.recoveryMeters} m jog`:w.recoveryRatio?`${w.recoveryRatio===1?'Equal':'2 ×'} rep time`:(w.recovery?`${formatTime(w.recovery)} ${w.recoveryType==='walk / jog'?'walk/jog':'jog'}`:'Continuous'));}
