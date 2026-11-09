import type {Workout,Category} from './running';

// Race-specific sessions follow the selected event. The complete shared training
// library stays available at every distance, including VO₂max and sub-threshold.
export function workoutsForMenu(workouts:readonly Workout[],goal:string,category:Category|'all'='all'){
 return workouts.filter(w=>(goal==='all'||w.category!=='specific'||w.goals.includes(goal))&&(category==='all'||w.category===category));
}

export function normalizeMenuSearch(value:string){
 return value.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();
}
