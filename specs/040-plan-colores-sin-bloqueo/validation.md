# Validación 09/10/2026

775 tests pasan, 0 fallos; npm run check y sintaxis del nuevo catálogo correctas. En Chrome con los módulos reales, fixture sin acceso a Supabase y jugadores ficticios: cambiar barras de campo a azul/morado no destruye el panel; guardar persiste tras recarga; Escape cierra únicamente ajustes. Totales antes/después: 35,35,35,70,35. En la comprobación anterior, Cancelar revirtió nombres sin perder el color guardado. Un fallo de polling/autenticación no reconstruye la pantalla ni inicia Realtime sin conexión válida. Prueba de actualización conserva rol/vista/tema, serializa clics y muestra fallo/autenticación en vez de éxito falso.

SDD039 ya está publicado (ec98e5fa): WhatsApp directo solo ofrece su convocatoria; usa ID/campo/hora real y citación 45 min antes. La consulta previa de solo lectura identifica el partido del 9/10/2026 19:00 en E.M. Jinámar Pedro Miranda. No se ha corregido ni escrito ese registro. Cola durable y ACK de versión exacta probados con nube simulada: no equivale a sincronización física validada.

Límite concreto: pin-login desplegado valida el PIN titular; un PIN delegado heredado sin sesión cloud no obtiene por sí solo una sesión remota. No se entrega un token de titular al delegado ni se cambian permisos/RLS para ocultar el problema. La entrada y sincronización del móvil real siguen pendientes de comprobación autenticada. Ninguna prueba de esta fase modifica datos reales.

Publicación: pendiente de CI/despliegue y comparación de archivos públicos.
