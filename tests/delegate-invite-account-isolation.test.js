import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function harness() {
 const state={actor:'B',adminClients:0,queries:[],invitations:[],writes:[]};let handler;
 const source=readFileSync(new URL('../supabase/functions/invite-delegate/index.ts',import.meta.url),'utf8')
  .replace(/^import .*;\n/gm,'').replaceAll(': unknown','').replace(/let body: \{[^}]+\}/,'let body');
 function query(table) {
  const filters=[];let mutation=null;
  const q={select(){return q;},eq(key,value){filters.push([key,value]);return q;},
   maybeSingle(){state.queries.push({table,filters});return Promise.resolve({data:table==='perfiles'?{role:'coach'}:table==='equipos_cuenta'?{id:'team-B',nombre:'Synthetic team',owner_user_id:'B'}:null});},
   delete(){mutation='delete';return q;},update(){mutation='update';return q;},insert(){mutation='insert';return q;},
   then(resolve,reject){state.writes.push({table,operation:mutation,filters});return Promise.resolve({error:null}).then(resolve,reject);}};
  return q;
 }
 const auth={auth:{getUser:async()=>({data:{user:{id:state.actor}}})}};
 const admin={from:query,auth:{admin:{inviteUserByEmail:async(email)=>{state.invitations.push(email);return {data:{user:{id:'synthetic-delegate'}}};},deleteUser:async()=>{throw Error('Unexpected rollback');}}}};
 vm.runInNewContext(source,{Deno:{serve:h=>handler=h,env:{get:key=>key}},createClient:(_url,key)=>{if(key==='SUPABASE_SERVICE_ROLE_KEY'){state.adminClients++;return admin;}return auth;},Response,console});
 const request=async body=>{
  const response=await handler(new Request('https://fixture.invalid',{method:'POST',headers:{Authorization:'Bearer synthetic'},body:JSON.stringify(body)}));
  return {status:response.status,body:await response.json()};
 };
 return {state,request};
}

test('opening actor A with JWT B is rejected before any privileged client or invitation',async()=>{
 for(const expectedUserId of ['A','',null]) {
  const {state,request}=harness();
  const response=await request({email:'synthetic@example.test',expectedUserId});
  assert.equal(response.status,401);assert.equal(response.body.code,'CAMPOBASE_AUTH_REQUIRED');
  assert.equal(state.adminClients,0);assert.equal(state.queries.length,0);assert.equal(state.writes.length,0);assert.equal(state.invitations.length,0);
 }
});

test('matching actor and historical clients keep the existing invitation behavior in a simulated server',async()=>{
 for(const explicitActor of [true,false]) {
  const {state,request}=harness();
  const response=await request({email:'synthetic@example.test',...(explicitActor?{expectedUserId:'B'}:{})});
  assert.equal(response.status,200);assert.equal(response.body.success,true);
  assert.deepEqual(state.invitations,['synthetic@example.test']);
  assert.ok(state.queries.some(query=>query.table==='equipos_cuenta'&&query.filters.some(([key,value])=>key==='owner_user_id'&&value==='B')));
  assert.equal(state.writes.filter(write=>write.operation==='insert'&&write.table==='equipo_miembros').length,1);
 }
});
