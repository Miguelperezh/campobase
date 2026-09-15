import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { partitionAndSortMatches } from '../js/match-calendar-sync.js';

const root = new URL('../', import.meta.url);

test('una sesión del 15/09/2026 o posterior no se archiva por hora ni por guardar asistencia', async () => {
  const source = await readFile(new URL('js/completed-events-ui.js', root), 'utf8');
  assert.match(source, /MANUAL_CLOSE_FROM = '2026-09-15'/);
  assert.match(source, /status === 'closed'/);
  assert.match(source, /closedAt/);
  assert.match(source, /close-session-manual/);
  assert.doesNotMatch(source, /sessionHasFinished/);
  assert.doesNotMatch(source, /attendance/);
});

test('un partido planificado con marcador no pasa a Jugados hasta estar cerrado/finalizado', () => {
  const matches = [
    { id: 'planned-score', date: '2026-09-20T09:00', status: 'planned', goalsFor: 0, goalsAgainst: 0 },
    { id: 'finished', date: '2026-09-09T18:00', status: 'finished', goalsFor: 3, goalsAgainst: 5 },
  ];
  const { upcoming, played } = partitionAndSortMatches(matches);
  assert.deepEqual(upcoming.map((m) => m.id), ['planned-score']);
  assert.deepEqual(played.map((m) => m.id), ['finished']);
});
