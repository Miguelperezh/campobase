import './session-reorder-ui.js?v=1';

// Integración oficial de Modo Campo con la aplicación estable.
// No reimplementa lógica de negocio: solo añade acceso/retorno y abre las
// funciones ya existentes de CampoBase cuando se llega desde Modo Campo.

const hasBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const params = new URLSearchParams(hasBrowser ? window.location.search : '');
const fromCampo = params.get('fromCampo') === '1';

function installTopbarActionLayout() {
  if (document.getElementById('cb-campo-topbar-layout')) return;
  const style = document.createElement('style');
  style.id = 'cb-campo-topbar-layout';
  style.textContent = `
    body.cb-redesign-active .plantilla-staff-info {
      overflow: visible !important;
    }
    body.cb-redesign-active .plantilla-staff-role-badge {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: fit-content !important;
      max-width: 8rem !important;
      overflow: visible !important;
      text-overflow: clip !important;
      white-space: normal !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
      line-height: 1.05 !important;
      text-align: center !important;
    }
    body.cb-redesign-active .player-performance[open] .player-performance-summary {
      background: var(--cb-slate-100, #f1f5f9) !important;
      color: var(--cb-slate-900, #0f172a) !important;
    }
    @media (max-width: 650px) {
      body.cb-redesign-active .topbar {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        align-items: stretch !important;
        gap: .45rem !important;
        padding-top: max(.65rem, env(safe-area-inset-top, 0px)) !important;
        overflow: visible !important;
      }
      body.cb-redesign-active .topbar-brand {
        width: 100% !important;
        min-width: 0 !important;
      }
      body.cb-redesign-active .topbar .status {
        width: 100% !important;
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        align-items: stretch !important;
        gap: .35rem !important;
        padding-top: .4rem !important;
        margin-top: .05rem !important;
        border-top: 1px solid var(--cb-slate-200, var(--line, #e2e8f0)) !important;
        flex-direction: initial !important;
      }
      body.cb-redesign-active .topbar .status #active-format {
        grid-column: 1 / -1 !important;
        justify-self: end !important;
        min-height: 28px !important;
        font-size: .62rem !important;
        padding: .25rem .55rem !important;
      }
      body.cb-redesign-active .topbar .status #role-label,
      body.cb-redesign-active .topbar .status #network-dot,
      body.cb-redesign-active .topbar .status #network-label {
        display: none !important;
      }
      body.cb-redesign-active .topbar .status #open-field-mode,
      body.cb-redesign-active .topbar .status #return-to-field-mode,
      body.cb-redesign-active .topbar .status #manual-refresh,
      body.cb-redesign-active .topbar .status #logout {
        width: 100% !important;
        min-width: 0 !important;
        min-height: 40px !important;
        margin: 0 !important;
        padding: .45rem .35rem !important;
        font-size: .68rem !important;
        white-space: normal !important;
        line-height: 1.05 !important;
        text-align: center !important;
      }
      body.cb-redesign-active .topbar .status #open-field-mode,
      body.cb-redesign-active .topbar .status #return-to-field-mode { grid-column: 1; }
      body.cb-redesign-active .topbar .status #manual-refresh { grid-column: 2; }
      body.cb-redesign-active .topbar .status #logout { grid-column: 3; }
    }
  `;
  document.head.appendChild(style);
}

function addTopbarButton({ id, text, onClick, primary = false }) {
  if (document.getElementById(id)) return;
  const status = document.querySelector('.topbar .status');
  const logout = document.getElementById('logout');
  if (!status) return;
  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.className = `${primary ? 'primary' : 'secondary'} compact`;
  button.textContent = text;
  button.addEventListener('click', onClick);
  if (logout?.parentNode === status) status.insertBefore(button, logout);
  else status.appendChild(button);
}

function installEntryButtons() {
  if (fromCampo) {
    addTopbarButton({
      id: 'return-to-field-mode',
      text: '← Volver a Modo Campo',
      primary: true,
      onClick: () => { window.location.href = './modo-campo-directo.html'; },
    });
    return;
  }
  addTopbarButton({
    id: 'open-field-mode',
    text: 'Modo Campo',
    onClick: () => { window.location.href = './modo-campo-directo.html'; },
  });
}

function waitForSelector(selector, timeoutMs = 10000) {
  return new Promise((resolve) => {
    const immediate = document.querySelector(selector);
    if (immediate) return resolve(immediate);
    const started = Date.now();
    const timer = window.setInterval(() => {
      const element = document.querySelector(selector);
      if (element || Date.now() - started >= timeoutMs) {
        clearInterval(timer);
        resolve(element || null);
      }
    }, 100);
  });
}

function clearActionFromUrl() {
  const current = new URL(window.location.href);
  current.searchParams.delete('campoAction');
  current.searchParams.delete('source');
  current.searchParams.delete('id');
  window.history.replaceState({}, '', `${current.pathname}${current.search}${current.hash}`);
}

async function openRealAction() {
  const action = params.get('campoAction');
  if (!action) return;

  const app = window.__campobase;
  if (!app?.showView) {
    window.setTimeout(openRealAction, 120);
    return;
  }

  const id = params.get('id') || '';

  if (action === 'live') {
    app.showView('partido');
    clearActionFromUrl();
    return;
  }
  if (action === 'delegate') {
    app.showView('delegado');
    clearActionFromUrl();
    return;
  }
  if (action === 'whatsapp-session' && id) {
    app.showView('sesiones');
    const button = await waitForSelector(`.open-whatsapp-session[data-id="${CSS.escape(id)}"]`);
    button?.click();
    clearActionFromUrl();
    return;
  }
  if (action === 'whatsapp-match' && id) {
    app.showView('calendario');
    const button = await waitForSelector(`.open-whatsapp-match[data-id="${CSS.escape(id)}"]`);
    button?.click();
    clearActionFromUrl();
    return;
  }
  if (action === 'attendance' && id) {
    const source = params.get('source') === 'match' ? 'match' : 'session';
    app.showView('asistencia');
    const button = await waitForSelector(`[data-attendance-source="${source}"][data-source-id="${CSS.escape(id)}"]`);
    button?.click();
    clearActionFromUrl();
  }
}

function install() {
  installTopbarActionLayout();
  installEntryButtons();
  openRealAction().catch((error) => console.warn('No se pudo abrir la función solicitada desde Modo Campo:', error));
}

if (hasBrowser) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
}
