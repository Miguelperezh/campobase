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

## Publicación y medición en producción

[PR 148](https://github.com/Miguelperezh/campobase/pull/148) integrada en `main` en `6b6d54d9`. [Publicación correcta](https://github.com/Miguelperezh/campobase/actions/runs/44348083699) del build `20261118-mobile-start-1`. Se cotejaron por SHA-256 el HTML, el worker, la aplicación, las dos piezas de acceso y la exportación PDF con los archivos publicados.

Mismo Chrome de 390 px, CPU x4 y conexión simulada que en la medición inicial. Tiempo desde navegación hasta datos locales cargados. Una observación por escenario y versión, sin utilizar una cuenta real.

| Apertura | Anterior | Publicada |
| --- | ---: | ---: |
| Primera visita, sin copia instalada | 11,129 s | 9,760 s |
| Reapertura con versión instalada | 1,668 s | 0,542 s |

La primera visita pasó de 362 a 153 peticiones del contexto hasta datos cargados. Las dos mediciones devolvieron la versión esperada y la segunda apertura estuvo controlada por el worker. Sin errores JavaScript. En prueba de red retenida independiente, carga local en 140 ms y sin red en 139 ms, 143 módulos de la copia instalada. El formulario real del titular de prueba desbloqueó su cuenta local offline en 92 ms desde el inicio de la interacción. El delegado sigue necesitando verificar sus permisos vigentes.
