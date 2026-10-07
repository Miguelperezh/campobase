import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const appCode=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const authCode=readFileSync(new URL('../js/saas-auth-ui-v2.js',import.meta.url),'utf8');
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
test('PIN titular no revela la app hasta autenticar, descargar y cargar sus datos',async()=>{
 const auth=deferred(),download=deferred(),events=[];let bound='';
 const context={state:{players:[],cloudConnected:false},navigator:{onLine:true},console,getSupabaseAuthClient:()=>({}),signInWithCampoBasePin:async()=>{await auth.promise;return {user:{id:'owner'}};},setBoundSaasUserId:id=>{bound=id;},configureRealDatabase:()=>events.push('bind'),getBoundSaasUserId:()=>bound,sessionStorage:{setItem(){}},synchronizeCloud:async()=>{await download.promise;context.state.cloudConnected=true;events.push('download');},refresh:async()=>{context.state.players=[{id:'real-player'}];events.push('refresh');},applyRole:role=>events.push(role),$:()=>({close:()=>events.push('close')}),renderAll:()=>events.push('render')};
 vm.createContext(context);const start=appCode.indexOf('async function completePinLogin(');vm.runInContext(appCode.slice(start,appCode.indexOf('async function submitAuth',start)),context);
 const result=vm.runInContext("completePinLogin('owner','1234','owner')",context);
 await new Promise(r=>setImmediate(r));assert.deepEqual(events,[]);
 auth.resolve();await new Promise(r=>setImmediate(r));assert.deepEqual(events,['bind']);
 download.resolve();await result;assert.deepEqual(events,['bind','download','refresh','owner','close','render']);
});
test('restaurar cuenta autenticada no convierte el PIN de delegado en titular ni abre antes de descargar',async()=>{
 const loading=deferred(),events=[];const dialog={open:true,close(){this.open=false;events.push('close');}};
 const app={state:{role:null},synchronizeCloud:async()=>{await loading.promise;events.push('download');},refresh:async()=>events.push('refresh'),renderAll:()=>events.push('render'),applyRole:role=>events.push(role)};
 const context={getCurrentSession:async()=>({user:{id:'owner'}}),getBoundSaasUserId:()=> 'owner',markBrowserSessionActive(){},getProfileOrFallback:async()=>({role:'owner'}),waitForApp:async()=>app,sessionStorage:{getItem:()=> 'delegate',setItem(){}},document:{body:{classList:{remove(){},toggle(){}}},documentElement:{dataset:{}}},$:selector=>selector==='#auth-dialog'?dialog:null,console};
 vm.createContext(context);const start=authCode.indexOf('async function unlockBoundSession(');vm.runInContext(authCode.slice(start,authCode.indexOf('async function handlePersistentSession',start)),context);
 const result=vm.runInContext('unlockBoundSession({})',context);await new Promise(r=>setImmediate(r));assert.equal(dialog.open,true);assert.equal(app.state.role,null);
 loading.resolve();await result;assert.equal(app.state.role,'delegate');assert.equal(app.state.delegateMode,true);assert.equal(dialog.open,false);assert.deepEqual(events,['download','refresh','render','delegate','close']);
});

test('el acceso PIN importa la vinculación real de cuenta',()=>{
 assert.match(appCode,/import \{[^}]*\bsetBoundSaasUserId\b[^}]*\} from '\.\/auth-manager\.js'/);
});
