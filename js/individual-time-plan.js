import {normalizePlayerIntervals,playerIntervals,lineupAtMinute,validateWindowPlan} from './match-window-plan.js';
export function intervalsFromMoments(moments,ids,duration){return Object.fromEntries(ids.map(id=>[id,playerIntervals(moments,id,duration)]));}
export function setIndividualIntervals(plan,id,intervals,duration){if(!Object.hasOwn(plan,id))throw new Error('El jugador no pertenece a la convocatoria.');return {...structuredClone(plan),[id]:normalizePlayerIntervals(intervals,duration,{mergeAdjacent:false})};}
export function intervalTotals(plan){return Object.fromEntries(Object.entries(plan).map(([id,intervals])=>[id,intervals.reduce((n,s)=>n+s.to-s.from,0)]));}
export function timePlanCoverage(plan,keeperIds,duration,fieldSlots){
 const cuts=[...new Set([0,duration,...Object.values(plan).flatMap(s=>s.flatMap(v=>[v.from,v.to]))])].sort((a,b)=>a-b);
 return cuts.slice(0,-1).map((from,i)=>{const ids=Object.keys(plan).filter(id=>plan[id].some(s=>from>=s.from&&from<s.to));const keepers=ids.filter(id=>keeperIds.includes(id));const field=ids.filter(id=>!keeperIds.includes(id));return {from,to:cuts[i+1],ids,keepers,field,valid:keepers.length===1&&field.length===fieldSlots};});
}
export function momentsFromIntervals({plan,template,availableIds,keeperIds,duration,idFactory=()=>crypto.randomUUID()}){
 for(const id of availableIds)normalizePlayerIntervals(plan[id]||[],duration);
 const windows=timePlanCoverage(plan,keeperIds,duration,template[0].team.length-1);
 const invalid=windows.find(w=>!w.valid);if(invalid)throw new Error(`En ${invalid.from}′–${invalid.to}′ hay ${invalid.field.length} jugadores de campo y ${invalid.keepers.length} porteros. Ajusta los tramos antes de guardar.`);
 let last=null;
 // Preserve stored positional/formation changes, even when nobody enters/leaves.
 const cuts=[...new Set([...windows.map(w=>w.from),...template.map(m=>m.minute)])].sort((a,b)=>a-b);
 const moments=cuts.map(minute=>{
  const win=windows.find(w=>minute>=w.from&&minute<w.to);const original=lineupAtMinute(template,minute);const team=structuredClone(original.team);
  const assigned=new Set();
  for(const [index,slot]of team.entries()){
   const preferred=last?.team.find(s=>s.pos===slot.pos)?.playerId;
   const eligible=slot.pos==='Portero'?win.keepers:win.field;
   // Original slot changes take priority when present in this stored window.
   const id=eligible.includes(slot.playerId)?slot.playerId:eligible.includes(preferred)?preferred:null;
   slot.playerId=id&&!assigned.has(id)?id:'';if(slot.playerId)assigned.add(slot.playerId);
  }
  for(const slot of team.filter(s=>!s.playerId)){slot.playerId=(slot.pos==='Portero'?win.keepers:win.field).find(id=>!assigned.has(id));assigned.add(slot.playerId);}
  last={...structuredClone(original),id:original.minute===minute?original.id:idFactory(),minute,team};return last;
 });
 return validateWindowPlan(moments,availableIds,duration);
}
export function exchangeTimeWindow({plan,outIds,inIds,minute,duration,keeperIds=[]}){
 if(!outIds.length||outIds.length!==inIds.length||new Set([...outIds,...inIds]).size!==outIds.length+inIds.length)throw new Error('Elige la misma cantidad de jugadores distintos para entrar y salir.');
 if(!Number.isFinite(minute)||minute<=0||minute>=duration)throw new Error('Elige un minuto dentro del partido.');
 let next=structuredClone(plan);
 outIds.forEach((out,i)=>{const inn=inIds[i];if(keeperIds.includes(out)!==keeperIds.includes(inn))throw new Error('Un portero debe relevar a otro portero.');const interval=next[out]?.find(s=>minute>=s.from&&minute<s.to);if(!interval||next[inn]?.some(s=>minute>=s.from&&minute<s.to))throw new Error('Quien sale debe estar en campo y quien entra en el banquillo.');
 const transfer={from:minute,to:interval.to};next=setIndividualIntervals(next,out,next[out].flatMap(s=>s===interval?(s.from<minute?[{from:s.from,to:minute}]:[]):[s]),duration);next=setIndividualIntervals(next,inn,[...next[inn],transfer],duration);
 });return next;
}
