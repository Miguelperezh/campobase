import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUBSCRIPTION_CACHE_PREFIX,
  isSubscriptionActive,
  getDaysRemaining,
  formatSubscriptionStatus,
  renderPaywallModalHTML,
  PLAN_PRICES,
} from '../js/billing-manager.js';

const NOW = Date.parse('2026-09-18T08:00:00Z');

test('el acceso vitalicio no caduca', () => {
  assert.equal(isSubscriptionActive({ estado: 'gift_free', expira_en: null }, NOW), true);
  assert.equal(formatSubscriptionStatus({ estado: 'gift_free' }, NOW).canUseApp, true);
});

test('la prueba depende de la fecha real del servidor, no de un trial local inventado', () => {
  assert.equal(isSubscriptionActive({ estado: 'trial', expira_en: '2026-09-19T08:00:00Z' }, NOW), true);
  assert.equal(isSubscriptionActive({ estado: 'trial', expira_en: '2026-09-18T07:59:59Z' }, NOW), false);
  assert.equal(getDaysRemaining({ expira_en: '2026-09-19T08:00:00Z' }, NOW), 1);
});

test('un plan activo con vencimiento pasado deja de dar acceso', () => {
  assert.equal(isSubscriptionActive({ estado: 'active', expira_en: '2026-09-18T07:00:00Z' }, NOW), false);
});

test('los planes muestran exactamente los precios validados', () => {
  assert.equal(PLAN_PRICES.monthly.price, '9,99 € / mes');
  assert.equal(PLAN_PRICES.annual.price, '79 € / año');
  const html = renderPaywallModalHTML();
  assert.match(html, /9,99 €/);
  assert.match(html, /79 €/);
  assert.match(html, /código de regalo o descuento/i);
});

test('la caché de suscripción está aislada por usuario', () => {
  assert.equal(SUBSCRIPTION_CACHE_PREFIX, 'campobase.subscription.');
});

test('no existe modo de pago simulado en el gestor', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../js/billing-manager.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /simulated\s*:/);
  assert.doesNotMatch(source, /price_campobase_monthly/);
  assert.match(source, /functions\.invoke\('create-checkout-session'/);
});
