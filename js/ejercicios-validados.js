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
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": ["Conducción", "Cambios de dirección", "Regate", "Control"],
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
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-ZIGZAG-CONDUCCION/CampoBase_ZigZag_FINAL_HERMES.gif",
    "frames": "assets/ejercicios/CAMPOBASE-ZIGZAG-CONDUCCION/frames/f",
    "total": 140,
    "frameMs": 143
  }
},
{
  "id": "CAMPOBASE-CALENTAMIENTO-ESCALERA-COORDINACION",
  "nombre": "Calentamiento dinámico con escalera de coordinación",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Calentamiento/activación",
    "que_se_trabaja": ["Coordinación", "Movilidad", "Escalera de coordinación", "Activación"],
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
    "que_se_trabaja": ["Contraataque", "Superioridad 4x3", "Desmarque", "Finalización"],
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
    "tipo_principal": "Táctica",
    "que_se_trabaja": ["Ocupación de espacios", "Progresión", "Apoyos", "Amplitud", "Juego por zonas"],
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
},
{
  "id": "CAMPOBASE-PORTEROS-BLOCAJE-DESPEJE-SAQUE",
  "nombre": "Porteros: blocaje, despeje y saque",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Porteros",
    "que_se_trabaja": ["Blocaje", "Despeje", "Saque", "Distribución"],
    "tiempo_estimado_15": "120 min con 1 portería si los 15 deben completar íntegramente los 30 min en grupos de 2-4",
    "jugadores": {
      "total": 15,
      "organizacion": "La fuente está diseñada para 2-4 porteros. Para 15 jugadores y una sola portería serían 4 grupos (4+4+4+3) trabajando de forma sucesiva."
    },
    "material": "1 portería + balones. Para el bloque de juego con los pies se necesita al menos un compañero receptor y un jugador que ejerza presión. La fuente no especifica conos ni petos como material obligatorio.",
    "series": [
      {
        "nombre": "Bloque 1 · Blocaje",
        "instruccion": "8 min: blocaje frontal y lateral con balones rasos y a media altura."
      },
      {
        "nombre": "Bloque 2 · Despeje",
        "instruccion": "6 min: despeje con dos puños tras centro al área."
      },
      {
        "nombre": "Bloque 3 · Saque",
        "instruccion": "6 min: saque de mano rodante y tenso, y saque de volea."
      },
      {
        "nombre": "Bloque 4 · Juego con los pies",
        "instruccion": "10 min: salida del balón con los pies a un compañero presionado."
      }
    ],
    "explicacion_breve": "Sesión específica de portero dividida en cuatro bloques: blocaje, despeje, saques y salida con los pies.",
    "leyenda": "P: portero · S: servidor · C: compañero · D: jugador que presiona · Azul: envío/saque/pase · Rojo: despeje/volea · Rojo discontinuo: movimiento de presión"
  },
  "detalle": {
    "objetivos": [
      "Técnica de blocaje a media y baja altura.",
      "Despeje de puños con dos manos.",
      "Saque de mano y de volea."
    ],
    "claves_entrenador": [
      "Manos en forma de W para el blocaje alto.",
      "Apoyo perpendicular antes de despejar.",
      "En el saque, balón firme y trayectoria tensa, no parabólica."
    ],
    "montaje": [
      "Utilizar 1 portería y aproximadamente 25 m de profundidad.",
      "Organizar entre 2 y 4 porteros, tal como indica la fuente.",
      "Preparar balones para encadenar las acciones de los cuatro bloques.",
      "En el bloque 4 se necesita un compañero que reciba bajo presión."
    ],
    "desarrollo": [
      "Bloque 1 (8 min): realizar blocajes frontales y laterales con balones rasos y a media altura.",
      "Bloque 2 (6 min): realizar despejes con dos puños tras centros al área.",
      "Bloque 3 (6 min): practicar saque de mano rodante, saque de mano tenso y saque de volea.",
      "Bloque 4 (10 min): trabajar la salida del balón con los pies hacia un compañero presionado."
    ],
    "que_buscamos": [
      "Seguridad técnica en el blocaje.",
      "Despeje firme y bien orientado.",
      "Distribución precisa con mano y volea.",
      "Tomar una decisión segura cuando se juega con los pies."
    ],
    "que_observar": [
      "Forma de las manos en los blocajes.",
      "Posición del apoyo antes del despeje.",
      "Dirección y tensión de los saques.",
      "Precisión de la salida con los pies hacia el compañero."
    ],
    "correcciones": [
      "Manos en W.",
      "Ataca el balón.",
      "Apoyo antes de despejar.",
      "Saque tenso.",
      "Mira antes de jugar con el pie."
    ],
    "reglas": [
      "Respetar la secuencia de los cuatro bloques.",
      "Bloque 1: 8 min.",
      "Bloque 2: 6 min.",
      "Bloque 3: 6 min.",
      "Bloque 4: 10 min."
    ],
    "si_sale_mal": [
      "Reducir velocidad y dificultad del servicio para recuperar técnica correcta antes de progresar."
    ],
    "si_sale_bien": [
      "Aplicar las variantes propuestas por la fuente: añadir disputa aérea, buscar zonas objetivo o combinar con un central."
    ],
    "variantes": [
      "Añadir un atacante que dispute el balón aéreo.",
      "Realizar el saque buscando una zona objetivo del campo.",
      "Trabajo combinado con un central para iniciar la jugada."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Porteros: blocaje, despeje y saque",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 30 min, 2-4 participantes y 1 portería + 25 m.",
        "Las edades indicadas son SUB-10 en adelante.",
        "El cálculo para 15 jugadores mantiene el límite de 2-4 participantes de la fuente: cuatro grupos sucesivos equivalen a 120 min si todos completan la sesión íntegra.",
        "El servidor del GIF es un rol operativo para visualizar los servicios de blocaje y los centros; la fuente no identifica quién los realiza.",
        "El bloque 4 sí especifica un compañero presionado.",
        "El GIF base no incorpora la variante de zona objetivo. En el bloque 3 solo representa las tres formas que sí aparecen en el desarrollo: saque de mano rodante, saque de mano tenso y saque de volea."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PORTEROS-BLOCAJE-DESPEJE-SAQUE/CampoBase_Porteros_Blocaje_Despeje_Saque.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PORTEROS-BLOCAJE-DESPEJE-SAQUE/frames/f",
    "total": 127,
    "frameMs": 167
  }
},
{
  "id": "CAMPOBASE-JUEGO-REDUCIDO-3V3-4-MINIPORTERIAS",
  "nombre": "Juego reducido 3v3 con 4 mini porterías",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Juego reducido",
    "que_se_trabaja": ["3x3", "Cambio de orientación", "Cobertura", "Finalización"],
    "tiempo_estimado_15": "15 min",
    "jugadores": {
      "total": 15,
      "organizacion": "2 campos simultáneos de 3v3 (12 jugadores activos) + 3 relevos rotativos entre series"
    },
    "material": "8 miniporterías + balones + petos de 2 colores + conos para delimitar 2 campos de 25 x 20 m",
    "series": [
      {
        "nombre": "Serie 1",
        "instruccion": "4 min de 3v3 con la regla base. Después, 1 min para descanso y rotación."
      },
      {
        "nombre": "Serie 2",
        "instruccion": "4 min de 3v3 con la misma regla base. Después, 1 min para descanso y rotación."
      },
      {
        "nombre": "Serie 3",
        "instruccion": "4 min de 3v3 con la misma regla base."
      }
    ],
    "explicacion_breve": "Dos equipos de 3 juegan sin portero. Cada equipo puede marcar en cualquiera de las dos miniporterías situadas en la línea de fondo rival.",
    "leyenda": "Azul: un equipo · Rojo: rival · Amarillo: relevo rotativo · Balón junto al poseedor · Blanco: miniportería · Azul: tiro a una de las dos miniporterías rivales"
  },
  "detalle": {
    "objetivos": [
      "Mejorar el cambio de orientación y la visión periférica.",
      "Tomar decisiones sobre qué portería rival atacar.",
      "Defender manteniendo cobertura permanente."
    ],
    "claves_entrenador": [
      "Buscar la portería menos defendida.",
      "Defender formando triángulo y evitar quedar los tres jugadores en la misma línea.",
      "Cambiar el juego rápido cuando se cierra una banda."
    ],
    "montaje": [
      "Marcar un campo de 25 x 20 m.",
      "Colocar 2 miniporterías en cada línea de fondo, separadas 10 m.",
      "Formar dos equipos de 3 jugadores.",
      "No utilizar porteros.",
      "Para trabajar con 15 jugadores, montar 2 campos iguales simultáneamente y dejar 3 jugadores como relevos rotativos."
    ],
    "desarrollo": [
      "Jugar un partido 3v3.",
      "Cualquier miniportería de la línea de fondo rival es válida para marcar.",
      "No hay porteros.",
      "No se permiten saques largos.",
      "Cuando el balón sale fuera, se reanuda con un pase rasante.",
      "Realizar 3 series de 4 minutos con 1 minuto de descanso."
    ],
    "que_buscamos": [
      "Identificar rápidamente cuál de las dos porterías está menos protegida.",
      "Cambiar la orientación del ataque si un lado está cerrado.",
      "Mantener amplitud y diferentes líneas de pase.",
      "Que los defensores se den cobertura entre sí."
    ],
    "que_observar": [
      "Si el poseedor levanta la cabeza antes de decidir.",
      "Si el equipo cambia de objetivo cuando una miniportería queda bien defendida.",
      "Si los tres defensores evitan colocarse en una sola línea.",
      "Si los reinicios de banda se hacen mediante pase rasante."
    ],
    "correcciones": [
      "Mira las dos porterías.",
      "Cambia de lado.",
      "No os pongáis en línea.",
      "Da cobertura.",
      "Saque rasante."
    ],
    "reglas": [
      "Cualquier miniportería rival vale gol.",
      "No hay porteros.",
      "Balón fuera: entrada con pase rasante.",
      "No realizar saques largos.",
      "3 series de 4 minutos con 1 minuto de descanso."
    ],
    "si_sale_mal": [
      "Mantener la estructura 3v3 y ampliar ligeramente el espacio entre jugadores dentro del mismo campo sin cambiar las reglas.",
      "Recordar visualmente a los jugadores que disponen de dos objetivos de ataque."
    ],
    "si_sale_bien": [
      "Aplicar una de las variantes propuestas por la fuente."
    ],
    "variantes": [
      "4v4 con 4 miniporterías por equipo.",
      "Añadir un comodín neutro que apoye al equipo en posesión.",
      "Solo permitir gol después de 3 pases consecutivos."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Juego reducido 3v3 con 4 mini porterías",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 15 min, 6-12 participantes, espacio 25 x 20 m y edades SUB-8 a SUB-14.",
        "La fuente utiliza un solo campo con 6 jugadores activos. Para 15 jugadores, CampoBase adapta la organización a dos campos simultáneos de 3v3 y tres relevos.",
        "Esta adaptación duplica el material de campo: 8 miniporterías en total.",
        "El GIF muestra únicamente una finalización representativa hacia una de las dos miniporterías rivales; no establece una combinación de pases obligatoria porque la fuente no define ninguna secuencia concreta.",
        "Las tres series mantienen exactamente la misma regla base; el cambio visual de portería solo sirve para representar que cualquiera de las dos porterías rivales es válida."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-JUEGO-REDUCIDO-3V3-4-MINIPORTERIAS/CampoBase_Juego_Reducido_3v3_4_Miniporterias.gif",
    "frames": "assets/ejercicios/CAMPOBASE-JUEGO-REDUCIDO-3V3-4-MINIPORTERIAS/frames/f",
    "total": 74,
    "frameMs": 242
  }
},
{
  "id": "CAMPOBASE-YOYO-CON-BALON",
  "nombre": "Trabajo intermitente tipo Yo-Yo (con balón)",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física integrada",
    "que_se_trabaja": ["Resistencia intermitente", "Conducción", "Cambios de ritmo"],
    "tiempo_estimado_15": "20 min según la duración global indicada por la fuente",
    "jugadores": {
      "total": 15,
      "organizacion": "15 jugadores con balón. Para representar el trabajo con claridad en CampoBase se muestran 5 pasillos visuales con 3 jugadores escalonados por pasillo."
    },
    "material": "15 balones + conos para marcar dos líneas separadas 40 m",
    "series": [
      {
        "nombre": "Serie 1 · 14 s / 14 s",
        "instruccion": "8 repeticiones. Ida y vuelta de 40 m con balón en 14 s y descanso de 14 s."
      },
      {
        "nombre": "Serie 2 · 12 s / 12 s",
        "instruccion": "6 repeticiones. Ida y vuelta de 40 m con balón en 12 s y descanso de 12 s."
      },
      {
        "nombre": "Serie 3 · 10 s / 20 s",
        "instruccion": "5 repeticiones. Ida y vuelta de 40 m con balón en 10 s y descanso de 20 s."
      },
      {
        "nombre": "Cierre · Estiramientos",
        "instruccion": "5 min de estiramientos pasivos."
      }
    ],
    "explicacion_breve": "Cada jugador conduce su propio balón entre dos líneas separadas 40 m, realizando idas y vueltas cada vez más rápidas con pausas entre repeticiones.",
    "leyenda": "Azul: jugador · Balón junto al poseedor · Naranja: cono de línea · Azul discontinuo: conducción ida · Negro discontinuo: conducción vuelta"
  },
  "detalle": {
    "objetivos": [
      "Mejorar la resistencia específica intermitente.",
      "Mantener la toma de decisión bajo fatiga.",
      "Trabajar velocidad con balón."
    ],
    "claves_entrenador": [
      "No abandonar la técnica de conducción aunque aparezca fatiga.",
      "Realizar un frenado controlado en cada cono.",
      "Hidratarse en cada bloque."
    ],
    "montaje": [
      "Marcar dos líneas separadas 40 m con conos.",
      "Cada jugador parte con un balón.",
      "Con 15 jugadores, disponer anchura suficiente para que puedan realizar el recorrido sin interferirse.",
      "La representación en 5 pasillos de 3 jugadores es una adaptación visual de CampoBase; el PDF no define pasillos ni número de calles."
    ],
    "desarrollo": [
      "Serie 1: realizar 8 repeticiones de ida y vuelta en 14 segundos, seguidas de 14 segundos de descanso.",
      "Serie 2: realizar 6 repeticiones de ida y vuelta en 12 segundos, seguidas de 12 segundos de descanso.",
      "Serie 3: realizar 5 repeticiones de ida y vuelta en 10 segundos, seguidas de 20 segundos de descanso.",
      "Finalizar con 5 minutos de estiramientos pasivos."
    ],
    "que_buscamos": [
      "Mantener el balón controlado aunque aumente la velocidad.",
      "Acelerar progresivamente entre series.",
      "Frenar con control al llegar a cada línea.",
      "Conservar calidad técnica a pesar de la fatiga."
    ],
    "que_observar": [
      "Distancia del balón respecto al jugador durante la conducción.",
      "Control del frenado antes del cambio de sentido.",
      "Si se mantiene la técnica cuando aumenta la fatiga.",
      "Si cada jugador respeta los tiempos de trabajo y recuperación."
    ],
    "correcciones": [
      "Balón cerca.",
      "Frena antes de girar.",
      "No sacrifiques técnica.",
      "Respeta el tiempo.",
      "Hidrátate entre bloques."
    ],
    "reglas": [
      "Cada jugador trabaja con su propio balón.",
      "Las líneas están separadas 40 m.",
      "Serie 1: 8 repeticiones, 14 s de trabajo y 14 s de descanso.",
      "Serie 2: 6 repeticiones, 12 s de trabajo y 12 s de descanso.",
      "Serie 3: 5 repeticiones, 10 s de trabajo y 20 s de descanso.",
      "Cierre con 5 min de estiramientos pasivos."
    ],
    "si_sale_mal": [
      "La fuente no aporta una regresión específica. No se añade una que no esté documentada."
    ],
    "si_sale_bien": [
      "Aplicar una de las variantes propuestas por la fuente."
    ],
    "variantes": [
      "Realizar la última serie sin balón para aumentar la velocidad.",
      "Finalizar con remate a portería en cada vuelta.",
      "Trabajar por parejas: uno corre mientras el otro descansa."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Trabajo intermitente tipo Yo-Yo (con balón)",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente lo clasifica como Preparación física · Avanzado.",
        "La fuente indica 20 min, 4-20 participantes, espacio lineal de 40 m y edades SUB-14, SUB-16, SUB-18 y adultos.",
        "Por edad y exigencia, no está planteado por la fuente para Alevín / SUB-12.",
        "La distribución visual en 5 pasillos de 3 jugadores se usa únicamente para que los 15 jugadores sean legibles en la animación; el PDF no define pasillos.",
        "Existe una discrepancia interna en los tiempos: las repeticiones y descansos escritos, más 5 min de estiramientos, suman aproximadamente 13 min 38 s, mientras que la ficha declara una duración total de 20 min. CampoBase conserva ambos datos y no inventa el tiempo restante.",
        "La fuente no indica que la vuelta sea trotando ni una recuperación: cada repetición se describe como ida y vuelta dentro del tiempo marcado, por lo que ambas direcciones forman parte del trabajo cronometrado con balón."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-YOYO-CON-BALON/CampoBase_YoYo_con_Balon.gif",
    "frames": "assets/ejercicios/CAMPOBASE-YOYO-CON-BALON/frames/f",
    "total": 129,
    "frameMs": 173
  }
},
{
  "id": "CAMPOBASE-POSESION-7V7-1-COMODIN-15",
  "nombre": "Posesión 7v7+2 con comodines",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": ["Conservación", "Comodín", "Apoyos", "Cambio de orientación"],
    "tiempo_estimado_15": "25 min",
    "jugadores": {
      "total": 15,
      "organizacion": "7v7 + 1 comodín neutral. Adaptación mínima del 7v7+2 original para poder trabajar exactamente con 15 jugadores."
    },
    "material": "Balones + petos para 2 equipos + 1 peto de color distinto para el comodín + conos para delimitar 40 x 30 m",
    "series": [
      {
        "nombre": "Serie 1",
        "instruccion": "6 min de posesión. 1 punto por 8 pases consecutivos."
      },
      {
        "nombre": "Serie 2",
        "instruccion": "6 min de posesión. Rotar quién actúa como comodín."
      },
      {
        "nombre": "Serie 3",
        "instruccion": "6 min de posesión. Nueva rotación del comodín."
      }
    ],
    "explicacion_breve": "Dos equipos intentan conservar el balón. El comodín neutral juega siempre con el equipo que tiene la posesión. Cada 8 pases consecutivos se consigue 1 punto.",
    "leyenda": "Azul: equipo A · Rojo: equipo B · Amarillo: comodín neutral que juega con quien tiene el balón · Balón junto al poseedor · Azul: pase"
  },
  "detalle": {
    "objetivos": [
      "Mantener la posesión bajo presión real.",
      "Utilizar el comodín como apoyo.",
      "Trabajar el cambio de orientación."
    ],
    "claves_entrenador": [
      "Buscar triangulación constante y al menos 3 líneas de pase.",
      "No jugar con el comodín por obligación: utilizarlo cuando aporta una ventaja.",
      "Después de pasar, buscar un nuevo apoyo."
    ],
    "montaje": [
      "Delimitar un espacio de 40 x 30 m.",
      "En la fuente original se forman dos equipos de 7 jugadores y 2 comodines neutrales.",
      "Para 15 jugadores, mantener los dos equipos de 7 y utilizar 1 comodín neutral.",
      "El comodín lleva peto de color diferente."
    ],
    "desarrollo": [
      "El equipo que tiene el balón intenta conservar la posesión.",
      "El comodín neutral juega siempre con el equipo que está en posesión.",
      "Cada 8 pases consecutivos sin pérdida suman 1 punto.",
      "Si cambia la posesión, el contador comienza de nuevo para el otro equipo.",
      "Realizar 3 bloques de 6 minutos.",
      "Rotar el rol de comodín entre bloques."
    ],
    "que_buscamos": [
      "Que el poseedor tenga varias líneas de pase.",
      "Que los jugadores se muevan después de pasar.",
      "Que el comodín sirva como apoyo para salir de presión o cambiar la orientación.",
      "Que el equipo no fuerce el pase al comodín si existe una opción mejor."
    ],
    "que_observar": [
      "Número y calidad de líneas de pase alrededor del poseedor.",
      "Movilidad después de cada pase.",
      "Uso útil del comodín.",
      "Capacidad para cambiar la orientación.",
      "Reacción inmediata al perder la posesión y reinicio del contador."
    ],
    "correcciones": [
      "Da tres apoyos.",
      "Muévete después de pasar.",
      "No fuerces al comodín.",
      "Cambia de lado.",
      "Reinicia la cuenta tras pérdida."
    ],
    "reglas": [
      "El comodín juega siempre con el equipo en posesión.",
      "1 punto por 8 pases consecutivos.",
      "Al perder el balón, el contador pasa a cero para el nuevo equipo.",
      "3 bloques de 6 minutos con rotación del comodín."
    ],
    "si_sale_mal": [
      "La fuente no aporta una regresión específica. No se añade una no documentada."
    ],
    "si_sale_bien": [
      "Aplicar una de las variantes propuestas por la fuente."
    ],
    "variantes": [
      "Colocar los comodines en el exterior del campo.",
      "Dar un punto extra si un cambio de orientación incluye al comodín.",
      "Limitar a 2 toques en la zona central."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Posesión 7v7+2 con comodines",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 25 min, 14-18 participantes, espacio 40 x 30 m y edades SUB-14 en adelante.",
        "La estructura original es 7v7 + 2 comodines, es decir, 16 jugadores activos.",
        "Para trabajar exactamente con 15, CampoBase mantiene los dos equipos de 7 y reduce los comodines de 2 a 1.",
        "Esta adaptación cambia únicamente el número de comodines; el resto de reglas se conserva.",
        "Por edad y nivel, la fuente no plantea este ejercicio para Alevín / SUB-12.",
        "La fuente fija 3 bloques de 6 min, que suman 18 min, pero la ficha declara una duración total de 25 min. No se inventan los 7 min restantes.",
        "El GIF alterna visualmente la posesión entre ambos equipos para mostrar que el comodín apoya siempre al equipo que tiene el balón. Las secuencias de pases son ilustrativas, no combinaciones obligatorias."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-POSESION-7V7-1-COMODIN-15/CampoBase_Posesion_7v7_1_Comodin_15.gif",
    "frames": "assets/ejercicios/CAMPOBASE-POSESION-7V7-1-COMODIN-15/frames/f",
    "total": 89,
    "frameMs": 198
  }
},
{
  "id": "CAMPOBASE-PASE-LARGO-CAMBIO-ORIENTACION",
  "nombre": "Pase largo y cambio de orientación",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": ["Pase largo", "Control orientado", "Cambio de orientación", "Perfil corporal"],
    "tiempo_estimado_15": "20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 circuitos paralelos x 5 jugadores. En cada circuito: 2 en Banda A, 1 en el centro y 2 en Banda B."
    },
    "material": "Balones + conos para marcar las posiciones y organizar 3 circuitos dentro de un espacio aproximado de 40 x 25 m",
    "series": [
      {
        "nombre": "Trabajo continuo",
        "instruccion": "15 min de ejecución continua según la fuente, aplicando la rotación alterna definida para CampoBase."
      }
    ],
    "explicacion_breve": "Sale un lado con pase largo a la banda opuesta. El receptor juega con el centro y el centro devuelve a la banda de origen. El iniciador pasa al centro. En la siguiente acción sale el lado contrario y el centro pasa a esa banda.",
    "leyenda": "Azul: jugador · Balón junto al poseedor · Naranja: posición · Azul continuo: pase largo · Negro continuo: pase corto · Rojo discontinuo: rotación"
  },
  "detalle": {
    "objetivos": [
      "Trabajar el pase largo con precisión.",
      "Mejorar el control orientado del receptor.",
      "Dar continuidad al juego con pase corto y cambio de orientación.",
      "Organizar una rotación clara y repetible para que el circuito no se pare."
    ],
    "claves_entrenador": [
      "En el pase largo, utilizar el empeine interior y golpear por debajo del balón.",
      "El receptor orienta su primer control hacia dentro.",
      "Después del pase largo, el jugador que inicia pasa al centro.",
      "La siguiente acción sale desde el lado contrario."
    ],
    "montaje": [
      "Disponer dos filas en bandas opuestas separadas 40 m.",
      "Situar un jugador central a 15 m, según la referencia de la fuente.",
      "Para trabajar con 15 jugadores, montar 3 circuitos paralelos de 5 jugadores.",
      "En cada circuito quedan 2 jugadores en Banda A, 1 central y 2 jugadores en Banda B."
    ],
    "desarrollo": [
      "Acción 1: el jugador de Banda A realiza un pase largo a Banda B.",
      "El receptor de Banda B controla orientado y juega un pase corto con el jugador central.",
      "El central devuelve el balón a la Banda A, donde recibe el siguiente jugador de esa fila.",
      "Después de su pase largo, el jugador que salió de Banda A pasa al puesto central.",
      "Acción 2: ahora sale el jugador de Banda B con pase largo hacia Banda A.",
      "El receptor de Banda A juega corto con el central.",
      "El central devuelve el balón a la Banda B.",
      "Después de esta segunda acción, el jugador que actuó como central pasa a la Banda B.",
      "La secuencia sigue alternando de un lado a otro."
    ],
    "que_buscamos": [
      "Que el pase largo llegue limpio a la banda opuesta.",
      "Que el primer control prepare el siguiente pase.",
      "Que el centro dé continuidad sin frenar el ritmo.",
      "Que todos entiendan la rotación: sale un lado, va al centro, y en la siguiente acción el centro sale hacia la banda contraria."
    ],
    "que_observar": [
      "Superficie de golpeo en el pase largo.",
      "Orientación corporal antes del control.",
      "Calidad del pase corto con el central.",
      "Si la rotación se entiende sin parar el ejercicio."
    ],
    "correcciones": [
      "Golpea por debajo del balón.",
      "Controla hacia dentro.",
      "Pase corto limpio.",
      "Después de salir, ve al centro.",
      "La siguiente sale del otro lado."
    ],
    "reglas": [
      "La jugada alterna entre Banda A y Banda B.",
      "Quien inicia la acción pasa al centro.",
      "En la siguiente acción sale el lado contrario.",
      "El jugador que estaba en el centro pasa a la banda desde la que acaba de salir la jugada."
    ],
    "si_sale_mal": [
      "Parar solo al final de una serie corta y volver a explicar la rotación con un ejemplo sin balón.",
      "Fijar verbalmente la secuencia: 'A sale, A va al centro, sale B, el centro va a B'."
    ],
    "si_sale_bien": [
      "Aumentar ritmo de ejecución o exigir menos toques.",
      "Pedir que el pase largo viaje más tenso y el control sea más orientado."
    ],
    "variantes": [
      "Jugar a un toque después del control si el nivel lo permite.",
      "Añadir un defensor pasivo en la zona central.",
      "Terminar la secuencia con remate si se adapta el espacio."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Pase largo y cambio de orientación",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 20 min, 6-12 participantes, espacio 40 x 25 m y edades SUB-12 en adelante.",
        "La fuente confirma: dos filas en bandas opuestas separadas 40 m, un jugador central a 15 m y que el jugador que inicia pasa después al centro.",
        "La fuente no detalla la rotación completa de los otros puestos.",
        "CampoBase fija como adaptación operativa una rotación alterna: sale Banda A y pasa al centro; en la siguiente acción sale Banda B; después el central pasa a Banda B. La secuencia continúa alternando de lado.",
        "La ficha declara 20 min de duración, mientras que el desarrollo de la fuente habla de 15 min de trabajo continuo. CampoBase conserva ambos datos y no inventa los 5 min restantes."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PASE-LARGO-CAMBIO-ORIENTACION/CampoBase_Pase_Largo_Cambio_Orientacion_ROTACION_ALTERNA.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PASE-LARGO-CAMBIO-ORIENTACION/frames/f",
    "total": 71,
    "frameMs": 159
  }
},
{
  "id": "CAMPOBASE-MINI-FUTBOL-EQUIPOS-ROTATIVOS",
  "nombre": "Mini fútbol con 3 equipos rotativos",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Juego reducido",
    "que_se_trabaja": ["3x3", "Transición", "Finalización", "Competición"],
    "tiempo_estimado_15": "20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "5 equipos de 3. Juegan 2 equipos (3v3) y 3 esperan en cola. Tras gol, sale el equipo que recibe y entra el siguiente equipo de la cola."
    },
    "material": "2 miniporterías + balón + 5 juegos/colores de petos + conos para delimitar 20 x 15 m",
    "series": [
      {
        "nombre": "Juego continuo",
        "instruccion": "Rotación tras cada gol. La fuente original utiliza 3 equipos de 3; con 15 se amplía a una cola de 5 equipos de 3."
      }
    ],
    "explicacion_breve": "Dos equipos juegan 3v3. Cuando uno recibe gol, sale del campo y entra el siguiente equipo que está esperando.",
    "leyenda": "Colores: equipos · Balón junto al poseedor · Azul: ataque/tiro · Flecha discontinua: salida/entrada tras gol"
  },
  "detalle": {
    "objetivos": [
      "Diversión y participación.",
      "Iniciación al juego colectivo.",
      "Adaptación rápida a roles cambiantes."
    ],
    "claves_entrenador": [
      "Estimular la transición rápida entre defensa y ataque.",
      "Buscar el pase más que la conducción larga.",
      "Valorar la asistencia tanto como el gol."
    ],
    "montaje": [
      "Campo de 20 x 15 m con dos miniporterías.",
      "La fuente forma 3 equipos de 3.",
      "Para 15 jugadores se forman 5 equipos de 3 y se mantiene siempre un 3v3."
    ],
    "desarrollo": [
      "Empiezan dos equipos dentro.",
      "Los demás esperan en orden.",
      "Cuando un equipo recibe gol, sale.",
      "Entra inmediatamente el siguiente equipo de la cola.",
      "El equipo que sale pasa al final de la cola.",
      "Se mantiene el juego durante el tiempo previsto."
    ],
    "que_buscamos": [
      "Entradas y salidas rápidas.",
      "Que los jugadores identifiquen de inmediato si atacan o defienden.",
      "Priorizar pase sobre conducción larga."
    ],
    "que_observar": [
      "Rapidez de la rotación.",
      "Participación de los tres jugadores.",
      "Uso del pase.",
      "Reacción tras entrar al campo."
    ],
    "correcciones": [
      "Entra rápido.",
      "Busca pase.",
      "Abre el campo.",
      "Defiende nada más entrar."
    ],
    "reglas": [
      "3v3 sin porteros.",
      "Equipo que recibe gol sale.",
      "Siguiente equipo de la cola entra."
    ],
    "si_sale_mal": [
      "Reducir el tiempo entre gol y entrada del siguiente equipo explicando previamente el orden de la cola."
    ],
    "si_sale_bien": [
      "Aplicar una variante de la fuente."
    ],
    "variantes": [
      "Rey de la pista: el ganador permanece.",
      "Permitir balón aéreo solo después de un pase.",
      "Añadir comodín neutral."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Mini fútbol con 3 equipos rotativos",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 20 min, 9-15 participantes, espacio 20 x 15 m y edades SUB-6, SUB-8 y SUB-10.",
        "La mecánica descrita por la fuente es 3 equipos de 3; para utilizar exactamente 15, CampoBase amplía la cola a 5 equipos de 3 manteniendo intacto el 3v3.",
        "La fuente dice que gana quien más goles marque al final de 15 min, aunque la ficha declara 20 min. No se inventan los 5 min restantes."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-MINI-FUTBOL-EQUIPOS-ROTATIVOS/CampoBase_Mini_Futbol_Equipos_Rotativos.gif",
    "frames": "assets/ejercicios/CAMPOBASE-MINI-FUTBOL-EQUIPOS-ROTATIVOS/frames/f",
    "total": 72,
    "frameMs": 166
  }
},
{
  "id": "CAMPOBASE-RONDO-5V2-PIVOTE-INTERIOR",
  "nombre": "Rondo 5v2 con pivote interior",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": ["Rondo", "Apoyo interior", "Tercer hombre", "Presión"],
    "tiempo_estimado_15": "15 min",
    "jugadores": {
      "total": 15,
      "organizacion": "2 rondos simultáneos de 7 jugadores (4 exteriores + 1 pivote + 2 defensores) = 14 activos + 1 relevo rotativo."
    },
    "material": "2 balones + conos para delimitar 2 cuadrados de 12 x 12 m + petos para defensores y pivotes",
    "series": [
      {
        "nombre": "Trabajo continuo",
        "instruccion": "Rotar el relevo, los defensores y el pivote durante el ejercicio."
      }
    ],
    "explicacion_breve": "Cuatro jugadores exteriores y un pivote conservan el balón contra dos defensores. Cuando el pivote recibe y devuelve a un lado distinto, la acción vale 2 puntos.",
    "leyenda": "Azul: exterior · Amarillo: pivote · Rojo: defensor · Morado: relevo · Azul: pase al pivote · Negro: pase normal"
  },
  "detalle": {
    "objetivos": [
      "Introducir el concepto de tercer hombre.",
      "Usar el pivote como referencia.",
      "Encontrar pases entre líneas."
    ],
    "claves_entrenador": [
      "El pivote orienta el cuerpo según dónde quiere devolver.",
      "Los dos defensores presionan como una cuña y no separados.",
      "Buscar una línea de pase más profunda, no solo la opción fácil."
    ],
    "montaje": [
      "Cuadrado de 12 x 12 m.",
      "4 jugadores en los lados.",
      "1 pivote en el centro.",
      "2 defensores dentro.",
      "Para 15: dos rondos simultáneos y un relevo."
    ],
    "desarrollo": [
      "Los 5 jugadores de posesión intentan conservar el balón.",
      "Los 2 defensores intentan recuperar.",
      "Si el pivote toca y devuelve hacia un lado distinto, suma 2 puntos.",
      "Cada 6 pases normales se suma 1 punto.",
      "Cuando un defensor recupera, cambia con el jugador que perdió el balón."
    ],
    "que_buscamos": [
      "Que el pivote reciba orientado.",
      "Que los exteriores reconozcan cuándo jugar dentro.",
      "Que el pase al pivote conecte con un tercer jugador.",
      "Que los defensores trabajen juntos."
    ],
    "que_observar": [
      "Orientación del pivote.",
      "Velocidad de apoyo tras pase.",
      "Distancia entre los dos defensores.",
      "Uso real del tercer hombre."
    ],
    "correcciones": [
      "Perfílate.",
      "Mira el lado contrario.",
      "No fuerces dentro.",
      "Defensores juntos."
    ],
    "reglas": [
      "Pivote toca y devuelve a lado distinto = 2 puntos.",
      "6 pases normales = 1 punto.",
      "Defensor que recupera cambia con quien perdió."
    ],
    "si_sale_mal": [
      "La fuente no aporta una regresión específica; no se añade una como fuente."
    ],
    "si_sale_bien": [
      "Aplicar una variante de la fuente."
    ],
    "variantes": [
      "Exteriores a un toque.",
      "Dos pivotes interiores.",
      "Cambiar el pivote cada 30 segundos."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Rondo 5v2 con pivote interior",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 15 min, exactamente 7 participantes, espacio 12 x 12 m y edades SUB-12 en adelante.",
        "Para 15 jugadores se montan dos rondos idénticos de 7 y queda 1 relevo rotativo.",
        "El GIF muestra exterior → pivote → exterior distinto para visualizar la regla de 2 puntos; no es una combinación obligatoria de cada posesión."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-RONDO-5V2-PIVOTE-INTERIOR/CampoBase_Rondo_5v2_Pivote_Interior.gif",
    "frames": "assets/ejercicios/CAMPOBASE-RONDO-5V2-PIVOTE-INTERIOR/frames/f",
    "total": 51,
    "frameMs": 154
  }
},
{
  "id": "CAMPOBASE-SALIDA-BALON-DESDE-PORTERO",
  "nombre": "Salida de balón jugada desde el portero",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "que_se_trabaja": ["Salida de balón", "Construcción", "Portero", "Superar presión", "Juego entre líneas"],
    "tiempo_estimado_15": "25 min",
    "jugadores": {
      "total": 15,
      "organizacion": "Un único montaje: 6 jugadores activos (1 portero + 2 centrales + 1 mediocampista contra 2 presionadores) y 9 relevos rotativos fuera. La fuente no define cómo deben rotar los participantes adicionales."
    },
    "material": "1 portería real + 2 miniporterías + balones + petos + conos para delimitar medio campo",
    "series": [
      {
        "nombre": "Acciones desde portero",
        "instruccion": "Cada acción comienza con el portero jugando con los pies hacia uno de los centrales."
      }
    ],
    "explicacion_breve": "El portero inicia con los pies hacia un central. Los dos centrales y el mediocampista intentan superar a los dos presionadores y marcar en una de las dos miniporterías situadas en mitad de campo.",
    "leyenda": "Verde: portero · Rojo: equipo de salida · Azul: presionadores · Amarillo: relevos · Negro discontinuo: pase/progresión representativa"
  },
  "detalle": {
    "objetivos": [
      "Construir desde portero y centrales.",
      "Romper la primera línea de presión rival.",
      "Tomar decisiones entre jugar corto o más largo."
    ],
    "claves_entrenador": [
      "Centrales con perfil abierto al campo.",
      "El mediocampista crea una línea de pase entre líneas.",
      "Decidir rápido: si el central recibe presión, buscar una solución hacia el mediocampista."
    ],
    "montaje": [
      "Una portería real con portero.",
      "Dos centrales abiertos a ambos lados.",
      "Un mediocampista situado entre líneas.",
      "Dos atacantes presionadores.",
      "Dos miniporterías en la línea de mitad de campo, aproximadamente a 30 m.",
      "Para 15 jugadores se mantiene un solo montaje y los 9 restantes esperan para rotar."
    ],
    "desarrollo": [
      "El portero inicia la acción jugando con los pies hacia uno de los centrales.",
      "Los dos presionadores intentan recuperar.",
      "El equipo de salida intenta superar esa primera línea de presión.",
      "El objetivo final es marcar en cualquiera de las dos miniporterías.",
      "Si recuperan los presionadores, atacan inmediatamente la portería real."
    ],
    "que_buscamos": [
      "Que los centrales den amplitud y reciban perfilados.",
      "Que el mediocampista aparezca como línea de pase detrás de los presionadores.",
      "Que el portador identifique si conviene progresar corto o buscar una solución más directa.",
      "Que tras pérdida se proteja inmediatamente la portería real."
    ],
    "que_observar": [
      "Perfil corporal de los centrales.",
      "Posición del mediocampista respecto a los dos presionadores.",
      "Calidad de la primera decisión tras recibir.",
      "Si el equipo consigue superar realmente la línea de dos presionadores."
    ],
    "correcciones": [
      "Centrales abiertos.",
      "Recibe perfilado.",
      "Mira al medio.",
      "Decide antes de recibir.",
      "Si perdemos, defendemos la portería."
    ],
    "reglas": [
      "Inicio obligatorio desde el portero hacia un central.",
      "Objetivo ofensivo: superar a los dos presionadores y marcar en una miniportería.",
      "Si los presionadores recuperan, atacan la portería real."
    ],
    "si_sale_mal": [
      "La fuente no aporta una regresión específica. No se añade una como contenido original."
    ],
    "si_sale_bien": [
      "Aplicar una de las variantes propuestas por la fuente."
    ],
    "variantes": [
      "Añadir un tercer presionador.",
      "Bonificar el gol si la jugada pasa por el mediocampista.",
      "El portero no puede pasar de mitad de campo con balón."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Salida de balón jugada desde el portero",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 25 min, 8-12 participantes, medio campo y edades SUB-14 en adelante.",
        "La estructura activa descrita por la fuente es de 6 jugadores: portero, 2 centrales y 1 mediocampista contra 2 presionadores.",
        "La fuente representa un único campo con 1 portería real y 2 miniporterías. La versión anterior de CampoBase duplicaba el montaje para encajar 15 jugadores y se ha corregido.",
        "Para 15, CampoBase mantiene un único montaje y coloca 9 jugadores como relevos. La fuente no especifica el sistema de rotación de esos jugadores adicionales.",
        "El GIF reproduce la secuencia representativa visible en el esquema de la fuente: portero → central izquierdo → mediocampista → miniportería izquierda. Esa secuencia ilustra el ejercicio, pero el objetivo general permite otras soluciones.",
        "Por edad y nivel, la fuente lo clasifica como Avanzado y SUB-14+, por lo que no está planteado tal cual para Alevín / SUB-12."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-SALIDA-BALON-DESDE-PORTERO/CampoBase_Salida_Balon_Desde_Portero_CORREGIDO.gif",
    "frames": "assets/ejercicios/CAMPOBASE-SALIDA-BALON-DESDE-PORTERO/frames/f",
    "total": 48,
    "frameMs": 180
  }
},
{
  "id": "CAMPOBASE-11-DEFENSA-2V2-COBERTURA",
  "nombre": "Defensa 2v2 con cobertura",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Técnico-táctico",
    "que_se_trabaja": ["Defensa 2x2", "Cobertura", "Temporización", "Comunicación", "Transición defensa-ataque"],
    "tiempo_estimado_15": "20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1 campo fuente-faithful: 2 atacantes + 2 defensores activos; 11 jugadores rotan por parejas/roles cada 90 s."
    },
    "material": "2 miniporterías + balones + petos + conos para 20 x 15 m",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "2v2. Entrenador entrega a atacantes; primer defensor salta y segundo cubre."
      },
      {
        "nombre": "Variante 1 · 3v2",
        "instruccion": "Añadir comodín ofensivo permanente."
      },
      {
        "nombre": "Variante 2 · 2 toques",
        "instruccion": "Limitar al atacante a 2 toques."
      },
      {
        "nombre": "Variante 3 · sin entrada al suelo",
        "instruccion": "Los defensores no pueden entrar al suelo."
      }
    ],
    "explicacion_breve": "El defensor más cercano sale al poseedor y el compañero se coloca unos 2 m por detrás y hacia el interior. Si recuperan, atacan la miniportería opuesta.",
    "leyenda": "Rojo: atacantes · Azul: defensores · Morado: entrenador · Amarillo: comodín/relevos · Negro discontinuo: pase/progresión · Azul discontinuo: ajuste defensivo"
  },
  "detalle": {
    "objetivos": [
      "Marca y cobertura en pareja.",
      "Comunicación defensiva.",
      "Salida ordenada tras recuperación."
    ],
    "claves_entrenador": [
      "Defensor del poseedor en línea con portería.",
      "Cobertura unos 2 m por detrás y hacia el interior.",
      "Comunicación: tuyo, mío, cubre."
    ],
    "montaje": [
      "Un rectángulo 20 x 15 m.",
      "Una miniportería en cada extremo.",
      "Pareja atacante y pareja defensiva.",
      "Entrenador inicia la acción."
    ],
    "desarrollo": [
      "Entrenador entrega a atacantes.",
      "Defensor cercano salta al poseedor.",
      "Segundo defensor cubre detrás/interior.",
      "Si recuperan, atacan la portería opuesta.",
      "Series de 90 s con rotación."
    ],
    "que_buscamos": [
      "Que no salten los dos al balón.",
      "Que la cobertura esté en posición de corregir.",
      "Transición ordenada tras robo."
    ],
    "que_observar": [
      "Distancia D1-D2.",
      "Orientación del primer defensor.",
      "Comunicación."
    ],
    "correcciones": [
      "Uno sale.",
      "Otro cubre.",
      "Dos metros detrás.",
      "Cierra dentro."
    ],
    "reglas": [
      "2v2 base.",
      "Series de 90 s.",
      "Tras robo, defensores atacan portería opuesta."
    ],
    "si_sale_mal": [
      "Recolocar la pareja antes de reiniciar."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "Comodín ofensivo permanente 3v2.",
      "Atacantes máximo 2 toques.",
      "Defensores sin entrada al suelo."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Defensa 2v2 con cobertura",
      "adaptacion_operativa": true,
      "notas": [
        "GIF corregido para mantener un único campo y dos miniporterías, como en la fuente.",
        "La cola de 11 jugadores es adaptación para mostrar los 15 sin duplicar el ejercicio."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-11-DEFENSA-2V2-COBERTURA/CampoBase_11_Defensa_2v2_Cobertura_REVISADO.gif",
    "frames": "assets/ejercicios/CAMPOBASE-11-DEFENSA-2V2-COBERTURA/frames/f",
    "total": 107,
    "frameMs": 204
  }
},
{
  "id": "CAMPOBASE-17-FINALIZACION-1V1-TRES-VIAS",
  "nombre": "Finalización 1v1 con tres vías",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": ["1x1", "Regate", "Cambio de ritmo", "Tiro"],
    "tiempo_estimado_15": "20 min de ficha; con 15 jugadores se mantiene una sola acción 1v1 y colas, por lo que el número de acciones por jugador puede quedar por debajo de las 12 indicadas por la fuente.",
    "jugadores": {
      "total": 15,
      "organizacion": "1 portero + 7 atacantes + 7 defensores; sale una pareja por acción y ambos vuelven al final de su fila."
    },
    "material": "1 portería + balones + conos para 3 pasillos",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "Atacante elige uno de 3 pasillos; defensor sale cuando elige."
      },
      {
        "nombre": "Variante 1 · 3 toques",
        "instruccion": "Máximo 3 toques antes de tirar."
      },
      {
        "nombre": "Variante 2 · defensor antes",
        "instruccion": "Defensor sale antes de que el atacante elija pasillo."
      },
      {
        "nombre": "Variante 3 · pierna débil",
        "instruccion": "Bonificar gol con pierna débil."
      }
    ],
    "explicacion_breve": "El atacante conduce desde mediocampo, elige uno de tres pasillos y entra al 1v1. El defensor parte cerca del área y solo sale al elegirse la vía, salvo en la variante 2.",
    "leyenda": "Rojo atacante · Azul defensor · Verde portero · Conos tres vías · Rojo remate"
  },
  "detalle": {
    "objetivos": [
      "Encarar 1v1 cerca del área.",
      "Variar finalización.",
      "Defender 1v1 dentro del área."
    ],
    "claves_entrenador": [
      "Cambio de ritmo al elegir pasillo.",
      "Cabeza arriba antes de definir.",
      "Engañar con el cuerpo."
    ],
    "montaje": [
      "Tres pasillos frente al área.",
      "Atacante con balón desde mediocampo.",
      "Defensor en línea de 6 m.",
      "Portería con portero, tal como aparece en el esquema."
    ],
    "desarrollo": [
      "Atacante elige pasillo.",
      "Defensor sale al elegirlo.",
      "Se juega 1v1 hasta remate.",
      "Ambos rotan al final de sus filas.",
      "Fuente indica 12 acciones por jugador."
    ],
    "que_buscamos": [
      "Decisión rápida.",
      "Cambio de ritmo.",
      "Finalización con oposición."
    ],
    "que_observar": [
      "Momento de elección.",
      "Salida del defensor.",
      "Cabeza levantada."
    ],
    "correcciones": [
      "Elige y acelera.",
      "Engaña con el cuerpo.",
      "Mira portería."
    ],
    "reglas": [
      "Tres vías.",
      "1v1.",
      "Rotación tras cada acción."
    ],
    "si_sale_mal": [
      "La fuente no aporta regresión específica."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "Máximo 3 toques antes de tirar.",
      "Defensor sale antes de elegir pasillo.",
      "Bonificar gol con pierna débil."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Finalización 1v1 con tres vías",
      "adaptacion_operativa": true,
      "notas": [
        "Las variantes se muestran secuencialmente en el GIF como pestañas, no mezcladas.",
        "La distribución 7 atacantes + 7 defensores + 1 portero es adaptación para exactamente 15."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-17-FINALIZACION-1V1-TRES-VIAS/CampoBase_17_Finalizacion_1v1_Tres_Vias.gif",
    "frames": "assets/ejercicios/CAMPOBASE-17-FINALIZACION-1V1-TRES-VIAS/frames/f",
    "total": 153,
    "frameMs": 137
  }
},
{
  "id": "CAMPOBASE-18-PRESION-TRAS-PERDIDA-6S",
  "nombre": "Presión tras pérdida (counter-press 6 segundos)",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Transición",
    "que_se_trabaja": ["Presión tras pérdida", "Recuperación", "Repliegue", "Cierre de líneas"],
    "tiempo_estimado_15": "22 min",
    "jugadores": {
      "total": 15,
      "organizacion": "6v6 activos + 3 relevos rotativos."
    },
    "material": "4 miniporterías + balones + petos + conos para 40 x 30 m",
    "series": [
      {
        "nombre": "Base · 6 s",
        "instruccion": "Tras pérdida, 6 s para recuperar."
      },
      {
        "nombre": "Variante 1 · 4 s",
        "instruccion": "Reducir a 4 s."
      },
      {
        "nombre": "Variante 2 · gol bonus",
        "instruccion": "Bonificar el gol tras counter-press."
      },
      {
        "nombre": "Variante 3 · 2 toques",
        "instruccion": "Tras recuperar, máximo 2 toques."
      }
    ],
    "explicacion_breve": "Partido 6v6. Al perder, el jugador más cercano presiona al nuevo poseedor y los demás cierran líneas. Si no recuperan en el tiempo, repliegue obligatorio.",
    "leyenda": "Azul y rojo equipos · Azul discontinuo presión/cierre · 4 miniporterías totales"
  },
  "detalle": {
    "objetivos": [
      "Recuperar en menos de 6 s tras pérdida.",
      "Presión coordinada.",
      "Disciplina colectiva."
    ],
    "claves_entrenador": [
      "Más cercano ataca al portador.",
      "Los demás cierran líneas de pase.",
      "Si falla la presión, repliegue rápido y compacto."
    ],
    "montaje": [
      "Campo 40 x 30 m.",
      "2 miniporterías por equipo.",
      "6v6.",
      "3 relevos para completar 15."
    ],
    "desarrollo": [
      "Partido normal.",
      "Al perder, comienza cuenta.",
      "Si recuperan a tiempo, se premia la acción según regla.",
      "Si no, repliegue sobre línea propia.",
      "4 series de 5 min."
    ],
    "que_buscamos": [
      "Primer salto inmediato.",
      "Cierre de opciones cercanas.",
      "Decisión clara de continuar presión o replegar."
    ],
    "que_observar": [
      "Quién salta.",
      "Distancias entre compañeros.",
      "Repliegue tras fallo."
    ],
    "correcciones": [
      "Salta el más cercano.",
      "Cierra líneas.",
      "Si no llegamos, atrás juntos."
    ],
    "reglas": [
      "Base 6 s.",
      "4 series de 5 min.",
      "Si no recuperan, repliegue."
    ],
    "si_sale_mal": [
      "La fuente no define regresión."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "4 s para presionar.",
      "Bonificar gol tras counter-press.",
      "2 toques tras recuperación."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Presión tras pérdida (counter-press 6 segundos)",
      "adaptacion_operativa": true,
      "notas": [
        "El GIF mantiene 4 miniporterías totales, 2 por equipo.",
        "Las variantes se muestran separadas por pestañas.",
        "La fuente es SUB-14+; no está planteado tal cual para Alevín."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-18-PRESION-TRAS-PERDIDA-6S/CampoBase_18_Presion_Tras_Perdida_6s.gif",
    "frames": "assets/ejercicios/CAMPOBASE-18-PRESION-TRAS-PERDIDA-6S/frames/f",
    "total": 184,
    "frameMs": 134
  }
},
{
  "id": "CAMPOBASE-21-VELOCIDAD-REACCION-CONOS-COLORES",
  "nombre": "Velocidad de reacción con conos de colores",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": ["Velocidad de reacción", "Aceleración", "Cambio de dirección", "Estímulo visual"],
    "tiempo_estimado_15": "12 min; para 15 jugadores se recomienda montar 3 estaciones idénticas de 5 como adaptación operativa, aunque el GIF representa una sola estación fuente-faithful.",
    "jugadores": {
      "total": 15,
      "organizacion": "GIF: 1 jugador activo + cola. Adaptación práctica: 3 estaciones x 5 para reducir esperas."
    },
    "material": "Por estación: 4 conos de colores. Para 3 estaciones: 12 conos de colores; balón para variante 2.",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "Un color: sprint, tocar cono y volver al centro."
      },
      {
        "nombre": "Variante 1 · dos colores",
        "instruccion": "Encadenar dos colores."
      },
      {
        "nombre": "Variante 2 · balón",
        "instruccion": "Añadir balón al final del recorrido."
      },
      {
        "nombre": "Variante 3 · 20 m",
        "instruccion": "Cerrar con sprint progresivo de 20 m."
      }
    ],
    "explicacion_breve": "Jugador en el centro con cuatro conos a 5 m. A la voz de un color, sprinta, toca el cono y vuelve.",
    "leyenda": "Cuatro conos por color · Negro: sprint/desplazamiento · Balón solo en variante 2"
  },
  "detalle": {
    "objetivos": [
      "Reacción ante estímulo.",
      "Aceleración corta.",
      "Cambio de dirección a máxima velocidad."
    ],
    "claves_entrenador": [
      "Primer paso explosivo.",
      "Cambio de dirección con un apoyo.",
      "Tocar y girar sin pasarse del cono."
    ],
    "montaje": [
      "Jugador en el centro.",
      "4 conos a 5 m: rojo, azul, verde, amarillo."
    ],
    "desarrollo": [
      "Entrenador dice color.",
      "Jugador sprinta, toca y vuelve.",
      "8 reacciones = 1 serie.",
      "4 series con 90 s descanso."
    ],
    "que_buscamos": [
      "Reacción inmediata.",
      "Frenado corto.",
      "Vuelta rápida al centro."
    ],
    "que_observar": [
      "Primer paso.",
      "Apoyo al girar.",
      "Que no rebase el cono."
    ],
    "correcciones": [
      "Sal ya.",
      "Un apoyo y gira.",
      "No te pases del cono."
    ],
    "reglas": [
      "8 reacciones por serie.",
      "4 series.",
      "90 s descanso."
    ],
    "si_sale_mal": [
      "La fuente no aporta regresión específica."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "Colores combinados.",
      "Balón al final.",
      "Sprint progresivo 20 m."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Velocidad de reacción con conos de colores",
      "adaptacion_operativa": true,
      "notas": [
        "El GIF representa una única estación como la fuente.",
        "Las 3 variantes se muestran en pestañas sucesivas.",
        "La propuesta de 3 estaciones x 5 es solo adaptación para 15, no dato de la fuente.",
        "En la variante con balón, la fuente no especifica la acción técnica posterior; el GIF únicamente muestra el balón al terminar el recorrido y no inventa una conducción."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-21-VELOCIDAD-REACCION-CONOS-COLORES/CampoBase_21_Velocidad_Reaccion_Conos_Colores.gif",
    "frames": "assets/ejercicios/CAMPOBASE-21-VELOCIDAD-REACCION-CONOS-COLORES/frames/f",
    "total": 140,
    "frameMs": 164
  }
}
,
{
  "id": "CAMPOBASE-23-CENTROS-BANDA-REMATE",
  "nombre": "Centros desde banda y remate",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": ["Centro", "Remate", "Llegada al área", "Timing"],
    "tiempo_estimado_15": "20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "Lateral + 3 rematadores activos + relevos rotativos."
    },
    "material": "1 portería + balones + petos + conos",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "Lateral conduce hasta línea de fondo y alterna centro raso al primer palo y alto al segundo."
      },
      {
        "nombre": "Variante 1 · defensor pasivo",
        "instruccion": "Añadir defensor pasivo en el área."
      },
      {
        "nombre": "Variante 2 · ambas bandas",
        "instruccion": "Realizar centros desde derecha e izquierda."
      },
      {
        "nombre": "Variante 3 · chilena/tijera",
        "instruccion": "El último rematador puede finalizar con chilena o tijera."
      }
    ],
    "explicacion_breve": "El lateral llega a línea de fondo y el balón viaja claramente desde el pie del centrador hasta la zona de remate.",
    "leyenda": "Azul: lateral/centro · Rojo: rematadores · Verde: portero · Morado: defensor pasivo · Balón grande durante el centro para que se vea el vuelo."
  },
  "detalle": {
    "objetivos": [
      "Centro raso y al segundo palo.",
      "Llegada en tres tiempos.",
      "Remate de cabeza y volea."
    ],
    "claves_entrenador": [
      "Llegar a línea de fondo antes de centrar.",
      "Centro raso 1 m antes del primer palo.",
      "Centro alto hacia zona de penalti/segundo palo.",
      "Llegadas en velocidad."
    ],
    "montaje": [
      "Lateral con balón en banda.",
      "Tres rematadores.",
      "Portería con portero."
    ],
    "desarrollo": [
      "Lateral conduce a fondo.",
      "Centra.",
      "Tres rematadores atacan primer palo, penalti y segundo.",
      "Rotan funciones."
    ],
    "que_buscamos": [
      "Timing.",
      "Calidad del centro.",
      "Ocupar tres alturas."
    ],
    "que_observar": [
      "Llegada real a fondo.",
      "Visibilidad del balón en el centro.",
      "Coordinación de las entradas."
    ],
    "correcciones": [
      "Hasta fondo.",
      "Centro tenso.",
      "No entréis los tres a la vez."
    ],
    "reglas": [
      "Alternar raso/aéreo cada 2 min."
    ],
    "si_sale_mal": [
      "Reducir velocidad y oposición."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "Defensor pasivo.",
      "Ambas bandas.",
      "Chilena/tijera último rematador."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Centros desde banda y remate",
      "adaptacion_operativa": true,
      "notas": [
        "Corregido: todas las variantes son fases reales del GIF.",
        "Corregido: el balón se ve viajar en el centro desde línea de fondo.",
        "Revisión final: centrador llega a unos metros de la línea de fondo y el balón se amplía visualmente durante el centro."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-23-CENTROS-BANDA-REMATE/CampoBase_23_Centros_Banda_Remate_VARIANTES_OK.gif",
    "frames": "assets/ejercicios/CAMPOBASE-23-CENTROS-BANDA-REMATE/frames/f",
    "total": 188,
    "frameMs": 139
  }
},
{
  "id": "CAMPOBASE-24-RONDO-POSICIONAL-6V3",
  "nombre": "Rondo posicional 6v3 (medio campo)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": ["Rondo posicional", "Pase entre líneas", "Amplitud", "Apoyo", "Orientación corporal"],
    "tiempo_estimado_15": "18 min",
    "jugadores": {
      "total": 15,
      "organizacion": "6 de posesión + 3 defensores activos; relevos rotativos."
    },
    "material": "Balón + petos + conos para 25 x 20 m",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "4 exteriores + 2 interiores contra 3 defensores."
      },
      {
        "nombre": "Variante 1 · exteriores a 1 toque",
        "instruccion": "Exteriores a un toque."
      },
      {
        "nombre": "Variante 2 · 6v4",
        "instruccion": "Añadir un cuarto defensor."
      },
      {
        "nombre": "Variante 3 · un bote interiores",
        "instruccion": "Interiores pueden usar un solo bote antes de pasar."
      }
    ],
    "explicacion_breve": "Cada fase tiene circulación distinta y movimiento real de exteriores, interiores y defensores.",
    "leyenda": "Rojo: 4 exteriores + 2 interiores · Azul: defensores · Negro: pase · Discontinuas: movimiento real de apoyo/basculación"
  },
  "detalle": {
    "objetivos": [
      "Pase entre líneas.",
      "Reconocer hombre libre.",
      "Movilidad posicional."
    ],
    "claves_entrenador": [
      "Interiores orientados.",
      "Exteriores con amplitud.",
      "Defensores basculan juntos."
    ],
    "montaje": [
      "4 exteriores.",
      "2 interiores.",
      "3 defensores."
    ],
    "desarrollo": [
      "Circular.",
      "Buscar interiores.",
      "Moverse tras pase.",
      "Defensores cierran líneas."
    ],
    "que_buscamos": [
      "Recepciones entre líneas.",
      "Cambio de orientación.",
      "Movimiento sin balón."
    ],
    "que_observar": [
      "Que no se queden estáticos.",
      "Que cambie la ruta del balón.",
      "Que los defensores basculen."
    ],
    "correcciones": [
      "Muévete después de pasar.",
      "Perfílate.",
      "Defensores juntos."
    ],
    "reglas": [
      "4 series de 3 min."
    ],
    "si_sale_mal": [
      "Más espacio o menos presión."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "1 toque exteriores.",
      "6v4.",
      "1 bote interiores."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Rondo posicional 6v3 (medio campo)",
      "adaptacion_operativa": true,
      "notas": [
        "Corregido: variantes animadas de verdad.",
        "Corregido: jugadores se mueven en cada fase y cambia la circulación.",
        "Revisión final: se amplió el desplazamiento visual de exteriores, interiores y defensores para que el GIF enseñe claramente el movimiento sin balón."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-24-RONDO-POSICIONAL-6V3/CampoBase_24_Rondo_Posicional_6v3_VARIANTES_OK.gif",
    "frames": "assets/ejercicios/CAMPOBASE-24-RONDO-POSICIONAL-6V3/frames/f",
    "total": 195,
    "frameMs": 127
  }
},
{
  "id": "CAMPOBASE-26-4V4-DOS-ARCOS-PORTEROS",
  "nombre": "4v4 con dos arcos y porteros",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Juego reducido",
    "que_se_trabaja": ["4x4", "Porteros", "Apoyos", "Cobertura", "Finalización"],
    "tiempo_estimado_15": "20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "4v4 + 2 porteros; relevos rotativos."
    },
    "material": "2 porterías reales + balones + petos + conos",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "4v4 con porteros y saque rápido."
      },
      {
        "nombre": "Variante 1 · 3 toques",
        "instruccion": "Máximo 3 toques."
      },
      {
        "nombre": "Variante 2 · comodín",
        "instruccion": "Comodín neutral con equipo en posesión."
      },
      {
        "nombre": "Variante 3 · pared x2",
        "instruccion": "Gol tras pared vale doble."
      }
    ],
    "explicacion_breve": "Cada variante es una fase real del GIF y ambos equipos atacan siempre la portería rival.",
    "leyenda": "Azul ataca derecha · Rojo ataca izquierda · Verde porteros · Amarillo comodín · Negro pase/tiro"
  },
  "detalle": {
    "objetivos": [
      "Aplicar fundamentos.",
      "Decisión bajo presión.",
      "Competición."
    ],
    "claves_entrenador": [
      "Apoyos cortos.",
      "Cobertura.",
      "Pasar antes que conducir en exceso."
    ],
    "montaje": [
      "30 x 20 m.",
      "2 porterías reales.",
      "4v4 + porteros."
    ],
    "desarrollo": [
      "Partido.",
      "Saque rápido.",
      "4x4 min."
    ],
    "que_buscamos": [
      "Orientación correcta.",
      "Paredes.",
      "Finalización rápida."
    ],
    "que_observar": [
      "Dirección de ataque.",
      "Apoyos.",
      "Transición."
    ],
    "correcciones": [
      "Ataca la rival.",
      "Apoya cerca.",
      "Después de pared, finaliza."
    ],
    "reglas": [
      "4 series de 4 min.",
      "1 min descanso."
    ],
    "si_sale_mal": [
      "Marcar sentidos de ataque."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "3 toques.",
      "Comodín neutral.",
      "Gol doble tras pared."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "4v4 con dos arcos y porteros",
      "adaptacion_operativa": true,
      "notas": [
        "Corregido: las tres variantes son fases reales.",
        "Corregido: azul finaliza a derecha y rojo a izquierda, nunca en propia."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-26-4V4-DOS-ARCOS-PORTEROS/CampoBase_26_4v4_Porteros_VARIANTES_OK.gif",
    "frames": "assets/ejercicios/CAMPOBASE-26-4V4-DOS-ARCOS-PORTEROS/frames/f",
    "total": 184,
    "frameMs": 135
  }
},
{
  "id": "CAMPOBASE-27-PRESION-BANDA-3V2",
  "nombre": "Presión en banda 3v2",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Técnico-táctico",
    "que_se_trabaja": ["Presión en banda", "Cobertura", "Orientación defensiva", "Cierre interior", "Transición defensa-ataque"],
    "tiempo_estimado_15": "20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "Un solo pasillo fuente-faithful: 3 atacantes + 2 defensores activos; 10 relevos. En 3v3: 6 activos + 9 relevos."
    },
    "material": "1 miniportería + balones + petos + conos para pasillo 30 x 15 m; segunda miniportería solo en variante 2.",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "3 atacantes contra 2 defensores. El cercano orienta al portador hacia la línea; el segundo corta el pase interior."
      },
      {
        "nombre": "Variante 1 · 3v3",
        "instruccion": "Añadir un tercer defensor."
      },
      {
        "nombre": "Variante 2 · segunda mini",
        "instruccion": "Añadir miniportería para los defensores en la banda contraria."
      },
      {
        "nombre": "Variante 3 · 2 toques",
        "instruccion": "Atacantes a máximo 2 toques."
      }
    ],
    "explicacion_breve": "Los dos defensores trabajan coordinados: uno fuerza al poseedor hacia banda y el otro protege el pase hacia el centro. Tras robo, salen con balón hacia miniportería.",
    "leyenda": "Rojo atacantes · Azul defensores · Negro pase/salida · Azul discontinuo presión/cobertura"
  },
  "detalle": {
    "objetivos": [
      "Cerrar el centro y forzar al rival a banda.",
      "Triangulación defensiva.",
      "Salir con balón controlado tras recuperar."
    ],
    "claves_entrenador": [
      "Defensor cercano orienta cuerpo hacia la línea.",
      "Defensor de cobertura ve portador y hombre interior.",
      "Comunicación: afuera, interior."
    ],
    "montaje": [
      "Pasillo lateral de 30 x 15 m.",
      "3 atacantes con balón.",
      "2 defensores.",
      "1 miniportería de salida."
    ],
    "desarrollo": [
      "Los atacantes conservan/progresan en el pasillo.",
      "D1 presiona al poseedor y lo orienta a banda.",
      "D2 corta la línea interior.",
      "Si recuperan, los defensores atacan la miniportería.",
      "Series de 90 s."
    ],
    "que_buscamos": [
      "Que no salten ambos al balón.",
      "Que el centro quede cerrado.",
      "Salida limpia tras robo."
    ],
    "que_observar": [
      "Perfil de D1.",
      "Posición de D2.",
      "Comunicación."
    ],
    "correcciones": [
      "Afuera.",
      "Cierra dentro.",
      "Uno presiona, otro cubre."
    ],
    "reglas": [
      "Series de 90 s."
    ],
    "si_sale_mal": [
      "Aumentar ancho del pasillo o reducir velocidad atacante."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "3v3.",
      "Segunda miniportería defensiva.",
      "Atacantes a 2 toques."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Presión en banda 3v2",
      "adaptacion_operativa": true,
      "notas": [
        "El GIF mantiene un único pasillo.",
        "Los relevos representan la adaptación a 15 sin duplicar el ejercicio.",
        "Las tres variantes son fases reales del GIF."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-27-PRESION-BANDA-3V2/CampoBase_27_Presion_Banda_3v2.gif",
    "frames": "assets/ejercicios/CAMPOBASE-27-PRESION-BANDA-3V2/frames/f",
    "total": 184,
    "frameMs": 134
  }
},
{
  "id": "CAMPOBASE-28-TECNICA-DOS-TOQUES-ESTACIONES",
  "nombre": "Técnica de dos toques en estaciones",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": ["Pase", "Control", "Control orientado", "Conducción", "Pared", "Pierna no dominante"],
    "tiempo_estimado_15": "15 min",
    "jugadores": {
      "total": 15,
      "organizacion": "4 estaciones simultáneas: adaptación 4+4+4+3 jugadores. La fuente indica 4 jugadores por estación; con 15 una estación queda con 3 y se rota."
    },
    "material": "16 conos para 4 cuadrados + 2 conos interiores extra en estación 3 + 4 balones.",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "E1: pase+control interior 2 toques. E2: control orientado y un toque. E3: conducir entre 2 conos antes de pasar. E4: pared antes de pasar."
      },
      {
        "nombre": "Variante 1 · pierna no dominante",
        "instruccion": "Realizar las tareas usando la pierna no dominante."
      },
      {
        "nombre": "Variante 2 · concurso",
        "instruccion": "Cerrar con concurso de pases durante 1 minuto."
      },
      {
        "nombre": "Variante 3 · defensor pasivo",
        "instruccion": "Añadir un defensor pasivo en una estación."
      }
    ],
    "explicacion_breve": "Cuatro cuadrados funcionan a la vez, cada uno con una tarea técnica diferente. El GIF muestra las cuatro simultáneamente y luego las tres variantes reales.",
    "leyenda": "E1 pase/control · E2 control orientado · E3 conducción entre conos · E4 pared · Azul conducción · Negro pase"
  },
  "detalle": {
    "objetivos": [
      "Pase y control en cuadrados.",
      "Dominio con ambos pies.",
      "Desplazamiento tras pase."
    ],
    "claves_entrenador": [
      "Primer toque adelantado.",
      "Cabeza arriba al recibir.",
      "Pie de apoyo firme."
    ],
    "montaje": [
      "4 cuadrados de 4 x 4 m.",
      "Un balón por estación.",
      "Fuente: 4 jugadores por estación."
    ],
    "desarrollo": [
      "E1: pase y control con interior, dos toques.",
      "E2: control orientado y un toque.",
      "E3: conducir entre dos conos antes de pasar.",
      "E4: pared con compañero antes de pasar."
    ],
    "que_buscamos": [
      "Primer toque útil.",
      "Pase preciso.",
      "Movimiento tras intervención."
    ],
    "que_observar": [
      "Orientación corporal.",
      "Uso de ambos pies.",
      "Calidad de conducción."
    ],
    "correcciones": [
      "Primer toque hacia delante.",
      "Cabeza arriba.",
      "Apoya firme."
    ],
    "reglas": [
      "Cuatro estaciones independientes."
    ],
    "si_sale_mal": [
      "Reducir velocidad y distancia."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "Pierna no dominante.",
      "Concurso de pases 1 min.",
      "Defensor pasivo en una estación."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Técnica de dos toques en estaciones",
      "adaptacion_operativa": true,
      "notas": [
        "Con 15 se usa 4+4+4+3 y se rota; la fuente plantea 4 por estación.",
        "Las tres variantes aparecen como fases reales del GIF.",
        "Revisión visual: en el concurso de 1 minuto no se muestran marcadores inventados; solo se identifica la fase como CONCURSO."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-28-TECNICA-DOS-TOQUES-ESTACIONES/CampoBase_28_Tecnica_Dos_Toques_Estaciones.gif",
    "frames": "assets/ejercicios/CAMPOBASE-28-TECNICA-DOS-TOQUES-ESTACIONES/frames/f",
    "total": 196,
    "frameMs": 134
  }
},
{
  "id": "CAMPOBASE-29-RECUPERACION-FINALIZACION-RAPIDA",
  "nombre": "Recuperación y finalización rápida",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Transición",
    "que_se_trabaja": ["Recuperación", "Primer pase vertical", "Superioridad 3x2", "Finalización"],
    "tiempo_estimado_15": "18 min",
    "jugadores": {
      "total": 15,
      "organizacion": "Montaje único: rondo 4v2 + 1 compañero esperando + portero; 7 relevos para completar 15. Tras robo, los 2 defensores + compañero atacan 3v2."
    },
    "material": "1 portería real + balones + petos + conos para rondo y medio campo.",
    "series": [
      {
        "nombre": "Base · 8 s",
        "instruccion": "Tras robo, 2 defensores suman al compañero de mediocampo y atacan 3v2; finalizar antes de 8 s."
      },
      {
        "nombre": "Variante 1 · 6 s",
        "instruccion": "Reducir el límite a 6 s."
      },
      {
        "nombre": "Variante 2 · usar mediocampista",
        "instruccion": "Premiar gol que utilice al mediocampista."
      },
      {
        "nombre": "Variante 3 · al menos un pase",
        "instruccion": "Obligar a realizar al menos un pase antes de rematar."
      }
    ],
    "explicacion_breve": "El ejercicio empieza como rondo 4v2. Cuando uno de los dos defensores roba, ambos se convierten en atacantes, suman al compañero adelantado y atacan 3v2 hacia la portería.",
    "leyenda": "Rojo: atacantes del rondo que pasan a defender · Azul: defensores del rondo que pasan a atacar · M: compañero esperando"
  },
  "detalle": {
    "objetivos": [
      "Finalizar en menos de 8 s tras robo.",
      "Primer pase vertical rápido.",
      "Llegada coordinada al área."
    ],
    "claves_entrenador": [
      "Primer pase tras robo al hombre más adelantado.",
      "Carreras al área por banda y centro.",
      "El que recupera sigue la acción y da cobertura."
    ],
    "montaje": [
      "Rondo 4v2 fuera del área.",
      "1 compañero esperando en mediocampo.",
      "Portería real."
    ],
    "desarrollo": [
      "4 atacantes mantienen rondo contra 2 defensores.",
      "Cuando los defensores recuperan, suman al compañero adelantado.",
      "Los 3 atacan portería.",
      "2 de los 4 antiguos atacantes corren a defender.",
      "Finalizar antes de 8 s.",
      "Reiniciar."
    ],
    "que_buscamos": [
      "Cambio mental inmediato.",
      "Verticalidad.",
      "Ocupar banda y centro."
    ],
    "que_observar": [
      "Quién da primer pase.",
      "Si los tres atacantes se abren.",
      "Si los dos defensores persiguen y cierran."
    ],
    "correcciones": [
      "Primer pase vertical.",
      "Uno banda, uno centro.",
      "El que roba sigue."
    ],
    "reglas": [
      "Finalizar antes de 8 s en base."
    ],
    "si_sale_mal": [
      "Dar más tiempo o reducir oposición defensiva."
    ],
    "si_sale_bien": [
      "Aplicar variantes."
    ],
    "variantes": [
      "6 s.",
      "Premiar gol usando mediocampista.",
      "Al menos un pase antes del tiro."
    ],
    "fuente": {
      "documento": "Libro de Entrenamientos de Futbol - Controla Club.pdf",
      "ejercicio_original": "Recuperación y finalización rápida",
      "adaptacion_operativa": true,
      "notas": [
        "El GIF muestra primero el rondo y después la transición real 3v2.",
        "Las tres variantes aparecen como fases reales.",
        "Los 7 relevos son adaptación para representar exactamente 15 sin duplicar campos."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-29-RECUPERACION-FINALIZACION-RAPIDA/CampoBase_29_Recuperacion_Finalizacion_Rapida.gif",
    "frames": "assets/ejercicios/CAMPOBASE-29-RECUPERACION-FINALIZACION-RAPIDA/frames/f",
    "total": 227,
    "frameMs": 126
  }
}
,
{
  "id": "CAMPOBASE-FS084-RELEVOS-CONDUCCION-REGATE",
  "nombre": "Relevos de velocidad de conducción y regate",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Calentamiento/activación",
    "que_se_trabaja": [
      "Conducción",
      "Regate",
      "Control",
      "Coordinación",
      "Velocidad de reacción"
    ],
    "tiempo_estimado_15": "2 repeticiones de 5 min según la ficha; con 15 jugadores se mantienen 4 filas en reparto 4+4+4+3.",
    "jugadores": {
      "total": 15,
      "organizacion": "4 filas, 2 equipos que compiten; adaptación 4+4+4+3 manteniendo la estructura de cuatro filas."
    },
    "material": "16 delimitadores + balones",
    "series": [
      {
        "nombre": "Planta + interior",
        "instruccion": "Recorrido completo: salida diagonal, giro, regreso y acción técnica con planta para desplazar en diagonal + interior de la pierna contraria."
      },
      {
        "nombre": "Croqueta",
        "instruccion": "Mismo recorrido completo; en la zona amarilla realizar interior de una pierna + interior de la otra."
      },
      {
        "nombre": "Interior + exterior",
        "instruccion": "Mismo recorrido completo; en la zona amarilla realizar interior de izquierda + exterior de la misma pierna."
      }
    ],
    "explicacion_breve": "Cada pestaña enseña el recorrido completo de un relevo. Solo cambia la acción técnica ejecutada al volver por la zona de conos amarillos.",
    "leyenda": "Azul y rojo: equipos · Negro: conducción · Amarillo: zona técnica"
  },
  "detalle": {
    "objetivos": [
      "Activar con balón.",
      "Mejorar conducción y regate.",
      "Usar diferentes superficies de contacto."
    ],
    "claves_entrenador": [
      "Balón controlado.",
      "Cabeza arriba.",
      "Cambiar la acción técnica en la zona central."
    ],
    "montaje": [
      "4 filas.",
      "Dos equipos.",
      "Conos de giro en fondo.",
      "Pares de conos amarillos en zona central."
    ],
    "desarrollo": [
      "Salida diagonal conduciendo.",
      "Rodear cono.",
      "Ejecutar acción técnica entre conos amarillos.",
      "Completar relevo."
    ],
    "que_buscamos": [
      "Velocidad con control.",
      "Calidad gestual.",
      "Competición sin perder precisión."
    ],
    "que_observar": [
      "Distancia del balón al pie.",
      "Control en el giro.",
      "Ejecución de la acción técnica."
    ],
    "correcciones": [
      "Balón cerca.",
      "Mira antes de girar.",
      "Controla antes de acelerar."
    ],
    "reglas": [
      "Gana el equipo que termina antes."
    ],
    "si_sale_mal": [
      "Reducir distancia y velocidad."
    ],
    "si_sale_bien": [
      "Cambiar superficie o acción técnica en zona amarilla."
    ],
    "variantes": [
      "Planta + interior de pierna contraria.",
      "Croqueta interior-interior.",
      "Interior + exterior con la misma pierna."
    ],
    "fuente": {
      "documento": "ejemplo_técnicas_conducción_regate.pdf",
      "ejercicio_original": "Relevos de velocidad de conducción y regate",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente especifica 12 jugadores; se adapta a 15 conservando cuatro filas.",
        "El regreso final a la fila se explicita como cierre operativo del relevo; la fuente no detalla literalmente el punto final del recorrido.",
        "GIF mejorado: cada pestaña reproduce la acción completa desde la salida hasta el relevo, evitando separar el ejercicio en fragmentos difíciles de interpretar."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-FS084-RELEVOS-CONDUCCION-REGATE/CampoBase_FS084_Relevos_Conduccion_Regate_MEJORADO.gif",
    "frames": "assets/ejercicios/CAMPOBASE-FS084-RELEVOS-CONDUCCION-REGATE/frames/f",
    "total": 193,
    "frameMs": 127
  }
},
{
  "id": "CAMPOBASE-FS084-OLEADA-TRANSICIONES-2X2",
  "nombre": "Oleada de transiciones con conducción y regate",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Transición",
    "que_se_trabaja": [
      "2x2",
      "1x1",
      "Conducción",
      "Regate",
      "Finalización",
      "Presión",
      "Cambio de rol",
      "Transición ataque-defensa"
    ],
    "tiempo_estimado_15": "La ficha marca 2 repeticiones de 6 min y una serie de 9 min antes de cambiar equipos; para 15 jugadores se mantiene un montaje único con rotaciones.",
    "jugadores": {
      "total": 15,
      "organizacion": "4 jugadores en 2x2 + 2 rivales esperando en laterales + 9 relevos."
    },
    "material": "6 conos + 4 porterías de entrenamiento",
    "series": [
      {
        "nombre": "1 · Ataque 2x2",
        "instruccion": "Jugar el 2x2 central y finalizar en menos de 7 s y máximo 3 pases."
      },
      {
        "nombre": "2 · Cambio de rol",
        "instruccion": "Nada más terminar, los dos atacantes van a los balones laterales y pasan a ser defensores."
      },
      {
        "nombre": "3 · 1x1 laterales",
        "instruccion": "Cada nuevo defensor pasa al rival que espera en su banda y lo defiende en 1x1; si roba, puede finalizar en la portería contraria."
      }
    ],
    "explicacion_breve": "El GIF enseña la cadena completa: 2x2 → finalización → atacantes cambian de rol → dos 1x1 laterales.",
    "leyenda": "Azul: atacantes iniciales que pasan a defender · Rojo: defensores/rivales laterales"
  },
  "detalle": {
    "objetivos": [
      "Transición ataque-defensa inmediata.",
      "Defender 1x1 tras esfuerzo ofensivo.",
      "Finalizar rápido."
    ],
    "claves_entrenador": [
      "Cambio mental inmediato.",
      "Primeros pasos defensivos rápidos.",
      "Evitar que el rival gane metros tras recibir."
    ],
    "montaje": [
      "Zona central para 2x2.",
      "Dos zonas laterales con balones y rivales esperando.",
      "Cuatro porterías de entrenamiento."
    ],
    "desarrollo": [
      "2x2 central.",
      "Finalización <7 s y máx. 3 pases.",
      "Atacantes van a laterales y pasan a defender.",
      "Pasan balón al rival y defienden 1x1.",
      "Si recuperan, pueden finalizar en portería contraria."
    ],
    "que_buscamos": [
      "Cambio de rol sin pausa.",
      "Defender orientando.",
      "Conducción/regate bajo transición."
    ],
    "que_observar": [
      "Tiempo de reacción.",
      "Perfil defensivo.",
      "Calidad del primer pase lateral."
    ],
    "correcciones": [
      "Cambia el chip.",
      "Frena primero.",
      "No te lances.",
      "Pasa y defiende."
    ],
    "reglas": [
      "<7 s y máx. 3 pases en 2x2."
    ],
    "si_sale_mal": [
      "Ampliar tiempo o distancia lateral."
    ],
    "si_sale_bien": [
      "Reducir espacio o tiempo de finalización."
    ],
    "variantes": [],
    "fuente": {
      "documento": "ejemplo_técnicas_conducción_regate.pdf",
      "ejercicio_original": "Oleada de transiciones con conducción y regate",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente indica 18 jugadores; el GIF se adapta a 15 con reservas sin alterar la secuencia principal.",
        "La distribución exacta de las cuatro porterías se representa funcionalmente para separar el 2x2 central de los 1x1 laterales.",
        "GIF mejorado: se mantiene el mismo montaje durante toda la animación y se ve de forma continua quién cambia de atacante a defensor."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-FS084-OLEADA-TRANSICIONES-2X2/CampoBase_FS084_Oleada_Transiciones_2x2_MEJORADO.gif",
    "frames": "assets/ejercicios/CAMPOBASE-FS084-OLEADA-TRANSICIONES-2X2/frames/f",
    "total": 120,
    "frameMs": 207
  }
},
{
  "id": "CAMPOBASE-2X1-DECISION-DEFENSOR-FINALIZACION",
  "nombre": "2x1 + portero: decisión del defensor y finalización",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Técnico-táctico",
    "que_se_trabaja": [
      "2x1",
      "Toma de decisión",
      "Pase en profundidad",
      "Desmarque",
      "1x1",
      "Finalización",
      "Temporización defensiva"
    ],
    "tiempo_estimado_15": "Fuente: 3x3 repeticiones con rotación y 1 min de micropausa; con 15 se mantiene un 2x1+portero activo y 11 relevos rotando posiciones.",
    "jugadores": {
      "total": 15,
      "organizacion": "2 atacantes + 1 defensor + 1 portero activos; 11 relevos con rotación."
    },
    "material": "Balones + conos/pivotes + 1 portería",
    "series": [
      {
        "nombre": "Inicio",
        "instruccion": "El defensor inicia pasando a A1."
      },
      {
        "nombre": "D va al poseedor",
        "instruccion": "A2 ataca profundidad, A1 pasa al espacio y A2 finaliza."
      },
      {
        "nombre": "D va al atacante sin balón",
        "instruccion": "A1 reconoce el espacio libre, conduce en jugada individual y finaliza."
      }
    ],
    "explicacion_breve": "Cada decisión del defensor se representa como una jugada completa hasta la finalización, para que se vea la lectura del 2x1 sin tener que reconstruir fases.",
    "leyenda": "Rojo: atacantes · Azul: defensor · Verde: portero · Negro: pase/tiro"
  },
  "detalle": {
    "objetivos": [
      "Mejorar decisión en superioridad 2x1.",
      "Finalizar tras lectura defensiva.",
      "Trabajar la conducta del defensor en inferioridad."
    ],
    "claves_entrenador": [
      "Mirar al defensor antes de decidir.",
      "Separación útil entre atacantes.",
      "Atacar el espacio libre."
    ],
    "montaje": [
      "Defensor a unos 10 m entre los dos atacantes.",
      "Atacantes a unos 25 m de línea de fondo.",
      "Portero en portería."
    ],
    "desarrollo": [
      "Defensor pasa a un atacante.",
      "Defensor decide ir al poseedor o al atacante sin balón.",
      "Poseedor responde con pase en profundidad o jugada individual.",
      "Finalización."
    ],
    "que_buscamos": [
      "Lectura del defensor.",
      "Timing del desmarque.",
      "Atacar portería rápido."
    ],
    "que_observar": [
      "Distancia entre atacantes.",
      "Momento del pase.",
      "Orientación del defensor."
    ],
    "correcciones": [
      "Mira al defensor.",
      "Ábrete.",
      "Pasa al espacio, no al pie si ya arrancó."
    ],
    "reglas": [
      "Rotación de posiciones cada bloque de repeticiones."
    ],
    "si_sale_mal": [
      "Aumentar distancia inicial del defensor."
    ],
    "si_sale_bien": [
      "Reducir espacio o acelerar inicio."
    ],
    "variantes": [],
    "fuente": {
      "documento": "80-sesiones-de-entrenamiento-de-futbolpdf_compress.pdf",
      "ejercicio_original": "Situación táctica simplificada 1 · 2x1 + 1 portero",
      "adaptacion_operativa": true,
      "notas": [
        "Se representan las dos decisiones del defensor que la fuente describe explícitamente.",
        "Los 11 relevos son adaptación para 15 sin duplicar montajes.",
        "GIF mejorado: las dos decisiones defensivas se muestran como ramas completas e independientes hasta el tiro."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-2X1-DECISION-DEFENSOR-FINALIZACION/CampoBase_2x1_Decision_Defensor_Finalizacion_MEJORADO.gif",
    "frames": "assets/ejercicios/CAMPOBASE-2X1-DECISION-DEFENSOR-FINALIZACION/frames/f",
    "total": 137,
    "frameMs": 180
  }
},
{
  "id": "CAMPOBASE-4X4-CONTRAATAQUE-TRANSICIONES",
  "nombre": "Partido 4x4: contraataque y transiciones",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Transición",
    "que_se_trabaja": [
      "4x4",
      "Contraataque",
      "Repliegue",
      "Cambio de rol",
      "Finalización",
      "Transición ataque-defensa",
      "Transición defensa-ataque"
    ],
    "tiempo_estimado_15": "Fuente: 2 series x 3 repeticiones x 4 min. Para 15 se mantienen 8 activos + 4 jugadores preparados para entrar + 3 reservas rotativas.",
    "jugadores": {
      "total": 15,
      "organizacion": "2 equipos de 4 juegan; un grupo de 4 queda preparado en el fondo que corresponde a la siguiente entrada; 3 reservas rotan entre grupos."
    },
    "material": "Fuente: 4 delimitadores y porterías de competición. La descripción indica dos porterías aunque la ficha de material menciona una; se representa con dos, porque es lo que exige la lógica del ejercicio.",
    "series": [
      {
        "nombre": "Gol arriba → contra",
        "instruccion": "Tras gol en la portería superior, entra el equipo que esperaba allí y contraataca inmediatamente; el equipo que marcó debe replegar."
      },
      {
        "nombre": "Gol abajo → contra",
        "instruccion": "Misma lógica en sentido contrario."
      }
    ],
    "explicacion_breve": "El gol no cierra la acción: activa la siguiente transición. Entra un equipo fresco desde esa portería y obliga al equipo que acaba de marcar a replegar.",
    "leyenda": "Cian: equipo que entra inmediatamente tras el gol · Discontinuas: entrada/repliegue"
  },
  "detalle": {
    "objetivos": [
      "Transición inmediata tras gol.",
      "Repliegue defensivo.",
      "Contraataque de equipo fresco."
    ],
    "claves_entrenador": [
      "Tras marcar, cambiar el chip y correr hacia portería propia.",
      "Equipo que espera entra sin pausa.",
      "Primer pase del contraataque hacia delante si es posible."
    ],
    "montaje": [
      "Campo reducido con dos porterías.",
      "2 equipos 4v4 dentro.",
      "Equipos de espera asociados a los fondos en la fuente."
    ],
    "desarrollo": [
      "4v4.",
      "Cuando un equipo marca, el grupo que espera en esa portería entra para contraatacar.",
      "El equipo que marcó repliega.",
      "El equipo que recibió el gol queda esperando en los laterales de esa portería para una acción posterior."
    ],
    "que_buscamos": [
      "Reacción tras éxito ofensivo.",
      "Ataque rápido del equipo entrante.",
      "Orden del repliegue."
    ],
    "que_observar": [
      "Velocidad de entrada.",
      "Quién protege el centro al replegar.",
      "Primer pase del nuevo ataque."
    ],
    "correcciones": [
      "Has marcado: atrás ya.",
      "Entra rápido.",
      "Protege dentro primero."
    ],
    "reglas": [
      "Tras gol se activa inmediatamente el equipo que espera en esa portería."
    ],
    "si_sale_mal": [
      "Pausar solo para recolocar grupos; después reiniciar sin demora."
    ],
    "si_sale_bien": [
      "Reducir tiempo entre gol y entrada."
    ],
    "variantes": [],
    "fuente": {
      "documento": "ejemplo_técnicas_conducción_regate.pdf",
      "ejercicio_original": "Partidos 4c4 contraataque y transiciones",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente propone 4 equipos de 4 (16 jugadores). Para 15 se usa rotación de 3 reservas sin alterar el 4v4 ni la entrada de un equipo de 4.",
        "El GIF muestra las dos direcciones posibles de la misma conducta completa."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-4X4-CONTRAATAQUE-TRANSICIONES/CampoBase_4x4_Contraataque_Transiciones.gif",
    "frames": "assets/ejercicios/CAMPOBASE-4X4-CONTRAATAQUE-TRANSICIONES/frames/f",
    "total": 139,
    "frameMs": 144
  }
},
{
  "id": "CAMPOBASE-JUEGO-POSICION-3X3-3-COMODINES",
  "nombre": "Juego de posición 3x3 + 3 comodines",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "3x3",
      "Comodín",
      "Conservación",
      "Apoyo",
      "Presión",
      "Cambio de rol",
      "Pase corto",
      "Juego entre líneas"
    ],
    "tiempo_estimado_15": "Fuente: 2 x 8 min, cambiando comodines. Con 15 hay 9 activos y 6 relevos rotativos.",
    "jugadores": {
      "total": 15,
      "organizacion": "3 poseedores + 3 defensores + 3 comodines activos; 6 relevos."
    },
    "material": "Conos/pivotes, petos y balones; espacio 20x16 m.",
    "series": [
      {
        "nombre": "Posesión completa",
        "instruccion": "Tres atacantes exteriores combinan con 2 comodines interiores y 1 comodín exterior superior contra 3 defensores."
      },
      {
        "nombre": "Robo + cambio de rol",
        "instruccion": "Tras recuperación, los defensores ocupan los lados exteriores y los antiguos atacantes pasan a defender."
      }
    ],
    "explicacion_breve": "Lo importante no es solo conservar: cuando hay robo, los roles y posiciones cambian inmediatamente.",
    "leyenda": "Cian: comodines · Segunda pestaña: se ve el cambio completo de roles tras el robo."
  },
  "detalle": {
    "objetivos": [
      "Mantener posesión mediante combinaciones rápidas a ras de suelo.",
      "Cambiar de rol inmediatamente tras recuperación/pérdida."
    ],
    "claves_entrenador": [
      "Comodines siempre disponibles.",
      "Mover al rival antes de buscar pase interior.",
      "Tras robo, ocupar rápidamente las posiciones exteriores."
    ],
    "montaje": [
      "20x16 m.",
      "3 atacantes en lados exteriores.",
      "2 comodines dentro + 1 comodín exterior superior.",
      "3 defensores dentro."
    ],
    "desarrollo": [
      "Equipo atacante conserva con comodines.",
      "Defensores intentan recuperar.",
      "Tras robo, defensores pasan al exterior y antiguos atacantes buscan recuperación.",
      "12 pases seguidos: repite el equipo defensivo.",
      "Si sale fuera, reinicia comodín exterior."
    ],
    "que_buscamos": [
      "Velocidad de circulación.",
      "Apoyos interiores.",
      "Cambio de mentalidad tras pérdida."
    ],
    "que_observar": [
      "Orientación corporal.",
      "Uso de comodines.",
      "Rapidez en ocupar nuevas posiciones tras robo."
    ],
    "correcciones": [
      "Juega de cara.",
      "Muévete después de pasar.",
      "Robo: abre rápido."
    ],
    "reglas": [
      "12 pases seguidos penalizan al equipo defensor.",
      "Fuera: saca comodín exterior."
    ],
    "si_sale_mal": [
      "Ampliar espacio o permitir más toques."
    ],
    "si_sale_bien": [
      "Reducir espacio o limitar toques."
    ],
    "variantes": [],
    "fuente": {
      "documento": "80-sesiones-de-entrenamiento-de-futbolpdf_compress.pdf",
      "ejercicio_original": "Juego de posición 1 · 3x3 + 3 comodines",
      "adaptacion_operativa": true,
      "notas": [
        "El GIF mantiene la estructura exacta de 9 activos y añade 6 relevos para adaptar a 15.",
        "La circulación de balón es representativa; el cambio de roles sí reproduce la regla de la fuente."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-JUEGO-POSICION-3X3-3-COMODINES/CampoBase_Juego_Posicion_3x3_3Comodines.gif",
    "frames": "assets/ejercicios/CAMPOBASE-JUEGO-POSICION-3X3-3-COMODINES/frames/f",
    "total": 144,
    "frameMs": 124
  }
},
{
  "id": "CAMPOBASE-3X3-2P-4C-PASE-ATRAS",
  "nombre": "3x3 + 2 porteros + 4 comodines: finalización tras pase atrás",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Juego reducido",
    "que_se_trabaja": [
      "3x3",
      "Porteros",
      "Comodín",
      "Pase atrás",
      "Línea de fondo",
      "Finalización",
      "Desmarque",
      "Cambio de posesión"
    ],
    "tiempo_estimado_15": "Fuente: 3 series x 5 min cambiando equipo comodín. Con 15 hay 12 activos + 3 relevos.",
    "jugadores": {
      "total": 15,
      "organizacion": "3x3 + 2 porteros + 4 comodines (2 en cada línea de fondo) = 12 activos; 3 relevos."
    },
    "material": "2 porterías, balones, petos y conos; espacio 30x25 m.",
    "series": [
      {
        "nombre": "Ataque izquierdo completo",
        "instruccion": "Progresar, conectar con comodín de fondo izquierdo, recibir pase atrás y finalizar."
      },
      {
        "nombre": "Ataque derecho completo",
        "instruccion": "Misma conducta utilizando el comodín de fondo derecho."
      },
      {
        "nombre": "Tras gol",
        "instruccion": "Cambia la posesión y el rival inicia su ataque hacia la portería contraria."
      }
    ],
    "explicacion_breve": "No vale finalizar de cualquier manera: la jugada debe llegar a un comodín de línea de fondo y volver mediante pase atrás antes del tiro.",
    "leyenda": "Cian: 4 comodines de fondo · Cada pestaña de ataque enseña la secuencia completa hasta el remate."
  },
  "detalle": {
    "objetivos": [
      "Progresar hasta línea de fondo.",
      "Generar finalización mediante pase atrás.",
      "Ocupar zona de remate después de superar la última línea."
    ],
    "claves_entrenador": [
      "Atacante interior no debe invadir demasiado pronto la zona del comodín.",
      "Pase atrás a zona de llegada, no hacia la portería.",
      "Atacar el balón de cara."
    ],
    "montaje": [
      "30x25 m.",
      "3x3 dentro.",
      "2 porteros.",
      "2 comodines en cada línea de fondo."
    ],
    "desarrollo": [
      "Equipo atacante progresa.",
      "Conecta con un comodín de la línea de fondo rival.",
      "Comodín juega pase atrás.",
      "Atacante finaliza.",
      "Tras gol cambia la posesión.",
      "Tras fuera, saca portero correspondiente."
    ],
    "que_buscamos": [
      "Llegar a fondo antes de finalizar.",
      "Timing de llegada.",
      "Pase atrás limpio."
    ],
    "que_observar": [
      "Quién ocupa zona de remate.",
      "Distancia entre poseedor y comodín.",
      "Reacción tras cambio de posesión."
    ],
    "correcciones": [
      "Primero fondo.",
      "Llega de cara.",
      "Pase atrás, no al portero."
    ],
    "reglas": [
      "El tiro válido llega después de pase atrás desde línea de fondo.",
      "Tras gol cambia la posesión."
    ],
    "si_sale_mal": [
      "Permitir comodín sin oposición y ampliar espacio."
    ],
    "si_sale_bien": [
      "Limitar toques interiores."
    ],
    "variantes": [],
    "fuente": {
      "documento": "80-sesiones-de-entrenamiento-de-futbolpdf_compress.pdf",
      "ejercicio_original": "Espacio reducido 2 · 3x3 + 2 porteros + 4 comodines de fondo",
      "adaptacion_operativa": true,
      "notas": [
        "La fuente encaja directamente con 12 activos; se añaden 3 relevos para representar 15.",
        "Ataques por izquierda y derecha son dos ejemplos simétricos de la misma regla, no variantes añadidas."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-3X3-2P-4C-PASE-ATRAS/CampoBase_3x3_2Porteros_4Comodines_Pase_Atras.gif",
    "frames": "assets/ejercicios/CAMPOBASE-3X3-2P-4C-PASE-ATRAS/frames/f",
    "total": 167,
    "frameMs": 156
  }
}
,
{
  "id": "CAMPOBASE-VIDEO-REACCION-COLORES-F7-F11",
  "nombre": "Reacción por colores con aceleraciones laterales",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Velocidad de reacción",
      "Aceleración",
      "Cambio de dirección",
      "Agilidad",
      "Frenada",
      "Percepción visual",
      "Coordinación",
      "Desplazamiento lateral"
    ],
    "tiempo_estimado_15": "5-6 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 grupos de 5 trabajando simultáneamente con el mismo estímulo del entrenador."
    },
    "material": "Cada jugador con referencia central y dos referencias laterales de color.",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "3 series de 30-35 s."
      }
    ],
    "explicacion_breve": "Cada jugador parte sobre su referencia blanca central. Aparece o se da un estímulo de color. Naranja: acelerar hacia la referencia naranja situada a la derecha. Verde: acelerar hacia la referencia verde situada a la izquierda. Blanco: regresar o mantenerse en la referencia blanca central. Los estímulos cambian de forma no predecible para obligar a reaccionar y cambiar de dirección.",
    "leyenda": ""
  },
  "detalle": {
    "objetivos": [
      "Reaccionar rápidamente ante un estímulo visual.",
      "Mejorar el primer paso y la aceleración corta.",
      "Controlar la frenada y el cambio de dirección.",
      "Mantener atención visual sin anticiparse a la señal."
    ],
    "claves_entrenador": [],
    "montaje": [
      "Cada jugador con referencia central y dos referencias laterales de color."
    ],
    "desarrollo": [
      "Cada jugador parte sobre su referencia blanca central.",
      "Aparece o se da un estímulo de color.",
      "Naranja: acelerar hacia la referencia naranja situada a la derecha.",
      "Verde: acelerar hacia la referencia verde situada a la izquierda.",
      "Blanco: regresar o mantenerse en la referencia blanca central.",
      "Los estímulos cambian de forma no predecible para obligar a reaccionar y cambiar de dirección."
    ],
    "que_buscamos": [
      "Reaccionar a un balón dividido.",
      "Corregir trayectoria defensiva.",
      "Saltar a una presión.",
      "Replegar o reajustar posición tras pérdida.",
      "Cambiar rápidamente de dirección ante un nuevo estímulo de juego."
    ],
    "que_observar": [
      "No anticiparse al estímulo.",
      "Primer paso rápido y en la dirección correcta.",
      "Cabeza levantada y atención al estímulo.",
      "Frenada controlada.",
      "Buena orientación de rodilla y pie al cambiar de dirección.",
      "Separación suficiente entre jugadores para evitar choques.",
      "Mantener la calidad de ejecución hasta el final del bloque."
    ],
    "correcciones": [
      "Espera la señal.",
      "Primer paso rápido.",
      "Frena y cambia.",
      "No adivines.",
      "Cabeza arriba.",
      "Reacciona, no anticipes."
    ],
    "reglas": [
      "La duración observada del vídeo no se toma como tiempo recomendado de entrenamiento.",
      "Las medidas y tiempos de F7/F11 son adaptación CampoBase, no datos visibles ni declarados en el vídeo.",
      "Si se añade balón, se considera una progresión nueva y debe etiquetarse aparte.",
      "La secuencia de colores del GIF es representativa para explicar la mecánica; no se presenta como la secuencia exacta del vídeo.",
      "El GIF no añade balón, circuitos ni acciones técnicas que no aparecen en el vídeo."
    ],
    "si_sale_mal": [
      "Reducir la frecuencia de los estímulos.",
      "Acortar la distancia a 2-3 m.",
      "Aumentar la separación entre jugadores.",
      "Reducir el bloque a 20-25 s si baja claramente la velocidad."
    ],
    "si_sale_bien": [
      "Cambiar estímulo visual por verbal.",
      "Combinar colores, números o gestos.",
      "Reducir ligeramente el tiempo de reacción disponible.",
      "Añadir balón como progresión separada, sin presentarlo como parte observada del vídeo."
    ],
    "variantes": [
      "Fútbol 7: 3 grupos de 5 trabajando simultáneamente con el mismo estímulo del entrenador. · ",
      "Fútbol 11: 2-4 líneas paralelas de 5-6 jugadores, todos reaccionando al mismo estímulo o por grupos alternos. · "
    ],
    "fuente": {
      "documento": "Vídeo real: !agi_7586719013842111766.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Varios jugadores trabajan simultáneamente alineados sobre una fila de referencias blancas centrales.",
        "A la izquierda de cada jugador hay una referencia verde y a la derecha una referencia naranja.",
        "El vídeo muestra estímulos visuales verde, naranja y blanco.",
        "Verde provoca desplazamiento hacia la referencia verde; naranja hacia la referencia naranja; blanco devuelve o mantiene al jugador en la referencia central blanca.",
        "Los jugadores realizan aceleraciones cortas, frenadas y cambios de dirección de forma simultánea.",
        "No se utiliza balón en la tarea observada.",
        "El vídeo no aporta medidas exactas ni tiempos oficiales de trabajo."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-REACCION-COLORES-F7-F11/CampoBase_Reaccion_Colores_F7_F11_CORREGIDO.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-REACCION-COLORES-F7-F11/frames/f",
    "total": 57,
    "frameMs": 189
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-REACCION-COLORES-F7-F11/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-REACCION-COLOR-SPRINT-2-DIRECCIONES",
  "nombre": "Reacción a consigna de color con sprint a dos direcciones",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Velocidad de reacción",
      "Estímulo auditivo",
      "Aceleración",
      "Cambio de dirección",
      "Agilidad",
      "Atención",
      "Toma de decisión"
    ],
    "tiempo_estimado_15": "8-10 min incluyendo explicación, prueba y rotaciones.",
    "jugadores": {
      "total": 15,
      "organizacion": "4 grupos: 4 + 4 + 4 + 3. Trabaja un grupo por oleada."
    },
    "material": "Referencias de colores",
    "series": [
      {
        "nombre": "Base",
        "instruccion": "2 series de 4-6 s desde «preparados» + color + sprint completo. con descanso de 1 min 30 s - 2 min. entre series."
      }
    ],
    "explicacion_breve": "Los jugadores se colocan en su línea de salida. El entrenador dice en voz alta un color previamente asociado a una dirección. Los jugadores no pueden salir antes de escuchar la palabra completa. Al oír el color, arrancan a máxima intención hacia la dirección correspondiente. Cruzan la referencia final sin frenar antes. Salen del recorrido y entra la siguiente oleada.",
    "leyenda": ""
  },
  "detalle": {
    "objetivos": [
      "Reaccionar rápidamente a una consigna verbal.",
      "Mejorar el primer apoyo y la aceleración corta.",
      "Cambiar la intención de movimiento según la palabra indicada.",
      "Evitar anticiparse y mantener atención en el entrenador."
    ],
    "claves_entrenador": [],
    "montaje": [],
    "desarrollo": [
      "Los jugadores se colocan en su línea de salida.",
      "El entrenador dice en voz alta un color previamente asociado a una dirección.",
      "Los jugadores no pueden salir antes de escuchar la palabra completa.",
      "Al oír el color, arrancan a máxima intención hacia la dirección correspondiente.",
      "Cruzan la referencia final sin frenar antes.",
      "Salen del recorrido y entra la siguiente oleada."
    ],
    "que_buscamos": [
      "Reaccionar a una orden o estímulo inesperado.",
      "Primeros metros hacia un balón dividido.",
      "Inicio de presión.",
      "Repliegue tras pérdida.",
      "Corrección rápida de posición."
    ],
    "que_observar": [
      "Que reaccionen a la voz del entrenador y no al movimiento del compañero.",
      "Salidas anticipadas.",
      "Primeros dos apoyos explosivos.",
      "Dirección correcta después de escuchar el color.",
      "Que crucen la referencia final a velocidad.",
      "Separación suficiente entre carriles.",
      "Que la fatiga no reduzca la velocidad ni la atención."
    ],
    "correcciones": [],
    "reglas": [
      "La consigna verbal de color es el estímulo principal.",
      "Las medidas y tiempos son adaptación CampoBase, no datos declarados en el vídeo.",
      "El GIF representa la lógica observada y no asigna como hecho una correspondencia color-dirección que el vídeo no permite confirmar con total seguridad."
    ],
    "si_sale_mal": [
      "Usar solo dos colores claramente diferenciados.",
      "Reducir distancia.",
      "Aumentar el tiempo entre «preparados» y el color.",
      "Separar más los carriles.",
      "Reducir repeticiones si aparecen errores por fatiga."
    ],
    "si_sale_bien": [
      "Cambiar aleatoriamente los colores.",
      "Añadir una tercera consigna con una acción distinta.",
      "Cambiar la posición de salida.",
      "Añadir competición por parejas sin modificar la consigna verbal."
    ],
    "variantes": [
      "Fútbol 7: 4 grupos: 4 + 4 + 4 + 3. Trabaja un grupo por oleada. · 8-10 min incluyendo explicación, prueba y rotaciones.",
      "Fútbol 11: Oleadas de 4. Con plantilla grande, 4-6 grupos según número de jugadores. · 10-14 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_77219400674642103558.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Aproximadamente 4 jugadores trabajan simultáneamente por oleada.",
        "Los jugadores parten alineados sobre referencias planas.",
        "El entrenador da una consigna de color en voz alta.",
        "Los jugadores reaccionan a la palabra-color y arrancan simultáneamente hacia la dirección asociada.",
        "Se observan aceleraciones cortas hacia dos direcciones opuestas.",
        "Hay referencias de varios colores en los extremos.",
        "No se utiliza balón."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-REACCION-COLOR-SPRINT-2-DIRECCIONES/CampoBase_Reaccion_Color_Sprint_Dos_Direcciones_CORREGIDO.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-REACCION-COLOR-SPRINT-2-DIRECCIONES/frames/f",
    "total": 59,
    "frameMs": 165
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-REACCION-COLOR-SPRINT-2-DIRECCIONES/video.mp4"
}
]);

// Convierte un ejercicio validado al formato interno de CampoBase (para sesiones, filtros, etc.).
// El tipo_principal ya es la categoría profesional (taxonomía normalizada), así que se usa tal cual.
export function toCampoBaseExercise(item) {
  const vr = item.vista_rapida || {};
  return {
    id: item.id,
    recordType: 'exercise',
    name: item.nombre,
    category: vr.tipo_principal || 'Tecnificación',
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
