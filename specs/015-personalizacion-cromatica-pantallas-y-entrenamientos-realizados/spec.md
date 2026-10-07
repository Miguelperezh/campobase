# Especificación SDD 015: Personalización Cromática Total por Pestaña/Subpestaña y Archivo de Entrenamientos Realizados

## 1. Contexto y Diagnóstico del Problema

Tras las pruebas y capturas aportadas por el entrenador (Migue), se detectaron los siguientes requerimientos y anomalías visuales/funcionales:

### 1.1 Invasión de Tipografía Negra en Banners y Tarjetas ("Tu Día", Convocatorias, Preparación, Partido en Vivo)
- **Causa técnica**: La regla global `body.cb-redesign-active[data-has-custom-font-color="true"] p, label, span, strong, h1-h4, small, .meta` forzaba `--cb-font-custom-color` (en muchos casos `#000000`) con `!important` sobre elementos situados dentro de cabeceras rojas o tarjetas de alto contraste.
- **Manifestaciones específicas**:
  1. **Tu Día (`#hoy`)**: En la tarjeta de partido/marcador (`.cbx-today-match-score`), el nombre del club rival ("HURACÁN A"), de tu club ("C.F. UNIÓN VIERA..."), el estado ("Finalizado") y los metadatos ("09:00 · Casa", "Alfonso Silva", "Asistencia registrada") aparecían en negro sobre fondo rojo vino, siendo ilegibles y no configurables.
  2. **Convocatorias (`#convocatorias`)**: En el banner del partido, el subtítulo ("F7 · LIGA · 09:00") y el título ("HURACÁN A") aparecían negros sobre rojo. La píldora de recuento "14 convocados" y la píldora/botón contigua ("0 fuera") no disponían de configuración de color independiente de fuente y fondo.
  3. **Preparación (`#preparacion`)**: Las tarjetas de partido ("UD. Jinámar", "Siete Palmas A") mostraban cabeceras rojas con texto en negro ("09/10/2026, 19:00 · JFase Previa 2", "UD. Jinámar"), y todos los botones de acción ("Preparar partido", "Convocar y preparar", "Imprimir plan") se forzaban en negro sin independencia cromática.
  4. **Partido en Vivo (`#partido`)**: El banner superior mostraba "CALCULADORA EN TIEMPO REAL" y "Partido en vivo" en negro sobre fondo rojo, y el selector de color de la vista carecía de pestañas completas para cabecera, botones, marcador y pizarra.

### 1.2 Entrenamientos / Sesiones: Botones con Fondo Inadecuado y Falta de Configurador Específico
- **Causa técnica**: La regla de botón genérica `body.cb-redesign-active .view button:not(...)` aplicaba `background: var(--btn2) !important` a elementos `<button>` que actuaban como enlaces textuales (el título de la sesión `.view-session.link-button` y los ejercicios `.session-exercise-link`), creando una caja roja detrás del texto "Entrenamiento" y "Desmarque al primer p...".
- **Falta de configurador específico**: Los botones de acción de la sesión (Silbato, WhatsApp, Imprimir, Editar) no disponían de controles independientes para personalizar sus fondos y colores de texto.
- **Nuevo Requerimiento Funcional ("Realizado")**: Los entrenamientos necesitan un botón "Realizado" (con check) en cada tarjeta para marcar la sesión como completada. Al marcarse, la sesión debe archivarse en una sección inferior colapsable/desplegable ("📁 Entrenamientos realizados") con contador, permitiendo plegar o desplegar las sesiones finalizadas.

### 1.3 Tácticas y Pestaña Verde
- **Causa técnica**: La cabecera `.cbx-tactics-hero`, el subtítulo `.cbx-tactics-eyebrow`, el botón `btn-new-tactic-claude` y el cuadro informativo `.cbx-tactics-callout` ("la pestaña verde") contenían colores fijos hardcodeados en CSS (`#062b1d`, `#34d399`, `#10b981`, `#f0fdf4`, `#166534`), impidiendo que el tema o la personalización de la pestaña aplicaran sobre ellos.

---

## 2. Requerimientos Funcionales y de Interfaz

### R1. Aislamiento y Configuración Independiente por Pantalla y Subpestaña
1. Cada pantalla (`hoy`, `plantilla`, `cuerpo-tecnico`, `convocatorias`, `preparacion`, `partido`, `calendario`, `asistencia`, `ejercicios`, `sesiones`, `tacticas`, `ajustes`) debe contar con sus propios selectores y variables en `state.settings.theme.views[viewId]`:
   - Fondo y texto de Cabecera / Banner (`bannerBg`, `bannerInk`).
   - Botón Principal fondo y texto (`btnBg`, `btnInk`).
   - Botón Secundario fondo y texto (`btn2Bg`, `btn2Ink`).
   - Texto principal y títulos de tarjetas (`fontColor`, `cardTitle`).
   - Fondo y borde de tarjetas (`cardBg`, `cardBorder`).
2. Controles cromáticos dedicados para componentes propios de cada pantalla:
   - **Hoy**: Fondo de tarjeta de partido/marcador (`todayMatchBg`) y color de texto/marcador (`todayMatchInk`).
   - **Convocatorias**: Cabecera de tarjeta (`callupHeaderBg`, `callupHeaderInk`), píldora de convocados (`callupBadgeBg`, `callupBadgeInk`), píldora/botón de bajas/fuera (`callupOutBg`, `callupOutInk`), dorsales y WhatsApp.
   - **Preparación**: Cabecera de partido (`prepHeaderBg`, `prepHeaderInk`), píldora de estado (`prepStatusBg`, `prepStatusInk`), botón "Preparar partido" (`btnBg`, `btnInk`) y botones secundarios ("Convocar y preparar", "Imprimir plan") (`btn2Bg`, `btn2Ink`).
   - **Partido en Vivo**: Cabecera y botones, marcador de goles a favor/en contra (`gfBg`, `gfInk`, `gaBg`, `gaInk`), dorsales y pizarra táctica en vivo.
   - **Sesiones**: Cabecera, botones Silbato (`whistleBg`, `whistleInk`), WhatsApp (`waBg`, `waInk`), Imprimir (`printBg`, `printInk`), Editar (`editBg`, `editInk`), Realizado (`completedBg`, `completedInk`), y tarjetas de sesión.
   - **Tácticas**: Cabecera hero adaptable, cuadro informativo/pestaña adaptable (`calloutBg`, `calloutInk`), y pizarra interactiva (césped, líneas, fichas equipo, fichas rival, flechas).

### R2. Protección Absoluta contra Invasión de Tipografía Negra
1. Los selectores de texto global (`[data-has-custom-font-color="true"]`) deben excluir explícitamente:
   - Todos los banners (`.cbx-banner *`, `.section-head *`).
   - Las cabeceras de tarjeta de convocatoria (`.cbx-callup-card > header *`).
   - Las cabeceras de tarjeta de preparación (`.cbx-prep-card .section-head *`).
   - La tarjeta de marcador de Tu Día (`.cbx-today-match-score *`).
   - El hero de tácticas (`.cbx-tactics-hero *`).
   - El acordeón de entrenamientos realizados (`.cbx-completed-sessions-accordion *`).
2. Ningún elemento dentro de estas áreas puede verse forzado a negro sobre fondos oscuros o coloreados.

### R3. Función "Realizado" en Entrenamientos y Acordeón Inferior
1. En cada tarjeta de sesión dentro de `#sesiones`, añadir el botón de acción "✓ Realizado" / "✅ Realizado" con estilo conmutable.
2. Al pulsar el botón, alternar la propiedad `session.completed = !session.completed`, persistir en IndexedDB `settings` con `recordType: 'trainingSession'` y repintar inmediatamente.
3. Las sesiones no completadas se muestran en la cuadrícula activa principal.
4. Las sesiones marcadas como realizadas se agrupan en un acordeón desplegable inferior `<details class="cbx-completed-sessions-accordion">` con el título:
   `📁 Entrenamientos realizados (N)` y soporte para plegar/desplegar a voluntad del usuario.
5. Permitir desmarcar cualquier entrenamiento completado para devolverlo a la cuadrícula activa en cualquier momento.

### R4. Preservación del Motor de Impresión PDF y Operativa en Vivo
- El motor de impresión `js/print-match-plan.js`, `#cb-print-root` y `.cb-print-sheet` debe permanecer completamente intocado y protegido de cualquier regla cromática o de layout.
