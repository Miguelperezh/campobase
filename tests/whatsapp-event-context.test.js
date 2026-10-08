import test from 'node:test';
import assert from 'node:assert/strict';
import { linkedCallup, resolveWhatsAppEvent, matchCommunicationDetails, whatsappMatchOptions } from '../js/whatsapp-event-context.js';
import { buildWhatsAppMatchConvocatoria, buildWhatsAppTrainingDay, buildWhatsAppTrainingWeek } from '../js/whatsapp-suite.js';
import { reconcileCloudSnapshot } from '../js/sync-core.js';
const matches = [{id:'old',date:'2026-09-01',location:'Mundial 82'}, {id:'called',date:'2026-10-09',time:'19:00',location:'Campo real',mapsUrl:'https://maps.google.com/?q=campo-real',opponent:'Rival',type:'league'}, {id:'new',date:'2026-10-10',time:'11:30',location:'Otro campo'}, {id:'played',date:'2026-10-10',completed:true}];
const callups = [{id:'c',matchId:'called',availableIds:['p'],excludedIds:['q'],exclusions:[{playerId:'q',reason:'injured'}]}];
const players=[{id:'p',number:7,name:'Jugador Nombre Completo'},{id:'q',number:10,name:'Otro Nombre Completo'}];
test('resuelve el ID exacto sin recurrir al primer partido y mantiene su convocatoria',()=>{
 const result=resolveWhatsAppEvent('match:called',matches,callups);
 assert.equal(result.match.location,'Campo real'); assert.equal(result.callup.id,'c');
 assert.equal(resolveWhatsAppEvent('match:unknown',matches,callups).match,null);
 assert.equal(resolveWhatsAppEvent('',matches,callups).match,null);
 assert.equal(resolveWhatsAppEvent('callup:c',matches,callups).match.id,'called');
});
test('convocatorias huérfanas conservan campo, mapa y hora propios',()=>{
 const result=resolveWhatsAppEvent('callup:orphan',matches,[{id:'orphan',location:'Campo propio',time:'18:00',mapsUrl:'https://maps.google.com/?q=propio'}]);
 assert.deepEqual(matchCommunicationDetails(result.match),{fieldName:'Campo propio',mapsUrl:'https://maps.google.com/?q=propio',gameTime:'18:00',callTime:'17:15'});
});
test('asociación histórica exige fecha y rival inequívocos',()=>{
 const match={id:'legacy',date:'2026-10-09',opponent:'Rivál A'};
 assert.equal(linkedCallup(match,[{id:'a',date:match.date,opponent:'Rival A'}]).id,'a');
 assert.equal(linkedCallup(match,[{id:'a',date:match.date,opponent:'Rival A'},{id:'b',date:match.date,opponent:'Rival A'}]),null);
});
test('selector genérico excluye pasado, jugados y convocados; enviar desde convocatoria retiene su evento',()=>{
 assert.deepEqual(whatsappMatchOptions(matches,callups,'2026-10-08',m=>m.completed===true).map(m=>m.id),['new']);
 assert.deepEqual(whatsappMatchOptions(matches,callups,'2026-10-08',m=>m.completed===true,'','c').map(m=>m.id),['called','new']);
});
test('hora real, citación menos 45 y datos ausentes sin horario inventado',()=>{
 assert.equal(matchCommunicationDetails({date:'2026-10-09T19:00:00'}).callTime,'18:15');
 assert.equal(matchCommunicationDetails({time:'00:20'}).callTime,'23:35');
 assert.equal(matchCommunicationDetails({time:'25:00'}).gameTime,'');
 assert.equal(matchCommunicationDetails({}).fieldName,'');
});
test('mensaje grupal conserva lista, descansan sin motivos, mapa y ropa requerida',()=>{
 const text=buildWhatsAppMatchConvocatoria({match:matches[1],callup:callups[0],players});
 for(const value of ['19:00','18:15','Campo real',matches[1].mapsUrl,'1. 7 Jugador Nombre Completo','*Descansan:*','- Dorsal 10, Otro Nombre Completo','dos equipaciones completas','Polo y pantalón de paseo de este año','Camiseta roja de calentamiento']) assert.ok(text.includes(value),value);
 assert.ok(!text.includes('lesión')); assert.ok(!text.includes('Mundial 82'));
});
test('entrenamiento usa hora y campo reales, balón identificado y camiseta roja',()=>{
 const text=buildWhatsAppTrainingDay({session:{date:'2026-10-09',time:'17:30',pitch:'Campo Pilar'}});
 for(const value of ['17:30','Campo Pilar','Camiseta roja','con su nombre'])assert.ok(text.includes(value));
 const missing=buildWhatsAppTrainingDay({session:{}}); assert.ok(!missing.includes('16:30')); assert.ok(!missing.includes('Alfonso Silva'));
});
test('semana vacía no inventa entrenamientos y partidos usan su location',()=>{
 const text=buildWhatsAppTrainingWeek({sessions:[],matches:[matches[1]]});
 assert.ok(text.includes('Campo real')); assert.ok(text.includes('19:00')); assert.ok(!text.includes('Alfonso Silva')); assert.ok(!text.includes('16:30'));
});
test('snapshot reconoce eliminaciones remotas sin borrar una edición local pendiente',()=>{
 const local=[{id:'c',opponent:'Original'}];
 assert.deepEqual(reconcileCloudSnapshot('callups',local,[],[],['c']),[]);
 const pending=[{store:'callups',operation:'upsert',recordId:'c',payload:{id:'c',opponent:'Edición nueva'}}];
 assert.equal(reconcileCloudSnapshot('callups',local,[],pending,['c'])[0].opponent,'Edición nueva');
});

test('mensaje individual excluido comunica solo su motivo sin campo, mapa ni horas',()=>{
 const text=buildWhatsAppMatchConvocatoria({match:matches[1],callup:callups[0],players,recipientType:'parent',targetPlayerId:'q'});
 assert.ok(text.includes('lesión')); for(const value of ['Campo real','19:00','18:15','maps.google'])assert.ok(!text.includes(value));
});
