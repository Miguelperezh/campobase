# Validación de la baja de jugadores

Se reprodujo el fallo inicial en Chrome sobre la revisión 67de3bd4. El botón recibía el clic y la confirmación nunca se abría.

- Chrome a 1440 y 390 píxeles, con almacenamiento nuevo, sin conexión externa y dos equipos ficticios. Se comprobó la cancelación, la confirmación con nombre y dorsal, el jugador homónimo, la clave numérica de una copia antigua, la recarga y la conservación de partidos, convocatoria y asistencia.
- Cambiar de cuenta o pasar a delegado durante el aviso impidió borrar. Editar la ficha desde otra operación conservó la edición y exigió una nueva confirmación.
- Prueba de almacenamiento en navegador con nube simulada. Una descarga anterior a la baja y un recálculo simultáneo conservaron la baja, el alta remota independiente y el registro de sincronización correcto.
- Las 1007 pruebas de Node y la comprobación de sintaxis pasaron. La prueba específica se ejecuta con node tests/browser-player-delete.mjs.
- Las pruebas no usaron cuentas deportivas reales. La verificación de producción compara los archivos públicos con los de la versión probada.
