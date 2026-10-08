# Evidencia y límites

## Causas verificadas en código
El selector de WhatsApp seguía ofreciendo todo el calendario aunque el selector de creación ya tenía filtros. Cuando fallaba la asociación había una ruta a state.matches[0]; eso permitía introducir el campo y los datos de otro partido. También había horarios, campos y una semana fija de entrenamientos como valores alternativos.

La cola tiene un ID estable por tienda/registro. Mientras una subida esperaba, otro guardado podía sustituir su entrada. La confirmación borraba por ID, eliminando también la versión nueva. Se confirma ahora el contenido exacto en una transacción activa y en la base de origen; flush se comparte para evitar subidas simultáneas. La reparación de faltantes no pisa una entrada ya pendiente. Los tombstones remotos se pasan al reconciliador.

## Pruebas de navegador realizadas
Chrome, código de esta rama, origen local separado y cliente remoto ficticio. Ninguna escritura ni conexión a Supabase real. Convocatoria explícita: Campo Real, mapa propio, 19:00/18:15, jugadores y descansos correctos; cambiar a otro partido mostró Campo Nuevo y 10:45. Mensaje privado excluido no incluyó campo, mapa u horas. La fixture inicial usó un motivo no canónico; los tests posteriores usan injured, valor real del modelo.

Fixture reproducible: tests/fixtures/whatsapp-sync-indexeddb.html, servida en un origen de prueba. Usa IndexedDB real y nube simulada. Se verificaron: visibilidad local con red bloqueada; conservación de segunda edición al confirmar primera; subida posterior; descarga a otra base independiente; edición inversa conservando completed; reapertura conservando completed. Seis resultados correctos visibles en navegador.

## Autenticación y límites pendientes
La consola del navegador real había mostrado «Inicia sesión para sincronizar esta cuenta» durante el inicio de Realtime, además de un mensaje genérico de conexión. No demuestra una simple lentitud de red. La función pin-login desplegada verifica ownerPinHash; no verifica el PIN legado del delegado. Estas correcciones no cambian ese contrato de autenticación ni afirman resolver por sí solas ese caso. No se ha validado un móvil físico ni una sincronización real bidireccional con datos de usuario. No declarar cerrado ese punto con tests de fixtures.

## Validación automatizada
773 tests correctos y comprobación de sintaxis correcta. Versión conjunta: 20261008-whatsapp-context-1. Incluye pruebas de IDs, filtros, horario cruzando medianoche, contenido grupal/privado, entrenamiento y tombstones.

## Comprobación real de mañana (solo lectura)
Supabase conserva el partido del 09/10/2026 contra UD. Jinámar, campo E.M. Jinámar Pedro Miranda y fecha 2026-10-09T19:00. Su convocatoria apunta al ID de ese partido, tiene 14 availableIds y completed:false; no tiene campo ni hora duplicados propios. Por ello el comunicador debe resolver el partido vinculado, extraer 19:00 de date y calcular 18:15. Se añadió prueba de ese formato con jugadores ficticios; no se copiaron fichas ni teléfonos reales a los tests. Ningún registro fue modificado.
