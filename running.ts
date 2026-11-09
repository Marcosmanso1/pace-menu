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
export type PaceKey='easy'|'subShort'|'subMedium'|'subLong'|'threshold'|'interval'|'repetition'|'5k'|'10k'|'half'|'marathon';
export type WorkBlock={reps:number;meters?:number;seconds?:number;pace:PaceKey;recovery:number;after?:number};
export type Workout={blocks?:WorkBlock[];prescription?:string;recoverySummary?:string;warmup?:number;cooldown?:number;id:string;name:string;category:Category;goals:string[];reps:number;meters?:number;seconds?:number;pace:PaceKey;recovery:number;recoveryType:string;level:'Light'|'Standard'|'Demanding';purpose:string;cue:string;note?:string};
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
{id:'s1',name:'Short & controlled',category:'sub',goals:["mile", "5k", "10k"],reps:10,seconds:180,pace:'subShort',recovery:60,recoveryType:'easy jog',level:'Standard',purpose:'Accumulate aerobic work in short, repeatable blocks.',cue:'Keep the first rep as relaxed as the last. Finish with something left.'},
{id:'s2',name:'The five-minute rhythm',category:'sub',goals:["10k", "half"],reps:6,seconds:300,pace:'subMedium',recovery:60,recoveryType:'easy jog',level:'Standard',purpose:'Build sustained aerobic strength without chasing threshold.',cue:'Settle into a steady rhythm. Breathing should stay controlled.'},
{id:'s3',name:'Long aerobic blocks',category:'sub',goals:["half", "marathon"],reps:4,seconds:480,pace:'subLong',recovery:90,recoveryType:'easy jog',level:'Standard',purpose:'Extend time at a controlled intensity with longer repetitions.',cue:'Use the slower end of the range first. Avoid a hard finish.'},
{id:'s4',name:'The ten-minute repeat',category:'sub',goals:["marathon"],reps:3,seconds:600,pace:'subLong',recovery:90,recoveryType:'easy jog',level:'Standard',purpose:'Practise patient pacing through longer aerobic intervals.',cue:'This should feel sustainable, with at least one more rep in reserve.'},
{id:'s5',name:'Measured kilometres',category:'sub',goals:["5k", "10k"],reps:6,meters:1000,pace:'subMedium',recovery:60,recoveryType:'easy jog',level:'Standard',purpose:'Make controlled aerobic work easy to pace on a measured route.',cue:'Stay below threshold effort. Choose a timed option if these reps feel too long.',note:'A fixed-distance option: slower runners may prefer 6 × 5 min to limit work duration.'},
{id:'s6',name:'An introduction to control',category:'sub',goals:["mile", "5k", "half", "marathon"],reps:6,seconds:180,pace:'subShort',recovery:60,recoveryType:'easy jog',level:'Light',purpose:'Explore sub-threshold effort with a smaller amount of work.',cue:'Finish comfortable. The aim is control, not exhaustion.'},
{id:'t1',name:'Classic cruise intervals',category:'threshold',goals:["mile", "5k"],reps:4,seconds:300,pace:'threshold',recovery:60,recoveryType:'easy jog',level:'Standard',purpose:'Develop the ability to sustain a comfortably hard effort.',cue:'Firm and even. Resist speeding up when a short recovery makes the first reps feel easy.'},
{id:'t2',name:'Three steady blocks',category:'threshold',goals:["5k", "10k", "half"],reps:3,seconds:360,pace:'threshold',recovery:60,recoveryType:'easy jog',level:'Standard',purpose:'Build threshold endurance with brief resets between repetitions.',cue:'Aim for consistent effort across all three blocks.'},
{id:'t3',name:'The continuous tempo',category:'threshold',goals:["10k", "half", "marathon"],reps:1,seconds:1200,pace:'threshold',recovery:0,recoveryType:'continuous',level:'Standard',purpose:'Practise uninterrupted running around estimated one-hour race effort.',cue:'Comfortably hard, not a time trial. Ease off if the effort keeps climbing.'},
{id:'t4',name:'A little more threshold',category:'threshold',goals:["half", "marathon"],reps:5,seconds:300,pace:'threshold',recovery:60,recoveryType:'easy jog',level:'Demanding',purpose:'Extend threshold volume for runners already comfortable with shorter sessions.',cue:'Add volume only when 4 × 5 min feels well controlled.',note:'Higher-volume option. Work distance should fit your established weekly training.'},
{id:'v1',name:'The aerobic power classic',category:'vo2',goals:["mile", "5k"],reps:5,seconds:180,pace:'interval',recovery:120,recoveryType:'easy jog',level:'Standard',purpose:'Develop aerobic power with repeatable hard efforts.',cue:'Hard, smooth and repeatable. Avoid sprinting the start.'},
{id:'v2',name:'Two-minute repeats',category:'vo2',goals:["mile", "5k"],reps:6,seconds:120,pace:'interval',recovery:90,recoveryType:'easy jog',level:'Light',purpose:'Introduce aerobic-power work in manageable repetitions.',cue:'Stay at the target effort even if the early reps feel short.'},
{id:'v3',name:'Four-minute focus',category:'vo2',goals:["5k", "10k"],reps:4,seconds:240,pace:'interval',recovery:180,recoveryType:'easy jog',level:'Standard',purpose:'Spend longer in each aerobic-power repetition.',cue:'Run evenly. The last minute should feel hard without losing form.'},
{id:'v4',name:'Extended aerobic power',category:'vo2',goals:["10k"],reps:5,seconds:240,pace:'interval',recovery:180,recoveryType:'easy jog',level:'Demanding',purpose:'Increase hard running for athletes accustomed to interval sessions.',cue:'Use this only after shorter interval sessions are consistently repeatable.',note:'Higher-volume option. Keep interval work within roughly 8% of weekly distance.'},
{id:'r1',name:'Fast, relaxed 200s',category:'speed',goals:["mile", "5k", "10k"],reps:8,meters:200,pace:'repetition',recovery:120,recoveryType:'walk / jog',level:'Light',purpose:'Improve coordination and economy at a relaxed fast speed.',cue:'Stay tall and loose. Take more recovery if you are not ready to run smoothly.'},
{id:'r2',name:'A short speed touch',category:'speed',goals:["mile", "5k", "10k", "half", "marathon"],reps:6,seconds:20,pace:'repetition',recovery:80,recoveryType:'walk / jog',level:'Light',purpose:'Add a small dose of fast running with little total volume.',cue:'Build into the pace, hold relaxed form, then ease down. These are not sprints.'},
{id:'r3',name:'Thirty-second repetitions',category:'speed',goals:["mile", "5k"],reps:8,seconds:30,pace:'repetition',recovery:90,recoveryType:'walk / jog',level:'Light',purpose:'Practise efficient fast running with generous recovery.',cue:'Prioritise good mechanics over forcing an exact distance.'},
{id:'m1',name:'Mile-pace 200s',category:'specific',goals:['mile'],reps:10,meters:200,pace:'repetition',recovery:120,recoveryType:'walk / jog',level:'Standard',purpose:'Familiarise yourself with current mile rhythm.',cue:'Run at current equivalent mile pace. Stay relaxed through the line.'},
{id:'5a',name:'5K rhythm: 400s',category:'specific',goals:['5k'],reps:10,meters:400,pace:'5k',recovery:60,recoveryType:'easy jog',level:'Standard',purpose:'Learn to settle into current 5K race rhythm.',cue:'Even reps, without sprint finishes. Keep the recovery gentle.'},
{id:'5b',name:'5K strength: 800s',category:'specific',goals:['5k'],reps:5,meters:800,pace:'5k',recovery:120,recoveryType:'easy jog',level:'Standard',purpose:'Hold 5K rhythm for longer stretches.',cue:'Stay near current 5K pace, not the pace you hope to race one day.'},
{id:'5c',name:'The kilometre rehearsal',category:'specific',goals:['5k'],reps:4,meters:1000,pace:'5k',recovery:150,recoveryType:'easy jog',level:'Demanding',purpose:'Rehearse sustained 5K effort with full control.',cue:'A demanding race-specific option. Stop if maintaining pace requires straining.'},
{id:'10a',name:'10K rhythm: kilometres',category:'specific',goals:['10k'],reps:5,meters:1000,pace:'10k',recovery:90,recoveryType:'easy jog',level:'Standard',purpose:'Make current 10K pace feel familiar and repeatable.',cue:'Keep the effort steady and the recovery truly easy.'},
{id:'10b',name:'10K strength: two-kilometres',category:'specific',goals:['10k'],reps:3,meters:2000,pace:'10k',recovery:120,recoveryType:'easy jog',level:'Demanding',purpose:'Extend the amount of uninterrupted running at 10K rhythm.',cue:'Choose this after shorter 10K repetitions feel controlled.'},
{id:'ha',name:'Half-marathon rhythm',category:'specific',goals:['half'],reps:3,meters:2000,pace:'half',recovery:90,recoveryType:'easy jog',level:'Standard',purpose:'Develop comfort at current equivalent half-marathon pace.',cue:'Patient, smooth repetitions. Let the rhythm come to you.'},
{id:'hb',name:'Long half-marathon blocks',category:'specific',goals:['half'],reps:3,meters:3000,pace:'half',recovery:120,recoveryType:'easy jog',level:'Demanding',purpose:'Build race-specific endurance with longer blocks.',cue:'A substantial session for established runners. Keep the final block controlled.'},
{id:'ma',name:'Marathon rhythm builder',category:'specific',goals:['marathon'],reps:3,meters:3000,pace:'marathon',recovery:180,recoveryType:'easy jog',level:'Standard',purpose:'Practise a steady marathon rhythm in manageable blocks.',cue:'Treat the pace as an equivalent-fitness estimate. Marathon endurance must support it.'},
{id:'mb',name:'Sustained marathon blocks',category:'specific',goals:['marathon'],reps:2,meters:5000,pace:'marathon',recovery:180,recoveryType:'easy jog',level:'Demanding',purpose:'Extend the time spent running at marathon rhythm.',cue:'Use only when your established volume supports the session. Practise your fuelling.'},
{id:'e1',name:'The easy reset',category:'easy',goals:["mile", "5k", "10k", "half", "marathon"],reps:1,seconds:1800,pace:'easy',recovery:0,recoveryType:'continuous',level:'Light',purpose:'Add low-stress aerobic running and support recovery.',cue:'Conversational throughout. Slower than the suggested range is fine.'},
{id:'e2',name:'Aerobic mileage',category:'easy',goals:["10k", "half", "marathon"],reps:1,seconds:2700,pace:'easy',recovery:0,recoveryType:'continuous',level:'Standard',purpose:'Build aerobic capacity through comfortable, steady running.',cue:'Keep the effort easy even on hills or into a headwind.'},
{id:'e3',name:'Time on your feet',category:'easy',goals:["half", "marathon"],reps:1,seconds:4500,pace:'easy',recovery:0,recoveryType:'continuous',level:'Demanding',purpose:'Develop endurance at a conversational intensity.',cue:'Choose this only when the duration fits your usual long run and weekly volume.'},
{"id":"mi2","name":"Mile rhythm: 300s","category":"specific","goals":["mile"],"reps":6,"pace":"repetition","recovery":150,"recoveryType":"easy jog","level":"Standard","purpose":"Hold fast race mechanics beyond the bend without turning the session into a sprint.","cue":"Full recovery matters more than hitting the next rep early.","meters":300},
{"id":"mi3","name":"Mile: 400 + 200 pairs","category":"specific","goals":["mile"],"reps":1,"pace":"repetition","recovery":0,"recoveryType":"easy jog","level":"Demanding","purpose":"Alternate a longer rhythm rep with short, relaxed race-speed repetitions.","cue":"Complete all six blocks in order. Keep each 200 smooth.","seconds":1,"prescription":"3 × (400 + 200 m)","recoverySummary":"2:00 / 3:00 jog","blocks":[{"reps":1,"meters":400,"pace":"repetition","recovery":0,"after":120},{"reps":1,"meters":200,"pace":"repetition","recovery":0,"after":180},{"reps":1,"meters":400,"pace":"repetition","recovery":0,"after":120},{"reps":1,"meters":200,"pace":"repetition","recovery":0,"after":180},{"reps":1,"meters":400,"pace":"repetition","recovery":0,"after":120},{"reps":1,"meters":200,"pace":"repetition","recovery":0,"after":180}]},
{"id":"mi4","name":"Mile: quick race primer","category":"specific","goals":["mile"],"reps":4,"pace":"repetition","recovery":150,"recoveryType":"easy jog","level":"Light","purpose":"Rehearse mile rhythm with very little work and generous recovery.","cue":"Finish feeling sharper rather than tired.","meters":200},
{"id":"5d","name":"5K: the distance ladder","category":"specific","goals":["5k"],"reps":1,"pace":"5k","recovery":0,"recoveryType":"easy jog","level":"Standard","purpose":"Practise holding the same race rhythm as rep length rises and falls.","cue":"Follow the five reps in order. The shorter finish is not a sprint.","seconds":1,"prescription":"400–800–1200–800–400 m","recoverySummary":"90s / 2:00 jog","blocks":[{"reps":1,"meters":400,"pace":"5k","recovery":0,"after":90},{"reps":1,"meters":800,"pace":"5k","recovery":0,"after":120},{"reps":1,"meters":1200,"pace":"5k","recovery":0,"after":120},{"reps":1,"meters":800,"pace":"5k","recovery":0,"after":120},{"reps":1,"meters":400,"pace":"5k","recovery":0,"after":90}]},
{"id":"5e","name":"5K: race-rhythm fartlek","category":"specific","goals":["5k"],"reps":8,"pace":"5k","recovery":60,"recoveryType":"easy jog","level":"Light","purpose":"Learn current 5K effort without needing a track or exact measured reps.","cue":"Run the recovery gently. Keep the final minute as controlled as the first.","seconds":60},
{"id":"5f","name":"5K: strength then turnover","category":"specific","goals":["5k"],"reps":1,"pace":"5k","recovery":0,"recoveryType":"easy jog","level":"Demanding","purpose":"Switch from sustained race rhythm to short economy repetitions.","cue":"Run the kilometre reps first; reset fully before the short reps.","seconds":1,"prescription":"3 × 1000 + 4 × 200 m","recoverySummary":"2:00 jog; 3:00 reset","blocks":[{"reps":3,"meters":1000,"pace":"5k","recovery":120,"after":180},{"reps":4,"meters":200,"pace":"repetition","recovery":120}]},
{"id":"10c","name":"10K: the descending set","category":"specific","goals":["10k"],"reps":1,"pace":"10k","recovery":0,"recoveryType":"easy jog","level":"Demanding","purpose":"Practise sustained race rhythm, then shorten the work as fatigue builds.","cue":"Run 3 km, then 2 km, then 1 km. Hold the same effort.","seconds":1,"prescription":"3000 + 2000 + 1000 m","recoverySummary":"2:00 jog","blocks":[{"reps":1,"meters":3000,"pace":"10k","recovery":0,"after":120},{"reps":1,"meters":2000,"pace":"10k","recovery":0,"after":120},{"reps":1,"meters":1000,"pace":"10k","recovery":0,"after":120}]},
{"id":"10d","name":"10K: fifteen-hundreds","category":"specific","goals":["10k"],"reps":4,"pace":"10k","recovery":120,"recoveryType":"easy jog","level":"Standard","purpose":"Link several kilometres of current 10K rhythm with brief breaks.","cue":"Keep every rep even. This is race practice rather than a fitness test.","meters":1500},
{"id":"10e","name":"10K: rhythm introduction","category":"specific","goals":["10k"],"reps":6,"pace":"10k","recovery":90,"recoveryType":"easy jog","level":"Light","purpose":"Introduce current 10K pace in shorter measured repetitions.","cue":"Choose this before the longer kilometre or two-kilometre options.","meters":600},
{"id":"hc","name":"Half: long descending blocks","category":"specific","goals":["half"],"reps":1,"pace":"half","recovery":0,"recoveryType":"easy jog","level":"Demanding","purpose":"Hold half-marathon rhythm as continuous work gradually gets shorter.","cue":"Run 4 km, 3 km, then 2 km. Avoid accelerating to compensate for fatigue.","seconds":1,"prescription":"4000 + 3000 + 2000 m","recoverySummary":"2:00 jog","blocks":[{"reps":1,"meters":4000,"pace":"half","recovery":0,"after":120},{"reps":1,"meters":3000,"pace":"half","recovery":0,"after":120},{"reps":1,"meters":2000,"pace":"half","recovery":0,"after":120}]},
{"id":"hd","name":"Half: continuous race rhythm","category":"specific","goals":["half"],"reps":1,"pace":"half","recovery":0,"recoveryType":"easy jog","level":"Standard","purpose":"Practise uninterrupted running at current equivalent half-marathon effort.","cue":"Stay controlled throughout; race effort varies with how long your half marathon takes.","seconds":1500},
{"id":"he","name":"Half: rhythm with easy floats","category":"specific","goals":["half"],"reps":1,"pace":"half","recovery":0,"recoveryType":"easy jog","level":"Standard","purpose":"Return to race rhythm after moving recoveries, without stopping.","cue":"Complete five 1 km rhythm blocks, with 500 m easy after the first four.","seconds":1,"prescription":"5 × 1000 m / 500 m float","recoverySummary":"500 m easy float","blocks":[{"reps":1,"meters":1000,"pace":"half","recovery":0},{"reps":1,"meters":500,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"half","recovery":0},{"reps":1,"meters":500,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"half","recovery":0},{"reps":1,"meters":500,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"half","recovery":0},{"reps":1,"meters":500,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"half","recovery":0}]},
{"id":"mc","name":"Marathon: alternating kilometres","category":"specific","goals":["marathon"],"reps":1,"pace":"marathon","recovery":0,"recoveryType":"easy jog","level":"Standard","purpose":"Practise returning to marathon rhythm while keeping the whole run continuous.","cue":"Run six marathon-pace kilometres, with a kilometre easy between each. No final float.","seconds":1,"prescription":"6 × 1000 m / 1000 m float","recoverySummary":"1 km easy float","blocks":[{"reps":1,"meters":1000,"pace":"marathon","recovery":0},{"reps":1,"meters":1000,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"marathon","recovery":0},{"reps":1,"meters":1000,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"marathon","recovery":0},{"reps":1,"meters":1000,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"marathon","recovery":0},{"reps":1,"meters":1000,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"marathon","recovery":0},{"reps":1,"meters":1000,"pace":"easy","recovery":0},{"reps":1,"meters":1000,"pace":"marathon","recovery":0}]},
{"id":"md","name":"Marathon: the fast-finish run","category":"specific","goals":["marathon"],"reps":1,"pace":"marathon","recovery":0,"recoveryType":"easy jog","level":"Demanding","purpose":"Practise moving into marathon rhythm on legs that have already done some easy work.","cue":"Run 60 min easy, then 20 min at marathon rhythm. Practise fuelling; finish under control.","seconds":1,"prescription":"60 min easy + 20 min MP","recoverySummary":"Continuous","warmup":0,"cooldown":300,"blocks":[{"reps":1,"seconds":3600,"pace":"easy","recovery":0},{"reps":1,"seconds":1200,"pace":"marathon","recovery":0}]},
{"id":"me","name":"Marathon: continuous rhythm","category":"specific","goals":["marathon"],"reps":1,"pace":"marathon","recovery":0,"recoveryType":"easy jog","level":"Light","purpose":"Introduce a shorter continuous stretch at current marathon-equivalent pace.","cue":"A pace equivalent is not a guarantee of marathon endurance. Keep this introductory block comfortable.","seconds":1200},
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
export const PACE_LABELS:Record<PaceKey,string>={easy:'Easy',subShort:'Short sub-threshold',subMedium:'Sub-threshold',subLong:'Long sub-threshold',threshold:'Threshold',interval:'Aerobic power',repetition:'Mile rhythm','5k':'5K pace','10k':'10K pace',half:'Half-marathon pace',marathon:'Marathon pace'};
export function workoutBlocks(w:Workout):WorkBlock[]{return w.blocks??[{reps:w.reps,meters:w.meters,seconds:w.seconds,pace:w.pace,recovery:w.recovery}];}
export function blockMetrics(b:WorkBlock,score:number){
 const range=paceRange(score,b.pace),mid=(range[0]+range[1])/2;
 const repSeconds=b.seconds??b.meters!/1000*mid;
 const repMeters=b.meters??b.seconds!/mid*1000;
 return {range,repSeconds,repMeters,workSeconds:repSeconds*b.reps,workMeters:repMeters*b.reps};
}
export function workoutMetrics(w:Workout,score:number){
 const blocks=workoutBlocks(w),first=blockMetrics(blocks[0],score);
 let workSeconds=0,workMeters=0,recoverySeconds=0,qualityMeters=0;
 blocks.forEach((b,i)=>{const m=blockMetrics(b,score);workSeconds+=m.workSeconds;workMeters+=m.workMeters;if(b.pace!=='easy')qualityMeters+=m.workMeters;recoverySeconds+=(b.reps-1)*b.recovery+(i<blocks.length-1?(b.after??0):0);});
 return {...first,range:paceRange(score,w.pace),workSeconds,workMeters,recoverySeconds,qualityMeters};
}
export function prescription(w:Workout):string{return w.prescription??`${w.reps>1?w.reps+' × ':''}${w.meters?w.meters.toLocaleString('en-GB')+' m':w.seconds!<60?w.seconds+' sec':w.seconds!/60+' min'}`;}
export function recoveryLabel(w:Workout):string{return w.recoverySummary??(w.recovery?`${formatTime(w.recovery)} ${w.recoveryType==='walk / jog'?'walk/jog':'jog'}`:'Continuous');}
