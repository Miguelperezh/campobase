export const DELEGATE_VIEW_OPTIONS = Object.freeze([
  ['delegado', 'Vista delegado del partido'],
  ['hoy', 'Inicio / Hoy'],
  ['plantilla', 'Plantilla'],
  ['cuerpo-tecnico', 'Cuerpo técnico'],
  ['asistencia', 'Asistencia'],
  ['convocatorias', 'Convocatorias'],
  ['preparacion', 'Preparación de partido'],
  ['partido', 'Partido en vivo'],
  ['calendario', 'Calendario y resultados'],
  ['sesiones', 'Sesiones de entrenamiento'],
  ['ejercicios', 'Ejercicios'],
  ['tacticas', 'Pizarra táctica'],
]);

const MODULE_VIEWS = Object.freeze({
  inicio: ['hoy'],
  equipo: ['plantilla', 'cuerpo-tecnico', 'asistencia'],
  partidos: ['convocatorias', 'preparacion', 'partido', 'calendario'],
  entrenos: ['sesiones', 'ejercicios'],
  mas: ['tacticas'],
});

let currentClient = null;
let currentContext = null;
let observer = null;
let panelInitialized = false;

function normalizedPermissions(value) {
  const allowed = new Set(DELEGATE_VIEW_OPTIONS.map(([id]) => id));
  const raw = Array.isArray(value) ? value : [];
  const clean = [...new Set(raw.map(String).filter((item) => allowed.has(item)))];
  if (!clean.includes('delegado')) clean.push('delegado');
  return clean;
}

export async function fetchTeamContext(client) {
  if (!client) return null;
  const { data, error } = await client.rpc('mi_equipo_contexto');
  if (error) throw error;
  return data || null;
}

export async function fetchDelegateAccount(client) {
  if (!client) return null;
  const { data, error } = await client.rpc('get_delegate_account');
  if (error) throw error;
  return data?.user_id ? data : null;
}

export async function inviteDelegateAccount(client, { email, fullName = '', permissions = [] } = {}) {
  if (!client) throw new Error('No se ha podido abrir la gestión del delegado.');
  const { data, error } = await client.functions.invoke('invite-delegate', {
    body: {
      email: String(email || '').trim(),
      fullName: String(fullName || '').trim(),
      permissions: normalizedPermissions(permissions),
    },
  });
  if (error) throw new Error(error.message || 'No se pudo invitar al delegado.');
  if (!data?.success) throw new Error(data?.message || 'No se pudo invitar al delegado.');
  return data.delegate;
}

export async function saveDelegatePermissions(client, permissions = []) {
  const clean = normalizedPermissions(permissions);
  const { data, error } = await client.rpc('set_delegate_permissions', { p_permissions: clean });
  if (error) throw error;
  if (!data?.success) throw new Error(data?.message || 'No se pudieron guardar los permisos.');
  return normalizedPermissions(data.view_permissions);
}

export function isDelegateViewAllowed(viewId) {
  const active = window.__campobaseAllowedViews;
  if (!Array.isArray(active)) return true;
  return active.includes(viewId);
}

function applyNavigationVisibility() {
  const allowed = Array.isArray(window.__campobaseAllowedViews)
    ? new Set(window.__campobaseAllowedViews)
    : null;
  if (!allowed) return;

  document.querySelectorAll('.bottom-nav [data-view]').forEach((button) => {
    button.hidden = !allowed.has(button.dataset.view);
  });
  document.querySelectorAll('[data-target-view]').forEach((button) => {
    button.hidden = !allowed.has(button.dataset.targetView);
  });
  document.querySelectorAll('#cb-bottom-nav .cb-nav-tab[data-module]').forEach((button) => {
    const views = MODULE_VIEWS[button.dataset.module] || [];
    button.hidden = !views.some((view) => allowed.has(view));
  });

  const settingsNav = document.getElementById('settings-nav');
  if (settingsNav) settingsNav.hidden = true;
}

function installDelegateNavigationGuard() {
  if (document.documentElement.dataset.delegateGuardInstalled === '1') return;
  document.documentElement.dataset.delegateGuardInstalled = '1';

  document.addEventListener('click', (event) => {
    if (!Array.isArray(window.__campobaseAllowedViews)) return;
    const target = event.target?.closest?.('[data-view], [data-target-view]');
    const view = target?.dataset?.view || target?.dataset?.targetView;
    if (!view || isDelegateViewAllowed(view)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
  }, true);

  observer = new MutationObserver(() => applyNavigationVisibility());
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

export function applyTeamAccessContext(context) {
  currentContext = context || null;
  const role = context?.membership_role || '';
  if (role !== 'delegate') {
    window.__campobaseAllowedViews = null;
    document.documentElement.dataset.saasTeamRole = role || '';
    document.body?.classList.remove('saas-delegate-mode');
    return;
  }

  const permissions = normalizedPermissions(context?.view_permissions);
  window.__campobaseAllowedViews = permissions;
  document.documentElement.dataset.saasTeamRole = 'delegate';
  document.body?.classList.add('saas-delegate-mode');
  document.body?.classList.remove('delegate-mode');
  installDelegateNavigationGuard();
  applyNavigationVisibility();

  const active = document.querySelector('.view.active')?.id;
  if (active && !permissions.includes(active)) {
    const fallback = permissions.includes('delegado') ? 'delegado' : permissions[0];
    window.__campobase?.showView?.(fallback);
  }
}

function permissionMarkup(selected = []) {
  const active = new Set(normalizedPermissions(selected));
  return DELEGATE_VIEW_OPTIONS.map(([id, label]) => {
    const mandatory = id === 'delegado';
    return `<label class="cb-delegate-permission">
      <input type="checkbox" name="delegateViews" value="${id}" ${active.has(id) ? 'checked' : ''} ${mandatory ? 'disabled' : ''}>
      <span>${label}${mandatory ? ' · acceso base' : ''}</span>
    </label>`;
  }).join('');
}

function selectedPermissions(form) {
  const values = [...form.querySelectorAll('input[name="delegateViews"]:checked')].map((input) => input.value);
  values.push('delegado');
  return normalizedPermissions(values);
}

function ensurePanel(root = document) {
  const grid = root.querySelector('#ajustes .settings-grid');
  if (!grid || root.getElementById('cb-delegate-account-panel')) return Boolean(grid);

  const panel = root.createElement('article');
  panel.id = 'cb-delegate-account-panel';
  panel.className = 'panel cb-delegate-account-panel';
  panel.innerHTML = `
    <div class="panel-head">
      <span class="eyebrow">Mismo equipo</span>
      <h3>Cuenta de delegado</h3>
      <p class="meta">El delegado entra con su propia cuenta, comparte exclusivamente este equipo y solo ve las secciones que tú autorices.</p>
    </div>
    <div id="cb-delegate-account-content"><p class="meta">Comprobando…</p></div>
  `;
  const billing = root.getElementById('cb-account-billing-panel');
  if (billing?.parentElement === grid) billing.insertAdjacentElement('afterend', panel);
  else grid.prepend(panel);
  return true;
}

async function renderDelegatePanel(root = document) {
  const panel = root.getElementById('cb-delegate-account-panel');
  const content = root.getElementById('cb-delegate-account-content');
  if (!panel || !content || !currentClient) return;

  const context = currentContext || await fetchTeamContext(currentClient).catch(() => null);
  if (!context) {
    panel.classList.remove('hidden');
    content.innerHTML = '<p class="meta">Inicia sesión como administrador o entrenador para gestionar la cuenta de delegado.</p>';
    return;
  }
  if (context.membership_role === 'delegate') {
    panel.classList.add('hidden');
    return;
  }
  const canManage = ['admin', 'coach'].includes(context.membership_role);
  panel.classList.toggle('hidden', !canManage);
  if (!canManage) return;

  const delegate = await fetchDelegateAccount(currentClient).catch(() => null);
  if (!delegate) {
    content.innerHTML = `
      <form id="cb-delegate-invite-form">
        <div class="form-row">
          <label>Nombre del delegado
            <input name="fullName" maxlength="120" autocomplete="name" placeholder="Nombre y apellidos">
          </label>
          <label>Correo del delegado
            <input name="email" type="email" required autocomplete="email" placeholder="delegado@correo.es">
          </label>
        </div>
        <fieldset class="cb-delegate-permissions">
          <legend>Vistas permitidas</legend>
          <p class="meta">La vista de delegado del partido es la base. Puedes añadir más secciones cuando quieras.</p>
          <div class="cb-delegate-permissions-grid">${permissionMarkup(['delegado'])}</div>
        </fieldset>
        <p class="meta">Esta cuenta no puede crear equipos ni entrar en Ajustes.</p>
        <div class="button-row">
          <button type="submit" class="primary">Invitar delegado</button>
        </div>
        <p id="cb-delegate-feedback" class="meta" aria-live="polite"></p>
      </form>
    `;
    const form = root.getElementById('cb-delegate-invite-form');
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const feedback = root.getElementById('cb-delegate-feedback');
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      if (feedback) feedback.textContent = 'Enviando invitación…';
      try {
        await inviteDelegateAccount(currentClient, {
          email: form.elements.email.value,
          fullName: form.elements.fullName.value,
          permissions: selectedPermissions(form),
        });
        if (feedback) feedback.textContent = 'Invitación enviada. El delegado quedará asociado únicamente a este equipo.';
        await renderDelegatePanel(root);
      } catch (error) {
        if (feedback) feedback.textContent = error.message || 'No se pudo enviar la invitación.';
      } finally {
        if (button) button.disabled = false;
      }
    });
    return;
  }

  content.innerHTML = `
    <div class="cb-delegate-account-summary">
      <p><strong>Delegado:</strong> ${delegate.full_name || delegate.username || 'Cuenta de delegado'}</p>
      <p><strong>Correo:</strong> ${delegate.email || '—'}</p>
    </div>
    <form id="cb-delegate-permissions-form">
      <fieldset class="cb-delegate-permissions">
        <legend>Vistas permitidas</legend>
        <p class="meta">Puedes ampliar o reducir el acceso. Ajustes y creación de equipos nunca están disponibles para el delegado.</p>
        <div class="cb-delegate-permissions-grid">${permissionMarkup(delegate.view_permissions || ['delegado'])}</div>
      </fieldset>
      <div class="button-row">
        <button type="submit" class="primary">Guardar accesos</button>
      </div>
      <p id="cb-delegate-feedback" class="meta" aria-live="polite"></p>
    </form>
  `;

  const form = root.getElementById('cb-delegate-permissions-form');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const feedback = root.getElementById('cb-delegate-feedback');
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      const saved = await saveDelegatePermissions(currentClient, selectedPermissions(form));
      if (feedback) feedback.textContent = `Accesos guardados: ${saved.length} vistas.`;
    } catch (error) {
      if (feedback) feedback.textContent = error.message || 'No se pudieron guardar los accesos.';
    } finally {
      if (button) button.disabled = false;
    }
  });
}

function installStyles(root = document) {
  if (root.getElementById('cb-team-access-style')) return;
  const style = root.createElement('style');
  style.id = 'cb-team-access-style';
  style.textContent = `
    .cb-delegate-account-panel{grid-column:1/-1}
    .cb-delegate-permissions{margin:.9rem 0;padding:.85rem;border:1px solid var(--line,#e2e8f0);border-radius:14px}
    .cb-delegate-permissions-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem .9rem;margin-top:.7rem}
    .cb-delegate-permission{display:flex;align-items:center;gap:.55rem;min-width:0}
    .cb-delegate-permission input{width:18px;min-height:18px;flex:0 0 18px}
    .cb-delegate-account-summary{display:grid;gap:.25rem;margin:.6rem 0}
    .cb-delegate-account-summary p{margin:0;overflow-wrap:anywhere}
    html[data-saas-team-role="delegate"] #settings-nav{display:none!important}
    @media(max-width:680px){.cb-delegate-permissions-grid{grid-template-columns:1fr}}
  `;
  root.head.append(style);
}

export async function initTeamAccess(client, root = document) {
  if (!client || !root) return null;
  currentClient = client;
  installStyles(root);
  currentContext = await fetchTeamContext(client).catch((error) => {
    console.warn('No se pudo cargar el equipo de la cuenta:', error);
    return null;
  });
  applyTeamAccessContext(currentContext);

  if (currentContext?.membership_role !== 'delegate') {
    ensurePanel(root);
    await renderDelegatePanel(root);
    if (!panelInitialized) {
      panelInitialized = true;
      document.querySelectorAll('[data-view="ajustes"]').forEach((button) => {
        button.addEventListener('click', () => setTimeout(() => renderDelegatePanel(root), 0));
      });
    }
  }

  return currentContext;
}

export function getCurrentTeamContext() {
  return currentContext;
}
