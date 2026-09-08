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

export function reconcileCloudSnapshot(store, localRecords, cloudRecords, pendingMutations = []) {
  assertStore(store);
  const localById = new Map(localRecords.map((record) => [record.id, record]));
  const reconciled = new Map(cloudRecords.map((record) => [
    record.id,
    mergeCloudRecord(store, localById.get(record.id), record),
  ]));
  const pendingForStore = pendingMutations.filter((mutation) => mutation.store === store);

  for (const mutation of pendingForStore) {
    if (mutation.operation === 'delete') reconciled.delete(mutation.recordId);
    else reconciled.set(mutation.recordId, structuredClone(mutation.payload));
  }

  const mainDeletePending = pendingForStore.some((mutation) => (
    mutation.operation === 'delete' && mutation.recordId === 'main'
  ));
  const localMain = localById.get('main');
  if (store === 'settings' && localMain && !reconciled.has('main') && !mainDeletePending) {
    reconciled.set('main', structuredClone(localMain));
  }
  return [...reconciled.values()];
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
