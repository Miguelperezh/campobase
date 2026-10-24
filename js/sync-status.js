// A network connection and an empty local queue do not prove that this account
// has reached the server. All consumers use the same conservative result.
export function syncStatus({
  demo = false, online = false, bound = false, connected = false,
  checking = false, pending = 0, blocked = 0, error = '',
  authRequired = false, restricted = false,
} = {}) {
  const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
  const total = count(pending);
  const denied = Math.min(total, count(blocked));
  const retryable = total - denied;
  const local = 'Los datos ya guardados se conservan en este dispositivo.';
  const deniedDetail = denied ? ` Hay ${denied} borrador${denied === 1 ? '' : 'es'} sin permiso de envío; se conservan y no se reenviarán automáticamente.` : '';
  const message = typeof error === 'string' ? error.trim() : String(error?.message || '').trim();
  const result = (key, label, detail, canRetry = false, confirmed = false) => ({key, label, detail, canRetry, confirmed});
  if (demo) return result('demo', 'Demo temporal', 'Los datos de demostración están separados de tu equipo y no se sincronizan.');
  if (!online) return result('offline', 'Sin conexión', `${local} Se intentará sincronizar cuando vuelva la conexión.${deniedDetail}`);
  if (!bound) return result('unbound', 'Acceso a la nube pendiente', `Entra con tu cuenta para sincronizar. ${local}${deniedDetail}`);
  if (checking) return result('checking', 'Comprobando sincronización…', 'Revisando la conexión y los cambios de esta cuenta.');
  if (authRequired) return result('auth-required', 'Reconecta tu cuenta', `${local} Vuelve a identificarte para comprobar los cambios.${deniedDetail}`);
  if (restricted) return result('restricted', 'Servicio temporalmente no disponible', `${local} Puedes volver a comprobarlo más tarde.${deniedDetail}`, retryable > 0 || total === 0);
  if (denied && !retryable) return result('blocked', `${denied} borrador${denied === 1 ? '' : 'es'} sin permiso de envío`, 'Se conservan en este dispositivo. No se enviarán automáticamente aunque se concedan permisos después.');
  if (message) return result('error', 'No se pudo confirmar la sincronización', `${message} ${local}${deniedDetail}`, retryable > 0 || total === 0);
  if (retryable) {
    const label = `${retryable} cambio${retryable === 1 ? '' : 's'} pendiente${retryable === 1 ? '' : 's'}${denied ? ` · ${denied} borrador${denied === 1 ? '' : 'es'} sin permiso` : ''}`;
    const detail = denied
      ? `${local} Solo se intentará enviar ${retryable === 1 ? 'el cambio permitido' : `los ${retryable} cambios permitidos`}; ${denied === 1 ? 'el borrador sin permiso se conserva' : `los ${denied} borradores sin permiso se conservan`} sin reenviarlo${denied === 1 ? '' : 's'}.`
      : `${local} Puedes volver a comprobar la sincronización.`;
    return result('pending', label, detail, true);
  }
  if (!connected || !Number.isFinite(Number(pending)) || !Number.isFinite(Number(blocked))) return result('unconfirmed', 'Sincronización pendiente de comprobar', `${local} Aún no se ha confirmado la conexión y el estado de los cambios de esta cuenta.`, true);
  return result('synced', 'Sincronizado', 'Los cambios de esta cuenta están confirmados en la nube.', true, true);
}

// Explicit allowlist: never copy raw errors, account identifiers or sports data.
export function syncSupportReport({version, role, online, pending, blocked, statusKey} = {}) {
  const build = /^\d{8}-[a-z0-9-]{1,65}$/.test(String(version || '')) ? version : 'No identificada';
  const count = value => Number.isFinite(Number(value)) ? Math.max(0,Math.floor(Number(value))) : 0;
  const states = {demo:'Demo',offline:'Sin conexión',unbound:'Acceso pendiente',checking:'Comprobando',
    'auth-required':'Reconexión necesaria',restricted:'Servicio no disponible',error:'Sin confirmar',
    blocked:'Borradores sin permiso',pending:'Cambios pendientes',unconfirmed:'Sin comprobar',synced:'Sincronizado'};
  const roles = {owner:'Entrenador',delegate:'Delegado',demo:'Demo'};
  return ['CampoBase · Informe de sincronización',`Versión: ${build}`,
    `Acceso: ${Object.hasOwn(roles,role) ? roles[role] : 'Sin acceso'}`,
    `Red disponible: ${online ? 'Sí' : 'No'}`,`Estado: ${Object.hasOwn(states,statusKey) ? states[statusKey] : 'Sin comprobar'}`,
    `Cambios pendientes: ${count(pending)}`,`Borradores sin permiso: ${Math.min(count(pending),count(blocked))}`].join('\n');
}
