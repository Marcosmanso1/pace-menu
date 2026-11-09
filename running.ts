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
export type SummaryStep={reps:number;meters?:number;seconds?:number;pace?:PaceKey};
export type Workout={focus?:string;summarySteps?:SummaryStep[];summarySets?:number;recoveryMeters?:number;recoveryRatio?:number;blocks?:WorkBlock[];prescription?:string;recoverySummary?:string;warmup?:number;cooldown?:number;id:string;name:string;category:Category;goals:string[];reps:number;meters?:number;seconds?:number;pace:PaceKey;recovery:number;recoveryType:string;level:'Light'|'Standard'|'Demanding';purpose:string;cue:string;note?:string};
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
    "id": "m1",
    "name": "Relaxed race rhythm",
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
    "recoveryMeters": 200,
    "focus": "Race rhythm"
  },
  {
    "id": "5a",
    "name": "The rhythm builder",
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
    "cue": "Keep the same race rhythm throughout, with an easy jog between efforts.",
    "meters": 400,
    "recoveryMeters": 200
  },
  {
    "id": "10a",
    "name": "Measured race repeats",
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
    "cue": "Keep the recovery as the written distance; jog it easily without chasing a time.",
    "meters": 1000,
    "recoveryMeters": 400
  },
  {
    "id": "hb",
    "name": "Sustained half-marathon repeats",
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
    "cue": "Run each repetition at the same effort. Keep the final rep controlled.",
    "meters": 1600
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
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Light",
    "purpose": "Explore sub-threshold effort with a smaller amount of work.",
    "cue": "Finish comfortable. The aim is control, not exhaustion.",
    "seconds": 180
  },
  {
    "id": "st03",
    "name": "A little more short work",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 8,
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Light",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "seconds": 180
  },
  {
    "id": "st04",
    "name": "A measured four-minute start",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 5,
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Light",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "seconds": 240
  },
  {
    "id": "st05",
    "name": "A first set of medium repeats",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 4,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Light",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "seconds": 300
  },
  {
    "id": "st06",
    "name": "Medium repeats, smaller dose",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 3,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Light",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "seconds": 360
  },
  {
    "id": "st07",
    "name": "The six-minute introduction",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 4,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Light",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "seconds": 360
  },
  {
    "id": "st08",
    "name": "Longer repeats, manageable dose",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 3,
    "pace": "subLong",
    "recovery": 90,
    "recoveryType": "walk / easy jog",
    "level": "Light",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "seconds": 480
  },
  {
    "id": "st09",
    "name": "The long-rep introduction",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 2,
    "pace": "subLong",
    "recovery": 120,
    "recoveryType": "walk / easy jog",
    "level": "Light",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "seconds": 600
  },
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
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Accumulate aerobic work in short, repeatable blocks.",
    "cue": "Keep the first rep as relaxed as the last. Finish with something left.",
    "seconds": 180
  },
  {
    "id": "st10",
    "name": "The four-minute rhythm",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 8,
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "seconds": 240
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
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Build sustained aerobic strength without chasing threshold.",
    "cue": "Settle into a steady rhythm. Breathing should stay controlled.",
    "seconds": 300
  },
  {
    "id": "st11",
    "name": "The classic six-minute set",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 5,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "seconds": 360
  },
  {
    "id": "st12",
    "name": "Extended six-minute work",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 6,
    "pace": "subMedium",
    "recovery": 90,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "seconds": 360
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
    "pace": "subLong",
    "recovery": 90,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Extend time at a controlled intensity with longer repetitions.",
    "cue": "Use the slower end of the range first. Avoid a hard finish.",
    "seconds": 480
  },
  {
    "id": "s4",
    "name": "The ten-minute repeat",
    "category": "sub",
    "goals": [
      "marathon"
    ],
    "reps": 3,
    "pace": "subLong",
    "recovery": 90,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Practise patient pacing through longer aerobic intervals.",
    "cue": "This should feel sustainable, with at least one more rep in reserve.",
    "seconds": 600
  },
  {
    "id": "st13",
    "name": "Sustained twelve-minute blocks",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 3,
    "pace": "subLong",
    "recovery": 120,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "seconds": 720
  },
  {
    "id": "st14",
    "name": "Two sustained aerobic blocks",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 2,
    "pace": "subLong",
    "recovery": 120,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "seconds": 900
  },
  {
    "id": "st15",
    "name": "A larger ten-minute dose",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 4,
    "pace": "subLong",
    "recovery": 120,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "seconds": 600
  },
  {
    "id": "st16",
    "name": "Long-form controlled endurance",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 3,
    "pace": "subLong",
    "recovery": 180,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "Controlled, repeatable aerobic work with a deliberate fixed dose.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "seconds": 900
  },
  {
    "id": "st17",
    "name": "Two controlled gears",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "subLong",
    "recovery": 0,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "Begin conservatively before settling into a slightly firmer controlled rhythm.",
    "cue": "The second half is only a small lift in effort. If breathing rises, keep the gentler pace instead.",
    "blocks": [
      {
        "reps": 2,
        "seconds": 600,
        "pace": "subLong",
        "recovery": 120,
        "after": 120
      },
      {
        "reps": 2,
        "seconds": 600,
        "pace": "subMedium",
        "recovery": 120
      }
    ],
    "summarySteps": [
      {
        "reps": 4,
        "seconds": 600
      }
    ]
  },
  {
    "id": "sd01",
    "name": "Short measured repeats",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 10,
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "meters": 600
  },
  {
    "id": "sd02",
    "name": "A measured short-rep bridge",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 8,
    "pace": "subShort",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "meters": 800
  },
  {
    "id": "s5",
    "name": "Measured aerobic repeats",
    "category": "sub",
    "goals": [
      "5k",
      "10k"
    ],
    "reps": 6,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "easy jog",
    "level": "Standard",
    "purpose": "Make controlled aerobic work easy to pace on a measured route.",
    "cue": "Stay below threshold effort. Choose a timed option if these reps feel too long.",
    "meters": 1000
  },
  {
    "id": "sd04",
    "name": "More measured aerobic work",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 8,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "meters": 1000
  },
  {
    "id": "sd05",
    "name": "The larger repeat set",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 10,
    "pace": "subMedium",
    "recovery": 60,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "meters": 1000
  },
  {
    "id": "sd06",
    "name": "Sustained measured rhythm",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 5,
    "pace": "subMedium",
    "recovery": 90,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end of the estimate. Keep breathing controlled and finish with another repetition in reserve.",
    "meters": 1600
  },
  {
    "id": "sd07",
    "name": "Controlled long repetitions",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 4,
    "pace": "subLong",
    "recovery": 90,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 2000
  },
  {
    "id": "sd08",
    "name": "A larger long-rep set",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 5,
    "pace": "subLong",
    "recovery": 90,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 2000
  },
  {
    "id": "sd09",
    "name": "The sustained-block bridge",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 3,
    "pace": "subLong",
    "recovery": 120,
    "recoveryType": "walk / easy jog",
    "level": "Standard",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 2500
  },
  {
    "id": "sd10",
    "name": "Classic long aerobic repeats",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 3,
    "pace": "subLong",
    "recovery": 120,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 3000
  },
  {
    "id": "sd11",
    "name": "A substantial aerobic set",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 4,
    "pace": "subLong",
    "recovery": 120,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 3000
  },
  {
    "id": "sd12",
    "name": "Two extended controlled blocks",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 2,
    "pace": "subLong",
    "recovery": 120,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 4000
  },
  {
    "id": "sd13",
    "name": "Extended aerobic endurance",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 3,
    "pace": "subLong",
    "recovery": 180,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 4000
  },
  {
    "id": "sd14",
    "name": "Long controlled repetitions",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 2,
    "pace": "subLong",
    "recovery": 180,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 5000
  },
  {
    "id": "sd15",
    "name": "The extended endurance set",
    "category": "sub",
    "goals": [
      "mile",
      "5k",
      "10k",
      "half",
      "marathon"
    ],
    "reps": 3,
    "pace": "subLong",
    "recovery": 180,
    "recoveryType": "walk / easy jog",
    "level": "Demanding",
    "purpose": "A fixed-distance alternative for controlled aerobic work.",
    "cue": "Start at the slower end and slow further if effort rises. Keep the long repetitions controlled; do not force the calculated pace.",
    "meters": 5000
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
    "cue": "Add volume only when 4 \u00d7 5 min feels well controlled.",
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
    "name": "Fast, relaxed repeats",
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
    "name": "Aerobic volume",
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
    "id": "mi2",
    "name": "Race-season speed",
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
    "name": "Sustained track rhythm",
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
    "name": "Paired race-speed laps",
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
    "cue": "Use the short jog inside each pair and the longer reset between pairs.",
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
        "meters": 400
      }
    ],
    "summarySets": 3,
    "summarySteps": [
      {
        "reps": 2,
        "meters": 400
      }
    ]
  },
  {
    "id": "mi6",
    "name": "Long race-specific repeats",
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
    "recoveryMeters": 400,
    "focus": "Sharpening"
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
    "seconds": 60,
    "focus": "Race rhythm"
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
    "id": "5b",
    "name": "The two-lap step-up",
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
    "name": "The key race rehearsal",
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
    "name": "Controlled gear changes",
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
        "meters": 400
      }
    ],
    "summarySets": 4,
    "summarySteps": [
      {
        "reps": 1,
        "meters": 800
      },
      {
        "reps": 1,
        "meters": 400
      }
    ]
  },
  {
    "id": "5g",
    "name": "Light and fresh",
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
    "cue": "Each set is a little quicker. Follow the calculated pace for that set and take the written jog recoveries.",
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
    "summarySets": 3,
    "summarySteps": [
      {
        "reps": 3,
        "meters": 400
      }
    ]
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
    "seconds": 120,
    "focus": "Race rhythm"
  },
  {
    "id": "10d",
    "name": "Longer race repetitions",
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
    "name": "Extended race blocks",
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
    ]
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
    "meters": 800,
    "focus": "Race rhythm"
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
    "summarySteps": [
      {
        "reps": 5,
        "meters": 1600
      }
    ]
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
    ]
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
    "seconds": 1200,
    "focus": "Race rhythm"
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
    "cue": "Practise pacing and fuelling. Check that the full duration fits your established training.",
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
    "summarySteps": [
      {
        "reps": 6,
        "meters": 1000,
        "pace": "marathon"
      },
      {
        "reps": 5,
        "meters": 1000,
        "pace": "easy"
      }
    ]
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
    "warmup": 0,
    "cooldown": 300
  },
  {
    "id": "mx",
    "name": "Experienced runner\u2019s split rehearsal",
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
    "cue": "Includes the easy opening and finish. Check the full duration before choosing this demanding rehearsal.",
    "seconds": 1,
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 3000
      },
      {
        "reps": 2,
        "pace": "marathon",
        "recovery": 300,
        "meters": 8000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 3000
      }
    ],
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
        "meters": 8000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 10000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 2000
      }
    ],
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "miX1",
    "name": "Race-pace extensions",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Hold current 1500 m rhythm; take the full recovery.",
    "blocks": [
      {
        "reps": 4,
        "meters": 500,
        "pace": "1500",
        "recovery": 180
      }
    ],
    "summarySteps": [
      {
        "reps": 4,
        "meters": 500,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "miX2",
    "name": "Broken-race triples",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Relax after the long rep, then reproduce race rhythm in the short pieces.",
    "blocks": [
      {
        "reps": 1,
        "meters": 800,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "meters": 800,
        "pace": "1500"
      },
      {
        "reps": 2,
        "meters": 200,
        "pace": "1500"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "miX3",
    "name": "Descending race sets",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Keep one race pace as the repetitions shorten; do not turn the last rep into a sprint.",
    "blocks": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 300,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 240
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 300,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 240
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 300,
        "pace": "1500",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 300,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "miX4",
    "name": "Paired race-speed repeats",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Use the short jog inside each pair and reset fully between pairs.",
    "blocks": [
      {
        "reps": 2,
        "meters": 300,
        "pace": "1500",
        "recovery": 0,
        "after": 0,
        "recoveryMeters": 100,
        "afterMeters": 400
      },
      {
        "reps": 2,
        "meters": 300,
        "pace": "1500",
        "recovery": 0,
        "after": 0,
        "recoveryMeters": 100,
        "afterMeters": 400
      },
      {
        "reps": 2,
        "meters": 300,
        "pace": "1500",
        "recovery": 0,
        "recoveryMeters": 100
      }
    ],
    "summarySteps": [
      {
        "reps": 2,
        "meters": 300,
        "pace": "1500"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "miX5",
    "name": "Race-pace endurance",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "An experienced-runner session. Keep your form intact for the whole two-lap rep.",
    "blocks": [
      {
        "reps": 3,
        "meters": 800,
        "pace": "1500",
        "recovery": 0,
        "recoveryRatio": 2
      }
    ],
    "summarySteps": [
      {
        "reps": 3,
        "meters": 800,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "miX6",
    "name": "Aerobic-power repeats",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Aerobic power",
    "focus": "Aerobic power",
    "cue": "Stay at current 3K rhythm; this is not a race-pace 1500 m session.",
    "blocks": [
      {
        "reps": 5,
        "meters": 600,
        "pace": "3k",
        "recovery": 0,
        "recoveryMeters": 300
      }
    ],
    "summarySteps": [
      {
        "reps": 5,
        "meters": 600,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "miX7",
    "name": "Two-lap aerobic power",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Aerobic power",
    "focus": "Aerobic power",
    "cue": "Make the final lap of every repetition as composed as the first.",
    "blocks": [
      {
        "reps": 4,
        "meters": 800,
        "pace": "3k",
        "recovery": 0,
        "recoveryMeters": 400
      }
    ],
    "summarySteps": [
      {
        "reps": 4,
        "meters": 800,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "miX8",
    "name": "Long-to-short race rhythm",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "The long repetitions set the load. Keep the shorter work controlled.",
    "blocks": [
      {
        "reps": 2,
        "meters": 800,
        "pace": "1500",
        "recovery": 240,
        "after": 240
      },
      {
        "reps": 2,
        "meters": 600,
        "pace": "1500",
        "recovery": 150,
        "after": 150
      },
      {
        "reps": 2,
        "meters": 400,
        "pace": "1500",
        "recovery": 150
      }
    ],
    "summarySteps": [
      {
        "reps": 2,
        "meters": 800,
        "pace": "1500"
      },
      {
        "reps": 2,
        "meters": 600,
        "pace": "1500"
      },
      {
        "reps": 2,
        "meters": 400,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "miX9",
    "name": "Short-rest speed clusters",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Keep the short recoveries easy; hold current pace without pressing faster.",
    "blocks": [
      {
        "reps": 8,
        "meters": 200,
        "pace": "1500",
        "recovery": 30,
        "after": 180
      },
      {
        "reps": 8,
        "meters": 200,
        "pace": "1500",
        "recovery": 30,
        "after": 180
      },
      {
        "reps": 8,
        "meters": 200,
        "pace": "1500",
        "recovery": 30
      }
    ],
    "summarySteps": [
      {
        "reps": 8,
        "meters": 200,
        "pace": "1500"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "miX10",
    "name": "Broken laps",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "The two short reps prepare the full lap; keep all three at the same pace.",
    "blocks": [
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 2,
        "meters": 200,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500"
      }
    ],
    "summarySets": 4
  },
  {
    "id": "miX11",
    "name": "Race-speed cutdown",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Sharpening",
    "focus": "Sharpening",
    "cue": "Run crisp, controlled race rhythm throughout. Take the full descending recoveries.",
    "blocks": [
      {
        "reps": 1,
        "meters": 500,
        "pace": "1500",
        "recovery": 0,
        "after": 240
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 300,
        "pace": "1500",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "meters": 500,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 300,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "miX12",
    "name": "Race-rhythm gear changes",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Mixed pace",
    "focus": "Mixed pace",
    "cue": "Change gears smoothly after the first lap, then use all five minutes to recover.",
    "blocks": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "3k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 300
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "3k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 300
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "3k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0,
        "after": 300
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "3k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500"
      }
    ],
    "summarySets": 4
  },
  {
    "id": "miX13",
    "name": "Threshold into turnover",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Stamina",
    "focus": "Stamina",
    "cue": "Keep the threshold blocks controlled and the final fast repetitions relaxed.",
    "blocks": [
      {
        "reps": 2,
        "seconds": 480,
        "pace": "threshold",
        "recovery": 90,
        "after": 180
      },
      {
        "reps": 4,
        "meters": 200,
        "pace": "1500",
        "recovery": 120
      }
    ],
    "summarySteps": [
      {
        "reps": 2,
        "seconds": 480,
        "pace": "5k"
      },
      {
        "reps": 4,
        "meters": 200,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "miX14",
    "name": "Race-week rhythm touch",
    "category": "specific",
    "goals": [
      "mile"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "1500",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Light",
    "purpose": "Sharpening",
    "focus": "Sharpening",
    "cue": "Finish feeling sharp. Reproduce pace without searching for fatigue.",
    "blocks": [
      {
        "reps": 3,
        "meters": 300,
        "pace": "1500",
        "recovery": 180,
        "after": 180
      },
      {
        "reps": 3,
        "meters": 150,
        "pace": "1500",
        "recovery": 120
      }
    ],
    "summarySteps": [
      {
        "reps": 3,
        "meters": 300,
        "pace": "1500"
      },
      {
        "reps": 3,
        "meters": 150,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "fiveX1",
    "name": "The race-rhythm bridge",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Stay patient through the early repetitions and repeat your current 5K rhythm.",
    "blocks": [
      {
        "reps": 8,
        "meters": 600,
        "pace": "5k",
        "recovery": 0,
        "recoveryMeters": 300
      }
    ],
    "summarySteps": [
      {
        "reps": 8,
        "meters": 600,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "fiveX2",
    "name": "One-minute clusters",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Use the longer set recoveries to reset; every minute should feel repeatable.",
    "blocks": [
      {
        "reps": 4,
        "seconds": 60,
        "pace": "5k",
        "recovery": 60,
        "after": 180
      },
      {
        "reps": 4,
        "seconds": 60,
        "pace": "5k",
        "recovery": 60,
        "after": 180
      },
      {
        "reps": 4,
        "seconds": 60,
        "pace": "5k",
        "recovery": 60
      }
    ],
    "summarySteps": [
      {
        "reps": 4,
        "seconds": 60,
        "pace": "5k"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "fiveX3",
    "name": "Ninety-second clusters",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Run even repetitions rather than chasing extra distance on the last one.",
    "blocks": [
      {
        "reps": 5,
        "seconds": 90,
        "pace": "5k",
        "recovery": 90,
        "after": 180
      },
      {
        "reps": 5,
        "seconds": 90,
        "pace": "5k",
        "recovery": 90
      }
    ],
    "summarySteps": [
      {
        "reps": 5,
        "seconds": 90,
        "pace": "5k"
      }
    ],
    "summarySets": 2
  },
  {
    "id": "fiveX4",
    "name": "Two-minute clusters",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Two clear sets of controlled 5K work; recover fully before set two.",
    "blocks": [
      {
        "reps": 4,
        "seconds": 120,
        "pace": "5k",
        "recovery": 120,
        "after": 240
      },
      {
        "reps": 4,
        "seconds": 120,
        "pace": "5k",
        "recovery": 120
      }
    ],
    "summarySteps": [
      {
        "reps": 4,
        "seconds": 120,
        "pace": "5k"
      }
    ],
    "summarySets": 2
  },
  {
    "id": "fiveX5",
    "name": "Race-pace descending sets",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "Hold one pace as the reps shorten; the short rests are part of the session.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1000,
        "pace": "5k",
        "recovery": 0,
        "after": 75
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 60
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 240
      },
      {
        "reps": 1,
        "meters": 1000,
        "pace": "5k",
        "recovery": 0,
        "after": 75
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 60
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "meters": 1000,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500"
      }
    ],
    "summarySets": 2
  },
  {
    "id": "fiveX6",
    "name": "Kick-finish repeats",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Mixed pace",
    "focus": "Mixed pace",
    "cue": "Move smoothly into the last short segment, then take the full reset.",
    "blocks": [
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "3k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "3k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "3k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "3k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "3k",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "meters": 800,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500"
      }
    ],
    "summarySets": 5
  },
  {
    "id": "fiveX7",
    "name": "Long race-rhythm repeats",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Race rhythm",
    "focus": "Race rhythm",
    "cue": "A demanding race-specific rehearsal for runners already comfortable with kilometre reps.",
    "blocks": [
      {
        "reps": 3,
        "meters": 1600,
        "pace": "5k",
        "recovery": 0,
        "recoveryMeters": 400
      }
    ],
    "summarySteps": [
      {
        "reps": 3,
        "meters": 1600,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "fiveX8",
    "name": "Race-pace lap changes",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Mixed pace",
    "focus": "Mixed pace",
    "cue": "Change pace smoothly by the specified small amount; the slower lap is not an easy jog.",
    "blocks": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": -5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": 5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": -5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 180,
        "paceOffset": 5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": -5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": 5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": -5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 180,
        "paceOffset": 5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": -5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": 5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "paceOffset": -5
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "paceOffset": 5
      }
    ],
    "summarySteps": [
      {
        "reps": 3,
        "meters": 1600,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "fiveX9",
    "name": "The timed pace ladder",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Mixed pace",
    "focus": "Mixed pace",
    "cue": "Let the pace follow the length of each effort and stay controlled up and down.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 60,
        "pace": "3k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 120,
        "pace": "5k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 180,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 240,
        "pace": "half",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "half",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 240,
        "pace": "half",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 180,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 120,
        "pace": "5k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 60,
        "pace": "3k",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "seconds": 60,
        "pace": "5k"
      },
      {
        "reps": 1,
        "seconds": 120,
        "pace": "5k"
      },
      {
        "reps": 1,
        "seconds": 180,
        "pace": "5k"
      },
      {
        "reps": 1,
        "seconds": 240,
        "pace": "5k"
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "5k"
      },
      {
        "reps": 1,
        "seconds": 240,
        "pace": "5k"
      },
      {
        "reps": 1,
        "seconds": 180,
        "pace": "5k"
      },
      {
        "reps": 1,
        "seconds": 120,
        "pace": "5k"
      },
      {
        "reps": 1,
        "seconds": 60,
        "pace": "5k"
      }
    ]
  },
  {
    "id": "fiveX10",
    "name": "Race-week quick repeats",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Light",
    "purpose": "Sharpening",
    "focus": "Sharpening",
    "cue": "Keep the faster running light, with a full easy recovery every time.",
    "blocks": [
      {
        "reps": 2,
        "meters": 200,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "recoveryMeters": 400,
        "afterMeters": 400,
        "paceOffset": -5
      },
      {
        "reps": 2,
        "meters": 200,
        "pace": "5k",
        "recovery": 0,
        "after": 0,
        "recoveryMeters": 400,
        "afterMeters": 400,
        "paceOffset": -15
      },
      {
        "reps": 2,
        "meters": 200,
        "pace": "5k",
        "recovery": 0,
        "recoveryMeters": 400,
        "paceOffset": -20
      }
    ],
    "summarySteps": [
      {
        "reps": 2,
        "meters": 200,
        "pace": "1500"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "fiveX11",
    "name": "Tempo into race rhythm",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Stamina",
    "focus": "Stamina",
    "cue": "Leave reserve in the tempo so the final race-pace block stays composed.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 1200,
        "pace": "threshold",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 2000,
        "pace": "5k",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "seconds": 1200,
        "pace": "5k"
      },
      {
        "reps": 1,
        "meters": 2000,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "fiveX12",
    "name": "Fast laps and steady running",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Demanding",
    "purpose": "Mixed pace",
    "focus": "Mixed pace",
    "cue": "The middle section is steady running; reset before the second set of laps.",
    "blocks": [
      {
        "reps": 4,
        "meters": 400,
        "pace": "5k",
        "recovery": 90,
        "after": 180
      },
      {
        "reps": 1,
        "seconds": 600,
        "pace": "marathon",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 4,
        "meters": 400,
        "pace": "5k",
        "recovery": 90
      }
    ],
    "summarySteps": [
      {
        "reps": 4,
        "meters": 400,
        "pace": "1500"
      },
      {
        "reps": 1,
        "seconds": 600,
        "pace": "5k"
      },
      {
        "reps": 4,
        "meters": 400,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "fiveX13",
    "name": "The race-pace cutdown",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Standard",
    "purpose": "Mixed pace",
    "focus": "Mixed pace",
    "cue": "Settle into the longer blocks, then let the shorter reps become quicker without sprinting.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "10k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "repetition",
        "recovery": 0
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "meters": 1600,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "1500"
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "1500"
      }
    ]
  },
  {
    "id": "fiveX14",
    "name": "Race-week one-minute primer",
    "category": "specific",
    "goals": [
      "5k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "5k",
    "recovery": 0,
    "recoveryType": "walk / jog",
    "level": "Light",
    "purpose": "Sharpening",
    "focus": "Sharpening",
    "cue": "Low volume, full control. Finish with more energy than you started.",
    "blocks": [
      {
        "reps": 3,
        "seconds": 60,
        "pace": "5k",
        "recovery": 60,
        "after": 180
      },
      {
        "reps": 3,
        "seconds": 60,
        "pace": "5k",
        "recovery": 60
      }
    ],
    "summarySteps": [
      {
        "reps": 3,
        "seconds": 60,
        "pace": "5k"
      }
    ],
    "summarySets": 2
  },
  {
    "id": "tenX01",
    "name": "Long opening, controlled repeats",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Race rhythm",
    "purpose": "Hold race rhythm after an extended opening effort.",
    "cue": "The shorter repetitions stay at the same pace; they are not a finishing sprint.",
    "blocks": [
      {
        "reps": 1,
        "meters": 3000,
        "pace": "10k",
        "recovery": 0,
        "after": 300
      },
      {
        "reps": 4,
        "meters": 1500,
        "pace": "10k",
        "recovery": 180
      }
    ],
    "note": "9 km at 10K pace. Reserve for experienced runners who have already built comparable quality volume; choose a timed session when this becomes too long."
  },
  {
    "id": "tenX02",
    "name": "Race-pace cutdown",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Practise precise race rhythm, then change gears as the repetitions shorten.",
    "cue": "Keep the final 200 quick and smooth, with relaxed shoulders.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0,
        "after": 150
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "10k",
        "recovery": 0,
        "after": 150
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 150
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 150
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "repetition",
        "recovery": 0
      }
    ]
  },
  {
    "id": "tenX03",
    "name": "Long-short race pairs",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Alternate sustained 10K rhythm with a shorter, faster effort.",
    "cue": "Run the first pair conservatively so the last 800 stays controlled.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k",
        "recovery": 0
      }
    ],
    "note": "7.2 km of quality at two race paces; a later-block workout for runners already comfortable with mixed sessions.",
    "summarySteps": [
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k"
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "5k"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "tenX04",
    "name": "Race-pace bookends",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Return to 10K rhythm after a controlled faster section.",
    "cue": "The last long repetition matches the first; resist chasing the short reps.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0,
        "afterMeters": 800
      },
      {
        "reps": 4,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "recoveryMeters": 200,
        "afterMeters": 200
      },
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0
      }
    ]
  },
  {
    "id": "tenX05",
    "name": "Three-minute changes",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Practise moving from race rhythm to quicker running across repeated sets.",
    "cue": "Take the full set recovery and start each three-minute effort evenly.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 180,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 3,
        "seconds": 60,
        "pace": "5k",
        "recovery": 60,
        "after": 180
      },
      {
        "reps": 1,
        "seconds": 180,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 3,
        "seconds": 60,
        "pace": "5k",
        "recovery": 60,
        "after": 180
      },
      {
        "reps": 1,
        "seconds": 180,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 3,
        "seconds": 60,
        "pace": "5k",
        "recovery": 60
      }
    ],
    "summarySteps": [
      {
        "reps": 1,
        "seconds": 180,
        "pace": "10k"
      },
      {
        "reps": 3,
        "seconds": 60,
        "pace": "5k"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "tenX06",
    "name": "Race rhythm with steady floats",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Keep running steadily while repeatedly returning to race pace.",
    "cue": "The slower section is purposeful steady running, not another fast rep.",
    "blocks": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 600,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 600,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 600,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 600,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 600,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 600,
        "pace": "marathon",
        "recovery": 0
      }
    ],
    "note": "6 km continuous quality including the floats. Use after a base of regular workouts; stop if either pace becomes forced.",
    "summarySteps": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k"
      },
      {
        "reps": 1,
        "meters": 600,
        "pace": "marathon"
      }
    ],
    "summarySets": 6
  },
  {
    "id": "tenX07",
    "name": "Short surge, long float",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Make a small move and settle into sustained running without stopping.",
    "cue": "Keep the surge at controlled 5K rhythm; recover by easing the pace, not by stopping.",
    "blocks": [
      {
        "reps": 1,
        "meters": 200,
        "pace": "5k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "5k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "5k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "5k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "5k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "marathon",
        "recovery": 0
      }
    ],
    "note": "5 km continuous work. The faster segments are brief; the 800m floats still add aerobic load.",
    "summarySteps": [
      {
        "reps": 1,
        "meters": 200,
        "pace": "5k"
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "marathon"
      }
    ],
    "summarySets": 5
  },
  {
    "id": "tenX08",
    "name": "Tempo into quick laps",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Stamina",
    "purpose": "Find a quicker rhythm after sustained aerobic work.",
    "cue": "Keep the tempo controlled so the 400s remain smooth.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 1200,
        "pace": "threshold",
        "recovery": 0,
        "after": 300
      },
      {
        "reps": 4,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "recoveryMeters": 200
      }
    ]
  },
  {
    "id": "tenX09",
    "name": "Every fifth rep changes gear",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Hold a consistent rhythm around occasional faster repetitions.",
    "cue": "The first four repetitions are measured, and the fifth is quicker without becoming all-out.",
    "blocks": [
      {
        "reps": 4,
        "meters": 400,
        "pace": "10k",
        "recovery": 60,
        "after": 60
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "afterMeters": 400
      },
      {
        "reps": 4,
        "meters": 400,
        "pace": "10k",
        "recovery": 60,
        "after": 60
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "afterMeters": 400
      },
      {
        "reps": 4,
        "meters": 400,
        "pace": "10k",
        "recovery": 60,
        "after": 60
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0
      }
    ],
    "note": "6 km of quality with substantial recovery. Start with less volume if this exceeds your normal workout load.",
    "summarySteps": [
      {
        "reps": 4,
        "meters": 400,
        "pace": "10k"
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "tenX10",
    "name": "Fast start, steady settle",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Settle into controlled sustained running after a faster opening.",
    "cue": "Slow deliberately at the transition; the second section is not a second race.",
    "blocks": [
      {
        "reps": 1,
        "meters": 2000,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 4000,
        "pace": "marathon",
        "recovery": 0
      }
    ],
    "note": "6 km continuous work. This is pace-control practice, not evidence that starting a race too fast is a good strategy."
  },
  {
    "id": "tenX11",
    "name": "Speed, rhythm, settle",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Light",
    "focus": "Mixed pace",
    "purpose": "Rehearse several controlled speeds with more time to settle as the pace slows.",
    "cue": "Stay relaxed on the first minute; the main target is smooth pacing across all three efforts.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 60,
        "pace": "repetition",
        "recovery": 0,
        "after": 30
      },
      {
        "reps": 1,
        "seconds": 180,
        "pace": "5k",
        "recovery": 0,
        "after": 90
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "10k",
        "recovery": 0,
        "after": 150
      },
      {
        "reps": 1,
        "seconds": 420,
        "pace": "easy",
        "recovery": 0
      }
    ],
    "note": "9 minutes of quality. A shorter option for runners introducing structured pace changes.",
    "cooldown": 0
  },
  {
    "id": "tenX12",
    "name": "Short-speed sandwich",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Stamina",
    "purpose": "Reconnect with race pace after a small dose of quicker running.",
    "cue": "The short reps stay controlled and technically sound; ease back into the final 800s.",
    "blocks": [
      {
        "reps": 2,
        "meters": 800,
        "pace": "10k",
        "recovery": 90,
        "after": 90
      },
      {
        "reps": 1,
        "meters": 300,
        "pace": "3k",
        "recovery": 0,
        "afterMeters": 200
      },
      {
        "reps": 1,
        "meters": 200,
        "pace": "repetition",
        "recovery": 0,
        "afterMeters": 100
      },
      {
        "reps": 1,
        "meters": 100,
        "pace": "repetition",
        "recovery": 0,
        "after": 240
      },
      {
        "reps": 2,
        "meters": 800,
        "pace": "10k",
        "recovery": 90
      }
    ],
    "note": "For runners already accustomed to faster strides and track work. Use the controlled pace, not a maximum-speed effort."
  },
  {
    "id": "tenX13",
    "name": "Broken race repetitions",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "walk",
    "level": "Standard",
    "focus": "Race rhythm",
    "purpose": "Link a substantial race-pace segment with a shorter, quicker finish.",
    "cue": "Walk the recovery and restart smoothly rather than rushing the first strides.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1200,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 60
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "after": 60
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k",
        "recovery": 0
      }
    ],
    "note": "The recovery is walking here. Keep that distinction if the app\u2019s generic recovery label normally says jog.",
    "summarySteps": [
      {
        "reps": 1,
        "meters": 1200,
        "pace": "10k"
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "5k"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "tenX14",
    "name": "Late-race progression",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Long run",
    "purpose": "Practise lifting the effort after an easy aerobic lead-in.",
    "cue": "Keep the first forty minutes genuinely easy; finish at current fitness, not a hoped-for race time.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 2400,
        "pace": "easy",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "easy",
        "recovery": 0
      }
    ],
    "note": "55 minutes total, with ten quality minutes. Embedded easy running includes preparation and cooldown.",
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "tenX15",
    "name": "Fast, steady, finish",
    "category": "specific",
    "goals": [
      "10k"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "10k",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Stay composed through a long middle section after a brisk start, then finish with relaxed speed.",
    "cue": "The middle section builds gradually; leave enough control for two tidy closing repetitions.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1500,
        "pace": "10k",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 1,
        "seconds": 900,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 600,
        "pace": "half",
        "recovery": 0,
        "after": 180
      },
      {
        "reps": 2,
        "meters": 300,
        "pace": "3k",
        "recovery": 180
      }
    ],
    "note": "A substantial mixed session for established runners; do not use it as a maximum-effort fitness test."
  },
  {
    "id": "halfX01",
    "name": "Three ten-minute race blocks",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Race rhythm",
    "purpose": "Accumulate a measured half hour at race effort without a long continuous push.",
    "cue": "Keep the same breathing and rhythm through all three blocks.",
    "blocks": [
      {
        "reps": 3,
        "seconds": 600,
        "pace": "half",
        "recovery": 120
      }
    ],
    "note": "Race pace means current equivalent fitness. For very fast runners, HM effort can exceed one-hour threshold effort.",
    "summarySteps": [
      {
        "reps": 3,
        "seconds": 600,
        "pace": "half"
      }
    ]
  },
  {
    "id": "halfX02",
    "name": "Long repetitions with easy floats",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Race rhythm",
    "purpose": "Build sustained concentration over long race-pace repetitions.",
    "cue": "Jog the whole recovery easily; it is not an extra tempo segment.",
    "blocks": [
      {
        "reps": 3,
        "meters": 3000,
        "pace": "half",
        "recovery": 0,
        "recoveryMeters": 800
      }
    ],
    "note": "9 km at race pace plus 1.6 km of recovery. Use only after handling comparable long quality sessions; duration can be excessive for slower runners.",
    "summarySteps": [
      {
        "reps": 3,
        "meters": 3000,
        "pace": "half"
      }
    ]
  },
  {
    "id": "halfX03",
    "name": "Aerobic strength repeats",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Aerobic power",
    "purpose": "Maintain quicker aerobic running while training for a longer race.",
    "cue": "Stay at 10K pace from the first rep; this is not a VO2max test.",
    "blocks": [
      {
        "reps": 8,
        "meters": 800,
        "pace": "10k",
        "recovery": 90
      }
    ],
    "note": "6.4 km faster than HM pace. Experienced runners only; do not add it beside another substantial race-pace session without accounting for the combined load.",
    "summarySteps": [
      {
        "reps": 8,
        "meters": 800,
        "pace": "10k"
      }
    ]
  },
  {
    "id": "halfX04",
    "name": "Descending gears",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Practise increasing effort while the duration of each repetition decreases.",
    "cue": "Run the last two minutes fast but controlled, with enough form to finish cleanly.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 600,
        "pace": "half",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 480,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 360,
        "pace": "10k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 240,
        "pace": "5k",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "seconds": 120,
        "pace": "3k",
        "recovery": 0
      }
    ],
    "note": "30 quality minutes, much of it faster than race pace. A supporting mixed session; avoid within a week of a key race."
  },
  {
    "id": "halfX05",
    "name": "10K bookends, half-marathon middle",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Stamina",
    "purpose": "Settle into half-marathon rhythm between two quicker efforts.",
    "cue": "Match the bookends without forcing the middle section faster.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0,
        "afterMeters": 400
      },
      {
        "reps": 1,
        "meters": 4800,
        "pace": "half",
        "recovery": 0,
        "afterMeters": 800
      },
      {
        "reps": 1,
        "meters": 1600,
        "pace": "10k",
        "recovery": 0
      }
    ],
    "note": "8 km of quality. The middle portion is HM race rhythm, not automatically physiological threshold."
  },
  {
    "id": "halfX06",
    "name": "Race rhythm, then one gear quicker",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Keep enough control during sustained race rhythm to lift the pace late.",
    "cue": "The last kilometre is at current 10K pace; it is not a time trial.",
    "blocks": [
      {
        "reps": 1,
        "meters": 6000,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 1000,
        "pace": "10k",
        "recovery": 0
      }
    ],
    "note": "7 km continuously at race pace or faster. Use after building to sustained HM blocks; consider total work time before choosing it."
  },
  {
    "id": "halfX07",
    "name": "Progressive race repeats",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Build effort gradually across short-rest kilometres.",
    "cue": "Start patiently; the quicker final reps should still feel measured.",
    "blocks": [
      {
        "reps": 3,
        "meters": 1000,
        "pace": "half",
        "recovery": 45,
        "after": 45
      },
      {
        "reps": 3,
        "meters": 1000,
        "pace": "half",
        "recovery": 45,
        "after": 45,
        "paceOffset": -2
      },
      {
        "reps": 2,
        "meters": 1000,
        "pace": "10k",
        "recovery": 45
      }
    ],
    "note": "8 km of quality with brief rest. The pace progression is not a universal threshold prescription; choose fewer work minutes if total duration is too large."
  },
  {
    "id": "halfX08",
    "name": "Long run with race-pace surges",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Long run",
    "purpose": "Introduce brief race-effort segments inside a familiar long run.",
    "cue": "Return all the way to easy effort between the surges.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 1200,
        "pace": "easy",
        "recovery": 0
      },
      {
        "reps": 7,
        "seconds": 120,
        "pace": "half",
        "recovery": 360
      },
      {
        "reps": 1,
        "seconds": 1200,
        "pace": "easy",
        "recovery": 0
      }
    ],
    "note": "90 minutes total including all easy sections. Appropriate only when that overall long-run duration is already familiar.",
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "halfX09",
    "name": "Two race-pace islands",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Long run",
    "purpose": "Practise sustained race rhythm twice while managing growing fatigue.",
    "cue": "Eat and drink as planned for race day, and keep the easy middle section easy.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 1800,
        "pace": "easy",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 1200,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 600,
        "pace": "easy",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 1200,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 600,
        "pace": "easy",
        "recovery": 0
      }
    ],
    "note": "90 minutes total with 40 at HM pace. For established long-run and race-pace tolerance; do not add another full warmup or cooldown.",
    "warmup": 0,
    "cooldown": 0
  },
  {
    "id": "halfX10",
    "name": "Short race segments, long steady floats",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Practise moving between race rhythm and a deliberately slower sustained float.",
    "cue": "The longer float stays 25 seconds per kilometre slower than race pace.",
    "blocks": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "half",
        "recovery": 0,
        "paceOffset": 25
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "half",
        "recovery": 0,
        "paceOffset": 25
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "half",
        "recovery": 0,
        "paceOffset": 25
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "half",
        "recovery": 0,
        "paceOffset": 25
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "half",
        "recovery": 0,
        "paceOffset": 25
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "half",
        "recovery": 0,
        "paceOffset": 25
      }
    ],
    "note": "9.6 km continuous work. The floats are not easy recovery and remain part of the quality load.",
    "summarySteps": [
      {
        "reps": 1,
        "meters": 400,
        "pace": "half"
      },
      {
        "reps": 1,
        "meters": 1200,
        "pace": "half"
      }
    ],
    "summarySets": 6
  },
  {
    "id": "halfX11",
    "name": "Race rhythm around faster reps",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Recover a controlled half-marathon rhythm after a short faster section.",
    "cue": "The final race-pace block should settle, even if your breathing is initially quicker.",
    "blocks": [
      {
        "reps": 1,
        "meters": 1600,
        "pace": "half",
        "recovery": 0,
        "afterMeters": 400
      },
      {
        "reps": 2,
        "meters": 800,
        "pace": "10k",
        "recovery": 0,
        "recoveryMeters": 200,
        "afterMeters": 200
      },
      {
        "reps": 2,
        "meters": 400,
        "pace": "5k",
        "recovery": 0,
        "recoveryMeters": 200,
        "afterMeters": 200
      },
      {
        "reps": 1,
        "meters": 1600,
        "pace": "half",
        "recovery": 0
      }
    ],
    "note": "5.6 km of quality at three paces. The final transition uses 200m easy; do not silently substitute an unrelated timed rest."
  },
  {
    "id": "halfX12",
    "name": "Quicker start, race-pace settle",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Settle into race rhythm while carrying fatigue from a quicker opening.",
    "cue": "Slow at the transition and hold steady rather than racing the final section.",
    "blocks": [
      {
        "reps": 1,
        "meters": 2000,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 4000,
        "pace": "half",
        "recovery": 0
      }
    ],
    "note": "6 km continuous work. Reserved for established runners; the race-pace portion is still a quality effort."
  },
  {
    "id": "halfX13",
    "name": "Two progressive waves",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Stamina",
    "purpose": "Manage sustained steady running before two progressively stronger finishes.",
    "cue": "Start the second wave at marathon rhythm again; the final five minutes stay controlled.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 900,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "half",
        "recovery": 0,
        "after": 240
      },
      {
        "reps": 1,
        "seconds": 900,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "10k",
        "recovery": 0
      }
    ],
    "note": "45 quality minutes plus four easy minutes. These explicit race-pace choices are an adaptation, not interchangeable definitions of threshold."
  },
  {
    "id": "halfX14",
    "name": "Surge and settle repeats",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Practise a brief move and then settle back to race rhythm before the repetition ends.",
    "cue": "Do not wait for the recovery to settle; find half-marathon rhythm again for the final 400.",
    "blocks": [
      {
        "reps": 1,
        "meters": 800,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0,
        "after": 120
      },
      {
        "reps": 1,
        "meters": 800,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k",
        "recovery": 0
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half",
        "recovery": 0
      }
    ],
    "note": "6.4 km of quality. Use after establishing both race-pace and quicker-repetition tolerance.",
    "summarySteps": [
      {
        "reps": 1,
        "meters": 800,
        "pace": "half"
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "10k"
      },
      {
        "reps": 1,
        "meters": 400,
        "pace": "half"
      }
    ],
    "summarySets": 4
  },
  {
    "id": "halfX15",
    "name": "Long steady, short race rhythm",
    "category": "specific",
    "goals": [
      "half"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "half",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Sustain purposeful running while practising small changes into half-marathon rhythm.",
    "cue": "Ease back to marathon pace after each faster section; stay in control throughout.",
    "blocks": [
      {
        "reps": 1,
        "seconds": 600,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 600,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "half",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 600,
        "pace": "marathon",
        "recovery": 0
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "half",
        "recovery": 0
      }
    ],
    "note": "45 continuous quality minutes, including the steadier portions. It is a workout, even though only fifteen minutes use HM pace.",
    "summarySteps": [
      {
        "reps": 1,
        "seconds": 600,
        "pace": "marathon"
      },
      {
        "reps": 1,
        "seconds": 300,
        "pace": "half"
      }
    ],
    "summarySets": 3
  },
  {
    "id": "xm01",
    "name": "Marathon strength repeats",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Stamina",
    "purpose": "Pace strength.",
    "cue": "Run about 6 sec/km faster than marathon pace; keep every repeat even.",
    "blocks": [
      {
        "reps": 6,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1600,
        "recoveryMeters": 400,
        "paceOffset": -6
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "summarySteps": [
      {
        "reps": 6,
        "pace": "marathon",
        "meters": 1600
      }
    ]
  },
  {
    "id": "xm02",
    "name": "Strength climb",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Stamina",
    "purpose": "Longer aerobic blocks.",
    "cue": "Hold the same controlled pace as each repetition grows.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 2000,
        "afterMeters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 3000,
        "afterMeters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 5000,
        "paceOffset": -6
      }
    ],
    "warmup": 900,
    "cooldown": 600
  },
  {
    "id": "xm03",
    "name": "Strength descent",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Stamina",
    "purpose": "Pacing under fatigue.",
    "cue": "Start patiently; shorter repetitions do not mean faster running.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 5000,
        "afterMeters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 3000,
        "afterMeters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 2000,
        "paceOffset": -6
      }
    ],
    "warmup": 900,
    "cooldown": 600
  },
  {
    "id": "xm04",
    "name": "Long\u2013short\u2013long strength",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Stamina",
    "purpose": "Changing repetition length.",
    "cue": "Keep the 800 m repetitions at the same pace as the long blocks.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 3000,
        "afterMeters": 800,
        "paceOffset": -6
      },
      {
        "reps": 4,
        "pace": "marathon",
        "recovery": 0,
        "meters": 800,
        "recoveryMeters": 400,
        "afterMeters": 400,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 3000,
        "paceOffset": -6
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "summarySteps": [
      {
        "reps": 1,
        "meters": 3000
      },
      {
        "reps": 4,
        "meters": 800
      },
      {
        "reps": 1,
        "meters": 3000
      }
    ]
  },
  {
    "id": "xm05",
    "name": "Broken marathon sets",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Race rhythm",
    "purpose": "Repeatable marathon rhythm.",
    "cue": "Jog for 60 sec within each set and 4 min between sets.",
    "blocks": [
      {
        "reps": 4,
        "pace": "marathon",
        "recovery": 60,
        "meters": 1000,
        "after": 240
      },
      {
        "reps": 4,
        "pace": "marathon",
        "recovery": 60,
        "meters": 1000,
        "after": 240
      },
      {
        "reps": 4,
        "pace": "marathon",
        "recovery": 60,
        "meters": 1000
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "summarySteps": [
      {
        "reps": 4,
        "meters": 1000,
        "pace": "marathon"
      }
    ],
    "summarySets": 3,
    "note": "12 km at marathon pace: build up from shorter marathon sessions first."
  },
  {
    "id": "xm06",
    "name": "Marathon ladder with floats",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Marathon rhythm through floats.",
    "cue": "Float 30 sec/km slower than marathon pace; stay smooth as blocks grow.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 2000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 30
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 3000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 30
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 4000
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "summarySteps": [
      {
        "reps": 1,
        "meters": 2000
      },
      {
        "reps": 1,
        "meters": 1000
      },
      {
        "reps": 1,
        "meters": 3000
      },
      {
        "reps": 1,
        "meters": 1000
      },
      {
        "reps": 1,
        "meters": 4000
      }
    ]
  },
  {
    "id": "xm07",
    "name": "Alternating tempo blocks",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Controlled pace changes.",
    "cue": "Alternate smoothly: marathon pace minus 6 sec/km, then 10K pace plus 6 sec/km.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "10k",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 6
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "summarySteps": [
      {
        "reps": 1,
        "meters": 1000,
        "pace": "marathon"
      },
      {
        "reps": 1,
        "meters": 1000,
        "pace": "10k"
      }
    ],
    "summarySets": 4,
    "note": "Advanced continuous session; slower kilometres are still quality work."
  },
  {
    "id": "xm08",
    "name": "Marathon over\u2013unders",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Settling after pace changes.",
    "cue": "Change pace gradually; the slower kilometre stays controlled and steady.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 20
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 20
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 20
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 20
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": -6
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 1000,
        "paceOffset": 20
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "summarySteps": [
      {
        "reps": 1,
        "meters": 1000,
        "pace": "marathon"
      },
      {
        "reps": 1,
        "meters": 1000,
        "pace": "marathon"
      }
    ],
    "summarySets": 5
  },
  {
    "id": "xm09",
    "name": "Marathon thirds",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Long run",
    "purpose": "Patient progression.",
    "cue": "Begin easy, settle 20 sec/km slower than marathon pace, then reach marathon pace.",
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 5000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 5000,
        "paceOffset": 20
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 5000
      }
    ],
    "warmup": 0,
    "cooldown": 300
  },
  {
    "id": "xm10",
    "name": "Four-stage marathon cutdown",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Mixed pace",
    "purpose": "Gradual pace control.",
    "cue": "Take 10 sec/km off each 2 km block; finish at marathon pace.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 2000,
        "paceOffset": 30
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 2000,
        "paceOffset": 20
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 2000,
        "paceOffset": 10
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 2000
      }
    ],
    "warmup": 900,
    "cooldown": 600
  },
  {
    "id": "xm11",
    "name": "Sustained marathon rehearsal",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Race rhythm",
    "purpose": "Sustained race rhythm.",
    "cue": "Settle early and practise your familiar race-day drinks and fuelling.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 16000
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "note": "A substantial rehearsal for established marathon training, not a fitness test.",
    "summarySteps": [
      {
        "reps": 1,
        "pace": "marathon",
        "meters": 16000
      }
    ]
  },
  {
    "id": "xm12",
    "name": "Two marathon windows",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Long run",
    "purpose": "Marathon pace late in a run.",
    "cue": "Keep both 4 km blocks even; let the middle easy section restore control.",
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 8000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 4000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 2000
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 4000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 2000
      }
    ],
    "warmup": 0,
    "cooldown": 0,
    "note": "Use only when 20 km easy long runs are already routine."
  },
  {
    "id": "xm13",
    "name": "Double race-pace rehearsal",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Long run",
    "purpose": "Long race-pace rehearsal.",
    "cue": "Run both 10 km blocks evenly; take the full 10 min easy recovery.",
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 3000
      },
      {
        "reps": 2,
        "pace": "marathon",
        "recovery": 600,
        "meters": 10000
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 2000
      }
    ],
    "warmup": 0,
    "cooldown": 0,
    "note": "25 km running plus recovery; reserved for experienced runners with sufficient weekly volume."
  },
  {
    "id": "xm14",
    "name": "Long run with controlled surges",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Long run",
    "purpose": "Rhythm changes during endurance.",
    "cue": "Keep surges at half-marathon effort and jog easily for 5 min between them.",
    "blocks": [
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 8000
      },
      {
        "reps": 7,
        "pace": "half",
        "recovery": 300,
        "seconds": 90
      },
      {
        "reps": 1,
        "pace": "easy",
        "recovery": 0,
        "meters": 2000
      }
    ],
    "warmup": 0,
    "cooldown": 0,
    "note": "A long session with quality; allow recovery as you would after a hard workout."
  },
  {
    "id": "xm15",
    "name": "Marathon rhythm with quick minutes",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Standard",
    "focus": "Sharpening",
    "purpose": "Relaxed speed after marathon pace.",
    "cue": "Complete the 5 km comfortably; keep the quick minutes relaxed, never sprinted.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "meters": 5000,
        "after": 180
      },
      {
        "reps": 4,
        "pace": "repetition",
        "recovery": 60,
        "seconds": 60
      }
    ],
    "warmup": 900,
    "cooldown": 600
  },
  {
    "id": "xm16",
    "name": "Marathon pace with threshold lifts",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Mixed pace",
    "purpose": "Returning to race rhythm.",
    "cue": "Lift to threshold for 5 min, then return directly to controlled marathon pace.",
    "blocks": [
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "seconds": 1800
      },
      {
        "reps": 1,
        "pace": "threshold",
        "recovery": 0,
        "seconds": 300
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "seconds": 1800
      },
      {
        "reps": 1,
        "pace": "threshold",
        "recovery": 0,
        "seconds": 300
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "seconds": 300
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "note": "100 min total, including 65 min at marathon pace and 10 min at threshold."
  },
  {
    "id": "xm17",
    "name": "Threshold\u2013marathon sandwich",
    "category": "specific",
    "goals": [
      "marathon"
    ],
    "reps": 1,
    "seconds": 1,
    "pace": "marathon",
    "recovery": 0,
    "recoveryType": "easy jog",
    "level": "Demanding",
    "focus": "Stamina",
    "purpose": "Marathon rhythm between firm efforts.",
    "cue": "Keep both threshold blocks controlled; settle fully into marathon pace between them.",
    "blocks": [
      {
        "reps": 1,
        "pace": "threshold",
        "recovery": 0,
        "seconds": 480
      },
      {
        "reps": 1,
        "pace": "marathon",
        "recovery": 0,
        "seconds": 1800
      },
      {
        "reps": 1,
        "pace": "threshold",
        "recovery": 0,
        "seconds": 480
      }
    ],
    "warmup": 900,
    "cooldown": 600,
    "note": "16 min threshold plus 30 min marathon pace; finish with clear control."
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
export const PACE_LABELS:Record<PaceKey,string>={easy:'Easy',subShort:'Short sub-threshold',subMedium:'Sub-threshold',subLong:'Long sub-threshold',threshold:'Threshold',interval:'Aerobic power',repetition:'Fast rhythm','5k':'5K pace','10k':'10K pace',half:'Half-marathon pace',marathon:'Marathon pace','1500':'1500 m pace','3k':'3K pace'};
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
export type Unit='km'|'mi';
export function distanceLabel(meters:number,unit:Unit='km'):string {
 const value=meters/(unit==='km'?1000:1609.344);
 return `${Number(value.toFixed(unit==='km'?2:3)).toLocaleString('en-GB',{maximumFractionDigits:unit==='km'?2:3})} ${unit}`;
}
export function stepLabel(b:{reps:number;meters?:number;seconds?:number},unit:Unit='km'):string {
 const amount=b.meters!==undefined?distanceLabel(b.meters,unit):b.seconds!<60?`${b.seconds} sec`:`${Number((b.seconds!/60).toFixed(2))} min`;
 return `${b.reps>1?`${b.reps} × `:''}${amount}`;
}
export function prescription(w:Workout,unit:Unit='km'):string {
 if(w.summarySteps){const steps=w.summarySteps.map(b=>stepLabel(b,unit)+(b.pace==='easy'?' easy':'')).join(' + ');return w.summarySets?`${w.summarySets} × (${steps})`:steps;}
 if(w.blocks)return w.blocks.map(b=>stepLabel(b,unit)+(b.pace==='easy'?' easy':'')).join(' + ');
 return stepLabel(w,unit);
}
export function recoveryLabel(w:Workout,unit:Unit='km'):string {
 if(w.blocks){const rests=workoutBlocks(w).flatMap((b,i)=>[...(b.reps>1?[b.recoveryMeters?`${distanceLabel(b.recoveryMeters,unit)} jog`:b.recoveryRatio?`${b.recoveryRatio===1?'Equal':'2 ×'} rep time`:b.recovery?`${formatTime(b.recovery)} recovery`:'']:[]),...(i<w.blocks!.length-1?[b.afterMeters?`${distanceLabel(b.afterMeters,unit)} jog`:b.after?`${formatTime(b.after)} reset`:'']:[])]).filter(Boolean);const unique=[...new Set(rests)];return unique.length===0?'Continuous':unique.length===1?unique[0]:'Varied recovery';}
 return w.recoveryMeters?`${distanceLabel(w.recoveryMeters,unit)} jog`:w.recoveryRatio?`${w.recoveryRatio===1?'Equal':'2 ×'} rep time`:w.recovery?`${formatTime(w.recovery)} ${w.recoveryType==='walk / easy jog'?'walk/easy jog':w.recoveryType==='walk / jog'?'walk/jog':w.recoveryType==='walk'?'walk':'jog'}`:'Continuous';
}

export function localizeCue(text:string,unit:Unit):string {
 return text.replace(/(-?\d+(?:\.\d+)?)\s*sec\/km\b/g,(_,n)=>`${Number((Number(n)*(unit==='mi'?1.609344:1)).toFixed(1))} sec/${unit}`).replace(/(\d+(?:\.\d+)?)\s*(km|miles?|mi|m)\b/g,(_,n,u)=>distanceLabel(Number(n)*(u==='km'?1000:u==='m'?1:1609.344),unit));
}

// Editorial workload comparison within the menu, not a physiological safety test.
// A fixed-distance dose can be much longer for a runner with a slower race result.
export function workoutLoad(workout:Workout,metrics:{qualitySeconds:number;longestRepSeconds:number}):Workout['level']{
 if(workout.category==='sub'&&(metrics.qualitySeconds>45*60||metrics.longestRepSeconds>15*60))return 'Demanding';
 return workout.level;
}
