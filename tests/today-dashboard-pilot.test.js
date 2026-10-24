import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {buildTodaySummary, buildLeagueSummary, localDayKey} from '../js/today-dashboard.js';
import {sameViewContext} from '../js/account-view-context.js';
import {isMatchTerminal} from '../js/postgame-plan.js';

const source = readFileSync(new URL('../js/today-dashboard.js', import.meta.url), 'utf8');
const account = name => ({userId:name, pinRevision:1, role:'owner'});
const fixture = name => ({
  matches:[{id:'same-match',opponent:`Rival ${name}`,date:`${localDayKey()}T19:00`,status:'planned'}],
  trainings:[],callups:[],
  settings:[{id:'same-session',recordType:'trainingSession',name:`Sesión ${name}`,date:localDayKey(),blocks:[]}],
});

function harness() {
  const env = {context:account('A'),snapshots:{A:fixture('A'),B:fixture('B')},hold:null,events:[],click:null,timers:[],fail:false};
  const root = {innerHTML:''}, section = {classList:{contains:()=>true}};
  // This state deliberately remains stale while the durable B snapshot loads.
  const state = {role:'owner',trainingSessions:[{id:'foreign',name:'Privado sin procedencia'}]};
  const scope = {
    console,Date,Intl,Map,Set,Promise,Number,String,Boolean,Math,
    isMatchTerminal,sameViewContext,
    getBoundSaasUserId:()=>env.context.userId,
    getPinAccessRevision:()=>env.context.pinRevision,
    currentDatabaseName:()=>`campobase_${env.context.userId}`,
    isDemoDatabase:()=>false,
    getAll:async key=>{
      const data=structuredClone(env.snapshots[env.context.userId][key]);
      const fail=env.fail;
      if(env.hold && key==='settings')await env.hold;
      if(fail)throw new Error('Lectura interrumpida');
      return data;
    },
    window:{
      __campobase:{state},
      clearTimeout(){},setTimeout:(callback,delay)=>{env.timers.push({callback,delay});return env.timers.length;},
      setInterval(){},addEventListener(){},dispatchEvent:event=>env.events.push(event),
    },
    document:{
      querySelector:selector=>selector==='#today-dashboard'?root:selector==='#hoy'?section:null,
      addEventListener:(type,listener)=>{if(type==='click')env.click=listener;},
    },
    MutationObserver:class{observe(){}},
    CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail;}},
  };
  vm.createContext(scope);
  vm.runInContext(source.replace(/^import .*;\n/gm,'').replace(/^export /gm,'')
    .replace("if (typeof document !== 'undefined') bind();",'')
    + '\nensureShell=()=>document.querySelector("#hoy");this.render=renderTodayDashboard;this.install=bind;this.sessionCard=sessionCard;this.matchCard=matchCard;this.pendingPanel=pendingPanel;',scope);
  const switchTo = (name, extra={}) => {env.context={...account(name),...extra};state.role=env.context.role;};
  return {env,root,scope,switchTo};
}

test('Hoy excludes every explicit closure from next match and missing callup, keeping historic attendance',()=>{
  const now=new Date(2026,9,24,12);
  const markers=[{status:'finished'},{status:'closed'},{completed:true},{closedAt:1},{finishedAt:1}];
  const matches=markers.map((marker,index)=>({id:`closed-${index}`,date:'2026-10-24T19:00',...marker}));
  matches.push({id:'active-with-goal',date:'2026-10-24T20:00',status:'in_progress',goalsFor:1,minuteTotals:{p:300}});
  const before=JSON.stringify(matches),summary=buildTodaySummary({matches,now});
  assert.equal(summary.nextMatch.id,'active-with-goal');
  assert.deepEqual(summary.callupPending.map(row=>row.id),['active-with-goal']);
  assert.deepEqual(summary.attendancePending.map(row=>row.id).sort(),matches.map(row=>row.id).sort());
  assert.equal(JSON.stringify(matches),before,'read never changes sporting records');
});

test('league results include explicit historical closures and never a live partial score',()=>{
  const rows=[{id:'done',type:'league',completed:true,goalsFor:2,goalsAgainst:1},{id:'closed',type:'league',closedAt:1,goalsFor:0,goalsAgainst:0},
    {id:'live',type:'league',status:'in_progress',goalsFor:8,goalsAgainst:0}];
  const result=buildLeagueSummary(rows);
  assert.deepEqual(result.games.map(row=>row.id),['done','closed']);
  assert.equal(result.goalsFor,2);assert.equal(result.goalsAgainst,1);assert.equal(result.points,4);
  const {scope}=harness();
  const markup=scope.matchCard({...rows[0],date:`${localDayKey()}T19:00`},[],[],localDayKey(),{matchId:'done',phase:'first'});
  assert.match(markup,/Finalizado/);assert.doesNotMatch(markup,/EN JUEGO/);
});

test('a retained Today snapshot of A cannot paint or mix sessions after B finishes',async()=>{
  const {env,root,scope,switchTo}=harness();
  await scope.render();assert.match(root.innerHTML,/Sesión A/);
  let release;env.hold=new Promise(resolve=>{release=resolve;});
  const stale=scope.render();
  switchTo('B');env.hold=null;
  assert.equal(await scope.render(),true);
  release();assert.equal(await stale,false);
  assert.match(root.innerHTML,/Sesión B/);assert.match(root.innerHTML,/Rival B/);
  assert.doesNotMatch(root.innerHTML,/Sesión A|Rival A|Privado sin procedencia/);
});

test('account change clears previous Today immediately while the new read is pending',async()=>{
  const {env,root,scope,switchTo}=harness();
  await scope.render();
  switchTo('B');let release;env.hold=new Promise(resolve=>{release=resolve;});
  const reading=scope.render();
  assert.doesNotMatch(root.innerHTML,/Sesión A|Rival A/);
  assert.match(root.innerHTML,/este equipo/);
  release();await reading;assert.match(root.innerHTML,/Sesión B/);
});

test('Today identity belongs to its own settings snapshot even while the header still belongs to A',async()=>{
  const {env,root,scope,switchTo}=harness();
  env.snapshots.B.settings.push({id:'main',teamName:'Club propio B',clubCrest:'data:image/png;base64,Qg=='});
  env.snapshots.B.matches[0]={...env.snapshots.B.matches[0],completed:true,goalsFor:2,goalsAgainst:1};
  const query=scope.document.querySelector;
  scope.document.querySelector=selector=>selector==='#topbar-team-name'?{textContent:'Club ajeno A'}
    :selector==='#topbar-club-crest'?{getAttribute:()=>'/escudo-ajeno-A.png'}:query(selector);
  switchTo('B');await scope.render();
  assert.match(root.innerHTML,/Club propio B/);assert.match(root.innerHTML,/data:image\/png;base64,Qg==/);
  assert.doesNotMatch(root.innerHTML,/Club ajeno A|escudo-ajeno-A/);
  env.snapshots.B.settings=env.snapshots.B.settings.filter(row=>row.id!=='main');await scope.render();
  assert.match(root.innerHTML,/<div class="cbx-today-score"><div><strong>Equipo<\/strong>/);
  assert.doesNotMatch(root.innerHTML,/<img |Club propio B|Club ajeno A|escudo\.png/);
});

test('PIN and role changes cancel retained Today reads, even with identical IDs and account',async()=>{
  for(const change of [{pinRevision:2},{role:'delegate'}]) {
    const {env,root,scope,switchTo}=harness();
    await scope.render();let release;env.hold=new Promise(resolve=>{release=resolve;});
    const reading=scope.render();switchTo('A',change);release();
    assert.equal(await reading,false);assert.doesNotMatch(root.innerHTML,/Sesión A|Rival A/);
  }
});

test('the newest Today read wins and a foreign failed read cannot replace it with a loading error',async()=>{
  for(const failed of [false,true]) {
    const {env,root,scope,switchTo}=harness();
    let release;env.hold=new Promise(resolve=>{release=resolve;});env.fail=failed;
    const stale=scope.render();switchTo('B');env.hold=null;env.fail=false;
    await scope.render();const current=root.innerHTML;release();await stale;
    assert.equal(root.innerHTML,current);assert.match(current,/Sesión B/);
  }
  const {env,root,scope}=harness();let release;
  env.hold=new Promise(resolve=>{release=resolve;});const stale=scope.render();
  env.hold=null;env.snapshots.A.settings[0].name='Sesión más reciente';await scope.render();
  release();await stale;assert.match(root.innerHTML,/Sesión más reciente/);
});

test('every Today card and pending action identifies its exact activity; quick navigation remains generic',async()=>{
  const {env,root,scope}=harness(),day=localDayKey();
  env.snapshots.A.settings.push({id:'second-session',recordType:'trainingSession',name:'Segunda',date:day,blocks:[]});
  env.snapshots.A.matches.push({id:'second-match',date:`${day}T20:00`,opponent:'Segundo'});
  env.snapshots.A.callups.push({id:'own-callup',matchId:'second-match',availableIds:[]});
  await scope.render();
  for(const id of ['same-session','second-session']) {
    assert.match(root.innerHTML,new RegExp(`data-today-action="session" data-id="${id}"`));
    assert.match(root.innerHTML,new RegExp(`data-today-action="attendance" data-id="${id}" data-source="session"`));
  }
  for(const id of ['same-match','second-match']) {
    assert.match(root.innerHTML,new RegExp(`data-today-action="match" data-id="${id}"`));
    assert.match(root.innerHTML,new RegExp(`data-today-action="callup" data-id="${id}"`));
  }
  assert.match(root.innerHTML,/data-today-action="callup" data-id="second-match" data-callup-id="own-callup"/);
  assert.match(root.innerHTML,/data-today-view="sesiones">Sesiones/);
  assert.match(root.innerHTML,/data-today-action="attendance" data-id="same-match" data-source="match"/);
});

test('Today dispatches the selected action only while the rendered account/PIN/role is still current',async()=>{
  const {env,root,scope,switchTo}=harness();
  scope.install();await scope.render();
  let blocked=0;
  const click=dataset=>env.click({target:{closest:selector=>selector==='[data-today-action]'?{dataset}:null},preventDefault(){blocked++;},stopImmediatePropagation(){blocked++;}});
  click({todayAction:'session',id:'same-session'});
  click({todayAction:'callup',id:'same-match',callupId:'c1'});
  assert.deepEqual(JSON.parse(JSON.stringify(env.events.map(event=>event.detail))),[
    {action:'session',id:'same-session',source:'',callupId:''},
    {action:'callup',id:'same-match',source:'',callupId:'c1'},
  ]);
  switchTo('B');click({todayAction:'session',id:'same-session'});
  assert.equal(env.events.length,2);assert.equal(blocked,2);assert.doesNotMatch(root.innerHTML,/Sesión A/);
});

test('legacy WhatsApp and whistle controls in old Today also stop before their global handlers',async()=>{
  const {env,scope,switchTo}=harness();scope.install();await scope.render();switchTo('B');
  let blocked=0;
  env.click({target:{closest:selector=>selector==='#today-dashboard button'?{className:'open-whatsapp-callup'}:null},preventDefault(){blocked++;},stopImmediatePropagation(){blocked++;}});
  assert.equal(blocked,2);assert.equal(env.events.length,0);
});
