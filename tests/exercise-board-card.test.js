import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

test('Mis ejercicios no inventa contenido ni mantiene un segundo manejador de guardado', () => {
  let source = fs.readFileSync('js/runtime-refresh.js', 'utf8');
  const persistence = fs.readFileSync('js/exercise-board-persistence.js', 'utf8');

  assert.equal(source.includes('saveFromBoard'), false, 'runtime-refresh no debe guardar ejercicios');
  assert.equal(source.includes("data.type === 'campobase:exercise-saved'"), false, 'runtime-refresh no debe escuchar el evento de guardado');
  assert.equal(source.includes("put('settings'"), false, 'runtime-refresh no debe persistir settings');
  assert.equal(persistence.includes("data.type === 'campobase:exercise-saved'"), true, 'solo persistence debe escuchar el guardado legado');

  source = source.replace(
    "import { syncFromCloud, getAll } from './db.js';",
    "const syncFromCloud=async()=>({online:true,pending:0}); const getAll=async()=>[];",
  );
  source = source.replace('export function installRuntimeRefresh()', 'function installRuntimeRefresh()');
  source += '\nglobalThis.__renderCustomBoardCard = customBoardCardMarkup;';

  const context = {
    globalThis: null,
    console,
    URL,
    Blob,
    TextDecoder,
    Response,
    DecompressionStream,
    Uint8Array,
    setTimeout,
    clearTimeout,
    crypto: globalThis.crypto,
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(source, context);

  const html = context.__renderCustomBoardCard({
    id: 'E-MINE-TEST-123',
    name: 'Rondo salida',
    category: 'Mis ejercicios',
    players: '7',
    duration: 12,
    material: '4 conos y 1 balón',
    intensity: 'Media',
    objective: 'Salir de presión',
    description: 'Dos apoyos por fuera.',
    favorite: false,
    boardPreview: '<svg viewBox="0 0 10 10"></svg>',
    boardAnimation: { phases: [{ id: 'p1' }, { id: 'p2' }] },
  });

  const visibleText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  assert.equal(visibleText.includes('E-MINE-TEST-123'), false, 'el identificador interno no debe verse en la ficha');

  for (const forbidden of [
    'Montaje',
    'Desarrollo paso a paso',
    'Rotación:',
    'Qué se trabaja',
    'Qué busco',
    'Qué debo observar',
    'Correcciones breves',
    'Si sale mal',
    'Si sale bien',
    '>Editar<',
  ]) {
    assert.equal(html.includes(forbidden), false, `la ficha no debe contener: ${forbidden}`);
  }

  for (const expected of [
    'Mis ejercicios',
    'Rondo salida',
    '7',
    '12 min',
    '4 conos y 1 balón',
    'Salir de presión',
    'Dos apoyos por fuera.',
    'Plano de pizarra',
    'Ver movimiento',
    'Añadir a sesión',
    'Borrar',
  ]) {
    assert.equal(html.includes(expected), true, `la ficha debe contener: ${expected}`);
  }
});
