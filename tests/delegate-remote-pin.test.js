import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {TABLES,canReadStore,readableSetting,projectRecord,canWriteMutation,pinFingerprint} from '../supabase/functions/_shared/delegate-policy.mjs';

const config={id:'main',pinSalt:'test-salt',ownerPinHash:'private-owner',delegatePinHash:'private-delegate',delegatePermissions:['partido'],theme:{primary:'#123456'}};
async function harness() {
 const rows={configuracion:[{id:'main',user_id:'owner',payload:structuredClone(config)},{id:'live',user_id:'owner',updated_at:1,payload:{id:'live',timer:{matchId:'match',elapsed:0}}}],equipo_miembros:[{user_id:'delegate',equipo_id:'team',role:'delegate'}],equipos_cuenta:[{id:'team',owner_user_id:'owner'}],suscripciones:[{user_id:'owner',estado:'active',expira_en:null}],jugadores:[{user_id:'owner',id:'p',payload:{id:'p',name:'Player',fatherPhone:'private'}}],partidos:[],convocatorias:[],asistencias:[]};
 const user={id:'delegate',app_metadata:{campobase_role:'delegate_pin',campobase_owner_id:'owner'}};
 const jwt={app_metadata:{campobase_pin_version:await pinFingerprint(config)}};
 const token='header.'+Buffer.from(JSON.stringify(jwt)).toString('base64url')+'.signed';
 function query(table){let filters=[];const q={select(){return q},eq(key,value){filters.push(r=>r[key]===value);return q},is(key,value){filters.push(r=>(r[key]??null)===value);return q},maybeSingle(){return Promise.resolve({data:(rows[table]||[]).filter(r=>filters.every(f=>f(r)))[0]||null})},then(resolve){return Promise.resolve({data:(rows[table]||[]).filter(r=>filters.every(f=>f(r)))}).then(resolve)},upsert(row){const list=rows[table] ||= [];const i=list.findIndex(r=>r.id===row.id&&r.user_id===row.user_id);if(i<0)list.push(row);else list[i]=row;return Promise.resolve({error:null})}};return q}
 let handler;const source=(await readFile(new URL('../supabase/functions/delegate-sync/index.ts',import.meta.url),'utf8')).replace(/^import .*;\n/gm,'');
 vm.runInNewContext(source,{Deno:{serve:h=>handler=h,env:{get:()=>''}},createClient:()=>({auth:{getUser:async()=>({data:{user}})},from:query,rpc:async (name,args)=>{assert.equal(name,'delegate_sync_upsert');await query(TABLES[args.p_store]).upsert({user_id:args.p_owner,id:args.p_record_id,payload:args.p_payload,updated_at:args.p_updated,deleted_at:null});return {data:true}}}),TABLES,canReadStore,readableSetting,projectRecord,canWriteMutation,pinFingerprint,Response,TextDecoder,Uint8Array,atob,console,Date,JSON,Number});
 const request=async body=>{const response=await handler(new Request('https://app.test',{method:'POST',headers:{Authorization:'Bearer '+token},body:JSON.stringify(body)}));return {status:response.status,body:await response.json()}};
 return {rows,user,request};
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
