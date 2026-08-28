export const CLOUD_TABLES = Object.freeze({
  players: 'jugadores',
  callups: 'convocatorias',
  matches: 'partidos',
  trainings: 'asistencias',
  settings: 'configuracion',
});

const LOCAL_PIN_FIELDS = ['pinSalt', 'ownerPinHash', 'delegatePinHash'];

function assertStore(store) {
  if (!Object.hasOwn(CLOUD_TABLES, store)) {
    throw new TypeError('El almacén no es sincronizable.');
  }
}

export function sanitizeRecordForCloud(store, record) {
  assertStore(store);
  const sanitized = structuredClone(record);
  if (store === 'settings' && sanitized.id === 'main') {
    for (const field of LOCAL_PIN_FIELDS) delete sanitized[field];
  }
  return sanitized;
}

export function mergeCloudRecord(store, localRecord, cloudRecord) {
  assertStore(store);
  if (store !== 'settings' || cloudRecord.id !== 'main') return structuredClone(cloudRecord);
  const localPins = Object.fromEntries(
    LOCAL_PIN_FIELDS
      .filter((field) => localRecord?.[field])
      .map((field) => [field, localRecord[field]]),
  );
  return { ...structuredClone(cloudRecord), ...localPins };
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
