# Manual de Agente — CampoBase (`agente.md`)

Este documento reúne toda la información técnica, arquitectónica y operativa sobre CampoBase: qué se ha hecho, dónde está cada archivo en el proyecto y cómo debe funcionar la aplicación para mantenerla rápida, estable y alineada con las necesidades de los entrenadores.

---

## 1. Resumen de Mejoras Recientes (v20 — v23)

### 1.1 Rendimiento Inmediato y Eliminación de Lentitud al Entrar y Poner PIN (v20)
- **Causa anterior:** Al arrancar o introducir el PIN se encadenaban múltiples llamadas bloqueantes a la nube (Supabase), recargas forzadas (`location.reload()`) y sincronizaciones redundantes que congelaban el hilo de JavaScript y la respuesta de la pantalla táctil.
- **Solución implementada:**
  - **Local-First estricto:** La aplicación carga inmediatamente desde IndexedDB (`js/db.js`). La pantalla se renderiza en milisegundos sin esperar a la red.
  - La sincronización con Supabase se despacha en segundo plano (*non-blocking*) sin bloquear la interfaz ni los botones.
  - Se eliminaron recargas innecesarias de página y bucles en la validación del PIN (`js/saas-auth-ui-v2.js` y `js/supabase-client.js`).
  - Los clics en pestañas, píldoras y botones reaccionan de inmediato (< 50ms).

### 1.2 Goles en Propia Puerta («Gol P.P.») (v21)
- **Causa anterior:** Al registrar o editar incidencias de partido (en vivo o desde el Calendario), el sistema obligaba siempre a seleccionar un jugador de la plantilla. Si el gol era en propia puerta del rival o autogol fortuito, obligaba a asignar a un jugador indebido.
- **Solución implementada:**
  - Se introdujo la opción canónica **«Gol P.P.»** (identificador `__pp__`).
  - Permite sumar el gol al marcador del partido sin obligar a seleccionar un jugador de la plantilla y sin alterar las estadísticas individuales de ningún jugador.
  - En la lista de incidencias y tarjetas se visualiza claramente como **«Gol P.P.»**.

### 1.3 Marcador Actualizado en Tiempo Real en Calendario (v21)
- **Causa anterior:** Al añadir o corregir goles desde el editor de incidencias del partido en el Calendario, el marcador de la tarjeta del partido no se actualizaba en pantalla hasta que se recargaba toda la web.
- **Solución implementada:**
  - El recuento de `goalsFor` y `goalsAgainst` se actualiza de forma atómica en IndexedDB y se propaga inmediatamente al DOM de la tarjeta en `js/match-calendar-sync.js` y `js/completed-events-ui.js`.

### 1.4 Guardado y Sincronización de Minutos y Puntuaciones con la Ficha de Jugador (v21)
- **Causa anterior:** El botón «Guardar y sincronizar» en la pantalla de minutos y puntuaciones sufría retrasos o bloqueos, y las puntuaciones no se reflejaban de inmediato en la ficha del jugador dentro de la pestaña Plantilla.
- **Solución implementada:**
  - Delegación de eventos directa y segura para el botón de guardado en `js/app.js`.
  - Los minutos y valoraciones se guardan inmediatamente en el partido (`matches`) y se recalculan las estadísticas individuales en `players` a través de `js/plantilla-stats-sync.js`.
  - Se muestra notificación toast inmediata: *«Minutos y puntuaciones guardados y sincronizados con la ficha del jugador»*.
  - Las medias y estadísticas de la ficha de Plantilla se actualizan en el acto sin necesidad de recargar la aplicación.

### 1.5 Orden de Partidos Jugados en Calendario: Último Jugado Arriba (v22)
- **Causa anterior:** Al desplegar el acordeón de «Partidos jugados» en Calendario, los partidos se mostraban en orden ascendente (el más antiguo arriba), obligando al entrenador a desplazarse hasta el final para consultar el resultado más reciente.
- **Solución implementada:**
  - En `js/match-calendar-sync.js` (`partitionAndSortMatches`) los partidos jugados se ordenan en orden **descendente por fecha** (`b.date` antes que `a.date`). El último partido jugado aparece en la parte superior del acordeón.
  - En `js/completed-events-ui.js` (`groupPlayedMatchesFallback`) se aplica idéntica ordenación descendente.
  - Los partidos próximos (*upcoming*) se mantienen ordenados cronológicamente de más cercano a más lejano (el siguiente partido a jugar queda siempre arriba).

### 1.6 Guardado de Sesiones de Entrenamiento y Planificación Flexible (v23)
- **Causa anterior:**
  - No permitía guardar sesiones sin ejercicios (el botón aparecía deshabilitado y el dominio arrojaba una excepción), impidiendo guardar con antelación la fecha, hora y campo para enviar las convocatorias a los padres por WhatsApp.
  - Si se excedía el tiempo objetivo o se editaban tiempos, ciertas condiciones de validación o excepciones en listeners bloqueaban el guardado.
  - En `js/session-reorder-ui.js`, al añadir 2 o más ejercicios, un fallo en `insertBefore` provocaba un bucle de excepciones continuas en el MutationObserver.
- **Solución implementada:**
  - **Guardado sin ejercicios permitido:** Se puede guardar una sesión solo con fecha, hora, campo y observaciones. Se muestra el estado de tiempo restante y la sesión queda lista para añadirle ejercicios más tarde o enviar el mensaje a las familias.
  - **Avisos sin bloqueo:** Se conservan todos los avisos de minutos faltantes o sobrantes («Sobran X min» o «Quedan X min») sin impedir que el entrenador guarde la sesión.
  - **Edición libre de duraciones:** Permite ajustar tanto el tiempo total de la sesión como la duración individual de cada ejercicio (de 1 a 240 minutos).
  - Se corrigió `js/session-reorder-ui.js` para insertar las ayudas en el contenedor correcto sin provocar errores de DOM.
  - El formulario cuenta con `novalidate` y respaldo de envío en las acciones superiores para garantizar que el botón «Guardar» responda siempre al instante.

### 1.7 Actualización Automática Sin Botón «Actualizar» y Planificación Semanal WhatsApp para la Próxima Semana (v24)
- **Actualización reactiva automática sin botón «Actualizar»:**
  - Se eliminó `document.querySelector('details[open]')` de `isUserInteracting()` en `js/app.js`: las etiquetas `<details open>` estáticas en plantillas (diagramas, bitácora de partido, guías tácticas) provocaban que `isUserInteracting()` devolviera siempre `true`, impidiendo que `refresh()` ejecutara `renderAll()`.
  - `refresh()` admite ahora parámetro de fuerza (`arguments[0] === true`) para repintar garantizado tras operaciones de guardado y eliminación, despachando el evento `campobase:data-updated`.
  - Todas las operaciones de guardado y borrado (jugadores, estadísticas, convocatorias, partidos, entrenamientos, sesiones, ejercicios y tácticas) ejecutan `await refresh(true)` y repintan sus vistas de forma instantánea y automática sin requerir pulsar «Actualizar».
  - Se preserva el estado desplegado (`open`) de las fichas de rendimiento y estadísticas de jugadores en Plantilla para evitar colapsos visuales molestos.
- **Planificación semanal por WhatsApp orientada a la próxima semana:**
  - Cuando el entrenador abre el diálogo de WhatsApp en fin de semana (sábado o domingo), el sistema detecta mediante `isWeekend()` que se va a enviar la planificación de la siguiente semana y selecciona automáticamente el rango de lunes a domingo siguiente (ej. del 21 al 27 de septiembre).
  - Se omiten los entrenamientos de días pasados de la semana que termina (ej. 14 y 17 de septiembre).
  - Se añade un selector de semana (`#wa-week-select`) dentro de la interfaz de WhatsApp para permitir al entrenador conmutar libremente entre la «Próxima semana» y «Esta semana».
  - Se enlazan y muestran correctamente las sesiones y el partido oficial del fin de semana dentro del mensaje generado.

---

## 2. Mapa de Archivos: Dónde está Todo

| Archivo / Ruta | Responsabilidad Principal |
|---|---|
| `index.html` | Estructura base de la SPA/PWA, enlaces a hojas de estilo, modales HTML, navegación principal y registro inicial del Service Worker con cache-busting. |
| `sw.js` | Service Worker PWA. Control de caché offline (`CACHE_NAME`), estrategias de red stale-while-revalidate y sincronización sin conexión. |
| `styles-redesign.css` | Hoja de estilos global, temas de color, diseño responsivo adaptado a móvil y ordenador, tipografías e indicadores visuales. |
| `js/app.js` | Controlador central de la aplicación. Gestión del enrutador de vistas (Hoy, Plantilla, Calendario, Ejercicios, Sesiones, Tácticas, Ajustes), delegación global de eventos (`wireEvents`), listeners directos en subpestañas y modales. |
| `js/db.js` | Capa de persistencia local-first mediante IndexedDB (`campobase_db`). Tiendas de datos: `players`, `matches`, `trainings`, `sessions`, `exercises`, `tactics`, `settings`, `syncQueue`. |
| `js/domain.js` | Lógica pura de negocio de fútbol: cálculo de convocatorias, minutos jugados, valoraciones medias, estados de partido (planeado, preparado, en juego, finalizado) y cálculo de estadísticas. |
| `js/match-calendar-sync.js` | Lógica de la vista de Calendario: partición de partidos (próximos arriba, jugados abajo con el más reciente arriba), incidencias (goles, tarjetas, lesiones, cambios), y cálculo de marcadores. |
| `js/completed-events-ui.js` | Renderizado y agrupación de partidos jugados y entrenamientos completados en acordeones plegables. |
| `js/match-postgame-editor.js` | Modal y formulario de edición post-partido para corrección de minutos jugados y puntuaciones (1 a 10) de los jugadores. |
| `js/plantilla-stats-sync.js` | Sincronización bidireccional entre los datos de partidos y las fichas de los jugadores (minutos totales, goles, tarjetas, media de valoraciones). |
| `js/supabase-client.js` | Cliente Supabase. Sincronización en segundo plano con la nube, recuperación de sesión por PIN o SaaS, y enlace de cuenta de equipo sin bloqueos. |
| `js/sync-core.js` | Cola de sincronización (`syncQueue`) para almacenar mutaciones locales cuando no hay cobertura y enviarlas al servidor al restablecer conexión. |
| `js/saas-auth-ui-v2.js` | Diálogo de login y entrada de PIN con teclado numérico en pantalla, validación local inmediata y respaldo en Supabase. |
| `js/whatsapp-suite.js` | Generador de mensajes inteligentes de WhatsApp para convocatorias individuales, de grupo, entrenamientos semanales y avisos de partido. |
| `js/tactic-board-controller.js` | Pizarra táctica interactiva con animaciones, jugadores arrastrables, balón, líneas tácticas y diferentes formaciones F7/F11. |
| `js/session-planner-ui.js` | Planificador visual de entrenamientos por bloques temporales (calentamiento, parte principal, juego final). |
| `tests/` | Suite automatizada de pruebas con Node.js runner nativo (`npm test`). Verifica sincronización, caché, UI, formatos, tácticas y persistencia. |

---

## 3. Arquitectura y Cómo Debe Funcionar

### 3.1 Principio Local-First
1. **La base de datos local (IndexedDB) es la verdad inmediata.** La app nunca debe mostrar una pantalla en blanco esperando una respuesta HTTP de Supabase.
2. Al pulsar «Guardar», «Añadir» o cambiar un valor:
   - Se guarda de inmediato en IndexedDB.
   - Se actualiza el elemento visual en el DOM.
   - Se encola la operación en `syncQueue` para enviarse a Supabase en segundo plano sin interrumpir al usuario.
3. Si el usuario pierde conexión a internet o viaja a un campo sin cobertura, CampoBase sigue funcionando al 100%.

### 3.2 Navegación y Eventos en Pantallas Táctiles y Móviles
1. Para evitar botones "muertos" causados por renderizados dinámicos, la aplicación utiliza **delegación de eventos con `.closest()`** en el contenedor raíz o listeners directos acotados.
2. Nunca se deben usar llamadas destructivas como `stopImmediatePropagation()` sobre selectores genéricos.
3. Al consultar múltiples elementos del DOM, usar siempre `$$()` (`querySelectorAll`) y nunca iterar con `.forEach()` sobre el resultado de `$()` (`querySelector`).

### 3.3 Calendario y Gestión de Partidos
1. **Partidos Próximos:**
   - Se muestran al inicio de la pestaña Calendario.
   - Orden: Cronológico ascendente por fecha (el partido más cercano a disputarse aparece arriba).
2. **Partidos Jugados:**
   - Se agrupan bajo el desplegable / acordeón «Partidos jugados».
   - Orden: **Cronológico descendente por fecha** (el último partido que se ha jugado aparece en la punta superior nada más abrir el acordeón).
3. **Edición de Incidencias y Marcador:**
   - Cada gol registrado (de jugador o «Gol P.P.») actualiza al instante el marcador visible en la tarjeta del partido.
4. **Puntuaciones y Minutos:**
   - Al pulsar «Guardar y sincronizar», los minutos jugados y la nota del partido impactan de inmediato en la ficha individual del jugador en Plantilla (calculando su nueva media de temporada).

### 3.4 Actualizaciones PWA y Service Worker
- Las versiones de caché se gestionan en `sw.js` mediante la variable global de build (`20260920-prod-current-v24`).
- Para forzar la actualización en los teléfonos de los entrenadores:
  - Se incrementa la versión en `sw.js`, `index.html`, `js/app.js` y `js/supabase-client.js`.
  - El Service Worker detecta la nueva versión, la descarga en segundo plano y avisa o activa la versión nueva en la siguiente visita sin desloguear ni borrar datos locales.

---

## 4. Guía de Buenas Prácticas para Futuros Agentes
- **No borrar datos existentes:** Nunca reiniciar tablas ni modificar identificadores de jugadores o partidos existentes en producción.
- **Mantener los tests pasando:** Antes de dar por terminado un cambio, ejecutar siempre:
  ```bash
  npm run check && npm test
  ```
  Todos los 458+ tests deben pasar en verde sin errores.
- **Acumular en `AGENTS.md`:** No sustituir ni reordenar las secciones históricas de `AGENTS.md`. Añadir siempre una nueva sección explicativa al final del archivo.
- **Verificar en navegador real:** Validar siempre visualmente o mediante scripts automatizados que los botones responden, los modales abren/cierran y los datos persisten tras recargar.
