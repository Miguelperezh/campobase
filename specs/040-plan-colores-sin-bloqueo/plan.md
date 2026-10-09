# Plan

1. Aislar eventos del editor: el listener del plan reconstruía dialog.innerHTML ante botones ajenos y destruía el panel; evitar también arrastrar minutos mientras se selecciona un color.
2. Catálogo de partes del plan con selectores semánticos estables y filtrado por sección visible.
3. No aplicar estilos del contenido a los controles del propio editor. Escape aislado.
4. Corregir mensajes de actualización y probar errores sin navegación/pérdida de estado.
5. Versionar recursos PWA, comprobar tests/navegador y publicar código sin tocar datos.
