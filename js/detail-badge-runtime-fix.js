import { getOne, put } from './db.js';

// Personalización de los textos que viven dentro de elementos con fondo.
// El bloque visual de Ajustes se conserva; sus cuatro controles (fondo, texto,
// fuente y negrita) gobiernan de forma común botones, campos, selectores,
// distintivos y otros controles con fondo. El tema general sigue controlando
// los textos que quedan fuera de esas cajas.

const STORAGE_KEY = 'campobase.detailBadgeStyle';
const BOX_CLASS = 'cb-user-boxed-surface';
const STYLE_ID = 'cb-user-boxed-surface-style';
const EXPLICIT_SURFACE_SELECTOR = [
  '.format-badge',
  '.plantilla-staff-role-badge',
  '.staff-badge',
  '.staff-count-badge',
  '.badge',
  '.pill',
  '.player-subhead-pill',
  '.stat',
  '.mini-stats > span',
  '.cb-global-close-button',
  '.cb-sub-pill.active',
  '.cb-quick-sheet-item.active',
  '.cb-nav-tab.active',
  'input:not([type="checkbox"]):not([type="radio"]):not([type="color"]):not([type="file"]):not([type="range"]):not([type="hidden"])',
  'select',
  'textarea',
].join(',');
const EXCLUDED_BUTTON_SELECTOR = [
  '.icon-button',
  '.cb-quick-sheet-close',
  '.font-color-swatch-btn',
  '.color-swatch-btn',
].join(',');
const OWNED_STYLE_PROPS = ['background-color', 'color', '-webkit-text-fill-color', 'font-family', 'font-weight'];

let activeSettings = null;
let observer = null;
let applyQueued = false;

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function normalizeSettings(value) {
  if (!value || typeof value !== 'object') return null;
  return {
    background: /^#[0-9a-f]{6}$/i.test(value.background || '') ? value.background : '#c8102e',
    text: /^#[0-9a-f]{6}$/i.test(value.text || '') ? value.text : '#000000',
    font: value.font === 'inter' ? 'inter' : 'barlow',
    bold: value.bold !== false,
    updatedAt: Number(value.updatedAt) || 0,
  };
}

function readLocalSettings() {
  try {
    return normalizeSettings(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'));
  } catch {
    return null;
  }
}

function writeLocalSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

function fontFamily(font) {
  return font === 'inter'
    ? 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    : '"Barlow Condensed", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
}

function installStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    html[data-cb-detail-badges="custom"] .${BOX_CLASS},
    html[data-cb-detail-badges="custom"] .${BOX_CLASS} :where(span,strong,small,b,em,i,label,p,h1,h2,h3,h4,h5,h6,option) {
      color: var(--cb-detail-badge-text) !important;
      -webkit-text-fill-color: var(--cb-detail-badge-text) !important;
      font-family: var(--cb-detail-badge-font) !important;
      font-weight: var(--cb-detail-badge-weight) !important;
    }
    html[data-cb-detail-badges="custom"] input.${BOX_CLASS}::placeholder,
    html[data-cb-detail-badges="custom"] textarea.${BOX_CLASS}::placeholder {
      color: var(--cb-detail-badge-text) !important;
      -webkit-text-fill-color: var(--cb-detail-badge-text) !important;
      opacity: .68 !important;
    }
  `;
  document.head.appendChild(style);
}

function isTransparentColor(value = '') {
  const color = String(value).replace(/\s+/g, '').toLowerCase();
  return !color || color === 'transparent' || color === 'rgba(0,0,0,0)' || color === 'hsla(0,0%,0%,0)';
}

function buttonHasVisibleBox(button) {
  if (!button || button.matches(EXCLUDED_BUTTON_SELECTOR)) return false;
  if (!(button.textContent || '').trim()) return false;
  const styles = window.getComputedStyle(button);
  return !isTransparentColor(styles.backgroundColor) || (styles.backgroundImage && styles.backgroundImage !== 'none');
}

function addCandidate(set, element) {
  if (!element || !(element instanceof Element)) return;
  if (element.matches(EXPLICIT_SURFACE_SELECTOR)) set.add(element);
  if (element.matches('button') && buttonHasVisibleBox(element)) set.add(element);
}

function collectBoxedSurfaces(root = document) {
  const surfaces = new Set();
  if (root instanceof Element) addCandidate(surfaces, root);
  const scope = root?.querySelectorAll ? root : document;
  scope.querySelectorAll(EXPLICIT_SURFACE_SELECTOR).forEach((element) => surfaces.add(element));
  scope.querySelectorAll('button').forEach((button) => {
    if (buttonHasVisibleBox(button)) surfaces.add(button);
  });
  return surfaces;
}

function applyToElement(element, settings) {
  if (!element) return;
  if (!settings) {
    element.classList.remove(BOX_CLASS);
    OWNED_STYLE_PROPS.forEach((prop) => element.style.removeProperty(prop));
    return;
  }

  element.classList.add(BOX_CLASS);
  element.style.setProperty('background-color', settings.background, 'important');
  element.style.setProperty('color', settings.text, 'important');
  element.style.setProperty('-webkit-text-fill-color', settings.text, 'important');
  element.style.setProperty('font-family', fontFamily(settings.font), 'important');
  element.style.setProperty('font-weight', settings.bold ? '800' : '500', 'important');
}

function applyToRealApp(settings, root = document) {
  installStyles();
  activeSettings = normalizeSettings(settings);

  const html = document.documentElement;
  if (!activeSettings) {
    document.querySelectorAll(`.${BOX_CLASS}`).forEach((element) => applyToElement(element, null));
    html.removeAttribute('data-cb-detail-badges');
    html.style.removeProperty('--cb-detail-badge-bg');
    html.style.removeProperty('--cb-detail-badge-text');
    html.style.removeProperty('--cb-detail-badge-font');
    html.style.removeProperty('--cb-detail-badge-weight');
    return;
  }

  html.setAttribute('data-cb-detail-badges', 'custom');
  html.style.setProperty('--cb-detail-badge-bg', activeSettings.background);
  html.style.setProperty('--cb-detail-badge-text', activeSettings.text);
  html.style.setProperty('--cb-detail-badge-font', fontFamily(activeSettings.font));
  html.style.setProperty('--cb-detail-badge-weight', activeSettings.bold ? '800' : '500');

  collectBoxedSurfaces(root).forEach((element) => applyToElement(element, activeSettings));
}

function queueApply(root = document) {
  if (!activeSettings || applyQueued) return;
  applyQueued = true;
  window.requestAnimationFrame(() => {
    applyQueued = false;
    applyToRealApp(activeSettings, root);
  });
}

function startTargetObserver() {
  if (observer || !document.body) return;
  observer = new MutationObserver((mutations) => {
    if (!activeSettings) return;
    const roots = [];
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) roots.push(node);
      });
      if (mutation.type === 'attributes' && mutation.target instanceof Element) roots.push(mutation.target);
    }
    if (!roots.length) return;
    queueApply(document);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'open', 'hidden'],
  });
}

function settingsFromForm(form) {
  if (!form) return null;
  return normalizeSettings({
    background: form.elements.background?.value,
    text: form.elements.text?.value,
    font: form.elements.font?.value,
    bold: Boolean(form.elements.bold?.checked),
    updatedAt: Date.now(),
  });
}

async function persistSharedSettings(settings) {
  if (!settings) return;
  try {
    const current = await getOne('settings', 'main') || { id: 'main' };
    await put('settings', {
      ...current,
      id: 'main',
      detailBadgeStyle: settings,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn('No se pudo sincronizar la configuración de textos con fondo:', error);
  }
}

async function hydrateSharedSettings() {
  for (let attempt = 0; attempt < 16; attempt += 1) {
    try {
      const current = await getOne('settings', 'main');
      const shared = normalizeSettings(current?.detailBadgeStyle);
      if (shared) {
        const local = readLocalSettings();
        const selected = !local || shared.updatedAt >= local.updatedAt ? shared : local;
        writeLocalSettings(selected);
        applyToRealApp(selected);
        return;
      }
      if (current) return;
    } catch {}
    await delay(250);
  }
}

function bindExistingSettingsForm() {
  const applyFromFormLive = (event) => {
    const form = event.target?.closest?.('#detail-badge-settings-form');
    if (!form) return;
    const settings = settingsFromForm(form);
    if (!settings) return;
    applyToRealApp(settings);
  };

  document.addEventListener('input', applyFromFormLive, true);
  document.addEventListener('change', applyFromFormLive, true);

  document.addEventListener('submit', (event) => {
    const form = event.target?.closest?.('#detail-badge-settings-form');
    if (!form) return;

    window.setTimeout(() => {
      const settings = settingsFromForm(form);
      if (!settings) return;
      writeLocalSettings(settings);
      applyToRealApp(settings);
      persistSharedSettings(settings);
    }, 0);
  }, true);
}

function install() {
  installStyles();
  const local = readLocalSettings();
  if (local) applyToRealApp(local);
  startTargetObserver();
  bindExistingSettingsForm();
  hydrateSharedSettings();

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    applyToRealApp(readLocalSettings());
  });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
