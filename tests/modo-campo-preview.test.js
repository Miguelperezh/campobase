import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Modo Campo permanece aislado y en solo lectura', async () => {
  const source = await read('js/modo-campo-preview.js');
  assert.match(source, /import \{ getAll \} from '\.\/db\.js';/);
  assert.doesNotMatch(source, /import \{[^}]*\b(?:put|putBatch|remove)\b[^}]*\} from '\.\/db\.js';/);
  assert.match(source, /No guarda nada en CampoBase/);
  assert.match(source, /NO se guardan en el partido real/);
});

test('Modo Campo conserva los seis comportamientos validados', async () => {
  const [html, source, enhancements] = await Promise.all([
    read('modo-campo-preview.html'),
    read('js/modo-campo-preview.js'),
    read('js/modo-campo-preview-enhancements.js'),
  ]);

  // 1. Cerrar inferior en ventanas, Modo Campo y pantalla completa.
  assert.match(html, /campo-dialog-footer[\s\S]*?>Cerrar</);
  assert.match(enhancements, /field-bottom-close-bar/);
  assert.match(enhancements, /campo-fullscreen-close/);

  // 2. Controles del visor.
  for (const action of ['play', 'back', 'forward', 'zoom-out', 'reset', 'zoom-in', 'fullscreen']) {
    assert.match(source, new RegExp(`data-video-action=\\"${action}\\"`));
  }

  // 3 y 5. Apertura de ejercicios desde preparación/sesión.
  assert.match(source, />Ver todo<\/button>/);
  assert.match(source, /data-open-exercise/);
  assert.match(source, /data-session-exercises/);

  // 4. Sesiones realizadas y partidos jugados plegados.
  assert.match(source, /<details class=\"campo-fold\"><summary>Sesiones realizadas/);
  assert.match(source, /<details class=\"campo-fold\"><summary>Partidos jugados/);

  // 6. Vista rápida y completa claramente separadas.
  assert.match(source, /⚡ Vista rápida/);
  assert.match(source, /📋 Vista completa/);
  assert.match(source, /exercise-full-only/);
});

test('WhatsApp validado no se reimplementa en la prueba', async () => {
  const [html, source] = await Promise.all([
    read('modo-campo-preview.html'),
    read('js/modo-campo-preview.js'),
  ]);
  assert.match(html, /No se ha copiado ni cambiado ningún mensaje/);
  assert.match(source, /openWhatsAppStable/);
  assert.doesNotMatch(source, /buildWhatsAppMatchConvocatoria|buildWhatsAppTrainingDay|buildWhatsAppTrainingWeek/);
});

test('Modo Campo incorpora las mejoras de intuitividad previstas', async () => {
  const source = await read('js/modo-campo-preview.js');
  for (const marker of [
    'Qué toca ahora',
    'Entrenar ahora',
    'Partido ahora',
    'campo-menu-btn',
    'Preparar sesión',
    'Borrador de prueba',
    'Deshacer',
    'Solo lectura',
    'Calentamiento',
    'Posesión',
    'Finalización',
    'Defensa',
    'Portero',
  ]) {
    assert.match(source, new RegExp(marker));
  }
});
