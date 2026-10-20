function day(value) { return String(value || '').slice(0,10); }
function validDay(value) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(value+'T12:00:00Z');
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
// Old attendance without sessionId belongs to a date only when unambiguous.
export function sessionAttendanceToDelete(session,sessions=[],attendance=[]) {
  if(!session?.id)return [];
  const date=day(session.date);
  const uniqueDay=validDay(date)&&sessions.filter(s=>day(s.date)===date).length===1;
  return attendance.filter(record=>{
    if(record.matchId || (record.kind ?? 'training')!=='training')return false;
    if(record.sessionId)return String(record.sessionId)===String(session.id);
    return uniqueDay&&day(record.date)===date;
  });
}
