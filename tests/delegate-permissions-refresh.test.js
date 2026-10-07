import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const sync=code.slice(code.indexOf('function syncDelegateModeDom()'),code.indexOf('function applyDelegateNavFilters('));
test('actualizar permisos de PIN concede y retira vistas en la misma sesión',()=>{
 let permissions=['partido','sesiones'],active='delegado';
 const context={state:{role:'delegate'},window:{__campobaseAllowedViews:['partido']},getDelegatePermissions:()=>permissions,document:{body:{classList:{add(){},remove(){}}},querySelector:()=>({id:active})},applyDelegateNavFilters(){},showView:id=>{active=id;}};
 vm.createContext(context);vm.runInContext(sync+';syncDelegateModeDom();',context);
 assert.deepEqual(Array.from(context.window.__campobaseAllowedViews),permissions);
 active='sesiones';permissions=['partido','ejercicios'];vm.runInContext('syncDelegateModeDom()',context);
 assert.deepEqual(Array.from(context.window.__campobaseAllowedViews),permissions);assert.equal(active,'delegado');
});
test('un enlace antiguo no reemplaza los permisos actuales del equipo',()=>{
 const start=code.indexOf('      if (permsParam');const end=code.indexOf('      if (pinParam)',start);
 const current=['partido','sesiones','ejercicios'];const writes=[];
 const context={state:{settings:{id:'main',delegatePermissions:current}},permsParam:'partido',localStorage:{setItem:(...args)=>writes.push(args)},put:()=>{throw Error('No debe persistir permisos del enlace');}};
 vm.createContext(context);vm.runInContext(code.slice(start,end),context);
 assert.deepEqual(context.state.settings.delegatePermissions,current);assert.equal(writes.length,0);
});
