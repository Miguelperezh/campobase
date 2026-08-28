# CampoBase 1.7.0 — horarios 24 h y sesión estable

Estado: candidato. PWA estática en español con Supabase como fuente compartida e IndexedDB como caché offline.

## Flujo de uso

1. Plantilla: crear jugadores en orden alfabético y añadir una foto desde la cámara o galería del móvil.
2. Convocatorias: crear o editar, marcar exclusiones y revisar la lista. La rotación completa hasta 14 jugadores únicos. Si alcanza a alguien excluido antes por enfermedad o decisión técnica, un diálogo propio permite decidir expresamente si entra.
3. Partido en vivo: preparar porteros, pulsar Comienzo, registrar cambios, marcador e incidencias; Descanso/Segundo tiempo/Final controlan el flujo. Al finalizar, Migue puntúa obligatoriamente a cada convocado del 1 al 5. El delegado solo pausa y avisa a Migue. Auto-pausa a 38:00 y 74:00.
4. Calendario: crear partidos con selectores propios de hora `00–23` y minuto `00–59`, independientes del formato regional del dispositivo.
5. Asistencia: registrar o editar cualquier fecha; indicar la llegada con selectores propios de 24 horas si llega tarde. Al guardar permanece en Asistencia y el listado se ordena por fecha.
6. Acceso: el primer uso configura una sola vez dos PIN distintos. Después, cada sesión pide el PIN una vez. El rol se conserva mientras siga abierta la pestaña, incluso si el navegador recarga la PWA; “Cerrar sesión” o una pestaña nueva vuelven a pedirlo. El de Migue da acceso total; el del delegado solo permite tiempos, cambios e incidencias del partido. Un valor erróneo muestra “PIN incorrecto”.
7. Ajustes: elegir Fútbol 7 o Fútbol 11, consultar el estado de sincronización y exportar copias JSON.

## Modalidades

- F7: 7 jugadores en campo, 70 minutos, mitades de 35.
- F11: 11 jugadores en campo, 90 minutos, mitades de 45.
- La modalidad activa se guarda en IndexedDB, se muestra en la cabecera y se aplica a convocatorias y partidos nuevos. Los históricos conservan su modalidad original.

## Datos y permisos

Supabase conserva los documentos compartidos e IndexedDB funciona como caché y cola offline. La asistencia de partido se crea automáticamente al finalizar y puede corregirse desde Asistencia. Las puntuaciones quedan tanto en `matches.ratings` como en `players.ratingHistory`. Las fotos se guardan como base64 en el `payload` del jugador, con un máximo de 2 MB de archivo original; no hace falta crear un bucket de Storage ni ejecutar SQL adicional. Los hashes y la sal de los PIN se guardan en `configuracion` para compartir el mismo acceso entre dispositivos; nunca se guarda el PIN en claro.

La app usa `@supabase/supabase-js` 2.57.4 (licencia MIT). La distribución UMD está vendorizada en `vendor/supabase.js`; no depende de un CDN para arrancar offline.

## Activación de Supabase

1. Abrir Supabase → SQL Editor en el proyecto de CampoBase.
2. Ejecutar íntegramente `supabase/schema.sql`.
3. Abrir primero CampoBase en el dispositivo que ya contiene los datos y PIN canónicos. La migración subirá los hashes existentes; si las tablas están vacías, también subirá la caché inicial.
4. Esperar a que la cabecera muestre “Supabase sincronizado”.
5. Abrir los demás dispositivos. Se descargarán los datos y los dos accesos ya configurados; cada entrada pedirá el PIN correspondiente.

Las altas, cambios y borrados se guardan primero en IndexedDB. Con red se envían inmediatamente; sin red quedan en `syncQueue` y se reintentan al volver la conexión. La nube se consulta cada 10 segundos. El conflicto simple es “última escritura recibida”: dos ediciones simultáneas del mismo registro pueden sobrescribirse.

## Pruebas observadas

- `npm test`: 40 pruebas automatizadas en 1.7.0.
- `npm run check`: comprueba sintaxis de dominio, sincronización, base local, app y service worker.
- La conexión real con Supabase solo puede verificarse después de ejecutar `supabase/schema.sql`; PrograMARIO no ejecuta SQL ni despliega desde este encargo.

## Límites

- La publishable key es pública y RLS permite CRUD a `anon`: cualquiera que obtenga la URL y la clave puede leer, modificar o borrar los datos y los hashes salados de los PIN. Un PIN numérico corto podría probarse por fuerza bruta; el PIN solo es una puerta de interfaz y Supabase Auth queda fuera de alcance.
- Las fotos base64 aumentan el tamaño de cada documento y de las copias JSON. El límite de 2 MB evita cargas descontroladas, pero conviene usar imágenes pequeñas.
- No guardar diagnósticos ni información médica sensible en lesiones o notas.
- Dos ediciones offline del mismo registro se resuelven por la última que llegue al servidor, sin combinación de campos.
- El reloj depende del dispositivo y no sustituye el acta arbitral.
- “Tardanzas frecuentes” se activa desde 3 tardanzas registradas.
- Todos los campos que incluyen hora son controles HTML propios de 24 horas; solo la fecha sin hora conserva el selector nativo de calendario.
- Borrar un jugador conserva identificadores en históricos como “Jugador eliminado”.

## Recuperación / rollback

Exportar JSON antes de actualizar. Para restaurar, Ajustes → Importar JSON. Si 1.7.0 falla, volver a servir 1.6.0 e importar la copia. El SQL y el formato de datos no cambian en 1.7.0; las fechas y horas siguen guardándose como `AAAA-MM-DDTHH:MM` y `HH:MM`.

## Desarrollo

Node.js 18+: `npm test`, `npm run check`. Servidor local: `python3 -m http.server 8766`.
