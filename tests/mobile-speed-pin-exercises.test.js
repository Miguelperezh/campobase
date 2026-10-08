import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { findValidatedExercise, EJERCICIOS_VALIDADOS } from '../js/ejercicios-validados.js';

const appCode = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const swCode = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

test('completePinLogin abre la app inmediatamente si el dispositivo ya tiene datos locales', async () => {
  const events = [];
  const context = {
    getCurrentSession: async () => null,
    hasUsableTeamSnapshot: () => true, // El dispositivo ya tiene datos del equipo
    beginPinAccess: () => 0,
    finishPinAccess: () => true,
    state: { players: [{ id: 'p1' }], cloudConnected: false },
    navigator: { onLine: true },
    console,
    getSupabaseAuthClient: () => ({}),
    signInWithCampoBasePin: async () => ({ user: { id: 'owner' } }),
    setBoundSaasUserId: () => {},
    configureRealDatabase: () => events.push('bind'),
    getBoundSaasUserId: () => 'owner',
    sessionStorage: { setItem() {} },
    synchronizeCloud: async () => events.push('download'),
    refresh: async () => events.push('refresh'),
    applyRole: (role) => events.push(role),
    $: (sel) => ({ close: () => events.push('close') }),
    renderAll: () => events.push('render'),
  };

  vm.createContext(context);
  const start = appCode.indexOf('async function completePinLogin(');
  vm.runInContext(appCode.slice(start, appCode.indexOf('async function submitAuth', start)), context);

  // Ejecuta completePinLogin con rol 'owner'
  const result = vm.runInContext("completePinLogin('owner','1234','owner')", context);
  await result;

  // Debe cerrar el diálogo y renderizar la app inmediatamente sin bloquear por synchronizeCloud
  assert.deepEqual(events, ['bind', 'owner', 'close', 'render']);
});

test('Service Worker entrega imágenes y portadas con Cache-First para velocidad en móvil', () => {
  assert.match(swCode, /isImageOrStaticAsset/);
  assert.match(swCode, /caches\.match\(event\.request\)\.then\(\(cached\) =>/);
  assert.match(swCode, /\/library-v2\//);
});

test('findValidatedExercise resuelve en O(1) con Map sin bucles lentos', () => {
  assert.ok(EJERCICIOS_VALIDADOS.length > 1000, 'Debe haber más de 1000 ejercicios');
  const sample1 = EJERCICIOS_VALIDADOS[0];
  const sample2 = EJERCICIOS_VALIDADOS[500];
  const sample3 = EJERCICIOS_VALIDADOS[EJERCICIOS_VALIDADOS.length - 1];

  const t0 = performance.now();
  for (let i = 0; i < 5000; i++) {
    findValidatedExercise(sample1.id);
    findValidatedExercise(sample2.id);
    findValidatedExercise(sample3.id);
  }
  const elapsed = performance.now() - t0;
  // 15,000 búsquedas deben tomar menos de 50ms en O(1)
  assert.ok(elapsed < 50, `15.000 búsquedas tardaron ${elapsed}ms (debe ser O(1) instantáneo)`);
  assert.equal(findValidatedExercise(sample1.id)?.id, sample1.id);
  assert.equal(findValidatedExercise(sample2.id)?.id, sample2.id);
  assert.equal(findValidatedExercise(sample3.id)?.id, sample3.id);
});

test('renderExercises incluye paginación por lotes de 36 ejercicios para fluidez en móvil', () => {
  assert.match(appCode, /let exerciseBatchLimit = 36;/);
  assert.match(appCode, /visibleExercises = exercises\.slice\(0, exerciseBatchLimit\)/);
  assert.match(appCode, /cbx-btn-more-exercises/);
  assert.match(appCode, /cbx-btn-all-exercises/);
});

test('submitAuth ofrece feedback visual inmediato deshabilitando y mostrando Entrando…', () => {
  assert.match(appCode, /submitBtn\.textContent = 'Entrando…'/);
  assert.match(appCode, /submitBtn\.disabled = true/);
});
