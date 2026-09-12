// ==========================================================================
// CONTROLADOR DE NAVEGACIÓN Y EXPERIENCIA REDISEÑADA V1 (CampoBase)
// Gestiona la barra maestra de 5 pestañas, los submenús segmentados
// por módulo y el menú flotante al pulgar (Quick Sheet).
// Totalmente desacoplado de la lógica de negocio y datos reales.
// ==========================================================================

import { renderTodayDashboard } from './today-dashboard.js?v=2456';
import { refreshStaffView, initStaffManagement } from './staff-management.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Mapeo entre las 5 pestañas maestras y sus subvistas operativas
export const MODULE_CONFIG = {
  inicio: {
    label: 'Inicio',
    icon: `<svg viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    defaultView: 'hoy',
    views: ['hoy'],
    subTabs: [],
  },
  equipo: {
    label: 'Equipo',
    icon: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    defaultView: 'plantilla',
    views: ['plantilla', 'cuerpo-tecnico', 'asistencia'],
    subTabs: [
      {
        id: 'plantilla',
        label: 'Plantilla',
        desc: 'Jugadores · Minutos y datos',
        icon: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      },
      {
        id: 'cuerpo-tecnico',
        label: 'Cuerpo Técnico',
        desc: 'Entrenadores, preparadores y delegados',
        icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg>`,
      },
      {
        id: 'asistencia',
        label: 'Asistencia',
        desc: 'Control de faltas en entrenamientos',
        icon: `<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
      },
    ],
  },
  partidos: {
    label: 'Partidos',
    icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="3"/></svg>`,
    defaultView: 'convocatorias',
    views: ['convocatorias', 'preparacion', 'partido', 'calendario'],
    subTabs: [
      {
        id: 'convocatorias',
        label: 'Convocatoria',
        desc: 'Reparto equitativo y bajas',
        icon: `<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>`,
      },
      {
        id: 'preparacion',
        label: 'Alineación',
        desc: 'Titulares, suplentes y táctica',
        icon: `<svg viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><circle cx="12" cy="12" r="3"/></svg>`,
      },
      {
        id: 'partido',
        label: 'En Vivo',
        desc: 'Cronómetro y cambios en directo',
        icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      },
      {
        id: 'calendario',
        label: 'Calendario',
        desc: 'Resultados y próximas jornadas',
        icon: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      },
    ],
  },
  entrenos: {
    label: 'Entrenos',
    icon: `<svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14h6"/><path d="M9 18h6"/><path d="M9 10h6"/></svg>`,
    defaultView: 'sesiones',
    views: ['sesiones', 'ejercicios'],
    subTabs: [
      {
        id: 'sesiones',
        label: 'Sesiones',
        desc: 'Planificación por bloques de 60-90 min',
        icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 10"/></svg>`,
      },
      {
        id: 'ejercicios',
        label: 'Ejercicios',
        desc: 'Biblioteca de fichas tácticas',
        icon: `<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      },
    ],
  },
  mas: {
    label: 'Más',
    icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="5" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="19" r="1"/><circle cx="5" cy="19" r="1"/></svg>`,
    defaultView: 'tacticas',
    views: ['tacticas', 'ajustes'],
    subTabs: [
      {
        id: 'tacticas',
        label: 'Pizarra Táctica',
        desc: 'Pizarra táctica interactiva libre',
        icon: `<svg viewBox="0 0 24 24"><path d="m3 3 18 18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
      },
      {
        id: 'ajustes',
        label: 'Ajustes y Tema',
        desc: 'Escudo, equipo, colores y PIN',
        icon: `<svg viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
      },
    ],
  },
};

export function getActiveViewId() {
  const activeView = $('.view.active');
  return activeView ? activeView.id : 'plantilla';
}

export function getActiveModule(viewId) {
  for (const [modKey, mod] of Object.entries(MODULE_CONFIG)) {
    if (mod.views.includes(viewId)) return modKey;
  }
  return 'equipo';
}

export function triggerStandardView(viewId) {
  if (window.__campobase && typeof window.__campobase.showView === 'function') {
    window.__campobase.showView(viewId);
  } else {
    const button = $(`.bottom-nav button[data-view="${viewId}"]`);
    if (button) {
      button.click();
    }
  }

  $$('.view').forEach((v) => v.classList.toggle('active', v.id === viewId));
  $$('.bottom-nav button').forEach((b) => b.classList.toggle('active', b.dataset.view === viewId));

  if (viewId === 'hoy') {
    renderTodayDashboard().catch(console.error);
  } else if (viewId === 'cuerpo-tecnico') {
    refreshStaffView().catch(console.error);
  }

  closeQuickSheet();
  updateNavState();
}

export function renderSubNav() {
  let subNav = $('#cb-sub-nav');
  if (!subNav) {
    subNav = document.createElement('nav');
    subNav.id = 'cb-sub-nav';
    subNav.setAttribute('aria-label', 'Subnavegación de sección');
    const header = $('.topbar');
    if (header && header.nextElementSibling) {
      header.parentNode.insertBefore(subNav, header.nextElementSibling);
    } else {
      document.body.prepend(subNav);
    }
  }

  const activeViewId = getActiveViewId();
  const activeModuleKey = getActiveModule(activeViewId);
  const activeModule = MODULE_CONFIG[activeModuleKey];

  if (!activeModule || !activeModule.subTabs || activeModule.subTabs.length <= 1) {
    subNav.hidden = true;
    subNav.classList.add('cb-hidden');
    subNav.style.setProperty('display', 'none', 'important');
    return;
  }

  subNav.hidden = false;
  subNav.classList.remove('cb-hidden');
  subNav.style.setProperty('display', 'flex', 'important');
  const count = activeModule.subTabs.length;

  subNav.innerHTML = `
    <div class="cb-sub-segmented" data-count="${count}" role="tablist">
      ${activeModule.subTabs.map((tab) => {
        const isActive = tab.id === activeViewId;
        return `
          <button type="button" role="tab" class="cb-sub-pill ${isActive ? 'active' : ''}" data-target-view="${tab.id}" aria-selected="${isActive}">
            <span class="cb-pill-icon">${tab.icon}</span>
            <span class="cb-pill-label">${tab.label}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;

  subNav.querySelectorAll('.cb-sub-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      triggerStandardView(btn.dataset.targetView);
    });
  });
}

export function closeQuickSheet() {
  const sheet = $('#cb-quick-sheet');
  if (sheet) sheet.classList.remove('open');
}

export function toggleQuickSheet(moduleKey, triggerBtn) {
  let sheet = $('#cb-quick-sheet');
  if (sheet && sheet.dataset.module === moduleKey && sheet.classList.contains('open')) {
    closeQuickSheet();
    return;
  }

  if (!sheet) {
    sheet = document.createElement('div');
    sheet.id = 'cb-quick-sheet';
    document.body.append(sheet);

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#cb-quick-sheet') && !e.target.closest('.cb-nav-tab')) {
        closeQuickSheet();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeQuickSheet();
    });
  }

  const mod = MODULE_CONFIG[moduleKey];
  if (!mod || !mod.subTabs || mod.subTabs.length <= 1) return;

  const activeViewId = getActiveViewId();
  sheet.dataset.module = moduleKey;
  sheet.innerHTML = `
    <div class="cb-quick-sheet-header">
      <div class="cb-quick-sheet-title">
        ${mod.icon}
        <strong>${mod.label}</strong>
      </div>
      <button type="button" class="cb-quick-sheet-close" aria-label="Cerrar">✕</button>
    </div>
    <div class="cb-quick-sheet-list" role="menu">
      ${mod.subTabs.map((tab) => {
        const isActive = tab.id === activeViewId;
        return `
          <button type="button" class="cb-quick-sheet-item ${isActive ? 'active' : ''}" data-target-view="${tab.id}" role="menuitem">
            <span class="cb-sheet-item-icon">${tab.icon}</span>
            <div class="cb-sheet-item-body">
              <span class="cb-sheet-item-name">${tab.label}</span>
              <span class="cb-sheet-item-desc">${tab.desc || ''}</span>
            </div>
            ${isActive ? '<span class="cb-sheet-item-check">✓</span>' : ''}
          </button>
        `;
      }).join('')}
    </div>
  `;

  sheet.querySelector('.cb-quick-sheet-close').addEventListener('click', closeQuickSheet);
  sheet.querySelectorAll('.cb-quick-sheet-item').forEach((item) => {
    item.addEventListener('click', () => {
      triggerStandardView(item.dataset.targetView);
    });
  });

  if (triggerBtn) {
    const rect = triggerBtn.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const sheetWidth = 280;
    const leftPos = Math.max(12, Math.min(window.innerWidth - sheetWidth - 12, center - (sheetWidth / 2)));
    sheet.style.left = `${leftPos}px`;
  }
  sheet.classList.add('open');
}

export function renderBottomNav() {
  if ($('#cb-bottom-nav')) return;

  const nav = document.createElement('nav');
  nav.id = 'cb-bottom-nav';
  nav.setAttribute('aria-label', 'Navegación principal');

  nav.innerHTML = Object.entries(MODULE_CONFIG).map(([key, mod]) => {
    const hasSubTabs = mod.subTabs && mod.subTabs.length > 1;
    return `
      <button type="button" class="cb-nav-tab" data-module="${key}" title="${mod.label}">
        ${mod.icon}
        <span class="cb-nav-label-wrap">
          <span>${mod.label}</span>
          ${hasSubTabs ? '<span class="cb-nav-has-sub">▾</span>' : ''}
        </span>
      </button>
    `;
  }).join('');

  document.body.append(nav);

  nav.querySelectorAll('.cb-nav-tab').forEach((button) => {
    button.addEventListener('click', () => {
      const moduleKey = button.dataset.module;
      const mod = MODULE_CONFIG[moduleKey];
      if (!mod) return;

      const currentView = getActiveViewId();
      const currentModule = getActiveModule(currentView);

      if (currentModule === moduleKey && mod.subTabs && mod.subTabs.length > 1) {
        toggleQuickSheet(moduleKey, button);
      } else {
        closeQuickSheet();
        const targetView = mod.views.includes(currentView) ? currentView : mod.defaultView;
        triggerStandardView(targetView);
      }
    });
  });
}

export function updateNavState() {
  const activeViewId = getActiveViewId();
  const activeModuleKey = getActiveModule(activeViewId);

  $$('#cb-bottom-nav .cb-nav-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.module === activeModuleKey);
  });

  renderSubNav();
}

export function initRedesign() {
  document.body.classList.add('cb-redesign-active');
  renderBottomNav();
  renderSubNav();
  initStaffManagement();

  // Escuchar mutaciones de vista para sincronizar automáticamente
  const main = $('#app');
  if (main) {
    const observer = new MutationObserver(() => {
      updateNavState();
    });
    observer.observe(main, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  updateNavState();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRedesign);
  } else {
    initRedesign();
  }
}
