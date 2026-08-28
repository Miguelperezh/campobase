export const EXERCISE_CATEGORIES = Object.freeze([
  'Técnica', 'Táctica', 'Coordinación', 'Preparación física', 'Calentamiento',
  'Partido condicionado / Small-sided games', 'Porteros',
]);

export const EXERCISE_DIFFICULTIES = Object.freeze(['Baja', 'Media', 'Alta']);

const playerTotal = (players) => Math.min(12, Math.max(2, Number(String(players).match(/\d+/)?.[0]) || 8));

export function inferExerciseDiagram(values = {}) {
  const text = `${values.name ?? ''} ${values.description ?? ''}`.toLocaleLowerCase('es');
  const category = String(values.category ?? '');
  let type = 'passing';
  if (category === 'Porteros' || /porter[oa]/.test(text)) type = 'goalkeeper';
  else if (/rondo/.test(text)) type = 'rondo';
  else if (/1 contra 1|1v1|duelo/.test(text)) type = 'duel';
  else if (/2 contra 1|2v1|3 contra 2|superioridad/.test(text)) type = 'superiority';
  else if (/tiro|remate|finaliza/.test(text)) type = 'finishing';
  else if (/circuito|coordin|escalera|slalom|valla|zig-zag/.test(text)) type = 'circuit';
  else if (category === 'Partido condicionado / Small-sided games' || /partido|small-sided/.test(text)) type = 'small-sided';
  else if (/posesión|conservar/.test(text)) type = 'possession';
  else if (category === 'Calentamiento' || /calentamiento|movilidad|activación/.test(text)) type = 'warmup';
  return Object.freeze({
    type,
    players: playerTotal(values.players),
    cones: /cono|pica|aro|valla|escalera/i.test(values.material ?? '') ? 4 : 0,
    goals: /portería/i.test(values.material ?? '') || ['goalkeeper', 'finishing', 'small-sided'].includes(type) ? (type === 'small-sided' ? 2 : 1) : 0,
  });
}

const exercise = (id, name, category, players, material, duration, description, difficulty = 'Media', space = 'Adaptable', variants = 'Ajustar distancias, ritmo y número de toques al nivel del grupo.') => Object.freeze({
  id, recordType: 'exercise', name, category, players, material, duration, description, variants, difficulty, space,
  diagram: inferExerciseDiagram({ name, category, players, material, description }),
  favorite: false, example: true, createdAt: 1, updatedAt: 1,
});

const coordination = [
  ['coord-01', 'Conducción ida y vuelta con aros', '4-5 por estación', 'Aros y balón', 3, 'Conducir hasta los aros, completar la secuencia de apoyos y volver con balón.', 'Baja', 'Carril de 12x4 m'],
  ['coord-02', 'Auto-pase + skipping en escalera', '4-5 por estación', 'Escalera y balón', 4, 'Auto-pase, skipping coordinativo en la escalera y control al salir.', 'Media', 'Carril de 12x4 m'],
  ['coord-03', 'Conducción + salto de vallas', '4-5 por estación', 'Vallas y conos', 4, 'Conducir entre conos, dejar el balón controlado, superar vallas y recuperarlo.', 'Media', 'Carril de 15x5 m'],
  ['coord-04', 'Coordinación adelante/atrás + pase', 'Parejas', 'Picas y balón', 3, 'Desplazamientos adelante y atrás entre picas antes de recibir y devolver el pase.', 'Baja', 'Cuadrado de 8x8 m'],
  ['coord-05', 'Zig-zag entre conos + escalera', '4-5 por estación', 'Conos y escalera', 4, 'Zig-zag con cambios de dirección y secuencia rápida de pies en escalera.', 'Media', 'Carril de 15x5 m'],
  ['coord-06', 'Conducción + giro 180° + slalom', '3-4 por estación', 'Aros y picas', 4, 'Conducir, girar 180 grados en el aro y completar el slalom.', 'Media', 'Carril de 15x5 m'],
  ['coord-07', 'Control + pase con desplazamiento', '7 participantes', 'Conos y balón', 6, 'Control orientado, pase al siguiente apoyo y desplazamiento a la posición libre.', 'Media', '20x15 m'],
  ['coord-08', 'Secuencia de controles y pases', '7 participantes', 'Conos y balón', 6, 'Encadenar controles orientados y pases siguiendo el circuito marcado.', 'Media', '20x15 m'],
  ['coord-09', 'Paredes continuas bilaterales', 'Parejas', 'Balón', 4, 'Paredes continuas alternando ambos perfiles y pierna de contacto.', 'Media', 'Carril de 12x6 m'],
  ['coord-10', 'Desmarque + finalización', 'Parejas + portero', 'Balón y portería', 4, 'Desmarque de ruptura tras pase, devolución y finalización ante portero.', 'Media', 'Media cancha'],
].map((item) => exercise(...item.slice(0, 2), 'Coordinación', ...item.slice(2)));

const technical = [
  ['tech-01', 'Libera las líneas de pase', '6-12', 'Balones, conos y petos', 12, 'Conservar el balón moviéndose para abrir líneas de pase.', 'Media', '20x20 m'],
  ['tech-02', 'Pase — Real Madrid CF', '8-16', 'Balones y conos', 12, 'Circuito de pase, apoyo y orientación corporal inspirado en tareas del Real Madrid CF.', 'Media', '25x20 m'],
  ['tech-03', 'Activación técnica 2 contra 1', '6-15', 'Balones, conos y petos', 10, 'Resolver superioridades 2 contra 1 con pase, conducción y temporización.', 'Media', '15x12 m'],
  ['tech-04', 'Triangulación, pases y tiro — Bayer Leverkusen', '8-16', 'Balones, conos y portería', 15, 'Triangulación rápida con tercer hombre y finalización.', 'Alta', 'Media cancha'],
  ['tech-05', 'Conducción de balón y tiro al objetivo — AFC Ajax', '6-14', 'Balones, conos y miniporterías', 12, 'Conducción a velocidad, cambio de dirección y tiro a zona objetivo.', 'Media', '25x15 m'],
  ['tech-06', '2 contra 2 en un cuadrado (dribling y posesión)', '4-12', 'Balones, conos y petos', 12, 'Duelo 2 contra 2 para proteger, regatear y conservar.', 'Media', '12x12 m'],
  ['tech-07', 'Posesión 8 contra 8 + 2 comodines (control orientado)', '18', 'Balones, conos y petos', 18, 'Posesión con comodines priorizando control orientado y continuidad.', 'Alta', '40x35 m'],
  ['tech-08', 'Circuito de perfeccionamiento técnico', '6-18', 'Balones, conos, picas y porterías', 15, 'Estaciones de pase, control, conducción, regate y finalización.', 'Media', 'Media cancha'],
  ['tech-09', 'Circuito técnico-motor: juego de la bandera', '8-18', 'Balones, conos y petos', 12, 'Circuito motor con reacción a señal y conquista de la bandera con balón.', 'Media', '25x20 m'],
  ['tech-10', 'Circuito motriz psicocinético con 1 contra 1', '6-16', 'Balones, conos y petos', 15, 'Estímulo visual, decisión de recorrido y duelo final 1 contra 1.', 'Alta', '30x20 m'],
].map((item) => exercise(...item.slice(0, 2), 'Técnica', ...item.slice(2)));

const tactical = [
  ['tact-01', 'Juego condicionado: cuadrícula de posesión — Real Madrid CF', '10-18', 'Balones, conos y petos', 15, 'Posesión por cuadrículas con obligación de ocupar y liberar espacios.', 'Alta', '35x30 m'],
  ['tact-02', 'Posesión posicional 5 contra 3 con dos porterías', '8', 'Balones, conos, petos y miniporterías', 15, 'El 5 contra 3 progresa hacia una de dos porterías tras fijar la presión.', 'Alta', '25x20 m'],
  ['tact-03', 'Fase ofensiva: amplitud y profundidad (6v6 o 7v7)', '12-14', 'Balones, conos, petos y porterías', 20, 'Ataque organizado ocupando carriles exteriores y profundidad.', 'Alta', 'Media cancha'],
  ['tact-04', 'Rondo 3vs1 en dos cuadrados', '8', 'Balones y conos', 12, 'Dos rondos conectados; el balón cambia de cuadrado tras una secuencia de pases.', 'Media', 'Dos cuadrados de 8x8 m'],
  ['tact-05', 'Partido por sectores: de la construcción a la finalización', '12-18', 'Balones, conos, petos y porterías', 20, 'Progresar por sectores respetando apoyos y ocupación racional.', 'Alta', 'Campo 60x40 m'],
  ['tact-06', 'Partido a tema: ataque rápido de la profundidad', '10-18', 'Balones, petos y porterías', 18, 'Tras recuperar, buscar pase vertical y desmarque profundo.', 'Alta', 'Media cancha'],
  ['tact-07', 'Partido condicionado 7 contra 7 — FC Barcelona', '14', 'Balones, conos, petos y porterías', 20, 'Juego 7 contra 7 con condiciones de posición y circulación.', 'Alta', 'Campo 55x40 m'],
  ['tact-08', 'Partido condicionado 8 contra 8 + 2 comodines laterales', '18', 'Balones, conos, petos y porterías', 20, 'Los comodines laterales generan amplitud y superioridad exterior.', 'Alta', 'Campo 60x45 m'],
  ['tact-09', 'Small-sided game 3 contra 2 (finalización)', '5-15', 'Balones, petos y portería', 15, 'Ataque 3 contra 2 para fijar, soltar y finalizar.', 'Media', '30x25 m'],
  ['tact-10', 'Small-sided game 4 contra 4 + 2 comodines', '10', 'Balones, conos y petos', 15, 'Juego reducido con dos comodines para crear superioridades.', 'Media', '25x20 m'],
  ['tact-11', 'Small-sided game: El pentágono', '6-12', 'Balones, conos y petos', 15, 'Juego de apoyos y desmarques en espacio pentagonal.', 'Alta', 'Pentágono de 20 m'],
  ['tact-12', 'Ataque contra defensa en tres zonas', '10-18', 'Balones, conos, petos y porterías', 20, 'El ataque progresa por tres zonas ante una defensa organizada.', 'Alta', 'Media cancha'],
  ['tact-13', 'Recibir y defender el balón', 'Parejas', 'Balones y conos', 10, 'Un jugador recibe de espaldas y protege ante oposición activa.', 'Media', 'Cuadrados de 8x8 m'],
].map((item) => exercise(...item.slice(0, 2), item[1].startsWith('Small-sided') || item[1].startsWith('Partido condicionado') ? 'Partido condicionado / Small-sided games' : 'Táctica', ...item.slice(2)));

const physical = [exercise('physical-01', 'Circuito físico: El cuadrado', 'Preparación física', '8-20', 'Conos y petos', 15, 'Circuito en cuatro lados con velocidad, agilidad, resistencia y recuperación activa.', 'Media', 'Cuadrado de 20x20 m')];

const technicalV2 = [
  ['tech-11', 'Regate en puertas de colores', '6-16', 'Balones y conos', 12, 'Conducir y superar la puerta indicada con un cambio de ritmo.', 'Baja', '20x20 m'],
  ['tech-12', 'Control orientado y pase al tercer hombre', '6-15', 'Balones y conos', 14, 'Recibir perfilado, orientar el primer toque y conectar con el tercer apoyo.', 'Media', '24x18 m'],
  ['tech-13', 'Pared y finalización cruzada', '6-14', 'Balones, conos y portería', 14, 'Jugar una pared al borde del área y finalizar cruzado.', 'Media', 'Media cancha'],
  ['tech-14', 'Remate de centros laterales', '8-16', 'Balones, conos y portería', 16, 'Atacar primer palo, segundo palo y rechace ante un centro lateral.', 'Alta', 'Área y bandas'],
  ['tech-15', 'Tiro tras conducción diagonal', '6-14', 'Balones, conos y portería', 12, 'Conducir en diagonal, acomodar el balón y tirar desde frontal.', 'Media', '30x25 m'],
  ['tech-16', 'Primer toque bajo presión', '6-12', 'Balones, conos y petos', 12, 'Recibir con oposición cercana y orientar el control hacia espacio libre.', 'Alta', '18x18 m'],
  ['tech-17', 'Dominio y volea por parejas', 'Parejas', 'Balones', 10, 'Alternar controles aéreos y voleas suaves manteniendo continuidad.', 'Media', 'Carriles de 8x5 m'],
  ['tech-18', 'Slalom con finta y aceleración', '6-16', 'Balones, conos y picas', 12, 'Encadenar fintas en slalom y acelerar al superar la última pica.', 'Baja', 'Carril de 18x5 m'],
  ['tech-19', 'Pase largo y control aéreo', 'Parejas', 'Balones y conos', 14, 'Alternar envíos largos y controles orientados con muslo, pecho o pie.', 'Alta', 'Carril de 30x10 m'],
  ['tech-20', 'Finalización a dos toques', '6-15', 'Balones, conos y portería', 15, 'Controlar el pase frontal y finalizar antes del segundo toque.', 'Alta', 'Frontal y área'],
].map((item) => exercise(...item.slice(0, 2), 'Técnica', ...item.slice(2)));

const coordinationV2 = [
  ['coord-11', 'Escalera lateral y pase de precisión', '4-10', 'Escalera, balones y conos', 10, 'Completar apoyos laterales y pasar a una puerta pequeña.', 'Baja', 'Carril de 15x5 m'],
  ['coord-12', 'Aros, giro y recepción perfilada', '4-12', 'Aros, balones y conos', 10, 'Secuencia de pies en aros, giro y recepción orientada.', 'Media', 'Carril de 14x6 m'],
  ['coord-13', 'Reacción por colores con balón', '6-16', 'Balones y conos de colores', 12, 'Reaccionar a una señal, conducir al color indicado y regresar.', 'Media', '20x20 m'],
  ['coord-14', 'Vallas bajas y salida explosiva', '4-12', 'Vallas y conos', 10, 'Superar vallas con apoyos cortos y acelerar cinco metros.', 'Media', 'Carril de 15x4 m'],
  ['coord-15', 'Espejo coordinativo por parejas', 'Parejas', 'Conos', 10, 'Un jugador lidera desplazamientos y el compañero los reproduce.', 'Baja', 'Cuadrados de 8x8 m'],
  ['coord-16', 'Circuito óculo-pédico con dos balones', '6-12', 'Balones, aros y conos', 12, 'Coordinar pase simultáneo, apoyos en aros y cambio de estación.', 'Alta', '18x18 m'],
].map((item) => exercise(...item.slice(0, 2), 'Coordinación', ...item.slice(2)));

const tacticalV2 = [
  ['tact-14', 'Basculación defensiva en bloque medio', '8-16', 'Balones, conos y petos', 16, 'Desplazar el bloque según la circulación rival cerrando líneas interiores.', 'Alta', '40x35 m'],
  ['tact-15', 'Salida de balón 4 contra 3', '7-14', 'Balones, conos, petos y miniporterías', 16, 'Superar la primera presión mediante amplitud, apoyo y tercer hombre.', 'Alta', '35x30 m'],
  ['tact-16', 'Transición tras pérdida en cinco segundos', '10-18', 'Balones, conos y petos', 16, 'Tras perder, presionar juntos durante cinco segundos o replegar.', 'Alta', '40x35 m'],
  ['tact-17', 'Defensa de centros y rechaces', '8-16', 'Balones, petos y portería', 16, 'Coordinar marcajes, despeje y ocupación de la frontal.', 'Alta', 'Área y bandas'],
].map((item) => exercise(...item.slice(0, 2), 'Táctica', ...item.slice(2)));

const physicalV2 = [
  ['physical-02', 'Velocidad repetida con balón', '6-18', 'Balones y conos', 12, 'Series cortas de conducción máxima con recuperación activa.', 'Alta', 'Carriles de 20x5 m'],
  ['physical-03', 'Cambios de dirección 5-10-5', '6-16', 'Conos', 10, 'Acelerar, frenar y cambiar de dirección en recorrido 5-10-5.', 'Media', 'Carril de 20x5 m'],
  ['physical-04', 'Resistencia intermitente con pase', '8-20', 'Balones y conos', 16, 'Alternar carrera intensa y recuperación mientras circula el balón.', 'Alta', '30x25 m'],
  ['physical-05', 'Fuerza por parejas y aceleración', 'Parejas', 'Conos y bandas elásticas', 12, 'Breve resistencia por parejas seguida de aceleración controlada.', 'Media', 'Carril de 15x5 m'],
].map((item) => exercise(...item.slice(0, 2), 'Preparación física', ...item.slice(2)));

const warmupsV2 = [
  ['warmup-03', 'Rondo progresivo de activación', '6-12', 'Balones, conos y petos', 12, 'Empezar sin oposición y añadir defensores y límite de toques.', 'Media', 'Cuadrado de 15x15 m'],
  ['warmup-04', 'Movilidad dinámica con balón', 'Todo el equipo', 'Balones y conos', 10, 'Movilidad articular en desplazamiento combinada con conducción suave.', 'Baja', '20x15 m'],
  ['warmup-05', 'Pases por parejas en movimiento', 'Parejas', 'Balones y conos', 10, 'Progresar por el espacio con pases cortos y movilidad dinámica.', 'Baja', '25x20 m'],
  ['warmup-06', 'Juego de reacción y robo de petos', '8-20', 'Petos y conos', 10, 'Activación lúdica con cambios de dirección para capturar petos.', 'Baja', '20x20 m'],
].map((item) => exercise(...item.slice(0, 2), 'Calentamiento', ...item.slice(2)));

const smallSidedV2 = [
  ['ssg-01', '3 contra 3 con cuatro miniporterías', '6-12', 'Balones, petos, conos y miniporterías', 15, 'Atacar cualquiera de dos miniporterías y reaccionar tras pérdida.', 'Media', '25x20 m'],
  ['ssg-02', '4 contra 4 a tres toques', '8-16', 'Balones, petos, conos y porterías', 16, 'Juego reducido con máximo tres toques para acelerar decisiones.', 'Media', '30x24 m'],
  ['ssg-03', '5 contra 5 con zonas de finalización', '10-16', 'Balones, petos, conos y porterías', 18, 'Solo se puede finalizar tras entrar controlando en la zona ofensiva.', 'Alta', '40x30 m'],
  ['ssg-04', '2 contra 2 + comodín ofensivo', '5-10', 'Balones, petos y miniporterías', 14, 'El comodín juega con quien tiene balón para crear un 3 contra 2.', 'Media', '22x18 m'],
  ['ssg-05', 'Partido de transiciones 4 contra 4', '8-16', 'Balones, petos y cuatro miniporterías', 16, 'Al recuperar se ataca inmediatamente la pareja de porterías opuesta.', 'Alta', '30x25 m'],
  ['ssg-06', '6 contra 6 por carriles', '12-18', 'Balones, petos, conos y porterías', 18, 'Ocupar al menos tres carriles antes de poder finalizar.', 'Alta', '45x35 m'],
].map((item) => exercise(...item.slice(0, 2), 'Partido condicionado / Small-sided games', ...item.slice(2)));

const goalkeepersV2 = [
  ['keeper-01', 'Blocaje frontal y caída lateral', '2-6 porteros', 'Balones, conos y portería', 12, 'Alternar blocaje frontal con caída lateral segura a ambos perfiles.', 'Media', 'Área pequeña'],
  ['keeper-02', 'Desplazamiento lateral y estirada', '2-6 porteros', 'Balones, conos y portería', 12, 'Ajustar apoyos laterales antes de una estirada rasa.', 'Media', 'Portería y área pequeña'],
  ['keeper-03', 'Uno contra uno: achique', '2-8', 'Balones, conos y portería', 14, 'Temporizar, reducir ángulo y decidir el momento del achique.', 'Alta', 'Área'],
  ['keeper-04', 'Juego aéreo en centros', '3-8', 'Balones, conos y portería', 15, 'Atacar centros desde ambos lados con impulso, blocaje y despeje.', 'Alta', 'Área'],
  ['keeper-05', 'Pase corto bajo presión', '3-8', 'Balones, petos y miniporterías', 14, 'Participar en una salida 3 contra 1 y encontrar la portería libre.', 'Alta', '20x18 m'],
  ['keeper-06', 'Saque largo a zonas objetivo', '2-6 porteros', 'Balones, conos y aros', 12, 'Alternar golpeo con pie y mano buscando zonas marcadas.', 'Media', 'Media cancha'],
  ['keeper-07', 'Doble intervención y recuperación', '2-6 porteros', 'Balones, conos y portería', 14, 'Resolver un primer tiro, levantarse y responder a un segundo.', 'Alta', 'Área pequeña'],
  ['keeper-08', 'Reflejos a corta distancia', '2-6 porteros', 'Balones y portería', 10, 'Responder a remates cercanos variados manteniendo posición base.', 'Alta', 'Área pequeña'],
  ['keeper-09', 'Pasos de ajuste y tiro cruzado', '2-6 porteros', 'Balones, conos y portería', 12, 'Ajustar posición a la circulación antes del tiro cruzado.', 'Media', 'Área'],
  ['keeper-10', 'Portero + línea defensiva', '6-10', 'Balones, petos, conos y portería', 16, 'Coordinar altura, coberturas y comunicación ante ataques de tres.', 'Alta', 'Media cancha'],
].map((item) => exercise(...item.slice(0, 2), 'Porteros', ...item.slice(2)));

export const WARMUP_TEMPLATES = Object.freeze([
  exercise('warmup-training-10', 'Calentamiento de entreno (10 min)', 'Calentamiento', 'Todo el equipo', 'Balones y conos', 10, 'Juego libre y movilidad con balón (5 min) + activación técnica de pases o rondo (5 min).', 'Baja', '20x20 m', 'Cambiar el rondo por pases por parejas o conducción libre.'),
  exercise('warmup-match-15', 'Calentamiento de partido (15 min)', 'Calentamiento', 'Convocados', 'Balones, conos y petos', 15, 'Movilidad articular y carrera suave (5 min) + activación con balón (5 min) + rondo o posesión reducida (5 min).', 'Media', '25x20 m', 'Ajustar intensidad y espacio según la hora, el césped y el rival.'),
]);

export const PHASE2_V2_EXERCISES = Object.freeze([
  ...technicalV2, ...coordinationV2, ...tacticalV2, ...physicalV2, ...warmupsV2, ...smallSidedV2, ...goalkeepersV2,
]);

export const INITIAL_EXERCISES = Object.freeze([...coordination, ...technical, ...tactical, ...physical, ...WARMUP_TEMPLATES, ...PHASE2_V2_EXERCISES]);

const clean = (value) => String(value ?? '').trim();

const DIAGRAM_LAYOUTS = Object.freeze({
  rondo: [[50, 18], [78, 35], [70, 68], [30, 68], [22, 35], [50, 48]],
  circuit: [[12, 75], [28, 58], [44, 72], [60, 48], [76, 62], [88, 28]],
  possession: [[20, 25], [45, 18], [75, 28], [28, 68], [58, 72], [82, 62], [50, 45]],
  duel: [[30, 50], [62, 50], [86, 50]],
  superiority: [[18, 25], [18, 72], [52, 50], [84, 50]],
  'small-sided': [[20, 25], [35, 48], [20, 72], [80, 25], [65, 48], [80, 72]],
  warmup: [[18, 28], [38, 22], [62, 28], [82, 22], [28, 68], [50, 72], [72, 66]],
  goalkeeper: [[84, 50], [55, 28], [55, 72], [25, 50]],
  finishing: [[16, 68], [38, 50], [60, 36], [85, 50]],
  passing: [[18, 25], [50, 18], [82, 25], [72, 70], [28, 70]],
});

const xml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);

export function renderExerciseDiagram(item) {
  const diagram = item.diagram?.type ? item.diagram : inferExerciseDiagram(item);
  const layout = DIAGRAM_LAYOUTS[diagram.type] ?? DIAGRAM_LAYOUTS.passing;
  const players = Array.from({ length: Math.min(diagram.players || 6, layout.length) }, (_, index) => layout[index]);
  const markerId = `arrow-${String(item.id ?? diagram.type).replace(/[^a-z0-9-]/gi, '')}`;
  const cones = Array.from({ length: Math.min(diagram.cones || 0, 4) }, (_, index) => `<path class="diagram-cone" d="M${14 + index * 24} 86 l3 -7 l3 7z"/>`).join('');
  const goals = diagram.goals > 0 ? `<path class="diagram-goal" d="M92 36 h5 v28 h-5"/>${diagram.goals > 1 ? '<path class="diagram-goal" d="M8 36 h-5 v28 h5"/>' : ''}` : '';
  const movement = players.slice(0, -1).map(([x, y], index) => {
    const [nextX, nextY] = players[index + 1];
    return `<path class="diagram-movement" d="M${x} ${y} L${nextX} ${nextY}" marker-end="url(#${markerId})"/>`;
  }).join('');
  const dots = players.map(([x, y], index) => `<g class="diagram-player"><circle cx="${x}" cy="${y}" r="4"/><text x="${x}" y="${y + 1.6}">${index + 1}</text></g>`).join('');
  return `<svg class="exercise-diagram" viewBox="0 0 100 100" role="img" aria-label="Diagrama de ${xml(item.name || 'ejercicio')}"><defs><marker id="${markerId}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6z"/></marker></defs><rect class="diagram-field" x="5" y="7" width="90" height="86" rx="3"/><path class="diagram-line" d="M50 7v86 M5 50h90"/><circle class="diagram-line" cx="50" cy="50" r="11"/><circle class="diagram-ball" cx="50" cy="50" r="2.2"/>${goals}${cones}${movement}${dots}</svg>`;
}

export function planPhase2V2Seed(existingRecords, now = Date.now()) {
  const exercises = (existingRecords ?? []).filter(({ recordType }) => recordType === 'exercise');
  const existingIds = new Set(exercises.map(({ id }) => id));
  const additions = PHASE2_V2_EXERCISES.filter(({ id }) => !existingIds.has(id)).map((item) => structuredClone(item));
  const enriched = exercises.filter(({ diagram }) => !diagram?.type).map((item) => ({
    ...item,
    diagram: inferExerciseDiagram(item),
    updatedAt: now,
  }));
  return [...additions, ...enriched, { id: 'phase2-v2-seeded', recordType: 'migration', version: 3, createdAt: now }];
}

export function buildExercise(values, metadata = {}) {
  const name = clean(values.name);
  if (!name) throw new TypeError('El ejercicio necesita un nombre.');
  const category = clean(values.category);
  if (!EXERCISE_CATEGORIES.includes(category)) throw new TypeError('Selecciona una categoría válida.');
  const duration = Number(values.duration);
  if (!Number.isInteger(duration) || duration < 1 || duration > 240) throw new RangeError('La duración debe estar entre 1 y 240 minutos.');
  const difficulty = clean(values.difficulty) || 'Media';
  if (!EXERCISE_DIFFICULTIES.includes(difficulty)) throw new TypeError('Selecciona una dificultad válida.');
  return {
    id: metadata.id,
    name,
    category,
    players: clean(values.players),
    material: clean(values.material),
    duration,
    description: clean(values.description),
    variants: clean(values.variants),
    difficulty,
    space: clean(values.space),
    diagram: metadata.diagram?.type ? metadata.diagram : inferExerciseDiagram(values),
    favorite: Boolean(metadata.favorite),
    createdAt: metadata.createdAt,
    updatedAt: metadata.now,
  };
}

export function filterExercises(exercises, filters = {}) {
  if (!Array.isArray(exercises)) throw new TypeError('Los ejercicios deben ser una lista.');
  const material = clean(filters.material).toLocaleLowerCase('es');
  const players = clean(filters.players).toLocaleLowerCase('es');
  return exercises.filter((item) => (!filters.category || item.category === filters.category)
    && (!filters.difficulty || item.difficulty === filters.difficulty)
    && (!filters.favorites || item.favorite)
    && (!material || clean(item.material).toLocaleLowerCase('es').includes(material))
    && (!players || clean(item.players).toLocaleLowerCase('es').includes(players)));
}

export function buildTrainingSession(values, metadata = {}) {
  const date = clean(values.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('Selecciona una fecha válida para la sesión.');
  const mainIds = [...(values.mainExerciseIds ?? [])].filter(Boolean);
  if (mainIds.length < 2 || mainIds.length > 3) throw new RangeError('La parte principal debe tener 2 o 3 ejercicios.');
  const warmupId = clean(values.warmupId);
  const finalId = clean(values.finalExerciseId);
  const available = new Set(metadata.availableExerciseIds ?? []);
  if (![warmupId, ...mainIds, finalId].every((id) => id && available.has(id))) throw new TypeError('La sesión contiene un ejercicio que ya no está disponible.');
  const duration = (raw) => {
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 1 || value > 240) throw new RangeError('Cada bloque debe durar entre 1 y 240 minutos.');
    return value;
  };
  const blocks = [
    { type: 'warmup', exerciseId: warmupId, duration: duration(values.warmupDuration), notes: clean(values.warmupNotes) },
    ...mainIds.map((exerciseId, index) => ({ type: 'main', exerciseId, duration: duration(values.mainDurations?.[index]), notes: clean(values.mainNotes?.[index]) })),
    { type: 'final', exerciseId: finalId, duration: duration(values.finalDuration), notes: clean(values.finalNotes) },
  ];
  return {
    id: metadata.id,
    recordType: 'trainingSession',
    date,
    name: clean(values.name) || 'Sesión de entrenamiento',
    material: clean(values.material),
    notes: clean(values.notes),
    blocks,
    totalDuration: blocks.reduce((sum, block) => sum + block.duration, 0),
    createdAt: metadata.createdAt,
    updatedAt: metadata.now,
  };
}

export function sortTrainingSessions(sessions) {
  if (!Array.isArray(sessions)) throw new TypeError('Las sesiones deben ser una lista.');
  return [...sessions].sort((a, b) => String(b.date).localeCompare(String(a.date)) || (b.createdAt ?? 0) - (a.createdAt ?? 0));
}
