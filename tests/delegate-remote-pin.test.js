import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {TABLES,canReadStore,readableSetting,projectRecord,canWriteMutation,pinFingerprint} from '../supabase/functions/_shared/delegate-policy.mjs';

const config={id:'main',pinSalt:'test-salt',ownerPinHash:'private-owner',delegatePinHash:'private-delegate',delegatePermissions:['partido'],theme:{primary:'#123456'}};
async function harness({emailDelegate=false}={}) {
 const rows={configuracion:[{id:'main',user_id:'owner',payload:structuredClone(config)},{id:'live',user_id:'owner',updated_at:1,payload:{id:'live',timer:{matchId:'match',elapsed:0}}}],equipo_miembros:[{user_id:'delegate',equipo_id:'team',role:'delegate'}],equipos_cuenta:[{id:'team',owner_user_id:'owner'}],suscripciones:[{user_id:'owner',estado:'active',expira_en:null}],jugadores:[{user_id:'owner',id:'p',payload:{id:'p',name:'Player',fatherPhone:'private'}}],partidos:[],convocatorias:[],asistencias:[]};
 const user={id:'delegate',app_metadata:emailDelegate?{}:{campobase_role:'delegate_pin',campobase_owner_id:'owner'}};
 const jwt={app_metadata:{...user.app_metadata,campobase_pin_version:await pinFingerprint(config)}};
 const token='header.'+Buffer.from(JSON.stringify(jwt)).toString('base64url')+'.signed';
 const state={queryGate:null,rpcError:null,rpcs:[]};
 function query(table){let filters=[];const resolveResult=()=>({data:(rows[table]||[]).filter(r=>filters.every(f=>f(r)))});const q={select(){return q},eq(key,value){filters.push(r=>r[key]===value);return q},is(key,value){filters.push(r=>(r[key]??null)===value);return q},maybeSingle(){const result={data:resolveResult().data[0]||null};return state.queryGate?state.queryGate(table,result):Promise.resolve(result)},then(resolve,reject){return Promise.resolve(state.queryGate?state.queryGate(table,resolveResult()):resolveResult()).then(resolve,reject)},upsert(row){const list=rows[table] ||= [];const i=list.findIndex(r=>r.id===row.id&&r.user_id===row.user_id);if(i<0)list.push(row);else list[i]=row;return Promise.resolve({error:null})}};return q}
 let handler;const source=(await readFile(new URL('../supabase/functions/delegate-sync/index.ts',import.meta.url),'utf8')).replace(/^import .*;\n/gm,'');
 vm.runInNewContext(source,{Deno:{serve:h=>handler=h,env:{get:()=>''}},createClient:()=>({auth:{getUser:async()=>({data:{user}})},from:query,rpc:async (name,args)=>{state.rpcs.push({name,args});assert.equal(name,'delegate_sync_upsert_v2');if(state.rpcError)return {error:state.rpcError};await query(TABLES[args.p_store]).upsert({user_id:args.p_owner,id:args.p_record_id,payload:args.p_payload,updated_at:args.p_updated,deleted_at:null});return {data:true}}}),TABLES,canReadStore,readableSetting,projectRecord,canWriteMutation,pinFingerprint,Response,TextDecoder,Uint8Array,atob,console,Date,JSON,Number});
 const request=async (body,accessToken=token)=>{const response=await handler(new Request('https://app.test',{method:'POST',headers:{Authorization:'Bearer '+accessToken},body:JSON.stringify(body)}));return {status:response.status,body:await response.json()}};
 return {rows,user,request,state,jwt};
}
test('dos sesiones del delegado escriben y leen el mismo vivo del propietario; retirar permiso bloquea nuevas escrituras',async()=>{
 const {rows,request}=await harness();
 const mutation={store:'settings',recordId:'live',operation:'upsert',queuedAt:100,payload:{id:'live',timer:{matchId:'match',elapsed:30,events:[{type:'goal'}]}}};
 assert.equal((await request({store:'settings',operation:'upsert',mutation})).status,200);
 assert.equal(rows.configuracion.find(r=>r.id==='live').payload.timer.elapsed,30);
 const snapshot=await request({store:'settings',operation:'snapshot'});
 assert.equal(snapshot.body.records.find(r=>r.id==='live').timer.elapsed,30);
 assert.equal(snapshot.body.records.find(r=>r.id==='main').ownerPinHash,undefined);
 assert.equal(snapshot.body.records.find(r=>r.id==='main').theme.primary,'#123456');
 rows.configuracion[0].payload.delegatePermissions=[];
 const denied=await request({store:'settings',operation:'upsert',mutation:{...mutation,queuedAt:101}});
 assert.equal(denied.status,403);
 assert.equal(rows.configuracion.find(r=>r.id==='live').updated_at,100);
 const revoked=await request({store:'settings',operation:'snapshot'});
 assert.deepEqual(revoked.body.permissions,[]);
 assert.equal(revoked.body.records.some(r=>r.id==='live'),false);
 rows.configuracion[0].payload.delegatePermissions=['partido'];
 assert.equal((await request({store:'settings',operation:'snapshot'})).body.records.some(r=>r.id==='live'),true);
});
test('el delegado no cambia colores ni otro equipo, ni inicia otro partido, ni usa una sesión anterior al cambio de PIN',async()=>{
 const {rows,request,user}=await harness();
 const mainBefore=JSON.stringify(rows.configuracion[0]);
 const mutation={store:'settings',recordId:'main',operation:'upsert',queuedAt:100,payload:{id:'main',theme:{primary:'red'}}};
 assert.equal((await request({store:'settings',operation:'upsert',mutation})).status,403);
 assert.equal(JSON.stringify(rows.configuracion[0]),mainBefore);
 mutation.recordId='live';mutation.payload={id:'live',timer:{matchId:'another'}};
 assert.equal((await request({store:'settings',operation:'upsert',mutation})).status,403);
 user.app_metadata.campobase_owner_id='another-owner';
 assert.equal((await request({store:'settings',operation:'snapshot'})).status,403);
 user.app_metadata.campobase_owner_id='owner';rows.configuracion[0].payload.delegatePinHash='changed';
 assert.equal((await request({store:'settings',operation:'snapshot'})).status,401);
});
test('asistencia exige su propio permiso, los datos privados de fichas y los ajustes quedan filtrados',async()=>{
 const {rows,request}=await harness();
 const mutation={store:'trainings',recordId:'attendance',operation:'upsert',queuedAt:100,payload:{id:'attendance',statuses:{p:'present'}}};
 assert.equal((await request({store:'trainings',operation:'upsert',mutation})).status,403);
 rows.configuracion[0].payload.delegatePermissions=['asistencia'];
 assert.equal((await request({store:'trainings',operation:'upsert',mutation})).status,200);
 assert.equal((await request({store:'players',operation:'snapshot'})).body.records[0].fatherPhone,undefined);
 rows.configuracion[0].payload.delegatePermissions=['plantilla'];
 assert.equal((await request({store:'players',operation:'snapshot'})).body.records[0].fatherPhone,'private');
 assert.equal(readableSetting({id:'private',recordType:'staff'},['partido']),false);
});

test('delegado invitado por correo usa los mismos permisos vigentes, filtros y límites del servidor',async()=>{
 const {rows,request}=await harness({emailDelegate:true});
 const snapshot=await request({operation:'snapshot',store:'settings',expectedUserId:'delegate',expectedOwnerUserId:'owner'});
 assert.equal(snapshot.status,200);
 assert.equal(snapshot.body.records.find(row=>row.id==='main').ownerPinHash,undefined);
 assert.equal(snapshot.body.records.find(row=>row.id==='main').theme.primary,'#123456');
 const mutation={store:'settings',recordId:'live',operation:'upsert',queuedAt:101,payload:{id:'live',timer:{matchId:'match',elapsed:40}}};
 assert.equal((await request({store:'settings',operation:'upsert',mutation})).status,200);
 const before=JSON.stringify(rows);
 assert.equal((await request({store:'players',operation:'upsert',mutation:{...mutation,store:'players',recordId:'p',payload:{id:'p',name:'No autorizado'}}})).status,403);
 assert.equal((await request({store:'settings',operation:'upsert',mutation:{...mutation,recordId:'main',payload:{id:'main',theme:{primary:'red'}}}})).status,403);
 assert.equal(JSON.stringify(rows),before);
 rows.configuracion[0].payload.delegatePermissions=[];
 assert.equal((await request({store:'settings',operation:'upsert',mutation:{...mutation,queuedAt:102}})).status,403);
 assert.equal((await request({store:'settings',operation:'snapshot'})).body.records.some(row=>row.id==='live'),false);
});

test('delegado correo no puede seleccionar otro actor o equipo ni conservar acceso tras retirar membresía',async()=>{
 const {rows,request,user}=await harness({emailDelegate:true});
 const before=JSON.stringify(rows);
 assert.equal((await request({store:'settings',operation:'snapshot',expectedUserId:'another-user'})).status,401);
 assert.equal((await request({store:'settings',operation:'snapshot',expectedOwnerUserId:'another-owner'})).status,401);
 assert.equal((await request({store:'settings',operation:'snapshot',expectedTeamId:'another-team'})).status,401);
 assert.equal(JSON.stringify(rows),before);
 rows.equipo_miembros[0].role='coach';
 user.user_metadata={account_role:'delegate',campobase_owner_id:'owner'};
 assert.equal((await request({store:'settings',operation:'snapshot'})).status,403);
});

test('RPC atómico recibe actor autenticado y huella firmada PIN; correo no usa una huella inventada',async()=>{
 for(const emailDelegate of [false,true]){
  const {request,state,jwt}=await harness({emailDelegate});
  const mutation={store:'settings',recordId:'live',operation:'upsert',queuedAt:100,payload:{id:'live',timer:{matchId:'match',elapsed:30}}};
  assert.equal((await request({store:'settings',operation:'upsert',mutation,actorUserId:'another',pinVersion:'fake'})).status,200);
  assert.equal(state.rpcs.length,1);
  assert.equal(state.rpcs[0].name,'delegate_sync_upsert_v2');
  assert.equal(state.rpcs[0].args.p_actor,'delegate');
  assert.equal(state.rpcs[0].args.p_owner,'owner');
  assert.equal(state.rpcs[0].args.p_pin_version,emailDelegate?null:jwt.app_metadata.campobase_pin_version);
 }
});

test('retirar membresía, permiso o cambiar PIN durante snapshot retiene la respuesta privada',async()=>{
 for(const change of ['membership','permissions','pin']){
  const {rows,request,state}=await harness({emailDelegate:change!=='pin'});
  let release,signal;const reached=new Promise(resolve=>signal=resolve),hold=new Promise(resolve=>release=resolve);
  state.queryGate=(table,result)=>{
   if(table==='jugadores'){signal();return hold.then(()=>result);}
   return Promise.resolve(result);
  };
  const pending=request({operation:'snapshot',store:'players'});
  await reached;
  if(change==='membership')rows.equipo_miembros.length=0;
  else if(change==='permissions')rows.configuracion[0].payload.delegatePermissions=[];
  else rows.configuracion[0].payload.delegatePinHash='replacement';
  release();const result=await pending;
  assert.equal(result.status,change==='pin'?401:403);
  assert.equal(result.body.records,undefined);
  assert.equal(state.rpcs.length,0);
 }
});

test('retirar membresía mientras se lee el vivo bloquea la escritura antes del RPC',async()=>{
 const {rows,request,state}=await harness({emailDelegate:true});
 let release,signal;const reached=new Promise(resolve=>signal=resolve),hold=new Promise(resolve=>release=resolve);
 state.queryGate=(table,result)=>{
  if(table==='configuracion'&&result.data?.id==='live'){signal();return hold.then(()=>result);}
  return Promise.resolve(result);
 };
 const mutation={store:'settings',recordId:'live',operation:'upsert',queuedAt:100,payload:{id:'live',timer:{matchId:'match',elapsed:30}}};
 const pending=request({operation:'upsert',store:'settings',mutation});
 await reached;rows.equipo_miembros[0].role='coach';release();
 assert.equal((await pending).status,403);
 assert.equal(state.rpcs.length,0);
 assert.equal(rows.configuracion.find(row=>row.id==='live').payload.timer.elapsed,0);
});

test('metadatos editables no eligen propietario y un JWT PIN de otro owner o sin huella no autoriza',async()=>{
 const email=await harness({emailDelegate:true});
 email.user.user_metadata={campobase_owner_id:'another-owner',account_role:'coach'};
 email.rows.equipo_miembros[0].view_permissions=['plantilla','partido'];
 email.rows.configuracion[0].payload.delegatePermissions=[];
 assert.equal((await email.request({operation:'snapshot',store:'players'})).body.records.length,0);
 assert.equal((await email.request({operation:'snapshot',store:'settings'})).body.records[0].id,'main');
 const pin=await harness();
 for(const metadata of [{...pin.jwt.app_metadata,campobase_owner_id:'another-owner'},{campobase_role:'delegate_pin',campobase_owner_id:'owner'}]){
  const token='header.'+Buffer.from(JSON.stringify({app_metadata:metadata})).toString('base64url')+'.signed';
  assert.equal((await pin.request({operation:'snapshot',store:'settings'},token)).status,401);
 }
 assert.equal((await pin.request({operation:'snapshot',store:'settings'},'malformed')).status,401);
});

test('revocación atómica del RPC se comunica como denegada o autenticación pendiente, nunca como guardado confirmado',async()=>{
 for(const [sqlCode,status,code] of [['42501',403,'CAMPOBASE_PERMISSION_REVOKED'],['28000',401,'CAMPOBASE_AUTH_REQUIRED']]){
  const {rows,request,state}=await harness();
  state.rpcError={code:sqlCode,message:'Access changed'};
  const before=JSON.stringify(rows);
  const mutation={store:'settings',recordId:'live',operation:'upsert',queuedAt:100,payload:{id:'live',timer:{matchId:'match',elapsed:30}}};
  const result=await request({operation:'upsert',store:'settings',mutation});
  assert.equal(result.status,status);assert.equal(result.body.code,code);
  assert.equal(result.body.applied,undefined);assert.equal(JSON.stringify(rows),before);
 }
});
