import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanPlayerNumber,
  getGreetingByHour,
  getAutoMapsUrl,
  formatLongDate,
  buildWhatsAppMatchConvocatoria,
  buildWhatsAppTrainingDay,
  buildWhatsAppTrainingWeek,
} from '../js/whatsapp-suite.js';

test('cleanPlayerNumber elimina almohadillas y espacios', () => {
  assert.equal(cleanPlayerNumber('#4'), '4');
  assert.equal(cleanPlayerNumber('# 10'), '10');
  assert.equal(cleanPlayerNumber(' 7 '), '7');
  assert.equal(cleanPlayerNumber(9), '9');
  assert.equal(cleanPlayerNumber(null), '');
  assert.equal(cleanPlayerNumber(undefined), '');
});

test('getGreetingByHour devuelve el saludo correcto según la franja horaria', () => {
  assert.equal(getGreetingByHour(7), 'Buenos días');
  assert.equal(getGreetingByHour(13), 'Buenos días');
  assert.equal(getGreetingByHour(14), 'Buenas tardes');
  assert.equal(getGreetingByHour(20), 'Buenas tardes');
  assert.equal(getGreetingByHour(21), 'Buenas noches');
  assert.equal(getGreetingByHour(3), 'Buenas noches');
});

test('getAutoMapsUrl genera la URL de Google Maps para el campo', () => {
  const url = getAutoMapsUrl('Campo Alfonso Silva');
  assert.ok(url.startsWith('https://maps.google.com/?q='));
  assert.ok(url.includes('Alfonso'));
});

test('formatLongDate formatea correctamente fechas simples e ISO', () => {
  const formatted = formatLongDate('2026-09-20T09:00:00');
  assert.ok(formatted.includes('20 de Septiembre de 2026') || formatted.includes('20 de septiembre de 2026'));
});

test('buildWhatsAppMatchConvocatoria para grupo: sin firma personal, con espinilleras y sin #', () => {
  const match = { opponent: 'Barriche', date: '2026-09-20' };
  const players = [
    { id: 'p1', name: 'Thiago Hernández', number: '#4' },
    { id: 'p2', name: 'Mateo González', number: '7' },
  ];
  const callup = { availableIds: ['p1', 'p2'], excludedIds: [] };

  const msg = buildWhatsAppMatchConvocatoria({
    teamName: 'C.F. Unión Viera Alevín D',
    match,
    callup,
    players,
    now: new Date('2026-09-20T10:00:00'),
  });

  assert.ok(msg.includes('Buenos días a todos/as,'));
  assert.ok(msg.includes('Barriche'));
  assert.ok(msg.includes('Thiago Hernández'));
  assert.ok(msg.includes('Mateo González'));
  assert.ok(!msg.includes('#4'), 'No debe tener almohadilla en los dorsales');
  assert.ok(msg.includes('espinilleras'), 'Los partidos obligan a llevar espinilleras');
  assert.ok(!msg.includes('¡Aúpa Viera!'), 'No debe incluir ¡Aúpa Viera!');
  assert.ok(msg.includes('¡Muchas gracias a todos/as!'), 'Debe incluir agradecimiento limpio');
  assert.ok(!msg.includes('Miguel'), 'No debe incluir firma de Miguel');
  assert.ok(!msg.includes('un saludo cordial'), 'No debe incluir un saludo cordial');
});

test('buildWhatsAppMatchConvocatoria individual: NO convocado omite campo, hora y material', () => {
  const match = { opponent: 'Guiniguada', date: '2026-09-20' };
  const players = [
    { id: 'p1', name: 'Thiago Hernández', number: '4', fatherName: 'Carlos', fatherPhone: '600111222' },
  ];
  const callup = { availableIds: [], excludedIds: ['p1'] };

  const msg = buildWhatsAppMatchConvocatoria({
    match,
    callup,
    players,
    targetPlayerId: 'p1',
    recipientType: 'parent',
    parentType: 'father',
    now: new Date('2026-09-20T15:00:00'),
  });

  assert.ok(msg.includes('Buenas tardes Carlos:'));
  assert.ok(msg.includes('Thiago Hernández (Dorsal 4) NO está CONVOCADO'));
  assert.ok(!msg.includes('Hora de citación:'), 'No convocado NO debe tener hora de citación');
  assert.ok(!msg.includes('Campo:'), 'No convocado NO debe tener campo');
  assert.ok(!msg.includes('espinilleras'), 'No convocado NO debe tener material');
  assert.ok(msg.includes('¡Mucho ánimo'));
  assert.ok(!msg.includes('¡Aúpa Viera!'), 'No debe incluir ¡Aúpa Viera!');
  assert.ok(msg.includes('¡Muchas gracias a todos/as!'));
});

test('buildWhatsAppMatchConvocatoria individual: SI convocado incluye citación, campo y espinilleras', () => {
  const match = { opponent: 'Guiniguada', date: '2026-09-20' };
  const players = [
    { id: 'p1', name: 'Thiago Hernández', number: '4', motherName: 'Elena', motherPhone: '600333444' },
  ];
  const callup = { availableIds: ['p1'], excludedIds: [] };

  const msg = buildWhatsAppMatchConvocatoria({
    match,
    callup,
    players,
    targetPlayerId: 'p1',
    recipientType: 'parent',
    parentType: 'mother',
    fieldName: 'Campo Alfonso Silva',
    now: new Date('2026-09-20T21:30:00'),
  });

  assert.ok(msg.includes('Buenas noches Elena:'));
  assert.ok(msg.includes('convocatoria para Thiago Hernández (Dorsal 4):'));
  assert.ok(msg.includes('Hora de citación:'));
  assert.ok(msg.includes('Alfonso Silva'));
  assert.ok(msg.includes('espinilleras'));
  assert.ok(!msg.includes('¡Aúpa Viera!'), 'No debe incluir ¡Aúpa Viera!');
  assert.ok(msg.includes('¡Muchas gracias a todos/as!'));
});

test('buildWhatsAppTrainingDay: NO requiere espinilleras, incluye balón y agua', () => {
  const session = { date: '2026-09-15', time: '16:30', duration: 75 };
  const msg = buildWhatsAppTrainingDay({
    session,
    fieldName: 'Campo Alfonso Silva',
    now: new Date('2026-09-15T10:00:00'),
  });

  assert.ok(msg.includes('Buenos días a todos/as,'));
  assert.ok(msg.includes('16:30 h'));
  assert.ok(msg.includes('Alfonso Silva'));
  assert.ok(msg.includes('Botella de agua individual'));
  assert.ok(msg.includes('Balón de fútbol T4'));
  assert.ok(!msg.includes('espinilleras'), 'En entrenamientos NO es necesario espinilleras');
  assert.ok(!msg.includes('Miguel'));
  assert.ok(!msg.includes('¡Aúpa Viera!'), 'No debe incluir ¡Aúpa Viera!');
  assert.ok(msg.includes('¡Muchas gracias a todos/as!'));
});

test('buildWhatsAppTrainingWeek: resume la semana de entrenos y partido', () => {
  const sessions = [
    { date: '2026-09-15', time: '16:30', field: 'Alfonso Silva', duration: 60 },
    { date: '2026-09-16', time: '16:30', field: 'Alfonso Silva', duration: 60 },
    { date: '2026-09-18', time: '16:30', field: 'Campo del Pilar', duration: 75 },
  ];
  const match = { date: '2026-09-21', time: '09:00', opponent: 'Huracán', field: 'Alfonso Silva' };

  const msg = buildWhatsAppTrainingWeek({
    sessions,
    match,
    tacticalGoal: 'Presión tras pérdida y repliegue ordenado',
    now: new Date('2026-09-14T09:00:00'),
  });

  assert.ok(msg.includes('Presión tras pérdida'));
  assert.ok(msg.includes('Alfonso Silva'));
  assert.ok(msg.includes('Campo del Pilar'));
  assert.ok(msg.includes('Huracán'));
  assert.ok(!msg.includes('espinilleras'));
  assert.ok(!msg.includes('¡Aúpa Viera!'), 'No debe incluir ¡Aúpa Viera!');
  assert.ok(msg.includes('¡Muchas gracias a todos/as!'));
});
