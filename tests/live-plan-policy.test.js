import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { nextSavedPlanWindow } from '../js/live-plan-policy.js';
const first=[{pos:'Portero',playerId:'k'},...Array.from({length:6},(_,i)=>({pos:'Puesto '+i,playerId:'p'+i}))];
const next=structuredClone(first);next[1].playerId='bench';next[2].playerId='p0';
const prep={team:first,formacion:'1-2-3-1',moments:[{id:'m15',minute:15,formation:'1-2-3-1',team:next},{id:'m25',minute:25,formation:'1-2-3-1',team:first}]};
test('plan guardado devuelve su ventana íntegra, incluidas posiciones y sustituciones',()=>{
 const copy=structuredClone(prep);const result=nextSavedPlanWindow(prep,{}, {minute:15});
 assert.equal(result.hasPlan,true);assert.deepEqual(result.moment.team,next);assert.deepEqual(prep,copy);
});
test('alerta aparece un minuto antes y avanza después de hacer o aplazar',()=>{
 assert.equal(nextSavedPlanWindow(prep,{}, {minute:13,alert:true}).moment,null);
 assert.equal(nextSavedPlanWindow(prep,{}, {minute:14,alert:true}).moment.id,'m15');
 for(const timer of [{planDone:['m15']},{planDeferred:['m15']},{planAlertClosed:['m15']}]){
  assert.equal(nextSavedPlanWindow(prep,timer,{minute:20,alert:true}).moment,null);
  assert.equal(nextSavedPlanWindow(prep,timer,{minute:25,alert:true}).moment.id,'m25');
 }
});
test('todo hecho o aplazado conserva el plan y no autoriza reparto alternativo',()=>{
 const result=nextSavedPlanWindow(prep,{planDone:['m15'],planDeferred:['m25']});
 assert.equal(result.hasPlan,true);assert.equal(result.moment,null);
 assert.equal(nextSavedPlanWindow(null).hasPlan,false);
});
test('ocultar el plan en pantalla no autoriza al automático a ignorarlo',()=>{
 assert.equal(nextSavedPlanWindow({...prep,showPlanInLive:false}).hasPlan,true);
});
test('leer un plan actualizado refleja los puestos y minutos recién guardados sin mutar el anterior',()=>{
 const changed=structuredClone(prep);changed.moments[0].minute=18;changed.moments[0].team[2].pos='Delantero';
 assert.equal(nextSavedPlanWindow(changed).moment.minute,18);assert.equal(nextSavedPlanWindow(changed).moment.team[2].pos,'Delantero');
 assert.equal(prep.moments[0].minute,15);
});
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const confirmSource=app.slice(app.indexOf('async function confirmSavedPlanWindow()'),app.indexOf('async function proposeReparto()'));
test('confirmación real no adelanta automático, aplica ventana exacta y respeta Cancelar',async()=>{
 for(const [minute,accept,expected] of [[10,true,[]],[15,false,[]],[15,true,['m15']]]){
  const applied=[],messages=[];
  const confirm=vm.runInNewContext(`(${confirmSource})`,{currentSavedPlanWindow:()=>nextSavedPlanWindow(prep,{}, {minute}),state:{timer:{phase:'first_half'}},timerSeconds:()=>minute*60,toast:t=>messages.push(t),askConfirmation:async()=>accept,momentLines:()=>['Entra bench por p1','p0 cambia de puesto'],applySavedPlanMoment:async id=>applied.push(id)});
  assert.equal(await confirm(),true);assert.deepEqual(applied,expected);
 }
});
test('acciones automática y reparto consultan plan; manual y celebraciones permanecen',()=>{
 assert.match(app,/owner-auto-sub' \|\| target.id === 'delegate-auto-sub'[\s\S]*?if \(await confirmSavedPlanWindow\(\)\) return/);
 assert.match(app,/async function proposeReparto\(\) \{\s*if \(await confirmSavedPlanWindow\(\)\) return/);
 assert.match(app,/target.id === 'make-sub'\) await makeSubstitution\(\)/);
 assert.match(app,/showLiveCelebration\('¡GOOOL!'/);assert.match(app,/showLiveCelebration\('¡PARADÓN!'/);
});
