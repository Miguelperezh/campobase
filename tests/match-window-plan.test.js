import test from 'node:test';
import assert from 'node:assert/strict';
import {plannedMinutes,validLineup,describeMoment} from '../js/match-moments.js';
import {configurePlayerIntervals,insertWindowBoundary,changeWindowPlayer,normalizePlayerIntervals,recommendedPlayerIntervals,completeProposedStarters,playerIntervals,validateWindowPlan} from '../js/match-window-plan.js';
const ids=['g1','g2',...Array.from({length:12},(_,i)=>'p'+i)];
const initial={id:'inicio',minute:0,formation:'1-2-3-1',team:[{pos:'Portero',playerId:'g1'},...Array.from({length:6},(_,i)=>({pos:'Puesto '+i,playerId:'p'+i,x:20+i,y:40}))]};
let serial=0;const idFactory=()=>String(++serial);
const desired=[{from:0,to:5},{from:10,to:15},{from:20,to:30}];
const configure=(moments=[initial],intervals=desired)=>configurePlayerIntervals({moments,intervals,playerId:'p0',reliefId:'p6',availableIds:ids,duration:70,idFactory});
test('0–5, 10–15 y 20–30 son 20 minutos, con entradas y salidas repetidas reales',()=>{
 const before=structuredClone(initial);const moments=configure();
 assert.deepEqual(initial,before);
 assert.equal(plannedMinutes(moments,70).p0,20);assert.equal(plannedMinutes(moments,70).p6,50);
 assert.deepEqual(playerIntervals(moments,'p0',70),desired);
 assert.deepEqual(moments.map(m=>m.minute),[0,5,10,15,20,30]);
 assert.deepEqual(moments.map(m=>m.team[1].playerId),['p0','p6','p0','p6','p0','p6']);
 for(const m of moments)assert.ok(validLineup(m.team,ids));
 assert.equal(Object.values(plannedMinutes(moments,70)).reduce((a,b)=>a+b,0),490);
 assert.deepEqual(describeMoment(moments[1],moments[2]).pairs,[{inId:'p0',outId:'p6'}]);
});
test('conserva otros relevos, posiciones y coordenadas dentro de un intervalo editado',()=>{
 const other={...structuredClone(initial),id:'otro',minute:25};other.team[2].playerId='p7';other.team[3].pos='Otra posición';
 const moments=configure([initial,other]);const later=moments.find(m=>m.minute===25);
 assert.equal(later.team[2].playerId,'p7');assert.equal(later.team[3].pos,'Otra posición');assert.equal(later.team[3].x,initial.team[3].x);
 assert.equal(plannedMinutes(moments,70).p0,20);
});
test('vaciar tramos significa descanso completo, sin borrar jugadores ni puestos',()=>{
 const moments=configure([initial],[]);assert.equal(plannedMinutes(moments,70).p0||0,0);assert.equal(plannedMinutes(moments,70).p6,70);assert.equal(moments[0].team.length,7);
});
test('solapamientos, límites e incompatibilidades se rechazan sin modificar el original',()=>{
 assert.throws(()=>normalizePlayerIntervals([{from:0,to:6},{from:5,to:10}],70),/solaparse/);
 for(const intervals of [[{from:10,to:5}],[{from:0,to:71}],[{from:-1,to:3}],[{from:NaN,to:4}]])assert.throws(()=>configure([initial],intervals));
 const both=structuredClone(initial);both.team[2].playerId='p6';assert.throws(()=>configure([both]),/coinciden/);
 assert.throws(()=>configurePlayerIntervals({moments:[initial],playerId:'p0',reliefId:'no-convocado',intervals:desired,availableIds:ids,duration:70}));
});
test('ventanas arbitrarias e intercambio de posiciones mantienen jugadores únicos y totales',()=>{
 let moments=[initial];for(const minute of [5,10,15,20,30,35,40,60])moments=insertWindowBoundary(moments,minute,70,idFactory);
 const before=structuredClone(moments);moments=changeWindowPlayer(moments,2,1,'p6');moments=changeWindowPlayer(moments,2,2,'p3');
 assert.equal(moments[2].team[2].playerId,'p3');assert.equal(moments[2].team[4].playerId,'p1');
 assert.deepEqual(moments[3].team,before[3].team);validateWindowPlan(moments,ids,70);
 assert.equal(plannedMinutes(moments,70).p6,5);assert.equal(plannedMinutes(moments,70).p0,65);
});
test('recomendaciones respetan el objetivo elegido y no cuentan dos veces intervalos contiguos',()=>{
 for(const target of [0,20,30,35,70]) {
  const intervals=recommendedPlayerIntervals(70,target,5);const moments=configure([initial],intervals);
  assert.ok(Math.abs((plannedMinutes(moments,70).p0||0)-target)<0.001);
 }
 assert.deepEqual(normalizePlayerIntervals([{from:0,to:5},{from:5,to:10}],70),[{from:0,to:10}]);
 assert.throws(()=>recommendedPlayerIntervals(70,80));
});
test('proponer completa puestos vacíos sin cambiar titulares elegidos ni mutar el borrador',()=>{
 const partial=structuredClone(initial);partial.team[2].playerId='';partial.team[3].playerId='';const before=structuredClone(partial);
 const completed=completeProposedStarters(partial,ids,['g1','g2']);assert.deepEqual(partial,before);
 assert.ok(validLineup(completed.team,ids));assert.equal(completed.team[1].playerId,'p0');assert.equal(completed.team[0].playerId,'g1');
});
