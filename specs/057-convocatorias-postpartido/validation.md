# Validación · 21/10/2026

- npm run check y npm test correctos: 855/855. Quince pruebas comportamentales de selección/relaciones/historial y una de WhatsApp; pruebas nuevas de selección/relaciones históricas, más expectativas antiguas actualizadas a la petición actual.
- App completa (browser-postmatch-callup.mjs) con estilos reales y datos demo aislados, a 1440/390: partidos de ayer finished/closed/completed/closedAt y planned disponibles; cancelar conserva todo; crear exactamente ocho sin rotación, editar una convocatoria histórica de catorce sin duplicar y con campos extra intactos; acceso desde detalle cierra modal. Un partido del mismo rival/día no toma convocatoria vinculada al otro. Conserva baja histórica de jugador que ya no está en plantilla, incluida nota/campos extra.
- Después de crear: editor canónico muestra ocho jugadores y ambos porteros; guarda/reabre goles, asistencia/tipo, minutos y puntuaciones. Match conserva datos extra/cierre, preparación y live de otro partido idénticos; delegado no obtiene nuevos accesos, incluido botón falsificado.
- IndexedDB de UUID ficticios con nube simulada: browser-session-delete-guard.mjs extendido con putBatch a 1440/390 bloquea cambio de cuenta al preparar conexión, base realmente abierta distinta, PIN/rol antes de transacción; ambas bases/colas intactas. Regresión put/remove y cola local conservadas.
- Sin escrituras remotas reales, seeds, migraciones ni cambios a planes, colores, datos o permisos reales. No afirma validación de móvil físico ni autenticación remota real. PWA versionada 20261021-postmatch-callups-1, manteniendo recursos anteriores requeridos para uso offline.

Pendiente registrar resultado de CI y despliegue.

Repaso posterior al primer despliegue: mapear también el motivo genérico «No convocado» en historial clásico y selector privado de WhatsApp. No debe aparecer una clave técnica ni proponerse rotación si no se registró causa. Misma SDD057, sin cambios deportivos. Versión final 20261021-postmatch-callups-2 validada otra vez a 1440/390: historial sin claves internas, resto del flujo correcto.
