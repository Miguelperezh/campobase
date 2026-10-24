import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { syncStatus } from '../js/sync-status.js';

const attendanceSource = readFileSync(new URL('../js/attendance-linked-sources.js', import.meta.url), 'utf8');
const runtimeSource = readFileSync(new URL('../js/runtime-refresh.js', import.meta.url), 'utf8');
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return {promise, resolve}; };
const turn = () => new Promise(done => setImmediate(done));
const classList = () => { const values = new Set(); return {contains:v=>values.has(v), add:v=>values.add(v), remove:v=>values.delete(v)}; };

function attendanceFixture({existing = true, role = 'owner'} = {}) {
  let account = 'A', revision = 1, locked = false, hold = null, writeHold = null, denied = false;
  const writes = [], buttons = [{disabled:false}], root = {classList:classList(),scrollIntoView(){}};
  root.classList.add('hidden');
  const form = {dataset:{attendanceSource:'session',sourceId:'s1'},isConnected:true,
    elements:{'status-p1':{value:'absent'},'note-p1':{value:'Nota del borrador'},notes:{value:'Borrador del entrenador'}},
    closest:()=>root,querySelectorAll:()=>buttons};
  let visibleForm = form;
  root.querySelector=selector=>selector==='#training-form'?visibleForm:null;
  const fixtures = Object.fromEntries(['A','B'].map(key=>[key,{
    settings:[{id:'s1',recordType:'trainingSession',date:'2026-10-24',name:`Sesión ${key}`}],
    matches:[],callups:[],players:[{id:'p1',name:`Jugador ${key}`}],
    trainings:existing?[{id:'attendance',sessionId:'s1',kind:'training',date:'2026-10-24',notes:`Guardado ${key}`,attendance:[{playerId:'p1',status:'present'}]}]:[],
  }]));
  const state={role},permissions=['asistencia'];
  const context={console,Promise,Date,JSON,WeakMap,WeakSet,Set,Map,structuredClone,crypto:{randomUUID:()=> 'new-attendance'},
    window:{__campobase:{state,getDelegatePermissions:()=>permissions},setTimeout(){}},
    document:{querySelector:selector=>selector==='#training-form'?visibleForm:selector==='#training-builder'?root:null},
    getBoundSaasUserId:()=>account,currentDatabaseName:()=>`campobase_${account}`,getPinAccessRevision:()=>revision,isPinAccessLocked:()=>locked,
    roleCanUseOwnerFeatures:value=>['owner','demo'].includes(value),
    getAll:async store=>{const rows=structuredClone(fixtures[account][store]);if(hold)await hold.promise;return rows;},
    put:async(store,record,options)=>{
      assert.equal(options.waitForCloud,false,'El guardado local no espera a la red');
      if(writeHold)await writeHold.promise;
      options.assertContext(`campobase_${account}`);
      if(denied)throw Object.assign(new Error('Permiso revocado antes de escribir'),{code:'CAMPOBASE_PERMISSION_DENIED'});
      for(const expected of options.expectedRecords){
        const current=fixtures[account][expected.store].find(row=>row.id===expected.id)??null;
        if(JSON.stringify(current)!==JSON.stringify(expected.record??null))throw Object.assign(new Error('Registro cambiado'),{code:'CAMPOBASE_RECORD_CHANGED'});
      }
      for(const expected of options.expectedStores||[]){
        if(JSON.stringify(fixtures[account][expected.store])!==JSON.stringify(expected.records))throw Object.assign(new Error('Colección cambiada'),{code:'CAMPOBASE_RECORD_CHANGED'});
      }
      writes.push({account,store,record:structuredClone(record)});
      const rows=fixtures[account][store],index=rows.findIndex(row=>row.id===record.id);
      if(index<0)rows.push(record);else rows[index]=record;
    },
  };
  vm.createContext(context);
  const code=attendanceSource.slice(attendanceSource.indexOf('const $ ='),attendanceSource.indexOf('function installStyles()')).replace(/^export /gm,'');
  vm.runInContext(`${code}\nupdateEditorSummary=()=>{};renderSources=async()=>{};showToast=()=>{};`,context);
  const call=expression=>vm.runInContext(expression,context);
  context.form=form;
  return {fixtures,form,root,buttons,writes,state,permissions,call,
    open:()=>call("openActivityAttendance('session','s1')"),save:()=>call('saveVisualAttendance(form)'),
    switchAccount:value=>{account=value;},setRevision:value=>{revision=value;},lock:()=>{locked=true;},
    holdReads:()=>{hold=deferred();return hold;},releaseReads:()=>{hold?.resolve();hold=null;},
    holdWrites:()=>{writeHold=deferred();return writeHold;},deny:()=>{denied=true;},replaceForm:()=>{visibleForm={};},
  };
}

test('asistencia visual nunca borra registros históricos ni al cancelar una eliminación',()=>{
  assert.doesNotMatch(attendanceSource,/cleanupOrphanSessionAttendance|scheduleCleanup|await remove\(/);
  assert.doesNotMatch(attendanceSource,/closest\('\.delete-session'\)/);
});

test('formulario abierto en A no guarda sobre B con los mismos identificadores',async()=>{
  const fixture=attendanceFixture();await fixture.open();const before=structuredClone(fixture.fixtures);
  fixture.switchAccount('B');await assert.rejects(fixture.save(),/cuenta o tus permisos/);
  assert.deepEqual(fixture.fixtures,before);assert.equal(fixture.writes.length,0);assert.equal(fixture.form.elements.notes.value,'Borrador del entrenador');
});

test('cambio de cuenta durante la lectura no abre ni guarda el formulario anterior',async()=>{
  const opening=attendanceFixture();const wait=opening.holdReads(),promise=opening.open();opening.switchAccount('B');wait.resolve();
  await assert.rejects(promise,/cuenta o tus permisos/);assert.equal(opening.root.classList.contains('hidden'),true);
  const saving=attendanceFixture();await saving.open();const read=saving.holdReads(),save=saving.save();saving.switchAccount('B');read.resolve();
  await assert.rejects(save,/cuenta o tus permisos/);assert.equal(saving.writes.length,0);assert.equal(saving.buttons[0].disabled,false);
});

test('rol, revisión PIN, bloqueo y revocación actual del permiso impiden reutilizar asistencia',async()=>{
  for(const change of [f=>{f.state.role='delegate';},f=>f.setRevision(2),f=>f.lock()]){
    const fixture=attendanceFixture();await fixture.open();change(fixture);await assert.rejects(fixture.save(),/cuenta o tus permisos/);assert.equal(fixture.writes.length,0);
  }
  const delegate=attendanceFixture({role:'delegate'});await delegate.open();delegate.permissions.length=0;
  await assert.rejects(delegate.save(),/cuenta o tus permisos/);assert.equal(delegate.writes.length,0);
});

test('una fuente o asistencia modificada en otro dispositivo conserva el borrador',async()=>{
  for(const change of [f=>{f.fixtures.A.settings[0].name='Versión nueva';},f=>{f.fixtures.A.trainings[0].notes='Edición remota';}]){
    const fixture=attendanceFixture();await fixture.open();change(fixture);const before=structuredClone(fixture.fixtures.A);
    await assert.rejects(fixture.save(),/ha cambiado en otro dispositivo/);assert.deepEqual(fixture.fixtures.A,before);assert.equal(fixture.writes.length,0);assert.equal(fixture.root.classList.contains('hidden'),false);
  }
});

test('dos sesiones del mismo día nunca comparten ni sobrescriben la asistencia vinculada',async()=>{
  const fixture=attendanceFixture();
  fixture.fixtures.A.settings.push({id:'s2',recordType:'trainingSession',date:'2026-10-24',name:'Segunda sesión'});
  const original=structuredClone(fixture.fixtures.A.trainings[0]);
  fixture.form.dataset.sourceId='s2';await fixture.call("openActivityAttendance('session','s2')");await fixture.save();
  assert.deepEqual(fixture.fixtures.A.trainings.find(row=>row.id==='attendance'),original);
  assert.equal(fixture.fixtures.A.trainings.find(row=>row.id==='new-attendance').sessionId,'s2');
  assert.equal(fixture.call("attendanceForMatch([{kind:'match',matchId:'other',date:'2026-10-24'}],'s2')"),undefined);
});

test('legado solo se adopta si la sesión de esa fecha y la asistencia sin vínculo son únicas',()=>{
  const fixture=attendanceFixture();
  const session={id:'s1',date:'2026-10-24'},legacy={id:'legacy',kind:'training',date:'2026-10-24'};
  const lookup=(rows,sessions)=>fixture.call(`attendanceForSession(${JSON.stringify(rows)},${JSON.stringify(session)},${JSON.stringify(sessions)})`);
  assert.equal(lookup([legacy],[session]).id,'legacy');
  assert.equal(lookup([legacy],[session,{id:'s2',date:session.date}]),undefined);
  assert.equal(lookup([legacy,{...legacy,id:'legacy-2'}],[session]),undefined);
  assert.equal(lookup([{...legacy,sessionId:'another-session'}],[session]),undefined);
  assert.equal(lookup([{...legacy,matchId:'another-match'}],[session]),undefined);
  assert.equal(fixture.call("attendanceForSession([{id:'exact',sessionId:'1'}],{id:1,date:'2026-10-24'},[])?.id"),'exact');
  assert.equal(fixture.call("attendanceForMatch([{id:'exact',kind:'match',matchId:'1'}],1)?.id"),'exact');
});

test('contexto y baseline se comprueban de nuevo dentro del guardado pendiente',async()=>{
  for(const change of [f=>f.switchAccount('B'),f=>{f.fixtures.A.settings[0].name='Cambiada durante put';},f=>f.root.classList.add('hidden')]){
    const fixture=attendanceFixture();await fixture.open();const wait=fixture.holdWrites(),saving=fixture.save();await turn();change(fixture);wait.resolve();
    await assert.rejects(saving);assert.equal(fixture.writes.length,0);assert.equal(fixture.buttons[0].disabled,false);
  }
});

test('asistencia nueva detecta otra asistencia creada antes de su transacción',async()=>{
  const fixture=attendanceFixture({existing:false});await fixture.open();const wait=fixture.holdWrites(),saving=fixture.save();await turn();
  fixture.fixtures.A.trainings.push({id:'created-elsewhere',sessionId:'s1',notes:'No reemplazar'});wait.resolve();
  await assert.rejects(saving,/Colección cambiada/);assert.equal(fixture.writes.length,0);assert.equal(fixture.fixtures.A.trainings.length,1);
});

test('un jugador eliminado mientras el guardado espera no deja una asistencia huérfana',async()=>{
  const fixture=attendanceFixture();await fixture.open();const before=structuredClone(fixture.fixtures.A.trainings);
  const wait=fixture.holdWrites(),saving=fixture.save();await turn();fixture.fixtures.A.players=[];wait.resolve();
  await assert.rejects(saving,/Colección cambiada/);assert.equal(fixture.writes.length,0);assert.deepEqual(fixture.fixtures.A.trainings,before);assert.equal(fixture.root.classList.contains('hidden'),false);
});

test('doble envío se serializa y un rechazo conserva el formulario y los registros',async()=>{
  const fixture=attendanceFixture();await fixture.open();const wait=fixture.holdWrites(),saving=fixture.save();await turn();await fixture.save();wait.resolve();await saving;
  assert.equal(fixture.writes.length,1);assert.equal(fixture.writes[0].record.id,'attendance');assert.equal(fixture.writes[0].record.attendance[0].status,'absent');
  const denied=attendanceFixture({role:'delegate'});await denied.open();denied.deny();const before=structuredClone(denied.fixtures);
  await assert.rejects(denied.save(),/Permiso revocado/);assert.deepEqual(denied.fixtures,before);assert.equal(denied.root.classList.contains('hidden'),false);assert.equal(denied.form.elements.notes.value,'Borrador del entrenador');assert.equal(denied.buttons[0].disabled,false);
});

function refreshFixture(result) {
  let account='A',calls=0;const messages=[],renderCalls=[],button={};
  const app={state:{role:'owner',cloudError:''},synchronizeCloud:async()=>{calls++;return typeof result==='function'?result():result;},
    refresh:async force=>renderCalls.push(['refresh',force]),renderAll:()=>renderCalls.push(['render']),toast:m=>messages.push(m)};
  const context={Promise,JSON,WeakMap,NaN,console,button,syncStatus,getBoundSaasUserId:()=>account,currentDatabaseName:()=>`campobase_${account}`,getPinAccessRevision:()=>1,isDemoDatabase:()=>false,
    window:{__campobase:app},document:{querySelector:()=>({id:'asistencia'})},navigator:{onLine:true},sessionStorage:{setItem(){}}};
  vm.createContext(context);vm.runInContext(runtimeSource.slice(runtimeSource.indexOf('let manualRefreshPromise'),runtimeSource.indexOf('export function installRuntimeRefresh')),context);
  return {app,button,messages,renderCalls,run:()=>vm.runInContext('refreshNow(button)',context),switchAccount:value=>{account=value;},calls:()=>calls};
}

test('Actualizar no fuerza render ni borra selecciones o formularios y distingue cambios pendientes',async()=>{
  for(const result of [{online:true,pending:0},{online:true,pending:2},{online:true,pending:2,uploadError:'Subida fallida'},{online:false,error:'offline'}]){
    const fixture=refreshFixture(result);await fixture.run();assert.deepEqual(fixture.renderCalls,[]);assert.equal(fixture.button.disabled,false);
    if(result.pending===0)assert.match(fixture.messages[0],/^Sincronizado/);
    else assert.doesNotMatch(fixture.messages[0],/^Sincronizado/);
  }
});

test('Actualizar no confirma respuesta de otra cuenta y la nueva cuenta no reutiliza su promesa',async()=>{
  const waiting=deferred(),fixture=refreshFixture(()=>waiting.promise),first=fixture.run(),same=fixture.run();assert.equal(fixture.calls(),1);
  fixture.switchAccount('B');fixture.app.synchronizeCloud=async()=>({online:true,pending:0});await fixture.run();assert.equal(fixture.messages.length,1);
  waiting.resolve({online:true,pending:0});await Promise.all([first,same]);assert.equal(fixture.messages.length,1);assert.deepEqual(fixture.renderCalls,[]);
  const cancelled=refreshFixture({online:false,contextChanged:true});await cancelled.run();assert.deepEqual(cancelled.messages,[]);
});
