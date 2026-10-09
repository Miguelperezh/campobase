import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeCloudRecord,reconcileCloudSnapshot,buildMutation} from '../js/sync-core.js';
import {delegateLiveSelector} from '../js/live-display-colors.js';
test('downloaded owner palette wins even when device has a newer unrelated timestamp',()=>{
 const local={id:'main',updatedAt:9000,matchPreset:1,presets:[{themeBg:'dark'}],sem:{gk:'#ff0000'},theme:{btnBg:'#ff0000',views:{delegado:{fontColor:'#00ff00'}}}};
 const remote={id:'main',updatedAt:1000,matchPreset:null,presets:[],sem:{gk:'#123456'},theme:{btnBg:'#123456'}};
 const result=mergeCloudRecord('settings',local,remote);assert.deepEqual(result.theme,remote.theme);assert.equal(result.matchPreset,null);assert.deepEqual(result.presets,[]);assert.deepEqual(result.sem,remote.sem);
 assert.deepEqual(mergeCloudRecord('settings',local,{...remote,theme:{}}).theme,{});
 assert.deepEqual(mergeCloudRecord('settings',local,{id:'main'}).theme,local.theme);
});
test('delegate tactics controls map every prefixed DOM id to its real equivalent',()=>{
 assert.equal(delegateLiveSelector('#partido #live-tactics-tools > button:nth-of-type(1)'), '#delegado #delegate-tactics-tools > button:nth-of-type(1)');
 assert.equal(delegateLiveSelector('#partido #live-tactics-full'), '#delegado #delegate-tactics-full');
});

test('owner colours edited offline stay in pending queue over an older snapshot',()=>{
 const local={id:'main',theme:{btnBg:'#123456'}};
 const remote={id:'main',theme:{btnBg:'#ff0000'}};
 const pending=buildMutation('settings','upsert',local,1000);
 const snapshot=reconcileCloudSnapshot('settings',[local],[remote],[pending]);
 assert.deepEqual(snapshot[0].theme,local.theme);assert.deepEqual(pending.payload,local);
});
