import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DELEGATE_VIEW_OPTIONS } from '../js/team-access.js';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('la cuenta de delegado nunca incluye Ajustes entre sus vistas configurables', () => {
  const ids = DELEGATE_VIEW_OPTIONS.map(([id]) => id);
  assert.ok(ids.includes('delegado'));
  assert.ok(ids.includes('plantilla'));
  assert.ok(ids.includes('asistencia'));
  assert.ok(ids.includes('partido'));
  assert.ok(!ids.includes('ajustes'));
});

test('el delegado comparte el propietario de datos del equipo en lugar de crear otra plantilla', async () => {
  const source = await projectFile('js/supabase-client.js');
  assert.match(source, /mi_equipo_contexto/);
  assert.match(source, /dataOwnerUserId/);
  assert.match(source, /user_id: dataOwnerUserId/);
});

test('la navegación rechaza vistas no autorizadas aunque se intente abrirlas directamente', async () => {
  const [app, nav] = await Promise.all([
    projectFile('js/app.js'),
    projectFile('js/redesign-nav.js'),
  ]);
  assert.match(app, /__campobaseAllowedViews/);
  assert.match(nav, /__campobaseAllowedViews/);
});

test('el delegado no puede crear equipos y solo el titular configura sus accesos', async () => {
  const migration = await projectFile('supabase/05_equipos_delegados.sql');
  assert.match(migration, /revoke insert, update, delete on public\.equipos_cuenta from authenticated/i);
  assert.match(migration, /Solo el titular del equipo puede configurar al delegado/);
  assert.match(migration, /equipo_un_solo_delegado_idx/);
});

test('la invitación del delegado usa una Edge Function autenticada y lo asocia al equipo existente', async () => {
  const source = await projectFile('supabase/functions/invite-delegate/index.ts');
  assert.match(source, /inviteUserByEmail/);
  assert.match(source, /role:\s*"delegate"/);
  assert.match(source, /equipo_id:\s*team\.id/);
  assert.doesNotMatch(source, /create.*team/i);
});
