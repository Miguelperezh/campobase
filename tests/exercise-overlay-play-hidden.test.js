import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('styles-redesign.css oculta de forma definitiva el botón de play y su icono en reproducción', () => {
  const css = fs.readFileSync('styles-redesign.css', 'utf8');

  assert.match(css, /\.video-overlay-play\.hidden/, 'Debe contemplar la clase hidden');
  assert.match(css, /\.video-overlay-play\.is-playing/, 'Debe contemplar la clase is-playing');
  assert.match(css, /\.video-overlay-play\.playing/, 'Debe contemplar la clase playing');
  assert.match(css, /\.video-overlay-play\[hidden\]/, 'Debe contemplar el atributo hidden');
  assert.match(css, /\.video-stage\.is-playing \.video-overlay-play/, 'Debe contemplar stage is-playing');
  assert.match(css, /\.exercise-video-wrap\.is-playing \.video-overlay-play/, 'Debe contemplar wrap is-playing');
  assert.match(css, /\.video-stage\.is-playing \.overlay-play-icon/, 'Debe contemplar el icono dentro de stage');
  assert.match(css, /display:\s*none\s*!important/, 'Debe forzar display none !important');
  assert.match(css, /opacity:\s*0\s*!important/, 'Debe forzar opacity 0 !important');
  assert.match(css, /visibility:\s*hidden\s*!important/, 'Debe forzar visibility hidden !important');
});

test('js/ejercicio-viewer.js gestiona el ocultamiento síncrono del botón overlay al reproducir', () => {
  const js = fs.readFileSync('js/ejercicio-viewer.js', 'utf8');

  assert.match(js, /overlayPlay\.style\.setProperty\('display',\s*'none',\s*'important'\)/, 'Debe aplicar display none important al reproducir');
  assert.match(js, /overlayPlay\.classList\.toggle\('is-playing',\s*isPlaying\)/, 'Debe conmutar is-playing');
  assert.match(js, /overlayPlay\.classList\.toggle\('hidden',\s*isPlaying\)/, 'Debe conmutar hidden');
  assert.match(js, /video\.addEventListener\('play'/, 'Debe escuchar evento play');
  assert.match(js, /video\.addEventListener\('playing'/, 'Debe escuchar evento playing');
  assert.match(js, /video\.addEventListener\('pause'/, 'Debe escuchar evento pause');
});

test('los visores standalone library-v2 ocultan el botón overlay con display none !important', () => {
  const preview = fs.readFileSync('library-v2-preview.html', 'utf8');
  const viewer = fs.readFileSync('library-v2/viewer/index.html', 'utf8');

  for (const [name, content] of [['library-v2-preview.html', preview], ['library-v2/viewer/index.html', viewer]]) {
    assert.match(content, /\.video-overlay-play\.playing[\s\S]*?display:\s*none\s*!important/, `${name} debe ocultar overlay con display none !important`);
    assert.match(content, /videoOverlayPlay\.classList\.add\('playing',\s*'hidden'\)/, `${name} debe añadir playing y hidden en togglePlay`);
    assert.match(content, /videoOverlayPlay\.style\.setProperty\('display',\s*'none',\s*'important'\)/, `${name} debe forzar inline display none !important`);
  }
});

test('versión de caché en sw.js e index.html están sincronizadas a v=2498', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const html = fs.readFileSync('index.html', 'utf8');

  assert.match(sw, /2498/, 'sw.js debe contener la versión 2498');
  assert.match(html, /styles-redesign\.css\?v=2498/, 'index.html debe cargar styles-redesign.css con v=2498');
  assert.match(html, /js\/app\.js\?v=2498/, 'index.html debe cargar js/app.js con v=2498');
});
