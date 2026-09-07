import test from 'node:test';
import assert from 'node:assert/strict';
import { TACTICAS_INTERACTIVAS, findTacticaInteractiva, tacticasDeFormacion } from '../js/tacticas-interactivas.js';
import { TACTICA_1231_FRAMES } from '../js/tactica-1231-frames.js';

test('el catálogo del manual expone una única táctica maestra 1-2-3-1', () => {
  assert.equal(TACTICAS_INTERACTIVAS.length, 1);
  const t = TACTICAS_INTERACTIVAS[0];
  assert.equal(t.id, 'CAMPOBASE-TACTICA-1231-GUIA-COMPLETA');
  assert.equal(t.formacion, '1-2-3-1');
  assert.equal(t.nombre, 'Sistema 1-2-3-1');
  assert.equal(t.organizacion, '1 portero · 2 defensas · 3 medios · 1 delantero');
});

test('la táctica maestra tiene cinco bloques ordenados con contenido completo', () => {
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

test('cada bloque referencia frames reales con duraciones verificadas', () => {
  const t = TACTICAS_INTERACTIVAS[0];
  const totales = { Funciones: 189, Salida: 196, Ataque: 196, Defensa: 196, Transición: 196 };
  for (const b of t.bloques) {
    const anim = b.animacion;
    assert.ok(anim, `animación de ${b.nombre_corto}`);
    assert.match(anim.frames, /assets\/tacticas\/CAMPOBASE-TACTICA-1231-GUIA-COMPLETA\/bloque-\d\/frames\/f$/);
    assert.equal(anim.total, totales[b.nombre_corto], `total de frames de ${b.nombre_corto}`);
    const key = String(t.bloques.indexOf(b) + 1);
    assert.equal(TACTICA_1231_FRAMES[key].total, anim.total);
    assert.equal(TACTICA_1231_FRAMES[key].durations.length, anim.total);
  }
});

test('findTacticaInteractiva y tacticasDeFormacion siguen funcionando', () => {
  assert.equal(findTacticaInteractiva('CAMPOBASE-TACTICA-1231-GUIA-COMPLETA').id, 'CAMPOBASE-TACTICA-1231-GUIA-COMPLETA');
  assert.equal(findTacticaInteractiva('no-existe'), undefined);
  assert.equal(tacticasDeFormacion('1-2-3-1').length, 1);
  assert.equal(tacticasDeFormacion('1-3-2-1').length, 0);
});
