import { getOne, put } from './db.js';

// Personalización segura SOLO para distintivos concretos.
// Este módulo también limpia cualquier rastro de la versión global defectuosa
// que llegó a aplicar colores/fuentes a navegación, botones y campos de toda la app.

const STORAGE_KEY = 'campobase.detailBadgeStyle';
const TARGET_SELECTOR = '.format-badge, .plantilla-staff-role-badge, .staff-badge';
const OWNED_STYLE_PROPS = ['background', 'color', '-webkit-text-fill-color', 'font-family', 'font-weight', 'border-color'];
const LEGACY_BOX_CLASS = 'cb-user-boxed-surface';
const LEGACY_STYLE_ID = 'cb-user-boxed-surface-style';
const LEGACY_INLINE_PROPS = ['background-color', 'color', '-webkit-text-fill-color', 'font-family', 'font-weight'];

let activeSettings = null;
let observer = null;

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function cleanupLegacyGlobalBoxStyles() {
  document.getElementById(LEGACY_STYLE_ID)?.remove();
  document.querySelectorAll(`.${LEGACY_BOX_CLASS}`).forEach((element) => {
    element.classList.remove(LEGACY_BOX_CLASS);
    LEGACY_INLINE_PROPS.forEach((prop) => element.style.removeProperty(prop));
  });
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

function applyToElement(element, settings) {
  if (!element) return;
  if (!settings) {
    OWNED_STYLE_PROPS.forEach((prop) => element.style.removeProperty(prop));
    return;
  }

  element.style.setProperty('background', settings.background, 'important');
  element.style.setProperty('color', settings.text, 'important');
  element.style.setProperty('-webkit-text-fill-color', settings.text, 'important');
  element.style.setProperty('font-family', fontFamily(settings.font), 'important');
  element.style.setProperty('font-weight', settings.bold ? '800' : '500', 'important');
  element.style.setProperty('border-color', 'transparent', 'important');
}

function applyToRealApp(settings) {
  cleanupLegacyGlobalBoxStyles();
  activeSettings = normalizeSettings(settings);
  document.querySelectorAll(TARGET_SELECTOR).forEach((element) => applyToElement(element, activeSettings));

  const root = document.documentElement;
  if (activeSettings) {
    root.setAttribute('data-cb-detail-badges', 'custom');
    root.style.setProperty('--cb-detail-badge-bg', activeSettings.background);
    root.style.setProperty('--cb-detail-badge-text', activeSettings.text);
    root.style.setProperty('--cb-detail-badge-font', fontFamily(activeSettings.font));
    root.style.setProperty('--cb-detail-badge-weight', activeSettings.bold ? '800' : '500');
  }
}

function startTargetObserver() {
  if (observer || !document.body) return;
  observer = new MutationObserver((mutations) => {
    if (!activeSettings) return;
    let addedRelevantContent = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        addedRelevantContent = true;
        break;
      }
    }
    if (addedRelevantContent) applyToRealApp(activeSettings);
  });
  observer.observe(document.body, { childList: true, subtree: true });
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
    console.warn('No se pudo sincronizar la configuración de distintivos:', error);
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
  cleanupLegacyGlobalBoxStyles();
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
