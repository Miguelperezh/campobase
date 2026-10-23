import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {sameViewAccount, sameViewContext, readViewCache, writeViewCache, projectLiveTimer, browserCacheContext, cacheBelongsToAccount} from '../js/account-view-context.js';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const refreshSource = source.slice(source.indexOf('async function refresh() {'), source.indexOf('\nfunction syncDirectFieldCache()'));
const storage = () => {
  const records = new Map();
  return {getItem: key => records.get(key) ?? null, setItem: (key, value) => records.set(key, String(value)), records};
};
const account = name => ({userId: name, database: `campobase_${name}`, pinRevision: 1, role: 'owner'});
const snapshot = name => ({players:[{id:'same-player',name}], callups:[{id:'same-callup',name}], matches:[{id:'same-match',opponent:name,status:'in_progress',date:'2000-01-01'}], trainings:[{id:'same-attendance',name}], settings:[{id:'main',teamName:name,theme:{accentColor:name},delegatePermissions:[]},{id:'live',timer:{matchId:'same-match',phase:'first',runningSince:1}}]});
function harness() {
  const env = {context:account('A'), snapshots:{A:snapshot('A'),B:snapshot('B')}, wait:null, renders:[],writes:[]};
  const store = storage();
  const node = {elements:{teamName:{},format:{}}};
  const state = {players:[],callups:[],matches:[],trainings:[],settings:{}};
  const scope = {
    state, viewContext:()=>({...env.context}), sameViewContext,sameViewAccount,projectLiveTimer,
    getAll: async key => {const name=env.context.userId, data=structuredClone(env.snapshots[name][key]); if(env.wait && key==='settings')await env.wait;return data;},
    sortPlayersByName: rows=>rows, EJERCICIOS_VALIDADOS:[],toCampoBaseExercise:row=>row,
    window:{__CAMPOBASE_READONLY_PREVIEW:true}, navigator:{onLine:false}, sessionStorage:store,
    readAccountCache:key=>readViewCache(store,key,env.context),
    writeAccountCache:(key,value)=>writeViewCache(store,key,value,env.context),
    getDelegatePermissions:()=>state.settings.delegatePermissions || [],
    isTrainingSessionCompleted:row=>Boolean(row.completed), DEFAULT_PRESETS:[],DEFAULT_SEM:{},
    resolveDisplayTheme:(stored,cached)=>stored || cached,
    $:selector=>selector.includes('data-action="close"')?null:node,
    populateDelegateAccountForm(){},applyTeamIdentity(){},applyCustomTheme(){},syncDelegateModeDom(){},restoreNormalNavUi(){},
    renderOrDefer:()=>env.renders.push(structuredClone(state)),clearInterval(){},
    put:(...args)=>env.writes.push(args),
  };
  vm.createContext(scope);
  vm.runInContext(`let refreshRevision=0,loadedViewContext=null,validatedExerciseCache=null;
    let liveTactic,prepDraft,prepMatchId,prepMomentsDraft,prepMomentIndex,tacticDraft,sessionDraftBlocks,sessionDraftMeta,reusedSessionContext,pendingExerciseId;
    ${refreshSource};this.refresh=refresh;`,scope);
  return {...env,env,state,scope,store};
}

test('a retained settings read from A cannot commit or render after B completes',async()=>{
  const {env,state,scope}=harness();
  let release;env.wait=new Promise(resolve=>{release=resolve;});
  const old=scope.refresh(true);
  await Promise.resolve();
  assert.deepEqual(state.players,[], 'no store is committed before the whole snapshot is ready');
  env.context=account('B');env.wait=null;
  assert.equal(await scope.refresh(true),true);
  release();assert.equal(await old,false);
  assert.equal(state.players[0].name,'B');assert.equal(state.settings.teamName,'B');
  assert.deepEqual(env.renders.map(value=>value.players[0].name),['B']);
  assert.equal(env.writes.length,0);
});

test('PIN or role change while loading cancels the old view, including identical record IDs',async()=>{
  for(const change of [{pinRevision:2},{role:'delegate'}]) {
    const {env,state,scope}=harness();let release;env.wait=new Promise(resolve=>{release=resolve;});
    const pending=scope.refresh();env.context={...env.context,...change};release();
    assert.equal(await pending,false);assert.deepEqual(state.players,[]);assert.equal(env.renders.length,0);
  }
});

test('the latest refresh of the same account wins without a late snapshot rollback',async()=>{
  const {env,state,scope}=harness();let release;env.wait=new Promise(resolve=>{release=resolve;});
  const old=scope.refresh();env.wait=null;env.snapshots.A.players[0].name='newer';await scope.refresh();release();
  assert.equal(await old,false);assert.equal(state.players[0].name,'newer');
});

test('sporting reads retain old active matches and only hide terminal timers in memory',async()=>{
  const timer={matchId:'same-match',runningSince:1,updatedAt:1};
  for(const match of [{id:'same-match',opponent:'Calero',date:'2000-01-01',status:'in_progress'}, undefined]) {
    const input=JSON.stringify({timer,match});
    assert.equal(projectLiveTimer(timer,match?[match]:[]),timer);
    assert.equal(JSON.stringify({timer,match}),input);
  }
  for(const terminal of [{status:'finished'},{status:'closed'},{completed:true},{closedAt:1},{finishedAt:1}]) {
    const match={id:'same-match',...terminal};const before=JSON.stringify(match);
    assert.equal(projectLiveTimer(timer,[match]),null);assert.equal(JSON.stringify(match),before);
  }
  const {scope,env}=harness();env.snapshots.A.matches[0].status='finished';await scope.refresh();
  assert.equal(scope.state.timer,null);assert.equal(env.snapshots.A.settings[1].timer.phase,'first');assert.equal(env.writes.length,0);
});

test('account caches never adopt uncredited SaaS globals and preserve each team preferences',()=>{
  const local=storage(),A=account('A'),B=account('B');
  for(const key of ['theme','presets','sem','matchPreset','delegatePermissions','directFieldCache']) {
    const name=`campobase.${key}`,legacy={private:'unproven'};local.setItem(name,JSON.stringify(legacy));
    assert.equal(readViewCache(local,name,A),null);
    assert.equal(readViewCache(local,name,B),null);
    assert.deepEqual(JSON.parse(local.getItem(name)),legacy,'legacy bytes remain available for reviewed recovery');
    writeViewCache(local,name,{private:'A'},A);
    assert.deepEqual(JSON.parse(local.getItem(`${name}.unattributedBackup.v1`)),legacy);
    assert.equal(readViewCache(local,name,B),null);
    writeViewCache(local,name,{private:'B'},B);
    assert.deepEqual(readViewCache(local,name,A),{private:'A'});
    assert.deepEqual(readViewCache(local,name,B),{private:'B'});
  }
});

test('historic local-only cache and explicit isolated preview retain their own fallback',()=>{
  const local=storage();local.setItem('campobase.theme',JSON.stringify({accentColor:'#123456'}));
  assert.deepEqual(readViewCache(local,'campobase.theme',{database:'campobase',userId:''}),{accentColor:'#123456'});
  assert.equal(readViewCache(local,'campobase.theme',{database:'campobase-demo-test',userId:''}),null);
  assert.equal(readViewCache(local,'campobase.theme',account('A'),{isolated:true}),null);
});

 test('field cache metadata requires the current account and exact database',()=>{
  const local=storage(),session=storage();local.setItem('campobase.saasUserId','B');
  const current=browserCacheContext(local,session);
  assert.deepEqual(current,{userId:'B',database:'campobase_B'});
  assert.equal(cacheBelongsToAccount({players:[{id:'p'}]},current),false);
  assert.equal(cacheBelongsToAccount({saasUserId:'A',database:'campobase_A'},current),false);
  assert.equal(cacheBelongsToAccount({saasUserId:'B',database:'campobase_A'},current),false);
  assert.equal(cacheBelongsToAccount({saasUserId:'B',database:'campobase_B'},current),true);
 });
