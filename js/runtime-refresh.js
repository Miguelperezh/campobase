import { syncFromCloud } from './db.js';

const BUTTON_ID = 'manual-refresh';

function buttonMarkup() {
  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.type = 'button';
  button.className = 'secondary compact';
  button.textContent = 'Actualizar';
  button.title = 'Sincronizar datos y recargar CampoBase';
  button.setAttribute('aria-label', 'Actualizar y sincronizar datos');
  return button;
}

async function refreshNow(button) {
  if (button) {
    button.disabled = true;
    button.textContent = 'Actualizando…';
  }
  try {
    await syncFromCloud().catch(() => null);
  } finally {
    window.location.reload();
  }
}

export function installRuntimeRefresh() {
  if (document.getElementById(BUTTON_ID)) return;
  const status = document.querySelector('.topbar .status');
  if (!status) return;
  const button = buttonMarkup();
  const logout = document.getElementById('logout');
  status.insertBefore(button, logout ?? null);
  button.addEventListener('click', () => refreshNow(button));
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installRuntimeRefresh, { once: true });
  else installRuntimeRefresh();
}
