import type {Workout,Category} from './running';

// Race-specific sessions follow the selected event. The complete shared training
// library stays available at every distance, including VO₂max and sub-threshold.
export function workoutsForMenu(workouts:readonly Workout[],goal:string,category:Category|'all'='all'){
 return workouts.filter(w=>(goal==='all'||w.category!=='specific'||w.goals.includes(goal))&&(category==='all'||w.category===category));
}

export function normalizeMenuSearch(value:string){
 return value.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[-–—]/g,' ').replace(/×/g,'x').replace(/(\d)\s*x\s*(?=\d)/g,'$1 x ').replace(/(\d)\s*(km|mi)\b/g,'$1 $2').replace(/\s+/g,' ').trim();
}

export type SubthresholdFormat='all'|'minutes'|'distance';
export function workoutFormat(workout:Workout):'minutes'|'distance'|'mixed'{
 const blocks=workout.blocks??[workout];
 const timed=blocks.some(b=>b.seconds!==undefined),distance=blocks.some(b=>b.meters!==undefined);
 return timed&&distance?'mixed':distance?'distance':'minutes';
}
export function matchesSubthresholdFormat(workout:Workout,format:SubthresholdFormat){
 return workout.category!=='sub'||format==='all'||workoutFormat(workout)===format;
}
