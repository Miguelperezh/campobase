export const LEARNING_PHASES = ['Fase ofensiva','Fase defensiva','Transición ofensiva','Transición defensiva','Balón parado ofensivo','Balón parado defensivo'];
export const LEARNING_COMPETENCES = ['Técnica','Decisión','Posicionamiento','Físico','Autonomía','Esfuerzo','Actitud','Comunicación','Respuesta al error','Aprendizaje'];
export function competencyAverage(scores) {
  const values=scores.filter(v=>Number.isInteger(v)&&v>=1&&v<=5);
  return values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
}
export function learningId(kind, entity, date='') {
  if(!['review','evaluation','plan'].includes(kind)||!entity)throw new Error('Selecciona un partido, jugador o bloque antes de guardar.');
  return `learning:${kind}:${encodeURIComponent(entity)}${date?':'+date:''}`;
}
export function learningRecord(id, payload, previous, now=Date.now()) {
  if(!id.startsWith('learning:'))throw new Error('Identificador de aprendizaje incorrecto.');
  if(payload.kind==='evaluation'&&(!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)||payload.scores.length!==10||payload.scores.some(n=>!Number.isInteger(n)||n<0||n>5)))throw new Error('Revisa la fecha y las competencias (1–5 o sin valorar).');
  if(payload.kind==='review'&&(payload.ratings.length!==6||payload.ratings.some(r=>r!==null&&!['Bien','Regular','Mal'].includes(r))))throw new Error('Revisa las fases del partido.');
  if(payload.kind==='plan'&&(!/^\d{4}-\d{2}-\d{2}$/.test(payload.start)||!/^\d{4}-\d{2}-\d{2}$/.test(payload.end)||payload.end<payload.start))throw new Error('La fecha final debe ser igual o posterior a la inicial.');
  return {...previous,...structuredClone(payload),id,recordType:'learning',createdAt:previous?.createdAt??now,updatedAt:now};
}
export function evaluationHistory(records, playerId, before) {
  return records.filter(r=>r.recordType==='learning'&&r.kind==='evaluation'&&r.playerId===playerId&&r.date<before)
    .sort((a,b)=>a.date.localeCompare(b.date)).map(r=>({date:r.date,average:competencyAverage(r.scores),complete:r.scores.every(v=>v>0)}));
}
