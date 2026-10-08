import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('saveCallup define targets correctamente y no lanza targets is not defined', async () => {
  const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  const saveCallupStart = app.indexOf('async function saveCallup(event)');
  const saveCallupEnd = app.indexOf('function currentCallupMatch', saveCallupStart);
  const saveCallupCode = app.slice(saveCallupStart, saveCallupEnd);

  // Verifica que targets se defina antes de construir el objeto callup
  assert.match(
    saveCallupCode,
    /const\s+targets\s*=\s*calculateMinuteTargets\s*\(\s*availableIds,\s*config\.duration,\s*config\.players,\s*keeperIds\s*\);/
  );
  assert.match(
    saveCallupCode,
    /const\s+callup\s*=\s*\{[^}]*targets[^}]*\};/
  );
});

test('callupBuilder filtra partidos jugados y partidos con convocatoria existente', async () => {
  const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
  const builderStart = app.indexOf('function callupBuilder(');
  const builderEnd = app.indexOf('function currentCallupMatch', builderStart);
  const builderCode = app.slice(builderStart, builderEnd);

  // Verifica que se compruebe isMatchPlayed para descartar partidos ya jugados
  assert.match(builderCode, /isMatchPlayed\s*\(\s*match\s*\)/);
  // Verifica que se compruebe si el partido ya tiene convocatoria existente
  assert.match(builderCode, /state\.callups\.some/);
});

test('theme-component-colors evita texto blanco en etiquetas de dialogs y excluye position-groups', async () => {
  const themeColors = await readFile(new URL('../js/theme-component-colors.js', import.meta.url), 'utf8');

  // Verifica que paint en dialogs excluya las etiquetas de posición
  assert.match(themeColors, /label:not\(\.position-groups label\)/);
  // Verifica que no pinte texto si es color claro sobre fondo claro de diálogo
  assert.match(themeColors, /isLightText/);
  // Verifica que el engranaje del diálogo use 'section' y data-theme-section
  assert.match(themeColors, /button\.dataset\.gearTarget\s*=\s*['"]section['"]/);
  assert.match(themeColors, /button\.dataset\.themeSection\s*=\s*dialog\.id/);
});

test('claude-color-bindings incluye sección explícita para posiciones y player-dialog', async () => {
  const bindings = await readFile(new URL('../js/claude-color-bindings.js', import.meta.url), 'utf8');

  // Verifica que se incluya la sección de Ficha de jugador y Posiciones
  assert.match(bindings, /id:\s*['"]player-dialog-sec['"]/);
  assert.match(bindings, /#player-dialog \.position-groups label/);
  assert.match(bindings, /Texto de posiciones/);
});

test('styles.css y styles-redesign.css garantizan contraste en position-groups', async () => {
  const styles = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const redesign = await readFile(new URL('../styles-redesign.css', import.meta.url), 'utf8');

  assert.match(styles, /\.position-groups label[^}]*color:\s*var\(--cb-dialog-pos-ink/);
  assert.match(redesign, /#player-dialog \.position-groups label[\s\S]*?!important/);
  assert.match(redesign, /:not\(dialog label\):not\(\.position-groups label\)/);
  assert.match(redesign, /:not\(dialog strong\):not\(\.position-groups strong\)/);
});

test('index.html incluye engranaje de personalización en player-dialog', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<dialog id="player-dialog"[^>]*data-theme-view="plantilla"/);
  assert.match(html, /data-gear-target="section" data-theme-section="player-dialog"/);
});

test('claude-color-editor gestiona previsualización de player-dialog', async () => {
  const editor = await readFile(new URL('../js/claude-color-editor.js', import.meta.url), 'utf8');
  assert.match(editor, /player-dialog-sec[\s\S]*?showModal[\s\S]*?temporaryPreview/);
});

