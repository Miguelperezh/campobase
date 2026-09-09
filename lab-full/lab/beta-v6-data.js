import { getAll, putBatch } from '../js/db.js';
import { calculateMinuteTargets } from '../js/domain.js';
import { EJERCICIOS_VALIDADOS, toCampoBaseExercise } from '../js/ejercicios-validados.js';

const EXERCISES=EJERCICIOS_VALIDADOS.map(toCampoBaseExercise);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function seed(){
  const settings=await getAll('settings');
  if(settings.some(x=>x.id==='fc-v6-demo-seed'))return;
  let players=await getAll('players');
  for(let i=0;i<12&&players.length<7;i++){await sleep(250);players=await getAll('players');}
  if(players.length<7)return;
  const ids=players.map(x=>x.id),keeper=players.find(p=>(p.positions||[]).includes('Portero'))?.id||ids[0];
  let available=ids.slice(0,Math.min(14,ids.length));
  if(!available.includes(keeper)){available.pop();available.unshift(keeper);}else available=[keeper,...available.filter(id=>id!==keeper)];
  const first7=[keeper,...available.filter(id=>id!==keeper).slice(0,6)],bench=available.filter(id=>!first7.includes(id));
  const targets=calculateMinuteTargets(available,70,7,[keeper]),now=Date.now();
  const mkCallup=(id,date,opponent,matchType='friendly')=>({id,date,format:'F7',matchType,opponent,availableIds:[...available],selectedIds:[...available],excludedIds:ids.filter(x=>!available.includes(x)),exclusions:ids.filter(x=>!available.includes(x)).map(playerId=>({playerId,reason:'rotation',automatic:true})),targets:[...targets],createdAt:now});
  const liveCallup=mkCallup('fc-v6-callup-live','2026-09-10T18:00','DEMO · Atlético Norte');
  const nextCallup=mkCallup('fc-v6-callup-next','2026-09-13T10:00','DEMO · Unión Costa','league');
  const minutes=Object.fromEntries(available.map((id,i)=>[id,(i<7?38:32)*60]));
  const ratingsA=Object.fromEntries(available.map((id,i)=>[id,[4,3,4,3,2,4,3,4,3,3,2,4,3,3][i%14]]));
  const ratingsB=Object.fromEntries(available.map((id,i)=>[id,[3,3,4,2,3,4,4,3,2,3,3,4,2,3][i%14]]));
  const matches=[
    {id:'fc-v6-match-finished-1',date:'2026-08-29T10:00',type:'friendly',opponent:'DEMO · San Lorenzo',venue:'home',status:'finished',goalsFor:4,goalsAgainst:2,minuteTotals:minutes,ratings:ratingsA,goals:[{playerId:available[3],second:600},{playerId:available[7],second:1500}],cards:[],injuries:[],incidents:[],comments:'Partido ficticio para probar estadísticas.',finishedAt:now-691200000},
    {id:'fc-v6-match-finished-2',date:'2026-09-02T18:30',type:'friendly',opponent:'DEMO · Ciudad Jardín',venue:'away',status:'finished',goalsFor:2,goalsAgainst:2,minuteTotals:minutes,ratings:ratingsB,goals:[{playerId:available[5],second:900}],cards:[{playerId:available[2],type:'yellow',second:1800}],injuries:[],incidents:[],comments:'Segundo partido ficticio.',finishedAt:now-345600000},
    {id:'fc-v6-match-live',date:'2026-09-10T18:00',type:'friendly',opponent:'DEMO · Atlético Norte',venue:'home',status:'planned',callupId:liveCallup.id},
    {id:'fc-v6-match-next',date:'2026-09-13T10:00',type:'league',opponent:'DEMO · Unión Costa',venue:'away',status:'planned',callupId:nextCallup.id,round:'1'}
  ];
  const attendance=(date,idx)=>({id:`fc-v6-training-${idx}`,kind:'training',matchId:null,date,notes:`Entrenamiento ficticio ${idx}`,attendance:players.map((p,i)=>({playerId:p.id,status:i===idx?'late':i===idx+5?'absent':'present',arrivalTime:i===idx?'17:08':'',note:''})),createdAt:now-idx*86400000});
  const exids=EXERCISES.slice(0,12).map(x=>x.id);
  const session=(id,date,name,offset)=>{const blocks=exids.slice(offset,offset+4).map((exerciseId,i)=>({type:i===0?'warmup':i===3?'final':'main',exerciseId,duration:[10,15,20,15][i],notes:''}));return{id,recordType:'trainingSession',date,name,targetDuration:60,material:'Conos, petos y balones',notes:'Sesión ficticia para probar la beta.',blocks,totalDuration:60,createdAt:now-offset,updatedAt:now-offset};};
  const liveTimer={matchId:'fc-v6-match-live',elapsed:860,runningSince:null,phase:'first_half',initialOnField:[...first7],onField:[...first7],events:bench[0]?[{second:660,outIds:[first7[6]],inIds:[bench[0]]}]:[],firstKeeper:keeper,secondKeeper:keeper,autoPaused:false,delegateUnlocked:true,details:{goalsFor:1,goalsAgainst:1,goals:[{playerId:available[3],second:420}],cards:[],injuries:[],incidents:[],comments:'Partido ficticio en vivo. Puedes continuar y probar cambios.',minuteReasons:{}},updatedAt:now};
  await putBatch({callups:[liveCallup,nextCallup],matches,trainings:[attendance('2026-09-01',1),attendance('2026-09-04',2),attendance('2026-09-07',3)],settings:[session('fc-v6-session-1','2026-09-08','Salida y progresión',0),session('fc-v6-session-2','2026-09-10','Transición tras pérdida',4),session('fc-v6-session-3','2026-09-12','Finalización y partido',8),{id:'live',timer:liveTimer,updatedAt:now},{id:'fc-v6-demo-seed',recordType:'migration',version:6,createdAt:now}]});
  if(!sessionStorage.getItem('fc-v6-seeded')){sessionStorage.setItem('fc-v6-seeded','1');location.reload();}
}
seed();
