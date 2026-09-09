export const DEMO_DURATION_MS = 2 * 60 * 60 * 1_000;

function validDemoId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(id);
}

export function createDemoSession(id, now = Date.now()) {
  if (!validDemoId(id)) throw new TypeError('El identificador de la sesión demo no es válido.');
  if (!Number.isFinite(now)) throw new TypeError('La hora de inicio de la demo no es válida.');
  return { id, expiresAt: now + DEMO_DURATION_MS };
}

export function isDemoSessionActive(session, now = Date.now()) {
  return Boolean(
    session
    && validDemoId(session.id)
    && Number.isFinite(session.expiresAt)
    && Number.isFinite(now)
    && now < session.expiresAt,
  );
}

export function demoDatabaseName(session) {
  if (!session || !validDemoId(session.id)) throw new TypeError('La sesión demo no es válida.');
  return `campobase-demo-${session.id}`;
}

export function roleCanUseOwnerFeatures(role) {
  return role === 'owner' || role === 'demo';
}
