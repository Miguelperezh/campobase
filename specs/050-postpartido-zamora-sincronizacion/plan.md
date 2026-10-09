# Plan
Helper puro compartido para atribución de goles a porteros. Prioridad al reparto explícito; incidentes con portero conocido y portero único como evidencia. Dos porteros sin desglose quedan pendientes. Editor aditivo con eventos conservados por ID y controles de marcador. Regenerar estadísticas del partido sin tocar perfiles/planes/colores.
Sincronización: reconciliación al recuperar visibilidad/foco, sin repintado forzado; confirmación honesta de cola pendiente. Prueba de dos IndexedDB y nube aislada más lectura remota, sin escrituras deportivas reales. Publicar código y docs tras pruebas.

Hallazgo: existen dos interceptores de editor/submit que impedían que el formulario nuevo atendiera la acción. Retirar solo esas rutas, conservando sincronización transversal y deltas de fichas.
