# CampoBase 1.3.0 — Fase 1

Estado: candidato verificado localmente. PWA estática en español, sin backend ni dependencias de ejecución.

## Flujo de uso

1. Plantilla: crear jugadores.
2. Convocatorias: crear o editar, marcar exclusiones y revisar la lista. Si la rotación alcanza a alguien excluido antes por enfermedad o decisión técnica, decidir expresamente si entra.
3. Partido en vivo: preparar el partido; registrar cambios o usar “Salir del partido en vivo” para descartar ese control y preparar otro.
4. Calendario: crear partidos con hora en formato 24 h.
5. Asistencia: registrar o editar cualquier fecha; indicar hora si llega tarde. Al guardar permanece en Asistencia y el listado se ordena por fecha.
6. Vista delegado: desde un partido en vivo, abrir el modo limitado para consultar tiempos, aplicar sugerencias y registrar cambios 1/3/7 o automáticos de 2–3.
7. Ajustes: elegir Fútbol 7 o Fútbol 11 y exportar copias JSON.

## Modalidades

- F7: 7 jugadores en campo, 70 minutos, mitades de 35.
- F11: 11 jugadores en campo, 90 minutos, mitades de 45.
- La modalidad activa se guarda en IndexedDB, se muestra en la cabecera y se aplica a convocatorias y partidos nuevos. Los históricos conservan su modalidad original.

## Datos y permisos

IndexedDB y Cache Storage del navegador. No usa red salvo para descargar los estáticos del hosting. No requiere cuenta, credenciales ni permisos externos. La asistencia de partido se crea automáticamente al finalizar y puede corregirse desde Asistencia.

## Pruebas observadas

- `npm test`: 22/22 en verde.
- `npm run check`: sintaxis válida.
- Navegador real en localhost: pendiente de repetir para 1.3.0 antes de publicar.

## Límites

- No sincroniza dispositivos: usar exportar/importar.
- El reloj depende del dispositivo y no sustituye el acta arbitral.
- “Tardanzas frecuentes” se activa desde 3 tardanzas registradas.
- El selector nativo `datetime-local` depende visualmente del navegador, pero la app etiqueta 24 h y todas las fechas renderizadas fuerzan ciclo horario 00–23.
- Borrar un jugador conserva identificadores en históricos como “Jugador eliminado”.

## Recuperación / rollback

Exportar JSON antes de actualizar. Para restaurar, Ajustes → Importar JSON. Si 1.3.0 falla, volver a servir 1.2.0; el esquema de copia sigue en versión 1 y es compatible.

## Desarrollo

Node.js 18+: `npm test`, `npm run check`. Servidor local: `python3 -m http.server 8766`.
