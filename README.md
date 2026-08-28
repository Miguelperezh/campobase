# CampoBase 1.5.0 — Supabase + caché offline

Estado: candidato. PWA estática en español con Supabase como fuente compartida e IndexedDB como caché offline.

## Flujo de uso

1. Plantilla: crear jugadores.
2. Convocatorias: crear o editar, marcar exclusiones y revisar la lista. Si la rotación alcanza a alguien excluido antes por enfermedad o decisión técnica, decidir expresamente si entra.
3. Partido en vivo: preparar porteros, pulsar Comienzo, registrar cambios, marcador e incidencias; Descanso/Segundo tiempo/Final controlan el flujo. Al finalizar, Migue puntúa obligatoriamente a cada convocado del 1 al 5. El delegado solo pausa y avisa a Migue. Auto-pausa a 38:00 y 74:00.
4. Calendario: crear partidos con hora en formato 24 h.
5. Asistencia: registrar o editar cualquier fecha; indicar hora si llega tarde. Al guardar permanece en Asistencia y el listado se ordena por fecha.
6. Acceso: el primer uso crea dos PIN distintos. Migue ve toda la app; el delegado solo ve tiempos, cambios e incidencias del partido.
7. Ajustes: elegir Fútbol 7 o Fútbol 11, consultar el estado de sincronización y exportar copias JSON.

## Modalidades

- F7: 7 jugadores en campo, 70 minutos, mitades de 35.
- F11: 11 jugadores en campo, 90 minutos, mitades de 45.
- La modalidad activa se guarda en IndexedDB, se muestra en la cabecera y se aplica a convocatorias y partidos nuevos. Los históricos conservan su modalidad original.

## Datos y permisos

Supabase conserva los documentos compartidos e IndexedDB funciona como caché y cola offline. La asistencia de partido se crea automáticamente al finalizar y puede corregirse desde Asistencia. Las puntuaciones quedan tanto en `matches.ratings` como en `players.ratingHistory`. Los hashes y la sal de los PIN se excluyen antes de cada subida y permanecen únicamente en el dispositivo.

La app usa `@supabase/supabase-js` 2.57.4 (licencia MIT). La distribución UMD está vendorizada en `vendor/supabase.js`; no depende de un CDN para arrancar offline.

## Activación de Supabase

1. Abrir Supabase → SQL Editor en el proyecto de CampoBase.
2. Ejecutar íntegramente `supabase/schema.sql`.
3. Abrir primero CampoBase en el dispositivo que contiene los datos canónicos. Si las tablas están vacías, la app subirá esa caché inicial.
4. Esperar a que la cabecera muestre “Supabase sincronizado”.
5. Abrir los demás dispositivos. En cada uno se crean localmente los dos PIN; los datos deportivos se descargan de Supabase.

Las altas, cambios y borrados se guardan primero en IndexedDB. Con red se envían inmediatamente; sin red quedan en `syncQueue` y se reintentan al volver la conexión. La nube se consulta cada 10 segundos. El conflicto simple es “última escritura recibida”: dos ediciones simultáneas del mismo registro pueden sobrescribirse.

## Pruebas observadas

- `npm test`: ejecutar tras cada cambio.
- `npm run check`: comprueba sintaxis de dominio, sincronización, base local, app y service worker.
- La conexión real con Supabase solo puede verificarse después de ejecutar `supabase/schema.sql`; PrograMARIO no ejecuta SQL ni despliega desde este encargo.

## Límites

- La publishable key es pública y RLS permite CRUD a `anon`: cualquiera que obtenga la URL y la clave puede leer, modificar o borrar los datos. El PIN solo es una puerta de interfaz; Supabase Auth queda fuera de alcance.
- No guardar diagnósticos ni información médica sensible en lesiones o notas.
- Dos ediciones offline del mismo registro se resuelven por la última que llegue al servidor, sin combinación de campos.
- El reloj depende del dispositivo y no sustituye el acta arbitral.
- “Tardanzas frecuentes” se activa desde 3 tardanzas registradas.
- El selector nativo `datetime-local` depende visualmente del navegador, pero la app etiqueta 24 h y todas las fechas renderizadas fuerzan ciclo horario 00–23.
- Borrar un jugador conserva identificadores en históricos como “Jugador eliminado”.

## Recuperación / rollback

Exportar JSON antes de actualizar. Para restaurar, Ajustes → Importar JSON. Si 1.5.0 falla, volver a servir 1.4.1 e importar la copia. El SQL no elimina datos; para parar la sincronización basta con volver al código 1.4.1. Las tablas Supabase pueden conservarse para una recuperación posterior.

## Desarrollo

Node.js 18+: `npm test`, `npm run check`. Servidor local: `python3 -m http.server 8766`.
