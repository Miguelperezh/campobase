# Validación SDD046 · 09/10/2026

## Resultado
Identidad Auth propia de PIN delegado, vinculada al equipo del titular. Los dos roles utilizan las mismas filas remotas canónicas; las copias IndexedDB están aisladas por identidad. Escrituras autorizadas de vivo/asistencia van al mismo equipo, nunca a un equipo de demostración. Colores/PIN/permisos/configuración general no admiten escrituras del delegado. Lectura de cuerpo técnico disponible solo con ese permiso.

## Pruebas
- 798 tests y verificación de sintaxis correctos; CI y smoke de navegador aprobados.
- Handler Edge ejecutado con servidor simulado: escritura/lectura del mismo vivo, retirada y reconcesión sin cambiar permisos reales, asistencia restringida, color/main denegado, otro partido/otro equipo denegados y sesión anterior a cambio de PIN rechazada.
- Autenticación real: dos sesiones con PIN 0000; identidad distinta del titular y mismo vínculo remoto. Ambas reciben exactamente los mismos colores/permisos.
- Servidor real: lectura protegida de los mismos 16 jugadores, 6 convocatorias, 9 partidos, 18 asistencias; configuración filtrada. Intento de escribir main denegado 403; lectura directa REST de configuración owner denegada mediante RLS. RPC de contexto devuelve permisos actuales.
- Navegador Chromium aislado a 1280 y 390 px: carga real, salida y reentrada PIN; 16 jugadores, 9 partidos, permisos/tema idénticos, Actualizar visible y cero errores de página. Todas las escrituras deportivas bloqueadas en la prueba; cero intentos de escritura real.
- Antes/después de despliegue backend, mismas cuentas y sumas de comprobación en tablas deportivas/configuración: jugadores 54, convocatorias 41, partidos 33, asistencias 36, configuración 198. No se reescriben datos, planes, colores, PIN ni permisos del titular.

## Hallazgos resueltos
Auth añade app_metadata después del INSERT inicial: el trigger original creaba la cuenta técnica como coach. La función de provisión posterior valida su identidad técnica y solo modifica su perfil/vínculo, sin tocar datos deportivos. Una petición de limpiar equipo/subscripción vacíos fue rechazada por revisión automática; no se ejecutó, ambos se conservan. Los datos sincronizados proceden siempre del equipo del titular.
Las escrituras usan función service-only SECURITY INVOKER y transacción que vuelve a comprobar permisos/cobertura de partido activo y revisión; no permite revivir un partido cerrado. La provisión no obtiene acceso directo a auth.users: Auth Admin verifica metadatos y pasa identidad/owner al RPC exclusivo service_role.

## Límites
No se han modificado permisos reales ni registrado goles/cambios/asistencias reales como prueba. La escritura bidireccional y concesión/retirada se validan con servidor simulado; la autenticación, lecturas, bloqueo de colores y frontend se prueban contra servidor real. Ancho móvil en Chromium no equivale a iPhone físico. Delegado usa polling canónico de 10 segundos y Actualizar; no tiene canal REST/Realtíme directo que pueda saltarse permisos.
Advisors: avisos heredados de funciones públicas SECURITY DEFINER y search_path en trigger de suscripción, sin relación con los nuevos RPC service-only; se documentan, no se cambia facturación ni RPC ajenos. Referencias: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable y https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable.

## Publicación comprobada
PR130 integrado en main, merge ea8d55fd9f0f69146bd43b433c23568da16bdd4b. GitHub Pages run 37939506283 terminó success. Producción sirve versión 20261009-delegate-pin-7; nueve archivos index/app/auth/db/cloud/saas/team/SW/policy comparados byte a byte con el código validado, todos idénticos. El módulo .mjs se sirve como text/javascript. PIN-login v6 y delegate-sync v3 activos. Ningún secreto/token de las pruebas se incorpora al repositorio.
