# Validación 18/10/2026

- `npm run check`, `git diff --check` y 829/829 pruebas correctas.
- Helper probado con 14 convocados/reentradas, suplentes de 0 minutos, F11/25 convocados/80 minutos, plan ajeno/incompleto/ventanas inválidas/convocatoria cambiada y fuente inmutable. Repetición idempotente, movimientos sin sustituciones ficticias y suma de 490 minutos de equipo en F7/70.
- Dos porteros convocados sin minutos previos aparecen en formulario. Reparto 8+7 conserva 15; desconocido pendiente, sin atribuir el total a uno por omitir al suplente ni duplicarlo en Zamora.
- `tests/browser-postgame-plan.mjs`: nube simulada e IndexedDB separados, 1440/390; abrir/cargar sin escrituras, guardar, repetir sin duplicados, conservar preparación/puntuación/goles/asistencia/tipo, conflicto de plan y cambio de cuenta, cierre solo de su live y conservación de otro partido.
- App completa en demo aislada a 1440/390: acción real de Calendario, carga explícita de 14 convocados, registro sin cronómetro, desaparición del vivo del entrenador/delegado; marcar desde Calendario, desmarcar convocatoria, gol/minutos de directo sin cierre automático y marca completed sin status finished. Cero errores de página. Acciones abiertas siguen abiertas al repintar.
- `tests/browser-postgame-goals.mjs`: flujo anterior de goles/asistencias/penaltis/porteros, ida/vuelta entre dos IndexedDB, cola concurrente y red caída correctos a 1440/390. Service workers desactivados en contexto de prueba.
- Prueba general `browser-v19-smoke.mjs` correcta: subpestañas, preparación persistente, sesiones y ejercicio. En local se usó servidor silencioso con cola amplia por bloqueo del servidor HTTP de pruebas anterior; misma lógica de prueba, Chrome real.
- Capturas del formulario revisadas en 1440/390: secciones heredan superficie/texto del diálogo para evitar fondo de tarjeta global oscuro con texto oscuro. Cambia solo la presentación del formulario, sin reescribir tema o preferencias.
- Comparación literal con main: sin cambios en impresión/PDF, editor del plan, match-moments, editor de colores, estilos globales, DB ni sync-core. Sin escrituras en datos reales, seeds, migraciones, permisos o PIN. No se ha probado móvil físico ni escrito un partido real.
- Build preparado: `20261018-offline-match-1`. Publicación pendiente de revisión automática y comprobación del recurso público.
