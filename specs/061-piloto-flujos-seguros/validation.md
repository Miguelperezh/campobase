# Validación SDD061 — Flujos claros y seguros para el piloto

Fecha: 24/10/2026. Rama de trabajo: `feat/piloto-estado-recuperacion`. Esta entrega está implementada y probada en un entorno aislado; su publicación en main y producción sigue pendiente.

## Alcance comprobado

- El estado de sincronización distingue comprobación, desconexión, acceso pendiente, cambios pendientes, borradores bloqueados y confirmación de nube. Tener conexión o una cola vacía por sí solos no anuncian éxito. El informe de soporte utiliza una lista cerrada de siete campos y no incluye credenciales, contactos, identidades ni contenido deportivo.
- Actualizar conserva el formulario y las selecciones en uso; una respuesta anterior de otra cuenta no cambia el estado actual ni confirma una sincronización cancelada.
- La asistencia visual comprueba cuenta, base, revisión PIN, rol y permiso al abrir, después de las esperas y antes de guardar. La actividad, convocatoria, asistencia original y plantilla se comparan dentro de la misma transacción que guarda el registro y su mutación en cola. Un conflicto o rechazo conserva el borrador y los datos existentes. El guardado local no espera a la nube y su mensaje dice expresamente «en este dispositivo».
- Se retiró la limpieza general automática de asistencias huérfanas. Cancelar el borrado de una sesión conserva esos registros. Dos sesiones del mismo día no adoptan la asistencia vinculada a otra: se busca primero el ID exacto; el legado por fecha requiere una única sesión y un único registro sin vínculos.
- Hoy abre exactamente la sesión, partido, convocatoria o asistencia elegidos, reutilizando los controladores canónicos y sus permisos. Ver una convocatoria existente no abre su editor; una convocatoria nueva abre el partido seleccionado y cancelar no escribe.
- Hoy descarta lecturas antiguas y bloquea acciones de un panel perteneciente a otra cuenta/PIN/rol. Su nombre y escudo proceden del mismo snapshot de ajustes que sus partidos, sin leer una cabecera anterior; si faltan, muestra «Equipo» y ninguna imagen. Los cierres explícitos históricos no reaparecen como próximos o faltas de convocatoria; un gol o minutos parciales no cierran el directo. La asistencia histórica sigue disponible.
- Calendario muestra «Hora pendiente» cuando no hay una hora válida y distingue sesión realizada de planificada sin modificar el registro.

## Pruebas automatizadas

`npm run check` terminó correctamente. La ejecución completa de `npm test` registrada para esta entrega obtuvo **959 pruebas correctas, 0 fallos, 0 canceladas y 0 omitidas**. Incluye las regresiones nuevas de estado de sincronización, diagnóstico, asistencia, actualización y Hoy.

El área de Hoy se ejecutó también por separado mediante `node --test tests/today-dashboard.test.js tests/today-dashboard-pilot.test.js`: **15/15 correctas**. Comprueba cierres históricos, directo parcial, dos sesiones y partidos del mismo día, acciones exactas, lecturas retenidas A→B, cambios de PIN/rol, respuestas fuera de orden, botones de un DOM anterior e identidad B con cabecera A o sin ajustes.

| Prueba de navegador | Resultado en 1440 y 390 px | Cobertura |
| --- | --- | --- |
| [`browser-sync-diagnostics.mjs`](../../tests/browser-sync-diagnostics.mjs) | 18 comprobaciones por ancho; 0 solicitudes externas y 0 errores de página | IndexedDB real y cuentas sintéticas A/B; diagnóstico retenido, demo, dependencias cambiadas, referencia ausente, colección de asistencias, plantilla cambiada y cancelación atómica de registro/cola. |
| [`browser-pilot-sync-feedback.mjs`](../../tests/browser-pilot-sync-feedback.mjs) | 25 comprobaciones funcionales por ancho; 0 errores de página | App completa, botón real de sincronización, offline/acceso pendiente/error sin falso éxito, borrador bloqueado, informe sin datos privados y alternativa cuando falla el portapapeles, diagnóstico A descartado tras B, conservación de jugador/partido/tema y aviso sin recorte. Las peticiones externas se interceptan. |
| [`browser-pilot-attendance-refresh.mjs`](../../tests/browser-pilot-attendance-refresh.mjs) | 26 comprobaciones por ancho; 0 solicitudes externas y 0 errores de página | Formulario real del módulo con almacenamiento/nube simulados: actualización sin perder borrador, cuenta/PIN/rol/permisos, rechazo, conflicto después de pulsar Guardar, cambio de plantilla durante la espera y conservación de registros históricos. |
| [`browser-pilot-today.mjs`](../../tests/browser-pilot-today.mjs) | Correcta en ambos anchos; 0 errores de página y 0 escrituras remotas | App completa con IndexedDB aislado: dos sesiones exactas, dos partidos exactos, asistencia vinculada, ver convocatoria, crear/cancelar la del partido correcto, estados terminales, lectura A→B retenida e identidad desde su propio snapshot. Comparación de registros deportivos antes/después de las acciones: idénticos. |

Las pruebas de Hoy se ejecutaron directamente durante la implementación y se repitieron tras integrar los controladores y corregir la identidad del equipo. El resto de resultados de la tabla corresponde a las ejecuciones registradas por los agentes de sus respectivas áreas. Los recuentos de navegador describen sus comprobaciones funcionales, no pruebas con dispositivos físicos.

## Revisión y correcciones derivadas

La revisión independiente identificó dos casos de pérdida o incoherencia local que se corrigieron antes de este registro: reutilización de la asistencia de otra sesión del mismo día y cambio de plantilla entre la comprobación inicial y la transacción de guardado. La revisión de Hoy añadió el caso de una cabecera del equipo A aún visible mientras terminaba el snapshot del equipo B. Hay pruebas específicas de los tres casos.

## Investigación y cierre del smoke general

El primer smoke v19 agotó los 20 segundos al entrar en móvil. La repetición con observadores instalados antes de cargar reprodujo la causa: `ERR_CONNECTION_RESET` al descargar el módulo local obligatorio `exercise-planning.js`. El servidor HTTP de pruebas de Python 3.9 admitía solo cinco conexiones en espera, insuficientes para ese arranque en frío. No era una respuesta de Supabase ni un fallo de datos.

Se aumentó únicamente la cola del servidor de pruebas a 128 conexiones y se adelantó la captura de errores de arranque; un módulo local que falle ahora identifica su ruta y motivo. No se amplió el límite de 20 segundos ni se modificó el producto para ocultarlo. El contraste combinado registró la API disponible en 518 ms (ordenador) y 415 ms (móvil); la repetición del smoke corregido terminó completa con `Browser smoke v19 OK`, incluidos navegación, Preparación, persistencia del plan, creación de ejercicio y guardado. Se adaptó solo la ruta local del paquete Playwright en una copia temporal para ejecutarlo; el test versionado mantiene su importación habitual de CI.

Revisión independiente final sin bloqueantes de cuenta o confirmación. Se endureció también la lista cerrada del informe frente a claves heredadas (`constructor`/`__proto__`); sus siete pruebas pasan.

## Límites y publicación

- Se ha usado Chrome automatizado con ventanas de 1440 y 390 px. El ancho de 390 px no valida un iPhone, Android ni Safari físicos.
- Los datos utilizados son sintéticos y viven en perfiles/almacenamientos de prueba. Las pruebas sí crean y editan esos registros locales de prueba; **no escriben en la nube ni alteran datos deportivos reales**.
- Esta entrega no aplica cambios de backend, SQL, RLS, Edge Functions, PIN ni permisos reales. Conserva los diseños, colores, planes y datos existentes; la integración toca código de cliente, pruebas y documentación.
- Las pruebas con nube simulada no certifican sincronización real entre dos móviles ni la calidad de su conexión durante un partido.
- Quedan pendientes el PR, los controles de CI y la verificación de main/Pages con los recursos públicos correspondientes. No hay confirmación de publicación de SDD061 en este documento.
