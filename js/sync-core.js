export const CLOUD_TABLES = Object.freeze({
  players: 'jugadores',
  callups: 'convocatorias',
  matches: 'partidos',
  trainings: 'asistencias',
  settings: 'configuracion',
});

function assertStore(store) {
  if (!Object.hasOwn(CLOUD_TABLES, store)) {
    throw new TypeError('El almacén no es sincronizable.');
  }
}

export function sanitizeRecordForCloud(store, record) {
  assertStore(store);
  return structuredClone(record);
}

export function mergeCloudRecord(store, localRecord, cloudRecord) {
  assertStore(store);
  const merged = structuredClone(cloudRecord);
  if (store === 'settings' && cloudRecord.id === 'main') {
    for (const field of ['pinSalt', 'ownerPinHash', 'delegatePinHash', 'demoPinSalt', 'demoPinHash']) {
      if (!merged[field] && localRecord?.[field]) merged[field] = localRecord[field];
    }
  }
  return merged;
}

export function buildMutation(store, operation, recordOrId, queuedAt = Date.now()) {
  assertStore(store);
  if (!['upsert', 'delete'].includes(operation)) throw new TypeError('La operación de sincronización no es válida.');
  const recordId = operation === 'delete' ? recordOrId : recordOrId?.id;
  if (!recordId) throw new TypeError('La mutación necesita un identificador.');
  return {
    id: `${store}:${recordId}`,
    store,
    operation,
    recordId,
    payload: operation === 'upsert' ? sanitizeRecordForCloud(store, recordOrId) : null,
    queuedAt,
  };
}
