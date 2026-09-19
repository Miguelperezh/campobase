import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const cloud = await readFile(new URL('../js/supabase-client.js', import.meta.url), 'utf8');

test('si Supabase ya tiene PIN válidos la app los carga antes de decidir que es configuración inicial', () => {
  assert.match(cloud, /export async function getRemoteMainSettings\(\)/);
  assert.match(cloud, /\.eq\('id', 'main'\)/);
  assert.match(app, /async function hydratePinSettingsFromSupabase\(\)/);
  assert.match(app, /const remote = await getRemoteMainSettings\(\)/);
  assert.match(app, /await hydratePinSettingsFromSupabase\(\);[\s\S]*const initial = !state\.settings\.ownerPinHash \|\| !state\.settings\.delegatePinHash/);
});

test('guardar PIN compara valores limpios y solo permite 4 a 8 cifras', () => {
  assert.match(app, /const cleanOwnerPin = String\(ownerPin \|\| ''\)\.trim\(\)/);
  assert.match(app, /const cleanDelegatePin = String\(delegatePin \|\| ''\)\.trim\(\)/);
  assert.match(app, /if \(cleanOwnerPin === cleanDelegatePin\)/);
  assert.match(app, /Los PIN deben tener entre 4 y 8 cifras/);
});

test('la hidratación remota no escribe ni sustituye el PIN en Supabase', () => {
  const hydrate = app.slice(app.indexOf('async function hydratePinSettingsFromSupabase'), app.indexOf('async function showAuth'));
  assert.doesNotMatch(hydrate, /put\('settings'/);
  assert.doesNotMatch(hydrate, /upsert/);
});
