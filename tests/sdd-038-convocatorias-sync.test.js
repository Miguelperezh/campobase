import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { reconcileCloudSnapshot } from '../js/sync-core.js';

test('callupBuilder filtra partidos jugados, fechas pasadas y partidos con convocatoria existente', async () => {
  const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  const builderStart = app.indexOf('function callupBuilder(');
  const builderEnd = app.indexOf('function currentCallupMatch', builderStart);
  const builderCode = app.slice(builderStart, builderEnd);

  // Excluye partidos jugados
  assert.match(builderCode, /isMatchPlayed\s*\(\s*match\s*\)/);
  // Excluye fechas pasadas
  assert.match(builderCode, /matchDay\s*<\s*todayKey/);
  // Excluye partidos que ya tienen convocatoria (por ID o por rival y fecha)
  assert.match(builderCode, /state\.callups\.some/);
  assert.match(builderCode, /normMatchOpp === normCallupOpp/);
});

test('saveCallup inicializa completed: false por defecto para convocatorias nuevas', async () => {
  const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  const saveStart = app.indexOf('async function saveCallup(');
  const saveEnd = app.indexOf('async function synchronizeRotationCounters', saveStart);
  const saveCode = app.slice(saveStart, saveEnd);

  assert.match(saveCode, /completed:\s*existing\?\.completed\s*\?\?\s*false/);
});

test('reconcileCloudSnapshot preserva registros locales ausentes en la nube cuando no hay borrado pendiente', () => {
  const localCallup = {
    id: 'callup-local-1',
    opponent: 'Barriche',
    date: '2026-10-12',
    availableIds: ['p1', 'p2'],
  };
  const cloudRecords = [
    { id: 'callup-cloud-old', opponent: 'Arucas', date: '2026-09-20' },
  ];

  // Sin mutaciones de borrado pendientes
  const reconciled = reconcileCloudSnapshot('callups', [localCallup], cloudRecords, []);
  const ids = reconciled.map((r) => r.id);

  assert.ok(ids.includes('callup-local-1'), 'El registro local debe conservarse en IndexedDB');
  assert.ok(ids.includes('callup-cloud-old'), 'El registro de la nube debe incluirse');
});

test('syncFromCloud detecta registros locales ausentes en la nube y los encola para subida', async () => {
  const db = await readFile(new URL('../js/db.js', import.meta.url), 'utf8');
  assert.match(db, /missingFromCloud = localRecords\.filter/);
  assert.match(db, /await queueInitialRecords\(store, missingFromCloud\)/);
});

test('whatsapp-suite.js se importa con versionado de cache en app.js y sw.js', async () => {
  const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  const sw = await readFile(new URL('../sw.js', import.meta.url), 'utf8');

  assert.match(app, /from '\.\/whatsapp-suite\.js\?v=20261008-whatsapp-context-1'/);
  assert.match(sw, /'\.\/js\/whatsapp-suite\.js\?v=20261008-whatsapp-context-1'/);
});

test('populateWhatsAppEvents asigna opt.value match:id y vincula convocatoria por rival y fecha', async () => {
  const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  assert.match(app, /opt\.value\s*=\s*`match:\$\{m\.id\}`/);
});

