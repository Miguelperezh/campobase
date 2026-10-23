import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const tables={players:'jugadores',matches:'partidos',callups:'convocatorias',trainings:'asistencias',settings:'configuracion'};
const deferred=()=>{let resolve;const promise=new Promise(done=>resolve=done);return {promise,resolve};};
async function harness({delegate=false}={}) {
 const source=await readFile(new URL('../js/supabase-client.js',import.meta.url),'utf8');
 // Execute the actual adapter while leaving unrelated UI bootstrappers outside
 // this isolated test. All Auth, data and Storage transports below are fakes.
 const importsRemoved=source.replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
 const start=importsRemoved.indexOf('  if (initializeUi) {');
 const end=importsRemoved.indexOf('  return {\n    subscribeToChanges,',start);
 const executable=importsRemoved.slice(0,start)+importsRemoved.slice(end);
 const state={bound:'actor-A',revision:1,user:{id:'actor-A',app_metadata:{}},rpcGate:null,readGate:null,sessionGate:null,sessionCalls:0,edgeGate:null,writeGate:null,uploadGate:null,removeGate:null,ownerGate:null,sdkTokenGate:null,
  contexts:{'actor-A':{team_id:'team-A',data_owner_user_id:delegate?'owner-A':'actor-A',membership_role:delegate?'delegate':'coach'},'actor-B':{team_id:'team-B',data_owner_user_id:delegate?'owner-B':'actor-B',membership_role:delegate?'delegate':'coach'}},
  reads:[],writes:[],rpcCalls:[],serverRows:new Map(),edge:[],uploads:[],removals:[]};
 const client={auth:{getSession:async()=>{
   state.sessionCalls++;
   return state.sessionGate?state.sessionGate(state.sessionCalls):{data:{session:state.user?{user:structuredClone(state.user)}:null}};
  }},
  rpc:async(name,args)=>{
   if(name==='mi_equipo_contexto')return state.rpcGate?state.rpcGate():({data:structuredClone(state.contexts[state.user?.id])});
   assert.equal(name,'owner_sync_upsert');
   if(state.sdkTokenGate)await state.sdkTokenGate();
   const actor=state.user.id,key=[actor,args.p_store,args.p_record_id].join(':');
   state.rpcCalls.push({name,args:structuredClone(args),actor});
   if(args.p_expected_user_id!==actor)return {error:{code:'28000',message:'Owner identity changed'}};
   if(state.writeGate)return state.writeGate();
   if(state.ownerGate)await state.ownerGate(args);
   const existing=state.serverRows.get(key);
   if(existing&&existing.updated_at>args.p_updated)return {data:false};
   let payload=args.p_deleted?null:structuredClone(args.p_payload);
   if(args.p_store==='players'&&payload&&existing?.payload&&Number(existing.payload.profileUpdatedAt||0)>=Number(payload.profileUpdatedAt||0)){
    for(const field of ['name','number','positions','foot','notes','fatherName','fatherPhone','motherName','motherPhone','photo','createdAt','profileUpdatedAt']){
     if(Object.hasOwn(existing.payload,field))payload[field]=structuredClone(existing.payload[field]);else delete payload[field];
    }
   }
   const record={user_id:actor,id:args.p_record_id,payload,updated_at:args.p_updated,deleted_at:args.p_deleted?args.p_updated:null};
   state.writes.push({actor,table:tables[args.p_store],record});state.serverRows.set(key,record);
   return {data:true};
  },
  from:table=>{
   const filters=[];
   const query={select(){return query;},eq(key,value){filters.push([key,value]);return query;},limit(){return query;},is(){return query;},
    then(resolve,reject){state.reads.push({table,filters});return Promise.resolve(state.readGate?state.readGate(table):{data:[]}).then(resolve,reject);},
    upsert(record){state.writes.push({actor:state.user.id,table,record:structuredClone(record)});return state.writeGate?state.writeGate():Promise.resolve({data:null});}};
   return query;
  },
  functions:{invoke:async(name,{body})=>{
   state.edge.push({name,body:structuredClone(body),actor:state.user.id});
   if(state.edgeGate)return state.edgeGate();
   const snapshots=Object.fromEntries(Object.keys(tables).map(store=>[store,{records:[{id:store+'-'+state.user.id}],deletedIds:[],rowCount:1,readOnlyMirror:true,permissions:['partido']}]));
   return {data:body.operation==='snapshots'?{snapshots}:body.operation==='check'?{shouldApply:true}:{applied:true}};
  }},
  storage:{from:()=>({upload:async(path)=>{state.uploads.push(path);return state.uploadGate?state.uploadGate(path):{data:{path}};},remove:async paths=>{state.removals.push(paths);return state.removeGate?state.removeGate(paths):{data:paths};}})},
  removeChannel:async()=>{},channel:()=>({on(){return this;},subscribe(){}})};
 const context=vm.createContext({console,Date,Promise,Map,WeakMap,Object,JSON,Number,Error,structuredClone,AbortSignal,
  CLOUD_TABLES:tables,getBoundSaasUserId:()=>state.bound,setBoundSaasUserId:id=>state.bound=id,getPinAccessRevision:()=>state.revision,
  supabase:{createClient:()=>client}});
 vm.runInContext(executable,context);
 const store=context.createCampoBaseCloudStore();
 const expected=()=>({expectedContext:{userId:state.bound,database:'campobase_'+state.bound,pinRevision:state.revision}});
 const switchAccount=()=>{state.bound='actor-B';state.user={id:'actor-B',app_metadata:{}};state.revision++;};
 return {state,store,expected,switchAccount};
}
const mutation={store:'matches',operation:'upsert',recordId:'match-A',payload:{id:'match-A',source:'A'},queuedAt:100};

test('un lote de A nunca se escribe en B después de esperar al contexto RPC',async()=>{
 const {state,store,expected,switchAccount}=await harness();
 const reached=deferred(),hold=deferred();
 state.rpcGate=()=>{reached.resolve();return hold.promise;};
 const result=store.upsert(mutation,expected());
 await reached.promise;switchAccount();hold.resolve({data:state.contexts['actor-A']});
 await assert.rejects(result,error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
 assert.equal(state.writes.length,0);assert.equal(state.edge.length,0);
});

test('cambio de cuenta durante lectura de perfil aborta upsert y no mezcla teléfonos o jugador',async()=>{
 const {state,store,expected,switchAccount}=await harness();
 const reached=deferred(),hold=deferred();
 state.readGate=()=>{reached.resolve();return hold.promise;};
 const result=store.upsert({...mutation,store:'players',payload:{id:'match-A',fatherPhone:'Dato de A'}},expected());
 await reached.promise;switchAccount();hold.resolve({data:[{payload:{id:'match-A',fatherPhone:'Otro dato de A'}}]});
 await assert.rejects(result,error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
 assert.equal(state.writes.length,0);
});

test('snapshot retenido no se entrega a la nueva cuenta y un cambio de PIN cancela el lote',async()=>{
 for(const change of ['account','pin']){
  const {state,store,expected,switchAccount}=await harness();
  const reached=deferred(),hold=deferred();
  state.readGate=()=>{reached.resolve();return hold.promise;};
  const result=store.getSnapshot('players',expected());
  await reached.promise;if(change==='account')switchAccount();else state.revision++;
  hold.resolve({data:[{id:'private-A',payload:{id:'private-A'}}]});
  await assert.rejects(result,error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
  assert.equal(state.writes.length,0);
 }
});

test('contexto inexistente o erróneo bloquea la nube sin usar user.id como propietario alternativo',async()=>{
 for(const data of [null,{team_id:'team-A',membership_role:'coach'}]){
  const {state,store,expected}=await harness();
  state.rpcGate=async()=>({data,error:data?null:{message:'Contexto no disponible'}});
  await assert.rejects(store.upsert(mutation,expected()),error=>error.code==='CAMPOBASE_CONTEXT_UNAVAILABLE');
  assert.equal(state.writes.length,0);assert.equal(state.reads.length,0);
 }
});

test('sesión expirada o contexto esperado de otro owner/equipo no autoriza lecturas ni escrituras',async()=>{
 const expired=await harness();expired.state.user=null;
 await assert.rejects(expired.store.getSnapshot('players',expired.expected()),error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
 for(const mismatch of [{ownerUserId:'owner-B'},{teamId:'team-B'}]){
  const {state,store,expected}=await harness();const options=expected();Object.assign(options.expectedContext,mismatch);
  await assert.rejects(store.remove({...mutation,operation:'delete'},options),error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
  assert.equal(state.writes.length,0);assert.equal(state.reads.length,0);
 }
});

test('delegado por correo usa Edge y caché aislada, nunca REST de propietario o snapshots de otro equipo',async()=>{
 const {state,store,expected,switchAccount}=await harness({delegate:true});
 const a=await store.getSnapshot('players',expected());
 assert.equal(a.records[0].id,'players-actor-A');
 await store.upsert({...mutation,store:'settings',recordId:'live',payload:{id:'live',timer:{matchId:'match-A'}}},expected());
 assert.equal(state.reads.length,0);assert.equal(state.writes.length,0);
 assert.ok(state.edge.every(call=>call.body.expectedUserId==='actor-A'&&call.body.expectedOwnerUserId==='owner-A'));
 switchAccount();
 const b=await store.getSnapshot('matches',expected());
 assert.equal(b.records[0].id,'matches-actor-B');
 assert.equal(state.edge.at(-1).body.expectedOwnerUserId,'owner-B');
});

test('nueva subida usa prefijo del usuario y devuelve ruta guardable; delegado correo no sube vídeos',async()=>{
 const owner=await harness();
 const first=await owner.store.uploadVideo('exercise/video.mp4',{type:'video/mp4'});
 assert.equal(first.path,'actor-A/exercise/video.mp4');
 const second=await owner.store.uploadVideo(first.path,{type:'video/mp4'});
 assert.equal(second.path,first.path);assert.equal(owner.state.uploads.length,2);
 await assert.rejects(owner.store.uploadVideo('../foreign.mp4',{type:'video/mp4'}),/ruta/);
 const delegate=await harness({delegate:true});
 await assert.rejects(delegate.store.uploadVideo('exercise/video.mp4',{type:'video/mp4'}),/entrenador/);
 assert.equal(delegate.state.uploads.length,0);
});

test('esperar getSession no restaura un enlace antiguo ni acepta una base ajena',async()=>{
 const account=await harness();account.state.bound='';
 const reached=deferred(),hold=deferred();
 account.state.sessionGate=()=>{reached.resolve();return hold.promise;};
 const result=account.store.prepare();
 await reached.promise;account.state.revision++;
 hold.resolve({data:{session:{user:{id:'actor-A',app_metadata:{}}}}});
 await assert.rejects(result,error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
 assert.equal(account.state.bound,'');
 const other=await harness();const options=other.expected();options.expectedContext.database='campobase_actor-B';
 await assert.rejects(other.store.upsert(mutation,options),error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
 assert.equal(other.state.sessionCalls,0);assert.equal(other.state.writes.length,0);
});

test('el contexto esperado se captura por valor y una sesión distinta sin cambio de enlace no puede escribir',async()=>{
 const {state,store,expected}=await harness();
 const reached=deferred(),hold=deferred(),options=expected();
 state.sessionGate=call=>{
  if(call===3){reached.resolve();return hold.promise;}
  return {data:{session:{user:structuredClone(state.user)}}};
 };
 const result=store.upsert(mutation,options);
 await reached.promise;
 options.expectedContext.userId='actor-B';options.expectedContext.pinRevision=2;
 state.user={id:'actor-B',app_metadata:{}};
 hold.resolve({data:{session:{user:state.user}}});
 await assert.rejects(result,error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
 assert.equal(state.writes.length,0);
});

test('respuestas tardías de Edge, escritura y Storage no se confirman en una cuenta posterior',async()=>{
 for(const kind of ['edge','write','upload','remove']){
  const {state,store,expected,switchAccount}=await harness({delegate:kind==='edge'});
  const reached=deferred(),hold=deferred();
  state[kind+'Gate']=()=>{reached.resolve();return hold.promise;};
  const result=kind==='edge'?store.getSnapshot('settings',expected()):kind==='write'?store.upsert(mutation,expected()):kind==='upload'?store.uploadVideo('exercise/video.mp4',{type:'video/mp4'},expected()):store.removeVideo('actor-A/exercise/video.mp4',expected());
  await reached.promise;switchAccount();
  hold.resolve({data:kind==='edge'?{snapshots:{settings:{records:[{id:'private-A'}]}}}:kind==='upload'?{path:'actor-A/exercise/video.mp4'}:null});
  await assert.rejects(result,error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
  assert.equal(state.writes.some(write=>write.actor==='actor-B'),false);
 }
});

test('un cambio de sesión durante lectura sin cambiar enlace local tampoco devuelve datos antiguos',async()=>{
 const {state,store,expected}=await harness();
 const reached=deferred(),hold=deferred();
 state.readGate=()=>{reached.resolve();return hold.promise;};
 const result=store.getSnapshot('players',expected());
 await reached.promise;state.user={id:'actor-B',app_metadata:{}};
 hold.resolve({data:[{id:'private-A',payload:{id:'private-A'}}]});
 await assert.rejects(result,error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
});

test('RPC lanzado o rol no autorizado bloquea sin fallback y borrar vídeo exige ruta propia',async()=>{
 for(const role of ['throw','other']){
  const {state,store,expected}=await harness();
  if(role==='throw')state.rpcGate=()=>{throw Error('offline');};
  else state.contexts['actor-A'].membership_role='viewer';
  await assert.rejects(store.remove({...mutation,operation:'delete'},expected()),error=>error.code==='CAMPOBASE_CONTEXT_UNAVAILABLE');
  assert.equal(state.reads.length,0);assert.equal(state.writes.length,0);
 }
 const {state,store}=await harness();
 for(const path of ['owner-B/video.mp4','legacy/video.mp4','actor-A/../video.mp4','actor-A/','actor-A/\\bad.mp4'])await assert.rejects(store.removeVideo(path),/propios/);
 assert.equal(state.removals.length,0);
 await store.removeVideo('actor-A/exercise/video.mp4');
 assert.equal(state.removals.length,1);
 const delegate=await harness({delegate:true});
 await assert.rejects(delegate.store.removeVideo('actor-A/video.mp4'),/entrenador/);
 assert.equal(delegate.state.removals.length,0);
});

test('owner envía una mutación atómica sin owner editable y una versión posterior no se pisa ni se borra',async()=>{
 for(const deleting of [false,true]){
  const {state,store,expected}=await harness();
  const reached=deferred(),hold=deferred();
  state.ownerGate=()=>{reached.resolve();return hold.promise;};
  const result=deleting?store.remove({...mutation,operation:'delete'},expected()):store.upsert(mutation,expected());
  await reached.promise;
  const current={user_id:'actor-A',id:'match-A',payload:{id:'match-A',score:4},updated_at:200,deleted_at:null};
  state.serverRows.set('actor-A:matches:match-A',structuredClone(current));hold.resolve();
  assert.equal((await result).applied,false);
  assert.deepEqual(state.serverRows.get('actor-A:matches:match-A'),current);
  assert.equal(state.writes.length,0);
  const {args}=state.rpcCalls[0];
  assert.equal(args.p_store,'matches');assert.equal(args.p_record_id,'match-A');assert.equal(args.p_updated,100);assert.equal(args.p_deleted,deleting);
  assert.equal(args.p_expected_user_id,'actor-A');
  assert.equal(args.p_owner,undefined);assert.equal(args.user_id,undefined);
 }
});

test('un perfil actualizado mientras se prepara el RPC sobrevive junto a estadísticas entrantes',async()=>{
 const {state,store,expected}=await harness();
 state.readGate=async()=>({data:[{payload:{id:'p',name:'Perfil anterior',fatherPhone:'Anterior',profileUpdatedAt:10}}]});
 const reached=deferred(),hold=deferred();
 state.ownerGate=()=>{reached.resolve();return hold.promise;};
 const pending=store.upsert({...mutation,store:'players',recordId:'p',queuedAt:300,payload:{id:'p',name:'Nombre viejo',fatherPhone:'Viejo',motherPhone:'Campo retirado',profileUpdatedAt:5,goals:3}},expected());
 await reached.promise;
 state.serverRows.set('actor-A:players:p',{user_id:'actor-A',id:'p',payload:{id:'p',name:'Perfil actualizado',fatherPhone:'Actualizado',profileUpdatedAt:20,goals:1},updated_at:200,deleted_at:null});
 hold.resolve();assert.equal((await pending).applied,true);
 const saved=state.serverRows.get('actor-A:players:p');
 assert.equal(saved.payload.name,'Perfil actualizado');assert.equal(saved.payload.fatherPhone,'Actualizado');assert.equal(saved.payload.profileUpdatedAt,20);
 assert.equal(saved.payload.motherPhone,undefined);assert.equal(saved.payload.goals,3);
 assert.equal(state.rpcCalls[0].args.p_payload.fatherPhone,'Anterior');
});

test('si el SDK cambia a JWT B antes de enviar el RPC de A, la identidad esperada lo bloquea en servidor',async()=>{
 const {state,store,expected}=await harness();
 const reached=deferred(),hold=deferred();
 state.sdkTokenGate=()=>{reached.resolve();return hold.promise;};
 const pending=store.upsert(mutation,expected());
 await reached.promise;state.user={id:'actor-B',app_metadata:{}};hold.resolve();
 await assert.rejects(pending,error=>error.code==='CAMPOBASE_AUTH_REQUIRED');
 assert.equal(state.rpcCalls[0].actor,'actor-B');
 assert.equal(state.rpcCalls[0].args.p_expected_user_id,'actor-A');
 assert.equal(state.writes.length,0);assert.equal(state.serverRows.size,0);
});

test('el RPC SQL owner conserva RLS, whitelist, comparación de versión y perfil dentro del UPSERT',async()=>{
 const sql=await readFile(new URL('../supabase/pilot-owner-atomic.sql',import.meta.url),'utf8');
 assert.match(sql,/security invoker/i);assert.match(sql,/v_actor uuid:=auth\.uid\(\)/);
 assert.match(sql,/p_expected_user_id is null or v_actor<>p_expected_user_id/);
 assert.match(sql,/campobase_private\.is_delegate_actor\(\)/);
 assert.match(sql,/when 'players' then 'jugadores'/);assert.match(sql,/when 'settings' then 'configuracion'/);
 assert.match(sql,/on conflict\(user_id,id\) do update set payload=%s/);
 assert.match(sql,/where current_row\.updated_at<=excluded\.updated_at/);
 assert.match(sql,/current_row\.payload->>'profileUpdatedAt'/);
 assert.match(sql,/jsonb_each\(coalesce\(current_row\.payload/);
 assert.match(sql,/using v_actor,p_record_id/);
 assert.match(sql,/revoke all on function[^;]+from public,anon,authenticated,service_role/i);
 assert.match(sql,/grant execute on function[^;]+to authenticated/i);
});
