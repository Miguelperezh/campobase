import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {signInWithCampoBasePin} from '../js/auth-manager.js';

const deferred=()=>{let resolve;const promise=new Promise(done=>resolve=done);return {promise,resolve};};
const nextTurn=()=>new Promise(resolve=>setImmediate(resolve));
const owner='11111111-2222-3333-4444-555555555555';
const other='aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
const delegated='99999999-8888-7777-6666-555555555555';
const appSource=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');

function isolatedAuth(t) {
 const previousLocal=globalThis.localStorage,previousSession=globalThis.sessionStorage;
 const values=new Map([['campobase.saasUserId',owner]]),sessionValues=new Map([['campobase.pinAccessRevision','1']]);
 globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value))};
 globalThis.sessionStorage={getItem:key=>sessionValues.get(key)??null,setItem:(key,value)=>sessionValues.set(key,String(value))};
 t.after(()=>{if(previousLocal===undefined)delete globalThis.localStorage;else globalThis.localStorage=previousLocal;if(previousSession===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=previousSession;});
 const session={access_token:'synthetic-A',refresh_token:'synthetic-refresh',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:delegated,app_metadata:{campobase_role:'delegate_pin',campobase_owner_id:owner}}};
 const state={main:{user:{id:owner}},edgeGate:null,otpGate:null,commitGate:null,verifyCalls:0,commits:0,signOuts:0};
 const client={auth:{getSession:async()=>({data:{session:state.main}}),verifyOtp:async()=>{throw Error('Main Auth must not verify OTP');},signOut:async()=>{state.signOuts++;}},
  functions:{invoke:async()=>{if(state.edgeGate)await state.edgeGate();return {data:{token_hash:'opaque',type:'email',user_id:delegated,owner_user_id:owner}};}},
  __campobaseCreatePinVerifier:()=>({auth:{verifyOtp:async()=>{state.verifyCalls++;if(state.otpGate)await state.otpGate();return {data:{session}};}}}),
  __campobaseCommitPinSession:async(verified,assertCurrent)=>{state.commits++;if(state.commitGate)await state.commitGate();assertCurrent();state.main=verified;return {data:{session:verified}};}};
 const switchAccount=()=>{values.set('campobase.saasUserId',other);sessionValues.set('campobase.pinAccessRevision','2');state.main={user:{id:other}};};
 return {client,state,session,values,switchAccount};
}

test('a late PIN endpoint or isolated OTP never replaces or signs out a later account',async t=>{
 for(const phase of ['edge','otp','commit']) {
  await t.test(phase,async t=>{
   const {client,state,values,switchAccount}=isolatedAuth(t),reached=deferred(),hold=deferred();
   state[phase+'Gate']=()=>{reached.resolve();return hold.promise;};
   const pending=signInWithCampoBasePin(client,owner,'1234','delegate');
   await reached.promise;switchAccount();hold.resolve();
   await assert.rejects(pending,error=>error.code==='CAMPOBASE_CONTEXT_CHANGED');
   assert.equal(values.get('campobase.saasUserId'),other);assert.equal(state.main.user.id,other);assert.equal(state.signOuts,0);
   if(phase==='edge')assert.equal(state.verifyCalls,0);
   if(phase!=='commit')assert.equal(state.commits,0);
  });
 }
});

test('a current isolated PIN session commits once and binds only its verified identity',async t=>{
 const {client,state,values}=isolatedAuth(t);
 const session=await signInWithCampoBasePin(client,owner,'1234','delegate');
 assert.equal(session.user.id,delegated);assert.equal(state.main.user.id,delegated);
 assert.equal(values.get('campobase.saasUserId'),delegated);assert.equal(state.verifyCalls,1);assert.equal(state.commits,1);assert.equal(state.signOuts,0);
});

test('a newer PIN attempt cancels an older attempt even before either binds another account',async t=>{
 const {client,state}=isolatedAuth(t),reached=deferred(),hold=deferred();let calls=0;
 state.edgeGate=()=>{if(++calls===1){reached.resolve();return hold.promise;}};
 const first=signInWithCampoBasePin(client,owner,'1234','delegate');await reached.promise;
 const second=await signInWithCampoBasePin(client,owner,'5678','delegate');hold.resolve();
 await assert.rejects(first,error=>error.code==='CAMPOBASE_CONTEXT_CHANGED');
 assert.equal(second.user.id,delegated);assert.equal(state.verifyCalls,1);assert.equal(state.commits,1);assert.equal(state.signOuts,0);
});

function appHarness({local=false,phase='auth'}={}) {
 let revision=0,bound=owner;const events=[],hold=deferred(),reached=deferred();
 const wait=()=>{reached.resolve();return hold.promise;};
 const context={beginPinAccess:()=>++revision,getPinAccessRevision:()=>revision,finishPinAccess:expected=>revision===expected,
  getBoundSaasUserId:()=>bound,setBoundSaasUserId:id=>{bound=id;events.push('bound '+id);},getRememberedSaasAccount:()=>null,
  state:{role:null,settings:{},players:[],cloudConnected:true},getSupabaseAuthClient:()=>({}),getCurrentSession:async()=>null,
  hasUsableTeamSnapshot:()=>local,localStorage:{getItem:()=>null,setItem(){}},sessionStorage:{setItem(){}},navigator:{onLine:true},
  signInWithCampoBasePin:async(_client,_owner,_pin,role)=>{if(phase==='auth')await wait();return {user:{id:role==='delegate'?delegated:owner,app_metadata:role==='delegate'?{campobase_role:'delegate_pin'}:{}}};},
  configureRealDatabase:()=>events.push('configure'),synchronizeCloud:async()=>{if(phase==='sync')await wait();events.push('sync');},
  refresh:async()=>events.push('refresh'),applyRole:role=>events.push(role),$:()=>({close:()=>events.push('close')}),renderAll:()=>events.push('render'),console:{warn(){}}};
 vm.createContext(context);
 const start=appSource.indexOf('async function completePinLogin('),end=appSource.indexOf('\nasync function getConfiguredPinRole(',start);
 vm.runInContext(appSource.slice(start,end),context);
 const switchAccount=()=>{revision++;bound=other;events.length=0;};
 return {context,events,reached,hold,switchAccount,getBound:()=>bound};
}

test('late owner/delegate login completion cannot bind, configure or reveal account A over B',async()=>{
 for(const role of ['owner','delegate']) {
  const h=appHarness(),pending=h.context.completePinLogin(role,'1234',owner);
  await h.reached.promise;h.switchAccount();h.hold.resolve();
  await assert.rejects(pending,error=>error.code==='CAMPOBASE_CONTEXT_CHANGED');
  assert.equal(h.getBound(),other);assert.deepEqual(h.events,[]);
 }
});

test('the local fast path discards a late background authentication after account switch',async()=>{
 const h=appHarness({local:true}),pending=h.context.completePinLogin('owner','1234',owner);
 await h.reached.promise;await pending;h.switchAccount();h.hold.resolve();await nextTurn();
 assert.equal(h.getBound(),other);assert.deepEqual(h.events,[]);
});

test('an account switch while downloading prevents the old login from refreshing or opening the app',async()=>{
 const h=appHarness({phase:'sync'}),pending=h.context.completePinLogin('delegate','1234',owner);
 await h.reached.promise;h.switchAccount();h.hold.resolve();
 await assert.rejects(pending,error=>error.code==='CAMPOBASE_CONTEXT_CHANGED');
 assert.equal(h.getBound(),other);assert.deepEqual(h.events,['sync']);
});

test('PIN role calculation cannot start a login after the selected account changes',async()=>{
 let revision=1,bound=owner,completed=0;const hold=deferred();
 const context={getPinAccessRevision:()=>revision,getBoundSaasUserId:()=>bound,getConfiguredPinRole:async()=>hold.promise,completePinLogin:async()=>completed++};
 vm.createContext(context);const start=appSource.indexOf('async function loginWithPin('),end=appSource.indexOf('\nasync function submitAuth(',start);
 vm.runInContext(appSource.slice(start,end),context);
 const pending=context.loginWithPin('1234');revision++;bound=other;hold.resolve('owner');
 await assert.rejects(pending,error=>error.code==='CAMPOBASE_CONTEXT_CHANGED');assert.equal(completed,0);
});

test('submitAuth discards a late remote login or hydration in both visible PIN forms',async()=>{
 for(const createMode of [true,false])for(const phase of ['auth','hydrate']) {
  let revision=1,bound=owner,hydrates=0;const events=[],reached=deferred(),hold=deferred();
  const button={textContent:'Entrar',disabled:false},dialog={open:true,close(){events.push('close');}},error={textContent:'Current account'};
  const form={elements:{pin:{value:'1234'},newOwnerPin:{value:'1234'},newDelegatePin:{value:'5678'}}};
  const context={getPinAccessRevision:()=>revision,getBoundSaasUserId:()=>bound,setBoundSaasUserId:id=>{bound=id;events.push('bound');},getRememberedSaasAccount:()=>null,
   state:{settings:{ownerPinHash:'configured'}},$:selector=>selector==='#auth-submit-btn'?button:selector==='#initial-pin-fields'?{classList:{contains:()=>!createMode}}:selector==='#auth-dialog'?dialog:error,
   hydratePinSettingsFromSupabase:async()=>{hydrates++;if(phase==='hydrate'&&(!createMode||hydrates>1)){reached.resolve();await hold.promise;}return false;},
   getSupabaseAuthClient:()=>({}),signInWithCampoBasePin:async()=>{if(phase==='auth'){reached.resolve();await hold.promise;}return {user:{id:owner,app_metadata:{}}};},
   getLocalPinSettingsCandidates:async()=>[],verifyPin:async()=>false,configureRealDatabase:()=>events.push('configure'),sessionStorage:{setItem(){}},
   completePinLogin:async()=>events.push('complete'),savePins:async()=>events.push('savePins'),toast:()=>events.push('toast'),console:{warn(){}}};
  vm.createContext(context);const start=appSource.indexOf('async function submitAuth('),end=appSource.indexOf('\nasync function changePins(',start);
  vm.runInContext(appSource.slice(start,end),context);
  const pending=context.submitAuth({preventDefault(){},currentTarget:form});
  await reached.promise;revision++;bound=other;events.length=0;hold.resolve();await pending;
  assert.equal(bound,other);assert.deepEqual(events,[],`${createMode}/${phase}`);assert.equal(error.textContent,'Current account');
 }
});

test('the actual client commit hook rejects a suspended SDK write at session storage before replacing B',async t=>{
 const {state,session,values,switchAccount}=isolatedAuth(t),reached=deferred(),hold=deferred();let sdkStorage;
 const main={auth:{getSession:async()=>({data:{session:state.main}}),setSession:async()=>{
  reached.resolve();await hold.promise;
  sdkStorage.setItem('synthetic-auth',JSON.stringify(session));
  state.main=session;return {data:{session}};
 }},functions:{invoke:async()=>({data:{token_hash:'opaque',user_id:delegated,owner_user_id:owner}})}};
 const verifier={auth:{verifyOtp:async()=>({data:{session}})}};
 const source=readFileSync(new URL('../js/supabase-client.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
 const end=source.indexOf('export const getSupabaseAuthClient');
 const context=vm.createContext({Map,JSON,Error,console,CLOUD_TABLES:{},localStorage:globalThis.localStorage,
  supabase:{createClient:(_url,_key,options)=>{if(options.auth.persistSession){sdkStorage=options.auth.storage;return main;}return verifier;}}});
 vm.runInContext(source.slice(0,end).replace(/^export /gm,''),context);
 const client=context.getCampoBaseSupabaseClient();
 const pending=signInWithCampoBasePin(client,owner,'1234','delegate');
 await reached.promise;switchAccount();values.set('synthetic-auth',JSON.stringify({user:{id:other}}));hold.resolve();
 await assert.rejects(pending,error=>error.code==='CAMPOBASE_CONTEXT_CHANGED');
 assert.equal(JSON.parse(values.get('synthetic-auth')).user.id,other);assert.equal(state.main.user.id,other);assert.equal(values.get('campobase.saasUserId'),other);
});
