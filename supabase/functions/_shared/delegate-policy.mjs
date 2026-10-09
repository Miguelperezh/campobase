export const TABLES = Object.freeze({players:'jugadores',callups:'convocatorias',matches:'partidos',trainings:'asistencias',settings:'configuracion'});
const matchViews=['partido','delegado','convocatorias','preparacion','calendario','hoy','modo-campo'];
const trainingViews=['sesiones','asistencia','hoy','modo-campo'];
export const can = (permissions, views) => views.some(v => permissions.includes(v));
export function canReadStore(store, permissions) {
 if(store==='settings')return true;
 if(store==='players')return can(permissions,['plantilla','asistencia',...matchViews]);
 if(store==='matches'||store==='callups')return can(permissions,matchViews);
 if(store==='trainings')return can(permissions,trainingViews);
 return false;
}
export function readableSetting(row, permissions) {
 if(row.id==='main')return true;
 if(row.id==='live')return can(permissions,['partido','delegado']);
 if(row.recordType==='preparacion')return can(permissions,['preparacion','partido','delegado','convocatorias']);
 if(['exercise','exerciseVideo'].includes(row.recordType))return can(permissions,['ejercicios','sesiones','modo-campo']);
 if(row.recordType==='trainingSession')return can(permissions,trainingViews);
 if(row.recordType==='staffMember')return permissions.includes('cuerpo-tecnico');
 if(row.recordType==='tactic')return can(permissions,['tacticas','preparacion','partido','delegado']);
 return false;
}
export function projectRecord(store, row, permissions) {
 const result=structuredClone(row);
 if(store==='settings'&&row.id==='main') {
  for(const key of ['pinSalt','ownerPinHash','delegatePinHash','delegatePin','demoPinHash','demoPinSalt','staff','staffPins','saasUserId'])delete result[key];
  result.delegatePermissions=[...permissions];
 }
 if(store==='players'&&!permissions.includes('plantilla')) {
  for(const key of ['fatherName','fatherPhone','motherName','motherPhone','notes'])delete result[key];
 }
 return result;
}
export function canWriteMutation(mutation, permissions) {
 if(mutation.operation==='delete')return false;
 if(mutation.store==='settings')return mutation.recordId==='live'&&mutation.payload?.id==='live'&&can(permissions,['partido','delegado']);
 return mutation.store==='trainings'&&permissions.includes('asistencia')&&mutation.payload?.id===mutation.recordId;
}
export async function pinFingerprint(settings) {
 const input=String(settings.pinSalt||'')+':'+String(settings.delegatePinHash||settings.delegatePin||'');
 const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(input));
 return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
