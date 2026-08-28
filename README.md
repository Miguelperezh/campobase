# CampoBase 1.4.1 — Fase 1

Estado: candidato con pruebas de dominio y sintaxis superadas. PWA estática en español, sin backend ni dependencias de ejecución.

## Flujo de uso

1. Plantilla: crear jugadores.
2. Convocatorias: crear o editar, marcar exclusiones y revisar la lista. Si la rotación alcanza a alguien excluido antes por enfermedad o decisión técnica, decidir expresamente si entra.
3. Partido en vivo: preparar porteros, pulsar Comienzo, registrar cambios, marcador e incidencias; Descanso/Segundo tiempo/Final controlan el flujo. Al finalizar, Migue puntúa obligatoriamente a cada convocado del 1 al 5. El delegado solo pausa y avisa a Migue. Auto-pausa a 38:00 y 74:00.
4. Calendario: crear partidos con hora en formato 24 h.
5. Asistencia: registrar o editar cualquier fecha; indicar hora si llega tarde. Al guardar permanece en Asistencia y el listado se ordena por fecha.
6. Acceso: el primer uso crea dos PIN distintos. Migue ve toda la app; el delegado solo ve tiempos, cambios e incidencias del partido.
7. Ajustes: elegir Fútbol 7 o Fútbol 11 y exportar copias JSON.

## Modalidades

- F7: 7 jugadores en campo, 70 minutos, mitades de 35.
- F11: 11 jugadores en campo, 90 minutos, mitades de 45.
- La modalidad activa se guarda en IndexedDB, se muestra en la cabecera y se aplica a convocatorias y partidos nuevos. Los históricos conservan su modalidad original.

## Datos y permisos

IndexedDB y Cache Storage del navegador. No usa red salvo para descargar los estáticos del hosting. No requiere cuenta, credenciales ni permisos externos. La asistencia de partido se crea automáticamente al finalizar y puede corregirse desde Asistencia. Las puntuaciones quedan tanto en `matches.ratings` como en `players.ratingHistory` dentro de la misma transacción.

## Pruebas observadas

- `npm test`: 27/27 en verde.
- `npm run check`: sintaxis válida.
- Navegador real en localhost: formulario 1–5 visible para Migue al finalizar. La persistencia se cubre con pruebas de dominio y escritura atómica `putBatch`; queda pendiente repetir una comprobación E2E completa de lectura posterior en navegador.

## Límites

- IndexedDB y el PIN son locales al navegador. El vivo se actualiza entre pestañas que comparten esa base; dos móviles no comparten IndexedDB. Sin backend autorizado no existe sincronización real entre dispositivos.
- El PIN oculta vistas y guarda hashes salados, pero una PWA estática no ofrece seguridad equivalente a un servidor con cuentas.
- El reloj depende del dispositivo y no sustituye el acta arbitral.
- “Tardanzas frecuentes” se activa desde 3 tardanzas registradas.
- El selector nativo `datetime-local` depende visualmente del navegador, pero la app etiqueta 24 h y todas las fechas renderizadas fuerzan ciclo horario 00–23.
- Borrar un jugador conserva identificadores en históricos como “Jugador eliminado”.

## Recuperación / rollback

Exportar JSON antes de actualizar. Para restaurar, Ajustes → Importar JSON. Si 1.4.1 falla, volver a servir 1.4.0; el esquema de copia sigue en versión 1 y es compatible.

## Desarrollo

Node.js 18+: `npm test`, `npm run check`. Servidor local: `python3 -m http.server 8766`.
