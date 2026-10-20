import test from 'node:test';
import assert from 'node:assert/strict';
import {sessionAttendanceToDelete} from '../js/training-session-delete.js';
const session={id:'s',date:'2026-10-19'};
const records=[{id:'exact',sessionId:'s',kind:'training',date:'2026-10-18'},{id:'other',sessionId:'other',kind:'training',date:'2026-10-19'},{id:'legacy',kind:'training',date:'2026-10-19T17:30:00'},{id:'match',kind:'match',date:'2026-10-19'},{id:'match-without-kind',matchId:'m',date:'2026-10-19'},{id:'another-date',kind:'training',date:'2026-10-20'}];
test('solo elimina asistencia exacta y legado inequívoco de la sesión, conserva partidos y otras sesiones',()=>{
 assert.deepEqual(sessionAttendanceToDelete(session,[session],records).map(r=>r.id),['exact','legacy']);
});
test('dos sesiones el mismo día impiden borrar asistencia histórica sin sessionId',()=>{
 assert.deepEqual(sessionAttendanceToDelete(session,[session,{id:'sibling',date:session.date,completed:true}],records).map(r=>r.id),['exact']);
});
test('sin fecha válida no asocia asistencia sin vínculo explícito',()=>{
 for(const date of ['',undefined,'2026-02-30','no-fecha']){
  const target={...session,date};
  assert.deepEqual(sessionAttendanceToDelete(target,[target],[...records,{id:'empty-date',date}]).map(r=>r.id),['exact']);
 }
});
test('seleccionar asociaciones no modifica registros ni inventa vínculos',()=>{
 const before=structuredClone({session,records});
 sessionAttendanceToDelete(session,[session],records);
 assert.deepEqual({session,records},before);
 assert.deepEqual(sessionAttendanceToDelete({},[],records),[]);
});
