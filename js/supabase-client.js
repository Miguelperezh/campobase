import './match-postgame-editor.js';
import './plantilla-stats-sync.js';
import './player-data-sync.js?v=1';
import './match-calendar-sync.js';
import './player-roster-guard.js?v=1';
import './attendance-session-manual-state.js?v=3';
import './exercise-board-persistence.js?v=2473';
import './runtime-refresh.js?v=2473';
import './exercise-viewer-controls.js?v=2475';
import './exercise-viewer-layout.js?v=2475';
import { CLOUD_TABLES } from './sync-core.js';
import { getBoundSaasUserId } from './auth-manager.js';

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

export function getCampoBaseSupabaseClient() {
  if (!globalThis.supabase?.createClient) {
    throw new Error('No se ha podido cargar el cliente oficial de Supabase.');
  }
  if (!globalThis.__cbSupabaseClient) {
    globalThis.__cbSupabaseClient = globalThis.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      realtime: { params: { eventsPerSecond: 2 } },
    });
  }
  return globalThis.__cbSupabaseClient;
}

export const getSupabaseAuthClient = getCampoBaseSupabaseClient;

async function requireBoundUser(client) {
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  const user = data?.session?.user;
  const boundUserId = getBoundSaasUserId();
  if (!user || !boundUserId || user.id !== boundUserId) {
    const authError = new Error('Inicia sesión para sincronizar esta cuenta.');
    authError.code = 'CAMPOBASE_AUTH_REQUIRED';
    throw authError;
  }

  const { data: teamContext, error: teamError } = await client.rpc('mi_equipo_contexto');
  if (teamError) throw teamError;
  const dataOwnerUserId = teamContext?.data_owner_user_id || user.id;
  return { user, teamContext: teamContext || null, dataOwnerUserId };
}

export function createCampoBaseCloudStore() {
  const client = getCampoBaseSupabaseClient();

  void import('./saas-session-guard.js?v=1')
    .then(({ guardSaasSession }) => guardSaasSession(client))
    .then(() => import('./saas-auth-ui-v2.js?v=1'))
    .then(({ initSaasAuth }) => initSaasAuth(client))
    .then(() => import('./legacy-data-link-guard.js?v=1'))
    .then(({ initLegacyDataLinkGuard }) => initLegacyDataLinkGuard())
    .catch((error) => {
      console.warn('No se pudo cargar el acceso de usuario:', error);
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

  void import('./team-access.js?v=1')
    .then(({ initTeamAccess }) => initTeamAccess(client))
    .catch((error) => {
      console.warn('No se pudo cargar el acceso del equipo:', error);
    });

  return {
    async getSnapshot(store) {
      const { dataOwnerUserId } = await requireBoundUser(client);
      const table = CLOUD_TABLES[store];
      const rows = checkResult(await client
        .from(table)
        .select('id,payload,updated_at,deleted_at,user_id')
        .eq('user_id', dataOwnerUserId)) ?? [];
      return {
        records: rows.filter(({ deleted_at: deletedAt }) => !deletedAt).map(({ payload }) => payload),
        deletedIds: rows.filter(({ deleted_at: deletedAt }) => Boolean(deletedAt)).map(({ id }) => id),
        rowCount: rows.length,
      };
    },

    async upsert(mutation) {
      const { dataOwnerUserId } = await requireBoundUser(client);
      const table = CLOUD_TABLES[mutation.store];
      checkResult(await client.from(table).upsert({
        user_id: dataOwnerUserId,
        id: mutation.recordId,
        payload: mutation.payload,
        updated_at: mutation.queuedAt,
        deleted_at: null,
      }, { onConflict: 'user_id,id' }));
    },

    async remove(mutation) {
      const { dataOwnerUserId } = await requireBoundUser(client);
      const table = CLOUD_TABLES[mutation.store];
      checkResult(await client.from(table).upsert({
        user_id: dataOwnerUserId,
        id: mutation.recordId,
        payload: null,
        updated_at: mutation.queuedAt,
        deleted_at: mutation.queuedAt,
      }, { onConflict: 'user_id,id' }));
    },

    async uploadVideo(path, file) {
      await requireBoundUser(client);
      const { data, error } = await client.storage.from(VIDEO_BUCKET).upload(path, file, {
        cacheControl: '3600',
        contentType: file.type || 'video/mp4',
        upsert: true,
      });
      if (error) throw error;
      return data;
    },

    async removeVideo(path) {
      await requireBoundUser(client);
      const { data, error } = await client.storage.from(VIDEO_BUCKET).remove([path]);
      if (error) throw error;
      return data;
    },
  };
}