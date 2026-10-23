import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const staff=readFileSync(new URL('../js/staff-management.js',import.meta.url),'utf8');
test('a cancelled staff read keeps the next account screen and is not reported as a connection error',async()=>{
 const events=[];
 const scope=vm.createContext({getAll:async()=>{throw Object.assign(Error('old account'),{code:'CAMPOBASE_CONTEXT_CHANGED'});},console:{error:()=>events.push('error')},$:()=>({}),renderStaffList:()=>events.push('render'),refreshPlantillaStaff:()=>events.push('other-render')});
 const read=staff.slice(staff.indexOf('export async function getStaffMembers'),staff.indexOf('export async function saveStaffMember'));
 const refresh=staff.slice(staff.indexOf('export async function refreshStaffView'),staff.indexOf('let staffCropper'));
 vm.runInContext((read+refresh).replaceAll('export ',''),scope);
 assert.equal(await scope.getStaffMembers(),null);await scope.refreshStaffView();assert.deepEqual(events,[]);
});
test('boot does not execute historical exercise deletions and retries a cancelled account read',()=>{
 const init=app.slice(app.indexOf('async function init()'));
 assert.doesNotMatch(init,/await ensureLegacyExercisesNotPresent\(/);
 assert.match(init,/try \{await refresh\(\);break;\}/);
 assert.match(init,/if\(error\?\.code!=='CAMPOBASE_CONTEXT_CHANGED'\)throw error/);
});
test('expected account cancellation does not toast or log errors into the next session',()=>{
 const messages=[];const scope=vm.createContext({console:{error:()=>messages.push('error')},toast:()=>messages.push('toast')});
 vm.runInContext(app.slice(app.indexOf('function handleError('),app.indexOf('\n',app.indexOf('function handleError('))),scope);
 scope.handleError({code:'CAMPOBASE_CONTEXT_CHANGED',message:'old'});assert.deepEqual(messages,[]);
 scope.handleError({message:'network'});assert.deepEqual(messages,['error','toast']);
});
