import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { mergeCloudRecord } from '../js/sync-core.js';
import vm from 'node:vm';
import {readViewCache,writeViewCache} from '../js/account-view-context.js';

const [appCode, cssCode, navCode] = await Promise.all([
  readFile(new URL('../js/app.js', import.meta.url), 'utf8'),
  readFile(new URL('../styles-redesign.css', import.meta.url), 'utf8'),
  readFile(new URL('../js/redesign-nav.js', import.meta.url), 'utf8'),
]);

test('mergeCloudRecord conserva delegatePermissions y delegatePin para que la nube no los borre', () => {
  const local = {
    id: 'main',
    format: 'F7',
    delegatePin: '1234',
    delegatePermissions: ['partido', 'plantilla', 'modo-campo', 'convocatorias'],
  };
  const cloud = {
    id: 'main',
    format: 'F7',
  };
  const merged = mergeCloudRecord('settings', local, cloud);
  assert.deepEqual(merged.delegatePermissions, ['partido', 'plantilla', 'modo-campo', 'convocatorias']);
  assert.equal(merged.delegatePin, '1234');
});

test('los permisos se recuperan solo de la caché de su cuenta y una retirada explícita prevalece', () => {
  assert.match(appCode, /readAccountCache\('campobase\.delegatePermissions'/);
  assert.match(appCode, /writeAccountCache\('campobase\.delegatePermissions'/);
  const data=new Map([['campobase.delegatePermissions',JSON.stringify(['ajustes'])]]);
  const storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
  let userId='A',loaded='A';
  const current=()=>({userId,database:`campobase_${userId}`});
  const state={settings:{}};
  const context=vm.createContext({state,getBoundSaasUserId:()=>userId,viewAccountIsCurrent:()=>loaded===userId,readAccountCache:(key,fallback)=>readViewCache(storage,key,current())??fallback});
  const start=appCode.indexOf('function getDelegatePermissions()'),end=appCode.indexOf('function delegateHasPermission',start);
  vm.runInContext(appCode.slice(start,end),context);
  const permissions=()=>Array.from(vm.runInContext('getDelegatePermissions()',context));
  assert.deepEqual(permissions(),[]);
  writeViewCache(storage,'campobase.delegatePermissions',['partido'],current());
  assert.deepEqual(permissions(),['partido']);
  state.settings.delegatePermissions=['partido'];userId='B';
  assert.deepEqual(permissions(),[]);
  writeViewCache(storage,'campobase.delegatePermissions',['plantilla'],current());
  assert.deepEqual(permissions(),['plantilla']);
  loaded='B';state.settings.delegatePermissions=[];
  assert.deepEqual(permissions(),[]);
});

test('en delegado multi-vista, #delegado se oculta limpiamente al ver plantilla o convocatorias', () => {
  assert.match(cssCode, /body\.delegate-mode\.delegate-multi-view #delegado\.view:not\(\.active\)/);
  assert.match(cssCode, /body\.delegate-mode\.delegate-multi-view #plantilla\.view:not\(\.active\)/);
  assert.match(cssCode, /body\.delegate-mode\.delegate-multi-view #convocatorias\.view:not\(\.active\)/);
});

test('observadores de redesign-nav están optimizados para evitar lentitud y recargas innecesarias', () => {
  // Solo reacciona a cambios de vistas en el DOM de la app
  assert.match(navCode, /const hasViewChange = mutations\.some\(\(m\) => m\.target\?\.classList\?\.contains\('view'\)\);/);

  // Solo reacciona a diálogos y overlays reales para el botón cerrar inferior
  assert.match(navCode, /nodeName === 'DIALOG'/);
});

test('triggerStandardView y bottom-nav actualizan estado activo y renderizan convocatorias y delegado', () => {
  assert.match(navCode, /window\.__campobase(?:\?\.|\.)renderCallups/);
  assert.match(navCode, /window\.__campobase(?:\?\.|\.)renderDelegate/);
  assert.match(navCode, /window\.triggerStandardView = triggerStandardView;/);
  assert.match(appCode, /window\.__campobase = \{[\s\S]*?syncDelegateModeDom/);
});
