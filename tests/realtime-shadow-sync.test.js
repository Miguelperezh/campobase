import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const supabaseClient = await readFile(new URL('../js/supabase-client.js', import.meta.url), 'utf8');

test('Realtime cubre las cinco tablas sin polling cloud periódico de 10 segundos', () => {
  assert.match(supabaseClient, /CAMPOBASE_REALTIME_TABLES\s*=\s*Object\.freeze\(Object\.values\(CLOUD_TABLES\)\)/);
  assert.match(supabaseClient, /'postgres_changes'/);
  assert.match(supabaseClient, /event:\s*'\*',\s*schema:\s*'public',\s*table/);
  assert.match(app, /ensureRealtimeSubscription/);
  assert.doesNotMatch(app, /setInterval\(\(\) => synchronizeCloud\(\)\.catch\(handleError\),\s*10000\)/);
  assert.match(app, /setInterval\(\(\) => pollLiveState\(\)\.catch\(handleError\),\s*1000\)/);
});

test('los eventos Realtime se agrupan antes de usar la sincronización segura existente', () => {
  assert.match(app, /function scheduleRealtimeCloudSync\(\)/);
  assert.match(app, /window\.setTimeout\([\s\S]*synchronizeCloud\(\)\.catch\(handleError\);[\s\S]*250\)/);
  assert.match(app, /subscribeToChanges\([\s\S]*scheduleRealtimeCloudSync/);
});

test('sin polling continuo se conserva reconciliación al arrancar, reconectar y volver a primer plano', () => {
  assert.match(app, /window\.addEventListener\('online',[\s\S]*synchronizeCloud/);
  assert.match(app, /document\.addEventListener\('visibilitychange',[\s\S]*document\.visibilityState === 'visible'[\s\S]*synchronizeCloud/);
  assert.match(app, /window\.addEventListener\('pageshow',[\s\S]*event\.persisted[\s\S]*synchronizeCloud/);
  assert.match(app, /Sincronización en segundo plano[\s\S]*synchronizeCloud\(\)/);
});

test('si Realtime falla se reintenta por evento de fallo sin reactivar un polling continuo', () => {
  assert.match(app, /function scheduleRealtimeReconnect\(\)/);
  assert.match(app, /realtimeReconnectTimer = window\.setTimeout\([\s\S]*synchronizeCloud\(\)\.catch\(handleError\);[\s\S]*3000\)/);
  assert.match(app, /Realtime no disponible; se reintentará automáticamente/);
  assert.match(app, /No se pudo iniciar Realtime; se reintentará automáticamente/);
  assert.doesNotMatch(app, /polling de seguridad/);
});
