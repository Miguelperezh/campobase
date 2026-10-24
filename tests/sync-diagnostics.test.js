import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const code=readFileSync(new URL('../js/db.js',import.meta.url),'utf8');
const diagnostics=code.slice(code.indexOf('export async function getSyncDiagnostics()'),code.indexOf('export async function recoverLegacyPendingMutations()')).replace('export ','');
function environment({demo=false,rows=[]}={}) {
  let account='A',reads=0;
  const context={userId:'A',database:'campobase_A'};
  const scope={storageContext:()=>({...context,userId:account,database:demo?'campobase-demo-proof':`campobase_${account}`}),assertStorageContext:c=>{if(c.userId!==account){const error=Error('La cuenta ha cambiado');error.code='CAMPOBASE_CONTEXT_CHANGED';throw error;}},isDemoDatabase:()=>demo,navigator:{onLine:true},REAL_DB_NAME:'campobase',queueFromDatabaseName:async name=>{reads++;return name==='campobase'?[]:rows;}};
  vm.createContext(scope);vm.runInContext(diagnostics+'\nglobalThis.run=getSyncDiagnostics;',scope);
  return {scope,switchAccount:()=>{account='B';},reads:()=>reads};
}
test('el diagnóstico cuenta borradores bloqueados por separado sin devolver sus registros',async()=>{
  const e=environment({rows:[{id:'allowed',payload:{private:'not exposed'}},{id:'denied',blockedAt:1,payload:{private:'not exposed'}}]});
  const info=await e.scope.run();assert.equal(info.pending,2);assert.equal(info.blocked,1);assert.equal(info.retryable,1);assert.equal(info.demo,false);
  assert.equal(JSON.stringify(info).includes('not exposed'),false);assert.equal(JSON.stringify(info).includes('denied'),false);
});
test('una demo no consulta las colas de ninguna cuenta real',async()=>{
  const e=environment({demo:true,rows:[{id:'real-user'}]});const info=await e.scope.run();
  assert.equal(e.reads(),0);assert.equal(info.demo,true);assert.equal(info.boundUserId,'');assert.equal(info.pending,0);assert.equal(info.blocked,0);assert.equal(info.retryable,0);
});
test('un diagnóstico retenido de A se rechaza si la cuenta pasa a B',async()=>{
  const e=environment();let release;const held=new Promise(resolve=>release=resolve);
  e.scope.queueFromDatabaseName=()=>held;
  const pending=e.scope.run();e.switchAccount();release([{id:'private-A'}]);
  await assert.rejects(pending,error=>error.code==='CAMPOBASE_CONTEXT_CHANGED');
});
test('el cambio de cuenta durante la lectura legacy tampoco entrega el resultado anterior',async()=>{
  const e=environment();let release,started;const held=new Promise(resolve=>release=resolve),ready=new Promise(resolve=>started=resolve);
  e.scope.queueFromDatabaseName=async name=>{if(name==='campobase'){started();return held;}return [];};
  const pending=e.scope.run();await ready;e.switchAccount();release([{id:'private-legacy'}]);
  await assert.rejects(pending,error=>error.code==='CAMPOBASE_CONTEXT_CHANGED');
});
