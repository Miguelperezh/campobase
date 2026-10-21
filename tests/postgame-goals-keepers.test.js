import test from 'node:test';
import assert from 'node:assert/strict';
import { keeperGoalAllocation } from '../js/keeper-goals.js';
import { buildPostgameScoreUpdate } from '../js/postgame-goals.js';
import { buildSquadLeaderboards, buildPlayerSummary } from '../js/domain.js';
const players = [{id:'k1',name:'Portero 1',positions:['Portero']},{id:'k2',name:'Portero 2',positions:['Portero']},{id:'p',name:'Jugador',positions:['Central']},{id:'a',name:'Asistente',positions:['Central']}];
const match = {id:'m',type:'league',status:'finished',goalsFor:1,goalsAgainst:15,goalkeeperRotation:{firstKeeper:'k1',secondKeeper:'k2'},minuteTotals:{k1:2100,k2:2100},goals:[],plan:{saved:true},location:'Campo guardado'};
test('15 goles sin reparto no se duplican en los dos porteros ni se inventan coeficientes',()=>{
 const allocation=keeperGoalAllocation(match,players);
 assert.equal(allocation.pending,15); assert.deepEqual(allocation.assigned,{});
 const board=buildSquadLeaderboards({players,matches:[match],callups:[],attendanceRecords:[],scope:'league'});
 assert.equal(board.goalkeepers.reduce((sum,k)=>sum+k.goalsAgainst,0),0);
 assert.ok(board.goalkeepers.every(k=>k.coefficient===null && k.keeperAssignmentPending));
});
test('edición explícita 8+7 reparte exactamente los 15 y liga no incluye pretemporada',()=>{
 const updated={...match,keeperGoalsAgainst:{k1:8,k2:7}};
 assert.equal(keeperGoalAllocation(updated,players).complete,true);
 const board=buildSquadLeaderboards({players,matches:[updated,{...updated,id:'friendly',type:'friendly',keeperGoalsAgainst:{k1:12,k2:3}}],callups:[],attendanceRecords:[],scope:'league'});
 assert.deepEqual(board.goalkeepers.map(k=>k.goalsAgainst).sort(),[7,8]);
 assert.equal(board.goalkeepers.reduce((sum,k)=>sum+k.goalsAgainst,0),15);
});
test('portero único e incidentes con autor conocido proporcionan evidencia sin repartir por minutos',()=>{
 assert.deepEqual(keeperGoalAllocation({...match,goalkeeperRotation:{firstKeeper:'k1'},minuteTotals:{k1:4200}},players).assigned,{k1:15});
 const both={...match,goalsAgainst:2,incidents:[{type:'opponent_goal',playerId:'k1'},{type:'penalty_conceded',keeperId:'k2'}]};
 assert.deepEqual(keeperGoalAllocation(both,players).assigned,{k1:1,k2:1});
 assert.equal(keeperGoalAllocation(both,players).complete,true);
});
test('goles, asistencias y tipos se corrigen sin alterar plan, campo ni notas originales',()=>{
 const updated=buildPostgameScoreUpdate(match,{goalsFor:1,goalsAgainst:15,keeperGoalsAgainst:{k1:8,k2:7},goals:[{original:{id:'g',custom:'conservar'},playerId:'p',assistantId:'a',goalType:'penalty',minute:12,note:'Nota'}]});
 assert.equal(updated.goals[0].id,'g'); assert.equal(updated.goals[0].custom,'conservar'); assert.equal(updated.goals[0].isPenalty,true); assert.equal(updated.goals[0].second,720);
 assert.deepEqual(updated.plan,match.plan); assert.equal(updated.location,match.location);
 assert.equal(buildPlayerSummary('p',[updated],[],[],'league').goals,1);
 assert.equal(buildPlayerSummary('a',[updated],[],[],'league').assists,1);
 assert.deepEqual(match.goals,[]);
});
test('rechaza doble atribución y goles por encima del marcador, permite datos aún sin asignar',()=>{
 const draft={goalsFor:1,goalsAgainst:15,keeperGoalsAgainst:{k1:15,k2:15},goals:[]};
 assert.throws(()=>buildPostgameScoreUpdate(match,draft),/supera/);
 assert.deepEqual(buildPostgameScoreUpdate(match,{...draft,keeperGoalsAgainst:{k1:'',k2:''}}).keeperGoalsAgainst,{});
 const goal={playerId:'p',assistantId:'p',goalType:'freekick',minute:1};
 assert.throws(()=>buildPostgameScoreUpdate(match,{...draft,keeperGoalsAgainst:{},goals:[goal,goal]}),/más goles/);
 assert.equal(buildPostgameScoreUpdate(match,{...draft,keeperGoalsAgainst:{},goals:[goal]}).goals[0].assistantId,'');
});
test('marcador vacío, null o ausente queda pendiente sin inventar un cero a cero',()=>{
 for(const empty of ['',null,undefined,'   ']){
  const updated=buildPostgameScoreUpdate(match,{goalsFor:empty,goalsAgainst:empty,goals:[],keeperGoalsAgainst:{k1:empty,k2:empty}});
  assert.equal(updated.goalsFor,null);assert.equal(updated.goalsAgainst,null);
  assert.deepEqual(updated.goals,[]);assert.deepEqual(updated.keeperGoalsAgainst,{});
 }
 const missing=buildPostgameScoreUpdate({id:'pending',plan:{saved:true},location:'Campo original'},{});
 assert.equal(missing.goalsFor,null);assert.equal(missing.goalsAgainst,null);
 assert.deepEqual(missing.plan,{saved:true});assert.equal(missing.location,'Campo original');
});
test('cada lado del marcador puede registrarse por separado y cero explícito sigue siendo cero',()=>{
 for(const zero of [0,'0']){
  const forOnly=buildPostgameScoreUpdate(match,{goalsFor:zero,goalsAgainst:'',goals:[],keeperGoalsAgainst:{k1:3}});
  assert.equal(forOnly.goalsFor,0);assert.equal(forOnly.goalsAgainst,null);assert.deepEqual(forOnly.keeperGoalsAgainst,{k1:3});
  const againstOnly=buildPostgameScoreUpdate(match,{goalsFor:null,goalsAgainst:zero,goals:[],keeperGoalsAgainst:{k1:zero,k2:''}});
  assert.equal(againstOnly.goalsFor,null);assert.equal(againstOnly.goalsAgainst,0);assert.deepEqual(againstOnly.keeperGoalsAgainst,{k1:0});
 }
 const complete=buildPostgameScoreUpdate(match,{goalsFor:'2',goalsAgainst:'3',goals:[],keeperGoalsAgainst:{k1:1,k2:2}});
 assert.equal(complete.goalsFor,2);assert.equal(complete.goalsAgainst,3);
});
test('goleadores, asistencias, tipo y encajados se conservan aunque el total siga pendiente',()=>{
 const draft={goalsFor:'',goalsAgainst:null,goals:[{original:{id:'pending-goal',custom:'Original'},playerId:'p',assistantId:'a',goalType:'freekick',minute:10,note:'Gol anotado'}],keeperGoalsAgainst:{k1:2,k2:1}};
 const before=structuredClone({match,draft});
 const updated=buildPostgameScoreUpdate(match,draft);
 assert.equal(updated.goalsFor,null);assert.equal(updated.goalsAgainst,null);
 assert.equal(updated.goals.length,1);assert.equal(updated.goals[0].playerId,'p');assert.equal(updated.goals[0].assistantId,'a');
 assert.equal(updated.goals[0].goalType,'freekick');assert.equal(updated.goals[0].second,600);assert.equal(updated.goals[0].custom,'Original');
 assert.deepEqual(updated.keeperGoalsAgainst,{k1:2,k2:1});
 assert.deepEqual(updated.plan,match.plan);assert.equal(updated.location,match.location);
 assert.deepEqual({match,draft},before);
 const kept=buildPostgameScoreUpdate(updated,{goalsFor:null,goalsAgainst:''});
 assert.deepEqual(kept.goals,updated.goals);assert.deepEqual(kept.keeperGoalsAgainst,updated.keeperGoalsAgainst);
 kept.goals[0].note='Solo copia';kept.keeperGoalsAgainst.k1=9;
 assert.equal(updated.goals[0].note,'Gol anotado');assert.equal(updated.keeperGoalsAgainst.k1,2);
});
test('los límites de asignación se validan para cada total conocido, incluso cero',()=>{
 const goal={playerId:'p',assistantId:'a',goalType:'regular',minute:1};
 assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:0,goalsAgainst:null,goals:[goal],keeperGoalsAgainst:{k1:2}}),/más goles/);
 assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:null,goalsAgainst:0,goals:[goal],keeperGoalsAgainst:{k1:1}}),/supera/);
 assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:'',goalsAgainst:1,goals:[goal],keeperGoalsAgainst:{k1:1,k2:1}}),/supera/);
 assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:1,goalsAgainst:'',goals:[goal,goal],keeperGoalsAgainst:{k1:3}}),/más goles/);
});
test('un total pendiente no permite cifras negativas, decimales, infinitas o no numéricas',()=>{
 for(const invalid of [-1,'-1',1.5,'1.5',NaN,Infinity,-Infinity,'no es número',true,false,[],{}]){
  assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:invalid,goalsAgainst:null,goals:[],keeperGoalsAgainst:{}}),/marcador/);
  assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:null,goalsAgainst:invalid,goals:[],keeperGoalsAgainst:{}}),/marcador/);
  assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:null,goalsAgainst:null,goals:[],keeperGoalsAgainst:{k1:invalid}}),/portero/);
 }
 assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:'',goalsAgainst:'',goals:[{playerId:'',goalType:'regular',minute:1}],keeperGoalsAgainst:{}}),/goleador/);
 assert.throws(()=>buildPostgameScoreUpdate(match,{goalsFor:'',goalsAgainst:'',goals:[{playerId:'p',goalType:'regular',minute:71}],keeperGoalsAgainst:{}}),/minuto/);
});
test('un único editor guarda los campos nuevos y los antiguos módulos no interceptan su acción',async()=>{
 const {readFile}=await import('node:fs/promises');
 const legacy=await readFile(new URL('../js/plantilla-stats-sync.js',import.meta.url),'utf8');
 const sync=await readFile(new URL('../js/player-data-sync.js',import.meta.url),'utf8');
 const editor=await readFile(new URL('../js/match-postgame-editor.js',import.meta.url),'utf8');
 assert.doesNotMatch(legacy,/openMatchPerformanceEditor\(performanceButton/);
 assert.doesNotMatch(sync,/savePostgameSynced/);
 assert.match(editor,/buildPostgameScoreUpdate\(performance, draft/);
 assert.doesNotMatch(editor.slice(editor.indexOf('async function savePostgame('),editor.indexOf('function minuteText(')),/rebaseScopeAdjustments/);
});
