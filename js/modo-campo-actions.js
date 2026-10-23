(async () => {
  'use strict';

  const [auth, {createCampoBaseCloudStore}, {buildMutation}] = await Promise.all([
    import('./auth-manager.js'), import('./supabase-client.js'), import('./sync-core.js'),
  ]);
  const TABLE_STORES = Object.freeze({partidos:'matches',configuracion:'settings',asistencias:'trainings'});
  let adapter;
  const attendanceContexts = new WeakMap();
  let attendanceOpening = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const dateOnly = (value = '') => String(value).slice(0, 10);

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function activeRole() {
    return globalThis.__campobase?.state?.role || sessionStorage.getItem('campobase.sessionRole') || '';
  }

  function currentIdentity() {
    return {userId:auth.getBoundSaasUserId(),pinRevision:auth.getPinAccessRevision(),role:activeRole()};
  }

  async function actionContext({ownerOnly=false,expectedIdentity} = {}) {
    const context={...(expectedIdentity || currentIdentity())};
    context.database=context.userId ? auth.userDatabaseName(context.userId) : 'campobase';
    const assertContext=()=>{
      if(!context.userId || !['owner','delegate'].includes(context.role) || auth.isPinAccessLocked()
        || auth.getBoundSaasUserId()!==context.userId || auth.getPinAccessRevision()!==context.pinRevision || activeRole()!==context.role) {
        const error=new Error('La cuenta o el acceso han cambiado. Vuelve a entrar antes de guardar.');
        error.code='CAMPOBASE_CONTEXT_CHANGED';throw error;
      }
      if(ownerOnly && context.role!=='owner')throw new Error('Solo el titular puede marcar este evento como realizado.');
    };
    assertContext();
    adapter ||= createCampoBaseCloudStore({initializeUi:false});
    const principal=await adapter.prepare(undefined,{expectedContext:context});
    assertContext();
    if(principal.userId!==context.userId || (ownerOnly && principal.delegate))throw new Error('Esta cuenta no tiene permiso para completar el evento.');
    const options={expectedContext:{...context,ownerUserId:principal.ownerUserId,teamId:principal.teamId}};
    return {assertContext,options,snapshots:new Map()};
  }

  async function readActivePayloads(table, access) {
    const store=TABLE_STORES[table];
    if(!store)throw new Error('El registro no pertenece a una sección de Modo Campo.');
    access.assertContext();
    if(!access.snapshots.has(store))access.snapshots.set(store,adapter.getSnapshot(store,access.options));
    const snapshot=await access.snapshots.get(store);
    access.assertContext();
    if(snapshot.restricted)throw new Error('No tienes permiso para abrir estos datos.');
    return snapshot.records;
  }

  async function readPayload(table, id, access) {
    return (await readActivePayloads(table,access)).find(record=>String(record.id)===String(id)) || null;
  }

  async function upsertPayload(table, record, access) {
    access.assertContext();
    const saved=await adapter.upsert(buildMutation(TABLE_STORES[table],'upsert',record),access.options);
    access.assertContext();
    if(saved?.applied===false)throw new Error('El registro ha cambiado en otro dispositivo. Conserva tu borrador y vuelve a abrirlo antes de guardar.');
  }

  function reloadAfterSave(access) {
    window.setTimeout(()=>{try{access.assertContext();window.location.reload();}catch{/* A later account owns its current screen. */}},450);
  }

  function attendanceEntryFromRow(row) {
    const status = $('[data-att-status]', row)?.value || 'present';
    const hour = $('[data-att-hour]', row)?.value || '';
    const minute = $('[data-att-minute]', row)?.value || '';
    return {
      playerId: row.dataset.playerId,
      status,
      arrivalTime: status === 'late' && hour && minute ? `${hour}:${minute}` : '',
      note: String($('[data-att-note]', row)?.value || '').trim(),
    };
  }

  async function saveRealAttendance(form) {
    const kind = form.dataset.attKind === 'match' ? 'match' : 'session';
    const sourceId = form.dataset.attId;
    if(!sourceId)throw new Error('Vuelve a abrir el evento antes de guardar la asistencia.');
    const attendance=$$('.attendance-row-full',form).map(attendanceEntryFromRow);
    const notes=String($('[data-att-record-notes]',form)?.value || '').trim();
    const opening=attendanceContexts.get(form) || attendanceOpening;
    if(!opening || opening.kind!==kind || String(opening.id)!==String(sourceId))throw new Error('Vuelve a abrir la asistencia antes de guardar.');
    const access=await actionContext({expectedIdentity:opening.identity});
    const table = kind === 'match' ? 'partidos' : 'configuracion';
    const event = await readPayload(table, sourceId,access);
    if (!event) throw new Error(kind === 'match' ? 'El partido ya no está disponible.' : 'La sesión ya no está disponible.');

    const records = await readActivePayloads('asistencias',access);
    const eventDate = dateOnly(event.date);
    const exact=records.filter(record=>kind==='match' ? record?.kind==='match'&&String(record.matchId || '')===String(sourceId) : String(record?.sessionId || '')===String(sourceId));
    if(exact.length>1)throw new Error('Hay varios registros de asistencia para este evento. Revísalos en la app antes de guardar.');
    let existing=exact[0];
    if(!existing && kind==='session' && /^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      const sameDay=(await readActivePayloads('configuracion',access)).filter(record=>record?.recordType==='trainingSession'&&dateOnly(record.date)===eventDate);
      const legacy=records.filter(record=>!record?.sessionId&&record?.kind==='training'&&dateOnly(record.date)===eventDate);
      if(sameDay.length===1&&legacy.length===1)existing=legacy[0];
    }
    access.assertContext();
    if(!form.isConnected || form.dataset.attId!==sourceId || (form.dataset.attKind==='match'?'match':'session')!==kind)throw new Error('El formulario ha cambiado. Vuelve a abrir la asistencia.');

    const now = Date.now();
    const record = {
      ...(existing || {}),
      id: existing?.id || crypto.randomUUID(),
      kind: kind === 'match' ? 'match' : 'training',
      matchId: kind === 'match' ? sourceId : null,
      sessionId: kind === 'session' ? sourceId : null,
      date: eventDate,
      notes,
      attendance,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    await upsertPayload('asistencias', record,access);
    showToast('Asistencia guardada y sincronizada.');
    reloadAfterSave(access);
  }

  async function markAsCompleted(kind, id, button) {
    const isMatch = kind === 'match';
    const accepted = window.confirm(isMatch
      ? '¿Marcar este partido como realizado? Pasará a «Partidos jugados». La asistencia o el marcador por sí solos no lo archivan.'
      : '¿Marcar esta sesión como realizada? Pasará a «Sesiones realizadas». La asistencia o el paso de la hora por sí solos no la archivan.');
    if (!accepted) return;
    button.disabled = true;
    try {
      const access=await actionContext({ownerOnly:true});
      const table = isMatch ? 'partidos' : 'configuracion';
      const current = await readPayload(table, id,access);
      if (!current) throw new Error(isMatch ? 'El partido ya no está disponible.' : 'La sesión ya no está disponible.');
      const now = Date.now();
      await upsertPayload(table, { ...current, status:isMatch ? 'finished' : 'closed', closedAt:now, updatedAt:now },access);
      showToast(isMatch ? 'Partido marcado como realizado.' : 'Sesión marcada como realizada.');
      reloadAfterSave(access);
    } catch (error) {
      button.disabled = false;
      showToast(error?.message || 'No se pudo guardar el cambio.');
    }
  }

  function normalAppUrl({ view, action, id = '' }) {
    const url = new URL('./index.html', window.location.href);
    url.searchParams.set('view', view);
    url.searchParams.set('fromCampo', '1');
    if (action) url.searchParams.set('campoAction', action);
    if (id) url.searchParams.set('id', id);
    return `${url.pathname}${url.search}`;
  }

  function appendLink(actions, className, text, href) {
    if (!actions || actions.querySelector(`.${className}`)) return;
    const link = document.createElement('a');
    link.className = `btn ghost ${className}`;
    link.textContent = text;
    link.href = href;
    actions.appendChild(link);
  }

  function appendCompletedButton(actions, kind, id) {
    if (!actions || actions.querySelector(`[data-campo-complete="${kind}"]`)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn secondary campo-complete';
    button.dataset.campoComplete = kind;
    button.dataset.id = id;
    button.textContent = '✓ Realizado';
    actions.appendChild(button);
  }

  function enhanceCards() {
    for (const card of $$('article.card[data-session-id]')) {
      if (card.closest('.fold') || card.querySelector('.status.done')) continue;
      const actions = $('.actions', card);
      const id = card.dataset.sessionId;
      appendLink(actions, 'campo-whatsapp-session', '📱 WhatsApp', normalAppUrl({ view:'sesiones', action:'whatsapp-session', id }));
      appendCompletedButton(actions, 'session', id);
    }
    for (const card of $$('article.card[data-match-id]')) {
      if (card.closest('.fold') || card.querySelector('.status.done')) continue;
      const actions = $('.actions', card);
      const id = card.dataset.matchId;
      appendLink(actions, 'campo-whatsapp-match', '📱 WhatsApp', normalAppUrl({ view:'calendario', action:'whatsapp-match', id }));
      appendCompletedButton(actions, 'match', id);
    }
  }

  function normalizeIntegratedCopy() {
    const form = $('#campo-attendance-form');
    if (form) {
      const kind=form.dataset.attKind==='match'?'match':'session';
      if(attendanceOpening && attendanceOpening.kind===kind && String(attendanceOpening.id)===String(form.dataset.attId) && !attendanceContexts.has(form)) {
        attendanceContexts.set(form,attendanceOpening);
      }
      const submit = $('button[type="submit"]', form);
      if (submit) submit.textContent = 'Guardar asistencia';
      $$('.note', form).forEach((note) => {
        if (/prueba|no escrib/i.test(note.textContent || '')) note.remove();
      });
    }
    $$('.note').forEach((note) => {
      if (/prueba aislada|integración final/i.test(note.textContent || '')) note.remove();
    });
  }

  function enhance() {
    enhanceCards();
    normalizeIntegratedCopy();
  }

  function scheduleEnhance() {
    [0, 120, 350, 800, 1600, 3000].forEach((delay) => window.setTimeout(enhance, delay));
  }

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('#campo-attendance-form');
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const submit = $('button[type="submit"]', form);
    if (submit) submit.disabled = true;
    saveRealAttendance(form).catch((error) => {
      if (submit) submit.disabled = false;
      showToast(error?.message || 'No se pudo guardar la asistencia.');
    });
  }, true);

  document.addEventListener('click', (event) => {
    const complete = event.target.closest('[data-campo-complete][data-id]');
    if (complete) {
      event.preventDefault();
      event.stopImmediatePropagation();
      markAsCompleted(complete.dataset.campoComplete, complete.dataset.id, complete);
      return;
    }

    const attendanceButton=event.target.closest('[data-attendance-session], [data-attendance-match]');
    if (attendanceButton) {
      const kind=attendanceButton.hasAttribute('data-attendance-match')?'match':'session';
      attendanceOpening={kind,id:kind==='match'?attendanceButton.dataset.attendanceMatch:attendanceButton.dataset.attendanceSession,identity:currentIdentity()};
      window.setTimeout(normalizeIntegratedCopy, 0);
      window.setTimeout(normalizeIntegratedCopy, 120);
    }

    const nav = event.target.closest('[data-nav]');
    if (!nav) return;
    if (nav.dataset.nav === 'vivo') {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = normalAppUrl({ view:'partido', action:'live' });
    } else if (nav.dataset.nav === 'delegado') {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = normalAppUrl({ view:'delegado', action:'delegate' });
    } else {
      window.setTimeout(enhanceCards, 0);
    }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleEnhance, { once:true });
  else scheduleEnhance();
  window.addEventListener('pageshow', scheduleEnhance);
})().catch(error=>{
  const toast=document.querySelector('#toast');
  if(toast){toast.textContent=error?.message || 'No se pudo preparar el acceso de Modo Campo.';toast.classList.add('show');}
});
