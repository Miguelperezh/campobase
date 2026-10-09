import test from 'node:test';
import assert from 'node:assert/strict';
import {planRoster,nextIntervalGap} from '../js/claude-time-plan.js';
test('el plan muestra los 14 convocados, también suplentes y fichas ausentes, sin agregar porteros no convocados',()=>{const ids=Array.from({length:14},(_,i)=>'p'+i);const players=ids.slice(0,13).map(id=>({id,name:id}));const rows=planRoster(players,ids,['p1','outside']);assert.equal(rows.length,14);assert.equal(rows[0].id,'p1');assert.ok(rows.some(p=>p.id==='p13'));assert.ok(!rows.some(p=>p.id==='outside'));});
test('siguiente entrada sugiere un descanso y no prolonga siempre el tramo 1',()=>{assert.deepEqual(nextIntervalGap([{from:0,to:5}],70),{from:10,to:15});assert.deepEqual(nextIntervalGap([{from:0,to:5},{from:10,to:15}],70),{from:20,to:25});assert.equal(nextIntervalGap([{from:0,to:70}],70),null);});
