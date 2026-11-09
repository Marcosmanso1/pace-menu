import test from 'node:test';
import assert from 'node:assert/strict';
import {parseTime,vdot,raceSeconds,WORKOUTS,workoutMetrics,workoutBlocks,blockMetrics,recoveryDuration,transitionDuration,paceRange,prescription,recoveryLabel,distanceLabel,localizeCue} from './running.ts';
import {workoutsForMenu,normalizeMenuSearch} from './menu.ts';
const score=vdot(5000,1200);
const get=id=>WORKOUTS.find(w=>w.id===id);
const metrics=id=>workoutMetrics(get(id),score);
test('race-performance reference points and distinct 1500/mile pace',()=>{
 assert.ok(Math.abs(score-49.8)<.1);assert.ok(Math.abs(vdot(42195,10800)-53.5)<.2);
 assert.ok(Math.abs(raceSeconds(score,10000)-2488)<3);
 assert.ok(paceRange(score,'1500')[0]<paceRange(score,'repetition')[0]);
 for(const v of [15,30,50,75,95])for(const d of [1500,1609.344,3000,5000,10000,21097.5,42195])assert.ok(Math.abs(vdot(d,raceSeconds(v,d))-v)<1e-8);
});
test('malformed times and zero duration are rejected',()=>{
 assert.equal(parseTime('1:23:22'),5002);assert.equal(parseTime('20:00'),1200);
 for(const t of ['20:60','1:60:00','','-20:00','text','0:00'])assert.equal(parseTime(t),null);
});
test('distance recoveries remain distances and are only between reps',()=>{
 const w=get('10a'),m=metrics('10a');assert.equal(w.recoveryMeters,400);assert.equal(w.recovery,0);assert.equal(m.workMeters,5000);
 assert.ok(m.recoverySeconds>515&&m.recoverySeconds<521); // Four 400m jogs at the estimated easy midpoint for a 20min 5K.
 assert.equal(metrics('m1').workMeters,1600);
 assert.ok(Math.abs(metrics('m1').recoverySeconds-7*recoveryDuration(workoutBlocks(get('m1'))[0],score))<1e-9);
});
test('ratio recovery follows the preceding rep, with no final recovery',()=>{
 const m=metrics('mi5');assert.ok(Math.abs(m.recoverySeconds-5*m.repSeconds)<1e-8);
 const long=metrics('mi6');assert.ok(Math.abs(long.recoverySeconds-3*2*long.repSeconds)<1e-8);
});
test('change-up 1200s have continuous internal pace changes and rests between sets only',()=>{
 const w=get('5f'),m=metrics('5f');assert.equal(m.workMeters,4800);assert.equal(m.qualityMeters,4800);assert.equal(m.recoverySeconds,540);
 assert.equal(w.blocks.length,8);assert.equal(w.blocks[0].pace,'10k');assert.equal(w.blocks[1].pace,'3k');
 assert.equal(transitionDuration(w.blocks[0],score),0);
});
test('progressive 400s retain distance recovery and explicit pace offsets',()=>{
 const w=get('5g');assert.equal(metrics('5g').workMeters,3600);assert.equal(w.blocks[0].recoveryMeters,100);assert.equal(w.blocks[1].recoveryMeters,200);assert.equal(w.blocks[2].recoveryMeters,400);
 assert.equal(blockMetrics(w.blocks[1],score).range[0],paceRange(score,'5k')[0]-5);
 assert.equal(blockMetrics(w.blocks[2],score).range[0],paceRange(score,'5k')[0]-10);
});
test('half/marathon floats count as quality; easy floats do not',()=>{
 const h=metrics('he');assert.equal(h.workMeters,8000);assert.equal(h.qualityMeters,8000);assert.equal(h.specificMeters,4800);assert.equal(h.recoverySeconds,0);
 const m=metrics('mc');assert.equal(m.workMeters,11000);assert.equal(m.qualityMeters,6000);assert.equal(m.specificMeters,6000);assert.equal(m.recoverySeconds,0);
});
test('full-run simulations do not receive duplicate warm-up and cool-down',()=>{
 const h=metrics('hf');assert.equal(h.workSeconds,4200);assert.equal(h.totalSeconds,4200);
 const m=metrics('md');assert.equal(m.workSeconds,4800);assert.equal(m.totalSeconds,5100);
 assert.equal(get('ms').warmup,0);assert.equal(get('ms').cooldown,0);assert.equal(metrics('ms').totalSeconds,metrics('ms').workSeconds);
 assert.equal(metrics('e1').totalSeconds,1800);
});
test('the advanced 10K rehearsal preserves 5-minute recovery',()=>{
 assert.equal(metrics('10c').workMeters,9000);assert.equal(metrics('10c').recoverySeconds,600);assert.equal(get('10c').level,'Demanding');
});
test('the expanded catalogue has valid IDs and exclusively metric-native definitions',()=>{
 assert.equal(WORKOUTS.length,128);assert.equal(new Set(WORKOUTS.map(w=>w.id)).size,128);
 for(const w of WORKOUTS){assert.ok(!/mile|kilomet|\bkm\b/i.test(w.name),w.name);for(const b of workoutBlocks(w))if(b.meters)assert.equal(Number.isInteger(b.meters),true,w.id);}
});
test('race menus have genuinely distinct core sessions',()=>{
 const goals=['mile','5k','10k','half','marathon'];const sets=goals.map(g=>new Set(WORKOUTS.filter(w=>w.goals.includes(g)&&w.category==='specific').map(w=>w.id)));
 for(const s of sets)assert.ok(s.size>=20);for(let i=0;i<sets.length;i++)for(let j=i+1;j<sets.length;j++)assert.equal([...sets[i]].filter(x=>sets[j].has(x)).length,0);
});
test('every session and source recovery is finite at the supported fitness extremes',()=>{
 for(const v of [15,30,50,75,95])for(const w of WORKOUTS){const m=workoutMetrics(w,v);for(const x of [m.workMeters,m.workSeconds,m.recoverySeconds,m.qualitySeconds,m.totalSeconds,m.longestRepSeconds])assert.ok(Number.isFinite(x)&&x>=0,`${w.id}: ${v}`);assert.ok(m.workMeters>0&&m.workSeconds>0&&m.totalSeconds>=m.workSeconds);assert.ok(m.qualityMeters<=m.workMeters+.001);for(const b of workoutBlocks(w)){assert.ok((b.meters===undefined)!==(b.seconds===undefined));assert.ok(b.reps>0);assert.ok(recoveryDuration(b,v)>=0);}}
});

test('all visible distance helpers follow the selected unit',()=>{
 assert.equal(distanceLabel(400,'km'),'0.4 km');assert.equal(distanceLabel(1600,'km'),'1.6 km');assert.equal(distanceLabel(1609.344,'mi'),'1 mi');
 for(const w of WORKOUTS){for(const unit of ['km','mi']){const text=[prescription(w,unit),recoveryLabel(w,unit),localizeCue(w.cue,unit)].join(' ');assert.ok(!(unit==='km'?/\bmi(?:les?)?\b/i:/\bkm\b/i).test(text),`${w.id} ${unit}: ${text}`);}}
 assert.match(prescription(get('mx'),'km'),/2 × 8 km/);assert.match(prescription(get('ms'),'km'),/10 km/);
 assert.equal(recoveryLabel(get('10a'),'km'),'0.4 km jog');
});
test('pace offsets in execution cues convert with pace units',()=>{
 assert.equal(localizeCue('Run 6 sec/km faster for 2 km.','mi'),'Run 9.7 sec/mi faster for 1.243 mi.');
});
test('compact summaries retain the full written running dose',()=>{
 for(const w of WORKOUTS.filter(w=>w.summarySteps)){const sets=w.summarySets??1;let meters=0,seconds=0,actualMeters=0,actualSeconds=0;
 for(const b of w.summarySteps){meters+=(b.meters??0)*b.reps*sets;seconds+=(b.seconds??0)*b.reps*sets;}
 for(const b of workoutBlocks(w)){actualMeters+=(b.meters??0)*b.reps;actualSeconds+=(b.seconds??0)*b.reps;}
 assert.equal(meters,actualMeters,`${w.id} distance`);assert.equal(seconds,actualSeconds,`${w.id} time`);
 if(w.summarySets)assert.equal(workoutBlocks(w).length%w.summarySets,0,w.id);
 }
});
test('new continuous alternations and walking recoveries preserve their intent',()=>{
 const h=metrics('halfX10');assert.equal(h.workMeters,9600);assert.equal(h.qualityMeters,9600);assert.equal(h.recoverySeconds,0);
 assert.equal(get('tenX13').recoveryType,'walk');assert.equal(metrics('tenX13').recoverySeconds,480);
 assert.equal(metrics('xm16').workSeconds,4500);assert.equal(metrics('xm16').totalSeconds,6000);
});
test('all final blocks omit a trailing recovery',()=>{
 for(const w of WORKOUTS.filter(w=>w.blocks)){const last=w.blocks.at(-1);assert.ok(!last.after&&!last.afterMeters,w.id);}
});

test('every race menu exposes all training types without a supporting-tab gate',()=>{
 for(const goal of ['mile','5k','10k','half','marathon']){
  const menu=workoutsForMenu(WORKOUTS,goal);
  for(const category of ['sub','threshold','vo2','speed','specific','easy'])assert.ok(menu.some(w=>w.category===category),`${goal}: ${category} missing`);
  assert.ok(menu.some(w=>w.id==='s1'));assert.ok(menu.some(w=>w.id==='v1'));
 }
});
test('sub-threshold and VO₂max filters retain the complete shared session library',()=>{
 for(const goal of ['all','mile','5k','10k','half','marathon']){
  assert.deepEqual(workoutsForMenu(WORKOUTS,goal,'sub').map(w=>w.id),['s1','s2','s3','s4','s5','s6']);
  assert.equal(workoutsForMenu(WORKOUTS,goal,'vo2').length,4);
 }
});
test('event filtering keeps unique race sessions and the complete catalogue',()=>{
 assert.equal(workoutsForMenu(WORKOUTS,'all').length,128);
 assert.equal(new Set(workoutsForMenu(WORKOUTS,'all').map(w=>w.id)).size,128);
 for(const [goal,count] of [['mile',20],['5k',21],['10k',21],['half',22],['marathon',24]]){
  const specific=workoutsForMenu(WORKOUTS,goal,'specific');assert.equal(specific.length,count);assert.ok(specific.every(w=>w.goals.includes(goal)));
  assert.equal(workoutsForMenu(WORKOUTS,goal).length,count+20);
 }
});

test('familiar search spelling finds VO2 and sub-threshold labels',()=>{
 assert.ok(normalizeMenuSearch('VO₂max').includes(normalizeMenuSearch('vo2')));
 assert.ok(normalizeMenuSearch('Sub-threshold').includes(normalizeMenuSearch('sub t')));
 assert.equal(normalizeMenuSearch('  Race–specific  '),'race specific');
});
