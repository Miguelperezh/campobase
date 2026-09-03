// Biblioteca de ejercicios de Migue — formato definitivo (vista_rapida + detalle).
// Fuente de verdad: el JSON maestro validado con GPT. Cada ejercicio nuevo se añade aquí
// con el mismo estándar: GIF limpio + textos aparte + animación con frames.

// Cada ejercicio: { id, nombre, vista_rapida, detalle, animacion }
// animacion: { gif, frames, total, frameMs } — frames es la ruta base de los fotogramas.
export const EJERCICIOS_VALIDADOS = Object.freeze([
{
  "id": "CAMPOBASE-ZIGZAG-CONDUCCION",
  "nombre": "Circuito de conducción con cambios de dirección",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación individual",
    "que_se_trabaja": [
      "Conducción",
      "Control",
      "Cambio de dirección",
      "Coordinación"
    ],
    "tiempo_estimado_15": "14-16 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 circuitos x 5"
    },
    "material": "8 conos + 5 balones / circuito",
    "series": [
      {
        "nombre": "Serie 1 · Interior",
        "instruccion": "Completar el zigzag utilizando principalmente el interior del pie y alternando ambos pies."
      },
      {
        "nombre": "Serie 2 · Exterior",
        "instruccion": "Completar el mismo recorrido utilizando principalmente el exterior del pie en cada cambio de dirección."
      },
      {
        "nombre": "Serie 3 · Suela / Recorte",
        "instruccion": "Frenar o acomodar con la suela en cada cambio y salir con un recorte corto y controlado."
      }
    ],
    "explicacion_breve": "Cada jugador sale con balón, completa el zigzag, llega al final y vuelve por fuera con su propio balón dejando espacio al siguiente.",
    "leyenda": "Azul: jugador · Balón junto al poseedor · Cono naranja/rojo · Negro: conducción · Azul discontinua: regreso con balón"
  },
  "detalle": {
    "objetivos": [
      "Mejorar el dominio del balón con ambas piernas.",
      "Trabajar cambios de dirección sin perder el control.",
      "Utilizar interior, exterior y suela."
    ],
    "claves_entrenador": [
      "Balón cerca.",
      "Cabeza arriba al final de cada cambio.",
      "Apoyos cortos y equilibrados.",
      "Usar la superficie marcada en cada serie."
    ],
    "montaje": [
      "Colocar 8 conos en dos filas alternadas formando un único zigzag.",
      "Separar aproximadamente 2 m las filas y 2-2,5 m entre cambios.",
      "Preparar 3 circuitos iguales.",
      "Colocar 5 jugadores con balón en cada circuito."
    ],
    "desarrollo": [
      "Jugador A sale con balón.",
      "Alterna un cono de un lado y el siguiente del contrario.",
      "Completa el recorrido hasta la llegada.",
      "Vuelve por fuera con su propio balón.",
      "Sale el siguiente cuando hay distancia suficiente."
    ],
    "que_buscamos": [
      "Conducción controlada.",
      "Cambios cortos y eficaces.",
      "Uso correcto de la superficie indicada.",
      "Continuidad en el recorrido."
    ],
    "que_observar": [
      "Balón cerca del poseedor.",
      "Uso correcto de interior, exterior o suela.",
      "Equilibrio corporal.",
      "Regreso por fuera sin invadir el circuito."
    ],
    "correcciones": [
      "Balón cerca.",
      "Interior.",
      "Exterior.",
      "Suela y sal.",
      "Cambio corto.",
      "Cabeza arriba."
    ],
    "reglas": [
      "Todos realizan el mismo recorrido.",
      "El balón se conduce, no se golpea largo.",
      "El siguiente sale con espacio suficiente."
    ],
    "si_sale_mal": [
      "Aumentar la distancia entre conos.",
      "Reducir la velocidad.",
      "Empezar con pie dominante antes de alternar."
    ],
    "si_sale_bien": [
      "Aumentar el ritmo.",
      "Añadir pase o finalización al final.",
      "Competición por tiempo entre filas."
    ],
    "variantes": [
      "Solo pie izquierdo.",
      "Solo pie derecho.",
      "Añadir pase final.",
      "Último cono con 1x1 ante defensor pasivo."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Fútbol - Controla Club",
      "ejercicio_original": "Circuito de conducción con cambios de dirección",
      "adaptacion_operativa": true,
      "notas": [
        "Organización adaptada a 15 jugadores mediante 3 circuitos x 5.",
        "Las tres series se mantienen visibles también en la animación.",
        "Regreso por fuera con balón en la versión operativa validada."
      ]
    }
  }
},
{
  "id": "CAMPOBASE-CALENTAMIENTO-ESCALERA-COORDINACION",
  "nombre": "Calentamiento dinámico con escalera de coordinación",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Calentamiento / activación",
    "que_se_trabaja": [
      "Activación neuromuscular",
      "Coordinación de pies y brazos",
      "Preparación articular",
      "Desplazamientos"
    ],
    "tiempo_estimado_15": "12 min",
    "jugadores": {
      "total": 15,
      "organizacion": "Circuito continuo de 4 estaciones. Los 15 jugadores circulan de forma escalonada por las estaciones."
    },
    "material": "1 escalera de coordinación + 2 vallas bajas + conos suficientes para montar el zigzag y delimitar la salida. La fuente no fija un número exacto de conos.",
    "series": [
      {
        "nombre": "Vuelta 1",
        "instruccion": "Completar las cuatro estaciones a ritmo inicial controlado."
      },
      {
        "nombre": "Vuelta 2",
        "instruccion": "Repetir el circuito aumentando progresivamente el ritmo."
      },
      {
        "nombre": "Vuelta 3",
        "instruccion": "Completar la tercera vuelta al ritmo más alto de las tres, manteniendo buena ejecución."
      }
    ],
    "explicacion_breve": "Circuito continuo de cuatro estaciones: trote suave, escalera de coordinación, dos vallas bajas y zigzag entre conos. Se realizan 3 vueltas a ritmo creciente.",
    "leyenda": "Azul: jugador · Q: jugador esperando · Naranja: cono · Blanco: escalera/valla · Azul discontinuo: desplazamiento"
  },
  "detalle": {
    "objetivos": [
      "Activación neuromuscular.",
      "Coordinación de pies y brazos.",
      "Preparación articular antes del entrenamiento."
    ],
    "claves_entrenador": [
      "Pisar con la planta completa, no con los talones.",
      "Mantener el tronco erguido y la mirada al frente.",
      "Subir gradualmente la intensidad."
    ],
    "montaje": [
      "Montar un circuito de 4 estaciones dentro de un espacio aproximado de 15 x 10 m.",
      "Estación A: zona de trote suave.",
      "Estación B: escalera de coordinación.",
      "Estación C: 2 vallas bajas.",
      "Estación D: zigzag entre conos.",
      "La fuente no fija el número exacto de conos del zigzag."
    ],
    "desarrollo": [
      "Estación A: trote suave durante 30 segundos.",
      "Estación B: escalera con 1 paso por casilla, combinando cambio frontal y lateral.",
      "Estación C: pasar 2 vallas bajas con desplazamiento lateral y skipping medio.",
      "Estación D: realizar zigzag entre conos con desplazamientos cortos.",
      "Completar 3 vueltas al circuito a ritmo creciente."
    ],
    "que_buscamos": [
      "Activar progresivamente antes de la parte principal.",
      "Coordinar pies y brazos sin perder postura.",
      "Mejorar la calidad de los apoyos.",
      "Aumentar el ritmo de manera gradual, no empezar a máxima intensidad."
    ],
    "que_observar": [
      "Tipo de apoyo del pie.",
      "Postura del tronco.",
      "Mirada al frente.",
      "Coordinación de brazos y piernas.",
      "Progresión real de intensidad entre vueltas."
    ],
    "correcciones": [
      "Planta completa.",
      "Tronco arriba.",
      "Mira al frente.",
      "Coordina brazos.",
      "Sube el ritmo poco a poco."
    ],
    "reglas": [
      "Las 4 estaciones se realizan en serie continua.",
      "Se completan 3 vueltas.",
      "La intensidad aumenta progresivamente."
    ],
    "si_sale_mal": [
      "Reducir el ritmo para recuperar calidad de apoyo y coordinación.",
      "Separar más las salidas si se acumulan jugadores."
    ],
    "si_sale_bien": [
      "Aplicar las variantes propuestas por la fuente sin alterar la estructura base."
    ],
    "variantes": [
      "Añadir balón en la última estación con conducción suave.",
      "Trabajar en parejas imitando el patrón del compañero.",
      "Finalizar con sprints de 10 m al 80%."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Calentamiento dinámico con escalera de coordinación",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 12 min, 4-20 participantes, espacio 15 x 10 m y edades SUB-10 en adelante.",
        "La fuente describe 10 minutos de circuito continuo dentro de una duración total de 12 minutos.",
        "La distribución escalonada de 15 jugadores es una adaptación operativa para CampoBase.",
        "El número de conos del zigzag no está especificado en la fuente; el GIF los representa de forma esquemática y el JSON no fija una cantidad inventada.",
        "No se incluye balón en el GIF base porque aparece únicamente como variante."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-CALENTAMIENTO-ESCALERA-COORDINACION/CampoBase_Calentamiento_Escalera_Coordinacion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-CALENTAMIENTO-ESCALERA-COORDINACION/frames/f",
    "total": 232,
    "frameMs": 113
  }
},
{
  "id": "CAMPOBASE-TRANSICION-4V3-CONTRAATAQUE",
  "nombre": "Transición 4v3 al contraataque",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Transición",
    "que_se_trabaja": [
      "Transición ofensiva",
      "Superioridad 4v3",
      "Toma de decisión",
      "Repliegue defensivo",
      "Finalización rápida"
    ],
    "tiempo_estimado_15": "20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "7 activos por acción (4 atacantes + 3 defensores) y 8 jugadores en colas de rotación"
    },
    "material": "1 portería + balones + petos de 2 colores + conos/marcadores para las posiciones de salida",
    "series": [
      {
        "nombre": "Acciones consecutivas",
        "instruccion": "Repetir la situación 4v3. Tras gol, palo o pérdida, salen los participantes de la acción y entra el siguiente grupo desde las colas."
      }
    ],
    "explicacion_breve": "El entrenador pasa a uno de los cuatro atacantes y comienza un 4v3 hacia portería. Los atacantes deben finalizar antes de 8 segundos mientras los tres defensores intentan recuperar.",
    "leyenda": "Azul: atacante · Rojo: defensor · Negro: entrenador · Balón junto al poseedor · Cono: punto de salida · Azul discontinuo: pase del entrenador · Negro discontinuo: movimiento atacante · Rojo discontinuo: movimiento defensor · Azul continuo: tiro"
  },
  "detalle": {
    "objetivos": [
      "Velocidad de transición ofensiva.",
      "Toma de decisión en superioridad numérica.",
      "Repliegue defensivo organizado."
    ],
    "claves_entrenador": [
      "Atacar con velocidad, pero realizar el último pase con la cabeza levantada.",
      "Fijar al defensor antes de pasar al hombre libre.",
      "Los defensores deben cerrar el centro y orientar el ataque hacia fuera."
    ],
    "montaje": [
      "Utilizar medio campo y una portería.",
      "Colocar 4 atacantes en línea sobre el medio campo.",
      "Colocar 3 defensores 5 m por detrás de los atacantes.",
      "El entrenador se sitúa con balones para iniciar cada acción.",
      "Para trabajar con 15 jugadores, mantener 7 activos y organizar a los 8 restantes en colas de rotación."
    ],
    "desarrollo": [
      "El entrenador pasa el balón a uno de los atacantes.",
      "En ese momento comienza el ataque 4v3.",
      "Los tres defensores salen a recuperar.",
      "Los cuatro atacantes deben finalizar antes de 8 segundos.",
      "Tras gol, palo o pérdida, terminan la acción y entra el siguiente grupo."
    ],
    "que_buscamos": [
      "Aprovechar la superioridad numérica antes de que la defensa se organice.",
      "Atacar con velocidad sin precipitar la última decisión.",
      "Fijar defensores para liberar compañeros.",
      "Defender cerrando primero el espacio central."
    ],
    "que_observar": [
      "Si el ataque reconoce con rapidez dónde está el jugador libre.",
      "Si el poseedor levanta la cabeza antes de decidir.",
      "Si los defensores protegen el centro.",
      "Si la acción termina dentro de los 8 segundos."
    ],
    "correcciones": [
      "Ataca rápido.",
      "Cabeza arriba.",
      "Fija y suelta.",
      "Busca al libre.",
      "Cierra el centro.",
      "Obliga fuera."
    ],
    "reglas": [
      "La acción comienza con el pase del entrenador.",
      "Se juega en superioridad 4v3.",
      "El ataque debe finalizar antes de 8 segundos.",
      "La acción termina con gol, palo o pérdida."
    ],
    "si_sale_mal": [
      "Usar la variante 3v2 propuesta en la fuente para simplificar la toma de decisión."
    ],
    "si_sale_bien": [
      "Usar la variante 5v3 propuesta en la fuente.",
      "Añadir un defensor que salga desde la portería 3 segundos después.",
      "Si un defensor recupera, permitir el contraataque hacia una miniportería situada en medio campo."
    ],
    "variantes": [
      "3v2 o 5v3 según el nivel.",
      "Añadir un defensor que arranca desde la portería tras 3 segundos.",
      "Si el defensor recupera, contraataca hacia una portería pequeña en medio campo."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Transición 4v3 al contra-ataque",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 20 min, 8-14 participantes, medio campo y edades SUB-14 en adelante.",
        "La adaptación para CampoBase organiza 15 jugadores mediante 7 activos y 8 en colas de rotación.",
        "El GIF no impone combinaciones de pases entre atacantes porque la fuente no define una secuencia concreta.",
        "La animación muestra únicamente el inicio con pase del entrenador, la salida del 4v3, el repliegue defensivo y una finalización simple."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-TRANSICION-4V3-CONTRAATAQUE/CampoBase_Transicion_4v3_Contraataque.gif",
    "frames": "assets/ejercicios/CAMPOBASE-TRANSICION-4V3-CONTRAATAQUE/frames/f",
    "total": 73,
    "frameMs": 111
  }
},
{
  "id": "CAMPOBASE-PARTIDO-3-ZONAS",
  "nombre": "Partido condicionado en 3 zonas",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica colectiva",
    "que_se_trabaja": [
      "Progresión por zonas",
      "Cambio de orientación",
      "Búsqueda del hombre libre",
      "Líneas de pase",
      "Movilidad sin balón"
    ],
    "tiempo_estimado_15": "25 min",
    "jugadores": {
      "total": 15,
      "organizacion": "7v7 + 1 relevo rotativo"
    },
    "material": "Balones + 2 juegos de petos + conos para delimitar 40 x 30 m y dividir 3 zonas + 2 porterías",
    "series": [
      {
        "nombre": "Serie 1",
        "instruccion": "5 min de juego condicionado con la regla base."
      },
      {
        "nombre": "Serie 2",
        "instruccion": "5 min de juego condicionado con la misma regla base."
      },
      {
        "nombre": "Serie 3",
        "instruccion": "5 min de juego condicionado con la misma regla base."
      },
      {
        "nombre": "Serie 4",
        "instruccion": "5 min de juego condicionado con la misma regla base."
      }
    ],
    "explicacion_breve": "Partido en un campo dividido en tres zonas. Para que el gol sea válido, el balón debe pasar por las tres y participar al menos un compañero distinto en cada zona.",
    "leyenda": "Azul: equipo con balón · Rojo: rival · Amarillo: relevo rotativo · Balón junto al poseedor · Negro: pase/progresión · Línea blanca: límite de zona"
  },
  "detalle": {
    "objetivos": [
      "Mantener la posesión mientras se progresa por zonas.",
      "Mejorar los cambios de orientación.",
      "Favorecer la búsqueda del hombre libre."
    ],
    "claves_entrenador": [
      "Crear líneas de pase verticales y diagonales.",
      "No saltarse zonas: progresión real con balón controlado.",
      "Después de pasar, volver a ofrecer apoyo."
    ],
    "montaje": [
      "Delimitar un campo de 40 x 30 m.",
      "Dividirlo en tres zonas horizontales iguales con dos líneas interiores de conos.",
      "Usar dos porterías, una en cada fondo.",
      "Para 15 jugadores: organizar 7v7 y dejar 1 jugador como relevo rotativo."
    ],
    "desarrollo": [
      "El equipo con balón inicia desde su zona defensiva.",
      "Debe progresar hasta la zona intermedia y después hasta la zona ofensiva.",
      "Para que el gol sea válido, el balón debe haber pasado por las tres zonas.",
      "En cada zona debe intervenir al menos un compañero distinto.",
      "Si cambia la posesión, la misma regla comienza para el otro equipo.",
      "Realizar cuatro series de cinco minutos."
    ],
    "que_buscamos": [
      "Que el equipo ocupe bien las tres zonas.",
      "Que el poseedor tenga siempre varias líneas de pase.",
      "Que se cambie de orientación cuando un lado está cerrado.",
      "Que los jugadores se muevan después de pasar."
    ],
    "que_observar": [
      "Distancias entre jugadores y líneas.",
      "Líneas de pase verticales y diagonales.",
      "Uso del hombre libre.",
      "Capacidad para progresar sin saltarse zonas.",
      "Reacción tras pérdida de posesión."
    ],
    "correcciones": [
      "Abre.",
      "Mira antes.",
      "Cambia de lado.",
      "Apoya otra vez.",
      "No te saltes la zona."
    ],
    "reglas": [
      "El gol solo es válido si el balón pasa por las tres zonas.",
      "Debe tocar el balón al menos un compañero distinto en cada zona.",
      "Al cambiar la posesión, la regla se reinicia para el nuevo equipo."
    ],
    "si_sale_mal": [
      "Ampliar ligeramente el espacio.",
      "Permitir más tiempo o más toques en la zona media.",
      "Parar brevemente para recolocar distancias."
    ],
    "si_sale_bien": [
      "Limitar a dos toques en la zona media.",
      "Bonificar el gol tras cambio de orientación.",
      "Reducir ligeramente el espacio."
    ],
    "variantes": [
      "Bonificar gol por jugada que pase por banda exterior.",
      "Limitar a 2 toques en zona media.",
      "Permitir al portero jugar como hombre extra."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Fútbol - Controla Club",
      "ejercicio_original": "Partido condicionado en 3 zonas",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente propone un partido 6v6 en 40 x 30 m dividido en tres zonas.",
        "La fuente indica 4 series de 5 minutos con 1 minuto de descanso.",
        "La organización 7v7 + 1 relevo rotativo es una adaptación operativa para trabajar siempre con 15 jugadores.",
        "La secuencia que se ve en el GIF es solo una visualización de una progresión válida; no obliga a repetir esa jugada."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PARTIDO-3-ZONAS/CampoBase_Partido_3_Zonas.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PARTIDO-3-ZONAS/frames/f",
    "total": 191,
    "frameMs": 143
  }
}
]);

// Convierte un ejercicio validado al formato interno de CampoBase (para sesiones, filtros, etc.).
export function toCampoBaseExercise(item) {
  const vr = item.vista_rapida || {};
  return {
    id: item.id,
    recordType: 'exercise',
    name: item.nombre,
    category: vr.tipo_principal || 'Técnica',
    players: `${vr.jugadores?.total ?? ''} · ${vr.jugadores?.organizacion ?? ''}`,
    material: vr.material || '',
    duration: parseDuration(vr.tiempo_estimado_15),
    description: vr.explicacion_breve || '',
    works: vr.que_se_trabaja || [],
    favorite: false,
    example: false,
    validated: true,
    source: 'validado',
    createdAt: 1,
    updatedAt: 1,
  };
}

// "14-16 min" -> 15 (valor medio para el descuento de sesión).
function parseDuration(text) {
  const match = String(text ?? '').match(/(\d+)\s*-\s*(\d+)/);
  if (match) return Math.round((Number(match[1]) + Number(match[2])) / 2);
  const single = String(text ?? '').match(/(\d+)/);
  return single ? Number(single[1]) : 15;
}

export function findValidatedExercise(id) {
  return EJERCICIOS_VALIDADOS.find((item) => item.id === id);
}
