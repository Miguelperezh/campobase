# Validación SDD050
- Consulta de lectura: los partidos de Liga 1–15 y 6–2 no tienen keeperGoalsAgainst. No se modificó ninguna fila real.
- Zamora original asignaba goalsAgainst completo a cada portero en domain y estadísticas extendidas. Se comprueba pendiente sin inventar reparto y asignación explícita 8+7=15, no 30; scope Liga excluye amistosos.
- Se detectan y retiran dos interceptores antiguos: apertura de plantilla-stats-sync y submit de player-data-sync. Un solo formulario conserva comentarios y deltas, e incluye goles, asistentes, tipo, marcador y porteros.
- Navegador aislado a 1440/390: abrir formulario real, editar penalti/asistente, asignar 8+7, guardar, recibir en segundo IndexedDB, editar allí a 9+6 y recibir de vuelta. Conserva plan/campo salvo edición explícita. Red caída guarda local y anuncia pendiente. Decoradores ajenos de sesiones se aíslan solo en este fixture mínimo; módulos de partidos/Plantilla/DB reales activos.
- App completa: browser-v19-smoke pasa en demo escritorio/móvil, consola sin errores del recorrido; preparación persistente, navegación, sesión y +Ejercicio.
- Reanudar desde segundo plano dispara reconciliación sin esperar un intervalo suspendido; runner deja render a refresh/renderOrDefer. La nube real registra lecturas móviles de partidos 200 y publicación Realtime de las cinco tablas. Esto no demuestra el resultado visual en el móvil físico del usuario.
- Tests: 813/813 correctos; npm run check y git diff --check correctos. Publicado y verificado.

La repetición final detectó una carrera real: putBatch durante una subida mantiene la edición nueva en cola pero no iniciaba continuación; el guardado quedaba pendiente hasta el polling. queueCloudUpload agrupa solicitudes y continúa hasta tres ciclos si llegó otro lote durante el envío. syncFromCloud espera esa continuación antes de anunciar pendientes. La confirmación de cola vacía se volvió a comprobar a ambos anchos.

## Publicación verificada · 10/10/2026
PR134: https://github.com/Miguelperezh/campobase/pull/134
Head probado: 04d02160331bf9833210f4911d93463f89b54443. Merge main: 7a986890092ca7d60bf2eba79832a50c9a278747.
CI push 38002150977 y PR 38002154091 correctos; main 38002317452 y despliegue 38002317450 correctos.
Producción https://miguelperezh.github.io/campobase/ sirve build 20261009-postgame-sync-1. SHA256 de 14 archivos (index, SW y módulos afectados) idéntico a main tras terminar despliegue. La consulta anterior a finalizar recibió 404 para módulos nuevos; se repitió tras finalización y todos coincidieron.
Última repetición: 813/813 tests, sintaxis y diff correctos. Navegador a 1440/390 incluye edición en vuelo bloqueada: llega segunda edición, cola queda vacía, ida/vuelta conserva plan y red caída conserva borrador/estado pendiente. No hubo escrituras deportivas/colores reales ni cambios de PIN/permisos. Móvil físico del usuario sigue pendiente de comprobar con un cambio concreto.
