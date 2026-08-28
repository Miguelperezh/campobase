export const EXERCISE_CATEGORIES = Object.freeze([
  'Técnica', 'Táctica', 'Coordinación', 'Preparación física', 'Calentamiento',
  'Partido condicionado / Small-sided games', 'Porteros',
]);

export const EXERCISE_DIFFICULTIES = Object.freeze(['Baja', 'Media', 'Alta']);

const exercise = (id, name, category, players, material, duration, description, difficulty = 'Media', space = 'Adaptable', variants = 'Ajustar distancias, ritmo y número de toques al nivel del grupo.') => Object.freeze({
  id, recordType: 'exercise', name, category, players, material, duration, description, variants, difficulty, space,
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

export const WARMUP_TEMPLATES = Object.freeze([
  exercise('warmup-training-10', 'Calentamiento de entreno (10 min)', 'Calentamiento', 'Todo el equipo', 'Balones y conos', 10, 'Juego libre y movilidad con balón (5 min) + activación técnica de pases o rondo (5 min).', 'Baja', '20x20 m', 'Cambiar el rondo por pases por parejas o conducción libre.'),
  exercise('warmup-match-15', 'Calentamiento de partido (15 min)', 'Calentamiento', 'Convocados', 'Balones, conos y petos', 15, 'Movilidad articular y carrera suave (5 min) + activación con balón (5 min) + rondo o posesión reducida (5 min).', 'Media', '25x20 m', 'Ajustar intensidad y espacio según la hora, el césped y el rival.'),
]);

export const INITIAL_EXERCISES = Object.freeze([...coordination, ...technical, ...tactical, ...physical, ...WARMUP_TEMPLATES]);

const clean = (value) => String(value ?? '').trim();

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
