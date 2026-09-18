import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../js/ejercicios-nuevo-formato.js', import.meta.url), 'utf8');

test('solo las 12 versiones actuales del ZIP están activas', () => {
  assert.match(source, /RAW_EJERCICIOS_NUEVO_FORMATO = \[e01, e02, e03, e04, e05, e06, e07, e08, e09, e10, e11, e12\]/);
  assert.doesNotMatch(source, /RAW_EJERCICIOS_NUEVO_FORMATO = \[[^\]]*e13/);
});

test('las 4 versiones anteriores se conservan archivadas sin publicarlas como actuales', () => {
  assert.match(source, /EJERCICIOS_NUEVO_FORMATO_ARCHIVADOS = Object\.freeze\(\[e13, e14, e15, e16\]\)/);
});
