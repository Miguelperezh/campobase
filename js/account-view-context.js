import { isMatchTerminal } from './postgame-plan.js?v=20261018-offline-match-1';

// Identity belongs to an operation, never to whichever account finishes last.
export function sameViewAccount(left, right) {
  return Boolean(left && right && left.database === right.database && left.userId === right.userId);
}

export function sameViewContext(left, right) {
  return sameViewAccount(left, right) && left.pinRevision === right.pinRevision && left.role === right.role;
}

export function accountCacheKey(key, context) {
  return `${key}.account.${encodeURIComponent(JSON.stringify([context.database || '', context.userId || '']))}`;
}

export function browserCacheContext(storage = globalThis.localStorage, session = globalThis.sessionStorage) {
  let userId = '', database = 'campobase';
  try {
    userId = storage.getItem('campobase.saasUserId') || '';
    database = userId ? `campobase_${userId}` : 'campobase';
    if (session?.getItem('campobase.sessionRole') === 'demo') {
      const demo = JSON.parse(session.getItem('campobase.demoSession') || 'null');
      if (demo?.id) database = `campobase-demo-${demo.id}`;
    }
  } catch {}
  return { userId, database };
}

export function cacheBelongsToAccount(cache, context) {
  if (!cache || typeof cache !== 'object') return false;
  if (context.userId || context.database !== 'campobase') {
    return cache.saasUserId === context.userId && cache.database === context.database;
  }
  return !cache.saasUserId && (!cache.database || cache.database === 'campobase');
}

export function readViewCache(storage, key, context, { isolated = false } = {}) {
  try {
    const scoped = storage.getItem(accountCacheKey(key, context));
    if (scoped !== null) return JSON.parse(scoped);
    // Historic anonymous data has no proven SaaS owner. Keep it on disk, but
    // never adopt it for a signed-in account or a temporary demo.
    if ((!context.userId && context.database === 'campobase') || (isolated && !context.userId && !context.database)) {
      return JSON.parse(storage.getItem(key) || 'null');
    }
  } catch { /* Storage failure is a missing cache, not missing team data. */ }
  return null;
}

export function writeViewCache(storage, key, value, context) {
  const serialized = JSON.stringify(value);
  storage.setItem(accountCacheKey(key, context), serialized);
  const previous = storage.getItem(key);
  if (previous !== null && previous !== serialized) {
    const recoveryKey = `${key}.unattributedBackup.v1`;
    if (storage.getItem(recoveryKey) === null) storage.setItem(recoveryKey, previous);
  }
  // Existing field-mode consumers still use this bridge. Provenance is inside
  // its payload; the main app reads only its account-specific copy.
  storage.setItem(key, serialized);
}

export function projectLiveTimer(timer, matches) {
  if (!timer) return null;
  const match = (matches || []).find((item) => String(item.id) === String(timer.matchId));
  // Dates, elapsed time, opponents and an incomplete local download are not
  // evidence of a finished match. Reading must never repair sporting records.
  return isMatchTerminal(match) ? null : timer;
}
