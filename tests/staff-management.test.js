import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STAFF_ROLES,
  getRoleMeta,
  getStaffMembers,
  saveStaffMember,
  deleteStaffMember,
} from '../js/staff-management.js';
import { createDemoSession } from '../js/demo-session.js';
import { configureDemoDatabase, isDemoDatabase, configureRealDatabase } from '../js/db.js';

test('STAFF_ROLES incluye los perfiles clave de un cuerpo técnico deportivo', () => {
  const roleIds = STAFF_ROLES.map((r) => r.id);
  assert.ok(roleIds.includes('head_coach'), 'Debe incluir Primer Entrenador');
  assert.ok(roleIds.includes('assistant_coach'), 'Debe incluir Segundo Entrenador');
  assert.ok(roleIds.includes('goalkeeper_coach'), 'Debe incluir Preparador de Porteros');
  assert.ok(roleIds.includes('fitness_coach'), 'Debe incluir Preparador Físico');
  assert.ok(roleIds.includes('team_delegate'), 'Debe incluir Delegado de Equipo');
  assert.ok(roleIds.includes('physio'), 'Debe incluir Fisioterapeuta / Médico');
  assert.ok(roleIds.includes('other'), 'Debe incluir opción para cargos personalizados');
});

test('getRoleMeta devuelve metadatos coherentes y maneja cargos desconocidos', () => {
  const gk = getRoleMeta('goalkeeper_coach');
  assert.equal(gk.label, 'Preparador de Porteros');
  assert.equal(gk.badge, 'Prep. Porteros');
  assert.equal(gk.color, 'emerald');

  const unknown = getRoleMeta('invento_cargo');
  assert.equal(unknown.id, 'other');
  assert.equal(unknown.color, 'zinc');
});

test('saveStaffMember valida campos obligatorios y persiste en base demo aislada', async () => {
  const session = createDemoSession('test-staff-session');
  configureDemoDatabase(session);
  assert.equal(isDemoDatabase(), true);

  // Nombre vacío debe lanzar error
  await assert.rejects(
    () => saveStaffMember({ name: '', role: 'head_coach' }),
    /nombre.*obligatorio/i
  );

  // Guardado exitoso de entrenador
  const saved = await saveStaffMember({
    name: 'Migue Pérez',
    role: 'head_coach',
    phone: '612345678',
    notes: 'UEFA Pro',
  });

  assert.equal(saved.name, 'Migue Pérez');
  assert.equal(saved.role, 'head_coach');
  assert.equal(saved.roleTitle, 'Primer Entrenador');
  assert.equal(saved.badgeText, '1º Entrenador');
  assert.equal(saved.color, 'blue');
  assert.equal(saved.recordType, 'staffMember');

  // Guardado de cargo personalizado
  const custom = await saveStaffMember({
    name: 'Laura Ramos',
    role: 'other',
    customRole: 'Psicóloga Deportiva',
    phone: '655123456',
  });
  assert.equal(custom.roleTitle, 'Psicóloga Deportiva');
  assert.equal(custom.badgeText, 'Psicóloga Deportiva');

  // Obtener lista completa
  const list = await getStaffMembers();
  assert.equal(list.length, 2);

  // Eliminar miembro
  await deleteStaffMember(saved.id);
  const updatedList = await getStaffMembers();
  assert.equal(updatedList.length, 1);
  assert.equal(updatedList[0].id, custom.id);

  configureRealDatabase();
});

test('persistencia y ordenación de múltiples perfiles del cuerpo técnico', async () => {
  const session = createDemoSession('test-multi-staff');
  configureDemoDatabase(session);

  await saveStaffMember({ name: 'Entrenador Principal', role: 'head_coach', order: 1 });
  await saveStaffMember({ name: 'Segundo', role: 'assistant_coach', order: 2 });
  await saveStaffMember({ name: 'Prep. Físico', role: 'fitness_coach', order: 3 });
  await saveStaffMember({ name: 'Delegado', role: 'team_delegate', order: 4 });

  const staff = await getStaffMembers();
  assert.equal(staff.length, 4);
  assert.equal(staff[0].name, 'Entrenador Principal');
  assert.equal(staff[1].name, 'Segundo');
  assert.equal(staff[2].name, 'Prep. Físico');
  assert.equal(staff[3].name, 'Delegado');

  configureRealDatabase();
});
