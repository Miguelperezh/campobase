// ============================================================================
// CampoBase · Gestor de instalación PWA
// Capa aislada de UI: no lee ni escribe datos deportivos ni modifica Supabase.
// ============================================================================

let deferredInstallPrompt = null;
let isAppInstalled = false;
let initialized = false;

const PERMANENT_DISMISS_KEY = 'campobase.pwa_permanently_dismissed';
const SESSION_DISMISS_KEY = 'campobase.pwa_dismissed';
const STYLE_LINK_ID = 'cb-pwa-install-styles';

/**
 * Detecta la plataforma del dispositivo.
 * @param {string} ua
 * @returns {'ios'|'android'|'mac'|'windows'|'linux'|'other'}
 */
export function detectPlatform(ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '')) {
  if (typeof window !== 'undefined' && window.location?.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const simulated = params.get('simular') || params.get('device');
      if (simulated && ['windows', 'mac', 'android', 'ios'].includes(simulated.toLowerCase())) {
        return simulated.toLowerCase();
      }
    } catch {}
  }

  if (!ua) return 'other';
  if (/iPad|iPhone|iPod/i.test(ua)) return 'ios';
  if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Macintosh|Mac OS X/i.test(ua)) return 'mac';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Linux/i.test(ua)) return 'linux';
  return 'other';
}

/** Comprueba si CampoBase se está ejecutando como PWA instalada. */
export function isStandalone() {
  if (typeof window === 'undefined') return false;
  const mediaStandalone = Boolean(window.matchMedia?.('(display-mode: standalone)').matches);
  const iosStandalone = Boolean(window.navigator?.standalone);
  return mediaStandalone || iosStandalone;
}

/** Texto del botón según el dispositivo detectado. */
export function getInstallButtonLabel(platform = detectPlatform()) {
  switch (platform) {
    case 'mac': return 'Instalar CampoBase en Mac';
    case 'windows': return 'Instalar CampoBase en Windows';
    case 'android': return 'Instalar CampoBase en Android';
    case 'ios': return 'Instalar en tu iPhone / iPad';
    default: return 'Instalar CampoBase como App';
  }
}

export function isPermanentlyDismissed() {
  if (typeof localStorage === 'undefined') return false;
  try {
    return localStorage.getItem(PERMANENT_DISMISS_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPermanentlyDismissed(value = true) {
  if (typeof localStorage === 'undefined') return;
  try {
    if (value) {
      localStorage.setItem(PERMANENT_DISMISS_KEY, 'true');
    } else {
      localStorage.removeItem(PERMANENT_DISMISS_KEY);
      sessionStorage.removeItem(SESSION_DISMISS_KEY);
    }
  } catch {}
}

function isDismissedForSession() {
  if (typeof sessionStorage === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_DISMISS_KEY) === 'true';
  } catch {
    return false;
  }
}

function setDismissedForSession() {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_DISMISS_KEY, 'true');
  } catch {}
}

function ensureStylesheet() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_LINK_ID)) return;
  const link = document.createElement('link');
  link.id = STYLE_LINK_ID;
  link.rel = 'stylesheet';
  link.href = 'pwa-install.css?v=1';
  document.head.appendChild(link);
}

function createInstallBanner() {
  const banner = document.createElement('div');
  banner.id = 'cb-pwa-install-banner';
  banner.className = 'cb-pwa-banner cb-hidden';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Instalar aplicación');
  banner.innerHTML = `
    <div class="cb-pwa-banner-content">
      <div class="cb-pwa-banner-info">
        <span class="cb-pwa-icon" aria-hidden="true">📲</span>
        <div>
          <strong id="cb-pwa-banner-title">Instala CampoBase en tu dispositivo</strong>
          <p id="cb-pwa-banner-sub">Acceso directo sin navegador, pantalla completa y modo sin conexión.</p>
        </div>
      </div>
      <div class="cb-pwa-banner-actions">
        <button type="button" id="cb-pwa-install-btn" class="primary compact">Instalar CampoBase</button>
        <button type="button" id="cb-pwa-never-btn" class="secondary compact">No ver más en este dispositivo</button>
        <button type="button" id="cb-pwa-dismiss-btn" class="ghost compact">Cerrar aviso</button>
      </div>
    </div>
  `;
  return banner;
}

function createSettingsPanel() {
  const panel = document.createElement('article');
  panel.className = 'panel';
  panel.id = 'cb-install-settings-panel';
  panel.innerHTML = `
    <div class="panel-head">
      <h3>Aplicación e Instalación</h3>
      <p class="meta">Instala CampoBase en tu dispositivo para abrirlo en su propia ventana, sin barras de navegación y con acceso rápido.</p>
    </div>
    <div id="cb-install-status-box" class="cb-install-status-box">
      <button type="button" id="cb-settings-install-btn" class="primary compact">Instalar CampoBase en este equipo</button>
      <p id="cb-settings-installed-msg" class="meta hidden">CampoBase ya está instalada y funcionando como aplicación en este dispositivo.</p>
      <button type="button" id="cb-settings-restore-pwa-btn" class="secondary compact hidden">Volver a mostrar aviso de instalación</button>
    </div>
  `;
  return panel;
}

function ensureInstallUi() {
  if (typeof document === 'undefined') return;
  ensureStylesheet();

  if (!document.getElementById('cb-pwa-install-banner')) {
    const banner = createInstallBanner();
    const topbar = document.querySelector('.topbar');
    if (topbar?.parentNode) topbar.parentNode.insertBefore(banner, topbar);
    else document.body.prepend(banner);
  }

  if (!document.getElementById('cb-install-settings-panel')) {
    const settingsGrid = document.querySelector('#ajustes .settings-grid');
    if (settingsGrid) settingsGrid.appendChild(createSettingsPanel());
  }
}

function setHidden(element, hidden) {
  if (!element) return;
  element.classList.toggle('hidden', hidden);
  element.classList.toggle('cb-hidden', hidden);
}

function updateInstallUi({ forceBanner = false } = {}) {
  if (typeof document === 'undefined') return;
  ensureInstallUi();

  const installed = isStandalone() || isAppInstalled;
  const permanent = isPermanentlyDismissed();
  const sessionDismissed = isDismissedForSession();
  const label = getInstallButtonLabel();

  const banner = document.getElementById('cb-pwa-install-banner');
  const bannerButton = document.getElementById('cb-pwa-install-btn');
  const settingsButton = document.getElementById('cb-settings-install-btn');
  const installedMessage = document.getElementById('cb-settings-installed-msg');
  const restoreButton = document.getElementById('cb-settings-restore-pwa-btn');

  if (bannerButton) bannerButton.textContent = label;
  if (settingsButton) settingsButton.textContent = label;

  setHidden(settingsButton, installed);
  setHidden(installedMessage, !installed);
  setHidden(restoreButton, installed || !permanent);

  const showBanner = !installed && !permanent && (forceBanner || !sessionDismissed);
  setHidden(banner, !showBanner);
}

function removeInstallModal(modal) {
  if (!modal) return;
  modal.remove();
}

function bindModalClose(modal) {
  modal.querySelectorAll('[data-cb-install-close]').forEach((button) => {
    button.addEventListener('click', () => removeInstallModal(modal));
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) removeInstallModal(modal);
  });
}

/** Instrucciones de instalación para Safari en iPhone/iPad. */
export function showIosInstallInstructions() {
  if (typeof document === 'undefined') return;
  document.getElementById('cb-ios-install-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'cb-ios-install-modal';
  modal.className = 'cb-install-modal-backdrop';
  modal.innerHTML = `
    <div class="cb-install-modal-card" role="dialog" aria-modal="true" aria-labelledby="cb-ios-modal-title">
      <div class="cb-install-modal-head">
        <h3 id="cb-ios-modal-title">Instalar CampoBase en iPhone / iPad</h3>
      </div>
      <div class="cb-install-modal-body">
        <p>Para usar CampoBase a pantalla completa y sin barras de navegación:</p>
        <ol class="cb-install-steps">
          <li><strong>1.</strong> Pulsa <strong>Compartir</strong> en Safari (cuadrado con flecha hacia arriba).</li>
          <li><strong>2.</strong> Desliza y toca <strong>«Añadir a pantalla de inicio»</strong>.</li>
          <li><strong>3.</strong> Pulsa <strong>«Añadir»</strong> arriba a la derecha.</li>
        </ol>
      </div>
      <div class="cb-install-modal-footer">
        <button type="button" class="primary" data-cb-install-close>Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  bindModalClose(modal);
}

/** Instrucciones de respaldo cuando el navegador no ofrece el prompt automático. */
export function showDesktopInstallInstructions(platform = detectPlatform()) {
  if (typeof document === 'undefined') return;
  document.getElementById('cb-desktop-install-modal')?.remove();

  const titles = {
    mac: 'Instalar CampoBase en Mac',
    windows: 'Instalar CampoBase en Windows',
    android: 'Instalar CampoBase en Android',
    linux: 'Instalar CampoBase como App',
    other: 'Instalar CampoBase como App',
  };
  const title = titles[platform] || titles.other;
  const isMac = platform === 'mac';
  const isAndroid = platform === 'android';

  const modal = document.createElement('div');
  modal.id = 'cb-desktop-install-modal';
  modal.className = 'cb-install-modal-backdrop';
  modal.innerHTML = `
    <div class="cb-install-modal-card" role="dialog" aria-modal="true" aria-labelledby="cb-desk-modal-title">
      <div class="cb-install-modal-head">
        <h3 id="cb-desk-modal-title">${title}</h3>
      </div>
      <div class="cb-install-modal-body">
        ${isAndroid ? `
          <p>Si el botón de instalación no aparece automáticamente, abre el menú del navegador y elige <strong>«Instalar aplicación»</strong> o <strong>«Añadir a pantalla de inicio»</strong>.</p>
        ` : `
          <p>Puedes instalar CampoBase desde las opciones de tu navegador:</p>
          <ol class="cb-install-steps">
            <li><strong>Chrome o Edge:</strong> usa el icono de instalación de la barra de direcciones o el menú del navegador para instalar la página como aplicación.</li>
            ${isMac ? '<li><strong>Safari en Mac:</strong> abre el menú <strong>Archivo</strong> y selecciona <strong>Añadir al Dock</strong>.</li>' : ''}
          </ol>
        `}
      </div>
      <div class="cb-install-modal-footer">
        <button type="button" class="primary" data-cb-install-close>Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  bindModalClose(modal);
}

/** Inicia el prompt nativo o muestra las instrucciones apropiadas. */
export async function promptInstall() {
  const platform = detectPlatform();

  if (platform === 'ios') {
    showIosInstallInstructions();
    return { outcome: 'ios' };
  }

  if (!deferredInstallPrompt) {
    showDesktopInstallInstructions(platform);
    return { outcome: 'unsupported' };
  }

  try {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      isAppInstalled = true;
      deferredInstallPrompt = null;
      updateInstallUi();
    }
    return choice;
  } catch (error) {
    console.warn('[PWA] No se pudo abrir el instalador:', error);
    return { outcome: 'dismissed' };
  }
}

function bindUiEvents() {
  document.getElementById('cb-pwa-install-btn')?.addEventListener('click', () => promptInstall());
  document.getElementById('cb-settings-install-btn')?.addEventListener('click', () => promptInstall());

  document.getElementById('cb-pwa-dismiss-btn')?.addEventListener('click', () => {
    setDismissedForSession();
    updateInstallUi();
  });

  document.getElementById('cb-pwa-never-btn')?.addEventListener('click', () => {
    setPermanentlyDismissed(true);
    updateInstallUi();
  });

  document.getElementById('cb-settings-restore-pwa-btn')?.addEventListener('click', () => {
    setPermanentlyDismissed(false);
    updateInstallUi({ forceBanner: true });
  });

  // Compatibilidad con el contrato de la fase original de Antigravity.
  window.cbDismissPwa = (permanent) => {
    if (permanent) setPermanentlyDismissed(true);
    else setDismissedForSession();
    updateInstallUi();
  };
}

/** Inicializa la Fase 1 sin tocar la lógica principal de CampoBase. */
export function initPwaInstallManager() {
  if (typeof window === 'undefined' || typeof document === 'undefined' || initialized) return;
  initialized = true;

  ensureInstallUi();
  bindUiEvents();
  updateInstallUi();

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallUi();
  });

  window.addEventListener('appinstalled', () => {
    isAppInstalled = true;
    deferredInstallPrompt = null;
    updateInstallUi();
  });

  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', () => updateInstallUi());
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPwaInstallManager, { once: true });
  } else {
    initPwaInstallManager();
  }
}
