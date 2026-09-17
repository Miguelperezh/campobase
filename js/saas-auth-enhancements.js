import {
  getBoundSaasUserId,
  getCurrentProfile,
  getCurrentSession,
  getRememberedSaasAccount,
  rememberSaasAccount,
} from './auth-manager.js';

const REMEMBER_REQUEST_KEY = 'campobase.rememberAccount.requested';
const PENDING_PROMO_KEY = 'campobase.pendingSignupPromo.v1';
const OWNER_EMAIL = 'info@miguel-perez.es';
let initialized = false;
let accountObserver = null;
let localGateApplied = false;

const $ = (selector, root = document) => root.querySelector(selector);

function installStyles() {
  if ($('#cb-auth-enhancement-style')) return;
  const style = document.createElement('style');
  style.id = 'cb-auth-enhancement-style';
  style.textContent = `
    #auth-dialog.auth-dialog{width:min(96vw,760px)!important;max-height:min(94vh,820px)!important}
    #saas-auth-shell .cb-auth-pane{width:100%}
    #saas-auth-shell .cb-auth-pane .form-row{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:.8rem!important;align-items:start!important}
    #saas-auth-shell label{min-width:0}
    #saas-auth-shell input,#saas-auth-shell select,#saas-auth-shell textarea{width:100%;min-width:0}
    .cb-auth-remember{display:flex!important;align-items:flex-start;gap:.55rem;padding:.7rem .8rem;border:1px solid var(--line,#e2e8f0);border-radius:12px;background:var(--paper,#fafafa);font-size:.82rem;font-weight:700}
    .cb-auth-remember input{width:auto!important;min-width:auto!important;margin-top:.15rem}
    .cb-auth-remember small{display:block;margin-top:.18rem;color:var(--muted,#64748b);font-weight:500}
    .cb-auth-promo{display:grid;gap:.25rem}
    .cb-auth-account-memory{padding:.55rem .7rem;border-radius:10px;background:color-mix(in srgb,var(--cb-brand,#173f35) 8%,transparent);font-size:.78rem}
    @media(max-width:640px){
      #auth-dialog.auth-dialog{width:calc(100vw - 14px)!important;padding:1rem!important}
      #saas-auth-shell .cb-auth-pane .form-row{grid-template-columns:1fr!important}
    }
  `;
  document.head.appendChild(style);
}

function rememberMarkup() {
  return `<label class="cb-auth-remember"><input type="checkbox" name="rememberDevice" checked><span>Recordar esta cuenta en este dispositivo<small>La cuenta quedará identificada aquí y, cuando el PIN local esté configurado, podrás entrar después solo con el PIN.</small></span></label>`;
}

function injectFields() {
  const login = $('#saas-login-form');
  const register = $('#saas-register-form');
  if (login && !login.elements.rememberDevice) {
    const message = $('#saas-login-message', login);
    message?.insertAdjacentHTML('beforebegin', rememberMarkup());
  }
  if (register && !register.elements.rememberDevice) {
    const message = $('#saas-register-message', register);
    message?.insertAdjacentHTML('beforebegin', `
      <label class="cb-auth-promo">Código de regalo o descuento <span class="meta">(opcional)</span>
        <input name="promoCode" type="text" maxlength="30" autocomplete="off" placeholder="Si tienes un código, introdúcelo aquí">
      </label>
      ${rememberMarkup()}`);
  }
}

function setRememberRequest(enabled) {
  try { sessionStorage.setItem(REMEMBER_REQUEST_KEY, enabled ? '1' : '0'); } catch { /* noop */ }
}

function getRememberRequest() {
  try { return sessionStorage.getItem(REMEMBER_REQUEST_KEY) !== '0'; } catch { return true; }
}

function setPendingPromo(code = '') {
  const clean = String(code || '').trim().toUpperCase();
  try {
    if (clean) localStorage.setItem(PENDING_PROMO_KEY, clean);
    else localStorage.removeItem(PENDING_PROMO_KEY);
  } catch { /* noop */ }
}

function getPendingPromo() {
  try { return String(localStorage.getItem(PENDING_PROMO_KEY) || '').trim().toUpperCase(); } catch { return ''; }
}

async function redeemPendingPromo(client) {
  const code = getPendingPromo();
  if (!code) return null;
  const session = await getCurrentSession(client).catch(() => null);
  if (!session?.user) return null;
  const { data, error } = await client.rpc('canjear_codigo_regalo', { p_codigo: code });
  if (error) throw error;
  if (!data?.success) throw new Error(data?.message || 'No se pudo aplicar el código.');
  setPendingPromo('');
  window.dispatchEvent(new CustomEvent('campobase:subscription-updated', { detail: data.subscription || null }));
  return data;
}

function prefillRememberedAccount() {
  const account = getRememberedSaasAccount();
  const login = $('#saas-login-form');
  if (!account || !login) return;
  const identifier = login.elements.identifier;
  if (identifier && !identifier.value) identifier.value = account.email || (account.username ? `@${account.username}` : '');
  if (!login.querySelector('.cb-auth-account-memory')) {
    const intro = login.querySelector('.meta');
    intro?.insertAdjacentHTML('afterend', `<div class="cb-auth-account-memory">Cuenta recordada: <strong>${account.fullName || account.email || account.username || 'Usuario'}</strong></div>`);
  }
}

async function rememberCurrentAccountIfRequested(client) {
  const session = await getCurrentSession(client).catch(() => null);
  if (!session?.user) return null;
  const profile = await getCurrentProfile(client, session.user.id).catch(() => null);
  const ownerDevice = String(profile?.email || session.user.email || '').toLowerCase() === OWNER_EMAIL;
  if (!getRememberRequest() && !ownerDevice) return null;
  return rememberSaasAccount(session.user, profile || {});
}

function accountChoiceVisible() {
  const choice = $('#saas-account-choice');
  return Boolean(choice && !choice.classList.contains('hidden'));
}

async function onAccountPrepared(client) {
  if (!accountChoiceVisible()) return;
  await rememberCurrentAccountIfRequested(client).catch(() => null);
  const promo = getPendingPromo();
  if (!promo) return;
  const target = $('#saas-claim-message');
  try {
    const result = await redeemPendingPromo(client);
    if (target && result?.message) {
      target.textContent = result.message;
      target.classList.add('success');
      target.classList.remove('error');
    }
  } catch (error) {
    if (target) {
      target.textContent = `Cuenta creada. El código no se ha aplicado: ${error.message || 'código no válido'}`;
      target.classList.add('error');
      target.classList.remove('success');
    }
  }
}

function bindFormMemory(client) {
  const login = $('#saas-login-form');
  const register = $('#saas-register-form');

  login?.addEventListener('submit', () => {
    setRememberRequest(Boolean(login.elements.rememberDevice?.checked));
  }, true);

  register?.addEventListener('submit', () => {
    setRememberRequest(Boolean(register.elements.rememberDevice?.checked));
    setPendingPromo(register.elements.promoCode?.value || '');
  }, true);

  if (!accountObserver) {
    accountObserver = new MutationObserver(() => { onAccountPrepared(client).catch(() => {}); });
    const shell = $('#saas-auth-shell');
    if (shell) accountObserver.observe(shell, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }
}

async function forceRememberedLocalPinGate(client) {
  if (localGateApplied) return;
  const account = getRememberedSaasAccount();
  const bound = getBoundSaasUserId();
  const session = await getCurrentSession(client).catch(() => null);
  if (!account?.id || !bound || !session?.user || account.id !== bound || session.user.id !== bound) return;

  // En la cuenta propietaria actual se memoriza el correo solo en los dispositivos
  // donde ya existe una sesión válida; nunca se muestra ni se rellena para otros usuarios.
  const profile = await getCurrentProfile(client, session.user.id).catch(() => null);
  if (String(profile?.email || session.user.email || '').toLowerCase() === OWNER_EMAIL) {
    rememberSaasAccount(session.user, profile || {});
  }

  localGateApplied = true;
  window.setTimeout(() => {
    const localPinButton = $('#saas-local-pin-btn');
    const dialog = $('#auth-dialog');
    if (!dialog) return;
    document.body.classList.add('auth-locked');
    try { sessionStorage.removeItem('campobase.sessionRole'); } catch { /* noop */ }
    if (!dialog.open) dialog.showModal();
    localPinButton?.click();
  }, 180);
}

export async function initSaasAuthEnhancements(client) {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;
  installStyles();
  injectFields();
  prefillRememberedAccount();
  bindFormMemory(client);
  await rememberCurrentAccountIfRequested(client).catch(() => null);
  await forceRememberedLocalPinGate(client).catch(() => null);
}
