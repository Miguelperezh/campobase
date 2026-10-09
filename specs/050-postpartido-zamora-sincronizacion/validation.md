# Validación SDD050
- Consulta de lectura: los partidos de Liga 1–15 y 6–2 no tienen keeperGoalsAgainst. No se modificó ninguna fila real.
- Zamora original asignaba goalsAgainst completo a cada portero en domain y estadísticas extendidas. Se comprueba pendiente sin inventar reparto y asignación explícita 8+7=15, no 30; scope Liga excluye amistosos.
- Se detectan y retiran dos interceptores antiguos: apertura de plantilla-stats-sync y submit de player-data-sync. Un solo formulario conserva comentarios y deltas, e incluye goles, asistentes, tipo, marcador y porteros.
- Navegador aislado a 1440/390: abrir formulario real, editar penalti/asistente, asignar 8+7, guardar, recibir en segundo IndexedDB, editar allí a 9+6 y recibir de vuelta. Conserva plan/campo salvo edición explícita. Red caída guarda local y anuncia pendiente. Decoradores ajenos de sesiones se aíslan solo en este fixture mínimo; módulos de partidos/Plantilla/DB reales activos.
- App completa: browser-v19-smoke pasa en demo escritorio/móvil, consola sin errores del recorrido; preparación persistente, navegación, sesión y +Ejercicio.
- Reanudar desde segundo plano dispara reconciliación sin esperar un intervalo suspendido; runner deja render a refresh/renderOrDefer. La nube real registra lecturas móviles de partidos 200 y publicación Realtime de las cinco tablas. Esto no demuestra el resultado visual en el móvil físico del usuario.
- Tests: 813/813 correctos; npm run check y git diff --check correctos. Publicación pendiente.
