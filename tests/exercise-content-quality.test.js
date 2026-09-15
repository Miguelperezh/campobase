import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveTrainingFocus, exerciseObjective, normalizeSpanishFootballText } from '../js/exercise-content-quality.js';

test('el vocabulario de ficha no muestra chip', () => {
  assert.equal(normalizeSpanishFootballText('Pase de chip por encima del rival'), 'Pase picado por encima del rival');
  assert.equal(normalizeSpanishFootballText('Hacer un chip al portero'), 'picar el balón al portero');
  assert.doesNotMatch(normalizeSpanishFootballText('Tiro chip y pase chip'), /\bchip\b/i);
});

test('Qué se trabaja clasifica un 1v1 defensivo sin copiar el objetivo', () => {
  const exercise = {
    nombre: 'Defensa 1v1 zona central',
    categoria: 'Defensa y duelos',
    objetivo_principal: 'Defender el 1v1 en zona central — el más peligroso.',
    que_se_trabaja: ['Defender el 1v1 en zona central — el más peligroso.'],
    como_se_hace: ['El defensor temporiza, controla la distancia y orienta al atacante fuera de la zona central.'],
  };
  const focus = deriveTrainingFocus(exercise);
  assert.ok(focus.some((item) => /Táctica defensiva/i.test(item)));
  assert.ok(focus.some((item) => /temporización|orientación defensiva/i.test(item)));
  assert.ok(focus.every((item) => item !== exercise.objetivo_principal));
  assert.equal(exerciseObjective(exercise), exercise.objetivo_principal);
});

test('Qué se trabaja distingue reacción, decisión y técnica cuando corresponden', () => {
  const exercise = {
    nombre: 'Circuito de reacción con pase y finalización',
    categoria: 'Técnico-táctico',
    objetivo_principal: 'Resolver con rapidez tras una señal del entrenador.',
    detalle: {
      desarrollo: ['Reaccionar al estímulo de color, elegir apoyo, dar el pase y finalizar a portería.'],
    },
  };
  const focus = deriveTrainingFocus(exercise);
  assert.ok(focus.some((item) => /Percepción y reacción/i.test(item)));
  assert.ok(focus.some((item) => /Técnica|Finalización/i.test(item)));
  assert.ok(focus.length <= 4);
});
