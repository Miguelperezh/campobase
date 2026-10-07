import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isDelegateViewAllowed, DELEGATE_VIEW_OPTIONS, renderDelegatePanel, applyTeamAccessContext } from '../js/team-access.js';

const [teamAccessCode, appCode] = await Promise.all([
  readFile(new URL('../js/team-access.js', import.meta.url), 'utf8'),
  readFile(new URL('../js/app.js', import.meta.url), 'utf8'),
]);

test('renderDelegatePanel permite editar permisos al entrenador/owner incluso sin contexto SaaS previo', async () => {
  assert.match(teamAccessCode, /export async function renderDelegatePanel/);
  assert.match(teamAccessCode, /const canManage = isOwner \|\| \['admin', 'coach'\]\.includes\(context\?\.membership_role\);/);
  assert.match(teamAccessCode, /name="delegatePinInput"/);
  assert.match(teamAccessCode, /id="cb-delegate-invite-whatsapp-btn"/);
  assert.match(teamAccessCode, /id="cb-delegate-invite-email-btn"/);
  assert.match(teamAccessCode, /permissionMarkup\(currentSavedPerms,\s*\{\s*disabled:\s*false\s*\}\)/);
});

test('syncDelegateModeDom detecta correctamente modo partido único para [partido, delegado]', () => {
  assert.match(appCode, /const nonMatchPerms = perms\.filter\(\(p\) => p !== 'partido' && p !== 'delegado'\);/);
  assert.match(appCode, /const onlyPartido = nonMatchPerms\.length === 0;/);
});

test('applyTeamAccessContext no borra window.__campobaseAllowedViews para delegados por PIN', () => {
  assert.match(teamAccessCode, /const isLocalDelegate =/);
  assert.match(teamAccessCode, /window\.__campobaseAllowedViews = perms;/);
});

test('app.js expone sendDelegateInviteWhatsApp y sendDelegateInviteEmail en window.__campobase', () => {
  assert.match(appCode, /sendDelegateInviteWhatsApp,\s*sendDelegateInviteEmail/);
  assert.match(appCode, /window\.__campobaseRenderDelegatePanel\?\.\(document\)/);
});
