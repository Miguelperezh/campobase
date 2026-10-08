import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const appSource = await readFile(new URL('js/app.js', root), 'utf8');
const indexSource = await readFile(new URL('index.html', root), 'utf8');

test('index.html incluye diálogo de sincronización con el móvil con WhatsApp y enlace directo', () => {
  assert.match(indexSource, /id="mobile-sync-dialog"/, 'Debe existir diálogo #mobile-sync-dialog');
  assert.match(indexSource, /id="mobile-sync-wa-btn"/, 'Debe existir botón WhatsApp para móvil');
  assert.match(indexSource, /id="mobile-sync-copy-btn"/, 'Debe existir botón para copiar enlace');
  assert.match(indexSource, /id="mobile-sync-json-btn"/, 'Debe existir opción para descarga JSON');
});

test('app.js construye payload de sincronización móvil con teamId y sesión en hash', () => {
  assert.match(appSource, /function buildMobileSyncPayload\(\)/, 'Debe existir buildMobileSyncPayload');
  assert.match(appSource, /\?sync=owner/, 'Debe generar enlace con parámetro sync=owner');
  assert.match(appSource, /#session=/, 'Debe transferir la sesión mediante hash seguro');
});

test('app.js restaura la sesión transferida y sincroniza con la nube al abrir enlace en móvil', () => {
  assert.match(appSource, /syncParam === 'owner'/, 'Debe detectar sync=owner');
  assert.match(appSource, /hash\.startsWith\('#session='\)/, 'Debe procesar sesión transferida en el hash');
  assert.match(appSource, /client\.auth\.setSession/, 'Debe restaurar sesión de Supabase con setSession');
});
