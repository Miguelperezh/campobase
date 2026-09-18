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
  assert.match(auth, /const canEnter = Boolean\(planStatus\.canUseApp\)/);
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
  assert.match(html, /¿Qué puede ver el delegado\?/);
  assert.match(html, /Vista delegado del partido/);
  assert.match(html, /Asistencia/);
  assert.match(html, /Partido en vivo/);
  assert.match(html, /Pizarra táctica/);
});


test('el acceso comercial exige prueba, regalo o pago también en servidor', async () => {
  const [auth, billing, gate] = await Promise.all([
    projectFile('js/saas-auth-ui-v2.js'),
    projectFile('js/billing-manager.js'),
    projectFile('supabase/07_strict_access_gate.sql'),
  ]);
  assert.match(auth, /No tienes acceso activo/);
  assert.match(billing, /Prueba activa/);
  assert.match(billing, /Código gratuito/);
  assert.match(billing, /Suscripción/);
  assert.match(gate, /s\.estado = 'gift_free'/);
  assert.match(gate, /s\.estado = 'active'/);
  assert.match(gate, /s\.estado = 'trial'/);
  assert.doesNotMatch(gate, /p\.role in \('owner','admin'\)/);
});


test('el diseño evita tarjetas estrechas y hace grande la gestión del delegado', async () => {
  const [auth, css] = await Promise.all([
    projectFile('js/saas-auth-ui-v2.js'),
    projectFile('billing.css'),
  ]);
  assert.match(auth, /width:min\(96vw,1080px\)/);
  assert.match(css, /cb-delegate-account-panel[\s\S]*grid-column:\s*1\s*\/\s*-1/i);
  assert.match(css, /cb-delegate-permissions-grid[\s\S]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/i);
  assert.match(css, /@media \(max-width: 980px\)[\s\S]*cb-feature-groups[\s\S]*grid-template-columns:\s*1fr/i);
});
