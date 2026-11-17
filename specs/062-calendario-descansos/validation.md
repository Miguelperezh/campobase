# Validación SDD062 — 17/11/2026

## Datos cotejados y preservados

Los dos PDF aportados mantienen sus SHA-256 originales. Su cotejo independiente y revisión visual de las ocho páginas confirma 16 partidos, ocho en casa y ocho fuera, sin discrepancias de fecha, hora, rival, condición o campo. Las fechas de la fila del encuentro prevalecen sobre la fecha general de jornada; J5 es 13/01/2027 a las 18:30. Se utilizan nombres/direcciones de campo publicados para sus enlaces Maps; no se inventan calles ni coordenadas para Jardín de Infancia F8.

Una lectura remota posterior volvió a comparar todos los campos del lote de 16 partidos con los payloads guardados: idénticos. El equipo conserva 27 partidos activos (11 anteriores y esos 16). No se actualizó ningún partido durante esta continuación.

J6 (24/01/2027) y J15 (18/04/2027) están confirmadas por ambos documentos como descanso. Se insertaron únicamente dos registros nuevos `configuracion`, `recordType: calendarRest`, con título «Descansa», fecha sin hora, jornada, temporada y tipo de competición. Propietario comprobado mediante ajustes y equipo, sin cambiar `main`, PIN, permisos, colores ni planes. No se convierten en partidos ni sesiones.

La operación aditiva confirmó dos inserciones, cero omisiones y dos entradas normales de auditoría. Todos los registros de configuración anteriores conservaron su contenido completo; las filas pasaron de 220 a 222. Los 51 registros de partidos, incluidos los borrados lógicos, conservaron su contenido completo. Jugadores, convocatorias, asistencias, equipos, miembros, suscripciones y sus historiales mantuvieron sus huellas de versiones MVCC durante la transacción. Estas huellas detectan cambios de versión sin descomprimir el historial multimedia. No hubo UPDATE, DELETE, restauraciones de tombstones ni cambios de esquema.

La comprobación después de COMMIT leyó las dos anotaciones con sus fechas exactas y un único titular, y volvió a confirmar los 16 partidos por todos sus campos. El total de partidos activos sigue siendo 27.

## Cliente y permisos

Las anotaciones se derivan del mismo snapshot de ajustes protegido por cuenta/PIN/rol que el resto de la vista. Solo se muestran en Calendario, con tarjetas y tema existentes, marcador mensual, filtros Todos/Liga y selección de día. Se intercalan entre próximos por fecha; al pasar permanecen fuera de Partidos jugados. No aparecen en selectores de convocatoria ni en los datos deportivos.

El único cambio de servidor es una línea de lectura: `calendarRest` exige el permiso Calendario ya vigente. `canWriteMutation` permanece intacta. Se comprobó el bundle remoto anterior frente a la base del repositorio y se conservó el resto literalmente. `delegate-sync` v5 está ACTIVE, `verify_jwt: true`; el bundle recuperado después del despliegue coincide exactamente con los dos archivos revisados. No se cambiaron cuentas, concesiones, PIN ni políticas SQL.

## Pruebas

- `npm run check`: correcto. `npm test`: **965 correctas, cero fallos, omitidas o canceladas**.
- Pruebas de calendario: fechas imposibles/no textuales descartadas, fuente sin mutaciones, escapado de textos, día y jornada sin hora/rival/acciones de partido. El test mensual mantiene puntos simultáneos y diferencia descanso de partido.
- Contexto de cuenta: snapshot A retenido no sobrescribe descanso B; cambio de PIN o rol invalida la lectura, con los helpers reales.
- Servidor: 13 pruebas del área delegado correctas, incluidas tres nuevas para PIN/correo. Lectura solo con Calendario, registros de otro propietario excluidos aun con IDs iguales, upsert/delete denegados sin RPC y revocación durante respuesta retenida bloqueada.
- Navegador completo aislado a 1440/390: 16 partidos, dos descansos, sesión e histórico sintéticos; orden, mes, filtros, día seleccionado, conservación de sesión del mismo día, ausencia de convocatoria/archivo jugado para descansos, vista heredada y cuenta A→B. Los cinco almacenes completos son idénticos antes/después; cero errores de página o escrituras externas.
- Smoke general v19 completo: correcto en ordenador y móvil, incluida navegación, preparación, conservación de alineación y creador de ejercicios. Solo se adaptó la ruta local de Playwright en una copia temporal para ejecutarlo.

Los anchos de navegador no son una prueba en un teléfono físico. Las pruebas no enviaron WhatsApp ni usaron cuentas deportivas reales para generar datos de prueba. La comprobación real del servidor recuperó código y las lecturas de producción verificaron únicamente los registros autorizados.

## Publicación

Build preparada `20261117-calendar-rests-1`, con HTML, registro SW y recursos cambiados versionados. Pendiente de registrar revisión/CI, integración en main y comprobación de los recursos públicos; la inserción y verificación de los dos datos ya está confirmada arriba.
