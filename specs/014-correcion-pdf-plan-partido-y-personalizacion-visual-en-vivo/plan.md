# Plan de Arquitectura SDD 014: Corrección de PDF, Minutos Reales, Edición de Tramos y Personalización En Vivo

## 1. Arquitectura Técnica y Estrategia

### 1.1 Motor de Impresión y Paginación A4 (`js/print-match-plan.js` y `js/print-session-export.js`)
- En `buildMatchPlanHtml`:
  - Medir dinámicamente la cantidad de momentos de sustitución.
  - Si los momentos superan el espacio disponible en la Hoja 1 (más de 2 momentos explicados detallados), dividir la Hoja 1 en páginas secuenciales limpias (`Página 1: Titulares e Inicio de Cronograma`, `Página 2: Continuación de Cronograma`, `Página 3: Reparto de Minutos y Acta`).
  - Cada página `.cb-print-page` se aísla con altura máxima estricta (`min-height: 297mm; max-height: 297mm; box-sizing: border-box; overflow: hidden; page-break-after: always; break-after: page;`).
- En `generatePdfBlob`:
  - Asegurar que cada página A4 renderizada con `html2canvas` mantenga la escala 1:1 respecto a 210mm x 297mm sin cortes por encima de 297mm.

### 1.2 Algoritmo de Rotación y Edición de Tramos (`js/reparto-plan.js`, `js/app.js`)
- En `buildAutoPlan`:
  - Limitar las sustituciones simultáneas a **2–3 jugadores de campo por ventana** escalonada.
  - Asegurar que para 13 jugadores de campo en F7 (70 min) los tramos sumen exactamente los 70 minutos totales con reparto equitativo (~32′ por jugador de campo, 35′ por portero).
- En `renderClaudeCallup` (`js/app.js`):
  - Añadir botón interactivo «⚡ Generar rotación equitativa» si el plan actual no tiene momentos (`moments.length <= 1`).
  - Añadir enlace/botón «✏️ Ajustar rotación» que conecta directamente con la preparación del partido correspondiente.
  - Conectar el interruptor de modo «Por partes» vs «Escalonado» para recalcular en vivo los tramos.

### 1.3 Personalización Reactiva y Previsualizaciones En Vivo (`index.html`, `js/app.js`, `css/claude-plantilla.css`, `css/claude-partido.css`)
- En `index.html`:
  - Añadir en Ajustes la tarjeta `#specialists-colors-card`:
    - Selectores para «1.er lanzador» (fondo y texto) y «Demás lanzadores» (fondo y texto).
    - Mini-previsualización interactiva con una tarjeta idéntica a la de Plantilla (ej. Penaltis con 1.er lanzador y 2.º lanzador).
  - Añadir en Ajustes controles dedicados para:
    - Dorsales de jugadores (fondo y texto) con su mini-muestra.
    - Botón de WhatsApp (fondo y texto) con su mini-muestra.
- En `js/app.js`:
  - Extender `applyCustomTheme` para inyectar las variables CSS:
    - `--sp-lead-bg`, `--sp-lead-ink`, `--sp-sub-bg`, `--sp-sub-ink`
    - `--dorsal-bg`, `--dorsal-ink`
    - `--wa-bg`, `--wa-ink`
  - Guardar y cargar estas propiedades en `state.customTheme` y persistir en IndexedDB / Supabase `configuracion`.
- En CSS:
  - Enlazar `.specialist-rank`, `.specialist-number`, `.cbx-callup-number`, y `.open-whatsapp-*` a las nuevas variables CSS.

---

## 2. Estrategia de Regresión Cero y Verificación
- Las 666 pruebas actuales de `npm test` deben continuar pasando al 100%.
- Nuevos tests automatizados en `tests/pdf-plan-and-live-preview.test.js` para validar:
  - Paginación del PDF y generación limpia sin desbordamiento.
  - Cálculo de rotación equitativa con ventanas de 2–3 jugadores.
  - Reactividad de variables de color de especialistas, dorsales y WhatsApp.
