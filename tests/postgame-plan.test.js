import test from 'node:test';
import assert from 'node:assert/strict';
import {performanceFromSavedPlan, keeperCandidates, isMatchTerminal, postgameFormat} from '../js/postgame-plan.js';
import {keeperGoalAllocation} from '../js/keeper-goals.js';

const ids=Array.from({length:14},(_,i)=>`p${i+1}`);
const team=(start)=>Array.from({length:7},(_,i)=>({playerId:ids[start+i],pos:i===0?'Portero':`Puesto ${i}`}));
const callup={availableIds:ids,format:'F7'};
const initial=team(0),second=team(7);
const prep={id:'prep',matchId:'m',team:initial,formacion:'1-3-2-1',moments:[
  {id:'first',minute:10,team:second},
  {id:'return',minute:15,team:initial},
  {id:'second',minute:20,team:second},
  {id:'return-again',minute:30,team:initial},
  {id:'swap',minute:40,team:initial.map((slot,i)=>({...slot,pos:i===1?'Puesto 2':i===2?'Puesto 1':slot.pos}))},
]};
test('aplicar plan suma todas las reentradas de los 14 convocados sin cronómetro ni mutaciones',()=>{
  const snapshot=JSON.stringify({prep,callup});
  const result=performanceFromSavedPlan({id:'m'},callup,prep);
  assert.equal(Object.keys(result.minuteTotals).length,14);
  assert.equal(result.minuteTotals.p1,55*60);
  assert.equal(result.minuteTotals.p8,15*60);
  assert.equal(Object.values(result.minuteTotals).reduce((a,b)=>a+b,0),490*60);
  assert.equal(result.playedSeconds,4200);
  assert.equal(result.substitutionEvents.length,4);
  assert.equal(result.tacticEvents.length,5);
  assert.deepEqual(result.substitutionEvents[1].inIds,ids.slice(0,7));
  assert.deepEqual(result.keeperIds,['p1','p8']);
  assert.equal(JSON.stringify({prep,callup}),snapshot);
  assert.deepEqual(performanceFromSavedPlan({id:'m'},callup,prep),result);
  result.lineupSnapshot[0].pos='Cambio de copia';
  assert.equal(prep.team[0].pos,'Portero');
});
test('incluye suplentes sin minutos y soporta F11/duración personalizada',()=>{
  const availableIds=Array.from({length:25},(_,i)=>`f${i}`);
  const team=availableIds.slice(0,11).map((playerId,i)=>({playerId,pos:i===0?'Portero':String(i)}));
  const result=performanceFromSavedPlan({id:'f',format:'F11',duration:80},{availableIds},{matchId:'f',team});
  assert.equal(result.minuteTotals.f24,0);
  assert.equal(result.minuteTotals.f0,80*60);
  assert.equal(Object.values(result.minuteTotals).reduce((a,b)=>a+b,0),880*60);
  assert.deepEqual(postgameFormat({}, {format:'f11'}),{duration:90,playersOnField:11});
});
test('no inventa minutos con planes incompletos, ajenos, ventanas inválidas o convocatoria modificada',()=>{
  for(const invalid of [null,{...prep,matchId:'other'},{...prep,team:initial.slice(1)},
    {...prep,moments:[{minute:-1,team:initial}]},{...prep,moments:[{minute:70,team:initial}]},
    {...prep,moments:[{minute:10,team:initial},{minute:10,team:second}]}]){
    assert.throws(()=>performanceFromSavedPlan({id:'m'},callup,invalid));
  }
  assert.throws(()=>performanceFromSavedPlan({id:'m'}, {...callup,availableIds:ids.slice(1)},prep),/convocados/);
  assert.throws(()=>performanceFromSavedPlan({id:'m'},null,prep),/convocatoria/);
});
test('dos porteros convocados aparecen aunque solo uno tenga minutos, sin atribuir todo el marcador a uno',()=>{
  const players=[{id:'a',positions:['Portero']},{id:'b',positions:['Portero']},{id:'c',positions:['Portero']}];
  const match={minuteTotals:{a:4200},goalsAgainst:15};
  const candidates=keeperCandidates(match,players,{availableIds:['a','b']});
  assert.deepEqual(candidates,['a','b']);
  assert.deepEqual(keeperGoalAllocation(match,players,candidates).assigned,{});
  assert.equal(keeperGoalAllocation(match,players,candidates).pending,15);
  assert.deepEqual(keeperGoalAllocation({...match,keeperGoalsAgainst:{a:8,b:7}},players,candidates).assigned,{a:8,b:7});
  assert.ok(keeperCandidates({},[],{availableIds:['x','y']},{firstKeeper:'x',secondKeeper:'y'}).includes('y'));
});
test('cerrado/realizado se excluye del vivo, anotar goles o minutos en directo no lo termina',()=>{
  for(const marker of [{status:'finished'},{status:'closed'},{completed:true},{closedAt:1},{finishedAt:1}])assert.equal(isMatchTerminal(marker),true);
  for(const match of [null,{status:'in_progress',goalsFor:1,minuteTotals:{a:300}},{status:'planned'}])assert.equal(isMatchTerminal(match),false);
});
