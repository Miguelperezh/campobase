import './match-postgame-editor.js';
import './plantilla-stats-sync.js';
import './match-calendar-sync.js';
import './exercise-board-persistence.js?v=2473';
import './runtime-refresh.js?v=2473';
import './exercise-viewer-controls.js?v=2475';
import './exercise-viewer-layout.js?v=2475';
import { CLOUD_TABLES } from './sync-core.js';

export const SUPABASE_URL = 'https://mdzpygfwugawlmknywxa.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_j7duh_i5pNnMZMtT0YT-fg_l76UA_gH';
export const VIDEO_BUCKET = 'ejercicio-videos';

function checkResult(result) {
  if (result.error) throw result.error;
  return result.data;
}

export function getCampoBaseSupabaseClient() {
  if (!globalThis.supabase?.createClient) {
    throw new Error('No se ha podido cargar el cliente oficial de Supabase.');
  }
  if (!globalThis.__cbSupabaseClient) {
    globalThis.__cbSupabaseClient = globalThis.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      realtime: { params: { eventsPerSecond: 2 } },
    });
  }
  return globalThis.__cbSupabaseClient;
}

export function createCampoBaseCloudStore() {
  const client = getCampoBaseSupabaseClient();

  // Fase 2 se carga como módulo aislado sobre el mismo cliente existente.
  // No modifica la autenticación actual ni la sincronización deportiva.
  void import('./promo-codes-admin.js?v=2')
    .then(() => import('./promo-codes-ui-v2.js?v=1'))
    .catch((error) => {
      console.warn('No se pudo cargar el módulo de promociones:', error);
    });

  return {
    async getSnapshot(store) {
      const table = CLOUD_TABLES[store];
      const rows = checkResult(await client.from(table).select('id,payload,updated_at,deleted_at')) ?? [];
      return {
        records: rows.filter(({ deleted_at: deletedAt }) => !deletedAt).map(({ payload }) => payload),
        deletedIds: rows.filter(({ deleted_at: deletedAt }) => Boolean(deletedAt)).map(({ id }) => id),
        rowCount: rows.length,
      };
    },

    async upsert(mutation) {
      const table = CLOUD_TABLES[mutation.store];
      checkResult(await client.from(table).upsert({
        id: mutation.recordId,
        payload: mutation.payload,
        updated_at: mutation.queuedAt,
        deleted_at: null,
      }, { onConflict: 'id' }));
    },

    async remove(mutation) {
      const table = CLOUD_TABLES[mutation.store];
      checkResult(await client.from(table).upsert({
        id: mutation.recordId,
        payload: null,
        updated_at: mutation.queuedAt,
        deleted_at: mutation.queuedAt,
      }, { onConflict: 'id' }));
    },

    async uploadVideo(path, file) {
      const { data, error } = await client.storage.from(VIDEO_BUCKET).upload(path, file, {
        cacheControl: '3600',
        contentType: file.type || 'video/mp4',
        upsert: true,
      });
      if (error) throw error;
      return data;
    },

    async removeVideo(path) {
      const { data, error } = await client.storage.from(VIDEO_BUCKET).remove([path]);
      if (error) throw error;
      return data;
    },
  };
}
