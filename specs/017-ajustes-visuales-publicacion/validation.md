# Validación
- `npm run check`: correcto.
- `npm test`: 690/690, cero omitidos.
- Browser smoke crítico: Equipo mediante menú visible, preparación guardada y reabierta, Preparar partido persistente y + Ejercicio guardado; correcto.
- Prueba específica del configurador: colores, restauración individual, persistencia, navegación independiente, ventanas y ancho de diálogo 390/1280; correcto, cero escrituras remotas.
- La prueba de navegador heredada se adapta al menú de escritorio visible y completa las selecciones del formulario en un turno de eventos para evitar carreras con los repintados periódicos de la demo. Se conserva la comprobación de persistencia y el control de errores.
- Cambios de presentación limitados al diálogo; no cambian los controles ni sus valores.
- Producción publicada mediante PR #92; merge 13c8ad5e157a35b62610f9abfee4d64c4ff19293. CI de PR y main y GitHub Pages correctos. No requiere migración Supabase.

- URL comprobada: https://miguelperezh.github.io/campobase/
- HTML sirve el build 20261005-ajustes-visuales-detallados. CSS y módulo del configurador publicados coinciden byte a byte con los validados.
- Preview conservada en https://miguelperezh.github.io/campobase-preview/v2/?revision=cb56c10
