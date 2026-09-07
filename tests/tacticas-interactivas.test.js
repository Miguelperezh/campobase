import test from 'node:test';
import assert from 'node:assert/strict';
import { TACTICAS_INTERACTIVAS, findTacticaInteractiva, tacticasDeFormacion } from '../js/tacticas-interactivas.js';
import { TACTICA_1231_FRAMES } from '../js/tactica-1231-frames.js';
import { TACTICA_1213_FRAMES } from '../js/tactica-1213-frames.js';

test('el catálogo del manual expone dos tácticas maestras (1-2-3-1 y 1-2-1-3 variante)', () => {
  assert.equal(TACTICAS_INTERACTIVAS.length, 2);
  const [t1231, t1213] = TACTICAS_INTERACTIVAS;
  assert.equal(t1231.id, 'CAMPOBASE-TACTICA-1231-GUIA-COMPLETA');
  assert.equal(t1231.formacion, '1-2-3-1');
  assert.equal(t1231.nombre, 'Sistema 1-2-3-1');
  assert.equal(t1231.organizacion, '1 portero · 2 defensas · 3 medios · 1 delantero');
  assert.equal(t1213.id, 'CAMPOBASE-TACTICA-1213-GUIA-COMPLETA');
  assert.equal(t1213.formacion, '1-2-1-3');
  assert.equal(t1213.nombre, 'Sistema 1-2-1-3');
  assert.equal(t1213.organizacion, '1 portero · 2 defensas · 1 medio · 3 delanteros');
});

test('la táctica 1-2-3-1 tiene cinco bloques ordenados con contenido completo', () => {
  const t = TACTICAS_INTERACTIVAS[0];
  assert.equal(t.bloques.length, 5);
  const cortos = t.bloques.map((b) => b.nombre_corto);
  assert.deepEqual(cortos, ['Funciones', 'Salida', 'Ataque', 'Defensa', 'Transición']);
  for (const b of t.bloques) {
    assert.ok(b.id, 'cada bloque tiene id');
    assert.ok(b.titulo, 'cada bloque tiene título');
    assert.ok(b.objetivo, 'cada bloque tiene objetivo');
    assert.ok(b.idea_clave, 'cada bloque tiene idea clave');
    assert.ok(Array.isArray(b.decisiones) && b.decisiones.length, 'decisiones');
    assert.ok(Array.isArray(b.que_vigilar) && b.que_vigilar.length, 'qué vigilar');
    assert.ok(Array.isArray(b.consignas) && b.consignas.length, 'consignas');
    assert.ok(Array.isArray(b.errores) && b.errores.length, 'errores');
  }
});

test('la táctica 1-2-1-3 variante tiene tres bloques ordenados con contenido completo', () => {
  const t = TACTICAS_INTERACTIVAS[1];
  assert.equal(t.bloques.length, 3);
  const cortos = t.bloques.map((b) => b.nombre_corto);
  assert.deepEqual(cortos, ['Funciones', 'Defensa', 'Salida']);
  for (const b of t.bloques) {
    assert.ok(b.id, 'cada bloque tiene id');
    assert.ok(b.titulo, 'cada bloque tiene título');
    assert.ok(b.objetivo, 'cada bloque tiene objetivo');
    assert.ok(b.idea_clave, 'cada bloque tiene idea clave');
    assert.ok(Array.isArray(b.decisiones) && b.decisiones.length, 'decisiones');
    assert.ok(Array.isArray(b.que_vigilar) && b.que_vigilar.length, 'qué vigilar');
    assert.ok(Array.isArray(b.consignas) && b.consignas.length, 'consignas');
    assert.ok(Array.isArray(b.errores) && b.errores.length, 'errores');
  }
});

test('la variante 1-2-1-3 usa la numeración del paquete (1, 4, 5, 6, 8, 9, 10)', () => {
  const t = TACTICAS_INTERACTIVAS[1];
  assert.ok(Array.isArray(t.team) && t.team.length === 7, 'team personalizado de 7 jugadores');
  const dorsales = t.team.map((p) => p.n);
  assert.deepEqual(dorsales, ['1', '4', '5', '6', '8', '9', '10']);
});

test('cada bloque referencia frames reales con duraciones verificadas', () => {
  const t1231 = TACTICAS_INTERACTIVAS[0];
  const totales1231 = { Funciones: 189, Salida: 196, Ataque: 196, Defensa: 196, Transición: 196 };
  for (const b of t1231.bloques) {
    const anim = b.animacion;
    assert.ok(anim, `animación de ${b.nombre_corto}`);
    assert.match(anim.frames, /assets\/tacticas\/CAMPOBASE-TACTICA-1231-GUIA-COMPLETA\/bloque-\d\/frames\/f$/);
    assert.equal(anim.total, totales1231[b.nombre_corto], `total de frames de ${b.nombre_corto}`);
    const key = String(t1231.bloques.indexOf(b) + 1);
    assert.equal(TACTICA_1231_FRAMES[key].total, anim.total);
    assert.equal(TACTICA_1231_FRAMES[key].durations.length, anim.total);
  }

  const t1213 = TACTICAS_INTERACTIVAS[1];
  const totales1213 = { Funciones: 196, Defensa: 196, Salida: 196 };
  for (const b of t1213.bloques) {
    const anim = b.animacion;
    assert.ok(anim, `animación de ${b.nombre_corto}`);
    assert.match(anim.frames, /assets\/tacticas\/CAMPOBASE-TACTICA-1213-GUIA-COMPLETA\/bloque-\d\/frames\/f$/);
    assert.equal(anim.total, totales1213[b.nombre_corto], `total de frames de ${b.nombre_corto}`);
    const key = String(t1213.bloques.indexOf(b) + 1);
    assert.equal(TACTICA_1213_FRAMES[key].total, anim.total);
    assert.equal(TACTICA_1213_FRAMES[key].durations.length, anim.total);
  }
});

test('las duraciones de la variante 1-2-1-3 son 140 ms (bloques 1-2) y 107 ms (bloque 3)', () => {
  assert.ok(TACTICA_1213_FRAMES['1'].durations.every((d) => d === 140));
  assert.ok(TACTICA_1213_FRAMES['2'].durations.every((d) => d === 140));
  assert.ok(TACTICA_1213_FRAMES['3'].durations.every((d) => d === 107));
});

test('findTacticaInteractiva y tacticasDeFormacion siguen funcionando', () => {
  assert.equal(findTacticaInteractiva('CAMPOBASE-TACTICA-1231-GUIA-COMPLETA').id, 'CAMPOBASE-TACTICA-1231-GUIA-COMPLETA');
  assert.equal(findTacticaInteractiva('CAMPOBASE-TACTICA-1213-GUIA-COMPLETA').id, 'CAMPOBASE-TACTICA-1213-GUIA-COMPLETA');
  assert.equal(findTacticaInteractiva('no-existe'), undefined);
  assert.equal(tacticasDeFormacion('1-2-3-1').length, 1);
  assert.equal(tacticasDeFormacion('1-2-1-3').length, 1);
  assert.equal(tacticasDeFormacion('1-3-2-1').length, 0);
});
