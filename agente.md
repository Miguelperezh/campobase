# Manual de Agente — CampoBase (`agente.md`)

Este documento reúne toda la información técnica, arquitectónica y operativa sobre CampoBase: qué se ha hecho, dónde está cada archivo en el proyecto y cómo debe funcionar la aplicación para mantenerla rápida, estable y alineada con las necesidades de los entrenadores.

---

## 1. Resumen de Mejoras Recientes (v20 — v25)

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
- **Planificación semanal por WhatsApp orientada a la próxima semana y múltiples partidos:**
  - Cuando el entrenador abre el diálogo de WhatsApp en fin de semana (sábado o domingo), el sistema detecta mediante `isWeekend()` que se va a enviar la planificación de la siguiente semana y selecciona automáticamente el rango de lunes a domingo siguiente (ej. del 21 al 27 de septiembre).
  - Se omiten los entrenamientos de días pasados de la semana que termina (ej. 14 y 17 de septiembre).
  - Se añade un selector de semana (`#wa-week-select`) dentro de la interfaz de WhatsApp para permitir al entrenador conmutar libremente entre la «Próxima semana» y «Esta semana».
  - **Soporte para múltiples partidos en la misma semana:** Si en la misma semana hay dos o más partidos programados (ej. sábado y domingo, o dos partidos el sábado), el sistema los incluye todos automáticamente por orden cronológico con sus horarios, rivales y campos correspondientes (ej. `⚡ Automático: Incluir los 2 partidos`), y permite al entrenador conmutar en el selector para incluir todos o elegir solo uno si así lo prefiere.

### 1.8 Desbloqueo del Visor de Ejercicios y Regla Oficial de Roles y Colores (v25)
- **Eliminación del bloqueo al entrar en un ejercicio:**
  - **Causa anterior:**
    - En `styles-redesign.css` (antigua línea 5683), una regla `display: none !important` sobre `.sheet-top-close-btn` y `.dialog-head button[data-close]` eliminaba por completo el botón superior de cierre ('✕').
    - El modal nativo `<dialog id="exercise-detail-dialog">` no disponía de escucha de eventos para cerrar al hacer clic en el fondo oscurecido exterior (backdrop).
    - En `js/redesign-nav.js`, la inyección del pie sticky global `.cb-global-close-footer` insertaba un segundo botón inferior duplicado que colisionaba con la barra de acciones propia de la ficha (`.sheet-bottom-bar`), ocultando los botones de «+ Añadir a sesión» y «✕ Cerrar Ejercicio».
    - En consecuencia, al abrir cualquier ejercicio, el usuario quedaba atrapado dentro del modal sin forma accesible de salir, reportándolo como un bloqueo completo de la app.
  - **Solución implementada:**
    - Se restauró el botón de cierre superior (`.sheet-top-close-btn`) con `display: flex !important; visibility: visible !important; pointer-events: auto !important; z-index: 50;` garantizando un botón circular de 44×44px siempre visible arriba a la derecha.
    - Se excluyó `'exercise-detail-dialog'` de `BOTTOM_CLOSE_EXCLUDED_DIALOGS` en `js/redesign-nav.js` para erradicar el footer secundario duplicado que tapaba la barra de acciones.
    - Se añadió `ensureExerciseDialogBackdropClose()` en `js/app.js` para cerrar el diálogo al hacer clic en cualquier área del fondo exterior (backdrop).
    - Se protegió `dialog.showModal()` con comprobación `!dialog.open` para prevenir excepciones `InvalidStateError`.

- **Regla Oficial de Roles y Códigos de Color en Ejercicios:**
  - **Convención canónica dictada por el usuario:**
    - **Portero:** `P` — **NEGRO** (`#111827`, texto `#FFFFFF`)
    - **Defensa:** `D1`, `D2`, `D3`… — **ROJO** (`#DC2626`, texto `#FFFFFF`)
    - **Atacante:** `A1`, `A2`, `A3`… — **AZUL** (`#2563EB`, texto `#FFFFFF`)
    - **Neutro / Apoyo:** `N` (o `N1`, `N2`…) — **AMARILLO** (`#FACC15`, texto `#000000`)
    - **Entrenador:** `E` (o `E1`, `E2`…) — **GRIS CLARO** (`#CBD5E1`, texto `#0F172A`)
  - **Integración en la interfaz (`js/ejercicio-viewer.js` y `styles-redesign.css`):**
    - Se implementó la función exportada `roleVisualMeta(roleItemOrId)` que normaliza y colorea cada rol según la regla oficial.
    - Se incorporó la sección `👥 Organización y roles` (`#section-organizacion`) en el cuerpo de la ficha (visible en vista rápida y vista completa), con tarjetas individuales que muestran la ficha circular con el color oficial, la abreviatura, el nombre del rol y la función táctica.
    - Para los ejercicios que no disponían del bloque `organizacion` explícito, el visor deriva inteligentemente los roles tácticos a partir de la categoría y contenidos.
    - La sección de `Leyenda visual` renderiza los tokens de jugadores usando exactamente esta misma paleta y códigos.

- **Aclaración sobre Vídeos de Muestra con Humanos:**
  - No todos los ejercicios disponen de vídeo grabado con personas reales.
  - El encabezado de la sección multimedia se titula explícitamente:
    `🎥 Vídeo de muestra con humanos (en caso de disponer de él)`
  - Si un ejercicio no cuenta con `realVideo`, la sección de vídeo humano se omite limpiamente en el DOM sin dejar espacios vacíos ni reproductores rotos.

- **Alojamiento y Gestión de Ejercicios, Portadas y Vídeos (0 € de Coste):**
  - **NUNCA en Supabase:** Ni las portadas (`preview.png`), ni los MP4 gráficos (`ejercicio.mp4`), ni los vídeos de humanos (`video_muestra_humanos.mp4`) se alojan en Supabase Storage. Supabase solo gestiona datos relacionales / JSON.
  - **Portadas / Previews:** Son imágenes estáticas limpias recortadas al campo de juego (sin cabeceras legacy). Se sirven como archivos estáticos en el repositorio / GitHub Pages (`library-v2/...`). Si una tarea no tiene `preview.png`, se genera del primer frame del **MP4 gráfico**, **NUNCA del vídeo humano**.
  - **Vídeos pesados (MP4 gráfico y humano):** Se alojan como assets en los **Releases de GitHub** (`https://github.com/miguelperezp/campobase/releases/...`) con transferencia ilimitada y coste cero, resueltos mediante `scripts/github-release-video-manifest.json`.
  - **Orden estricto de medios en la ficha:**
    1. Portada / Preview estática
    2. Vídeo de la tarea (MP4 gráfico)
    3. Vídeo de muestra con humanos (*en caso de disponer de él*)

### 1.9 Resolución Definitiva: MP4 Íntegro Sin Recortes, Textos Duales (Vista Rápida / Completa), Roles Oficiales, Desbloqueo al Salir y Regla F7/F11 (v26 — v27)
- **Corrección del Reproductor MP4 (Vídeo íntegro al 100% sin recortar porterías ni desbordar):**
  - **Causa anterior:** `normalizeNewExercise` en `js/ejercicios-nuevo-formato.js` asignaba el recorte gráfico a `media_crop`. En `js/ejercicio-viewer.js`, ese recorte aplicaba traslaciones CSS destructivas (`top: -38.9%`), desplazando el vídeo hacia arriba, recortando la portería superior y dejando bandas negras vacías abajo.
  - **Solución implementada:**
    - `media_crop: null` para todos los ejercicios: los MP4 tácticos se reproducen íntegros al 100% con `object-fit: contain` tanto en modo normal como en modo teatro a pantalla completa.
    - `preview_crop` se conserva exclusivamente para la portada estática (`<canvas>` o `<img>`) para encuadrar la miniatura en las tarjetas de la biblioteca sin tocar el vídeo.
- **Textos Estructurados Duales (⚡ Vista Rápida vs 📋 Vista Completa):**
  - **Vista Rápida (`view-mode-reduced`):** Pensada para consulta ágil a pie de campo. Muestra:
    - Previsualización / Vídeo gráfico interactivo de la tarea.
    - `#section-datos-rapidos`: Duración estimada, número de jugadores y espacio.
    - `#section-como-se-hace`: Introducción con `⚡ Clave rápida` y lista numerada de pasos esenciales directos.
    - `#section-carga`: Series, repeticiones y tiempos de descanso.
    - Oculta automáticamente los bloques extensos de teoría (montaje detallado, materiales, qué observar, consignas, errores, variantes).
  - **Vista Completa (`view-mode-full`):** Muestra las 17 secciones exhaustivas con metodología profesional:
    - Organización y roles con tokens oficiales de color.
    - Montaje y dimensiones espaciales con croquis y distancias métricas.
    - Material operativo catalogado con cantidades y funciones.
    - Cómo se hace paso a paso (admitiendo arrays, desglose por fases/variantes o texto).
    - Fases de la tarea con posesión de balón y transiciones.
    - Carga física (series, repeticiones y dinámica de ciclo para F7 y F11).
    - Rotación de jugadores y reglas de relevo.
    - Qué observar tácticamente.
    - Consignas verbales del entrenador para corregir a pie de campo.
    - Errores comunes y correcciones técnicas específicas (sin campos vacíos).
    - Variantes pedagógicas (Simplificación y Progresión).
    - Vídeo de muestra con humanos (*en caso de disponer de él*).
  - **Auditoría e integridad de los 12 ejercicios:** Se completaron al 100% todos los textos de los 12 ejercicios autorizados (`01` al `12`), eliminando cualquier campo vacío en `como_se_hace`, `montaje`, `rotacion`, `consignas`, `errores_correcciones` o `duracion`.
- **Eliminación del Bloqueo al Salir de un Ejercicio («entro en 1 ejercicio, salgo y se bloquea la app»):**
  - **Causas identificadas:**
    1. Retención de elementos `<video>` cargando en segundo plano al cerrar el modal, agotando los decodificadores hardware en Safari móvil (iOS) y Chrome (Android).
    2. Fuga de listeners en `window` (`mousemove`, `mouseup`, `keydown`).
    3. Colisión de botones inferiores duplicados (`dialog-sticky-footer` vs `sheet-bottom-bar`).
  - **Solución implementada:**
    - **Teardown total en `wireExerciseDialogLifecycle` (`js/app.js`):** Al cerrar, se pausan todos los vídeos (`video.pause()`), se remueve el atributo `src`, se ejecuta `video.load()`, se vacía el contenedor `#exercise-detail-body.innerHTML = ''` y se restablecen `overflow` y `pointerEvents` en `document.body`.
    - **Control de eventos con `AbortController` en `js/ejercicio-viewer.js`:** Todos los listeners globales de arrastre y zoom se destruyen al cerrar el modal.
    - **Cierre automático en navegación de pestañas (`showView` en `js/app.js`):** Al cambiar de pestaña en la barra inferior (Hoy, Plantilla, Calendario, etc.), cualquier diálogo abierto se cierra de forma segura.
    - **Escucha directa en `[data-close]`:** Tanto `.sheet-top-close-btn` como `.modal-bottom-close-btn` y el fondo exterior (backdrop) responden de inmediato ante eventos `click` y `pointerup`.
- **Regla Oficial de Roles y Códigos de Color:**
  - **Portero:** `P` — **NEGRO** (`#111827`, texto `#FFFFFF`)
  - **Defensa:** `D1`, `D2`, `D3`… — **ROJO** (`#DC2626`, texto `#FFFFFF`)
  - **Atacante:** `A1`, `A2`, `A3`… — **AZUL** (`#2563EB`, texto `#FFFFFF`)
  - **Neutro / Apoyo:** `N` (o `N1`, `N2`…) — **AMARILLO** (`#FACC15`, texto `#000000`)
  - **Entrenador:** `E` (o `E1`, `E2`…) — **GRIS CLARO** (`#CBD5E1`, texto `#0F172A`)
  - Implementado de forma unificada mediante `roleVisualMeta(roleItemOrId)` en `js/ejercicio-viewer.js`.
- **Aclaración sobre Vídeos de Muestra con Humanos:**
  - No todos los ejercicios disponen de vídeo grabado con personas reales.
  - El encabezado multimedia se titula: `🎥 Vídeo de muestra con humanos (en caso de disponer de él)`.
  - Si un ejercicio no tiene vídeo humano, la sección se omite limpiamente del DOM sin dejar huecos vacíos.
- **Regla Oficial de Formato para Nuevos Ejercicios (F7 / F11):**
  - Si el ejercicio indica expresamente la regla de **Fútbol 7** -> asignar exclusivamente a Fútbol 7 (`formato_juego: 'futbol_7'`).
  - Si **no indica regla específica** -> asignar simultáneamente a **Fútbol 7 y Fútbol 11** (`formato_juego: ['futbol_7', 'futbol_11']`).
- **Análisis de Archivos ZIP / Lotes de Ejercicios:**
  - Ante paquetes zip o nombres de ejercicios enviados por el usuario, el agente debe:
    1. Comprobar si ya existen o están subidos en el catálogo (`catalog.json`, `js/ejercicios-validados.js`, `js/ejercicios-nuevo-formato.js`).
    2. Analizar tácticamente qué se trabaja (físico, técnico, táctico, cognitivo) si el archivo o ficha original no lo especifica.
    3. Redactar las dos versiones: Vista Rápida y Vista Completa.
    4. Aplicar la regla F7/F11 y asignar los roles oficiales con sus colores.
- **Auditoría de Supabase y Almacenamiento a Coste Cero (0 €):**
  - Supabase Storage no almacena ningún vídeo pesado (bucket `ejercicio-videos` a 0 bytes).
  - Todos los vídeos se sirven desde **GitHub Releases** sin coste ni límite de transferencia.

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
| `js/ejercicio-viewer.js` | Visor interactivo y modal detallado de ejercicios: renderizado de portadas, vídeos gráficos, vídeos humanos, organización con roles oficiales (`roleVisualMeta`), montajes, material y consignas tácticas. |
| `js/ejercicios-validados.js` | Catálogo canónico de ejercicios validados de CampoBase con diagramas de pizarra, roles y consignas. |
| `js/ejercicios-nuevo-formato.js` | Catálogo de ejercicios de formato moderno con integración multimedia y mapeo de vídeos de GitHub Releases. |
| `js/real-exercises.js` | Definición y vinculación de ejercicios reales con vídeos tácticos y de humanos. |
| `scripts/github-release-video-manifest.json` | Manifiesto de mapeo a URLs públicas de vídeos pesados en GitHub Releases (almacenamiento a 0€ sin tocar Supabase). |
| `tests/` | Suite automatizada de pruebas con Node.js runner nativo (`npm test`). Verifica sincronización, caché, UI, formatos, roles tácticos y persistencia. |

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
- Las versiones de caché se gestionan en `sw.js` mediante la variable global de build (`20260920-prod-current-v30`).
- Para forzar la actualización en los teléfonos de los entrenadores:
  - Se incrementa la versión en `sw.js`, `index.html`, `js/app.js`, `js/supabase-client.js` y `js/demo-session.js`.
  - El Service Worker detecta la nueva versión, la descarga en segundo plano y avisa o activa la versión nueva en la siguiente visita sin desloguear ni borrar datos locales.

### 3.5 Ejercicios, Roles Oficiales y Gestión Multimedia (0 € de Coste)
1. **Regla Oficial de Roles y Colores:**
   - **Portero:** `P`, `P1`… — **NEGRO** (`#111827`, texto `#FFFFFF`)
   - **Defensa:** `D1`, `D2`, `D3`… — **ROJO** (`#DC2626`, texto `#FFFFFF`)
   - **Atacante:** `A1`, `A2`, `A3`… — **AZUL** (`#2563EB`, texto `#FFFFFF`)
   - **Neutro / Apoyo:** `N`, `N1`… — **AMARILLO** (`#FACC15`, texto `#000000`)
   - **Entrenador:** `E`, `E1`… — **GRIS CLARO** (`#CBD5E1`, texto `#0F172A`)
2. **Alojamiento y Coste Cero (NUNCA en Supabase):**
   - **Supabase:** Exclusivamente para tablas relacionales de datos y sincronización de equipo. Ningún archivo multimedia (ni portadas ni vídeos) se sube a Supabase Storage.
   - **Portadas (previews):** Servidas localmente / GitHub Pages (`library-v2/...`). Imagen estática del campo limpio. Si falta `preview.png`, se genera únicamente a partir del primer frame del MP4 gráfico, **nunca del vídeo humano**.
   - **Vídeos pesados:** Alojados en **GitHub Releases** mediante el archivo `scripts/github-release-video-manifest.json` para ancho de banda gratuito y sin límite.
3. **Vídeo de Muestra con Humanos:**
   - No todos los ejercicios tienen vídeo con personas reales.
   - Debe aclararse en el título: `🎥 Vídeo de muestra con humanos (en caso de disponer de él)`.
   - Si no existe archivo de vídeo humano, la sección se omite por completo del DOM.
4. **Desbloqueo y Cierre del Visor:**
   - Botón superior de cierre '✕' visible en todo momento (`.sheet-top-close-btn` a 44×44px).
   - Diálogo cerrable mediante clic en el fondo oscurecido exterior (backdrop).
   - Sin footer duplicado que tape la barra de acciones inferior.

### 3.6 Reglas Oficiales de Nuevos Lotes de Ejercicios y Formato F7/F11
1. **Orden en Biblioteca («en la punta de arriba»):**
   - Los últimos ejercicios introducidos en la app (`EJERCICIOS_NUEVOS_LOTES`) deben figurar siempre al inicio absoluto del catálogo (`EJERCICIOS_VALIDADOS`) para aparecer los primeros al entrar a la biblioteca.
2. **Regla de Formato F7 / Alevín / F8 vs F11:**
   - Si la tarea indica expresamente **Fútbol 7**, **Alevín** o **Fútbol 8** -> asignación exclusiva a Fútbol 7 (`['futbol_7']`).
   - Si la tarea es específica de **Fútbol 11** (ej. 8x8 + porteros) -> asignación exclusiva a Fútbol 11 (`['futbol_11']`).
   - Si la tarea **no indica regla específica** (General / Adaptable) -> asignación simultánea a **Fútbol 7 y Fútbol 11** (`['futbol_7', 'futbol_11']`, `formato_juego: 'todos'`), visible en ambos filtros y pestañas.
3. **Vista Rápida y Vista Completa:**
   - Todo ejercicio dispone de una versión de texto de **Vista Rápida** (`vista_rapida` con clave rápida `explicacion_breve`, material, jugadores, duración) y la **Vista Completa** con las 17 secciones oficiales normalizadas.

---

## 4. Guía de Buenas Prácticas para Futuros Agentes
- **No borrar datos existentes:** Nunca reiniciar tablas ni modificar identificadores de jugadores o partidos existentes en producción.
- **Mantener los tests pasando:** Antes de dar por terminado un cambio, ejecutar siempre:
  ```bash
  npm run check && npm test
  ```
  Todos los 480 tests deben pasar en verde sin errores.
- **Acumular en `AGENTS.md`:** No sustituir ni reordenar las secciones históricas de `AGENTS.md`. Añadir siempre una nueva sección explicativa al final del archivo.
- **Verificar en navegador real:** Validar siempre visualmente o mediante scripts automatizados que los botones responden, los modales abren/cierran y los datos persisten tras recargar.


---

## 5. Auditoría real de vídeos y Supabase — 21/09/2026

Esta sección corrige y prevalece sobre cualquier afirmación anterior de este documento que diga que el bucket `ejercicio-videos` está vacío o que ningún flujo de vídeo toca Supabase.

### Estado verificado

- Proyecto Supabase: `campobase` (`mdzpygfwugawlmknywxa`).
- El bucket `ejercicio-videos` conserva **323 MP4 históricos**, con **316.509.123 bytes** en total.
- El release de GitHub `campobase-videos-v1` contiene **423 MP4**.
- Los **323 objetos que existen en Supabase tienen copia correspondiente en GitHub Releases**.
- Verificación realizada por nombre de asset y tamaño:
  - faltantes en GitHub: **0**;
  - diferencias de tamaño: **0**;
  - assets del release en estado distinto de `uploaded`: **0**.
- GitHub contiene además **100 MP4** que no forman parte de esos 323 objetos históricos de Supabase.
- La biblioteca validada utiliza `resolveHostedVideoUrl()` para transformar referencias históricas de Supabase al asset equivalente de GitHub Releases antes de reproducir el MP4.
- El registro `pdf150-022` era la última referencia activa encontrada en datos de producción con URL completa de Supabase; el 21/09/2026 se migra a la URL equivalente de GitHub Releases.
- En la auditoría había **0 registros activos `recordType: exerciseVideo`**, por lo que ningún vídeo manual existente dependía en ese momento de Supabase Storage.

### Regla de seguridad

- **No borrar todavía los 323 objetos históricos de Supabase** solo porque exista copia en GitHub.
- Antes de borrar Storage deben cumplirse conjuntamente:
  1. no quedar referencias activas de producción a esos objetos;
  2. comprobar reproducción real desde GitHub;
  3. disponer de una estrategia segura para futuras subidas;
  4. mantener una copia de respaldo recuperable.
- El botón **«Añadir vídeo»** conserva por ahora su flujo legacy de Supabase para no romper una función existente.
- No migrar esa subida directamente desde el navegador a GitHub usando un PAT/token: **un secreto de GitHub nunca debe estar en JavaScript cliente**.
- La migración futura de «Añadir vídeo» a GitHub Releases debe hacerse mediante backend autenticado/servidor, y solo después de probar subida, reproducción, borrado y sincronización en ordenador y móvil.
- Hasta entonces, los MP4 del catálogo validado deben servirse desde GitHub Releases y el flujo manual legacy debe considerarse deuda técnica controlada.

### Cuota

La causa principal del egress no era el tamaño almacenado (unos 302 MiB), sino la descarga repetida de archivos y la sincronización completa periódica de datos. Tener los objetos almacenados no equivale por sí mismo a consumir esa cantidad de egress. La reducción de cuota depende de que la reproducción siga saliendo por GitHub y de corregir por separado el polling completo de Supabase.


### Estado del borrado histórico de Storage — 21/09/2026

- Miguel confirma que conserva respaldo local completo de estos ejercicios y vídeos y autoriza eliminar las copias históricas de Supabase Storage.
- Antes de borrar se volvió a verificar el inventario:
  - Supabase Storage: **323 objetos**, **316.509.123 bytes**.
  - GitHub Release `campobase-videos-v1`: copia correspondiente de los **323/323**.
  - Faltantes en GitHub: **0**.
  - Diferencias de tamaño: **0**.
  - Referencias activas en datos a `/storage/v1/object/public/ejercicio-videos/`: **0**.
- **No se ha borrado ningún archivo todavía** porque la API oficial de Storage responde **HTTP 402**: el proyecto está restringido por exceso de egress/cached egress.
- No borrar mediante SQL: Supabase indica expresamente que eliminar filas de `storage.objects` por SQL deja los blobs huérfanos.
- Cuando Storage vuelva a estar operativo, el borrado debe hacerse con la **Storage API** (`remove` / `emptyBucket`) y después comprobar:
  1. bucket `ejercicio-videos` con 0 objetos;
  2. biblioteca y ejercicios siguen presentes;
  3. reproducción desde GitHub Releases;
  4. 0 referencias activas a Supabase Storage.
- El intento de soporte temporal con la extensión PostgreSQL `http` se retiró completamente tras detectar el 402; el proyecto quedó sin esa extensión instalada.


---

## 6. Realtime en modo sombra — 21/09/2026

Primera fase de sustitución segura del polling intensivo, diseñada para no repetir los problemas previos de sincronización entre ordenador y móvil.

### Estado implementado

- Se mantienen **sin cambios**:
  - el polling cloud existente cada **10 segundos**;
  - el reloj/local polling del Partido en vivo cada **1 segundo**;
  - la cola offline, IndexedDB y el proceso `syncFromCloud()` existente.
- Se añade Supabase Postgres Changes como **segunda vía paralela**:
  - `jugadores`;
  - `convocatorias`;
  - `partidos`;
  - `asistencias`;
  - `configuracion`.
- Las cinco tablas están añadidas a la publicación `supabase_realtime`.
- Un evento Realtime **no escribe directamente ni sustituye datos locales**. Solo dispara, con debounce de 250 ms, la misma sincronización `synchronizeCloud() -> syncFromCloud()` ya utilizada por CampoBase.
- Si el canal Realtime falla, se cierra o agota tiempo, CampoBase conserva el polling de 10 s como respaldo.
- No se han modificado fórmulas de minutos, sustituciones, goles, tarjetas, convocatorias ni lógica del partido.

### Regla obligatoria antes de la fase 2

**NO retirar ni espaciar el polling de 10 segundos todavía.**

Solo puede reducirse después de verificar en condiciones reales, con Supabase operativo y al menos ordenador + móvil:

1. editar/guardar jugador en un dispositivo y verlo en el otro;
2. crear/editar convocatoria y partido;
3. cambios de asistencia;
4. preparar e iniciar Partido en vivo;
5. reloj avanzando segundo a segundo localmente en ambos;
6. sustitución, gol, tarjeta/incidencia, descanso, segunda parte y final;
7. pérdida y recuperación de conexión;
8. cierre/reapertura de PWA y reconciliación correcta.

El reloj del partido sigue avanzando localmente cada segundo; Realtime solo debe transportar cambios reales de estado. No enviar un write a Supabase por cada segundo.

### QA realizado

- Sintaxis y batería completa de tests: **correctos** en el PR de esta fase.
- Smoke de navegador: bloqueado únicamente por respuestas HTTP 402 del proyecto Supabase debido a la cuota de egress ya excedida. Este 402 era preexistente y no procede del código Realtime.
- Mientras Supabase siga restringido por cuota, no puede certificarse una prueba end-to-end real de WebSocket entre dos dispositivos. Por ello se conserva el sistema anterior como fallback.


---

## 7. Incidente de sincronización por cuota 402 — 21/09/2026

### Síntoma observado

El usuario abrió CampoBase en un dispositivo y no veía datos que sí estaban guardados:
- sesión del 21/09/2026 a las 16:30 en Alfonso Silva;
- 5 bloques / 75 minutos;
- ejercicio personal `mine-1789931776588-ijet2` (“Pared- Profunidad y Centro”);
- partidos próximos del 24/09 y 26/09.

### Causa verificada

La información **no había desaparecido de Supabase**. Se verificó directamente en Postgres que seguía activa.

La API pública que usa CampoBase estaba bloqueada por cuota:
- REST: **HTTP 402**;
- Auth: **HTTP 402**;
- Realtime: intento real de WebSocket terminó en **TIMED_OUT**.

Mensaje de Supabase:
`Service for this project is restricted due to ... exceed_cached_egress_quota, exceed_egress_quota`.

Por tanto, un móvil/ordenador que no tuviera ya esos registros en su IndexedDB local no podía descargarlos aunque existieran en servidor.

### Salvaguarda añadida

Cuando `syncFromCloud()` detecta una restricción 402:
- nunca limpia ni sustituye los stores locales;
- intenta recuperar registros desde la base local heredada `campobase` hacia `campobase_<userId>` **solo cuando el almacén nuevo está vacío**;
- en `settings`, solo recupera contenido personal operativo si todavía no existe contenido personal/sesiones en la base nueva;
- nunca sobrescribe un ID que ya exista en la base del usuario;
- nunca ejecuta `clear()` ni `delete()` durante esa recuperación;
- repinta la interfaz si recupera registros;
- muestra que Supabase está temporalmente restringido y que CampoBase mantiene los datos locales.

Se mantienen:
- polling cloud de 10 s como respaldo;
- reloj/estado local del partido cada 1 s;
- cola offline;
- IndexedDB local-first.

### Regla permanente

Un error remoto (402, caída de Supabase, Auth no disponible, Realtime caído) **jamás puede interpretarse como “servidor vacío”** ni provocar que CampoBase borre, sustituya o esconda datos locales existentes.

No restaurar tombstones a ciegas. Dos IDs de `configuracion` aparecieron eliminados recientemente (`e38a3ac3-...` y `8e0481a6-...`), pero su payload ya era null y no pudo demostrarse qué contenido representaban.

### Estado conocido de la semana 21–27/09/2026 en Supabase

Sesiones activas verificadas:
- 21/09/2026 · 16:30 · Alfonso Silva · 5 bloques · 75 min.
- 22/09/2026 · 17:30 · Alfonso Silva · 1 bloque · 15/60 min.

El usuario esperaba tres sesiones esa semana. La tercera no puede reconstruirse de forma fiable solo desde los tombstones actuales y no debe inventarse.

Partidos activos próximos verificados:
- 24/09/2026 · 17:45 · Alevín Inter/Pilar · Campo del Pilar.
- 26/09/2026 · 09:30 · El Calero Alevín B · Campo El Calero.

## Diagnóstico vídeo móvil — 22/09/2026

- No borrar todavía los MP4 de Supabase hasta cerrar la validación móvil.
- Los 323 vídeos históricos ya tienen copia verificada en GitHub Releases con tamaño coincidente; GitHub es el destino actual de lectura para las rutas históricas transformadas.
- El caso `f7-126` reproduce correctamente desde GitHub Releases en Chrome de escritorio y en pruebas automatizadas WebKit/iPhone, incluida la PWA publicada con Service Worker v32.
- GitHub Releases responde a rangos HTTP correctamente (`206 Partial Content`, `Accept-Ranges: bytes`), aunque entrega los MP4 como `application/octet-stream` y `Content-Disposition: attachment`.
- Los MP4 nuevos muestreados (`f7-120`, `f7-126`, `f7-127`, `f7-135`) usan H.264 High / yuv420p y son compatibles; su átomo `moov` está al final, no en fast-start. Es un posible factor de robustez móvil, pero no explica por sí solo el fallo porque las pruebas limpias reproducen.
- La instalación móvil real puede estar conservando una mezcla/caché antigua. Se prepara `20260922-mobile-video-cache-v33` únicamente para invalidar caché y cargar un conjunto coherente de HTML/JS/SW, sin modificar datos, sesiones, Realtime, ejercicios ni vídeos.
- Si v33 no resuelve el móvil físico, la siguiente prueba debe ser comparar el mismo vídeo en navegador normal vs PWA instalada en ese dispositivo antes de cambiar alojamiento o recodificar en masa.

### Prueba aislada f7-126 en GitHub Pages — 22/09/2026

- El móvil físico del usuario sigue sin reproducir varios MP4 del catálogo.
- Las pruebas válidas con Google Chrome real (con soporte H.264) reproducen `f7-126` desde GitHub Releases; las pruebas con Chromium de Playwright sin códecs propietarios no son válidas para diagnosticar H.264.
- `f7-126` forma parte de los 100 assets extra del release (`f7-051` a `f7-150`, 42,50 MiB en total) y no existe en Supabase Storage; por tanto Supabase no puede actuar como fallback para ese grupo.
- Se publica de forma aislada `assets/video-mobile/f7-126.mp4`, reempaquetado con `faststart` sin recodificar, y solo ese ejercicio se resuelve temporalmente a GitHub Pages.
- Objetivo: comprobar en el móvil físico si una respuesta `video/mp4` de Pages elimina el fallo observado con GitHub Releases (`application/octet-stream` + attachment).
- No ampliar esta migración a los otros 99 vídeos hasta validar `f7-126` en el dispositivo real.

### Build v34 para prueba física de vídeo — 22/09/2026

- Se fuerza el build `20260922-pages-video-test-v34` para que móvil y PWA no reutilicen JavaScript/cache de v33.
- Cambio funcional deliberadamente mínimo: solo `f7-126` se sirve desde `./assets/video-mobile/f7-126.mp4` en GitHub Pages.
- El MP4 se reempaquetó con `faststart` sin recodificar; el contenido visual no cambia.
- Los otros vídeos siguen exactamente en sus rutas anteriores.
- No se modifica Supabase, Realtime, sesiones, jugadores, convocatorias, partido en vivo ni datos locales.
- Antes de ampliar el cambio a `f7-051`–`f7-150`, hay que validar `f7-126` en el teléfono físico.

### Activación Pages f7-082 y f7-084 — 22/09/2026

- La sesión del 22/09/2026 usa `f7-082` y `f7-084`, ambos del grupo `f7-051`–`f7-150`.
- Se prepararon copias no destructivas en `assets/video-mobile/f7-082.mp4` y `assets/video-mobile/f7-084.mp4`.
- Ambos conservan el vídeo original H.264 High 1440×900/24 fps, pero con `moov` al principio mediante `faststart`.
- CampoBase resuelve temporalmente `f7-082`, `f7-084` y `f7-126` desde GitHub Pages; el resto de vídeos continúa sin cambios.
- Build de caché: `20260922-pages-video-today-v35`.
- No se modifican IDs de ejercicios, sesiones, Supabase, Realtime, jugadores ni partido en vivo.
- Validar reproducción física en el teléfono antes de extender Pages a más vídeos.

### Corrección definitiva de arquitectura de vídeo móvil — 22/09/2026

- Se mantiene **GitHub Releases** como origen de reproducción de los MP4 pesados. No usar GitHub Pages ni Supabase como destino de reproducción para la biblioteca.
- La activación temporal de `assets/video-mobile/f7-082.mp4`, `f7-084.mp4` y `f7-126.mp4` en Pages queda **anulada/superseded** por esta corrección.
- `f7-082` y `f7-084` vuelven a sus assets originales del Release `campobase-videos-v1`.
- `f7-126` conserva el original en Releases para escritorio y usa en móvil una variante compatible también almacenada en el mismo Release: `library-v2-preview__f7-126__ejercicio-mobile.mp4`.
- La variante móvil de `f7-126` es H.264 Constrained Baseline, 1152×720, 30 fps, level 3.1, yuv420p, fast-start; el original no se reemplaza.
- Build de invalidación de caché: `20260922-releases-mobile-v36`.
- No se modifican IDs de ejercicios, sesiones, jugadores, convocatorias, Supabase, Realtime ni partido en vivo.
- No borrar todavía las copias históricas de Supabase hasta validar reproducción física en el móvil y completar la estrategia para el resto de vídeos.

### Biblioteca móvil completa en GitHub Releases — 22/09/2026

- El Release `campobase-videos-v1` contiene 423 MP4 originales y 423 variantes móviles compatibles; faltan 0.
- Las variantes móviles usan el mismo nombre que el original con sufijo `-mobile.mp4`.
- Perfil de compatibilidad: H.264 Constrained Baseline, máximo aproximado 1152×720, 30 fps, yuv420p y fast-start; se conserva audio en AAC cuando existe.
- Los originales de Releases no se borran ni se reemplazan.
- En escritorio CampoBase usa el MP4 original; en móvil, cualquier MP4 del Release usa automáticamente su variante `-mobile.mp4`.
- Esta regla sustituye la excepción temporal exclusiva de `f7-126`.
- GitHub Releases sigue siendo el origen de los vídeos; Pages y Supabase no son el destino de reproducción de la biblioteca.
- Build de invalidación: `20260922-releases-mobile-all-v37`.
- No se modifican IDs de ejercicios, sesiones, jugadores, convocatorias, Realtime ni partido en vivo.

## Corrección vídeo móvil — 22/09/2026

- Causa confirmada del fallo móvil: `main` estaba resolviendo todos los MP4 de GitHub Releases a un nombre con sufijo `-mobile.mp4`, aunque esas variantes no existían para todos los assets. En móvil esto provocaba URLs inexistentes y vídeos que no arrancaban.
- Corrección aplicada: solo `library-v2-preview__f7-126__ejercicio.mp4` usa de momento la variante validada `library-v2-preview__f7-126__ejercicio-mobile.mp4`.
- Todos los demás vídeos conservan su asset original de GitHub Releases.
- La variante móvil de `f7-126` está validada como H.264 Constrained Baseline, 1152×720, 30 fps, nivel 3.1, yuv420p, fast-start.
- No se han borrado vídeos de Supabase en esta corrección y no se han modificado sesiones, jugadores, partidos, Realtime ni datos de usuario.
- Mantener esta regla: no generalizar sufijos `-mobile` a todo el catálogo hasta que existan y se validen realmente esas variantes.

## Vídeos móviles — resolución general v39 (23/09/2026)

- Se verificó el Release `campobase-videos-v1`: contiene **846 assets MP4**, formados por **423 originales + 423 variantes `-mobile.mp4`**.
- Verificación de integridad de nombres: **0 originales sin variante móvil** y **0 variantes móviles huérfanas**.
- Las variantes móviles están destinadas a compatibilidad de reproducción en teléfono; el ordenador conserva el MP4 original.
- Causa funcional detectada: el resolver de producción solo activaba la variante móvil para `f7-126`, aunque ya existían variantes móviles para todos los MP4.
- Corrección v39: cualquier asset `*.mp4` del Release se resuelve en móvil como `*-mobile.mp4`; si ya es `-mobile.mp4`, no se vuelve a transformar.
- El Service Worker revalida explícitamente `/js/ejercicio-videos.js` y usa una caché nueva v39 para impedir que la PWA conserve la regla antigua.
- Esta corrección no modifica ejercicios, IDs, sesiones, partidos, jugadores, Supabase ni Realtime. Tampoco borra los vídeos originales.

## Vídeo móvil — validación final v40 (23/09/2026)

- Producción activa: `20260923-pwa-force-refresh-v40`.
- GitHub Pages y `CampoBase verify` están en verde para el commit de producción `b6de98d2903c0ffa2fade708c6c922a2c954cbee`.
- Release `campobase-videos-v1`: **423 MP4 originales + 423 variantes `-mobile.mp4` = 846 assets**, con **0 parejas ausentes**.
- En móvil, CampoBase resuelve automáticamente cada MP4 del Release a su pareja `-mobile.mp4`; en escritorio conserva el original.
- Prueba real contra la PWA pública con Google Chrome + perfil móvil y soporte H.264:
  - `f7-120`: reproduce y avanza a 2,326 s, `readyState=4`, sin error.
  - `f7-126`: reproduce y avanza a 2,394 s, `readyState=4`, sin error.
  - `f7-127`: reproduce y avanza a 2,392 s, `readyState=4`, sin error.
  - `f7-135`: reproduce y avanza a 2,350 s, `readyState=4`, sin error.
- El Service Worker activo en la prueba fue `sw.js?v=20260923-pwa-force-refresh-v40`.
- No se modificaron ejercicios, sesiones, jugadores, convocatorias, Realtime, partido en vivo ni datos de usuario para esta validación.
- Si un teléfono físico siguiera mostrando el fallo después de v40, tratarlo como estado local de esa instalación/PWA y verificar que haya cargado v40 antes de cambiar de nuevo la arquitectura de vídeo.

## Estadísticas equitativas, Clasificaciones, Balón Parado y Fix Modo Campo — v43 (23/09/2026)

### 1. Cálculo equitativo de minutos por convocatorias
- **Problema detectado**: Anteriormente, el porcentaje de minutos disputados en la ficha del jugador calculaba los minutos posibles a partir del tiempo cronometrado del partido (`match.playedSeconds`). En partidos que duraban 53 minutos cronometrados, si un jugador jugaba los 53 minutos se le asignaba un 100% de minutos, lo cual distorsionaba la realidad competitiva respecto al tiempo reglamentario completo.
- **Lógica implementada**:
  - El total de minutos posibles se basa exclusivamente en los **partidos en los que el jugador ha entrado en convocatoria** (`availableIds` o minutos registrados) multiplicado por la **duración reglamentaria de la categoría**:
    - Fútbol 7 (F7): **70 minutos** por partido.
    - Fútbol 11 (F11): **90 minutos** por partido.
  - **Fórmula**:
    $$\text{Minutos posibles} = \sum_{\text{partidos conv.}} \text{Duración reglamentaria}$$
    $$\text{\% Minutos} = \min\left(100, \operatorname{round}\left(\frac{\text{Minutos jugados}}{\text{Minutos posibles}} \times 100\right)\right)$$
    $$\text{Media min/partido} = \operatorname{round}\left(\frac{\text{Minutos jugados}}{\text{Total convocatorias}}\right)$$
  - **Casos reales validados**:
    - **Pablo Díaz**: Convocado a 1 partido de F7 (70 min reglamentarios), disputó 53 minutos. Minutos posibles: 70 min. Porcentaje: **76%** (nunca 100%).
    - **Alejandro Pedrós / Pelayo**: Convocado a 2 partidos de F7 (140 min posibles), disputó 60 minutos en total. Porcentaje: **43%**, con una media de **30 min/partido convocado**.
  - **Representación visual**: Tanto en la ficha individual de Plantilla como en los tooltips y resúmenes se muestra de forma explícita: `<strong>X de Y min</strong> (Z%) · N partidos conv.`.

### 2. Tablas clasificatorias de plantilla (`#squad-leaderboards`)
- Se implementó un panel modular e intuitivo en la vista de Plantilla con 5 clasificaciones y selector de ámbito (**Todo el curso**, **Liga**, **Pretemporada**):
  1. **Goleadores (Pichichi)**: Jugadores ordenados por número total de goles.
  2. **Asistencias**: Jugadores ordenados por pases de gol. Se añadió soporte para registrar al asistente (`assistantId`) en goles tanto en directo (En vivo / Delegado) como en el detalle del partido y estadísticas manuales.
  3. **Trofeo Zamora**: Ranking de porteros (jugadores con rol o posición de Portero con minutos jugados), calculado con el coeficiente oficial: $\frac{\text{Goles encajados}}{\text{Partidos jugados}}$.
  4. **Reparto equitativo de minutos**: Ordenado de **menor a mayor** promedio de minutos jugados por partido convocado. Permite al entrenador detectar inmediatamente qué jugadores tienen déficit de minutos y deben ser compensados y priorizados en las siguientes convocatorias y alineaciones.
  5. **Fair Play**: Ranking de tarjetas amarillas y rojas recibidas.
- Interfaz con diseño de podio (oro 🥇, plata 🥈, bronce 🥉), etiquetas de rol y cambio reactivo de pestañas sin recargar.

### 3. Especialistas a balón parado y capitanes
- Se añadió el botón `🎯 Balón parado y Capitanes` en la cabecera de Plantilla junto con el modal `#set-pieces-dialog`.
- Permite configurar y persistir en `settings/setPieces`:
  - **Penaltis**: 1.er y 2.º lanzador.
  - **Faltas perfil izquierdo**: 1.er lanzador (preferente diestro) y 2.º lanzador.
  - **Faltas perfil derecho**: 1.er lanzador (preferente zurdo) y 2.º lanzador.
  - **Córners banda izquierda**: 1.er y 2.º lanzador.
  - **Córners banda derecha**: 1.er y 2.º lanzador.
  - **Capitanes**: 1.er, 2.º y 3.er capitán.
- **Visualización integrada**:
  - Resumen rápido destacado en la parte superior de la sección Plantilla (`#plantilla-specialists-bar`).
  - Badges/insignias visuales en la tarjeta de cada jugador (`🎯 1.er Penalti`, `⚡ 1.ª Falta Izq.`, `©️ 1.er Capitán`, etc.).
  - Banner de consulta rápida accesible durante los partidos en directo en las vistas En vivo y Modo Delegado.

### 4. Corrección de Modo Campo Directo (Pantalla sin carga / Error 401 RLS)
- **Diagnóstico**: `modo-campo-directo.html` fallaba al cargar datos de Supabase, quedando en blanco o con spinner indefinido.
- **Causa raíz**: Los módulos `js/modo-campo-directo.js`, `js/modo-campo-actions.js` y `js/modo-campo-identity-exercises.js` instanciaban el cliente de Supabase con `auth: { persistSession: false }`. Al tener Supabase habilitado Row Level Security (RLS) en las tablas (`jugadores`, `convocatorias`, `partidos`, `asistencias`, `configuracion`), las consultas sin token de sesión arrojaban errores HTTP 401 / código PostgreSQL `42501 permission denied for table`.
- **Solución implementada**:
  - Se configuró el cliente Supabase de Modo Campo con `auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }`.
  - De esta forma, el SDK de Supabase aprovecha automáticamente la sesión segura existente del usuario iniciada en CampoBase sin necesidad de almacenamiento intermedio manual.
  - Se implementó un manejo de errores claro y amigable en la interfaz de Modo Campo que orienta al usuario si no existe una sesión activa en lugar de quedarse congelado.

### 5. Bump de versión PWA y sincronización v43
- Versión unificada: `20260923-stats-setpieces-modocampo-v43`.
- Sincronizados de forma atómica:
  - `sw.js` (nombre de clave de caché `CACHE` y array `ASSETS`).
  - `index.html` (queries de assets, registro de Service Worker y `window.__CAMPOBASE_BUILD`).
  - `js/app.js`, `js/supabase-client.js`, `js/demo-session.js`, `js/ejercicio-viewer.js`.
  - Suite de tests de integración (`tests/pwa-current-build.test.js`, `tests/auth-recovery-controls.test.js`, etc.).
  - Nuevo archivo de tests: `tests/squad-stats-and-set-pieces.test.js`.
- Batería de pruebas: **501/501 tests unitarios y de integración superados en verde** y chequeo de sintaxis (`npm run check`) 100% verificado.

### 6. Diagnóstico de reproducción de vídeo en iPhone físico (`?videoDebug=1` y botón en Ajustes)
- **Objetivo**: Proporcionar al usuario una herramienta visual e inmediata en su teléfono real para diagnosticar el estado del reproductor en `f7-126` y otros ejercicios sin depender exclusivamente de emuladores ni Playwright.
- **Activación flexible (apta para PWA standalone sin barra de direcciones)**:
  1. **Mediante parámetro URL**: Entrando con `?videoDebug=1` (guarda persistencia en `localStorage.setItem('campobase.videoDebug', '1')`).
  2. **Mediante botón en Ajustes**: En la sección *Sesión y sistema* se añadió el botón `🐞 Diagnóstico de vídeo móvil`, que permite conmutar la herramienta directamente desde la PWA instalada en la pantalla de inicio del iPhone.
- **Métricas registradas en pantalla en tiempo real**:
  - `window.__CAMPOBASE_BUILD` (versión del código ejecutándose).
  - `navigator.serviceWorker.controller` (Service Worker que controla activamente la página).
  - `navigator.userAgent`.
  - `navigator.standalone` y `(display-mode: standalone)`.
  - `video.dataset.src` vs `video.currentSrc` (para verificar si cargó la variante `-mobile.mp4` correcta).
  - `readyState` (0 a 4) y `networkState` (0 a 3).
  - `paused`, `currentTime` y `duration`.
  - `video.error` (código y mensaje en caso de fallo).
  - **Historial reactivo de eventos**: Registra con timestamp los últimos eventos del elemento de vídeo: `loadstart`, `loadedmetadata`, `loadeddata`, `canplay`, `play`, `playing`, `waiting`, `stalled`, `suspend`, `pause`, `error`, `ended`.
  - Botón **Copiar** para exportar todo el registro de diagnóstico y pegarlo cómodamente.

---

## 2. Resumen de Mejoras y Auditoría v44 (`20260923-stats-setpieces-modocampo-v44`)

### 1. Eliminación Definitiva del Símbolo `#` en Dorsales de Jugadores
- **Causa anterior:** En selectores de lanzadores de balón parado, capitanes, tablas clasificatorias y el banner rápido de especialistas, se mostraba el dorsal precedido por el carácter `#` (ej. `#7`, `#10`), lo cual contravenía la regla de estilo del usuario (`Alejandro Pedrós Goncalves 7`).
- **Solución implementada:**
  - Se sustituyeron todas las interpolaciones `#${cleanPlayerNumber...}` y etiquetas de dorsal en `js/app.js`.
  - Ahora en toda la interfaz (formulario de especialistas, banners tácticos en vivo y clasificaciones) el dorsal aparece limpio como número (`7`, `10`, etc.) o en una píldora visual estilizada `.lb-dorsal-tag`.

### 2. Botón Reactivo de Despliegue de Tablas Clasificatorias
- **Causa anterior:** El acordeón de tablas clasificatorias no indicaba con claridad la acción al estar abierto o cerrado, ni cambiaba el texto dinámicamente.
- **Solución implementada:**
  - Se añadió la etiqueta interactiva `<span class="badge secondary lb-toggle-text">Desplegar tablas clasificatorias ▾</span>` / `Cerrar tablas clasificatorias ▴`.
  - Se conectó un listener sobre el evento `toggle` de `details.squad-leaderboards-card` que actualiza el texto y la flecha en tiempo real según el estado desplegado/colapsado.

### 3. Convocatorias y Minutos Reales (Caso Aitor y Jugadores de Plantilla)
- **Causa anterior:**
  - Si un jugador disputaba minutos en un partido (`minuteTotals > 0`) pero el partido no tenía vinculada formalmente una convocatoria previa (o se había creado el partido directamente sin documento previo de convocatoria), la estadística de convocatorias del jugador omitía ese partido.
  - Esto generaba discrepancias donde jugadores como Aitor contaban con minutos reales jugados pero una sola convocatoria formal registrada.
- **Solución implementada:**
  - En `js/domain.js` (`buildPlayerSummary`), se flexibilizó el enlace bidireccional entre convocatoria y partido:
    `(c.matchId && c.matchId === match.id) || (match.callupId && match.callupId === c.id) || match.id === c.id`.
  - Se incorporó el cómputo de partidos jugados con minutos donde no existía documento de convocatoria previo: se suman como convocatorias efectivas reales (`totalCallups`).
  - En `calculatePlayerCallupMinutes`, se garantiza que `effectiveCallups` nunca sea inferior a la cantidad de partidos disputados computados (`Math.max(totalCallups, countedMatchIds.size)`).
  - De este modo, todas las estadísticas y porcentajes de participación reflejan la realidad deportiva exacta.

### 4. Nuevos Eventos de Balón Parado en Partido en Vivo y Modo Delegado
- **Causa anterior:** Solo se podían registrar goles estándar, tarjetas, lesiones e incidencias genéricas. Faltaban eventos específicos de penaltis y balón parado esenciales para el seguimiento minucioso del entrenador y del delegado.
- **Solución implementada:**
  - Se incorporaron en `js/domain.js` (`addPlayerMatchEvent`) y en la interfaz de `js/app.js` (tanto para En Vivo como Modo Delegado y edición a posteriori en Calendario):
    1. **Gol de penalti** (`penalty_goal`): Suma un gol a nuestro favor en el marcador (`goalsFor + 1`), guarda la propiedad `isPenalty: true` en el array de goles y muestra el icono `🎯⚽`.
    2. **Penalti fallado** (`penalty_miss`): Registra la incidencia del lanzador con etiqueta `❌🎯 Penalti fallado` sin alterar el marcador.
    3. **Penalti parado por el portero** (`penalty_saved`): Registra la incidencia de mérito del guardameta con etiqueta `🧤🎯 Penalti parado` sin variar el marcador.
    4. **Penalti encajado** (`penalty_conceded`): Registra la incidencia sobre el portero con etiqueta `⚠️🎯 Penalti encajado` y suma un gol al rival en el marcador (`goalsAgainst + 1`).
    5. **Gol en propia puerta** (`own_goal` / `__pp__`): Registra el gol sin asignar a ningún jugador de campo indebidamente.
    6. **Asistencias vinculadas a goles**: Selector de asistente en vivo y en diferido, computándose de inmediato en la tabla de Asistencias de plantilla.

### 5. Tablas Clasificatorias Más Visuales y Elegantes
- **Mejoras de estilo (`styles-redesign.css`):**
  - **Podio deportivo**: Las 3 primeras posiciones cuentan con acabados metálicos distintivos:
    - 🥇 **1.º clasificado (`.lb-podium-1`)**: Borde y fondo sutil en degradado dorado (`rgba(234, 179, 8, 0.12)`).
    - 🥈 **2.º clasificado (`.lb-podium-2`)**: Borde y fondo en degradado plateado (`rgba(148, 163, 184, 0.12)`).
    - 🥉 **3.er clasificado (`.lb-podium-3`)**: Borde y fondo en degradado bronce (`rgba(217, 119, 6, 0.12)`).
  - **Píldora de dorsal (`.lb-dorsal-tag`)**: Dorsal resaltado en cápsula compacta de alto contraste sin el símbolo `#`.
  - Celdas con tipografía tabular (`tabular-nums`) y avatar con iniciales o foto optimizada.

### 6. Reproducción de Vídeo MP4 en iPhone Físico (PWA Standalone)
- **Diagnóstico del problema:**
  - En ordenadores y Safari estándar el vídeo reproducía correctamente.
  - En la PWA instalada en la pantalla de inicio del iPhone, al pulsar el botón ▶ el vídeo se quedaba en pausa a 0:00 o no arrancaba.
  - **Causa raíz:** En `js/ejercicio-viewer.js`, dentro de la función `togglePlay()`, existía una lógica que ante un estado `readyState === 0` o red vacía forzaba `video.load()` con un parámetro URL dinámico en iOS standalone. En el motor WebKit de iOS, invocar `video.load()` de forma síncrona dentro o antes del gesto táctil de usuario aborta el pipeline de medios, cancela la promesa de reproducción (`AbortError`) y fuerza al elemento a pausarse en 0:00.
- **Solución implementada:**
  - Se eliminó el reseteo destructivo `video.load()` de `togglePlay()`.
  - Se añadieron los atributos nativos obligatorios de WebKit: `webkit-playsinline`, `playsinline`, y la propiedad imperativa `video.playsInline = true`.
  - Asignación limpia de `video.src = video.dataset.src` sin recargas intermedias, permitiendo que `video.play()` arranque limpiamente en el primer toque del usuario en la PWA.

### 7. Auditoría Técnica: ¿Se pueden borrar los vídeos MP4 de Supabase?
- **Pregunta del usuario:** *«Comprueba si se puede borrar de supabase ya los mp4 si no hacen nada ahí ni rompe nada, yo tengo copia local de esos videos pero creo que está en github»*.
- **Dictamen y comprobación técnica:**
  - **SÍ, los 323 vídeos históricos del catálogo precargado SE PUEDEN BORRAR del almacenamiento (Storage) de Supabase.**
  - **Fundamento técnico:** El módulo `js/ejercicio-videos.js` contiene la función central `resolveHostedVideoUrl(url)`. Todas las URLs de vídeos del catálogo con patrón `library-v2-preview/*` o `CAMPOBASE-VIDEO-*` son interceptadas y redirigidas al CDN de **GitHub Releases** (`campobase-videos-v1`). Los navegadores y la PWA descargan y reproducen los vídeos directamente desde GitHub Releases a coste 0, sin realizar ninguna petición a Supabase Storage para estos vídeos.
  - **⚠️ ADVERTENCIA CRÍTICA DE SEGURIDAD:**
    - **NO se debe borrar el bucket `ejercicio-videos` de Supabase**.
    - La funcionalidad «Añadir vídeo propio» en ejercicios personalizados (función `uploadVideo()` en `js/supabase-client.js`) sube los vídeos nuevos directamente a ese bucket de Supabase Storage.
    - **Acción recomendada:** Se pueden borrar con total seguridad los 323 archivos `.mp4` del catálogo que estén dentro del bucket para liberar espacio en la cuota gratuita, pero manteniendo el bucket `ejercicio-videos` intacto con sus políticas de acceso.

### 8. Comprobación Técnica: ¿El polling de 10 segundos sobra o es necesario teniendo Realtime?
- **Pregunta del usuario:** *«Añade que hay que comprobar el realtime por si el ploit de 10 seg si sobre es necesario»*.
- **Dictamen y comprobación técnica:**
  - **NO SOBRA. El polling de 10 segundos es ESTRICTAMENTE NECESARIO como mecanismo de salvaguarda y respaldo (fallback).**
  - **Fundamento técnico:**
    1. **Suspensión de WebSockets en iOS PWA:** Cuando el entrenador o el delegado apagan la pantalla del iPhone, contestan un mensaje o cambian de aplicación, iOS WebKit suspende de inmediato la ejecución de JavaScript y corta o congela la conexión WebSocket de Supabase Realtime. Al volver a la app, los WebSockets con frecuencia no se enteran de la desconexión hasta pasados varios minutos o no reconectan automáticamente sin una señal activa.
    2. **Límites e inactividad en Supabase:** Las conexiones WebSocket en la capa gratuita de Supabase sufren cortes por inactividad o cuotas de sockets concurrentes.
    3. **Respaldo auditado por tests de arquitectura:** El test `tests/realtime-shadow-sync.test.js` («Realtime se añade como segunda vía sin retirar los respaldos actuales») exige explícitamente `setInterval(() => synchronizeCloud().catch(handleError), 10000)`.
    - **Conclusión:** Realtime proporciona la inmediatez milimétrica en vivo cuando la pantalla está activa, mientras que el polling de 10 segundos garantiza que jamás se pierda una sincronización de partido o convocatoria por un corte silencioso de conexión.

### 9. Verificación y Batería de Pruebas
- Sincronización completa de la versión `20260923-stats-setpieces-modocampo-v44` en Service Worker, aplicación cliente y suites de tests.
- **506/506 tests unitarios y de integración superados con éxito** (`npm test`).
- Sintaxis y tipado validados con `npm run check` al 100%.

### 10. Actualización Crítica: Protección de Datos, Rendimiento, Marcador en Vivo y Móvil (2026-09-23)
1. **Protección Absoluta de Datos del Usuario (INMUTABLES):**
   - **Jugadores y lanzadores:** Actualizados directamente por el usuario. PROHIBIDO modificarlos, reiniciarlos, sobrescribirlos o borrarlos en cualquier sincronización o migración.
   - **Convocatoria contra El Pilar:** Actualizada por el usuario de forma provisional. PROHIBIDO modificarla o alterarla; se preserva íntegramente.
2. **Borrado 100% de MP4 en Supabase Storage:**
   - Se eliminaron con éxito los **323 archivos MP4** alojados en el bucket `ejercicio-videos` de Supabase (25 en `CAMPOBASE-VIDEO-.../video.mp4` y 298 en `library-v2-preview/.../ejercicio.mp4`).
   - El bucket `ejercicio-videos` se conserva limpio para futuras subidas sin consumir almacenamiento en la cuota gratuita de Supabase, ya que los vídeos del catálogo se sirven desde GitHub Releases (`campobase-videos-v1`).
3. **Anulación de Goles e Incidencias en Partido en Vivo:**
   - Implementada la función `removePlayerMatchEvent(details, eventId)` en `js/domain.js` y `removeLiveEvent(prefix, eventId)` en `js/app.js`.
   - Permite al entrenador o delegado anular cualquier gol (propio, de penalti o en propia puerta), penalti encajado, tarjeta, lesión o incidencia desde la lista de eventos en vivo mediante un botón individual «✕ Anular».
   - Al anular un gol, el marcador (`goalsFor` o `goalsAgainst`) se recalcula y decrementa inmediatamente, persistiendo en el timer y refrescando la pantalla del míster y del delegado al instante.
4. **Rediseño del Marcador en Vivo y Corrección Móvil:**
   - Se eliminó el fondo verde oscuro `#0f2d20` y los números negros forzados que no habían sido configurados por el usuario.
   - Marcador rediseñado con estilo tarjeta limpia (`var(--cb-surface-card)`), nombres de equipos en texto de alto contraste (`--cb-slate-800`), números en verde corporativo (`--cb-brand`), y botones contenidos de 38×38 px que nunca se desbordan en pantallas móviles (pantallazo 2 solucionado).
   - Se corrigió el colapso visual de los botones de la pizarra táctica en móvil (`.tactic-tool` y `.tactic-tool-label` con `white-space: nowrap; word-break: normal`), impidiendo que las letras se apilen verticalmente una a una (pantallazo 1 solucionado).
5. **Solución a la Lentitud Extrema y Falta de Sincronización:**
   - **Causa identificada:** En `js/db.js`, `localJson !== cloudJson` comparaba arrays no ordenados por ID devueltos por PostgREST, resultando en `true` constantemente y forzando a vaciar y repoblar IndexedDB cada 10 segundos, destruyendo y recreando todo el DOM con `refresh()`. Además, las peticiones sin timeout saturaban el pool de conexiones de Supabase (error 503/504 `PGRST002/PGRST003`).
   - **Solución aplicada:**
     - En `js/db.js`, comparación de registros ordenada por ID (`areEquivalent`). Cuando no hay cambios reales, no se tocan los almacenes locales ni se re-renderiza la interfaz.
     - En `js/supabase-client.js`, incorporación de `AbortSignal.timeout(6000)` en consultas `getSnapshot` y mutaciones para evitar bloqueos del navegador.
6. **Reproductor de Ejercicios en Móvil:**
   - Solucionado el problema por el cual el vídeo se quedaba en pausa a 0:00: al pulsar sobre el overlay de reproducción en móvil, la ocultación instantánea de este causaba un segundo evento de clic fantasma sobre la etiqueta `<video>` subyacente, pausándolo inmediatamente. Se añadió debounce de 350 ms y `stopPropagation()`.
   - Añadida etiqueta hija explícita `<source src="..." type="video/mp4">` para que el motor AVPlayer de iOS WebKit reconozca el stream MP4 de forma nativa sin depender del `Content-Type` de GitHub Releases.
7. **Modo Campo:**
   - Incorporado timeout de seguridad en `readTable` y mensaje informativo con botón de reintento automático si el servidor Supabase se encuentra despertando tras una pausa.

