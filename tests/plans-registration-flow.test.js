import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { APP_PLAN_FEATURES, PLAN_PRICES } from '../js/plan-catalog.js';

const projectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('los planes se muestran antes del registro', async () => {
  const auth = await projectFile('js/saas-auth-ui-v2.js');
  assert.match(auth, /id="saas-tab-plans"/);
  assert.match(auth, /id="saas-public-plans"/);
  assert.match(auth, /Crear cuenta · Mensual/);
  assert.match(auth, /Crear cuenta · Anual/);
});

test('el catálogo de planes enumera todas las áreas principales de la app', () => {
  const joined = APP_PLAN_FEATURES.join(' | ');
  for (const expected of [
    'Inicio',
    'Plantilla',
    'Estadísticas',
    'Cuerpo técnico',
    'asistencia',
    'Convocatorias',
    'Preparación de partido',
    'Partido en vivo',
    'Calendario',
    'Sesiones',
    'Biblioteca de ejercicios',
    'Pizarra táctica',
    'delegado',
    'nube',
    'varios dispositivos',
    'Copia de seguridad',
    'Personalización',
    'Códigos',
  ]) {
    assert.match(joined, new RegExp(expected, 'i'));
  }
  assert.equal(PLAN_PRICES.monthly.price, '9,99 € / mes');
  assert.equal(PLAN_PRICES.annual.price, '79 € / año');
});

test('una cuenta sin acceso válido no puede saltarse la elección de plan al entrar', async () => {
  const auth = await projectFile('js/saas-auth-ui-v2.js');
  assert.match(auth, /const canEnter = isDelegate \|\| isAdmin \|\| Boolean\(planStatus\.canUseApp\)/);
  assert.match(auth, /enterButton\.classList\.toggle\('hidden', !canEnter\)/);
  assert.match(auth, /startStripeCheckout/);
});

test('las cuentas nuevas reciben prueba Pro de 14 días desde servidor', async () => {
  const migration = await projectFile('supabase/06_new_account_trial.sql');
  assert.match(migration, /insert into public\.suscripciones/i);
  assert.match(migration, /'trial'/);
  assert.match(migration, /interval '14 days'/);
});

test('Ajustes muestra la Cuenta de delegado con permisos visibles', async () => {
  const html = await projectFile('index.html');
  assert.match(html, /id="cb-delegate-account-panel"/);
  assert.match(html, /Permisos del delegado/);
  assert.match(html, /Vista delegado del partido/);
  assert.match(html, /Asistencia/);
  assert.match(html, /Partido en vivo/);
  assert.match(html, /Pizarra táctica/);
});
