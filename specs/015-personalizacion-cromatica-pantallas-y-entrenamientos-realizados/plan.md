# Plan SDD 015: Planificación de Implementación

## 1. Arquitectura y Ámbito de Cambios

1. **Capa de Estilos (`styles-redesign.css`, `css/claude-hoy.css`, `css/claude-partido.css`, `css/claude-entreno.css`)**:
   - Blindar selectores globales contra sobreescritura de tipografía en cabeceras y tarjetas.
   - Definir variables CSS específicas con valor de reserva canónico para cada componente (`--today-match-bg`, `--today-match-ink`, `--callup-header-bg`, `--callup-header-ink`, `--callup-badge-bg`, `--callup-badge-ink`, `--callup-out-bg`, `--callup-out-ink`, `--prep-header-bg`, `--prep-header-ink`, `--prep-status-bg`, `--prep-status-ink`, `--whistle-bg`, `--whistle-ink`, `--print-bg`, `--print-ink`, `--edit-bg`, `--edit-ink`, `--completed-bg`, `--completed-ink`, `--callout-bg`, `--callout-ink`).
   - Aislar enlaces textuales con etiqueta `<button>` (`.view-session.link-button`, `.session-exercise-link`) para que no hereden fondos ni bordes de botones.
   - Añadir estilos para el botón "Realizado" (`.cbx-btn-completed`) y el acordeón colapsable (`.cbx-completed-sessions-accordion`).

2. **Capa Lógica de Aplicación (`js/app.js`)**:
   - **`applyViewScopedTheme`**: Extender el mapeo de variables CSS para incluir las nuevas propiedades en cada `viewEl`.
   - **`openQuickColorDialog`**: Incorporar vistas y subpestañas especializadas para `hoy`, `convocatorias`, `preparacion`, `partido`, `sesiones` y `tacticas`, con muestras interactivas fieles en tiempo real.
   - **`renderTrainingSessions`**:
     - Separar sesiones activas (`!s.completed`) de sesiones completadas (`s.completed`).
     - Renderizar el botón "✓ Realizado" / "✅ Realizado" en cada tarjeta.
     - Montar el acordeón desplegable inferior `<details class="cbx-completed-sessions-accordion">` para las sesiones realizadas.
   - **Controlador de marcado "Realizado"**: Delegar evento clic sobre `.toggle-session-completed` para alternar `session.completed`, actualizar IndexedDB `settings` y repintar reactivamente.

3. **Capa de Estructura (`index.html`)**:
   - Añadir la clase `cbx-banner` a `.section-head` en `#partido` para homologar la cabecera.

4. **Validación y Pruebas (`tests/`)**:
   - Actualizar y ejecutar la suite automatizada para garantizar que todas las pruebas existentes y nuevas pasen al 100%.
   - Verificar integridad de impresión en PDF.
