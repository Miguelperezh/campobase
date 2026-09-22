import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const supabaseClient = await readFile(new URL('../js/supabase-client.js', import.meta.url), 'utf8');

test('Realtime es la vía principal y no existe polling completo cada 10 segundos', () => {
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

test('Realtime se reintenta sin volver al polling masivo y hay reconciliación al volver a la app', () => {
  assert.match(app, /realtimeReconnectTimer/);
  assert.match(app, /ensureRealtimeSubscription\(\)\.catch\(handleError\)/);
  assert.match(app, /visibilitychange/);
  assert.match(app, /document\.visibilityState === 'visible'/);
  assert.match(app, /window\.addEventListener\('online',[\s\S]*synchronizeCloud/);
  assert.doesNotMatch(app, /se mantiene el polling de seguridad/);
});
