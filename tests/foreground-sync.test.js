import test from 'node:test';
import assert from 'node:assert/strict';
import {installForegroundSync} from '../js/foreground-sync.js';
test('reanudar móvil o volver desde historial sincroniza sin esperar el polling suspendido',()=>{
 const page=new EventTarget(),surface=new EventTarget();page.visibilityState='hidden';let calls=0;
 const stop=installForegroundSync(()=>calls++,page,surface);
 page.dispatchEvent(new Event('visibilitychange'));surface.dispatchEvent(new Event('focus'));assert.equal(calls,0);
 page.visibilityState='visible';page.dispatchEvent(new Event('visibilitychange'));assert.equal(calls,1);
 surface.dispatchEvent(new Event('pageshow'));assert.equal(calls,2);
 surface.dispatchEvent(new Event('focus'));assert.equal(calls,3);
 stop();surface.dispatchEvent(new Event('focus'));assert.equal(calls,3);
});
