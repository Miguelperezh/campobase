# Validación SDD059

## Alcance e integridad

Rama `feat/piloto-aislamiento-recuperacion`, base main `9aab1ed2`. Usuario confirma un equipo por cuenta. Sin seeds, reasignación de usuarios, cambios de PIN/permisos, modificaciones deportivas ni ensayos de escritura sobre cuentas reales. Esquema local3 aditivo. Publicación de código y controles del servidor autorizada por la petición de piloto y las autorizaciones persistentes de main/producción.

Auditoría real: RLS existente ya denegaba lectura anónima; la excepción de delegado por correo permitía REST de su equipo como titular. Storage permitía escrituras anónimas por bucket. Se preserva SELECT de la biblioteca y se restringen escrituras propias. `equipo_miembros.user_id` y `equipos_cuenta.owner_user_id` son únicos. No se añaden relaciones entre clubes ni equipos.

Consultadas documentación vigente Supabase RLS/sesiones/changelog, políticas/funciones/esquema, logs y asesores. SQL revisado de forma independiente. CLI Supabase no instalado: artefactos SQL con nombre semántico y aplicación por herramienta de migraciones, sin inventar versiones temporales.

## Pruebas aisladas

- Suite Node y sintaxis completas: comprobadas antes de fusionar; resultado final registrado al publicar.
- `browser-pilot-database-isolation.mjs`: 57 comprobaciones por ancho (1440/390), cero solicitudes externas. A/B con IDs iguales, PIN/rol, respuesta retenida de lectura/subida, B sincroniza después de A, v2→v3 y apertura bloqueada/reintento, legacy acreditado, candidatos PIN, colas, importación abortada/revisión de perfiles, respaldo durable tras recarga y jamás en nube, relojes antiguos sin reparación.
- `browser-pilot-account-view.mjs`: app completa a 1440/390, cero pageerrors; respuestas A descartadas después de B, tema vacío/permisos vacíos canónicos, rechazar importación ajena/delegado, cancelar sin cambios, restaurar con respaldo, cambio de cuenta durante confirmación, offline pendiente, recarga y Campo con caché ajena. Todas las peticiones externas interceptadas.
- Pruebas unitarias ejecutables de adaptador: usuario esperado, SDK que cambia JWT durante envío, snapshots/Storage retenidos, correo/PIN delegado Edge, RPC sin contexto falla cerrado, perfiles/versiones atómicas, revocación entre lectura y RPC conserva error tipado.
- Revisión independiente detectó y cerró actor mutable en invitaciones/permisos y colisión de ID numérico/texto en backups. Probar handler de invitación con transporte ficticio, sin enviar correos reales.
- Campo autónomo: PASS 1440/390 con DOM real, adaptador canónico y SDK ficticio; cero pageerrors o UI de la app principal. Asistencia/recarga y cierres conservan campos; delegado por Edge, revocación, snapshots restringidos, formulario A reutilizado bajo B y applied:false conservan borrador/versión posterior. Se separan reglas puras de demo y carga de ayudas DOM; arranque con readyState compatible.
- Login PIN: verifier efímero sin persistencia, commit de sesión con guardia justo al escribir storage y comprobaciones tras cada espera en ambos formularios. Tests ejecutan hook real con transporte ficticio retenido y comprueban que A no sustituye sesión B. Sesión caducada se rechaza antes de refrescar otro token.

## Servidor y despliegue

Secuencia: funciones privadas/contexto/RPC owner/delegate v2 → Edge delegate-sync → wrapper de permisos/invite → frontend validado → políticas restrictivas/revocación RPC actor-less → probes READ ONLY y huellas. Ninguna migración ejecuta DML sobre datos existentes.

Aplicado primer tramo de funciones/contexto/RPC mediante `pilot_context_and_atomic_writes`; delegate-sync v4 ACTIVE, verify_jwt=true. Wrapper de gestión aplicado mediante pilot_delegate_management_actor; invite-delegate v2 ACTIVE, verify_jwt=true. El cierre de políticas y sus pruebas finales se registra abajo.

La primera publicación de invite-delegate fue rechazada automáticamente por borrados de entidades provisionales presentes en su código. Se contrastó con la función v1 desplegada: exactamente el mismo archivo base y bloque de limpieza idéntico byte a byte. Solo se añaden validación/actor esperado antes de operaciones privilegiadas; no se invoca la función. Con esa evidencia, el segundo despliegue fue aprobado. No se envió ningún correo ni se creó/eliminó un invitado.

EXPLAIN de la consulta real del UPSERT de perfiles en transacción READ ONLY confirma sintaxis, índice de conflicto y filtro current_row.updated_at<=excluded.updated_at; no ANALYZE ni ejecución de DML.

Huellas previas inmediatas (conteos, sin exportar contenido): jugadores54, partidos34, convocatorias43, asistencias42, configuracion205, miembros3, objetosStorage0. Las diferencias respecto a la lectura del día anterior se conservan tal cual: no se restauró una foto antigua ni se intentó igualarlas con escrituras.

Probes de permisos ejecutan roles simulados solo en transacciones READ ONLY y devuelven agregados. No constituyen inicio de sesión ni prueba en móvil físico. Se corrige el probe de introspección que intentaba resolver la función privada desde anon: el permiso se consulta tras RESET ROLE, sin conceder acceso adicional.

## Límites

Nube de pruebas simulada para escrituras; no se escriben deportes, invitaciones o permisos reales para comprobar. No se promete cero fallos ni se declara móvil físico validado. El bucket existente de biblioteca conserva su lectura pública; no se convierte en un repositorio privado de archivos. Históricos sin procedencia se conservan separados para recuperación revisada. Las pestañas con código antiguo deben actualizarse para recibir todas las guardias nuevas.


## Corrección detectada por CI antes de publicar

La primera prueba crítica de GitHub falló porque entrar en demo durante el arranque cancelaba correctamente una lectura antigua, pero el consumidor de Cuerpo técnico la registraba como error y la rutina de inicialización dejaba de continuar. Se cancela ese render sin vaciar la pantalla nueva, el arranque reintenta su snapshot actual y no ejecuta la limpieza automática histórica de ejercicios. Una sesión anónima/demo tampoco pide contexto de equipo al servidor. Prueba crítica v19 completa repetida localmente: correcta (subpestañas, preparación, guardado, + Ejercicio y móvil). Se añaden tres regresiones de cancelación/arranque; no se fusiona el control fallido.

La cuenta GitHub no permite modificar workflows con su alcance OAuth actual. Se conservó el workflow original; las tres suites nuevas están versionadas y se ejecutaron localmente con sus resultados registrados arriba. CI mantiene sintaxis, suite Node y prueba crítica existente.


## Cierre de servidor y publicación — 24/10/2026

Frontend integrado mediante PR143, main c553bb5e; 923 pruebas, CI de PR39959206707, main39959478277 y Pages39959478255 correctos. Publicación de21 recursos verificada por SHA256. La corrección posterior de WhatsApp SDD060 está integrada en main791892dd y verificada con22 recursos públicos idénticos; no altera la lógica del piloto.

El intento agrupado de políticas devolvió «Invalid or expired requestState»; la inspección posterior confirmó que no se habían aplicado. No se siguió repitiendo el mismo lote: se aplicaron cambios pequeños, ALTER sobre políticas existentes y CREATE para las nuevas, con lock_timeout3s y statement_timeout15s. Migraciones confirmadas:

- pilot_owner_isolation_gate_final.
- pilot_media_own_writes_final.
- pilot_legacy_rpc_gate_final.
- pilot_anonymous_explicit_denial_final.

Las políticas con helper privado se limitan a authenticated. La primera prueba anon detectó permiso de función requerido incluso con CASE; se resolvió mediante denegaciones anon separadas sin conceder acceso al helper. Las cinco tablas deportivas tienen puerta restrictiva propia y denegación anónima. Storage conserva SELECT público de biblioteca; INSERT/UPDATE/DELETE requieren titular, propietario y prefijo propios, con denegación anon de ese bucket. No se elimina ninguna fila ni objeto. RPC antiguo no ejecutable por PUBLIC/anon/authenticated/service_role; v2 solo service_role y RPC owner solo authenticated.

Probe final READ ONLY correcto: titular ve54 jugadores propios,0 ajenos y sus ajustes; delegado por correo ve0 jugadores/ajustes por REST, conserva contexto de equipo y no puede ejecutar ninguna RPC de escritura directamente; anon ve0 jugadores/ajustes y no puede ejecutar el helper. Es verificación real de permisos del servidor mediante roles simulados, sin escribir datos ni iniciar sesión en móviles físicos.

Comparación inmediatamente antes/después del último cierre: conteos y huellas de9 conjuntos idénticos (jugadores54, partidos34, convocatorias44, asistencias42, configuración206, miembros3, equipos3, perfiles3, objetos0). En las lecturas más separadas durante la actividad de la app cambiaron huellas de jugadores/configuración sin cambio de conteos; ninguna operación de este trabajo ejecutó DML deportivo y no se revirtió ninguna edición ni se igualó una foto antigua.

Asesores de seguridad consultados después: no se declaran cero avisos. Persisten avisos anteriores de funciones públicas y funciones/tabla de administración que necesitan revisión independiente; no se amplían concesiones para silenciarlos. Referencia del [asesor de funciones públicas](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable). Esto no equivale a una auditoría completa de seguridad ni a garantía de cero incidencias.
