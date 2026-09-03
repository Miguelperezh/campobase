# Changelog

## 2.16.5 — 2026-09-02

- El «Historial completo» de la ficha de jugador se muestra ordenado: fecha, tipo (Convocatoria/Partido/Entrenamiento) y detalle en columnas claras, con el estado de asistencia traducido (Presente/Tarde/Ausente en vez de «present»).
- 101 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.16.5`.

## 2.16.4 — 2026-09-02

- Los desplegables de «Ver actividad y estadísticas» y sus submenús (Minutos por temporada, Puntuaciones, Media por temporada, Historial completo) ya no se cierran solos: la sincronización en segundo plano no reconstruye la vista mientras haya un `<details>` abierto.
- 101 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.16.4`.

## 2.16.3 — 2026-09-02

- El recordatorio «Minutos por jugador» ya no muestra a los porteros: solo los jugadores de campo. Los minutos del portero siguen contando en su ficha de plantilla.
- 101 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.16.3`.

## 2.16.2 — 2026-09-02

- El recordatorio «Minutos por jugador» y la propuesta de reparto recalculan los objetivos en vivo con los porteros actuales, en vez de leer valores guardados con la lógica antigua.
- 101 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.16.2`.

## 2.16.1 — 2026-09-02

- Los porteros tienen minutos fijos en el reparto: uno juega el partido completo (70 min en F7), dos juegan un tiempo cada uno (35 min).
- Los porteros quedan excluidos de los cambios automáticos y de la propuesta de reparto; solo Migue puede cambiarlos a mano.
- 101 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.16.1`.

## 2.16.0 — 2026-09-02

- Cambio manual libre de 1 a 7 jugadores para Migue y el delegado (antes el delegado solo podía 1, 3 o 7).
- Cambio automático de 1 a 3 jugadores (antes exigía mínimo 2).
- Recordatorio fijo «Minutos por jugador» en el partido en vivo, con el reparto objetivo de cada convocado.
- Botón «Proponer reparto» que sugiere todos los cambios necesarios para que cada convocado alcance su objetivo de minutos, con aviso automático al quedar 10 minutos.
- Los selectores de portero muestran solo los convocados con posición «Portero»; con uno solo se asigna a ambos tiempos.
- Puntuar en casa: el partido se finaliza sin obligar a puntuar, y las notas se pueden dar o corregir después desde el detalle del partido.
- Corregido el «null» que aparecía en el marcador cuando un partido no tenía goles registrados.
- Corregido el cierre automático de desplegables y el desmarcado de cambios: la sincronización ya no re-renderiza la pantalla mientras se interactúa.
- Diálogos de detalle de partido y puntuación más anchos.
- 97 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.16.0`.

## 2.15.1 — 2026-09-02

- Corregido el error que aparecía después de guardar el PIN demo porque la referencia del formulario se perdía durante las operaciones asíncronas.
- Verificado de extremo a extremo: el PIN demo se crea, se guarda y abre una sesión temporal aislada, sin plantilla real ni acceso a Ajustes.
- 91 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.15.1`.

## 2.15.0 — 2026-09-01

- PIN de demostración: Migue puede crear un PIN temporal que abre una sesión aislada de dos horas, sin acceso a sus datos reales ni a Ajustes.
- La demo conserva toda la operativa de Migue (incluida la puntuación de jugadores) pero nunca precarga su plantilla; los datos viven solo en memoria y se eliminan al cerrar o al caducar.
- El delegado mantiene su acceso limitado al partido; Migue, la demo y el delegado usan cada uno su propio PIN.
- 90 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.15.0`.

## 2.14.1 — 2026-09-01

- Corregido el guardado al añadir o editar jugadores sin posición asignada.
- Las fichas de Plantilla separan con claridad dorsal, posición, pierna y rotaciones, y ajustan los textos largos dentro de cada recuadro.
- La Plantilla se ordena por dorsal ascendente; los jugadores sin dorsal quedan después, ordenados por nombre.
- Se mantienen sin cambios el borrado de jugadores y el resto de módulos ya validados.

## 2.14.0 — 2026-09-01

- Precarga idempotente de los 13 jugadores de Unión Viera Alevín D 2026/27 cuando la plantilla local está vacía.
- Ramiro Casati se crea como portero con dorsal 1; los otros doce jugadores quedan sin dorsal ni posición para completarlos desde el CRUD existente.
- Las plantillas que ya contienen jugadores se conservan sin cambios y la migración se registra mediante `squad-26-27-seeded` para evitar repeticiones.
- El módulo de precarga forma parte de la caché offline `campobase-v2.14.0`.

## 2.13.0 — 2026-08-31

- Fase 3: catálogo F7 ampliado de cinco a ocho formaciones con 1-3-3, 1-4-1-1 y 1-2-1-3.
- El 1-3-3 aporta dos líneas de tres: central libre para coberturas, extremos con amplitud y delantero centro móvil.
- Cada formación nueva incluye siete jugadores posicionados y una guía con objetivo, juego con balón, defensa sin balón y reacción tras pérdida.
- La guía táctica ya no aparece durante la edición: se muestra únicamente al abrir el detalle de una táctica guardada.
- Gramática y coherencia deportiva revisadas en los textos incorporados en esta iteración.
- 73 pruebas automatizadas en verde y caché PWA elevada a `campobase-v2.13.0`.

## 2.12.0 — 2026-08-31

- Fase 3: pizarra táctica con flechas de colores por acción (azul = pase, gris rayado = movimiento, púrpura = conducción, rojo = disparo, verde = sprint), balón blanco con borde oscuro y jugadores con número legible.
- Leyenda corregida para que corresponda con cada tipo de flecha.
- 69 pruebas automatizadas en verde.

## 2.11.0 — 2026-08-31

- Fase 3: pizarra táctica interactiva tipo RenderFoot/TacticalPad.
- Herramientas: mover jugadores (arrastrar), pase, movimiento, conducción, disparo, sprint y balón colocable.
- Círculos de jugadores más pequeños (r=3.2).
- Flechas dibujadas a mano con 5 tipos (pase, movimiento, conducción, disparo, sprint) y leyenda.
- Guardar táctica persiste posiciones movidas, balón y flechas dibujadas.
- 5 formaciones F7 explicadas (1-3-2-1, 1-2-3-1, 1-2-2-2, 1-3-1-2, 1-1-3-2) con ataque y defensa.
- 69 pruebas automatizadas en verde.

## 2.12.2 — 2026-08-31

### Corregido
- Flechas de color real: los markers SVG ahora usan `fill="context-stroke"` para heredar el color del trazo (antes eran todas negras). Sprint en amarillo `#f6cf4c` para contraste sobre campo verde.
- Números de jugadores centrados dentro del círculo (`text-anchor:middle`) en jugadores y rivales (antes desplazados a la derecha).
- Leyenda visual con barras de color real de cada tipo de flecha: pase/azul, movimiento/gris, conducción/púrpura, disparo/rojo, sprint/amarillo.

## 2.12.1 — 2026-08-31

### Corregido
- Reaparecen las reglas CSS `.tac-arrow.spr` y `.tac-sprint` con trazo verde diferenciado para las flechas de sprint. Sin esto, las flechas de sprint se renderizaban en negro y la leyenda perdía correspondencia.

## 2.10.0 — 2026-08-31

- Fase 3 mejorada: la pizarra táctica ahora precarga las 3 formaciones del manual de Migue (1-3-2-1, 1-2-3-1, 1-2-2-2) con sus posiciones.
- Cada formación incluye la explicación táctica: qué busco, con balón, sin balón/defensa y al perder el balón.
- Leyenda corregida: mi equipo en rojo y rival en negro (antes ambos del mismo color).
- 66 pruebas automatizadas en verde.

## 2.9.0 — 2026-08-31

- Fase 3: nueva pestaña «Tácticas» con pizarra táctica (F7 y F11).
- Formaciones iniciales automáticas por formato (7 y 11 jugadores) con rival.
- Pizarra SVG con movimientos animados (pase, movimiento, conducción, disparo) y leyenda.
- Tácticas guardadas por rival o situación, con CRUD completo (crear, ver, editar, borrar).
- 65 pruebas automatizadas en verde.

## 2.8.2 — 2026-08-31

- Sesiones en pestaña propia (navegación inferior), separadas de Ejercicios.
- Desde la pestaña de sesiones se pueden incluir ejercicios con el botón «+ Añadir» de cada tarjeta.
- Tiempo total de la sesión configurable (no fijo a 60): el indicador avisa si faltan minutos, están cubiertos o te pasas.
- Opción de marcar la sesión como calentamiento de partido/amistoso.
- Cada ejercicio dentro de una sesión guardada es pinchable y abre su ficha completa (diagrama, montaje, desarrollo, correcciones) para consultarlo durante el entreno.
- 61 pruebas automatizadas en verde.

## 2.7.0 — 2026-08-31

- Limpieza automática de los ejercicios precargados genéricos (los "6 chinos, 2 siluetas, 4 palos") que quedaron guardados en versiones anteriores. Solo se borran los precargados; los creados o editados a mano se conservan.
- Builder de sesión intuitivo: al pulsar «+ Sesión» y poner la fecha, se abre la lista de ejercicios bien hechos con un botón «+ Añadir» en cada uno que lo mete directo en la sesión (calentamiento, parte principal o juego final según su categoría).
- Restaurado `js/training-domain.js` (estaba sobrescrito y roto, faltaban los exports que la app y los tests necesitan).
- 60 pruebas automatizadas en verde.

## 2.5.0 — 2026-08-28

- Pizarras SVG blancas y negras con leyenda calculada por ejercicio.
- Formato de ficha operativa completo para todos los ejercicios.
- Flujo «Añadir a sesión» para crear o ampliar sesiones.
- Bloques reordenables, eliminables y con duración editable.
- Indicador en vivo de total, minutos restantes o exceso sobre 60.
- Nueva batería de pruebas de pizarra, normalización y sesiones.
- Caché PWA subida a `campobase-v2.5.0`.

## 2.1.0 — 2026-08-28

- Biblioteca ampliada de 36 a 80 ejercicios, con 44 incorporaciones y 10 tareas específicas de porteros.
- Diagramas SVG de pizarra accesibles y adaptables mediante diez plantillas reutilizables: pase, rondo, circuito, posesión, duelo, superioridad, finalización, partido reducido, calentamiento y porteros.
- Número de jugadores destacado en cada tarjeta y visible junto al nombre y la duración en los selectores de sesiones.
- Migración idempotente `phase2-v2-seeded`: añade solo identificadores ausentes y completa diagramas en ejercicios existentes sin sobrescribir nombre, favoritos ni otros cambios del usuario.
- Caché PWA elevada a `campobase-v2.1.0` y 52 pruebas automatizadas.

## 2.0.0 — 2026-08-28

- Nueva pestaña Ejercicios con 36 ejemplos iniciales, siete categorías, filtros por categoría, jugadores, material y dificultad, favoritos y CRUD completo.
- Sesiones de entrenamiento por fecha con calentamiento, 2-3 ejercicios principales, juego final, duración, material y consignas.
- Plantillas reutilizables de calentamiento de entreno (10 min) y partido (15 min).
- Ejercicios y sesiones se sincronizan en la tabla `configuracion` como documentos tipados, sin SQL ni tablas nuevas, y forman parte de la copia JSON existente.
- Caché PWA elevada a `campobase-v2.0.0` y 50 pruebas automatizadas.

## 1.8.0 — 2026-08-28

- Nombre de equipo configurable y condición local/visitante en calendario, convocatoria manual y partido en vivo.
- Porteros elegibles entre todos los convocados y persistidos para cada tiempo.
- Marcador de estadio con controles +/−, goleadores, tarjetas, lesiones e incidencias compartidos con el delegado; comentarios exclusivos de Migue.
- Ficha con resumen e historial de goles, tarjetas, lesiones, incidencias, convocatorias, asistencia, minutos y puntuaciones.

## 1.7.0 — 2026-08-28

- Sustituidos todos los controles nativos con hora por selectores propios `00–23` y `00–59` en convocatoria manual, calendario y llegadas de asistencia; iOS ya no puede imponer AM/PM.
- La rotación trabaja con jugadores únicos, mantiene provisionalmente el máximo de 14 durante decisiones pendientes y completa la convocatoria aunque existan fichas duplicadas.
- Eliminadas todas las llamadas a `confirm()`: las decisiones y borrados usan un diálogo HTML propio compatible con móvil.
- El rol autenticado se conserva en `sessionStorage` durante la pestaña actual. Una recarga causada por navegador o service worker restaura la sesión; el PIN solo reaparece al cerrar sesión o abrir una sesión nueva.
- Caché PWA elevada a `campobase-v1.7.0` y añadidas regresiones automáticas para los tres fallos.

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
