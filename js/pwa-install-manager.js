// CampoBase · Gestor de instalación PWA
// Capa aislada de UI. No toca Supabase ni datos deportivos.

let deferredInstallPrompt = null;
let isAppInstalled = false;
let initialized = false;

const PERMANENT_DISMISS_KEY = 'campobase.pwa_permanently_dismissed';
const SESSION_DISMISS_KEY = 'campobase.pwa_dismissed';
const STYLE_LINK_ID = 'cb-pwa-install-styles';

export function detectPlatform(ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '')) {
  if (!ua) return 'other';
  if (/iPad|iPhone|iPod/i.test(ua)) return 'ios';
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'mac';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Linux/i.test(ua)) return 'linux';
  return 'other';
}

export function detectBrowser(ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '')) {
  if (/Edg\//i.test(ua)) return 'edge';
  if (/OPR\//i.test(ua)) return 'opera';
  if (/CriOS\//i.test(ua)) return 'chrome-ios';
  if (/FxiOS\//i.test(ua)) return 'firefox-ios';
  if (/Chrome\//i.test(ua)) return 'chrome';
  if (/Firefox\//i.test(ua)) return 'firefox';
  if (/Safari\//i.test(ua)) return 'safari';
  return 'other';
}

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator?.standalone);
}

export function getInstallButtonLabel(platform = detectPlatform()) {
  return ({
    mac: 'Instalar CampoBase en Mac',
    windows: 'Instalar CampoBase en Windows',
    android: 'Instalar CampoBase en Android',
    ios: 'Instalar en iPhone / iPad',
  })[platform] || 'Instalar CampoBase como App';
}

export function isPermanentlyDismissed() {
  try { return localStorage.getItem(PERMANENT_DISMISS_KEY) === 'true'; }
  catch { return false; }
}

export function setPermanentlyDismissed(value = true) {
  try {
    if (value) localStorage.setItem(PERMANENT_DISMISS_KEY, 'true');
    else {
      localStorage.removeItem(PERMANENT_DISMISS_KEY);
      sessionStorage.removeItem(SESSION_DISMISS_KEY);
    }
  } catch {}
}

function isDismissedForSession() {
  try { return sessionStorage.getItem(SESSION_DISMISS_KEY) === 'true'; }
  catch { return false; }
}

function dismissForSession() {
  try { sessionStorage.setItem(SESSION_DISMISS_KEY, 'true'); }
  catch {}
}

function ensureStylesheet() {
  if (document.getElementById(STYLE_LINK_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_LINK_ID;
  link.rel = 'stylesheet';
  link.href = 'pwa-install.css?v=2';
  document.head.appendChild(link);
}

function svg(kind) {
  const base = 'viewBox="0 0 24 24" aria-hidden="true"';
  const icons = {
    apple: `<svg ${base}><path fill="currentColor" d="M16.7 13.1c0-2.1 1.7-3.1 1.8-3.2-1-.1-2.2.6-2.7.6-.6 0-1.4-.6-2.4-.6-1.2 0-2.4.7-3 1.8-1.3 2.2-.3 5.4.9 7.1.6.8 1.3 1.8 2.3 1.7.9 0 1.3-.6 2.4-.6 1.1 0 1.4.6 2.4.6 1 0 1.6-.9 2.2-1.7.7-1 1-2 1-2.1-.1 0-1.9-.7-1.9-3.6zM15.9 8.8c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.3 1.1-.5.6-.9 1.4-.8 2.3.9.1 1.8-.4 2.3-1z"/></svg>`,
    android: `<svg ${base}><path fill="currentColor" d="M7.1 7.5 5.8 5.2l.8-.5 1.4 2.4c1.1-.5 2.3-.8 4-.8s2.9.3 4 .8l1.4-2.4.8.5-1.3 2.3c1.8 1.1 3 2.8 3.1 4.8H4c.1-2 1.3-3.7 3.1-4.8zM8.2 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7.6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM4 13.3h16v5.2c0 1.1-.9 2-2 2h-1v2h-2v-2H9v2H7v-2H6c-1.1 0-2-.9-2-2v-5.2z"/></svg>`,
    windows: `<svg ${base}><path fill="currentColor" d="m3 5.2 7.6-1v7.3H3V5.2zm8.6-1.1L21 3v8.5h-9.4V4.1zM3 12.5h7.6v7.3l-7.6-1v-6.3zm8.6 0H21V21l-9.4-1.1v-7.4z"/></svg>`,
    chrome: `<svg ${base}><path fill="currentColor" d="M12 2a10 10 0 0 0-8.7 5h7.2a5 5 0 0 1 8.7 0h-5.4A5 5 0 0 1 9.4 17L6 22A10 10 0 1 0 12 2zm0 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>`,
    safari: `<svg ${base}><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="m14.8 8-1.6 5.2L8 14.8l1.6-5.2L14.8 8zm-3.4 3.4-.8 2.6 2.6-.8.8-2.6-2.6.8z"/></svg>`,
    edge: `<svg ${base}><path fill="currentColor" d="M20.4 13.5c0-5-3.2-8.4-8.1-8.4-4.4 0-8.3 3.4-8.3 8.3 0 .6.1 1.3.2 1.9 1-2.4 3.3-4.1 6.1-4.1 3 0 5.5 2 6.2 4.8-1.2-1.1-2.8-1.8-4.6-1.8-2.9 0-5.4 1.9-6.3 4.6 1.6 1.4 3.7 2.2 6 2.2 4.9 0 8.8-3.2 8.8-7.5z"/></svg>`,
    generic: `<svg ${base}><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2"/></svg>`,
  };
  return icons[kind] || icons.generic;
}

function platformInfo(platform = detectPlatform()) {
  if (platform === 'ios') return ['apple', 'iPhone / iPad'];
  if (platform === 'mac') return ['apple', 'Mac'];
  if (platform === 'android') return ['android', 'Android'];
  if (platform === 'windows') return ['windows', 'Windows'];
  if (platform === 'linux') return ['generic', 'Linux'];
  return ['generic', 'Tu dispositivo'];
}

function browserInfo(browser = detectBrowser()) {
  if (browser === 'safari') return ['safari', 'Safari'];
  if (browser === 'edge') return ['edge', 'Edge'];
  if (browser === 'chrome' || browser === 'chrome-ios') return ['chrome', 'Chrome'];
  if (browser === 'firefox' || browser === 'firefox-ios') return ['generic', 'Firefox'];
  if (browser === 'opera') return ['generic', 'Opera'];
  return ['generic', 'Navegador'];
}

function deviceChips() {
  const [pIcon, pLabel] = platformInfo();
  const [bIcon, bLabel] = browserInfo();
  return `<div class="cb-pwa-platform-row"><span class="cb-pwa-platform-chip">${svg(pIcon)}<span>${pLabel}</span></span><span class="cb-pwa-platform-chip">${svg(bIcon)}<span>${bLabel}</span></span></div>`;
}

function createBanner() {
  const el = document.createElement('aside');
  el.id = 'cb-pwa-install-banner';
  el.className = 'cb-pwa-banner cb-hidden';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Instalar CampoBase');
  el.innerHTML = `<div class="cb-pwa-banner-content"><div class="cb-pwa-banner-leading"><div class="cb-pwa-app-mark">CB</div><div class="cb-pwa-banner-copy"><span class="cb-pwa-kicker">CAMPOBASE EN TU EQUIPO</span><strong>Instala CampoBase como aplicación</strong><p>Ábrela en su propia ventana, con acceso rápido y soporte sin conexión.</p>${deviceChips()}</div></div><div class="cb-pwa-banner-actions"><button id="cb-pwa-install-btn" class="primary compact" type="button">Instalar ahora</button><button id="cb-pwa-how-btn" class="secondary compact" type="button">Cómo instalar</button><button id="cb-pwa-never-btn" class="ghost compact" type="button">No volver a mostrar</button><button id="cb-pwa-dismiss-btn" class="ghost compact" type="button">Ahora no</button></div></div>`;
  return el;
}

function createSettingsPanel() {
  const [pIcon, pLabel] = platformInfo();
  const [, bLabel] = browserInfo();
  const el = document.createElement('article');
  el.className = 'panel cb-install-settings-card';
  el.id = 'cb-install-settings-panel';
  el.innerHTML = `<div class="cb-install-settings-head"><div class="cb-install-settings-icon">${svg(pIcon)}</div><div><p class="eyebrow">Aplicación</p><h3>Instalar CampoBase</h3><p class="meta">Úsala como una app en ${pLabel} con ${bLabel}.</p></div></div>${deviceChips()}<div id="cb-install-status-box" class="cb-install-status-box"><button id="cb-settings-install-btn" class="primary compact" type="button">Instalar CampoBase</button><button id="cb-settings-how-btn" class="secondary compact" type="button">Ver instrucciones</button><p id="cb-settings-installed-msg" class="meta hidden">CampoBase ya está instalada y funcionando como aplicación en este dispositivo.</p><button id="cb-settings-restore-pwa-btn" class="secondary compact hidden" type="button">Volver a mostrar aviso de instalación</button></div>`;
  return el;
}

function ensureUi() {
  ensureStylesheet();
  if (!document.getElementById('cb-pwa-install-banner')) {
    const banner = createBanner();
    const topbar = document.querySelector('.topbar');
    topbar?.parentNode ? topbar.parentNode.insertBefore(banner, topbar) : document.body.prepend(banner);
  }
  if (!document.getElementById('cb-install-settings-panel')) document.querySelector('#ajustes .settings-grid')?.appendChild(createSettingsPanel());
}

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle('hidden', hidden);
  el.classList.toggle('cb-hidden', hidden);
}

function updateUi({ forceBanner = false } = {}) {
  ensureUi();
  const installed = isStandalone() || isAppInstalled;
  const permanent = isPermanentlyDismissed();
  const sessionDismissed = isDismissedForSession();
  const installLabel = deferredInstallPrompt ? 'Instalar ahora' : getInstallButtonLabel();
  const banner = document.getElementById('cb-pwa-install-banner');
  const mainBtn = document.getElementById('cb-pwa-install-btn');
  const settingsBtn = document.getElementById('cb-settings-install-btn');
  if (mainBtn) mainBtn.textContent = installLabel;
  if (settingsBtn) settingsBtn.textContent = installLabel;
  setHidden(settingsBtn, installed);
  setHidden(document.getElementById('cb-settings-how-btn'), installed);
  setHidden(document.getElementById('cb-settings-installed-msg'), !installed);
  setHidden(document.getElementById('cb-settings-restore-pwa-btn'), installed || !permanent);
  setHidden(banner, installed || permanent || (!forceBanner && sessionDismissed));
}

function showModal(title, kicker, iconKind, intro, steps) {
  document.querySelector('.cb-install-modal-backdrop')?.remove();
  const modal = document.createElement('div');
  modal.className = 'cb-install-modal-backdrop';
  modal.innerHTML = `<div class="cb-install-modal-card" role="dialog" aria-modal="true"><div class="cb-install-modal-hero"><div class="cb-install-modal-logo">${svg(iconKind)}</div><div><p class="cb-pwa-kicker">${kicker}</p><h3>${title}</h3></div></div><div class="cb-install-modal-body"><p>${intro}</p><ol class="cb-install-steps">${steps.map((s, i) => `<li><span>${i + 1}</span><div>${s}</div></li>`).join('')}</ol></div><div class="cb-install-modal-footer"><button class="primary" type="button" data-cb-install-close>Cerrar</button></div></div>`;
  document.body.appendChild(modal);
  modal.querySelector('[data-cb-install-close]')?.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

export function showIosInstallInstructions() {
  showModal('Instalar CampoBase', 'IPHONE / IPAD', 'apple', 'En iPhone y iPad la instalación se hace desde el menú Compartir de Safari.', ['Pulsa <strong>Compartir</strong> en Safari.', 'Elige <strong>«Añadir a pantalla de inicio»</strong>.', 'Pulsa <strong>«Añadir»</strong>. CampoBase quedará como una app.']);
}

export function showDesktopInstallInstructions(platform = detectPlatform(), browser = detectBrowser()) {
  const [pIcon, pLabel] = platformInfo(platform);
  const [, bLabel] = browserInfo(browser);
  let steps;
  if (platform === 'mac' && browser === 'safari') steps = ['Abre el menú <strong>Archivo</strong> de Safari.', 'Selecciona <strong>«Añadir al Dock»</strong>.', 'Confirma para abrir CampoBase como una app independiente.'];
  else if (platform === 'android') steps = [`Abre el menú de <strong>${bLabel}</strong>.`, 'Busca <strong>«Instalar aplicación»</strong> o <strong>«Añadir a pantalla de inicio»</strong>.', 'Confirma la instalación.'];
  else steps = [`Busca el icono de instalación en la barra o abre el menú de <strong>${bLabel}</strong>.`, 'Elige <strong>«Instalar aplicación»</strong> o <strong>«Instalar página como aplicación»</strong>.', 'Confirma para abrir CampoBase en su propia ventana.'];
  showModal('Instalar CampoBase', `${pLabel.toUpperCase()} · ${bLabel.toUpperCase()}`, pIcon, 'El navegador decide si muestra el icono de instalación en la barra. Si no aparece, puedes instalar CampoBase desde su menú.', steps);
}

function showInstructions() {
  if (detectPlatform() === 'ios') showIosInstallInstructions();
  else showDesktopInstallInstructions();
}

export async function promptInstall() {
  if (detectPlatform() === 'ios') {
    showIosInstallInstructions();
    return { outcome: 'ios' };
  }
  if (!deferredInstallPrompt) {
    showDesktopInstallInstructions();
    return { outcome: 'unsupported' };
  }
  try {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      isAppInstalled = true;
      deferredInstallPrompt = null;
      updateUi();
    }
    return choice;
  } catch (error) {
    console.warn('[PWA] No se pudo abrir el instalador:', error);
    return { outcome: 'dismissed' };
  }
}

function bindEvents() {
  document.getElementById('cb-pwa-install-btn')?.addEventListener('click', () => promptInstall());
  document.getElementById('cb-pwa-how-btn')?.addEventListener('click', showInstructions);
  document.getElementById('cb-settings-install-btn')?.addEventListener('click', () => promptInstall());
  document.getElementById('cb-settings-how-btn')?.addEventListener('click', showInstructions);
  document.getElementById('cb-pwa-dismiss-btn')?.addEventListener('click', () => { dismissForSession(); updateUi(); });
  document.getElementById('cb-pwa-never-btn')?.addEventListener('click', () => { setPermanentlyDismissed(true); updateUi(); });
  document.getElementById('cb-settings-restore-pwa-btn')?.addEventListener('click', () => { setPermanentlyDismissed(false); updateUi({ forceBanner: true }); });
  window.cbDismissPwa = permanent => { permanent ? setPermanentlyDismissed(true) : dismissForSession(); updateUi(); };
}

export function initPwaInstallManager() {
  if (initialized || typeof window === 'undefined' || typeof document === 'undefined') return;
  initialized = true;
  ensureUi();
  bindEvents();
  updateUi();
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateUi();
  });
  window.addEventListener('appinstalled', () => {
    isAppInstalled = true;
    deferredInstallPrompt = null;
    updateUi();
  });
  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', () => updateUi());
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPwaInstallManager, { once: true });
  else initPwaInstallManager();
}
