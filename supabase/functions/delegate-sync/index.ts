import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "npm:@supabase/supabase-js@2.57.4";
import {TABLES,canReadStore,readableSetting,projectRecord,canWriteMutation,pinFingerprint} from '../_shared/delegate-policy.mjs';
const cors={'Access-Control-Allow-Origin':'https://miguelperezh.github.io','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 if(req.method!=='POST')return json({message:'Método no permitido.'},405);
 if(req.headers.get('Origin')&&req.headers.get('Origin')!==cors['Access-Control-Allow-Origin'])return json({message:'Origen no permitido.'},403);
 try {
  const token=(req.headers.get('Authorization')||'').replace(/^Bearer /i,'');
  const admin=createClient(Deno.env.get('SUPABASE_URL'),Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false}});
  const {data:identity,error:authError}=await admin.auth.getUser(token);
  const user=identity?.user;
  if(authError||!user||user.app_metadata?.campobase_role!=='delegate_pin')return json({message:'Sesión de delegado no válida.'},401);
  const owner=user.app_metadata.campobase_owner_id;
  const {data:member,error:memberError}=await admin.from('equipo_miembros').select('equipo_id,role').eq('user_id',user.id).eq('role','delegate').maybeSingle();
  const {data:team}=member?await admin.from('equipos_cuenta').select('owner_user_id').eq('id',member.equipo_id).maybeSingle():{data:null};
  if(memberError||!member||team?.owner_user_id!==owner)return json({message:'Acceso al equipo retirado.'},403);
  const {data:main,error:mainError}=await admin.from('configuracion').select('payload').eq('user_id',owner).eq('id','main').is('deleted_at',null).maybeSingle();
  if(mainError||!main?.payload)return json({message:'No se pudieron comprobar los permisos.'},503);
  const jwt=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0))));
  if(jwt.app_metadata?.campobase_pin_version!==await pinFingerprint(main.payload))return json({message:'El PIN ha cambiado. Vuelve a entrar.'},401);
  const permissions=Array.isArray(main.payload.delegatePermissions)?main.payload.delegatePermissions:[];
  const {data:subscription,error:subscriptionError}=await admin.from('suscripciones').select('estado,expira_en').eq('user_id',owner).maybeSingle();
  if(subscriptionError)return json({message:'No se pudo comprobar el acceso del equipo.'},503);
  if(!subscription||!['gift_free','trial','active'].includes(subscription.estado)||(subscription.expira_en&&Date.parse(subscription.expira_en)<=Date.now()))return json({message:'El equipo no tiene acceso activo.'},403);
  const body=await req.json(),store=body.store,table=TABLES[store];
  const snapshot = async (name) => {
   if(!canReadStore(name,permissions))return {records:[],deletedIds:[],rowCount:0,restricted:true,permissions};
   const {data:rows,error}=await admin.from(TABLES[name]).select('id,payload,updated_at,deleted_at').eq('user_id',owner);
   if(error)throw error;
   const visible=(rows||[]).filter(r=>name!=='settings'||readableSetting(r.payload||{id:r.id},permissions));
   return {records:visible.filter(r=>!r.deleted_at).map(r=>projectRecord(name,r.payload,permissions)),deletedIds:visible.filter(r=>r.deleted_at).map(r=>r.id),rowCount:visible.length,readOnlyMirror:true,permissions};
  };
  if(body.operation==='snapshots')return json({snapshots:Object.fromEntries(await Promise.all(Object.keys(TABLES).map(async name=>[name,await snapshot(name)])))});
  if(!table)return json({message:'Almacén no válido.'},400);
  if(body.operation==='snapshot')return json(await snapshot(store));
  const mutation=body.mutation;
  if(mutation&&(!Number.isSafeInteger(mutation.queuedAt)||mutation.queuedAt<0||mutation.queuedAt>Date.now()+60000||typeof mutation.recordId!=='string'||mutation.recordId.length>250))return json({message:'Cambio no válido.'},400);
  if(!mutation||mutation.store!==store||!canWriteMutation(mutation,permissions))return json({message:'Esta operación no está permitida al delegado.',code:'CAMPOBASE_PERMISSION_REVOKED'},403);
  const {data:existing,error:readError}=await admin.from(table).select('updated_at,payload,deleted_at').eq('user_id',owner).eq('id',mutation.recordId).maybeSingle();
  if(readError)throw readError;
  const fresh=!existing||Number(mutation.queuedAt)>=Number(existing.updated_at||existing.deleted_at||0);
  if(body.operation==='check')return json({shouldApply:fresh});
  if(body.operation!=='upsert')return json({message:'Operación no válida.'},400);
  if(!fresh)return json({applied:false});
  if(store==='settings') {
   const matchId=mutation.payload?.timer?.matchId;
   if(!existing||!matchId||existing.payload?.timer?.matchId!==matchId)return json({message:'El entrenador debe activar este partido.',code:'CAMPOBASE_PERMISSION_REVOKED'},403);
  }
  const {data:applied,error}=await admin.rpc('delegate_sync_upsert',{p_owner:owner,p_store:store,p_record_id:mutation.recordId,p_payload:mutation.payload,p_updated:mutation.queuedAt});
  if(error)throw error;
  return json({applied:Boolean(applied)});
 }catch(error){console.error('delegate-sync:',error?.message);return json({message:'No se pudo sincronizar. Conserva tu copia local y vuelve a actualizar.'},503);}
});
