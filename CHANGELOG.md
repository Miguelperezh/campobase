# Changelog

## 1.6.0 — 2026-08-28

- La ficha permite abrir la cámara trasera o elegir una imagen del móvil; la foto se guarda como `data:image` dentro del documento del jugador y se sincroniza con el flujo Supabase existente, sin bucket adicional.
- Jugadores y fichas se muestran alfabéticamente por nombre en todas las vistas.
- Editar una convocatoria actualiza convocatoria, partido y contadores de rotación en un único lote local antes de sincronizar, sin cerrar la sesión ni pedir de nuevo el PIN.
- Los botones de edición declaran `type="button"` para impedir envíos de formulario accidentales.
- Los hashes salados de los dos PIN se sincronizan en `configuracion`: se configuran una vez y después se pide el PIN de Migue o del delegado al entrar; el error sigue siendo explícito: “PIN incorrecto.”
- La migración conserva los PIN locales de 1.5.0 y los sube cuando la nube todavía no contiene la configuración de acceso.

## 1.5.0 — 2026-08-28

- Supabase pasa a ser la fuente compartida para jugadores, partidos, convocatorias, asistencias y configuración operativa.
- IndexedDB se mantiene como caché y añade una cola persistente: las escrituras sin conexión se reintentan al recuperar red.
- Las bajas usan tombstones para propagarse a otros dispositivos; la app consulta la nube cada 10 segundos.
- El doble PIN sigue siendo local y sus hashes/sal nunca se envían a Supabase.
- Se incorpora `@supabase/supabase-js` 2.57.4 (MIT) como recurso vendorizado para que la PWA siga arrancando offline.
- Se documenta el límite crítico: la publishable key y las políticas RLS públicas no protegen datos en el servidor.

## 1.4.1 — 2026-08-28

- Al finalizar el segundo tiempo, Migue debe puntuar a cada convocado del 1 al 5 antes de guardar el partido.
- Las puntuaciones se guardan atómicamente en el partido y en el historial de la ficha de cada jugador mediante IndexedDB.
- El delegado solo puede pausar al final y avisar a Migue; no ve el formulario ni puede guardar puntuaciones.

## 1.4.0 — 2026-08-28

- Minutos acumulados por temporada en la ficha y motivo de menor participación.
- Contadores por jugador en tiempo real, guardado atómico del partido y registro de marcador, goleadores, tarjetas, lesiones y comentarios.
- Flujo Comienzo, Descanso, Segundo tiempo y Final, con auto-pausa a 38:00 y 74:00.
- Cambios manuales de 1–7, automáticos de 2–3 y rotación de un portero por tiempo.
- Doble PIN local con vista limitada del delegado; solo Migue puede cambiar ambos PIN.
- Actualización del vivo entre pestañas del mismo navegador mediante IndexedDB. La sincronización entre móviles requiere backend y queda bloqueada por la arquitectura estática autorizada.

## 1.3.0 — 2026-08-28

- Convocatorias editables y recálculo seguro de contadores de rotación.
- Memoria de exclusiones por enfermedad o decisión técnica con decisión explícita del entrenador antes de una futura rotación.
- Salida clara del partido en vivo para descartar el control actual y preparar otro.
- Entrenamientos antiguos editables, hora de llegada para tardanzas y listados ordenados por fecha sin cambiar de pantalla al guardar.
- Historial de incidencias, comentarios y exclusiones consultable en la ficha de Plantilla.
- Vista delegado limitada a tiempos y cambios: sugerencia del que menos juega, alerta urgente, cambios manuales de 1/3/7 y automático de 2–3.

## 1.2.0 — 2026-08-28

- Modalidad F7/F11 persistente, visible y aplicada a duración, jugadores en campo y reparto.
- Navegación ordenada: Plantilla, Convocatorias, Partido en vivo, Calendario, Asistencia y Ajustes.
- Horarios mostrados en 24 horas y controles de fecha/hora configurados en español.
- Convocatorias con listas separadas y total de exclusiones manuales y automáticas.
- Partido en vivo por fases, cambios manuales de 1–3 jugadores y guardado automático de eventos y minutos.
- Asistencia por entrenamientos y partidos, edición, historial por jugador, ausencias, rachas y tardanzas frecuentes.

## 1.0.0 — 2026-08-28

- Plantilla con foto, dorsal, posición, pierna, notas y clasificación de minutos.
- Convocatorias, reparto exacto F7/F11 y sugerencia de rotación equitativa.
- Partido en vivo con reloj, pausa, cambios de 2–3, minutos reales y puntuación 1–5.
- Calendario, resultados y asistencia a entrenamientos.
- Persistencia IndexedDB, modo offline y copia JSON.
