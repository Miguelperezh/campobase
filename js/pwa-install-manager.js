// Gestor de instalación PWA
// Capa aislada de UI. No toca Supabase ni datos deportivos.

let deferredInstallPrompt = null;
let isAppInstalled = false;
let initialized = false;

// Se conservan estas claves para no perder preferencias ya guardadas en dispositivos existentes.
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
  if (typeof navigator !== 'undefined' && navigator.brave) return 'brave';
  if (/EdgiOS\//i.test(ua)) return 'edge-ios';
  if (/EdgA\//i.test(ua)) return 'edge-android';
  if (/Edg\//i.test(ua)) return 'edge';
  if (/OPiOS\//i.test(ua)) return 'opera-ios';
  if (/OPR\//i.test(ua)) return 'opera';
  if (/SamsungBrowser\//i.test(ua)) return 'samsung';
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

export function getInstallButtonLabel() {
  return 'Instalar aplicación';
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
    firefox: `<svg ${base}><path fill="currentColor" d="M20.7 8.4c-.5-1.4-1.5-2.7-2.7-3.6.1.6 0 1.3-.3 1.9-.9-1-2.3-1.7-3.8-1.8-1.7-.1-3.3.5-4.5 1.6.9-.1 1.8.1 2.5.6-2.2.3-4 1.7-4.9 3.6-.9 2-.6 4.4.8 6.1 1.6 2 4.2 3 6.7 2.5 2.7-.5 5-2.5 5.8-5.1.6-1.9.5-4-.2-5.8h.6zM13 17.1c-2.5.5-4.9-1.2-5.3-3.7-.2-1.4.2-2.8 1.2-3.8-.2 2 1.2 3.9 3.2 4.2 1.7.3 3.3-.6 4-2.1.2.4.3.8.3 1.2.4 2-1.1 3.8-3.4 4.2z"/></svg>`,
    opera: `<svg ${base}><path fill="currentColor" d="M12 2C6.7 2 3.5 6.2 3.5 12S6.7 22 12 22s8.5-4.2 8.5-10S17.3 2 12 2zm0 3.3c2.7 0 4.4 2.7 4.4 6.7s-1.7 6.7-4.4 6.7S7.6 16 7.6 12 9.3 5.3 12 5.3z"/></svg>`,
    brave: `<svg ${base}><path fill="currentColor" d="m12 2 5.8 1.8 2.7 4.8-1 8.2L12 22l-7.5-5.2-1-8.2 2.7-4.8L12 2zm0 4.1L8.1 7.3 6.4 10l.6 4.8 5 3.4 5-3.4.6-4.8-1.7-2.7L12 6.1z"/></svg>`,
    samsung: `<svg ${base}><ellipse cx="12" cy="12" rx="9" ry="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6.5 13.6c1.8 1.7 7.8 2.5 11-1.1M7.3 9.5c2.4-1.2 6.9-1.5 9.6.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
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
  if (browser === 'edge' || browser === 'edge-ios' || browser === 'edge-android') return ['edge', 'Edge'];
  if (browser === 'chrome' || browser === 'chrome-ios') return ['chrome', 'Chrome'];
  if (browser === 'firefox' || browser === 'firefox-ios') return ['firefox', 'Firefox'];
  if (browser === 'opera' || browser === 'opera-ios') return ['opera', 'Opera'];
  if (browser === 'brave') return ['brave', 'Brave'];
  if (browser === 'samsung') return ['samsung', 'Samsung Internet'];
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
  el.setAttribute('aria-label', 'Instalar aplicación');
  el.innerHTML = `<div class="cb-pwa-banner-content"><div class="cb-pwa-banner-leading"><div class="cb-pwa-banner-copy"><span class="cb-pwa-kicker">APLICACIÓN EN TU DISPOSITIVO</span><strong>Instalar como aplicación</strong><p>Acceso rápido, ventana independiente y soporte sin conexión.</p>${deviceChips()}</div></div><div class="cb-pwa-banner-actions"><button id="cb-pwa-install-btn" class="primary compact" type="button">Instalar aplicación</button><button id="cb-pwa-never-btn" class="ghost compact" type="button">No volver a mostrar</button><button id="cb-pwa-dismiss-btn" class="ghost compact" type="button">Ahora no</button></div></div>`;
  return el;
}

function createSettingsPanel() {
  const [pIcon, pLabel] = platformInfo();
  const [bIcon, bLabel] = browserInfo();
  const el = document.createElement('article');
  el.className = 'panel cb-install-settings-card';
  el.id = 'cb-install-settings-panel';
  el.innerHTML = `<div class="cb-install-settings-head"><div class="cb-install-settings-icon">${svg(pIcon)}</div><div><p class="eyebrow">Aplicación</p><h3>Instalar aplicación</h3><p class="meta">Úsala como una app en ${pLabel} con ${bLabel}.</p></div></div><div class="cb-pwa-platform-row cb-pwa-platform-row-settings"><span class="cb-pwa-platform-chip">${svg(pIcon)}<span>${pLabel}</span></span><span class="cb-pwa-platform-chip">${svg(bIcon)}<span>${bLabel}</span></span></div><div id="cb-install-status-box" class="cb-install-status-box"><button id="cb-settings-install-btn" class="primary compact" type="button">Instalar aplicación</button><p id="cb-settings-installed-msg" class="meta hidden">La aplicación ya está instalada y funcionando como app en este dispositivo.</p><button id="cb-settings-restore-pwa-btn" class="secondary compact hidden" type="button">Volver a mostrar aviso de instalación</button></div>`;
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
  const banner = document.getElementById('cb-pwa-install-banner');
  const mainBtn = document.getElementById('cb-pwa-install-btn');
  const settingsBtn = document.getElementById('cb-settings-install-btn');
  if (mainBtn) mainBtn.textContent = getInstallButtonLabel();
  if (settingsBtn) settingsBtn.textContent = getInstallButtonLabel();
  setHidden(settingsBtn, installed);
  setHidden(document.getElementById('cb-settings-installed-msg'), !installed);
  setHidden(document.getElementById('cb-settings-restore-pwa-btn'), installed || !permanent);
  setHidden(banner, installed || permanent || (!forceBanner && sessionDismissed));
}

function showModal(title, kicker, iconKind, intro, steps, note = '') {
  document.querySelector('.cb-install-modal-backdrop')?.remove();
  const modal = document.createElement('div');
  modal.className = 'cb-install-modal-backdrop';
  modal.innerHTML = `<div class="cb-install-modal-card" role="dialog" aria-modal="true"><div class="cb-install-modal-hero"><div class="cb-install-modal-logo">${svg(iconKind)}</div><div><p class="cb-pwa-kicker">${kicker}</p><h3>${title}</h3></div></div><div class="cb-install-modal-body"><p>${intro}</p><ol class="cb-install-steps">${steps.map((s, i) => `<li><span>${i + 1}</span><div>${s}</div></li>`).join('')}</ol>${note ? `<p class="meta" style="margin-top:.85rem">${note}</p>` : ''}</div><div class="cb-install-modal-footer"><button class="primary" type="button" data-cb-install-close>Cerrar</button></div></div>`;
  document.body.appendChild(modal);
  modal.querySelector('[data-cb-install-close]')?.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

export function getInstallGuide(platform = detectPlatform(), browser = detectBrowser()) {
  const [, bLabel] = browserInfo(browser);

  if (platform === 'ios') {
    if (browser === 'chrome-ios') {
      return {
        icon: 'chrome',
        intro: 'En Chrome para iPhone o iPad se añade la aplicación desde el botón Compartir.',
        steps: [
          'Mira la <strong>barra de direcciones</strong> de Chrome y pulsa el botón <strong>Compartir</strong> que está a su derecha.',
          'Busca y pulsa <strong>«Añadir a pantalla de inicio»</strong>.',
          'Revisa el nombre de la aplicación y pulsa <strong>«Añadir»</strong>.',
        ],
        note: 'Si el sitio está disponible como app web, el icono de la pantalla de inicio abrirá la aplicación web.',
      };
    }
    if (browser === 'firefox-ios') {
      return {
        icon: 'firefox',
        intro: 'Firefox para iPhone y iPad permite crear el acceso desde su botón Compartir.',
        steps: [
          'Busca el icono <strong>Compartir</strong> en la barra de direcciones de Firefox y púlsalo.',
          'En el menú de compartir, pulsa <strong>«Añadir a pantalla de inicio»</strong>.',
          'Revisa el nombre y pulsa <strong>«Añadir»</strong> arriba a la derecha.',
        ],
        note: 'Firefox documenta este flujo como acceso directo a la pantalla de inicio.',
      };
    }
    if (browser === 'safari') {
      return {
        icon: 'safari',
        intro: 'Safari permite convertir este sitio en una app web desde el menú Compartir.',
        steps: [
          'En iPhone, pulsa <strong>Menú de página</strong> y después <strong>Compartir</strong>; si ves directamente el botón Compartir, púlsalo. En iPad, pulsa <strong>Compartir</strong> y después <strong>Más</strong>.',
          'Pulsa <strong>«Añadir a pantalla de inicio»</strong>. Si no aparece en iPhone, baja hasta <strong>«Editar acciones»</strong> y añádela.',
          'Activa <strong>«Abrir como app web»</strong>.',
          'Pulsa <strong>«Añadir»</strong>.',
        ],
        note: 'El icono se añadirá a la pantalla de inicio y abrirá el sitio como una app web.',
      };
    }
    return {
      icon: browserInfo(browser)[0],
      intro: `No hay una ruta oficial única verificada para instalar una PWA desde ${bLabel} en iPhone/iPad. Para evitar indicaciones incorrectas, usa Safari o Chrome.`,
      steps: [
        'Abre este sitio en <strong>Safari</strong> o <strong>Chrome</strong>.',
        'Pulsa <strong>Compartir</strong> y elige <strong>«Añadir a pantalla de inicio»</strong>.',
        'Si usas Safari, activa <strong>«Abrir como app web»</strong> y pulsa <strong>«Añadir»</strong>.',
      ],
      note: 'La guía no inventa nombres de menús que puedan variar entre navegadores.',
    };
  }

  if (platform === 'android') {
    if (browser === 'chrome') {
      return {
        icon: 'chrome',
        intro: 'Chrome para Android tiene una ruta específica para instalar aplicaciones web.',
        steps: [
          'Mira a la <strong>derecha de la barra de direcciones</strong> y pulsa los <strong>tres puntos verticales ⋮</strong>. Ese es el menú de Chrome.',
          'Pulsa <strong>«Instalar y crear acceso directo»</strong>.',
          'Pulsa <strong>«Instalar»</strong> y confirma si Android te lo pide.',
        ],
      };
    }
    if (browser === 'firefox') {
      return {
        icon: 'firefox',
        intro: 'Firefox para Android instala las apps web desde su menú de tres puntos.',
        steps: [
          'Pulsa el botón de los <strong>tres puntos ⋮</strong> de Firefox.',
          'Pulsa <strong>«Instalar»</strong>. Si Firefox no reconoce la PWA, puede mostrar <strong>«Añadir a pantalla de inicio»</strong>.',
          'Coloca el icono donde quieras o pulsa la opción de <strong>añadir automáticamente</strong>.',
        ],
        note: 'En Firefox Android la opción puede variar entre instalación de app web y simple acceso directo según cómo detecte el sitio.',
      };
    }
    if (browser === 'opera') {
      return {
        icon: 'opera',
        intro: 'Opera para Android permite añadir una página desde el menú situado junto a la barra de direcciones.',
        steps: [
          'Pulsa los <strong>tres puntos</strong> situados en el extremo derecho de la barra de direcciones.',
          'Pulsa <strong>«Añadir a»</strong>.',
          'Elige <strong>añadir a la pantalla de inicio</strong> y confirma.',
        ],
      };
    }
    if (browser === 'samsung') {
      return {
        icon: 'samsung',
        intro: 'Samsung Internet puede mostrar directamente un indicador de instalación para las PWA.',
        steps: [
          'Busca el indicador <strong>+</strong> de aplicación web en la barra de direcciones; si aparece, púlsalo.',
          'Si no aparece, abre el menú de Samsung Internet y busca <strong>«Añadir a Inicio»</strong> o la opción equivalente de pantalla de inicio.',
          'Confirma para crear el icono de la aplicación.',
        ],
        note: 'Samsung documenta el indicador + y la función «Add to Home» para aplicaciones web.',
      };
    }
    return {
      icon: browserInfo(browser)[0],
      intro: `En ${bLabel} para Android el nombre exacto puede variar. Se intentará primero abrir el instalador nativo del navegador.`,
      steps: [
        'Busca el botón de menú junto a la <strong>barra de direcciones</strong>.',
        'Busca una opción llamada <strong>«Instalar»</strong>, <strong>«Instalar aplicación»</strong> o <strong>«Añadir a pantalla de inicio»</strong>.',
        'Confirma para crear la aplicación o el acceso.',
      ],
      note: 'Si no aparece una opción de instalación, abre este sitio en Chrome para Android y sigue su ruta específica.',
    };
  }

  if (browser === 'chrome') {
    return {
      icon: 'chrome',
      intro: 'En Chrome de ordenador la instalación está dentro del menú de los tres puntos.',
      steps: [
        'Mira <strong>arriba a la derecha de Chrome</strong>. Busca los <strong>tres puntos verticales ⋮</strong>, junto a la zona del perfil, y púlsalos. Ese botón abre el menú de Chrome.',
        'Dentro del menú, pulsa <strong>«Enviar, guardar y compartir»</strong>. En algunas versiones de Chrome puede aparecer como <strong>«Transmitir, guardar y compartir»</strong>.',
        'Pulsa <strong>«Instalar página como aplicación…»</strong>.',
        'Confirma la instalación. La aplicación se abrirá en su propia ventana.',
      ],
      note: 'Si Chrome muestra un icono de instalación directamente en la barra de direcciones, también puedes pulsarlo.',
    };
  }

  if (platform === 'mac' && browser === 'safari') {
    return {
      icon: 'safari',
      intro: 'Safari en macOS Sonoma 14 o posterior puede convertir este sitio en una app web.',
      steps: [
        'En la barra de menús superior del Mac, pulsa <strong>«Archivo»</strong>.',
        'Pulsa <strong>«Añadir al Dock»</strong>. También puedes usar el botón <strong>Compartir</strong> de Safari y después <strong>«Añadir al Dock»</strong>.',
        'Revisa el nombre y pulsa <strong>«Añadir»</strong>.',
      ],
      note: 'La app web quedará disponible en Aplicaciones, Dock o Spotlight.',
    };
  }

  if (browser === 'edge') {
    return {
      icon: 'edge',
      intro: 'Edge permite instalar cualquier sitio como aplicación desde su menú principal.',
      steps: [
        'Mira la <strong>esquina superior derecha</strong> de Edge y pulsa <strong>«Configuración y más …»</strong>.',
        'Pulsa <strong>«Más herramientas»</strong> → <strong>«Aplicaciones»</strong>.',
        'Pulsa <strong>«Instalar este sitio como una aplicación»</strong>.',
        'Confirma la instalación.',
      ],
      note: 'Si Edge detecta una PWA, también puede mostrar directamente la opción o icono de instalación.',
    };
  }

  if (platform === 'windows' && browser === 'firefox') {
    return {
      icon: 'firefox',
      intro: 'Firefox para Windows puede instalar sitios como aplicaciones web desde la barra de direcciones.',
      steps: [
        'Mira la <strong>barra de direcciones</strong> de Firefox.',
        'Pulsa el botón de <strong>aplicaciones web</strong> cuando aparezca.',
        'Firefox instalará el sitio y añadirá acceso desde Windows.',
      ],
      note: 'La disponibilidad depende de la versión de Firefox instalada.',
    };
  }

  if (platform === 'mac' && browser === 'firefox') {
    return {
      icon: 'firefox',
      intro: 'Firefox en Mac no ofrece el mismo flujo nativo de aplicaciones web que Safari, Chrome o Edge.',
      steps: [
        'Abre este sitio en <strong>Safari</strong>, <strong>Chrome</strong> o <strong>Edge</strong>.',
        'Usa la guía de instalación que aparecerá para ese navegador.',
        'Confirma la instalación.',
      ],
    };
  }

  return {
    icon: browserInfo(browser)[0],
    intro: `No hay una ruta oficial verificada específica para ${bLabel} en este sistema.`,
    steps: [
      'Busca en la barra de direcciones un <strong>icono de instalación</strong>.',
      'Si no aparece, abre el menú principal del navegador y busca <strong>«Instalar»</strong> o <strong>«Añadir a pantalla de inicio»</strong>.',
      'Si tampoco aparece, abre este sitio en <strong>Chrome</strong>, <strong>Edge</strong> o <strong>Safari</strong> y sigue la guía específica.',
    ],
  };
}

export function showInstallInstructions(platform = detectPlatform(), browser = detectBrowser()) {
  const [, pLabel] = platformInfo(platform);
  const [, bLabel] = browserInfo(browser);
  const guide = getInstallGuide(platform, browser);
  showModal('Instalar aplicación', `${pLabel.toUpperCase()} · ${bLabel.toUpperCase()}`, guide.icon, guide.intro, guide.steps, guide.note || '');
}

export function showIosInstallInstructions(browser = detectBrowser()) {
  showInstallInstructions('ios', browser);
}

export function showDesktopInstallInstructions(platform = detectPlatform(), browser = detectBrowser()) {
  showInstallInstructions(platform, browser);
}

export async function promptInstall() {
  if (detectPlatform() === 'ios') {
    showInstallInstructions();
    return { outcome: 'manual-ios' };
  }
  if (!deferredInstallPrompt) {
    showInstallInstructions();
    return { outcome: 'manual' };
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
    showInstallInstructions();
    return { outcome: 'dismissed' };
  }
}

function bindEvents() {
  document.getElementById('cb-pwa-install-btn')?.addEventListener('click', () => promptInstall());
  document.getElementById('cb-settings-install-btn')?.addEventListener('click', () => promptInstall());
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
    setPermanentlyDismissed(true);
    updateUi();
  });
  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', () => updateUi());
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPwaInstallManager, { once: true });
  else initPwaInstallManager();
}
