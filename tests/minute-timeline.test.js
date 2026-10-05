import test from 'node:test';
import assert from 'node:assert/strict';
import { accumulatedMinutes, rotationPlanMoments, planFromMoments, proposePrepMoments, renderMinuteTimeline } from '../js/minute-timeline.js';
import { validLineup, describeMoment } from '../js/match-moments.js';

const ids=['g1','g2',...Array.from({length:12},(_,i)=>'p'+i)];
const initial={id:'initial',minute:0,formation:'1-2-3-1',team:[{pos:'Portero',playerId:'g2'},...['p11','p8','p5','p3','p2','p0'].map((playerId,index)=>({pos:'Puesto '+index,playerId}))]};
test('propuesta conserva titulares elegidos y cambios simultáneos válidos para ambos modos',()=>{
 for(const mode of ['escalonado','partes']) {
  const before=structuredClone(initial);
  const moments=proposePrepMoments({initial,playerIds:ids,keeperIds:['g1','g2'],mode});
  assert.deepEqual(initial,before);
  assert.deepEqual(moments[0].team,initial.team);
  assert.ok(moments.length>1);
  for(let i=0;i<moments.length;i++) {
   assert.ok(validLineup(moments[i].team,ids,7));
   assert.ok(['g1','g2'].includes(moments[i].team[0].playerId));
   assert.ok(moments[i].team.slice(1).every(slot=>!slot.playerId.startsWith('g')));
   if(i) {assert.ok(moments[i].minute>moments[i-1].minute);assert.ok(describeMoment(moments[i-1],moments[i]).pairs.length>0);}
  }
  const plan=planFromMoments(moments,ids,['g1','g2'],70);
  assert.equal(plan.field.reduce((sum,id)=>sum+plan.planned[id],0),420);
  for(const id of ids)assert.equal(plan.planned[id],35);
 }
});
test('convocatoria insuficiente o titular no convocado no genera un plan parcial',()=>{
 assert.throws(()=>proposePrepMoments({initial,playerIds:ids.filter(id=>id!=='p11'),keeperIds:['g1','g2']}));
});
test('acumulación sigue solo los tramos en campo y conserva los movimientos de posición',()=>{
 const segments=[{from:0,to:15},{from:40,to:60}];
 assert.equal(accumulatedMinutes(segments,10),10);
 assert.equal(accumulatedMinutes(segments,35),15);
 assert.equal(accumulatedMinutes(segments,50),25);
 assert.equal(accumulatedMinutes(segments,70),35);
 const shifted={...initial,minute:15,team:initial.team.map((slot,i)=>({...slot,pos:i===1?'Otra posición':slot.pos}))};
 const plan=planFromMoments([initial,shifted],ids,['g1','g2'],70);
 assert.equal(plan.planned.p11,70);
 const html=renderMinuteTimeline(plan,ids.map(id=>({id,name:'Jugador '+id,number:7})),'test');
 assert.match(html,/type="range"/);assert.match(html,/data-minute-player="p11"/);assert.match(html,/de 70′/);
});

test('reparto con trece jugadores de campo redondea minutos sin perder cambios',()=>{
 const roster=[...ids,'p12'];
 const moments=proposePrepMoments({initial,playerIds:roster,keeperIds:['g1','g2']});
 const plan=planFromMoments(moments,roster,['g1','g2'],70);
 assert.equal(plan.field.reduce((sum,id)=>sum+plan.planned[id],0),420);
 for(const id of plan.field)assert.ok(Math.abs(plan.planned[id]-420/13)<=1,`${id}: ${plan.planned[id]}`);
 for(const moment of moments)assert.ok(validLineup(moment.team,roster,7));
});

test('copiar el plan visible conserva exactamente cada tramo, sin regenerarlo',async()=>{
 const {buildAutoPlan}=await import('../js/reparto-plan.js');
 for(const mode of ['escalonado','partes']) {
  const auto=buildAutoPlan({format:'F7',playerIds:[...ids,'p12'],keeperIds:['g1','g2'],planMode:mode});
  const moments=rotationPlanMoments(auto,initial);
  const copied=planFromMoments(moments,[...ids,'p12'],['g1','g2']);
  for(const id of [...ids,'p12']) assert.ok(Math.abs(copied.planned[id]-auto.planned[id])<0.02, id);
  assert.deepEqual(moments[0].team.map(s=>s.playerId),[auto.lineupAt(0).gk,...auto.lineupAt(0).slots]);
  for(const m of moments)assert.ok(validLineup(m.team,[...ids,'p12'],7));
  const html=renderMinuteTimeline(copied,[], 'exact');assert.match(html,/cbx-minute-spans/);assert.match(html,/min/);
 }
});
