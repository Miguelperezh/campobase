import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {isTrainingSessionCompleted,withTrainingSessionCompleted,hasUsableTeamSnapshot} from '../js/training-session-status.js';
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
test('los marcadores históricos de realizado se leen sin modificar datos y reabrir elimina todos los marcadores',()=>{
 for(const session of [{completed:true},{status:'closed'},{status:'finished'},{closedAt:1},{archived:true}]){
  const original=structuredClone(session);assert.equal(isTrainingSessionCompleted(session),true);assert.deepEqual(session,original);
  const open=withTrainingSessionCompleted(session,false,10);assert.equal(isTrainingSessionCompleted(open),false);
  assert.equal(isTrainingSessionCompleted(withTrainingSessionCompleted(open,true,11)),true);
 }
 assert.equal(isTrainingSessionCompleted({completed:false}),false);
 assert.equal(hasUsableTeamSnapshot({settings:{ownerPinHash:'hash'},players:[{id:'p'}]}),true);
 assert.equal(hasUsableTeamSnapshot({settings:{ownerPinHash:'hash'},players:[]}),false);
});
test('preparación y lecturas concurrentes comparten contexto de equipo, fallos no se cachean y otra cuenta no lo reutiliza',async()=>{
 const code=readFileSync(new URL('../js/supabase-client.js',import.meta.url),'utf8');const a=code.indexOf('const boundTeamContexts');const b=code.indexOf('async function requireBoundUser',a);const wait=deferred();let calls=0;
 const client={rpc:async()=>{calls++;await wait.promise;return {data:{data_owner_user_id:'owner'}};}};const context={WeakMap,Date,Promise,client};vm.createContext(context);vm.runInContext(code.slice(a,b),context);
 const first=vm.runInContext("getBoundTeamContext(client,'u')",context);const second=vm.runInContext("getBoundTeamContext(client,'u')",context);await new Promise(r=>setImmediate(r));assert.equal(calls,1);wait.resolve();await Promise.all([first,second]);await vm.runInContext("getBoundTeamContext(client,'v')",context);assert.equal(calls,2);
 client.rpc=async()=>{calls++;return {error:Error('network')};};await vm.runInContext("getBoundTeamContext(client,'x')",context);await vm.runInContext("getBoundTeamContext(client,'x')",context);assert.equal(calls,4);
});
test('Actualizar conserva rol, vista y tema sin navegar, serializa clics y se recupera tras error',async()=>{
 const code=readFileSync(new URL('../js/runtime-refresh.js',import.meta.url),'utf8');const a=code.indexOf('let manualRefreshPromise');const b=code.indexOf('export function installRuntimeRefresh',a);const loading=deferred();let calls=0,navigations=0;const messages=[];
 const state={role:'delegate',settings:{theme:{accentColor:'#123456'}}};const original=structuredClone(state);
 const context={window:{__campobase:{state,toast:m=>messages.push(m),synchronizeCloud:async()=>{calls++;return loading.promise;}},location:{replace(){navigations++;}}},document:{querySelector:()=>({id:'sesiones'})},sessionStorage:{setItem(){}},navigator:{},console:{warn(){}},button:{},Promise};vm.createContext(context);vm.runInContext(code.slice(a,b),context);
 const first=vm.runInContext('refreshNow(button)',context),second=vm.runInContext('refreshNow(button)',context);assert.equal(context.button.disabled,true);assert.equal(calls,1);loading.resolve({online:true});await Promise.all([first,second]);assert.equal(navigations,0);assert.equal(context.button.disabled,false);assert.deepEqual(state,original);
 context.window.__campobase.synchronizeCloud=async()=>({online:false,error:'network'});await vm.runInContext('refreshNow(button)',context);assert.equal(context.button.title,'network');assert.match(messages.at(-1),/No se pudo sincronizar/);assert.equal(context.button.disabled,false);assert.deepEqual(state,original);assert.equal(navigations,0);
 context.window.__campobase.synchronizeCloud=async()=>({online:false,authRequired:true});await vm.runInContext('refreshNow(button)',context);assert.match(messages.at(-1),/Reconecta tu cuenta/);assert.deepEqual(state,original);
 context.window.__campobase.synchronizeCloud=async()=>{throw Error('offline');};await vm.runInContext('refreshNow(button)',context);assert.match(messages.at(-1),/No se pudo actualizar/);assert.equal(context.button.disabled,false);assert.deepEqual(state,original);
});

test('polling sin sesión cloud no reconstruye la pantalla ni presenta el fallo como éxito',async()=>{
 const code=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');const a=code.indexOf('async function runCloudSynchronization()');const b=code.indexOf('async function init()',a);let renders=0,refreshes=0,realtime=0;
 const state={role:'delegate',settings:{theme:{accentColor:'#123456'}},players:[{id:'p'}]};const data=structuredClone(state);
 const context={state,isDemoDatabase:()=>false,navigator:{onLine:true},syncFromCloud:async()=>({online:false,authRequired:true}),refresh:async()=>refreshes++,renderAll:()=>renders++,ensureRealtimeSubscription:()=>realtime++,networkStatus(){},refreshSyncStatusPanel:async()=>{},Date};vm.createContext(context);vm.runInContext('let lastCloudSyncTimestamp=0;'+code.slice(a,b),context);
 const result=await vm.runInContext('runCloudSynchronization()',context);assert.equal(result.authRequired,true);assert.equal(refreshes,0);assert.equal(renders,0);assert.equal(realtime,0);assert.match(state.cloudError,/Reconecta/);assert.deepEqual(state.players,data.players);assert.deepEqual(state.settings,data.settings);assert.equal(state.role,data.role);
 // refresh owns renderOrDefer: the sync runner must not bypass an open editor.
 context.syncFromCloud=async()=>({online:true,changed:true});await vm.runInContext('runCloudSynchronization()',context);assert.equal(refreshes,1);assert.equal(renders,0);assert.equal(realtime,1);assert.equal(state.cloudError,'');
 context.syncFromCloud=async()=>({online:false,cloudRestricted:true,changed:true,localRecovered:1});await vm.runInContext('runCloudSynchronization()',context);assert.equal(refreshes,2);assert.equal(renders,0);assert.equal(realtime,1);assert.match(state.cloudError,/cuota/);
});
