import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../js/session-planner-ui.js', import.meta.url), 'utf8');
const demo = fs.readFileSync(new URL('../js/demo-session.js', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

test('Sesiones conserva el flujo visual validado', () => {
  assert.match(source, /Objetivo de la sesión/);
  assert.match(source, /Propuesta de entrenamiento/);
  assert.match(source, /Fútbol 7/);
  assert.match(source, /Fútbol 11/);
  assert.match(source, /Duración del entrenamiento/);
  assert.match(source, /Física integrada con balón/);
  assert.match(source, /Toma de decisiones \+ juego/);
  assert.match(source, /Recuperación \/ baja carga/);
});

test('la biblioteca carga portadas JPG ligeras y no MP4 en las tarjetas', () => {
  assert.match(source, /\$\{f\}000\.jpg/);
  assert.match(source, /loading="lazy"/);
  assert.match(source, /decoding="async"/);
  assert.doesNotMatch(source, /<video[^>]*class="sp-cover/);
});

test('la biblioteca mantiene favoritos, vídeo, ver y añadir', () => {
  assert.match(source, /Solo con vídeo/);
  assert.match(source, /Solo favoritos/);
  assert.match(source, /favorite-exercise/);
  assert.match(source, /view-exercise/);
  assert.match(source, /add-exercise-to-session/);
});

test('el resumen fijo expresa minutos y permite ver o quitar ejercicios', () => {
  assert.match(source, /min de \$\{target\} min/);
  assert.match(source, /remove-session-block/);
  assert.match(source, /data-exercise-id/);
  assert.match(source, /position:sticky/);
});

test('el buscador global usa el formato validado en todas las pestañas', () => {
  assert.match(source, /i\.placeholder='Buscar'/);
  assert.match(source, /\.search-bar:before\{content:"Buscar"/);
  assert.match(source, /background:var\(--brand\)/);
});

test('2459 queda integrado en carga, cache y check', () => {
  assert.match(demo, /session-planner-ui\.js\?v=2459/);
  assert.match(sw, /sessionplanner-2459/);
  assert.match(sw, /session-planner-ui\.js\?v=2459/);
  assert.match(pkg.scripts.check, /node --check js\/session-planner-ui\.js/);
  assert.equal(pkg.version, '2.44.0');
});
