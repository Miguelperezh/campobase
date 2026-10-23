import { CLOUD_TABLES } from './sync-core.js';
import { getBoundSaasUserId, setBoundSaasUserId, getPinAccessRevision } from './auth-manager.js';

const PLAYER_PROFILE_FIELDS = Object.freeze([
  'name', 'number', 'positions', 'foot', 'notes',
  'fatherName', 'fatherPhone', 'motherName', 'motherPhone',
  'photo', 'createdAt', 'profileUpdatedAt',
]);

export const CAMPOBASE_REALTIME_TABLES = Object.freeze(Object.values(CLOUD_TABLES));

export const SUPABASE_URL = 'https://mdzpygfwugawlmknywxa.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_j7duh_i5pNnMZMtT0YT-fg_l76UA_gH';
export const VIDEO_BUCKET = 'ejercicio-videos';

function checkResult(result) {
  if (result.error) throw result.error;
  return result.data;
}

function installIndexedDbUserNamespace() {
  if (typeof indexedDB === 'undefined' || globalThis.__cbIndexedDbNamespaceInstalled) return;
  globalThis.__cbIndexedDbNamespaceInstalled = true;
  const factory = indexedDB;
  const nativeOpen = factory.open.bind(factory);
  // Explicit legacy recovery must be able to read the literal legacy database,
  // rather than this compatibility alias for the current account.
  globalThis.__cbNativeIndexedDbOpen ||= nativeOpen;
  try {
    factory.open = (name, version) => {
      const boundUserId = getBoundSaasUserId();
      const mappedName = name === 'campobase' && boundUserId ? `campobase_${boundUserId}` : name;
      return version === undefined ? nativeOpen(mappedName) : nativeOpen(mappedName, version);
    };
  } catch {
    // El aislamiento cloud sigue estando protegido por RLS incluso si un navegador
    // impide sustituir el método de IndexedDB.
  }
}

installIndexedDbUserNamespace();

const pinSessionCommitGuards = new Map();
const unavailableSessionStorage = new Map();
const guardedSessionStorage = {
  getItem(key) {try{return globalThis.localStorage.getItem(key);}catch{return unavailableSessionStorage.get(key) ?? null;}},
  removeItem(key) {unavailableSessionStorage.delete(key);try{globalThis.localStorage.removeItem(key);}catch{}},
  setItem(key,value) {
    let token;
    try {token=JSON.parse(value)?.access_token;} catch {/* Other SDK values are not sessions. */}
    pinSessionCommitGuards.get(token)?.();
    try {globalThis.localStorage.setItem(key,value);} catch {unavailableSessionStorage.set(key,value);}
  },
};

export function getCampoBaseSupabaseClient() {
  if (!globalThis.supabase?.createClient) {
    throw new Error('No se ha podido cargar el cliente oficial de Supabase.');
  }
  if (!globalThis.__cbSupabaseClient) {
    globalThis.__cbSupabaseClient = globalThis.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storage:guardedSessionStorage },
      realtime: { params: { eventsPerSecond: 2 } },
    });
  }
  globalThis.__cbSupabaseClient.__campobaseCreatePinVerifier ||= () => globalThis.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  globalThis.__cbSupabaseClient.__campobaseCommitPinSession ||= async (session,assertCurrent) => {
    assertCurrent();
    if(!session?.access_token || !session?.refresh_token)throw new Error('No se pudo confirmar la sesión segura.');
    if(!Number.isFinite(Number(session.expires_at)) || Number(session.expires_at)<=Date.now()/1000+30)throw new Error('La sesión de acceso ha caducado. Introduce de nuevo el PIN.');
    pinSessionCommitGuards.set(session.access_token,assertCurrent);
    try {
      const result=await globalThis.__cbSupabaseClient.auth.setSession({access_token:session.access_token,refresh_token:session.refresh_token});
      assertCurrent();
      return result;
    } finally {pinSessionCommitGuards.delete(session.access_token);}
  };
  return globalThis.__cbSupabaseClient;
}

export const getSupabaseAuthClient = getCampoBaseSupabaseClient;

const isPinDelegate = user => user?.app_metadata?.campobase_role === 'delegate_pin';
function changedCloudContext() {
  const error = new Error('La cuenta o el acceso han cambiado. Los cambios pendientes permanecen en su cuenta original.');
  error.code = 'CAMPOBASE_AUTH_REQUIRED';
  return error;
}
function assertCloudContext(context, user) {
  if (!context?.userId || getBoundSaasUserId() !== context.userId
    || getPinAccessRevision() !== context.pinRevision || (user && user.id !== context.userId)
    || (context.database && context.database !== `campobase_${context.userId}`)) throw changedCloudContext();
}
async function delegateRequest(client, body, access) {
  const {data,error} = await access.request(() => client.functions.invoke('delegate-sync',{body:{
    ...body,expectedUserId:access.user.id,expectedOwnerUserId:access.dataOwnerUserId,expectedTeamId:access.teamContext.team_id,
  }}));
  if (error) {
    let detail = null;
    try { detail = await error.context?.clone().json(); } catch {}
    access.assertCurrent();
    const failure = new Error(detail?.message || 'No se pudo sincronizar el delegado. Vuelve a actualizar.');
    failure.code = detail?.code || (error.context?.status === 401 ? 'CAMPOBASE_AUTH_REQUIRED' : 'CAMPOBASE_DELEGATE_SYNC');
    throw failure;
  }
  return data;
}

export async function getRemoteMainSettings() {
  const client = getCampoBaseSupabaseClient();
  const access = await requireBoundUser(client);
  const { dataOwnerUserId } = access;
  if (access.delegate) {
    const snapshot = await delegateRequest(client,{operation:'snapshot',store:'settings'},access);
    return snapshot.records.find(row=>row.id==='main') || null;
  }
  const rows = checkResult(await access.request(() => client
    .from(CLOUD_TABLES.settings)
    .select('payload,updated_at,deleted_at')
    .eq('user_id', dataOwnerUserId)
    .eq('id', 'main')
    .limit(1))) ?? [];
  access.assertCurrent();
  const row = rows[0];
  if (!row || row.deleted_at) return null;
  return row.payload || null;
}

const boundTeamContexts = new WeakMap();
async function getBoundTeamContext(client, userId) {
  const cached = boundTeamContexts.get(client);
  if (cached?.userId === userId && Date.now() < cached.expiresAt) return cached.promise;
  const entry = { userId, expiresAt: Date.now() + 5000, promise: null };
  entry.promise = Promise.resolve().then(() => client.rpc('mi_equipo_contexto')).then((result) => {
    if (result.error || !result.data) {
      if (boundTeamContexts.get(client) === entry) boundTeamContexts.delete(client);
    }
    return result;
  }).catch((error) => {
    if (boundTeamContexts.get(client) === entry) boundTeamContexts.delete(client);
    throw error;
  });
  boundTeamContexts.set(client, entry);
  return entry.promise;
}

async function requireBoundUser(client, expectedContext) {
  const initialBoundUserId = getBoundSaasUserId();
  let context = Object.freeze({
    userId:expectedContext?.userId ?? initialBoundUserId,
    pinRevision:expectedContext?.pinRevision ?? getPinAccessRevision(),
    database:expectedContext?.database,
  });
  if (context.userId) assertCloudContext(context);
  const { data, error } = await client.auth.getSession();
  if (getBoundSaasUserId() !== initialBoundUserId || getPinAccessRevision() !== context.pinRevision) throw changedCloudContext();
  if (error) throw error;
  const user = data?.session?.user;
  const pinDelegate = isPinDelegate(user);
  let boundUserId = getBoundSaasUserId();

  // Si Supabase conserva una sesión válida pero se perdió únicamente el
  // enlace local de la cuenta, reconstruimos ese enlace desde la sesión
  // autenticada. Así se recupera la base local del usuario y sus datos sin
  // crear una cuenta vacía ni pedir que borre almacenamiento.
  if (user?.id && !boundUserId) {
    // Only an explicit session preparation can restore the binding. A batch
    // captured against the legacy database cannot become this user's batch.
    if (expectedContext) throw changedCloudContext();
    setBoundSaasUserId(user.id);
    boundUserId = user.id;
    context = Object.freeze({...context,userId:user.id});
  }

  if (!user || !boundUserId || user.id !== boundUserId) {
    const authError = new Error('Inicia sesión para sincronizar esta cuenta.');
    authError.code = 'CAMPOBASE_AUTH_REQUIRED';
    throw authError;
  }
  assertCloudContext(context,user);
  let teamResult;
  try { teamResult = await getBoundTeamContext(client,user.id); }
  catch (error) {
    assertCloudContext(context,user);
    const contextError = new Error('No se pudo comprobar el equipo de esta cuenta. Tus datos locales se conservan.', {cause:error});
    contextError.code = 'CAMPOBASE_CONTEXT_UNAVAILABLE';
    throw contextError;
  }
  assertCloudContext(context,user);
  const {data:teamContext,error:teamError} = teamResult;
  // An unavailable membership must never become another data owner or an empty
  // remote namespace into which cached team records can be uploaded.
  if (teamError || !teamContext?.data_owner_user_id || !teamContext?.team_id
    || !['admin','coach','delegate'].includes(teamContext.membership_role)) {
    const contextError = new Error('No se pudo comprobar el equipo de esta cuenta. Tus datos locales se conservan.');
    contextError.code = 'CAMPOBASE_CONTEXT_UNAVAILABLE';
    throw contextError;
  }
  const dataOwnerUserId = teamContext.data_owner_user_id;
  if ((expectedContext?.ownerUserId && expectedContext.ownerUserId !== dataOwnerUserId)
    || (expectedContext?.teamId && expectedContext.teamId !== teamContext.team_id)) throw changedCloudContext();
  const delegate = pinDelegate || teamContext.membership_role === 'delegate';
  if (pinDelegate && (teamContext.membership_role !== 'delegate' || user.app_metadata.campobase_owner_id !== dataOwnerUserId)) throw changedCloudContext();
  const assertCurrent = () => assertCloudContext(context,user);
  const assertSession = async () => {
    assertCurrent();
    const {data:current,error:sessionError} = await client.auth.getSession();
    if (sessionError || !current?.session?.user) throw changedCloudContext();
    assertCloudContext(context,current.session.user);
    if (isPinDelegate(current.session.user) !== pinDelegate) throw changedCloudContext();
  };
  // The SDK may wait for a refreshed token before sending a request. Recheck the
  // session on both sides so its result can never cross into a later account.
  const request = async operation => {
    await assertSession();
    assertCurrent();
    let result;
    try { result = await operation(); }
    catch (error) {
      assertCurrent();
      await assertSession();
      throw error;
    }
    assertCurrent();
    await assertSession();
    assertCurrent();
    return result;
  };
  await assertSession();
  assertCurrent();
  return {user,teamContext,dataOwnerUserId,delegate,context,assertCurrent,assertSession,request};
}

export function createCampoBaseCloudStore({initializeUi=true} = {}) {
  const client = getCampoBaseSupabaseClient();
  let delegateSnapshots = null;
  let realtimeChannel = null;
  let realtimeOwnerUserId = '';
  let realtimeContextKey = '';
  let realtimeChangeHandler = null;
  let realtimeStatusHandler = null;

  async function stopRealtimeChanges() {
    const channel = realtimeChannel;
    realtimeChannel = null;
    realtimeOwnerUserId = '';
    realtimeContextKey = '';
    realtimeChangeHandler = null;
    realtimeStatusHandler = null;
    if (channel) await client.removeChannel(channel).catch(() => null);
  }

  async function subscribeToChanges(onChange, onStatus) {
    if (typeof onChange !== 'function') {
      throw new TypeError('La sincronización Realtime necesita un manejador de cambios.');
    }

    const access = await requireBoundUser(client);
    access.assertCurrent();
    const { dataOwnerUserId } = access;
    if (access.delegate) { await stopRealtimeChanges(); return {ownerUserId:dataOwnerUserId,polling:true}; }
    const contextKey = JSON.stringify([access.user.id,dataOwnerUserId,access.context.pinRevision]);
    if (realtimeChannel && realtimeContextKey === contextKey) {
      realtimeChangeHandler = onChange;
      realtimeStatusHandler = typeof onStatus === 'function' ? onStatus : null;
      return { ownerUserId: dataOwnerUserId, reused: true };
    }

    await stopRealtimeChanges();
    access.assertCurrent();
    realtimeChangeHandler = onChange;
    realtimeStatusHandler = typeof onStatus === 'function' ? onStatus : null;

    const channel = client.channel(`campobase-db:${dataOwnerUserId}`);
    for (const table of CAMPOBASE_REALTIME_TABLES) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          try { access.assertCurrent(); } catch { return; }
          const nextRow = payload?.new && Object.keys(payload.new).length ? payload.new : null;
          const previousRow = payload?.old && Object.keys(payload.old).length ? payload.old : null;
          const row = nextRow ?? previousRow;
          // Postgres Changes respeta RLS. Esta comprobación adicional evita
          // procesar una fila ajena si el payload incluye user_id.
          if (row?.user_id && row.user_id !== dataOwnerUserId) return;
          realtimeChangeHandler?.({
            table,
            eventType: payload?.eventType ?? '',
            id: row?.id ?? null,
          });
        },
      );
    }

    realtimeChannel = channel;
    realtimeOwnerUserId = dataOwnerUserId;
    realtimeContextKey = contextKey;

    channel.subscribe((status, error) => {
      try { access.assertCurrent(); } catch { return; }
      if (realtimeChannel !== channel) return;
      realtimeStatusHandler?.(status, error ?? null);
      if (!['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) return;
      if (realtimeChannel !== channel) return;
      realtimeChannel = null;
      realtimeOwnerUserId = '';
      realtimeContextKey = '';
      void client.removeChannel(channel).catch(() => null);
    });

    return { ownerUserId: dataOwnerUserId, reused: false };
  }

  if (initializeUi) {
  void import('./cloud-ui-bootstrap.js?v=20261022-pilot-safety-1').catch(error=>console.warn('No se pudieron cargar las ayudas de pantalla:',error));
  void import('./saas-session-guard.js?v=1')
    .then(({ guardSaasSession }) => guardSaasSession(client))
    .then(() => import('./saas-auth-ui-v2.js?v=20261009-delegate-pin-7'))
    .then(({ initSaasAuth }) => initSaasAuth(client))
    .then(() => import('./legacy-data-link-guard.js?v=1'))
    .then(({ initLegacyDataLinkGuard }) => initLegacyDataLinkGuard())
    .catch((error) => {
      console.warn('No se pudo cargar el acceso de usuario:', error);
      // Fallback de emergencia: un fallo del acceso SaaS nunca puede dejar
      // CampoBase abierto y vacío sin ofrecer el PIN local validado.
      document.body?.classList.add('auth-locked');
      const dialog = document.getElementById('auth-dialog');
      const localForm = document.getElementById('auth-form');
      const saasShell = document.getElementById('saas-auth-shell');
      saasShell?.classList.add('hidden');
      localForm?.classList.remove('hidden');
      if (dialog && !dialog.open) dialog.showModal();
    });

  void import('./promo-codes-admin.js?v=4')
    .then(() => import('./promo-codes-ui-v2.js?v=2'))
    .catch((error) => {
      console.warn('No se pudo cargar el módulo de promociones:', error);
    });

  void import('./billing-manager.js?v=1')
    .then(({ initBillingManager }) => initBillingManager(client))
    .catch((error) => {
      console.warn('No se pudo cargar el estado de la cuenta:', error);
    });

  void import('./team-access.js?v=20261009-delegate-pin-7')
    .then(({ initTeamAccess }) => initTeamAccess(client))
    .catch((error) => {
      console.warn('No se pudo cargar el acceso del equipo:', error);
    });
  }

  return {
    subscribeToChanges,
    stopRealtimeChanges,

    async prepare(_unused, {expectedContext} = {}) {
      delegateSnapshots = null;
      const {user,delegate,dataOwnerUserId,teamContext} = await requireBoundUser(client,expectedContext);
      return {userId:user.id,delegate,ownerUserId:dataOwnerUserId,teamId:teamContext.team_id};
    },

    async shouldApplyMutation(mutation, {expectedContext} = {}) {
      const access = await requireBoundUser(client,expectedContext);
      const {dataOwnerUserId} = access;
      if (access.delegate) return (await delegateRequest(client,{operation:'check',store:mutation.store,mutation},access)).shouldApply;
      const table = CLOUD_TABLES[mutation.store];
      const query = client
        .from(table)
        .select('updated_at,deleted_at')
        .eq('user_id', dataOwnerUserId)
        .eq('id', mutation.recordId)
        .limit(1);
      if (typeof query.abortSignal === 'function' && typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
        query.abortSignal(AbortSignal.timeout(6000));
      }
      const rows = checkResult(await access.request(() => query)) ?? [];
      access.assertCurrent();
      const remote = rows[0];
      if (!remote) return true;
      const remoteUpdatedAt = Number(remote.updated_at || remote.deleted_at || 0);
      const localQueuedAt = Number(mutation.queuedAt || 0);
      return localQueuedAt >= remoteUpdatedAt;
    },

    async getSnapshot(store, {expectedContext} = {}) {
      const access = await requireBoundUser(client,expectedContext);
      const {dataOwnerUserId} = access;
      if (access.delegate) {
        const key = JSON.stringify([access.user.id,dataOwnerUserId,access.teamContext.team_id,access.context.pinRevision]);
        if (delegateSnapshots?.key !== key || !Object.hasOwn(delegateSnapshots.snapshots,store)) {
          const response = await delegateRequest(client,{operation:'snapshots'},access);
          access.assertCurrent();
          delegateSnapshots = {key,snapshots:response.snapshots};
        }
        const result = delegateSnapshots.snapshots[store];
        delete delegateSnapshots.snapshots[store];
        if (!Object.keys(delegateSnapshots.snapshots).length) delegateSnapshots = null;
        return result;
      }
      const table = CLOUD_TABLES[store];
      const query = client
        .from(table)
        .select('id,payload,updated_at,deleted_at,user_id')
        .eq('user_id', dataOwnerUserId);
      if (typeof query.abortSignal === 'function' && typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
        query.abortSignal(AbortSignal.timeout(7000));
      }
      const rows = checkResult(await access.request(() => query)) ?? [];
      access.assertCurrent();
      return {
        records: rows.filter(({ deleted_at: deletedAt }) => !deletedAt).map(({ payload }) => payload),
        deletedIds: rows.filter(({ deleted_at: deletedAt }) => Boolean(deletedAt)).map(({ id }) => id),
        rowCount: rows.length,
      };
    },

    async upsert(mutation, {expectedContext} = {}) {
      const access = await requireBoundUser(client,expectedContext);
      const {dataOwnerUserId} = access;
      if (access.delegate) return delegateRequest(client,{operation:'upsert',store:mutation.store,mutation},access);
      const table = CLOUD_TABLES[mutation.store];
      let payload = mutation.payload;

      if (mutation.store === 'players' && payload) {
        const rows = checkResult(await access.request(() => client
          .from(table)
          .select('payload')
          .eq('user_id', dataOwnerUserId)
          .eq('id', mutation.recordId)
          .limit(1))) ?? [];
        access.assertCurrent();
        const remotePayload = rows[0]?.payload;
        if (remotePayload) {
          const remoteProfileUpdatedAt = Number(remotePayload.profileUpdatedAt || 0);
          const localProfileUpdatedAt = Number(payload.profileUpdatedAt || 0);
          if (remoteProfileUpdatedAt >= localProfileUpdatedAt) {
            payload = structuredClone(payload);
            for (const field of PLAYER_PROFILE_FIELDS) {
              if (Object.hasOwn(remotePayload, field)) payload[field] = structuredClone(remotePayload[field]);
              else delete payload[field];
            }
          }
        }
      }

      const applied = checkResult(await access.request(() => client.rpc('owner_sync_upsert',{
        p_store:mutation.store,p_record_id:mutation.recordId,p_payload:payload,p_updated:mutation.queuedAt,p_deleted:false,p_expected_user_id:access.context.userId,
      })));
      access.assertCurrent();
      return {applied:Boolean(applied)};
    },

    async remove(mutation, {expectedContext} = {}) {
      const access = await requireBoundUser(client,expectedContext);
      if (access.delegate) return delegateRequest(client,{operation:'delete',store:mutation.store,mutation},access);
      const applied = checkResult(await access.request(() => client.rpc('owner_sync_upsert',{
        p_store:mutation.store,p_record_id:mutation.recordId,p_payload:null,p_updated:mutation.queuedAt,p_deleted:true,p_expected_user_id:access.context.userId,
      })));
      access.assertCurrent();
      return {applied:Boolean(applied)};
    },

    async uploadVideo(path, file, {expectedContext} = {}) {
      const access = await requireBoundUser(client,expectedContext);
      const {user} = access;
      if (access.delegate) throw new Error('Solo el entrenador puede cambiar los vídeos.');
      const relative = String(path || '').replace(/^\/+/, '');
      if (!relative || /[\\\u0000-\u001f]/.test(relative) || relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('La ruta del vídeo no es válida.');
      const ownedPath = relative.startsWith(`${user.id}/`) ? relative : `${user.id}/${relative}`;
      const { data, error } = await access.request(() => client.storage.from(VIDEO_BUCKET).upload(ownedPath, file, {
        cacheControl: '3600',
        contentType: file.type || 'video/mp4',
        upsert: true,
      }));
      if (error) throw error;
      access.assertCurrent();
      return {...data,path:data?.path || ownedPath};
    },

    async removeVideo(path, {expectedContext} = {}) {
      const access = await requireBoundUser(client,expectedContext);
      if (access.delegate) throw new Error('Solo el entrenador puede cambiar los vídeos.');
      if (typeof path !== 'string' || !path.startsWith(`${access.user.id}/`)
        || /[\\\u0000-\u001f]/.test(path) || path.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Solo puedes borrar vídeos propios.');
      const { data, error } = await access.request(() => client.storage.from(VIDEO_BUCKET).remove([path]));
      if (error) throw error;
      access.assertCurrent();
      return data;
    },
  };
}
