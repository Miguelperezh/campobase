export const SAAS_USER_STORAGE_KEY = 'campobase.saasUserId';
export const LEGACY_DATABASE_NAME = 'campobase';
export const DATABASE_VERSION = 2;
export const DATABASE_STORES = ['players', 'callups', 'matches', 'trainings', 'settings', 'syncQueue'];

export function normalizeUsername(raw = '') {
  return String(raw).trim().toLocaleLowerCase('es').replace(/^@/, '').replace(/\s+/g, '_');
}

export function classifyIdentifier(identifier = '') {
  const clean = String(identifier).trim();
  if (clean.startsWith('@')) return 'username';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) ? 'email' : 'username';
}

export function getBoundSaasUserId() {
  try { return String(localStorage.getItem(SAAS_USER_STORAGE_KEY) || ''); } catch { return ''; }
}

export function setBoundSaasUserId(userId) {
  if (!userId) throw new TypeError('Falta el identificador del usuario.');
  try { localStorage.setItem(SAAS_USER_STORAGE_KEY, String(userId)); } catch { /* La sesión de Supabase seguirá siendo la autoridad. */ }
}

export function clearBoundSaasUserId() {
  try { localStorage.removeItem(SAAS_USER_STORAGE_KEY); } catch { /* Sin almacenamiento local que limpiar. */ }
}

export function userDatabaseName(userId) {
  if (!userId) throw new TypeError('Falta el usuario para aislar la base local.');
  return `campobase_${String(userId)}`;
}

export async function getCurrentSession(client) {
  if (!client?.auth) return null;
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return data?.session || null;
}

export async function getCurrentProfile(client, userId = '') {
  const id = userId || (await getCurrentSession(client))?.user?.id || '';
  if (!id) return null;
  const { data, error } = await client
    .from('perfiles')
    .select('id,username,email,full_name,club_name,role,avatar_url')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function resolveUsernameEmail(client, username) {
  const clean = normalizeUsername(username);
  if (!clean) throw new Error('Introduce tu correo o nombre de usuario.');
  const { data, error } = await client.rpc('resolve_login_email', { p_username: clean });
  if (error) throw error;
  const email = typeof data === 'string' ? data : data?.email || '';
  if (!email) throw new Error(`No existe ningún usuario registrado como @${clean}.`);
  return email;
}

export async function loginWithEmailOrUsername(client, identifier, password) {
  if (!client?.auth) throw new Error('No se ha podido iniciar el acceso.');
  const cleanId = String(identifier).trim();
  if (!cleanId) throw new Error('Introduce tu correo o nombre de usuario.');
  if (!password) throw new Error('Introduce tu contraseña.');

  const targetEmail = classifyIdentifier(cleanId) === 'email'
    ? cleanId.toLocaleLowerCase('es')
    : await resolveUsernameEmail(client, cleanId);

  const { data, error } = await client.auth.signInWithPassword({ email: targetEmail, password });
  if (error) {
    if (/invalid login credentials/i.test(error.message || '')) throw new Error('Correo, usuario o contraseña incorrectos.');
    throw error;
  }
  return data;
}

export async function registerCoachAccount(client, { email, username, password, fullName = '', clubName = '' }) {
  if (!client?.auth) throw new Error('No se ha podido abrir el registro.');
  const cleanEmail = String(email).trim().toLocaleLowerCase('es');
  const cleanUsername = normalizeUsername(username);
  const cleanFullName = String(fullName).trim();
  const cleanClubName = String(clubName).trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Introduce un correo electrónico válido.');
  if (!/^[a-z0-9._-]{3,30}$/.test(cleanUsername)) throw new Error('El usuario debe tener entre 3 y 30 caracteres: letras, números, punto, guion o guion bajo.');
  if (String(password).length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
  if (!cleanFullName) throw new Error('Introduce tu nombre y apellidos.');

  const { data: available, error: availabilityError } = await client.rpc('username_available', { p_username: cleanUsername });
  if (availabilityError) throw availabilityError;
  if (available === false) throw new Error(`El usuario @${cleanUsername} ya existe. Elige otro nombre.`);

  const { data, error } = await client.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        username: cleanUsername,
        full_name: cleanFullName,
        club_name: cleanClubName || 'Mi equipo',
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function sendPasswordResetEmail(client, emailOrUser) {
  if (!client?.auth) throw new Error('No se ha podido iniciar la recuperación.');
  const clean = String(emailOrUser).trim();
  if (!clean) throw new Error('Introduce tu correo o usuario primero.');
  const email = classifyIdentifier(clean) === 'email'
    ? clean.toLocaleLowerCase('es')
    : await resolveUsernameEmail(client, clean);

  let redirectTo;
  if (typeof window !== 'undefined' && window.location) {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    redirectTo = url.href;
  }

  const { error } = await client.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
  if (error) throw error;
  return { success: true };
}

export async function updatePassword(client, password) {
  if (!client?.auth) throw new Error('No se ha podido actualizar la contraseña.');
  if (String(password).length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
  const { error } = await client.auth.updateUser({ password: String(password) });
  if (error) throw error;
  return { success: true };
}

export async function legacyOwnerClaimAvailable(client) {
  const { data, error } = await client.rpc('legacy_owner_claim_available');
  if (error) throw error;
  return Boolean(data);
}

export async function claimLegacyOwner(client, pin) {
  const cleanPin = String(pin || '').trim();
  if (!/^\d{4,8}$/.test(cleanPin)) throw new Error('Introduce el PIN actual de Migue.');
  const { data, error } = await client.rpc('claim_legacy_owner', { p_pin: cleanPin });
  if (error) throw error;
  if (!data?.success) throw new Error(data?.message || 'No se pudieron vincular los datos actuales.');
  return data;
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('La operación local se canceló.'));
  });
}

export function openRawDatabase(name) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      for (const store of DATABASE_STORES) {
        if (!request.result.objectStoreNames.contains(store)) request.result.createObjectStore(store, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Cierra otras pestañas de la aplicación y vuelve a intentarlo.'));
  });
}

export async function bootstrapUserDatabase(userId, profile = {}) {
  if (typeof indexedDB === 'undefined') return;
  const db = await openRawDatabase(userDatabaseName(userId));
  try {
    const transaction = db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    const [main, seeded] = await Promise.all([
      requestResult(store.get('main')),
      requestResult(store.get('squad-26-27-seeded')),
    ]);
    if (!main) {
      store.put({
        id: 'main',
        teamName: String(profile?.club_name || '').trim() || 'Mi equipo',
        format: 'F7',
        createdAt: Date.now(),
      });
    }
    if (!seeded) {
      store.put({ id: 'squad-26-27-seeded', recordType: 'migration', version: 1, createdAt: Date.now() });
    }
    await transactionDone(transaction);
  } finally {
    db.close();
  }
}

async function readDatabaseSnapshot(name) {
  const db = await openRawDatabase(name);
  try {
    const snapshot = {};
    for (const storeName of DATABASE_STORES) {
      const transaction = db.transaction(storeName, 'readonly');
      snapshot[storeName] = await requestResult(transaction.objectStore(storeName).getAll());
      await transactionDone(transaction);
    }
    return snapshot;
  } finally {
    db.close();
  }
}

export async function migrateLegacyDatabaseToUser(userId) {
  if (typeof indexedDB === 'undefined') return;
  const snapshot = await readDatabaseSnapshot(LEGACY_DATABASE_NAME);
  const target = await openRawDatabase(userDatabaseName(userId));
  try {
    for (const storeName of DATABASE_STORES) {
      const records = snapshot[storeName] || [];
      if (!records.length) continue;
      const transaction = target.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      for (const record of records) store.put(record);
      await transactionDone(transaction);
    }
  } finally {
    target.close();
  }
}
