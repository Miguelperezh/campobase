# Validación
- `npm run check`: correcto.
- `npm test`: 690/690, cero omitidos.
- Browser smoke crítico: Equipo mediante menú visible, preparación guardada y reabierta, Preparar partido persistente y + Ejercicio guardado; correcto.
- Prueba específica del configurador: colores, restauración individual, persistencia, navegación independiente, ventanas y ancho de diálogo 390/1280; correcto, cero escrituras remotas.
- La prueba de navegador heredada se adapta al menú de escritorio visible y completa las selecciones del formulario en un turno de eventos para evitar carreras con los repintados periódicos de la demo. Se conserva la comprobación de persistencia y el control de errores.
- Cambios de presentación limitados al diálogo; no cambian los controles ni sus valores.
- Producción se publicará tras los controles de CI de la rama y PR autorizado. No requiere migración Supabase.
