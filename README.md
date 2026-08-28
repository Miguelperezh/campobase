# CampoBase 1.0.0 — Fase 1

Estado: candidato verificado localmente. PWA estática en español, sin backend ni dependencias de ejecución.

## Uso

1. Servir esta carpeta por HTTPS o localhost (no abrir `index.html` con `file://`).
2. Abrir la URL en Safari/Chrome. En iPhone: Compartir → Añadir a pantalla de inicio.
3. Crear jugadores en Plantilla.
4. Crear partidos en Calendario.
5. Crear la convocatoria, aplicar o ajustar la rotación y guardar el reparto.
6. En Partido en vivo, elegir un partido convocado, iniciar el reloj y registrar cambios de 2–3 jugadores.
7. Finalizar para guardar minutos reales y puntuaciones 1–5.
8. Exportar JSON periódicamente desde Ajustes.

## Entrada → proceso → salida

- Entrada: jugadores, fotos (máximo 2 MB), convocatorias, cambios, resultados, puntuaciones y asistencias introducidos a mano.
- Proceso: reparto `(duración × jugadores en campo) ÷ disponibles`; rotación por menor contador de veces fuera y mayor tiempo sin quedar fuera; suma por intervalos de presencia en campo.
- Salida: fichas, objetivos, minutos acumulados, calendario/resultados, puntuaciones, asistencia y copia JSON.

## Persistencia y permisos

IndexedDB y Cache Storage del navegador. No usa red salvo para descargar los archivos estáticos del hosting. No requiere cuenta, credenciales ni permisos externos. Fotos y notas quedan en el dispositivo.

## Pruebas observadas

- `npm test`: 7/7 en verde (reparto exacto, resto, validación, rotación, desempate, minutos por cambios y copia).
- `npm run check`: sintaxis válida en los cuatro módulos JavaScript.
- Navegador real en localhost: carga, IndexedDB, Service Worker controlador, alta persistente de jugador, alta persistente de partido y calculadora visible (490 minutos repartidos).

## Límites conocidos

- No sincroniza dispositivos: usar exportar/importar.
- El temporizador depende del reloj del dispositivo y no sustituye el acta arbitral.
- Borrar un jugador puede dejar su identificador en históricos; se muestra como “Jugador eliminado”.
- La puntuación al finalizar usa diálogos secuenciales del navegador, funcionales pero deliberadamente básicos en esta fase.
- No incluye URL/API, vídeo ni análisis automático.

## Recuperación / rollback

Antes de importar o actualizar, exportar JSON. Para restaurar: Ajustes → Importar JSON. Si una versión nueva falla, volver a servir esta carpeta 1.0.0 y recargar; el esquema de copia es versión 1.

## Desarrollo

Requiere Node.js 18+ solo para pruebas:

- `npm test`
- `npm run check`
- `python3 -m http.server 8765`
