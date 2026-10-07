import test from 'node:test';
import assert from 'node:assert/strict';
import {beginPinAccess, finishPinAccess, lockPinAccess, clearPinAccess, isPinAccessLocked, isPinAccessSession, getPinAccessRevision} from '../js/auth-manager.js';

test('cambiar PIN bloquea la app, invalida restauraciones anteriores y conserva la conexión',()=>{
 const items=new Map();globalThis.sessionStorage={getItem:key=>items.get(key)||null,setItem:(key,value)=>items.set(key,value),removeItem:key=>items.delete(key)};
 const first=beginPinAccess();assert.equal(isPinAccessLocked(),true);assert.equal(isPinAccessSession(),true);
 assert.equal(finishPinAccess(first),true);assert.equal(isPinAccessLocked(),false);
 lockPinAccess();assert.equal(finishPinAccess(first),false);assert.equal(isPinAccessLocked(),true);
 const next=beginPinAccess();assert.equal(finishPinAccess(next),true);assert.equal(isPinAccessSession(),true);
 clearPinAccess();assert.equal(isPinAccessSession(),false);assert.equal(isPinAccessLocked(),false);assert(getPinAccessRevision()>next);
 assert.equal(items.has('campobase.saasUserId'),false);delete globalThis.sessionStorage;
});
test('el acceso PIN sigue funcionando cuando el navegador bloquea sessionStorage',()=>{
 globalThis.sessionStorage={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}};
 const first=beginPinAccess();assert.equal(isPinAccessLocked(),true);assert.equal(finishPinAccess(first),true);
 lockPinAccess();assert.equal(finishPinAccess(first),false);clearPinAccess();assert.equal(isPinAccessLocked(),false);assert.equal(isPinAccessSession(),false);delete globalThis.sessionStorage;
});
