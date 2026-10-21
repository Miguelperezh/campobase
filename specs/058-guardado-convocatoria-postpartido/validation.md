# Validación — 21/10/2026

- `npm run check` correcto y `npm test`: 868/868. Resolución inversa legacy/ambigua, IDs equivalentes, marcador desconocido frente a cero explícito, asignaciones individuales, no mutación y presentación pendiente.
- `browser-save-postmatch.mjs`, app completa con estilos reales, 1440/390: editar desde tarjeta con vínculo por ID antiguo, fecha/rival único, callupId e ID numérico. Selector conserva partido y guarda con botón real. Ordenador reproduce buscador «Valsequi» → detalle → convocatoria; móvil usa acceso del calendario (buscador global oculto por diseño). Catorce convocados exactos; guardado y reentrada de minutos, puntuación y comentarios sin marcador; goleadores y ambos porteros con totales pendientes conservados. Error nativo de minutos y error deportivo de marcador visibles/enfocados, borrador intacto y corrección posterior guarda. Preparación, campo, extras y directo de otro partido intactos.
- `browser-postgame-save-guard.mjs`, 1440/390: dos IndexedDB con UUID ficticios; retener lecturas/lote, cerrar A y abrir B no mezcla borradores ni cierra B. Cambio de cuenta/PIN/rol rechaza lote; ambas bases y colas exactas. Control válido sí guarda. El wrapper retiene antes de la llamada real a putBatch; carreras internas de DB están cubiertas además por la prueba previa de guardias de lote. Sin solicitudes externas ni errores JS.
- `browser-postgame-goals.mjs`, 1440/390: editor, asistencias/tipo, dos porteros, sincronización de ida y vuelta entre dos bases con nube simulada y cola pendiente si falla la red. Sin cambios al plan/campo salvo edición explícita del escenario.
- `browser-postgame-plan.mjs`: fixture y app completa, 1440/390. Plan cargado explícitamente, guardado repetido, conflicto visible, cambio de cuenta, cierre solo del directo correspondiente y datos conservados.
- `browser-postmatch-callup.mjs`: regresión del flujo histórico, 1440/390, selección exacta, edición sin duplicados, datos extra conservados y delegado sin nuevos accesos.

Datos ficticios aislados. No se ha probado un móvil físico ni escrito en cuentas reales. Ninguna semilla, migración, limpieza de almacenamiento o cambio de colores/permisos. Versión PWA `20261021-save-postmatch-1` con recursos nuevos y anteriores necesarios para uso offline.

Publicación y comparación de archivos públicos: pendientes de completar tras CI.
