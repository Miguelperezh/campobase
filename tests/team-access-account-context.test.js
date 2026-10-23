import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {browserCacheContext,readViewCache,writeViewCache,sameViewAccount} from '../js/account-view-context.js';
const source=readFileSync(new URL('../js/team-access.js',import.meta.url),'utf8').replace(/^import .*;\n/,'').replaceAll('export ','');
function harness() {
 const records=new Map([['campobase.saasUserId','A']]);
 const localStorage={getItem:key=>records.get(key)??null,setItem:(key,value)=>records.set(key,String(value))};
 const sessionStorage={getItem:()=>null};
 const context=vm.createContext({localStorage,sessionStorage,browserCacheContext:()=>browserCacheContext(localStorage,sessionStorage),readViewCache,writeViewCache,sameViewAccount,console:{warn(){}}});
 vm.runInContext(source,context);return {context,localStorage,records};
}
test('a retained delegate RPC cannot write account A metadata into B cache',async()=>{
 for(const operation of ['fetchDelegateAccount','fetchTeamContext','saveDelegatePermissions','inviteDelegateAccount']) {
  const {context,localStorage,records}=harness();let release;
  const held=new Promise(resolve=>{release=resolve;});
  const client={rpc:()=>held,functions:{invoke:()=>held}};
  const pending=operation==='saveDelegatePermissions'?context[operation](client,['plantilla']):operation==='inviteDelegateAccount'?context[operation](client,{email:'synthetic@example.test'}):context[operation](client);
  localStorage.setItem('campobase.saasUserId','B');
  release({data:{success:true,user_id:'delegate-A',membership_role:'owner',view_permissions:['plantilla'],delegate:{user_id:'delegate-A'}}});
  await assert.rejects(pending,/cuenta ha cambiado/);
  assert.equal([...records.keys()].some(key=>key.startsWith('campobase.delegate')),false,operation);
 }
});

test('permission writes send the opening actor to the guarded RPC and cannot fall back after server identity rejection',async()=>{
 for(const code of ['28000','42501']) {
  const {context,records}=harness();let called;
  const client={rpc:async(name,args)=>{called={name,args};return {error:{code,message:'La cuenta ha cambiado.'}};}};
  await assert.rejects(context.saveDelegatePermissions(client,['plantilla']),error=>error.code===code);
  assert.equal(called.name,'set_delegate_permissions_v2');
  assert.equal(called.args.p_expected_user_id,'A');
  assert.deepEqual(Array.from(called.args.p_permissions),['plantilla']);
  assert.equal([...records.keys()].some(key=>key.startsWith('campobase.delegate')),false);
 }
});

test('invitation carries its opening actor while an SDK token wait changes the signed-in account',async()=>{
 const {context,localStorage,records}=harness();let release,body;
 const held=new Promise(resolve=>{release=resolve;});
 const client={functions:{invoke:async(name,options)=>{assert.equal(name,'invite-delegate');body=options.body;await held;return {error:{message:'La cuenta ha cambiado.'}};}}};
 const pending=context.inviteDelegateAccount(client,{email:'synthetic@example.test'});
 assert.equal(body.expectedUserId,'A');
 localStorage.setItem('campobase.saasUserId','B');release();
 await assert.rejects(pending,/cuenta ha cambiado/);
 assert.equal([...records.keys()].some(key=>key.startsWith('campobase.delegate')),false);
});

test('an unbound client cannot send invitations or change remote permissions',async()=>{
 const {context,localStorage}=harness();localStorage.setItem('campobase.saasUserId','');let calls=0;
 const client={rpc:async()=>{calls++;},functions:{invoke:async()=>{calls++;}}};
 await assert.rejects(context.saveDelegatePermissions(client,['plantilla']),/Inicia sesión/);
 await assert.rejects(context.inviteDelegateAccount(client,{email:'synthetic@example.test'}),/Inicia sesión/);
 assert.equal(calls,0);
});

test('new permission wrapper checks the signed-in actor before using the unchanged owner-only RPC',()=>{
 const sql=readFileSync(new URL('../supabase/pilot-delegate-management.sql',import.meta.url),'utf8');
 assert.match(sql,/security invoker/i);
 assert.match(sql,/auth\.uid\(\) is null or p_expected_user_id is null/);
 assert.match(sql,/auth\.uid\(\)<>p_expected_user_id/);
 assert.ok(sql.indexOf("errcode='28000'")<sql.indexOf('return public.set_delegate_permissions(p_permissions)'));
 assert.match(sql,/revoke all[^;]+from public,anon,authenticated,service_role;/);
 assert.match(sql,/grant execute[^;]+to authenticated;/);
 assert.doesNotMatch(sql,/\b(update|delete|insert)\s+(public\.|into|from)/i);
});
