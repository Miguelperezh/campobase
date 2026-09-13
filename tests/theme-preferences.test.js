import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');
const css = fs.readFileSync('styles-redesign.css', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

test('index.html no contiene el texto de advertencia de Privacidad y límites', () => {
  assert.doesNotMatch(html, /Privacidad y límites/, 'No debe existir el panel de Privacidad y límites');
  assert.doesNotMatch(html, /publishable key está incluida en la app pública/, 'No debe existir el texto explicativo de la key pública');
});

test('index.html carga Google Fonts para tipografías deportivas y legibles en cualquier dispositivo', () => {
  assert.match(html, /fonts\.googleapis\.com/, 'Debe conectar con Google Fonts');
  assert.match(html, /Barlow\+Condensed/, 'Debe cargar Barlow Condensed para estilo deportivo');
  assert.match(html, /Inter/, 'Debe cargar Inter para máxima legibilidad');
  assert.match(html, /JetBrains\+Mono/, 'Debe cargar JetBrains Mono para pizarra técnica');
  assert.match(html, /Outfit/, 'Debe cargar Outfit para estilo moderno');
});

test('index.html incluye los 13 fondos de la app con chips visuales', () => {
  const backgrounds = [
    'default', 'dark', 'pitch-vivid', 'navy', 'ocean',
    'charcoal', 'steel', 'burgundy', 'purple', 'light',
    'warm', 'sepia', 'high-vis'
  ];
  for (const bg of backgrounds) {
    assert.match(html, new RegExp(`data-bg="${bg}"`), `Falta el botón para el fondo ${bg}`);
  }
});

test('index.html ofrece escalas de tamaño gigantes y grosores de alto contraste', () => {
  assert.match(html, /value="huge"/);
  assert.match(html, /value="enormous"/);
  assert.match(html, /value="ultra"/);
  assert.match(html, /value="extrabold"/);
  assert.match(html, /value="ultra-bold"/);
});

test('styles-redesign.css define reglas para todos los fondos y escalas de hasta 32px', () => {
  assert.match(css, /html\[data-font-scale="ultra"\]\s*\{\s*font-size:\s*32px/);
  assert.match(css, /\[data-theme-bg="burgundy"\]/);
  assert.match(css, /\[data-theme-bg="ocean"\]/);
  assert.match(css, /\[data-theme-bg="steel"\]/);
  assert.match(css, /\[data-theme-bg="sepia"\]/);
  assert.match(css, /\[data-theme-bg="purple"\]/);
});

test('js/app.js aplica variables directas y delegación global para reactividad instantánea', () => {
  assert.match(app, /THEME_PRESETS/);
  assert.match(app, /FONT_SCALE_MAP/);
  assert.match(app, /FONT_FAMILY_MAP/);
  assert.match(app, /updateThemeProperty/);
  assert.match(app, /document\.addEventListener\('click'/);
  assert.match(app, /document\.addEventListener\('change'/);
});

test('sw.js renueva CACHE con versión themev para actualizar PWA móvil', () => {
  assert.match(sw, /themev[3-9]/);
  assert.match(sw, /exerciseboard-2475/);
  assert.match(sw, /image-crop-utils\.js/);
});

test('Ajustes permite cambiar el color de fuentes con swatches y selector nativo', () => {
  assert.match(html, /id="theme-font-color-swatches"/);
  assert.match(html, /id="theme-font-color-picker"/);
  assert.match(html, /font-color-swatch-btn/);
  assert.match(css, /\.font-color-swatch-btn/);
  assert.match(app, /theme\.fontColor/);
});

test('Plantilla incluye contenedor superior para el cuerpo técnico', () => {
  assert.match(html, /id="plantilla-staff-top"/);
  assert.match(css, /\.plantilla-staff-top/);
  assert.match(css, /\.plantilla-staff-bar/);
  assert.match(css, /\.plantilla-staff-card/);
});

test('La ficha de jugador da protagonismo a la media de liga y separa acciones', () => {
  assert.match(css, /\.player-rating-badge/);
  assert.match(css, /\.rating-tier-top/);
  assert.match(css, /\.player-card-actions-bar/);
  assert.match(app, /player-rating-badge/);
  assert.match(app, /player-card-actions-bar/);
});

test('Los diálogos de jugador y técnico integran controles de encuadre y avatar acotado', () => {
  assert.match(html, /id="player-photo-preview"/);
  assert.match(html, /id="staff-photo-preview"/);
  assert.match(html, /photo-adjust-controls/);
  assert.match(css, /\.avatar-preview-img/);
  assert.match(css, /\.photo-preview-wrapper/);
});
