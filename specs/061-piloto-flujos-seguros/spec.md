# SDD061 — Flujos claros y seguros para el piloto

Petición del 24/10/2026: mejorar CampoBase preservando datos, colores, planes y comportamientos validados. Esta entrega resuelve fallos reproducidos antes de ampliar funciones.

## Criterios
- Sincronizar ahora funciona, conserva la pantalla y nunca anuncia éxito por tener internet o cola vacía sin confirmación de nube.
- Titular y delegado ven un estado comprensible: comprobando, sin conexión, pendientes, bloqueados o sincronizado. Un cambio de cuenta invalida lecturas anteriores. Los borradores bloqueados se conservan y no se reintentan automáticamente.
- Actualizar respeta formularios y selecciones de cambios en directo; no fuerza reconstrucciones ni confirma una sincronización cancelada.
- Abrir asistencia liga datos y permisos al contexto de apertura. El guardado verifica dependencias y escribe registro/cola en la misma transacción. Cancelar borrar una sesión no limpia asistencias históricas ni registros ajenos.
- Hoy abre exactamente la sesión, partido, convocatoria o asistencia elegidos, distingue estados terminales históricos y nunca mezcla snapshots entre cuentas. Las acciones se autorizan de nuevo al ejecutarlas.
- Calendario no inventa hora ni presenta como planificada una sesión realizada.
- El titular puede copiar un informe de soporte sin PIN, tokens, contactos, nombres, IDs ni contenido deportivo. No se envía automáticamente.
- Pruebas con datos sintéticos, errores/red retenida y 1440/390. No escribir datos de prueba en producción ni alterar backend/PIN/permisos reales.
