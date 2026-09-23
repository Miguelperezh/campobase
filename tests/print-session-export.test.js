import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  resolveExerciseData,
  buildSingleExerciseHtml,
  buildTrainingSessionHtml,
  printSingleExercise,
  printTrainingSession,
} from '../js/print-session-export.js';

const appSource = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const viewerSource = fs.readFileSync(new URL('../js/ejercicio-viewer.js', import.meta.url), 'utf8');
const stylesSource = fs.readFileSync(new URL('../styles-redesign.css', import.meta.url), 'utf8');

test('resolveExerciseData resuelve datos de ejercicios validados y genéricos', () => {
  const mockState = {
    exercises: [
      {
        id: 'custom-ex-1',
        name: 'Rondo 4v2 de presión',
        category: 'Rondos',
        duration: '20 min',
        space: '15x15m',
        players: '6 jugadores',
        material: '6 conos, 1 balón',
        preview: 'https://example.com/rondo.png',
        description: 'Mantener la posesión con apoyos rápidos.',
        rules: 'Máximo dos toques por jugador.',
      },
    ],
  };

  const data = resolveExerciseData('custom-ex-1', mockState);
  assert.equal(data.name, 'Rondo 4v2 de presión');
  assert.equal(data.category, 'Rondos');
  assert.equal(data.duration, '20 min');
  assert.equal(data.space, '15x15m');
  assert.equal(data.players, '6 jugadores');
  assert.equal(data.material, '6 conos, 1 balón');
  assert.equal(data.preview, 'https://example.com/rondo.png');
  assert.match(data.description, /Mantener la posesión/);
  assert.match(data.rules, /dos toques/);
});

test('resolveExerciseData descarta URLs de video como preview gráfico estático', () => {
  const data = resolveExerciseData({
    id: 'video-only',
    name: 'Ejercicio con video',
    preview: 'https://example.com/clip.mp4',
  });
  assert.equal(data.preview, '');
});

test('buildSingleExerciseHtml genera estructura compacta de 1 sola página A4', () => {
  const state = { teamName: 'Cadete A CD Laguna' };
  const exercise = {
    id: 'ex-a4-test',
    name: 'Rueda de pase y tercer hombre',
    category: 'Pases',
    duration: 15,
    space: '25x20m',
    players: '10 jugadores',
    material: '8 conos, 4 balones',
    preview: 'https://example.com/pitch.png',
    description: 'Secuencia de pases en rombo buscando la descarga de cara.',
    rules: 'Orientación corporal siempre hacia adelante.',
    tips: 'Asegurar la velocidad del pase tenso.',
    organization: 'Grupos de 5 en cada rombo.',
  };

  const html = buildSingleExerciseHtml(exercise, state);

  // Verificaciones de contenido
  assert.match(html, /id="cb-print-root"/);
  assert.match(html, /class="cb-print-root cb-print-exercise-page"/);
  assert.match(html, /Cadete A CD Laguna/);
  assert.match(html, /FICHA TÉCNICA DE ENTRENAMIENTO/);
  assert.match(html, /Rueda de pase y tercer hombre/);
  assert.match(html, /15 min/);
  assert.match(html, /25x20m/);
  assert.match(html, /10 jugadores/);
  assert.match(html, /8 conos, 4 balones/);
  assert.match(html, /src="https:\/\/example\.com\/pitch\.png"/);
  assert.match(html, /Secuencia de pases en rombo/);
  assert.match(html, /Orientación corporal siempre hacia adelante/);
  assert.match(html, /Asegurar la velocidad del pase tenso/);
  assert.match(html, /Grupos de 5 en cada rombo/);
});

test('buildSingleExerciseHtml genera diagrama de pizarra de campo CSS si no hay preview disponible', () => {
  const exercise = {
    id: 'no-preview',
    name: 'Juego de posesión 5v5',
  };

  const html = buildSingleExerciseHtml(exercise, {});
  assert.match(html, /cb-print-pitch-diagram/);
  assert.match(html, /cb-print-pitch-lines/);
  assert.match(html, /cb-print-pitch-circle/);
  assert.match(html, /⚽ Juego de posesión 5v5/);
});

test('buildTrainingSessionHtml genera hoja de sesión ultra-compacta (2 tareas por cara)', () => {
  const state = {
    teamName: 'Juvenil Preferente',
    exercises: [
      {
        id: 'e1',
        name: 'Rueda de activación',
        category: 'Calentamiento',
        duration: '15 min',
        material: 'Conos y balones',
        description: 'Rueda técnica por tríos.',
      },
      {
        id: 'e2',
        name: 'Posesión 6v6+2',
        category: 'Principal',
        duration: '25 min',
        material: 'Petos y setas',
        description: 'Conservación en espacio reducido con comodines interiores.',
        rules: 'Gol tras 6 pases.',
      },
      {
        id: 'e3',
        name: 'Partido condicionado 8v8',
        category: 'Final',
        duration: '30 min',
        material: 'Porterías portátiles',
        description: 'Juego real con presión tras pérdida en 5 segundos.',
      },
    ],
  };

  const session = {
    id: 'sess-100',
    name: 'Sesión Táctica - Salida de Balón',
    date: '2026-10-15',
    time: '19:30',
    pitch: 'Campo Municipal 1',
    notes: 'Priorizar ritmo de circulación y apoyo en bandas.',
    blocks: [
      { type: 'warmup', exerciseId: 'e1', duration: 15 },
      { type: 'main', exerciseId: 'e2', duration: 25 },
      { type: 'final', exerciseId: 'e3', duration: 30 },
    ],
  };

  const html = buildTrainingSessionHtml(session, state);

  assert.match(html, /id="cb-print-root"/);
  assert.match(html, /cb-print-session-page/);
  assert.match(html, /Juvenil Preferente/);
  assert.match(html, /Sesión Táctica - Salida de Balón/);
  assert.match(html, /19:30/);
  assert.match(html, /Campo Municipal 1/);
  assert.match(html, /70 min \(3 tareas\)/);
  assert.match(html, /Priorizar ritmo de circulación/);

  // Las 3 tareas presentes con sus badges y etiquetas
  assert.match(html, /#1/);
  assert.match(html, /Calentamiento/);
  assert.match(html, /Rueda de activación/);

  assert.match(html, /#2/);
  assert.match(html, /Parte Principal/);
  assert.match(html, /Posesión 6v6\+2/);
  assert.match(html, /Gol tras 6 pases/);

  assert.match(html, /#3/);
  assert.match(html, /Juego \/ Vuelta a la Calma/);
  assert.match(html, /Partido condicionado 8v8/);
});

test('buildTrainingSessionHtml devuelve cadena vacía si no existe la sesión', () => {
  const html = buildTrainingSessionHtml('session-inexistente', { trainingSessions: [] });
  assert.equal(html, '');
});

test('estilos de impresión en styles-redesign.css garantizan aislamiento de pantalla y compacidad A4', () => {
  // En pantalla está oculto
  assert.match(stylesSource, /#cb-print-root\s*\{\s*display:\s*none\s*!important;\s*\}/);

  // Reglas de @media print
  assert.match(stylesSource, /@media print/);
  assert.match(stylesSource, /@page\s*\{\s*size:\s*A4 portrait;\s*margin:\s*8mm 10mm;\s*\}/);
  assert.match(stylesSource, /body\s*>\s*\*:not\(#cb-print-root\)\s*\{\s*display:\s*none\s*!important;\s*\}/);

  // Reglas de compacidad y saltos de página
  assert.match(stylesSource, /\.cb-print-exercise-page\s*\{[\s\S]*?break-inside:\s*avoid/);
  assert.match(stylesSource, /\.cb-print-exercise-page\s*\{[\s\S]*?max-height:\s*275mm/);
  assert.match(stylesSource, /\.cb-print-session-task\s*\{[\s\S]*?break-inside:\s*avoid/);
});

test('js/app.js y js/ejercicio-viewer.js integran botones y delegación de impresión', () => {
  // Botones en lista de sesiones y detalle
  assert.match(appSource, /class="print-session icon-button secondary"/);
  assert.match(appSource, /🖨️ Imprimir Ficha de Sesión/);
  assert.match(appSource, /printTrainingSession\(btn\.dataset\.id,\s*state\)/);

  // Botón en visor de ejercicio
  assert.match(viewerSource, /class="print-exercise-sheet secondary btn-print-exercise"/);
  assert.match(appSource, /printSingleExercise\(btn\.dataset\.id,\s*state\)/);

  // Métodos expuestos en window.__campobase
  assert.match(appSource, /printSingleExercise/);
  assert.match(appSource, /printTrainingSession/);
});

test('executePrint inyecta en DOM y llama a window.print()', () => {
  let printed = false;
  let addedElement = null;

  const fakeDocument = {
    getElementById(id) {
      return id === 'cb-print-root' ? addedElement : null;
    },
    createElement(tag) {
      return {
        tagName: tag.toUpperCase(),
        id: '',
        innerHTML: '',
        querySelectorAll() { return []; },
        remove() { addedElement = null; },
      };
    },
    body: {
      appendChild(node) {
        addedElement = node;
      },
    },
  };

  const fakeWindow = {
    addEventListener(evt, fn) {},
    print() {
      printed = true;
    },
  };

  // Asignamos al entorno de test
  const prevDoc = globalThis.document;
  const prevWin = globalThis.window;
  globalThis.document = fakeDocument;
  globalThis.window = fakeWindow;

  try {
    printSingleExercise({ id: 'test-dom-ex', name: 'Presión alta' }, { teamName: 'Test FC' });
    assert.ok(addedElement, 'Debe haber creado e insertado el elemento en body');
    assert.equal(addedElement.id, 'cb-print-root');
    assert.ok(printed, 'Debe haber ejecutado window.print()');
  } finally {
    globalThis.document = prevDoc;
    globalThis.window = prevWin;
  }
});
