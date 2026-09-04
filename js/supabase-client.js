import { CLOUD_TABLES } from './sync-core.js';

export const SUPABASE_URL = 'https://mdzpygfwugawlmknywxa.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_j7duh_i5pNnMZMtT0YT-fg_l76UA_gH';
export const VIDEO_BUCKET = 'ejercicio-videos';

function checkResult(result) {
  if (result.error) throw result.error;
  return result.data;
}

export function createCampoBaseCloudStore() {
  if (!globalThis.supabase?.createClient) {
    throw new Error('No se ha podido cargar el cliente oficial de Supabase.');
  }
  const client = globalThis.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 2 } },
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

    // Storage: vídeos de ejercicios (bucket público `ejercicio-videos`).
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
