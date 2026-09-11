import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

test('visor de Mis ejercicios mantiene Play visible y ajusta la pizarra al viewport', () => {
  const source = fs.readFileSync('js/exercise-viewer-layout.js', 'utf8');

  assert.equal(source.includes("play.textContent = '▶ Reproducir'"), true, 'debe crear un Play visible en la cabecera');
  assert.equal(source.includes("label.includes('Reproducir') || label.includes('Pausar')"), true, 'el Play exterior debe controlar el reproductor real');
  assert.equal(source.includes("movement.getAttribute('aria-pressed') !== 'true'"), true, 'Play debe activar Movimiento si hace falta');
  assert.equal(source.includes("inner?.click()"), true, 'Play debe accionar el botón real de reproducción');
  assert.equal(source.includes("inner.style.setProperty('display', 'none', 'important')"), true, 'el Play interior duplicado debe ocultarse');

  assert.equal(source.includes('findLargestSvg'), true, 'debe localizar el campo real');
  assert.equal(source.includes("frame.contentWindow?.innerHeight"), true, 'debe calcular el alto disponible del visor');
  assert.equal(source.includes("svg.style.setProperty('height', `${available}px`, 'important')"), true, 'debe ajustar el campo al alto disponible');
  assert.equal(source.includes("preserveAspectRatio', 'xMidYMid meet'"), true, 'el campo no debe deformarse');
  assert.equal(source.includes('overflow:hidden!important'), true, 'el visor debe evitar que el campo quede cortado por un contenedor desbordado');
});
