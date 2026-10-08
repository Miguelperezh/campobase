import test from 'node:test';
import assert from 'node:assert/strict';
import { isMatchPlayed, partitionAndSortMatches } from '../js/match-calendar-sync.js';
import { SECTIONS } from '../js/claude-color-catalog.js';
import { configurableElements } from '../js/theme-component-colors.js';

test('isMatchPlayed identifica partidos jugados con resultados o minutos', () => {
  // Partidos finalizados o cerrados
  assert.equal(isMatchPlayed({ status: 'finished' }), true);
  assert.equal(isMatchPlayed({ status: 'closed' }), true);
  assert.equal(isMatchPlayed({ closedAt: 1234567 }), true);
  assert.equal(isMatchPlayed({ finishedAt: 1234567 }), true);

  // Partidos con goles registrados
  assert.equal(isMatchPlayed({ status: 'planned', goalsFor: 2, goalsAgainst: 1 }), true);
  assert.equal(isMatchPlayed({ status: 'planned', goalsFor: 0, goalsAgainst: 2 }), true);
  assert.equal(isMatchPlayed({ status: 'finished', goalsFor: 0, goalsAgainst: 0 }), true);

  // Partidos con eventos de gol
  assert.equal(isMatchPlayed({ status: 'planned', goals: [{ minute: 15 }] }), true);

  // Partidos con minutos jugados o puntuaciones
  assert.equal(isMatchPlayed({ status: 'planned', playedSeconds: 2400 }), true);
  assert.equal(isMatchPlayed({ status: 'planned', minuteTotals: { p1: 1800 } }), true);
  assert.equal(isMatchPlayed({ status: 'planned', ratings: { p1: 4 } }), true);

  // Partido programado sin jugar (0-0 inicial sin minutos ni eventos)
  assert.equal(isMatchPlayed({ id: 'p1', status: 'planned', goalsFor: 0, goalsAgainst: 0 }), false);
  assert.equal(isMatchPlayed({ id: 'p2', status: 'planned', goalsFor: null, goalsAgainst: null }), false);
  assert.equal(isMatchPlayed(null), false);
});

test('partitionAndSortMatches clasifica correctamente partidos jugados y próximos', () => {
  const matches = [
    { id: 'm-upcoming', date: '2026-10-15', status: 'planned', goalsFor: 0, goalsAgainst: 0 },
    { id: 'm-played-goals', date: '2026-10-01', status: 'planned', opponent: 'Calero', goalsFor: 2, goalsAgainst: 1 },
    { id: 'm-finished', date: '2026-09-25', status: 'finished', opponent: 'San Fernando', goalsFor: 3, goalsAgainst: 0 },
  ];
  const { upcoming, played } = partitionAndSortMatches(matches);
  assert.deepEqual(upcoming.map((m) => m.id), ['m-upcoming']);
  assert.deepEqual(played.map((m) => m.id), ['m-played-goals', 'm-finished']);
});

test('catálogo y personalización de convocatorias incluye con.card y con.done compartidos', () => {
  const conSection = SECTIONS.find((s) => s.id === 'con');
  assert.ok(conSection, 'Debe existir la sección con');
  const cardEl = conSection.els.find((e) => e.id === 'con.card');
  assert.ok(cardEl, 'Debe existir con.card en el catálogo');
  const doneEl = conSection.els.find((e) => e.id === 'con.done');
  assert.ok(doneEl, 'Debe existir con.done en el catálogo');
  assert.equal(doneEl.name, 'Botón «Realizado»');
});

test('app.js no contiene auto-mutacion en refresh() y respeta la decision manual del usuario', async () => {
  const { readFile } = await import('node:fs/promises');
  const appSource = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');

  // refresh() no debe sobreescribir callup.completed ni match.status
  const refreshMatch = appSource.match(/async function refresh\(\) \{[\s\S]*?await deduplicatePlayers\(\);/);
  assert.ok(refreshMatch, 'Debe encontrarse refresh()');
  assert.doesNotMatch(refreshMatch[0], /callup\.completed\s*=\s*true/, 'refresh no debe mutar callup.completed');
  assert.doesNotMatch(refreshMatch[0], /match\.status\s*=\s*'finished'/, 'refresh no debe mutar match.status');

  // isCallupPlayed no debe inferir jugado a partir de asistencias registradas
  const isPlayedMatch = appSource.match(/function isCallupPlayed\(callup\) \{[\s\S]*?return false;\s*\}/);
  assert.ok(isPlayedMatch, 'Debe encontrarse isCallupPlayed()');
  assert.doesNotMatch(isPlayedMatch[0], /state\.trainings/, 'isCallupPlayed no debe consultar trainings/asistencias');
  assert.match(isPlayedMatch[0], /if \(callup\.completed === false\) return false;/, 'Decisión manual completed===false manda siempre');

  // renderCallups usa el acordeón idéntico de entrenamientos realizados
  assert.match(appSource, /📁 Convocatorias realizadas \(\$\{playedCallups\.length\}\)/, 'Título idéntico al de sesiones');
  assert.match(appSource, /<details class="cbx-completed-sessions-accordion"/, 'Misma clase de acordeón que sesiones');
  assert.match(appSource, /<summary class="cbx-completed-sessions-summary"/, 'Misma clase de summary que sesiones');

  // sanitizeLiveTimer elimina Calero y partidos pasados
  assert.match(appSource, /calero/, 'sanitizeLiveTimer debe limpiar Calero');
  assert.match(appSource, /runningSince.*?6 \* 3600 \* 1000/, 'sanitizeLiveTimer debe purgar timers con más de 6 horas');
});
