import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildTodaySummary, localDayKey } from '../js/today-dashboard.js';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Hoy usa fecha local sin depender de UTC', () => {
  const now = new Date(2026, 8, 10, 23, 30, 0);
  assert.equal(localDayKey(now), '2026-09-10');
});

test('Hoy separa actividades actuales, próximas y tareas pendientes', () => {
  const now = new Date(2026, 8, 10, 12, 0, 0);
  const sessions = [
    { id: 's1', date: '2026-09-10', name: 'Técnica' },
    { id: 's2', date: '2026-09-12', name: 'Prepartido' },
  ];
  const matches = [
    { id: 'm1', date: '2026-09-10T19:00', opponent: 'Rival A', status: 'planned', callupId: 'c1' },
    { id: 'm2', date: '2026-09-13T11:00', opponent: 'Rival B', status: 'planned' },
  ];
  const trainings = [{ id: 'a1', sessionId: 's1', date: '2026-09-10', attendance: [] }];
  const callups = [{ id: 'c1', matchId: 'm1', availableIds: ['p1'] }];

  const summary = buildTodaySummary({ sessions, matches, trainings, callups, now });
  assert.deepEqual(summary.todaySessions.map((item) => item.id), ['s1']);
  assert.deepEqual(summary.todayMatches.map((item) => item.id), ['m1']);
  assert.equal(summary.nextSession.id, 's1');
  assert.equal(summary.nextMatch.id, 'm1');
  assert.deepEqual(summary.attendancePending.map((item) => item.id), ['m1']);
  assert.deepEqual(summary.callupPending.map((item) => item.id), ['m2']);
});

test('el nuevo Inicio se carga desde la app y queda disponible offline', async () => {
  const [demo, sw, pkg, source] = await Promise.all([
    projectFile('js/demo-session.js'),
    projectFile('sw.js'),
    projectFile('package.json'),
    projectFile('js/today-dashboard.js'),
  ]);
  assert.match(demo, /today-dashboard\.js\?v=2456/);
  assert.match(sw, /today-dashboard\.js\?v=2456/);
  assert.match(sw, /today-2456/);
  assert.match(pkg, /node --check js\/today-dashboard\.js/);
  assert.match(source, /section\.id = 'hoy'/);
  assert.match(source, /navButton\.textContent = 'Hoy'/);
  assert.match(source, /today-event-grid/);
  assert.match(source, /Pendiente de hacer/);
});
