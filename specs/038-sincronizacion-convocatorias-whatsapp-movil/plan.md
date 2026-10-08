# Plan de Arquitectura — SDD 038

## 1. Filtrado de Partidos en Desplegable de Convocatorias (`js/app.js`)
- Crear helper `matchHasCallup(match, excludeCallupId)` que verifique:
  - `c.matchId === match.id`
  - `match.callupId === c.id`
  - `String(c.id) === String(match.id)`
  - `findMatchForCallup(c)?.id === match.id`
  - Coincidencia de fecha (día) y nombre normalizado del rival (`normalizeOpponentName`).
- Crear helper `isMatchOrCallupPlayed(match)` que verifique:
  - `isMatchPlayed(match)`
  - `match.completed === true`
  - Si tiene convocatoria asociada, verificar si dicha convocatoria está realizada (`isCallupPlayed(c)`).
- En `callupBuilder`:
  - Excluir partidos jugados o realizados (`isMatchOrCallupPlayed(match)`).
  - Excluir partidos con fecha anterior a hoy (`matchDay < localDateKey()`), a menos que sea el partido actualmente editado.
  - Excluir partidos que ya tienen convocatoria (`matchHasCallup(match, existing?.id)`).

## 2. Protección de Convocatorias Nuevas y Reconciliación Local-First (`js/app.js`, `js/sync-core.js`, `js/db.js`)
- En `saveCallup`:
  - Fijar explícitamente `completed: existing?.completed ?? false` y `closedAt: existing?.closedAt ?? null`.
- En `isCallupPlayed(callup)`:
  - Evitar que una convocatoria nueva (`completed !== true`) se clasifique como jugada por un partido histórico terminado si la convocatoria no tiene marcador ni estado de cierre.
- En `reconcileCloudSnapshot` (`js/sync-core.js`):
  - Iterar sobre `localRecords`: si un registro local existe y no está en `reconciled` (no vino en el snapshot de Supabase), NO descartarlo salvo que exista una mutación `delete` pendiente o esté en `deletedIds`.
  - Preservar los registros locales en `reconciled` para respetar el principio Local-First.
- En `syncFromCloud` (`js/db.js`):
  - Detectar registros en `localRecords` que no están en `snapshot.records` (como convocatorias creadas en el móvil).
  - Encolarlos para subida (`queueInitialRecords(store, missingLocals)`) y enviarlos a Supabase mediante `flushSyncQueue()`.

## 3. Invalidación de Caché de WhatsApp (`js/app.js`, `sw.js`, `index.html`)
- En `js/app.js`: versionar el import:
  `import { ... } from './whatsapp-suite.js?v=20261008-fix-convocatorias-whatsapp-sync-v6';`
- En `sw.js`:
  - Añadir `'./js/whatsapp-suite.js?v=20261008-fix-convocatorias-whatsapp-sync-v6'` en `ASSETS`.
  - Renovar `CACHE` con versión `v6`.
- En `index.html`:
  - Actualizar `window.__CAMPOBASE_BUILD = '20261008-fix-convocatorias-whatsapp-sync-v6'`.

## 4. Pruebas y Documentación
- Crear tests dedicados para:
  - `matchHasCallup` y exclusión de partidos jugados / con convocatoria en `callupBuilder`.
  - Preservación de registros locales en `reconcileCloudSnapshot`.
  - Sincronización de textos de WhatsApp.
- Actualizar `agente.md` con el registro de la versión.
