import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import test from 'node:test';

test('pizarra integrada guarda y borrar queda dentro del Creador', async () => {
let parentSource=fs.readFileSync('js/exercise-board-persistence.js','utf8');
parentSource=parentSource.replace("import { getAll, put, remove, syncFromCloud } from './db.js';", "const { getAll, put, remove, syncFromCloud } = globalThis.__dbMocks;");
const encoded=[1,2,3,4].map(n=>fs.readFileSync(`assets/exercise-board/part-${n}.b64`,'utf8')).join('');
const publishedHtml=zlib.gunzipSync(Buffer.from(encoded,'base64')).toString('utf8');
const scripts=[...publishedHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
const publishedIntegration=scripts.find(s=>s.includes('new URLSearchParams(location.search)')&&s.includes('campobase:exercise-board-ready'));
assert(publishedIntegration,'published board must contain its integration script');

const settings=[];
let syncCalls=0;
const parentMessageListeners=[];
const session=new Map();
const overlay={open:true,classList:{remove(n){if(n==='open')overlay.open=false}},setAttribute(){}};
const formListeners={capture:[],bubble:[]};
const form={addEventListener(type,fn,capture=false){if(type==='submit')(capture?formListeners.capture:formListeners.bubble).push(fn)}};
const backListeners=[];
const back={dataset:{},addEventListener(type,fn){if(type==='click')backListeners.push(fn)}};
const saveEdit={addEventListener(){}};
const headStyles=[];
const bodyClasses=new Set();
const childMessageListeners=[];
let childContext;
const runtimeNodes=new Map();
const manageChildren=[];
const creatorManage={append(node){manageChildren.push(node);if(node.id)runtimeNodes.set(node.id,node)}};
const creatorSelect={value:''};

function fakeElement(tag){
  const listeners={};
  return {tagName:String(tag).toUpperCase(),id:'',textContent:'',dataset:{},className:'',innerHTML:'',hidden:false,disabled:false,title:'',
    addEventListener(type,fn){(listeners[type]??=[]).push(fn)},_listeners:listeners,
    classList:{toggle(){},add(){}}};
}
const childDoc={
  scripts:[{textContent:publishedIntegration}],
  body:{
    classList:{add(v){bodyClasses.add(v)},contains(v){return bodyClasses.has(v)}},
    append(node){if(node.id)runtimeNodes.set(node.id,node);if(node.tagName==='SCRIPT')vm.runInContext(node.textContent,childContext)},
  },
  head:{append(node){if(node.id)runtimeNodes.set(node.id,node);if(node.tagName==='STYLE')headStyles.push(node.textContent)}},
  createElement:fakeElement,
  getElementById(id){
    if(runtimeNodes.has(id))return runtimeNodes.get(id);
    if(id==='exerciseForm')return form;
    if(id==='embeddedBack')return back;
    if(id==='saveBoardEdit')return saveEdit;
    if(id==='creatorExerciseSelect')return creatorSelect;
    return null;
  },
  querySelector(sel){if(sel==='.creator-manage')return creatorManage;return null},querySelectorAll(){return []},
};

const parentWindow={location:{href:'https://example.test/campobase/',reload(){}},addEventListener(type,fn){if(type==='message')parentMessageListeners.push(fn)}};
const childWindow={addEventListener(type,fn){if(type==='message')childMessageListeners.push(fn)},parent:null};
childWindow.postMessage=(data)=>{for(const fn of childMessageListeners)fn({data,source:childWindow.parent,origin:'https://example.test'})};
childWindow.parent={postMessage(data){const event={data,source:childWindow,origin:'https://example.test',stopImmediatePropagation(){}};for(const fn of parentMessageListeners)Promise.resolve(fn(event)).catch(e=>{throw e})}};

const frameLoadListeners=[];
const frame={dataset:{},src:'blob:https://example.test/board#embedded=1&mode=create',contentDocument:childDoc,contentWindow:childWindow,addEventListener(type,fn){if(type==='load')frameLoadListeners.push(fn)},closest(){return overlay}};
const parentDocument={readyState:'complete',documentElement:{},querySelectorAll(sel){return sel.includes('iframe')?[frame]:[]},addEventListener(){}};
class MutationObserver{constructor(fn){this.fn=fn}observe(){}}

const dbMocks={
  async getAll(store){assert.equal(store,'settings');return structuredClone(settings)},
  async put(store,record){assert.equal(store,'settings');const i=settings.findIndex(x=>x.id===record.id);if(i>=0)settings[i]=structuredClone(record);else settings.push(structuredClone(record));return record},
  async remove(store,id){assert.equal(store,'settings');const i=settings.findIndex(x=>x.id===id);if(i>=0)settings.splice(i,1)},
  async syncFromCloud(){syncCalls++;return {online:true,pending:0}},
};
const parentContext={globalThis:null,window:parentWindow,document:parentDocument,MutationObserver,crypto:globalThis.crypto,structuredClone,console,URL,URLSearchParams,sessionStorage:{setItem(k,v){session.set(k,v)}},setTimeout,clearTimeout,alert(msg){throw new Error('Unexpected alert: '+msg)},__dbMocks:dbMocks};
parentContext.globalThis=parentContext;vm.createContext(parentContext);

childContext={globalThis:null,window:childWindow,document:childDoc,location:{search:'',hash:'#embedded=1&mode=create',origin:'https://example.test'},console,setTimeout,clearTimeout,Set,JSON,URLSearchParams};
childContext.globalThis=childContext;vm.createContext(childContext);
vm.runInContext(`
const myExercises=[];
let editingExerciseId=null;
let boardEditContext=null;
let boardViewContext=null;
function renderMyExercises(){globalThis.renderCount=(globalThis.renderCount||0)+1}
function closeBoardView(){}
function beginBoardView(){}
`,childContext);

vm.runInContext(parentSource,parentContext);
assert.equal(frameLoadListeners.length,1);
frameLoadListeners[0]();
await new Promise(r=>setTimeout(r,10));

assert(bodyClasses.has('embedded-create'),'embedded board must activate from hash');
assert(headStyles.some(s=>s.includes('min-height:44px')&&s.includes('background:#c8102e')),'Volver must use CampoBase style');
const deleteButton=runtimeNodes.get('creatorDeleteExercise');
assert(deleteButton,'Borrar ejercicio debe existir dentro del Creador');
assert.equal(formListeners.capture.length,1);
assert.equal(formListeners.bubble.length,1);

for(const fn of formListeners.capture)fn({});
vm.runInContext(`myExercises.unshift({id:'test-persist-001',name:'PRUEBA PERSISTENCIA',saveMode:'both',duration:12,objective:'Prueba',description:'Prueba real',players:'7',material:'Balones y conos',reps:2,pause:30,intensity:'Media',staticBoard:{field:{format:'F7'},items:[],lines:[]},animatedBoard:{phases:[{id:'p1',items:[],lines:[]},{id:'p2',items:[],lines:[]}]},preview:'<svg></svg>',coverSourceType:'phase',coverPhaseId:'p1',coverPhaseName:'Inicio',coverFrameProgress:0});`,childContext);
for(const fn of formListeners.bubble)fn({});
await new Promise(r=>setTimeout(r,40));

assert.equal(settings.length,1,'exercise must persist in settings');
assert.equal(settings[0].customBoard,true);
assert.equal(settings[0].boardAnimation.phases.length,2);

creatorSelect.value='test-persist-001';
for(const fn of deleteButton._listeners.click||[])await fn({});
await new Promise(r=>setTimeout(r,20));
assert.equal(settings.length,0,'Borrar desde el Creador debe eliminar el registro');
const remaining=vm.runInContext('myExercises.length',childContext);
assert.equal(remaining,0,'el Creador debe refrescar su lista después de borrar');

assert(backListeners.length>=1);
backListeners.at(-1)({preventDefault(){},stopImmediatePropagation(){}});
assert.equal(overlay.open,false);
assert.equal(frame.src,'about:blank');
assert(syncCalls>=2,'guardar y borrar deben confirmarse con Supabase');
});
