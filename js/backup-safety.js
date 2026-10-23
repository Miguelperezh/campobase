import { validateBackup } from './domain.js';

export const BACKUP_DATA_STORES = Object.freeze(['players', 'callups', 'matches', 'trainings', 'settings']);
const clean = (value) => typeof value === 'string' ? value.trim() : '';
const demoDatabase = (database) => clean(database).startsWith('campobase-demo-');

export function buildExportManifest(data, { userId = '', database = '', mode = 'real', exportedAt = new Date().toISOString() } = {}) {
  return {
    app: 'CampoBase', version: 1, exportedAt, saasUserId: clean(userId), database: clean(database),
    mode: mode === 'demo' || demoDatabase(database) ? 'demo' : 'real', data,
  };
}

export function validateBackupForAccount(backup, { userId = '', database = '', role } = {}) {
  if (!['owner', 'demo'].includes(role)) throw new Error('Solo el titular puede importar una copia de seguridad.');
  validateBackup(backup);
  const sourceUserId = clean(backup.saasUserId), targetUserId = clean(userId);
  const sourceDatabase = clean(backup.database), targetDatabase = clean(database);
  const sourceDemo = backup.mode === 'demo' || backup.demo === true || demoDatabase(sourceDatabase);
  const targetDemo = demoDatabase(targetDatabase);

  if (!targetDatabase) throw new Error('No se ha podido identificar el almacenamiento de esta cuenta. Vuelve a entrar antes de importar.');
  if (sourceDemo && !targetDemo) throw new Error('Las copias de demostración solo se pueden abrir dentro de una demo. No se han cambiado tus datos.');
  if (role === 'demo' && !targetDemo) throw new Error('La cuenta ha cambiado. Vuelve a abrir la importación.');
  if (!targetDemo) {
    if (targetUserId) {
      if (!sourceUserId) throw new Error('Esta copia antigua no identifica al titular. No se puede mezclar con tu cuenta. Consérvala para una recuperación revisada.');
      if (sourceUserId !== targetUserId) throw new Error('La copia pertenece a otra cuenta. Entra en su cuenta original para recuperarla. No se han cambiado tus datos.');
      if (sourceDatabase && sourceDatabase !== targetDatabase) throw new Error('La copia procede de otro almacenamiento de equipo. No se han cambiado tus datos.');
    } else if (sourceUserId || (sourceDatabase && sourceDatabase !== targetDatabase)) {
      throw new Error('Esta copia está vinculada a una cuenta. Entra en esa cuenta antes de importarla; el archivo no inicia sesión por ti.');
    }
  }

  for (const store of BACKUP_DATA_STORES) {
    const ids = new Set();
    for (const record of backup.data[store]) {
      const id = record?.id;
      const validId = (typeof id === 'string' && id.trim()) || (typeof id === 'number' && Number.isFinite(id));
      if (!record || typeof record !== 'object' || Array.isArray(record) || !validId) {
        throw new TypeError(`La copia contiene un registro no válido en ${store}. No se han cambiado tus datos.`);
      }
      // Cloud IDs and mutation queue keys are textual, even when an old
      // IndexedDB backup used numeric keys. Reject a collision before writing.
      const key = String(id);
      if (ids.has(key)) throw new TypeError(`La copia contiene registros repetidos en ${store}. No se han cambiado tus datos.`);
      ids.add(key);
    }
  }
  return backup.data;
}

export function backupSummary(data) {
  const settings = data.settings || [];
  return {
    teamName: clean(settings.find((record) => record.id === 'main')?.teamName) || 'Equipo sin nombre',
    players: data.players.length,
    matches: data.matches.length,
    callups: data.callups.length,
    attendance: data.trainings.length,
    sessions: settings.filter((record) => record.recordType === 'trainingSession').length,
    ownExercises: settings.filter((record) => record.recordType === 'exercise' && (record.userCreated === true || record.source === 'personal')).length,
  };
}

// A shared address must never carry an identity, session or credentials.
export function mobileAppLink(href) {
  const url = new URL(href);
  url.search = ''; url.hash = '';
  return url.href;
}

export function cleanLegacyMobileLink(href) {
  const url = new URL(href);
  const role = url.searchParams.get('role');
  const legacy = url.hash.startsWith('#session=') || url.searchParams.get('sync') === 'owner'
    || role === 'owner' || (url.searchParams.has('team') && role !== 'delegate');
  if (!legacy) return { url: url.href, removed: false };
  for (const key of ['sync', 'team', 'role', 'pin']) url.searchParams.delete(key);
  if (url.hash.startsWith('#session=')) url.hash = '';
  return { url: url.href, removed: true };
}
