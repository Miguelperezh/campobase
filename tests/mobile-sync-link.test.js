import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import {mobileAppLink,cleanLegacyMobileLink} from '../js/backup-safety.js';

const root = new URL('../', import.meta.url);
const appSource = await readFile(new URL('js/app.js', root), 'utf8');
const indexSource = await readFile(new URL('index.html', root), 'utf8');

test('index.html incluye diálogo de sincronización con el móvil con WhatsApp y enlace directo', () => {
  assert.match(indexSource, /id="mobile-sync-dialog"/, 'Debe existir diálogo #mobile-sync-dialog');
  assert.match(indexSource, /id="mobile-sync-wa-btn"/, 'Debe existir botón WhatsApp para móvil');
  assert.match(indexSource, /id="mobile-sync-copy-btn"/, 'Debe existir botón para copiar enlace');
  assert.match(indexSource, /id="mobile-sync-json-btn"/, 'Debe existir opción para descarga JSON');
});

test('el enlace móvil abre la app y pide acceso propio sin compartir identidad ni tokens', async () => {
  const start=appSource.indexOf('async function buildMobileSyncPayload()');
  const end=appSource.indexOf('async function shareDatabaseToMobile()',start);
  assert.ok(start>=0&&end>start);
  const context=vm.createContext({mobileAppLink,myTeamName:()=> 'Equipo A',window:{location:{href:'https://app.test/campobase/?sync=owner&team=owner-A&pin=1234&perms=ajustes#session=private-token'}},encodeURIComponent});
  vm.runInContext(appSource.slice(start,end),context);
  const payload=await vm.runInContext('buildMobileSyncPayload()',context);
  assert.equal(payload.syncUrl,'https://app.test/campobase/');
  const text=new URL(payload.waUrl).searchParams.get('text');
  assert.match(text,/inicia sesión con tu propia cuenta o PIN/);
  for(const secret of ['owner-A','1234','private-token','#session=','access_token','refresh_token'])assert.equal(JSON.stringify(payload).includes(secret),false);
});

test('un enlace legacy retira la sesión antigua y exige autenticación sin vincular su team de URL', () => {
  const result=cleanLegacyMobileLink('https://app.test/campobase/?sync=owner&team=A#session=private-token');
  assert.equal(result.removed,true);assert.equal(result.url,'https://app.test/campobase/');
  assert.match(appSource,/cleanLegacyMobileLink\(window\.location\.href\)/);
  assert.match(appSource,/window\.history\.replaceState\(\{\}, document\.title, legacyMobileLink\.url\)/);
  assert.doesNotMatch(appSource,/client\.auth\.setSession|setBoundSaasUserId\(teamParam\)/);
  assert.match(appSource,/if \(!autoLoggedInDelegate && !await restoreSessionRole\(\)\)/);
});
