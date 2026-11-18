# Validación

Pruebas locales con cuentas y registros sintéticos. La publicación no requiere acceder a los datos remotos.

## Medición inicial pública

Chrome limpio a 390 px, descarga 200.000 B/s, subida 50.000 B/s, latencia 300 ms y CPU x4. Sin sesión, peticiones Supabase interceptadas, sin escrituras externas. Build 20261117-calendar-rests-1: primer arranque hasta state.dataLoaded 11.129 ms, 362 peticiones del contexto y 1.839.388 bytes de página observados por CDP; apertura posterior 1.668 ms. El tráfico de workers no recibe necesariamente el mismo límite CDP: el resultado posterior no demuestra ausencia de bloqueo de caché. No es medición física ni de desbloqueo de cuenta real.

## Reproducciones causales

- Con hoja de fuentes retenida 5 segundos y recursos locales rápidos, navegador real: enlace anterior 5.400 ms hasta datos locales; enlace no bloqueante 322 ms. Cero librerías PDF al arrancar, errores JS o escrituras externas.
- Worker anterior: navegación, app.js y domain.js seguían pendientes con respuesta de red retenida aunque existía copia activa. Imágenes cacheadas respondían inmediatamente.
- Desbloqueo SaaS anterior retenía diálogo durante perfil+sync+permisos aun con copia local. SDK getSession puede esperar renovación de token; el PIN titular comprobado localmente se separa de esa renovación.

Las mediciones aisladas prueban cada dependencia; no deben presentarse como promesa de esos tiempos en todos los teléfonos.

## Comprobaciones antes de publicar

- Chrome con servidor HTTP aislado. Reapertura y modo offline con 143 módulos desde el worker, una sola navegación en primera instalación y mismos registros y tema antes/después. El formulario real acepta el PIN verificado de la cuenta vinculada sin conexión. Una respuesta tardía de otra sesión ya no sustituye el formulario ni cambia la cuenta.
- 1007 pruebas Node y sintaxis correctas. Se cubren instalación incompleta, nuevas versiones, peticiones retenidas, expiración, cambio de identidad durante el PIN, cachés ajenas, carga PDF bajo demanda y compatibilidad.
- Smoke v19 correcto. Exportación real de PDF desde Chrome a 1440 y 390 píxeles. Se mantienen hoja A4, escudo y colores configurados.
- Se adelanta la lectura de los dos módulos grandes del catálogo para solaparla con las dependencias iniciales. En la primera visita sigue haciendo falta descargar el catálogo.
