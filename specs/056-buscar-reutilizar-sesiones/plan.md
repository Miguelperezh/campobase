# Plan

Helpers puros en training-session-tools.js: normalización de búsqueda y preparación de borrador independiente. app.js integra barra estable fuera de la lista (mantiene foco), filtra antes de agrupar y usa el guardado existente para crear. El detalle tiene dos renderizadores: añadir el acceso en ambos. No modificar lógica de partidos, ejercicios, impresión ni autenticación. Guardias locales de rol/cuenta al abrir copia.

Pruebas unitarias de datos/filtros/independencia/casos históricos; navegador con app completa demo, anchos ordenador/móvil, búsqueda/filtro/limpieza, cancelar/guardar copia, original/asistencia/biblioteca/colores intactos y controles de permisos. Sintaxis y suite completa antes de publicar. Versionar recursos PWA y verificar producción.

El contexto efímero de la copia se comprueba también al guardar y dentro de put antes de su transacción. La nueva copia se confirma localmente sin esperar nube; opciones retrocompatibles dejan igual el resto de llamadas. Guardado simultáneo protegido. Las pruebas browser de sesiones se pueden repetir mediante browser-sessions.mjs y servidor local aislado; CI existente se conserva.
