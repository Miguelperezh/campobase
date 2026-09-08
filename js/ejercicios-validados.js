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
          "nombre": "Paso 1",
          "instruccion": "Jugador A sale con balón."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Alterna un cono de un lado y el siguiente del contrario."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Completa el recorrido hasta la llegada."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Vuelve por fuera con su propio balón."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Sale el siguiente cuando hay distancia suficiente."
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
          "nombre": "Paso 1",
          "instruccion": "Estación A: trote suave durante 30 segundos."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Estación B: escalera con 1 paso por casilla, combinando cambio frontal y lateral."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Estación C: pasar 2 vallas bajas con desplazamiento lateral y skipping medio."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Estación D: realizar zigzag entre conos con desplazamientos cortos."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Completar 3 vueltas al circuito a ritmo creciente."
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
          "nombre": "Paso 1",
          "instruccion": "El entrenador pasa el balón a uno de los atacantes."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "En ese momento comienza el ataque 4v3."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Los tres defensores salen a recuperar."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Los cuatro atacantes deben finalizar antes de 8 segundos."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Tras gol, palo o pérdida, terminan la acción y entra el siguiente grupo."
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
          "nombre": "Paso 1",
          "instruccion": "El equipo con balón inicia desde su zona defensiva."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Debe progresar hasta la zona intermedia y después hasta la zona ofensiva."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Para que el gol sea válido, el balón debe haber pasado por las tres zonas."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "En cada zona debe intervenir al menos un compañero distinto."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Si cambia la posesión, la misma regla comienza para el otro equipo."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Realizar cuatro series de cinco minutos."
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
          "nombre": "Paso 1",
          "instruccion": "Bloque 1 (8 min): realizar blocajes frontales y laterales con balones rasos y a media altura."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Bloque 2 (6 min): realizar despejes con dos puños tras centros al área."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Bloque 3 (6 min): practicar saque de mano rodante, saque de mano tenso y saque de volea."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Bloque 4 (10 min): trabajar la salida del balón con los pies hacia un compañero presionado."
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
          "nombre": "Paso 1",
          "instruccion": "Jugar un partido 3v3."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Cualquier miniportería de la línea de fondo rival es válida para marcar."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "No hay porteros."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "No se permiten saques largos."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Cuando el balón sale fuera, se reanuda con un pase rasante."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Realizar 3 series de 4 minutos con 1 minuto de descanso."
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
          "nombre": "Paso 1",
          "instruccion": "Serie 1: realizar 8 repeticiones de ida y vuelta en 14 segundos, seguidas de 14 segundos de descanso."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Serie 2: realizar 6 repeticiones de ida y vuelta en 12 segundos, seguidas de 12 segundos de descanso."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Serie 3: realizar 5 repeticiones de ida y vuelta en 10 segundos, seguidas de 20 segundos de descanso."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Finalizar con 5 minutos de estiramientos pasivos."
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
          "nombre": "Paso 1",
          "instruccion": "El equipo que tiene el balón intenta conservar la posesión."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "El comodín neutral juega siempre con el equipo que está en posesión."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Cada 8 pases consecutivos sin pérdida suman 1 punto."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Si cambia la posesión, el contador comienza de nuevo para el otro equipo."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Realizar 3 bloques de 6 minutos."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Rotar el rol de comodín entre bloques."
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
          "nombre": "Paso 1",
          "instruccion": "Acción 1: el jugador de Banda A realiza un pase largo a Banda B."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "El receptor de Banda B controla orientado y juega un pase corto con el jugador central."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "El central devuelve el balón a la Banda A, donde recibe el siguiente jugador de esa fila."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Después de su pase largo, el jugador que salió de Banda A pasa al puesto central."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Acción 2: ahora sale el jugador de Banda B con pase largo hacia Banda A."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "El receptor de Banda A juega corto con el central."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "El central devuelve el balón a la Banda B."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Después de esta segunda acción, el jugador que actuó como central pasa a la Banda B."
        },
        {
          "nombre": "Paso 9",
          "instruccion": "La secuencia sigue alternando de un lado a otro."
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
          "nombre": "Paso 1",
          "instruccion": "Empiezan dos equipos dentro."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Los demás esperan en orden."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Cuando un equipo recibe gol, sale."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Entra inmediatamente el siguiente equipo de la cola."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "El equipo que sale pasa al final de la cola."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Se mantiene el juego durante el tiempo previsto."
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
          "nombre": "Paso 1",
          "instruccion": "Los 5 jugadores de posesión intentan conservar el balón."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Los 2 defensores intentan recuperar."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Si el pivote toca y devuelve hacia un lado distinto, suma 2 puntos."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Cada 6 pases normales se suma 1 punto."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Cuando un defensor recupera, cambia con el jugador que perdió el balón."
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
          "nombre": "Paso 1",
          "instruccion": "El portero inicia la acción jugando con los pies hacia uno de los centrales."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Los dos presionadores intentan recuperar."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "El equipo de salida intenta superar esa primera línea de presión."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "El objetivo final es marcar en cualquiera de las dos miniporterías."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Si recuperan los presionadores, atacan inmediatamente la portería real."
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
          "nombre": "Paso 1",
          "instruccion": "Entrenador entrega a atacantes."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Defensor cercano salta al poseedor."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Segundo defensor cubre detrás/interior."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Si recuperan, atacan la portería opuesta."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Series de 90 s con rotación."
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
          "nombre": "Paso 1",
          "instruccion": "Atacante elige pasillo."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Defensor sale al elegirlo."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Se juega 1v1 hasta remate."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Ambos rotan al final de sus filas."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Fuente indica 12 acciones por jugador."
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
          "nombre": "Paso 1",
          "instruccion": "Partido normal."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Al perder, comienza cuenta."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Si recuperan a tiempo, se premia la acción según regla."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Si no, repliegue sobre línea propia."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "4 series de 5 min."
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
          "nombre": "Paso 1",
          "instruccion": "Entrenador dice color."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Jugador sprinta, toca y vuelve."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "8 reacciones = 1 serie."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "4 series con 90 s descanso."
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
          "nombre": "Paso 1",
          "instruccion": "Lateral conduce a fondo."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Centra."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Tres rematadores atacan primer palo, penalti y segundo."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Rotan funciones."
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
          "nombre": "Paso 1",
          "instruccion": "Circular."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Buscar interiores."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Moverse tras pase."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Defensores cierran líneas."
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
          "nombre": "Paso 1",
          "instruccion": "Partido."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Saque rápido."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "4x4 min."
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
          "nombre": "Paso 1",
          "instruccion": "Los atacantes conservan/progresan en el pasillo."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "D1 presiona al poseedor y lo orienta a banda."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "D2 corta la línea interior."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Si recuperan, los defensores atacan la miniportería."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Series de 90 s."
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
          "nombre": "Paso 1",
          "instruccion": "E1: pase y control con interior, dos toques."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "E2: control orientado y un toque."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "E3: conducir entre dos conos antes de pasar."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "E4: pared con compañero antes de pasar."
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
          "nombre": "Paso 1",
          "instruccion": "4 atacantes mantienen rondo contra 2 defensores."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Cuando los defensores recuperan, suman al compañero adelantado."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Los 3 atacan portería."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "2 de los 4 antiguos atacantes corren a defender."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Finalizar antes de 8 s."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Reiniciar."
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
    "tipo_principal": "Tecnificación",
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
          "nombre": "Paso 1",
          "instruccion": "Salida diagonal conduciendo."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Rodear cono."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Ejecutar acción técnica entre conos amarillos."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Completar relevo."
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
          "nombre": "Paso 1",
          "instruccion": "2x2 central."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Finalización <7 s y máx. 3 pases."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Atacantes van a laterales y pasan a defender."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Pasan balón al rival y defienden 1x1."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Si recuperan, pueden finalizar en portería contraria."
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
          "nombre": "Paso 1",
          "instruccion": "Defensor pasa a un atacante."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Defensor decide ir al poseedor o al atacante sin balón."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Poseedor responde con pase en profundidad o jugada individual."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Finalización."
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
          "nombre": "Paso 1",
          "instruccion": "4v4."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Cuando un equipo marca, el grupo que espera en esa portería entra para contraatacar."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "El equipo que marcó repliega."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "El equipo que recibió el gol queda esperando en los laterales de esa portería para una acción posterior."
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
          "nombre": "Paso 1",
          "instruccion": "Equipo atacante conserva con comodines."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Defensores intentan recuperar."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Tras robo, defensores pasan al exterior y antiguos atacantes buscan recuperación."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "12 pases seguidos: repite el equipo defensivo."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Si sale fuera, reinicia comodín exterior."
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
          "nombre": "Paso 1",
          "instruccion": "Equipo atacante progresa."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Conecta con un comodín de la línea de fondo rival."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Comodín juega pase atrás."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Atacante finaliza."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Tras gol cambia la posesión."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Tras fuera, saca portero correspondiente."
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
          "nombre": "Paso 1",
          "instruccion": "Cada jugador parte sobre su referencia blanca central."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Aparece o se da un estímulo de color."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Naranja: acelerar hacia la referencia naranja situada a la derecha."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Verde: acelerar hacia la referencia verde situada a la izquierda."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Blanco: regresar o mantenerse en la referencia blanca central."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Los estímulos cambian de forma no predecible para obligar a reaccionar y cambiar de dirección."
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
          "nombre": "Paso 1",
          "instruccion": "Los jugadores se colocan en su línea de salida."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "El entrenador dice en voz alta un color previamente asociado a una dirección."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Los jugadores no pueden salir antes de escuchar la palabra completa."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Al oír el color, arrancan a máxima intención hacia la dirección correspondiente."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Cruzan la referencia final sin frenar antes."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Salen del recorrido y entra la siguiente oleada."
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
,
{
  "id": "CAMPOBASE-VIDEO-KNEE-DRIVE-SKATER-JUMP-PROGRESION",
  "nombre": "Knee drive + saltos laterales tipo skater en progresión",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Coordinación",
      "Cambio de dirección",
      "Aceleración",
      "Equilibrio",
      "Estabilidad",
      "Potencia lateral",
      "Control corporal"
    ],
    "tiempo_estimado_15": "6-8 min incluyendo demostración.",
    "jugadores": {
      "total": 15,
      "organizacion": "3 carriles iguales de 5 jugadores. Trabaja 1 jugador por carril y los otros 4 esperan/recuperan."
    },
    "material": "Conos/cúpulas verdes en la zona central. · Conos/cúpulas blancas como referencias laterales.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador entra en el montaje con una acción de knee drive: eleva la rodilla y prepara el primer apoyo."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Desde el primer apoyo realiza un salto lateral hacia un lado, aterrizando sobre una pierna."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Estabiliza de forma muy breve sin quedarse parado."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Impulsa inmediatamente hacia el lado contrario."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Repite derecha-izquierda-derecha-izquierda mientras avanza hacia delante."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Sale del montaje manteniendo el control corporal."
        }
      ],
    "explicacion_breve": "El jugador entra en el montaje con una acción de knee drive: eleva la rodilla y prepara el primer apoyo. Desde el primer apoyo realiza un salto lateral hacia un lado, aterrizando sobre una pierna. Estabiliza de forma muy breve sin quedarse parado. Impulsa inmediatamente hacia el lado contrario. Repite derecha-izquierda-derecha-izquierda mientras avanza hacia delante. Sale del montaje manteniendo el control corporal.",
    "leyenda": "Knee drive de entrada + saltos laterales tipo skater alternando apoyos, con progresión hacia delante."
  },
  "detalle": {
    "objetivos": [
      "Mejorar coordinación entre impulso, recepción y nuevo impulso.",
      "Trabajar estabilidad unilateral en las recepciones.",
      "Mejorar fuerza/potencia lateral de baja duración.",
      "Controlar el tronco y la cadera al cambiar de apoyo.",
      "Encadenar movimientos laterales mientras se progresa hacia delante."
    ],
    "claves_entrenador": [
      "«Primero calidad, no altura».",
      "«Rodilla arriba al entrar».",
      "«Cada salto cae sobre una pierna y sales hacia el otro lado».",
      "«Avanza hacia delante, no te quedes saltando en el mismo sitio».",
      "Hacer una demostración lenta antes de pedir velocidad.",
      "«Rodilla arriba».",
      "«Cae estable».",
      "«Rodilla alineada con el pie».",
      "«Cadera controlada».",
      "«Impulsa al otro lado».",
      "«No juntes los pies».",
      "«Avanza».",
      "«Calidad antes que distancia»."
    ],
    "montaje": [
      "Carril corto de progresión.",
      "Referencias verdes centrales distribuidas a lo largo del recorrido.",
      "Referencias blancas exteriores a ambos lados.",
      "Un jugador realiza la tarea por vez en el vídeo."
    ],
    "desarrollo": [
      "El jugador entra en el montaje con una acción de knee drive: eleva la rodilla y prepara el primer apoyo.",
      "Desde el primer apoyo realiza un salto lateral hacia un lado, aterrizando sobre una pierna.",
      "Estabiliza de forma muy breve sin quedarse parado.",
      "Impulsa inmediatamente hacia el lado contrario.",
      "Repite derecha-izquierda-derecha-izquierda mientras avanza hacia delante.",
      "Sale del montaje manteniendo el control corporal."
    ],
    "que_buscamos": [
      "Mejorar el control corporal en cambios laterales rápidos.",
      "Preparar apoyos para correcciones defensivas y desplazamientos laterales.",
      "Mejorar estabilidad tras una frenada o apoyo unilateral.",
      "Favorecer una mejor mecánica de impulso lateral."
    ],
    "que_observar": [
      "Que la rodilla no colapse hacia dentro al aterrizar.",
      "Que el jugador no caiga con el tronco descontrolado.",
      "Que exista una recepción clara sobre una pierna antes del siguiente impulso.",
      "Que los saltos sean laterales pero también progresen hacia delante.",
      "Que no se junten los pies entre saltos.",
      "Que la distancia de salto sea adecuada a la edad.",
      "Que la fatiga no deteriore la calidad de las recepciones."
    ],
    "correcciones": [
      "Saltar demasiado alto en lugar de desplazarse lateralmente.",
      "Quedarse casi parado entre recepciones.",
      "Caer con la rodilla hacia dentro.",
      "Usar los dos pies para estabilizar cada recepción.",
      "Perder la progresión hacia delante.",
      "Buscar velocidad antes de dominar la técnica."
    ],
    "reglas": [
      "El GIF reproduce la secuencia visible: knee drive de entrada + saltos laterales alternos con progresión.",
      "No se añade señal verbal ni visual porque no aparece en el vídeo.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase.",
      "Para Alevín se reduce la amplitud respecto a un adulto y se prioriza estabilidad."
    ],
    "si_sale_mal": [
      "Reducir distancia lateral entre conos.",
      "Eliminar la progresión hacia delante y practicar solo un salto lateral y recepción.",
      "Hacer el recorrido andando con apoyo lateral antes de saltar.",
      "Reducir el número de saltos del recorrido."
    ],
    "si_sale_bien": [
      "Aumentar ligeramente la amplitud lateral.",
      "Añadir un último sprint corto al salir.",
      "Cambiar la pierna con la que se inicia.",
      "Añadir una señal final de salida derecha/izquierda después del último salto, como progresión nueva."
    ],
    "variantes": [
      "Fútbol 7: 3 carriles iguales de 5 jugadores. Trabaja 1 jugador por carril y los otros 4 esperan/recuperan. · 6-8 min incluyendo demostración.",
      "Fútbol 11: 3-4 carriles de 4-6 jugadores, según plantilla y espacio. · 8-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7575643273721662742.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Un jugador realiza el ejercicio de forma individual y sin balón.",
        "El montaje utiliza conos verdes en la zona central y conos blancos delimitando los laterales.",
        "El jugador entra con una acción de rodilla alta/knee drive.",
        "Después encadena saltos laterales tipo skater alternando apoyos de un lado a otro.",
        "Los saltos laterales progresan hacia delante a través del montaje.",
        "Cada recepción se realiza sobre un apoyo antes de impulsar hacia el lado contrario.",
        "El recorrido termina saliendo por el extremo opuesto del montaje."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-KNEE-DRIVE-SKATER-JUMP-PROGRESION/CampoBase_Knee_Drive_Skater_Jump_Progresion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-KNEE-DRIVE-SKATER-JUMP-PROGRESION/frames/f",
    "total": 39,
    "frameMs": 169
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-KNEE-DRIVE-SKATER-JUMP-PROGRESION/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-REACTIVE-KNEE-DRIVE-SKATER-3-VARIACIONES",
  "nombre": "Knee drive reactivo + salto skater — 3 variaciones",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Coordinación",
      "Salto lateral",
      "Equilibrio",
      "Estabilidad",
      "Potencia lateral",
      "Cambio de dirección",
      "Control corporal",
      "Apoyo unilateral"
    ],
    "tiempo_estimado_15": "7-9 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 carriles de 5 jugadores. Un jugador activo por carril."
    },
    "material": "Conos/cúpulas verdes y blancas alternados. Sin balón.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador entra en el montaje y realiza saltos laterales tipo skater (BASE)."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Cada salto tiene fase aérea y recepción unilateral antes del nuevo impulso."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "VARIACIÓN 1: knee drive más marcado antes del apoyo y del nuevo impulso lateral."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "VARIACIÓN 2: patrón desde el extremo contrario con apoyos de preparación más cortos."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "En los tres bloques se combinan control unilateral, desplazamiento lateral y progresión hacia delante."
        }
      ],
    "explicacion_breve": "El jugador trabaja de forma individual y sin balón sobre un montaje de conos verdes y blancos alternados. BASE: saltos laterales tipo skater con fase aérea y recepción unilateral antes del nuevo impulso. VARIACIÓN 1: knee drive más marcado antes del apoyo y del nuevo impulso lateral. VARIACIÓN 2: patrón desde el extremo contrario con apoyos de preparación más cortos antes del cambio lateral. En los tres bloques se combinan control unilateral, desplazamiento lateral y progresión hacia delante.",
    "leyenda": "Conos verdes y blancos alternados · Salto lateral tipo skater · Recepción unilateral · Progresión hacia delante"
  },
  "detalle": {
    "objetivos": [
      "Mejorar el control corporal en desplazamientos laterales.",
      "Mejorar la estabilidad unilateral tras el aterrizaje.",
      "Desarrollar impulso lateral y cambio de dirección.",
      "Coordinar knee drive, recepción y nuevo impulso.",
      "Mantener progresión hacia delante sin perder calidad de apoyo."
    ],
    "claves_entrenador": [
      "«Primero os enseño la forma; después aumentamos velocidad».",
      "«No busquéis saltar lo máximo: buscad caer bien».",
      "«Rodilla alineada con el pie».",
      "«Tronco estable y cadera controlada».",
      "«Salta lateral».",
      "«Cae sobre una pierna».",
      "«Absorbe y vuelve a impulsar».",
      "«No juntes los pies entre saltos».",
      "«Rodilla arriba».",
      "«Apoya y empuja lateral».",
      "«No te quedes parado en la recepción».",
      "«Cambia de lado con control».",
      "«Apoyos cortos».",
      "«Prepara el cuerpo antes del cambio».",
      "«Empuja al lado contrario».",
      "«Mantén la progresión hacia delante».",
      "«Calidad antes que velocidad».",
      "«Salto corto y recepción estable».",
      "Parar si la rodilla entra hacia dentro o el niño pierde equilibrio repetidamente."
    ],
    "montaje": [
      "Montaje de conos verdes y blancos alternados formando un carril de progresión.",
      "Un jugador trabaja de forma individual y sin balón.",
      "Referencias verdes y blancas distribuidas a lo largo del recorrido."
    ],
    "desarrollo": [
      "El jugador entra en el montaje y realiza saltos laterales tipo skater (BASE).",
      "Cada salto tiene fase aérea y recepción unilateral antes del nuevo impulso.",
      "VARIACIÓN 1: knee drive más marcado antes del apoyo y del nuevo impulso lateral.",
      "VARIACIÓN 2: patrón desde el extremo contrario con apoyos de preparación más cortos.",
      "En los tres bloques se combinan control unilateral, desplazamiento lateral y progresión hacia delante."
    ],
    "que_buscamos": [
      "Correcciones defensivas laterales.",
      "Ajustes de marca.",
      "Basculaciones cortas.",
      "Control corporal tras un apoyo unilateral.",
      "Re-aceleración después de un cambio de dirección."
    ],
    "que_observar": [
      "Aterrizajes estables.",
      "Rodilla alineada con pie y cadera.",
      "Tronco sin balanceos excesivos.",
      "Que la recepción sea unilateral cuando corresponde.",
      "Que no se transforme en una carrera en zigzag sin control.",
      "Que la distancia lateral no sea excesiva para la edad.",
      "Que cada variación mantenga su patrón y no se mezcle con las demás."
    ],
    "correcciones": [
      "Caer con la rodilla hacia dentro.",
      "Recepción inestable o con los dos pies.",
      "Tronco descontrolado al aterrizar.",
      "Convertir el ejercicio en una carrera en zigzag sin control.",
      "Mezclar la mecánica de las variaciones."
    ],
    "reglas": [
      "El GIF reproduce la secuencia visible: BASE, VARIACIÓN 1 y VARIACIÓN 2 con mecánicas distintas.",
      "No se añade señal externa del entrenador porque no aparece en el vídeo.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase.",
      "Para Alevín se reduce la amplitud y el volumen de salto."
    ],
    "si_sale_mal": [
      "Reducir separación lateral.",
      "Hacer solo la BASE a velocidad media.",
      "Practicar una recepción unilateral aislada antes de continuar.",
      "Reducir el número de cambios."
    ],
    "si_sale_bien": [
      "Aumentar ligeramente la velocidad.",
      "Añadir un sprint corto al terminar.",
      "Hacer los tres bloques seguidos manteniendo la técnica.",
      "Alternar pierna inicial."
    ],
    "variantes": [
      "Fútbol 7: 3 carriles de 5 jugadores. Un jugador activo por carril. · 7-9 min.",
      "Fútbol 11: 3-4 carriles de 4-6 jugadores, según plantilla y espacio. · 9-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7576299461874421014.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El jugador trabaja individualmente y sin balón.",
        "El montaje utiliza grupos de conos verdes y blancos alternados.",
        "El bloque inicial muestra desplazamientos con fase aérea clara y recepciones laterales tipo skater.",
        "VARIATION 1 mantiene la progresión lateral pero cambia el ritmo de apoyo/impulso.",
        "VARIATION 2 se ejecuta desde el extremo contrario y vuelve a modificar el patrón de apoyos y salida.",
        "El vídeo no muestra una señal externa del entrenador.",
        "El vídeo no aporta distancias exactas, número de series ni pausas oficiales."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-REACTIVE-KNEE-DRIVE-SKATER-3-VARIACIONES/CampoBase_Reactive_Knee_Drive_Skater_3_Variaciones_V3.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-REACTIVE-KNEE-DRIVE-SKATER-3-VARIACIONES/frames/f",
    "total": 207,
    "frameMs": 147
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-REACTIVE-KNEE-DRIVE-SKATER-3-VARIACIONES/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-DOBLE-DEVOLUCION-PICA-RETORNO-CONOS-V2",
  "nombre": "Doble devolución alrededor de pica con retorno lateral por conos",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Pase de primeras",
      "Control de pecho",
      "Volea",
      "Desplazamiento lateral",
      "Cambio de dirección",
      "Coordinación",
      "Perfil corporal",
      "Apoyos",
      "Orientación corporal"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 calles de 5 jugadores. Por calle: 1 servidor, 1 activo y 3 esperan; rotar servidor."
    },
    "material": "Fila de conos planos + una pica alta por calle. Balones junto al servidor.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador parte en un extremo de la línea de conos."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Se desplaza lateralmente paralelo a esa línea; los conos actúan como referencia del recorrido."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Al llegar a la zona de la pica se abre para ver al servidor."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Serie raso: el servidor pasa raso al Lado A y el jugador devuelve de primeras."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Nada más devolver, inicia una curva alrededor de la pica por la cara opuesta al servidor."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Sale por el Lado B, vuelve a orientarse al servidor y repite la devolución de primeras."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Serie aérea: el servidor lanza alto; el jugador amortigua con el pecho y devuelve de volea antes del bote."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Rodea la pica y repite pecho + volea en el otro lado."
        },
        {
          "nombre": "Paso 9",
          "instruccion": "Finaliza regresando con desplazamiento lateral junto a la línea de conos."
        }
      ],
    "explicacion_breve": "El jugador se desplaza lateralmente en paralelo a una línea de conos planos (que solo delimitan el recorrido, sin acción técnica sobre cada cono). Al llegar a la pica se orienta al servidor y ejecuta la acción técnica: en la serie rasa devuelve de primeras con el pie; en la aérea controla con el pecho y devuelve de volea antes del bote. Después rodea la pica por la cara opuesta al servidor (girando el cuerpo, sin backpedal), repite la acción en el otro lado y regresa con desplazamiento lateral siguiendo de nuevo la línea de conos.",
    "leyenda": "Conos planos: solo delimitan el recorrido lateral · Pica alta: punto de giro · Servidor enfrente · Raso: devolución de primeras · Aéreo: pecho + volea sin bote"
  },
  "detalle": {
    "objetivos": [
      "Integrar coordinación lateral y ejecución técnica sin pausa excesiva.",
      "Mantener orientación hacia el servidor después de cambios de dirección.",
      "Mejorar devolución rasa de primeras.",
      "Mejorar control de pecho y devolución aérea sin bote.",
      "Reorientar el cuerpo después de rodear un obstáculo.",
      "Mantener calidad técnica después de trabajo rápido de pies."
    ],
    "claves_entrenador": [
      "«Desplázate lateral junto a la línea de conos».",
      "«Los conos solo te marcan el recorrido; no tienes que saltarlos ni entrar entre ellos».",
      "«Mira el balón y al servidor».",
      "«Al llegar a la pica, abre el cuerpo al servidor».",
      "«Raso: devuelve de primeras».",
      "«Después de jugar, rodea la pica; no te quedes parado».",
      "«Rodea, gira y vuelve a aparecer de frente».",
      "«No vuelvas corriendo de espaldas».",
      "«Pecho: amortigua y deja el balón delante».",
      "«Después del pecho, volea antes del bote».",
      "«Al terminar, vuelve lateral siguiendo la línea de conos»."
    ],
    "montaje": [
      "Una fila de varios conos planos por calle.",
      "Una pica alta al final de la zona de desplazamiento.",
      "Un servidor enfrente con balones.",
      "Varias calles funcionan en paralelo.",
      "F7: 4-5 conos planos separados 0.8-1.2 m; pica 1.5-2 m después del último cono; servidor a 4-6 m.",
      "F11: 4-6 conos planos separados 1-1.3 m; pica 1.5-2.5 m después; servidor a 5-7 m."
    ],
    "desarrollo": [
      "El jugador parte en un extremo de la línea de conos.",
      "Se desplaza lateralmente paralelo a esa línea; los conos actúan como referencia del recorrido.",
      "Al llegar a la zona de la pica se abre para ver al servidor.",
      "Serie raso: el servidor pasa raso al Lado A y el jugador devuelve de primeras.",
      "Nada más devolver, inicia una curva alrededor de la pica por la cara opuesta al servidor.",
      "Sale por el Lado B, vuelve a orientarse al servidor y repite la devolución de primeras.",
      "Serie aérea: el servidor lanza alto; el jugador amortigua con el pecho y devuelve de volea antes del bote.",
      "Rodea la pica y repite pecho + volea en el otro lado.",
      "Finaliza regresando con desplazamiento lateral junto a la línea de conos."
    ],
    "que_buscamos": [
      "Recibir y jugar rápido después de un ajuste lateral.",
      "Reorientarse hacia el balón tras perder momentáneamente la referencia visual.",
      "Jugar de primeras en espacios cortos.",
      "Controlar un balón alto con el pecho y dar continuidad inmediata.",
      "Mejorar apoyos y perfil corporal antes de intervenir."
    ],
    "que_observar": [
      "Que el desplazamiento junto a los conos sea lateral y no carrera frontal.",
      "Que no se invente una tarea sobre los conos: no saltarlos, no bordearlos uno por uno.",
      "Que el jugador no mire al suelo constantemente.",
      "Que llegue a la acción técnica equilibrado.",
      "Que el rodeo de la pica sea continuo y próximo a la pica.",
      "Que durante el rodeo gire el cuerpo en lugar de hacer backpedal largo.",
      "Que al salir de la pica vuelva a quedar orientado al servidor.",
      "En raso: precisión en la devolución de primeras.",
      "En alto: pecho suave, balón delante y volea antes del bote.",
      "Que después de la segunda devolución complete el retorno lateral."
    ],
    "correcciones": [
      "Convertir la zona de conos en una escalera de coordinación que no aparece en el vídeo.",
      "Saltar los conos o entrar y salir entre ellos sin que forme parte del ejercicio.",
      "Correr frontalmente en vez de desplazarse lateralmente.",
      "Mirar solo al suelo.",
      "Pararse después de devolver.",
      "Dar una vuelta demasiado grande alrededor de la pica.",
      "Hacer toda la vuelta de espaldas en vez de girar alrededor.",
      "Salir del rodeo sin volver a mirar al servidor.",
      "En el aéreo, dejar botar el balón después del pecho.",
      "Golpear la volea antes de haber amortiguado correctamente con el pecho."
    ],
    "reglas": [
      "El GIF reproduce la secuencia visible: conos ida + acción Lado A + rodeo pica + acción Lado B + conos vuelta.",
      "La línea de conos solo delimita el recorrido lateral; no es una tarea de coordinación específica.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase.",
      "Para Alevín no se añade más volumen si pierde precisión, equilibrio o control de pecho."
    ],
    "si_sale_mal": [
      "Separar el ejercicio: primero solo conos + rodeo de pica sin balón.",
      "Después añadir únicamente raso.",
      "En la serie aérea permitir pecho + bote + pase antes de exigir pecho + volea sin bote.",
      "Reducir separación de conos y velocidad.",
      "Acercar el servidor."
    ],
    "si_sale_bien": [
      "Alternar raso y alto sin avisar, solo cuando la técnica sea estable.",
      "Exigir pierna concreta en cada lado.",
      "Aumentar ligeramente el ritmo de los apoyos.",
      "Reducir el tiempo entre salida de pica y servicio."
    ],
    "variantes": [
      "Fútbol 7: 3 calles de 5 jugadores. Por calle: 1 servidor, 1 activo y 3 esperan; rotar servidor. · 8-10 min.",
      "Fútbol 11: 3-4 calles de 5-6 jugadores. · 10-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7576300381098085655.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El montaje combina una fila de conos planos y una pica alta por calle de trabajo.",
        "Hay un servidor frente al jugador activo con balones.",
        "La línea de conos planos funciona como referencia/delimitación del desplazamiento lateral.",
        "En esa zona no se observa que salte los conos, los bordee uno por uno ni haga un patrón de pies entre ellos.",
        "Al llegar a la zona de pica, el jugador se orienta hacia el servidor para intervenir con balón.",
        "Se observa una devolución de balón raso con el pie, ejecutada de primeras.",
        "Después de la intervención el jugador rodea la pica para aparecer por el lado contrario.",
        "En la forma aérea el servidor envía el balón alto: el jugador controla con el pecho y devuelve de volea sin que bote.",
        "El audio del vídeo tiene música de fondo y no permite extraer instrucciones fiables del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-DOBLE-DEVOLUCION-PICA-RETORNO-CONOS-V2/CampoBase_Doble_Devolucion_Pica_Retorno_Conos_V2.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-DOBLE-DEVOLUCION-PICA-RETORNO-CONOS-V2/frames/f",
    "total": 199,
    "frameMs": 120
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-DOBLE-DEVOLUCION-PICA-RETORNO-CONOS-V2/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-RODILLAS-ALTAS-LATERALES-ZIGZAG-COD-SPRINT",
  "nombre": "Rodillas altas laterales + zigzag de cambios de dirección y sprint",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Agilidad",
      "Rodillas altas laterales",
      "Cambio de dirección",
      "Aceleración",
      "Velocidad",
      "Coordinación",
      "Desplazamiento lateral"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 módulos de 5 jugadores. Cada módulo con 2 calles espejo: trabajan 2 a la vez y 3 esperan."
    },
    "material": "Por calle: 4 discos/setas + 3 conos altos. Sin balón.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador parte junto al extremo exterior de los cuatro discos/setas."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Recorre lateralmente la línea de discos con rodillas altas, sin convertir el inicio en carrera frontal."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Al salir del último disco, acelera en diagonal hacia el primer cono."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Llega al primer cono y cambia de dirección sin tocarlo con la mano."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Corre en diagonal hacia el segundo cono y vuelve a cambiar de dirección."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Corre en diagonal hacia el tercer cono y realiza el último cambio de dirección."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Desde el tercer cono acelera recto durante el tramo final de 5 m."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Sale del recorrido y vuelve andando por fuera para no cruzarse con quien está ejecutando."
        }
      ],
    "explicacion_breve": "Dos jugadores realizan simultáneamente el mismo ejercicio en calles espejo y sin balón. Cada uno parte junto a una fila de 4 discos/setas y hace rodillas altas con desplazamiento lateral hacia el interior. Al terminar los discos sale en diagonal hacia el primer cono naranja, cambia de dirección sin tocarlo, continúa en zigzag por un segundo y un tercer cono, y tras el tercero acelera en línea recta durante 5 m. Vuelve andando por fuera para no cruzarse con quien ejecuta.",
    "leyenda": "Discos/setas: rodillas altas laterales · Conos: cambios de dirección (sin tocar) · Tramo final: sprint recto de 5 m"
  },
  "detalle": {
    "objetivos": [
      "Coordinar rodillas altas con desplazamiento lateral.",
      "Mejorar la capacidad de frenar y reorientar el cuerpo en cambios de dirección.",
      "Encadenar coordinación, cambio de dirección y aceleración sin pausas innecesarias.",
      "Mejorar la calidad del primer paso después de cada cambio de dirección."
    ],
    "claves_entrenador": [
      "«Rodillas arriba y cuerpo estable en los discos».",
      "«Al salir, ataca el primer cono».",
      "«No toques el cono: llega, apoya y cambia».",
      "«Baja el centro de gravedad antes de cambiar de dirección».",
      "«Después del último cono, acelera de verdad los 5 metros».",
      "«Lateral, no frontal».",
      "«Frena antes del cono».",
      "«Apoya fuera y sal».",
      "«Primer paso rápido».",
      "«Último cono y sprint».",
      "«No cruces los pies en los discos».",
      "«No llegues erguido al giro».",
      "«No rodees el cono: cambia y sal».",
      "«No frenes después del último cono»."
    ],
    "montaje": [
      "Montar dos calles espejo si se quiere reproducir exactamente el vídeo.",
      "En cada calle colocar 4 discos/setas en línea transversal para iniciar el desplazamiento lateral.",
      "Desde el final de los discos, colocar el primer cono a 2 m en diagonal (dato visible en el gráfico).",
      "Colocar un segundo y un tercer cono formando el zigzag de cambios de dirección.",
      "Desde el tercer cono dejar 5 m rectos para la aceleración final (dato visible en el gráfico).",
      "Las distancias entre conos intermedios no aparecen confirmadas en el vídeo."
    ],
    "desarrollo": [
      "El jugador parte junto al extremo exterior de los cuatro discos/setas.",
      "Recorre lateralmente la línea de discos con rodillas altas, sin convertir el inicio en carrera frontal.",
      "Al salir del último disco, acelera en diagonal hacia el primer cono.",
      "Llega al primer cono y cambia de dirección sin tocarlo con la mano.",
      "Corre en diagonal hacia el segundo cono y vuelve a cambiar de dirección.",
      "Corre en diagonal hacia el tercer cono y realiza el último cambio de dirección.",
      "Desde el tercer cono acelera recto durante el tramo final de 5 m.",
      "Sale del recorrido y vuelve andando por fuera para no cruzarse con quien está ejecutando."
    ],
    "que_buscamos": [
      "Ajustes laterales antes de acelerar.",
      "Cambios de orientación corporal para responder a un rival o a un balón dividido.",
      "Reaceleración después de una frenada o cambio de trayectoria.",
      "Desplazamientos defensivos y transiciones cortas que exigen volver a acelerar."
    ],
    "que_observar": [
      "Que el desplazamiento inicial sea realmente lateral.",
      "Que las rodillas suban sin perder control del tronco.",
      "Que el jugador no toque el primer cono con la mano.",
      "Que desacelere antes del cono y no después de sobrepasarlo.",
      "Que el apoyo permita salir en la nueva dirección con el primer paso rápido.",
      "Que no haga curvas amplias alrededor de los conos.",
      "Que la aceleración final sea recta y progresiva.",
      "Que ambos jugadores de las calles espejo no invadan la calle central ni se crucen."
    ],
    "correcciones": [
      "Cruzar los pies o girar el cuerpo demasiado pronto durante las rodillas altas laterales.",
      "Llegar al cono demasiado erguido y necesitar varios pasos para cambiar de dirección.",
      "Rodear el cono en curva en lugar de frenar, apoyar y salir.",
      "Tocar el primer cono por interpretar literalmente el texto «Touch» del gráfico.",
      "Perder velocidad entre el último cambio de dirección y el sprint final."
    ],
    "reglas": [
      "El GIF reproduce una sola ejecución mostrada en dos calles espejo; no hay variantes reales.",
      "El primer cono NO se toca con la mano (aclaración de Migue); el texto «Touch» del gráfico no es una orden de tocar.",
      "Las distancias entre conos intermedios no están confirmadas en el vídeo.",
      "Los tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Separar el ejercicio en dos: primero rodillas altas laterales y después zigzag.",
      "Reducir distancia entre conos y trabajar el cambio de dirección a velocidad media.",
      "Hacer una pausa breve de control en cada cono antes de volver a unir el recorrido.",
      "Bajar a 2 repeticiones por serie si la ejecución se deteriora."
    ],
    "si_sale_bien": [
      "Aumentar progresivamente la velocidad sin cambiar el recorrido.",
      "Mantener el mismo montaje y pedir salida más explosiva de cada cono.",
      "Añadir una señal visual de salida solo como progresión CampoBase.",
      "Cronometrar únicamente si no provoca pérdida de calidad técnica."
    ],
    "variantes": [
      "Fútbol 7: 3 módulos de 5 jugadores. Cada módulo con 2 calles espejo; trabajan 2 y esperan 3. · 6-8 min.",
      "Fútbol 11: 4 módulos de 4-6 jugadores. Dos calles espejo por módulo. · 7-10 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7577678918702943510.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Dos jugadores realizan simultáneamente el mismo ejercicio en calles espejo y sin balón.",
        "Cada jugador comienza junto a una fila de cuatro discos/setas y realiza rodillas altas con desplazamiento lateral.",
        "Al terminar los discos, cada jugador sale en diagonal hacia el primer cono naranja de su calle.",
        "En el primer cono cambia de dirección sin tocarlo físicamente.",
        "Continúa en zigzag hacia un segundo cono y después hacia un tercer cono.",
        "Tras el tercer cono acelera en línea recta hacia delante.",
        "El gráfico inicial del vídeo muestra 2 m entre la salida de los discos y el primer cono, y 5 m de tramo final.",
        "No se observan variantes distintas: es una sola ejecución mostrada en espejo.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-RODILLAS-ALTAS-LATERALES-ZIGZAG-COD-SPRINT/CampoBase_Rodillas_Altas_Laterales_Zigzag_Cambios_Direccion_Sprint_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-RODILLAS-ALTAS-LATERALES-ZIGZAG-COD-SPRINT/frames/f",
    "total": 89,
    "frameMs": 79
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-RODILLAS-ALTAS-LATERALES-ZIGZAG-COD-SPRINT/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-DESPLAZAMIENTO-LATERAL-PROGRESIVO-PASILLO",
  "nombre": "Desplazamiento lateral progresivo en pasillo con cambios de apoyo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Agilidad",
      "Desplazamiento lateral",
      "Velocidad de pies",
      "Cambios de apoyo",
      "Coordinación",
      "Aceleración"
    ],
    "tiempo_estimado_15": "7-9 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 pasillos de 5 jugadores. Trabaja 1 jugador por pasillo y los demás esperan fuera de la trayectoria."
    },
    "material": "Conos/discos verdes formando dos hileras paralelas. Sin balón.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador parte junto a uno de los laterales del pasillo, orientado hacia el fondo."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Inicia un desplazamiento lateral rápido hacia la hilera contraria."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Al llegar al lateral opuesto, apoya, frena lo necesario y cambia la dirección sin girarse para correr de espaldas."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Cruza lateralmente hacia el otro lado mientras gana terreno hacia delante."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Repite el patrón de lado a lado, alternando los cambios de apoyo y avanzando por el pasillo."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Mantiene el tronco principalmente orientado al frente y usa los conos como referencias."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Al terminar el pasillo, sale hacia delante y abandona la zona de trabajo."
        }
      ],
    "explicacion_breve": "Un jugador realiza el ejercicio sin balón dentro de un pasillo delimitado por dos hileras paralelas de conos/discos verdes. Comienza junto a un lateral, orientado hacia delante, y se desplaza lateralmente de una hilera a la otra mientras progresa hacia el fondo. En cada llegada lateral realiza un cambio de apoyo/dirección y vuelve a cruzar el pasillo hacia el lado contrario, alternando derecha e izquierda. Los conos funcionan como referencia espacial, sin contacto deliberado. Al completar el pasillo sale hacia delante.",
    "leyenda": "Conos/discos verdes: referencias del pasillo · Desplazamiento lateral alternando lados · Progresión hacia delante · Salida frontal"
  },
  "detalle": {
    "objetivos": [
      "Mejorar la rapidez de pies en desplazamientos laterales.",
      "Coordinar frenada, apoyo y reimpulso hacia el lado contrario.",
      "Mantener control postural durante cambios laterales repetidos.",
      "Encadenar desplazamiento lateral y progresión hacia delante sin perder fluidez."
    ],
    "claves_entrenador": [
      "«Cuerpo mirando al frente».",
      "«Pies rápidos y pasos cortos».",
      "«Llega al lateral, apoya y vuelve a salir».",
      "«Avanza con cada cambio, no te quedes en el mismo sitio».",
      "«Los conos son referencia: no hace falta tocarlos».",
      "«Lateral».",
      "«Baja para cambiar».",
      "«Apoya y sal».",
      "«Sigue avanzando».",
      "«Último cambio y sal de frente».",
      "«No te gires».",
      "«No juntes los pies».",
      "«No hagas pasos enormes».",
      "«Cabeza arriba»."
    ],
    "montaje": [
      "Formar un pasillo con dos hileras paralelas de conos/discos.",
      "Mantener suficientes referencias longitudinales para alternar lado derecho e izquierdo mientras se progresa.",
      "Dejar espacio libre después del final del pasillo para la salida frontal.",
      "El vídeo no confirma medidas exactas; las distancias F7/F11 son adaptación CampoBase."
    ],
    "desarrollo": [
      "El jugador parte junto a uno de los laterales del pasillo, orientado hacia el fondo.",
      "Inicia un desplazamiento lateral rápido hacia la hilera contraria.",
      "Al llegar al lateral opuesto, apoya, frena lo necesario y cambia la dirección sin girarse para correr de espaldas.",
      "Cruza lateralmente hacia el otro lado mientras gana terreno hacia delante.",
      "Repite el patrón de lado a lado, alternando los cambios de apoyo y avanzando por el pasillo.",
      "Mantiene el tronco principalmente orientado al frente y usa los conos como referencias.",
      "Al terminar el pasillo, sale hacia delante y abandona la zona de trabajo."
    ],
    "que_buscamos": [
      "Ajustes defensivos laterales manteniendo el cuerpo orientado al juego.",
      "Correcciones de posición ante cambios de dirección del rival.",
      "Pequeños desplazamientos de cobertura y basculación.",
      "Reaceleración después de un apoyo lateral."
    ],
    "que_observar": [
      "Que el cuerpo permanezca principalmente orientado hacia delante.",
      "Que el desplazamiento sea lateral y no se convierta en carrera diagonal convencional.",
      "Que el jugador no junte los pies en el cambio.",
      "Que los apoyos sean cortos y controlados, con centro de gravedad estable.",
      "Que progrese hacia delante con cada alternancia.",
      "Que no toque ni pise los conos.",
      "Que la salida final no provoque un giro descontrolado."
    ],
    "correcciones": [
      "Girar completamente el cuerpo hacia el lado de desplazamiento.",
      "Cruzar los pies de forma excesiva y perder estabilidad.",
      "Dar pasos demasiado largos y lentos.",
      "Quedarse desplazándose de lado a lado sin avanzar por el pasillo.",
      "Llegar demasiado erguido al lateral y necesitar varios apoyos para volver.",
      "Pisar o desplazar los conos."
    ],
    "reglas": [
      "El GIF reproduce una única ejecución; no hay variantes reales.",
      "Los conos son referencias espaciales, no se tocan ni se pisan.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase.",
      "El texto superpuesto del vídeo («LATERAL MOVEMENT», «DRILL FOR FASTER FEET») no se reproduce en la ficha."
    ],
    "si_sale_mal": [
      "Acortar el pasillo y reducir el número de cambios.",
      "Reducir la anchura para facilitar el desplazamiento.",
      "Trabajar primero dos cambios de lado y parar.",
      "Bajar la velocidad hasta controlar la postura y los apoyos."
    ],
    "si_sale_bien": [
      "Aumentar gradualmente la velocidad manteniendo el mismo patrón.",
      "Aumentar ligeramente la anchura del pasillo como progresión CampoBase.",
      "Añadir una señal visual de salida frontal al final como progresión CampoBase.",
      "Cronometrar solo si no altera la calidad técnica."
    ],
    "variantes": [
      "Fútbol 7: 3 pasillos de 5 jugadores. Trabaja 1 jugador por pasillo. · 7-9 min.",
      "Fútbol 11: 4 pasillos de 4-6 jugadores. Un ejecutante por pasillo, con entradas alternas. · 8-11 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7578606570053930262.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Un jugador realiza el ejercicio sin balón dentro de un pasillo delimitado por dos hileras paralelas de conos/discos verdes.",
        "Comienza junto al lateral derecho del pasillo, orientado principalmente hacia delante.",
        "Se desplaza lateralmente de una hilera a la otra mientras progresa hacia el fondo.",
        "En cada llegada lateral realiza un cambio de apoyo/dirección y vuelve a cruzar el pasillo.",
        "No se observa un contacto deliberado con los conos; funcionan como referencia espacial.",
        "Al completar el pasillo, el jugador sale hacia delante.",
        "El texto superpuesto del vídeo indica «LATERAL MOVEMENT» y «DRILL FOR FASTER FEET».",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-DESPLAZAMIENTO-LATERAL-PROGRESIVO-PASILLO/CampoBase_Desplazamiento_Lateral_Progresivo_Pasillo_Cambios_Apoyo_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-DESPLAZAMIENTO-LATERAL-PROGRESIVO-PASILLO/frames/f",
    "total": 105,
    "frameMs": 60
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-DESPLAZAMIENTO-LATERAL-PROGRESIVO-PASILLO/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3",
  "nombre": "Reacción con giro inicial, señales laterales, toque de cono y balón final",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Reacción",
      "Agilidad",
      "Desplazamiento lateral",
      "Orientación corporal",
      "Velocidad de pies",
      "Cambio de nivel",
      "Estímulo visual"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 15,
      "organizacion": "Dos filas equilibradas (7 y 8 jugadores) a ambos lados del material central."
    },
    "material": "Conos/discos naranjas y balones en una línea central entre las dos filas.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Los jugadores se colocan en dos filas horizontales a ambos lados de la línea central, de espaldas a conos y balones."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Con la indicación «giramos», se giran UNA SOLA VEZ hacia el material central."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Desde ese momento permanecen orientados hacia el centro durante toda la repetición."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "El entrenador va dando señales de izquierda, derecha y tocar cono."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "En «izquierda» cada jugador se desplaza hacia su propia izquierda y queda preparado allí para la siguiente señal."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "En «derecha» cada jugador se desplaza hacia su propia derecha y queda preparado allí."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "No hay un retorno automático al punto anterior: la siguiente orden determina el siguiente movimiento."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "En «tocar cono», el jugador baja y toca la referencia naranja con la mano; se reincorpora y continúa orientado hacia el centro."
        },
        {
          "nombre": "Paso 9",
          "instruccion": "La señal final es «coger balón»: el jugador baja y coge el balón con la mano."
        },
        {
          "nombre": "Paso 10",
          "instruccion": "Al coger el balón termina la repetición."
        }
      ],
    "explicacion_breve": "Los jugadores parten en dos filas horizontales a ambos lados de una línea central de conos y balones, de espaldas al material. Con la indicación «giramos» se giran UNA sola vez hacia el material y permanecen de frente al centro durante toda la repetición. El entrenador va dando señales de izquierda, derecha y tocar cono: en izquierda/derecha se desplazan lateralmente y se quedan donde termina la señal (sin retorno automático); en tocar cono bajan, tocan la referencia naranja con la mano y se reincorporan. La señal final es coger el balón con la mano, que termina la repetición.",
    "leyenda": "Conos/discos naranjas y balones en línea central · Giro inicial único · Señales izquierda/derecha/tocar cono · Coger balón = fin"
  },
  "detalle": {
    "objetivos": [
      "Mejorar la velocidad de reacción ante señales.",
      "Trabajar desplazamientos laterales encadenados sin anticipación.",
      "Mejorar orientación corporal tras un giro inicial.",
      "Coordinar desplazamiento lateral, cambio de nivel y acción manual.",
      "Mantener atención hasta la señal final."
    ],
    "claves_entrenador": [
      "«De espaldas al material».",
      "«Esperad la señal».",
      "«Giramos».",
      "«Izquierda».",
      "«Derecha».",
      "«Tocar cono».",
      "«Coger balón».",
      "«No vuelvas al centro si no te lo pido».",
      "«Quédate donde termina la señal».",
      "«Después del cono sigues de frente».",
      "«Balón cogido: termina»."
    ],
    "montaje": [
      "Dos filas horizontales, una a cada lado de la línea central de material.",
      "Jugadores de espaldas al material al inicio.",
      "Conos/discos y balones en medio.",
      "Espacio lateral suficiente para desplazarse a izquierda y derecha."
    ],
    "desarrollo": [
      "Los jugadores se colocan en dos filas horizontales a ambos lados de la línea central, de espaldas a conos y balones.",
      "Con la indicación «giramos», se giran UNA SOLA VEZ hacia el material central.",
      "Desde ese momento permanecen orientados hacia el centro durante toda la repetición.",
      "El entrenador va dando señales de izquierda, derecha y tocar cono.",
      "En «izquierda» cada jugador se desplaza hacia su propia izquierda y queda preparado allí para la siguiente señal.",
      "En «derecha» cada jugador se desplaza hacia su propia derecha y queda preparado allí.",
      "No hay un retorno automático al punto anterior: la siguiente orden determina el siguiente movimiento.",
      "En «tocar cono», el jugador baja y toca la referencia naranja con la mano; se reincorpora y continúa orientado hacia el centro.",
      "La señal final es «coger balón»: el jugador baja y coge el balón con la mano.",
      "Al coger el balón termina la repetición."
    ],
    "que_buscamos": [
      "Reaccionar a cambios de dirección sucesivos.",
      "Ajustar la posición lateral sin volver siempre a un punto neutro.",
      "Cambiar rápidamente de orientación y mantenerla.",
      "Procesar estímulos consecutivos antes de ejecutar."
    ],
    "que_observar": [
      "Que el giro solo ocurra al principio.",
      "Que después del giro mantengan la orientación hacia el material.",
      "Que izquierda/derecha se ejecuten respecto al propio jugador.",
      "Que no introduzcan ida y vuelta por iniciativa propia.",
      "Que tocar cono sea una bajada/toque y continuación.",
      "Que coger balón sea la acción final."
    ],
    "correcciones": [
      "Volver a girarse en mitad de la repetición.",
      "Regresar automáticamente al punto de salida después de izquierda/derecha.",
      "Volver de espaldas después de tocar cono.",
      "Confundir tocar balón con cogerlo.",
      "Seguir después de haber cogido el balón."
    ],
    "reglas": [
      "El giro («giramos») ocurre SOLO al principio de cada repetición.",
      "Después del giro no vuelven a girarse durante esa repetición.",
      "Izquierda/derecha no implican ida y vuelta automática.",
      "Tocar cono no implica volver de espaldas ni retorno.",
      "Coger balón es la señal final y termina la repetición.",
      "Los tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir el número de señales laterales.",
      "Separar primero giro inicial y desplazamientos laterales.",
      "Añadir el cono cuando ya mantienen la posición entre señales.",
      "Dejar el balón únicamente como señal final."
    ],
    "si_sale_bien": [
      "Aumentar la velocidad de las señales.",
      "Hacer más imprevisible el orden izquierda/derecha/cono.",
      "Mantener siempre la lógica de una sola vuelta inicial y balón final."
    ],
    "variantes": [
      "Fútbol 7: dos filas equilibradas (7 y 8 jugadores) a ambos lados del material central. · 6-8 min.",
      "Fútbol 11: dos filas equilibradas de 8-11 jugadores a ambos lados del material central. · 7-10 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7578901009016065303.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El vídeo muestra varias repeticiones del mismo ejercicio con reinicio entre ellas.",
        "En cada repetición los jugadores parten en dos filas horizontales a ambos lados de una línea central de conos y balones.",
        "Al inicio de cada repetición los jugadores están de espaldas al material central.",
        "Después del inicio se giran una vez hacia el material y permanecen de frente al centro.",
        "Las señales visuales incluyen izquierda, derecha, referencia naranja y balón.",
        "En la señal naranja los jugadores bajan hacia la referencia y continúan la secuencia.",
        "En la señal de balón los jugadores cogen el balón y la repetición termina.",
        "El audio del vídeo tiene música de fondo y no permite extraer instrucciones fiables."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3/CampoBase_Reaccion_Giro_Inicial_Senales_Laterales_Cono_Balon_V3.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3/frames/f",
    "total": 142,
    "frameMs": 73
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-ZIGZAG-CENTRAL-LATERAL-ALTERNADO",
  "nombre": "Zigzag fijo entre conos centrales y laterales alternados",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Agilidad",
      "Cambios de dirección",
      "Zigzag",
      "Desplazamiento",
      "Progresión hacia delante",
      "Sin señales"
    ],
    "tiempo_estimado_15": "7-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "2-3 carriles iguales para que trabajen 5-7 jugadores por carril según espacio."
    },
    "material": "Conos/discos blancos en el eje central y conos/discos naranjas a ambos lados, alternados. Sin balón.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador empieza en la primera referencia blanca central."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Se desplaza hacia la referencia naranja lateral del primer lado."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Desde ahí enlaza con la siguiente referencia blanca central."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Continúa hacia la referencia naranja del lado contrario."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Vuelve a enlazar con el siguiente cono blanco central."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Repite la alternancia central–lateral–central mientras progresa hacia delante."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Al completar la última referencia, sale del recorrido."
        }
      ],
    "explicacion_breve": "El jugador avanza encadenando cambios de dirección en un recorrido fijo, sin señales del entrenador. Hay una línea central de conos/discos blancos y, a ambos lados, conos/discos naranjas colocados de forma alternada. El patrón es: blanco central → naranja lateral → siguiente blanco central → naranja del lado contrario → siguiente blanco central, y así sucesivamente hasta salir.",
    "leyenda": "Conos blancos: eje central · Conos naranjas: laterales alternados · Recorrido fijo en zigzag · Sin señales"
  },
  "detalle": {
    "objetivos": [
      "Mejorar cambios de dirección encadenados.",
      "Mejorar la coordinación de apoyos en recorrido zigzagueante.",
      "Trabajar agilidad y control corporal mientras se progresa hacia delante."
    ],
    "claves_entrenador": [
      "«Sigue el recorrido marcado».",
      "«Central, lateral, central».",
      "«Alterna un lado y el otro».",
      "«Avanza sin pararte».",
      "«Cambia».",
      "«Sigue».",
      "«Al otro lado».",
      "«Ahora central».",
      "«Continúa hasta salir».",
      "«No te cruces de más».",
      "«Apoyos cortos».",
      "«Controla el cuerpo».",
      "«Mantén el ritmo»."
    ],
    "montaje": [
      "Una línea central de conos/discos blancos.",
      "Conos/discos naranjas laterales alternados a izquierda y derecha del eje central.",
      "Espacio suficiente para progresar hacia delante enlazando cada referencia.",
      "Las distancias exactas no se dan por confirmadas; las medidas F7/F11 son adaptación CampoBase."
    ],
    "desarrollo": [
      "El jugador empieza en la primera referencia blanca central.",
      "Se desplaza hacia la referencia naranja lateral del primer lado.",
      "Desde ahí enlaza con la siguiente referencia blanca central.",
      "Continúa hacia la referencia naranja del lado contrario.",
      "Vuelve a enlazar con el siguiente cono blanco central.",
      "Repite la alternancia central–lateral–central mientras progresa hacia delante.",
      "Al completar la última referencia, sale del recorrido."
    ],
    "que_buscamos": [
      "Cambiar de dirección varias veces manteniendo el control del cuerpo.",
      "Mejorar apoyos y reajustes mientras se avanza.",
      "Trabajar la capacidad de enlazar referencias espaciales con rapidez."
    ],
    "que_observar": [
      "Que el jugador siga el orden correcto de referencias.",
      "Que alterne realmente un lado y el otro.",
      "Que mantenga la progresión hacia delante.",
      "Que no convierta el ejercicio en una carrera recta ignorando el zigzag.",
      "Que los apoyos sean controlados en cada cambio de dirección."
    ],
    "correcciones": [
      "Saltarse una referencia central.",
      "Ir dos veces seguidas al mismo lado.",
      "Perder la progresión hacia delante.",
      "Tomar trayectorias demasiado abiertas o descontroladas."
    ],
    "reglas": [
      "No hay señales del entrenador durante la ejecución; el recorrido es fijo.",
      "El patrón es blanco central → naranja lateral → siguiente blanco central → naranja del lado contrario.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir el número de cambios.",
      "Usar menos referencias al principio.",
      "Bajar la velocidad de ejecución."
    ],
    "si_sale_bien": [
      "Aumentar ligeramente la velocidad manteniendo el mismo patrón.",
      "Añadir más referencias al recorrido como adaptación CampoBase.",
      "Cronometrar solo si no altera la calidad del zigzag."
    ],
    "variantes": [
      "Fútbol 7: 2-3 carriles iguales para que trabajen 5-7 jugadores por carril. · 7-10 min.",
      "Fútbol 11: 3-4 carriles del mismo recorrido. · 8-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7589293268974783766.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El vídeo muestra varias repeticiones del mismo ejercicio.",
        "Hay una línea central de conos/discos blancos.",
        "A ambos lados aparecen conos/discos naranjas colocados de forma alternada.",
        "El jugador avanza encadenando cambios de dirección en un recorrido fijo.",
        "No se observan señales del entrenador que cambien la trayectoria durante la ejecución.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-ZIGZAG-CENTRAL-LATERAL-ALTERNADO/CampoBase_Zigzag_Central_Lateral_Alternado_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-ZIGZAG-CENTRAL-LATERAL-ALTERNADO/frames/f",
    "total": 120,
    "frameMs": 60
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-ZIGZAG-CENTRAL-LATERAL-ALTERNADO/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-PASES-HASTA-SENAL-VALLAS-SPRINT-FINAL",
  "nombre": "Pases continuos hasta señal, salto de mini vallas y sprint final",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Pase corto",
      "Saltos",
      "Mini vallas",
      "Sprint",
      "Rotación continua",
      "Aceleración"
    ],
    "tiempo_estimado_15": "7-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "2-3 carriles iguales, con cola por carril y un apoyo fijo o rotativo."
    },
    "material": "Balón en la zona de inicio, conos rojos de salida, mini vallas blancas y cono final amarillo.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "En la salida, el apoyo y el jugador activo se pasan el balón de forma continua."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Mantienen esos pases hasta la señal del entrenador."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Cuando llega la señal, sale el jugador que estaba pasando."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Sale sin balón hacia la zona de mini vallas."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Salta por encima de las mini vallas, una tras otra, avanzando hacia delante."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Al superar la última valla, acelera y hace sprint hasta el cono final."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Cuando termina, se coloca al final de la cola."
        }
      ],
    "explicacion_breve": "En la zona inicial, el apoyo y el jugador activo se pasan el balón de forma continua hasta la señal del entrenador. Cuando llega la señal, sale el jugador que estaba pasando, continúa sin balón y salta por encima de las mini vallas, una tras otra. Al superar la última valla acelera y hace sprint hasta el cono final. Al terminar, se coloca al final de la cola.",
    "leyenda": "Balón: pases continuos en la salida · Mini vallas: salto · Cono final: sprint · Vuelta al final de la cola"
  },
  "detalle": {
    "objetivos": [
      "Encadenar una activación técnica de pase con una tarea coordinativa y una aceleración final.",
      "Mejorar la transición rápida entre acción con balón y acción sin balón.",
      "Trabajar coordinación de apoyos, saltos y sprint."
    ],
    "claves_entrenador": [
      "«Pases continuos».",
      "«A la señal sale el pasador».",
      "«Después vallas y sprint al cono».",
      "«Sigue pasando».",
      "«¡Ya!».",
      "«Sin balón».",
      "«Salta arriba».",
      "«Sprint final».",
      "«No te pares después del pase».",
      "«Salta por encima».",
      "«Acelera hasta el cono».",
      "«Al terminar, vuelve a la cola»."
    ],
    "montaje": [
      "Varios carriles paralelos.",
      "Cola de jugadores en la salida.",
      "Un apoyo o compañero en la zona de pase.",
      "Mini vallas alineadas en progresión.",
      "Cono final al fondo del carril.",
      "Las distancias exactas se adaptan en F7/F11."
    ],
    "desarrollo": [
      "En la salida, el apoyo y el jugador activo se pasan el balón de forma continua.",
      "Mantienen esos pases hasta la señal del entrenador.",
      "Cuando llega la señal, sale el jugador que estaba pasando.",
      "Sale sin balón hacia la zona de mini vallas.",
      "Salta por encima de las mini vallas, una tras otra, avanzando hacia delante.",
      "Al superar la última valla, acelera y hace sprint hasta el cono final.",
      "Cuando termina, se coloca al final de la cola."
    ],
    "que_buscamos": [
      "Pasar rápido de una acción técnica a una acción física intensa.",
      "Mejorar apoyos y frecuencia de pies antes de acelerar.",
      "Activar piernas, atención y ritmo competitivo."
    ],
    "que_observar": [
      "Que la fase inicial sean pases continuos y no un solo pase.",
      "Que la salida la haga el jugador que estaba pasando.",
      "Que después continúe sin balón.",
      "Que salte por encima de las mini vallas.",
      "Que mantenga el sprint hasta el cono final.",
      "Que el jugador que termina se coloque al final de la cola."
    ],
    "correcciones": [
      "Cortar los pases antes de la señal.",
      "Salir el jugador equivocado.",
      "Llevarse el balón a las vallas.",
      "Rodear las vallas en vez de saltarlas.",
      "No volver al final de la cola."
    ],
    "reglas": [
      "Se pasan el balón hasta la señal del entrenador.",
      "Sale el jugador que está pasando.",
      "Después salta las mini vallas sin balón.",
      "Luego hace sprint al cono final.",
      "El que termina se coloca al final de la cola.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir el número de vallas.",
      "Hacer más clara la rotación entre apoyo, activo y cola.",
      "Separar más las zonas."
    ],
    "si_sale_bien": [
      "Aumentar ligeramente la velocidad de pase.",
      "Añadir una valla más como adaptación.",
      "Exigir más intensidad en el sprint final."
    ],
    "variantes": [
      "Fútbol 7: 2-3 carriles iguales, con cola por carril y un apoyo fijo o rotativo. · 7-10 min.",
      "Fútbol 11: 3-4 carriles con apoyo fijo o rotativo. · 8-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7590031982361365782.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Hay varios carriles paralelos con la misma estructura.",
        "En la zona inicial los jugadores se pasan el balón hasta la señal del entrenador.",
        "Cuando llega la señal, sale el jugador que estaba pasando.",
        "Ese jugador continúa sin balón y salta por encima de las mini vallas.",
        "Después hace sprint hasta el cono final.",
        "Al terminar, ese jugador se coloca al final de la cola.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-PASES-HASTA-SENAL-VALLAS-SPRINT-FINAL/CampoBase_Pase_Corto_Salto_Vallas_Sprint_Final_V2.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-PASES-HASTA-SENAL-VALLAS-SPRINT-FINAL/frames/f",
    "total": 146,
    "frameMs": 62
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-PASES-HASTA-SENAL-VALLAS-SPRINT-FINAL/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-CRUZ-DERECHA-IDA-IZQUIERDA-VUELTA-PINCHADA",
  "nombre": "Conducción con cruz: ida por derecha, vuelta por izquierda y pinchada en la intersección",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Conducción",
      "Cambio de dirección",
      "Pinchada",
      "Control orientado",
      "Coordinación"
    ],
    "tiempo_estimado_15": "7-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "2-3 carriles iguales para repartir la cola y mantener ritmo."
    },
    "material": "Balones, cruces marcadas en el suelo y picas amarillas.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador sale conduciendo con balón desde la parte inferior del carril."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Se acerca a la cruz y, en la ida, pasa por la derecha de la cruz."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Al pasar por la intersección de la cruz, hace una pinchada del balón."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Continúa conduciendo hacia delante hasta la pica amarilla."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Gira en la pica para iniciar la vuelta."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "En la vuelta, pasa por la izquierda de la cruz."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Al volver a pasar por la intersección de la cruz, realiza otra pinchada del balón."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Sale del recorrido y se prepara para repetir."
        }
      ],
    "explicacion_breve": "Cada jugador sale conduciendo con balón desde la parte inferior del carril. En la ida pasa por la derecha de la cruz y, al pasar por la intersección, hace una pinchada del balón. Continúa hasta la pica amarilla, gira y vuelve. En la vuelta pasa por la izquierda de la cruz y vuelve a hacer una pinchada en la intersección. Todo el recorrido se hace con balón.",
    "leyenda": "Cruz marcada en el suelo: referencia central · Pica amarilla: punto de giro · Ida por la derecha · Vuelta por la izquierda · Pinchada en la intersección"
  },
  "detalle": {
    "objetivos": [
      "Mejorar la conducción orientada con cambios de trayectoria definidos.",
      "Automatizar la pinchada del balón en un punto concreto.",
      "Coordinar ida y vuelta con referencias distintas en cada fase.",
      "Mejorar control, orientación corporal y precisión en el contacto."
    ],
    "claves_entrenador": [
      "«Sales con balón».",
      "«Ida por la derecha».",
      "«Pinchada en la cruz».",
      "«Giras en la pica y vuelves por la izquierda».",
      "«Derecha en la ida».",
      "«Pincha».",
      "«Gira».",
      "«Izquierda en la vuelta».",
      "«Pincha otra vez».",
      "«No inviertas los lados».",
      "«Pinchada en el centro de la cruz».",
      "«Conduce pegado al recorrido».",
      "«Gira rápido en la pica»."
    ],
    "montaje": [
      "Dos carriles paralelos y simétricos.",
      "Una cruz en cada carril como referencia central.",
      "Una pica amarilla por delante de cada cruz.",
      "Zona de salida con balón en la parte inferior del carril."
    ],
    "desarrollo": [
      "El jugador sale conduciendo con balón desde la parte inferior del carril.",
      "Se acerca a la cruz y, en la ida, pasa por la derecha de la cruz.",
      "Al pasar por la intersección de la cruz, hace una pinchada del balón.",
      "Continúa conduciendo hacia delante hasta la pica amarilla.",
      "Gira en la pica para iniciar la vuelta.",
      "En la vuelta, pasa por la izquierda de la cruz.",
      "Al volver a pasar por la intersección de la cruz, realiza otra pinchada del balón.",
      "Sale del recorrido y se prepara para repetir."
    ],
    "que_buscamos": [
      "Ayuda a proteger y recolocar el balón al cambiar de dirección.",
      "Mejora el control en giros y retornos.",
      "Favorece la precisión en gestos técnicos repetidos con ambas orientaciones."
    ],
    "que_observar": [
      "Que la ida vaya por la derecha de la cruz.",
      "Que la vuelta vaya por la izquierda.",
      "Que haya pinchada del balón en ambas intersecciones.",
      "Que el giro en la pica sea claro y controlado.",
      "Que el balón vaya siempre dominado."
    ],
    "correcciones": [
      "Hacer ida y vuelta por el mismo lado.",
      "Olvidar la pinchada en una de las intersecciones.",
      "Pasar demasiado lejos de la cruz.",
      "Girar abierto en la pica y perder tiempo.",
      "Conducir el balón sin control en la vuelta."
    ],
    "reglas": [
      "Ida siempre por la derecha de la cruz.",
      "Vuelta siempre por la izquierda.",
      "Pinchada del balón en ambas intersecciones.",
      "El recorrido se hace con balón.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir velocidad de conducción.",
      "Separar más la explicación de ida y vuelta.",
      "Trabajar primero solo ida + pinchada y luego añadir la vuelta."
    ],
    "si_sale_bien": [
      "Aumentar ritmo de ejecución.",
      "Pedir más precisión en la pinchada.",
      "Trabajar con ambos perfiles de conducción como adaptación."
    ],
    "variantes": [
      "Fútbol 7: 2-3 carriles iguales para repartir la cola y mantener ritmo. · 7-10 min.",
      "Fútbol 11: 3-4 carriles si el espacio lo permite. · 8-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7591894816011635971.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Hay dos carriles simétricos trabajándose en paralelo.",
        "Cada jugador sale con balón desde la zona inferior del carril.",
        "En cada carril hay una cruz marcada en el suelo y una pica amarilla por delante.",
        "En la ida el jugador pasa por la derecha de la cruz.",
        "En la intersección de la cruz realiza una pinchada del balón.",
        "Continúa hacia la pica, gira y vuelve.",
        "En la vuelta pasa por la izquierda de la cruz y vuelve a pinchar en la intersección.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-CRUZ-DERECHA-IDA-IZQUIERDA-VUELTA-PINCHADA/CampoBase_Cruz_Derecha_Ida_Izquierda_Vuelta_Pinchada_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-CRUZ-DERECHA-IDA-IZQUIERDA-VUELTA-PINCHADA/frames/f",
    "total": 150,
    "frameMs": 60
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-CRUZ-DERECHA-IDA-IZQUIERDA-VUELTA-PINCHADA/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-DEJA-BALON-GIRA-CONO-PASA-SIGUIENTE-COLA",
  "nombre": "Conduce, deja balón, gira cono, vuelve y pasa al siguiente de la cola",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Conducción",
      "Sin balón",
      "Giro de cono",
      "Pase corto",
      "Rotación",
      "Relevo"
    ],
    "tiempo_estimado_15": "8-11 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 carriles de 5 jugadores."
    },
    "material": "Balones, conos intermedios y conos de giro.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador sale conduciendo con balón desde la cola."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Llega al cono intermedio de su carril."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Deja el balón junto a ese cono."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Continúa sin balón hacia el cono de delante."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Gira alrededor de ese cono."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Vuelve al cono donde dejó el balón."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Desde ese cono pasa el balón al siguiente jugador que espera en la cola."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Después se coloca al final de la cola."
        }
      ],
    "explicacion_breve": "Cada jugador sale conduciendo con balón hasta un cono intermedio, donde deja el balón. Continúa sin balón hasta el cono de delante y gira alrededor de él. Vuelve al cono donde dejó el balón y, desde ese mismo cono, pasa el balón al siguiente jugador que espera en la cola. Después se coloca al final de la cola.",
    "leyenda": "Cono intermedio: dejar balón · Cono de delante: giro · Pase desde el cono al siguiente · Final de cola"
  },
  "detalle": {
    "objetivos": [
      "Coordinar conducción, desmarque sin balón y pase de relevo.",
      "Mejorar la transición de una acción con balón a una acción sin balón.",
      "Trabajar orientación y vuelta rápida al punto de pase."
    ],
    "claves_entrenador": [
      "«Conduce hasta el cono».",
      "«Deja el balón».",
      "«Gira el cono de delante y vuelve».",
      "«Pasa al siguiente desde el cono y vas al final».",
      "«Conduce».",
      "«Déjalo».",
      "«Gira».",
      "«Vuelve».",
      "«Pasa».",
      "«Al final».",
      "«Conos rectos por carriles».",
      "«Deja el balón en el cono».",
      "«Rodea bien el cono de giro».",
      "«Pasa desde el cono»."
    ],
    "montaje": [
      "Varios carriles paralelos.",
      "Conos rectos y paralelos entre sí por carriles.",
      "Una cola de jugadores por carril.",
      "Un cono intermedio donde se deja el balón.",
      "Un segundo cono al fondo para girar alrededor."
    ],
    "desarrollo": [
      "El jugador sale conduciendo con balón desde la cola.",
      "Llega al cono intermedio de su carril.",
      "Deja el balón junto a ese cono.",
      "Continúa sin balón hacia el cono de delante.",
      "Gira alrededor de ese cono.",
      "Vuelve al cono donde dejó el balón.",
      "Desde ese cono pasa el balón al siguiente jugador que espera en la cola.",
      "Después se coloca al final de la cola."
    ],
    "que_buscamos": [
      "Mejora la capacidad de soltar el balón y volver a activarse sin él.",
      "Ayuda a enlazar acciones técnicas y desplazamientos rápidos.",
      "Refuerza la precisión del pase corto al compañero siguiente."
    ],
    "que_observar": [
      "Que los conos estén rectos y paralelos entre sí.",
      "Que el balón se deje en el cono intermedio.",
      "Que el giro sea alrededor del cono de delante.",
      "Que la vuelta sea al balón dejado.",
      "Que el pase salga desde el cono al siguiente de la cola.",
      "Que el jugador que termina vaya al final de la cola."
    ],
    "correcciones": [
      "Llevarse el balón al cono de giro.",
      "No rodear claramente el cono de delante.",
      "Conducir el balón hacia el compañero en vez de pasar desde el cono.",
      "Olvidar ir al final de la cola."
    ],
    "reglas": [
      "Conos rectos y paralelos.",
      "Llega con balón al cono y lo deja allí.",
      "Gira alrededor del cono de delante.",
      "Vuelve al balón dejado.",
      "Pasa el balón desde el cono al siguiente de la cola.",
      "El jugador que termina se coloca al final de la cola.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Acortar la distancia al cono de giro.",
      "Rehacer la rotación sin velocidad.",
      "Trabajar primero sin pase y luego añadir el relevo."
    ],
    "si_sale_bien": [
      "Aumentar la velocidad de ejecución.",
      "Exigir más precisión en el pase al siguiente.",
      "Trabajar varios carriles a más ritmo."
    ],
    "variantes": [
      "Fútbol 7: 3 carriles de 5 jugadores. · 8-11 min.",
      "Fútbol 11: 4 carriles de 4-6 jugadores. · 9-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7593006658511555862.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Los conos están colocados en líneas rectas y paralelas entre sí por carriles.",
        "Cada jugador sale con balón hasta un cono intermedio.",
        "En ese cono deja el balón.",
        "Después va sin balón al cono de delante y gira alrededor de ese cono.",
        "Vuelve al cono donde había dejado el balón.",
        "Desde ese mismo cono pasa el balón al siguiente jugador que espera en la cola.",
        "El jugador que termina se coloca al final de la cola.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-DEJA-BALON-GIRA-CONO-PASA-SIGUIENTE-COLA/CampoBase_Deja_Balon_Gira_Cono_Pasa_Siguiente_Cola_V3.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-DEJA-BALON-GIRA-CONO-PASA-SIGUIENTE-COLA/frames/f",
    "total": 150,
    "frameMs": 60
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-DEJA-BALON-GIRA-CONO-PASA-SIGUIENTE-COLA/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-REACCION-PAR-IMPAR-BLANCO-AMARILLO",
  "nombre": "Reacción central por par/impar y color blanco/amarillo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Reacción",
      "Par/impar",
      "Colores",
      "Sin balón",
      "Toma de decisión",
      "Velocidad de respuesta"
    ],
    "tiempo_estimado_15": "7-10 min",
    "jugadores": {
      "total": 14,
      "organizacion": "2 carriles espejo o 2 estaciones iguales."
    },
    "material": "Pica roja central, referencias blancas (delante) y amarillas (detrás). Sin balón.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Se coloca una pareja, un jugador a cada lado de la pica roja central."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Esperan en posición activa con pies cortos, sin tocar la pica."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "El entrenador da una señal: número par, número impar o un color."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Si dice número impar, los dos salen a la referencia amarilla de su lado."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Si dice número par, los dos salen a la referencia blanca de su lado."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Si dice blanco o amarillo, los dos salen directamente a ese color."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Vuelven a la zona central y entra la siguiente pareja."
        }
      ],
    "explicacion_breve": "Trabajan dos jugadores a la vez, uno a cada lado de la pica roja central, sin balón. Esperan en posición activa con pies cortos, sin tocar la pica. Hay referencias blancas hacia delante y amarillas hacia detrás. Si el entrenador dice un número impar, los dos salen hacia amarillo; si dice un número par, salen hacia blanco; si nombra un color, salen directamente a ese color. Después vuelve la pareja y entra la siguiente.",
    "leyenda": "Pica roja central · Blanco: delante · Amarillo: detrás · Impar → amarillo · Par → blanco · Color nombrado → ese color"
  },
  "detalle": {
    "objetivos": [
      "Mejorar la velocidad de reacción ante estímulos verbales.",
      "Relacionar información cognitiva simple con una respuesta motriz rápida.",
      "Trabajar orientación espacial y aceleración corta sin balón."
    ],
    "claves_entrenador": [
      "«Activos junto a la pica».",
      "«No toquéis la pica».",
      "«Si digo impar vais a amarillo».",
      "«Si digo par vais a blanco».",
      "«Si digo color vais a ese color».",
      "«Impar».",
      "«Par».",
      "«Blanco».",
      "«Amarillo».",
      "«Vuelve».",
      "«Pies cortos».",
      "«Reacciona ya».",
      "«No toques la pica».",
      "«Blanco delante».",
      "«Amarillo detrás»."
    ],
    "montaje": [
      "Pica roja en el centro con el entrenador en la zona media.",
      "Dos jugadores colocados, uno a cada lado de la pica.",
      "Referencias blancas delante para cada lado.",
      "Referencias amarillas detrás para cada lado.",
      "Colas a ambos lados para que entre la siguiente pareja."
    ],
    "desarrollo": [
      "Se coloca una pareja, un jugador a cada lado de la pica roja central.",
      "Esperan en posición activa con pies cortos, sin tocar la pica.",
      "El entrenador da una señal: número par, número impar o un color.",
      "Si dice número impar, los dos salen a la referencia amarilla de su lado.",
      "Si dice número par, los dos salen a la referencia blanca de su lado.",
      "Si dice blanco o amarillo, los dos salen directamente a ese color.",
      "Vuelven a la zona central y entra la siguiente pareja."
    ],
    "que_buscamos": [
      "Mejora la respuesta rápida ante estímulos externos.",
      "Ayuda a cambiar de dirección y activar la salida en poco espacio.",
      "Trabaja la relación entre percepción, decisión y acción."
    ],
    "que_observar": [
      "Que esperen en posición activa y no parados del todo.",
      "Que no toquen la pica central.",
      "Que entiendan bien la regla par/impar.",
      "Que la salida a blanco sea hacia delante y a amarillo hacia detrás.",
      "Que reaccionen los dos a la vez."
    ],
    "correcciones": [
      "Confundir par con impar.",
      "Salir al color contrario.",
      "Tocar o apoyarse en la pica.",
      "Esperar demasiado estáticos.",
      "Reaccionar tarde a la señal."
    ],
    "reglas": [
      "Es sin balón.",
      "Trabajan dos jugadores a la vez a cada lado de la pica.",
      "Número impar = amarillo.",
      "Número par = blanco.",
      "Si se nombra un color, van directo a ese color.",
      "Esperan en posición activa sin tocar la pica.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Trabajar primero solo con colores.",
      "Añadir después la regla de par/impar.",
      "Acortar la distancia a las referencias."
    ],
    "si_sale_bien": [
      "Aumentar la velocidad de señal.",
      "Combinar más secuencias seguidas.",
      "Añadir más exigencia en el retorno y entrada de la siguiente pareja."
    ],
    "variantes": [
      "Fútbol 7: 2 carriles espejo o 2 estaciones iguales. · 7-10 min.",
      "Fútbol 11: 2-4 estaciones iguales con parejas sucesivas. · 8-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7598622386061135126.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Trabajan dos jugadores a la vez, uno a cada lado de la pica roja central.",
        "El ejercicio es sin balón.",
        "Hay referencias blancas hacia delante y amarillas hacia detrás.",
        "Los jugadores esperan en posición activa con pies cortos, sin tocar la pica.",
        "Si el entrenador dice un número impar, los dos salen hacia amarillo.",
        "Si el entrenador dice un número par, los dos salen hacia blanco.",
        "Si el entrenador nombra un color, salen directamente a ese color.",
        "Después vuelve la pareja y entra la siguiente.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-REACCION-PAR-IMPAR-BLANCO-AMARILLO/CampoBase_Reaccion_Par_Impar_Blanco_Amarillo_V2.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-REACCION-PAR-IMPAR-BLANCO-AMARILLO/frames/f",
    "total": 128,
    "frameMs": 88
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-REACCION-PAR-IMPAR-BLANCO-AMARILLO/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-6-SALTOS-LATERALES-KNEE-DRIVE-SPRINT-13-7M",
  "nombre": "6 saltos laterales, knee drive y sprint de 13,7 m",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Saltos laterales",
      "Knee drive",
      "Sprint",
      "Aceleración",
      "Potencia",
      "Sin balón"
    ],
    "tiempo_estimado_15": "8-12 min",
    "jugadores": {
      "total": 15,
      "organizacion": "2-3 carriles para reducir esperas."
    },
    "material": "Referencia verde de inicio y cono final a 13,7 m. Sin balón.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador se coloca junto a la referencia verde."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Realiza 6 saltos laterales cortos con ambos pies, alternando de un lado al otro."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "El 7.º apoyo ya no es otro salto igual: se utiliza para impulsar el cuerpo lateralmente."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Ese impulso se acompaña de un knee drive explosivo."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Desde ese gesto enlaza inmediatamente con la aceleración."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Hace sprint recto hasta el cono situado a 13,7 m."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Se repite 6 veces en total: 3 saliendo desde cada lado."
        }
      ],
    "explicacion_breve": "El jugador comienza junto a una referencia verde y realiza 6 saltos laterales cortos con los dos pies, alternando de un lado al otro. El 7.º apoyo ya no es otro salto igual: se utiliza para impulsar el cuerpo lateralmente, enlazando con un knee drive explosivo. Desde ese gesto acelera inmediatamente y hace sprint recto hasta el cono situado a 13,7 m. Se repite 6 veces en total: 3 saliendo desde cada lado.",
    "leyenda": "Referencia verde: inicio · 6 saltos laterales · 7.º apoyo: impulso · Knee drive · Sprint recto de 13,7 m"
  },
  "detalle": {
    "objetivos": [
      "Mejorar reactividad lateral.",
      "Transformar un apoyo lateral en aceleración.",
      "Trabajar potencia de salida y coordinación del knee drive.",
      "Mejorar la transición entre gesto coordinativo y sprint."
    ],
    "claves_entrenador": [
      "«Seis saltos laterales».",
      "«En el séptimo, impulsa».",
      "«Rodilla arriba y sal».",
      "«Sprint hasta el cono».",
      "«Uno, dos, tres, cuatro, cinco, seis».",
      "«Impulsa».",
      "«Rodilla».",
      "«Sprint».",
      "«Saltos cortos».",
      "«No te quedes clavado en el séptimo apoyo».",
      "«Rodilla arriba».",
      "«Acelera desde el primer paso»."
    ],
    "montaje": [
      "Referencia verde en la zona de inicio.",
      "Cono final situado a 13,7 m.",
      "Espacio lateral suficiente para realizar los saltos y el impulso."
    ],
    "desarrollo": [
      "El jugador se coloca junto a la referencia verde.",
      "Realiza 6 saltos laterales cortos con ambos pies, alternando de un lado al otro.",
      "El 7.º apoyo ya no es otro salto igual: se utiliza para impulsar el cuerpo lateralmente.",
      "Ese impulso se acompaña de un knee drive explosivo.",
      "Desde ese gesto enlaza inmediatamente con la aceleración.",
      "Hace sprint recto hasta el cono situado a 13,7 m.",
      "Se repite 6 veces en total: 3 saliendo desde cada lado."
    ],
    "que_buscamos": [
      "Mejora la capacidad de reaccionar lateralmente y salir acelerando.",
      "Ayuda a convertir un apoyo corto en una carrera explosiva.",
      "Refuerza la mecánica inicial de aceleración."
    ],
    "que_observar": [
      "Que los 6 primeros apoyos sean realmente saltos laterales cortos.",
      "Que el 7.º apoyo sirva de transición hacia la salida.",
      "Que el knee drive sea explosivo.",
      "Que no haya pausa entre knee drive y sprint.",
      "Que se alternen correctamente las 3 salidas por cada lado."
    ],
    "correcciones": [
      "Hacer más de 6 saltos antes de salir.",
      "Convertir el 7.º apoyo en otro salto sin intención de salida.",
      "Knee drive bajo o poco explosivo.",
      "Pausa antes de acelerar.",
      "Sprint progresivo demasiado lento al inicio."
    ],
    "reglas": [
      "6 saltos laterales.",
      "7.º apoyo como impulso.",
      "Knee drive lateral.",
      "Sprint hasta 13,7 m.",
      "6 repeticiones totales: 3 por cada lado.",
      "Ejercicio sin balón.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir inicialmente a 4 saltos + salida.",
      "Trabajar knee drive aislado.",
      "Acortar temporalmente la distancia de sprint."
    ],
    "si_sale_bien": [
      "Aumentar velocidad de los 6 saltos sin perder control.",
      "Exigir más explosividad en el primer paso.",
      "Mantener las 6 repeticiones con calidad homogénea."
    ],
    "variantes": [
      "Fútbol 7: 2-3 carriles para reducir esperas. · 8-12 min.",
      "Fútbol 11: 3-4 carriles. · 8-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7598956017803595030.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El ejercicio es sin balón.",
        "El jugador comienza junto a una referencia verde.",
        "Realiza 6 saltos laterales cortos con los dos pies.",
        "El 7.º apoyo se utiliza como impulso lateral.",
        "Ese impulso enlaza con un knee drive lateral.",
        "Después acelera en sprint recto hasta el cono final.",
        "La distancia al cono final es 13,7 m.",
        "Se realizan 6 repeticiones totales: 3 saliendo desde cada lado.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-6-SALTOS-LATERALES-KNEE-DRIVE-SPRINT-13-7M/CampoBase_6_Saltos_Laterales_Knee_Drive_Sprint_13_7m_V4.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-6-SALTOS-LATERALES-KNEE-DRIVE-SPRINT-13-7M/frames/f",
    "total": 150,
    "frameMs": 60
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-6-SALTOS-LATERALES-KNEE-DRIVE-SPRINT-13-7M/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-VUELTA-LATERAL-PASE",
  "nombre": "Conducción + dejar balón + 3 conos + vuelta lateral + pase",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Conducción",
      "Sin balón",
      "Rodillas altas",
      "Desplazamiento lateral",
      "Pase",
      "2 carriles"
    ],
    "tiempo_estimado_15": "7-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "2 carriles de 7-9 jugadores."
    },
    "material": "2 conos altos, 6 conos bajos (3 por carril) y balones.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Sale un jugador de cada cola con balón."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Conduce hasta el cono alto."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Deja el balón junto al cono alto."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Continúa sin balón hasta el final del tramo de 3 conos."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Vuelve por los 3 conos mediante saltos laterales con rodillas altas."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Llega de nuevo a la zona del balón."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Pasa el balón al siguiente jugador de la cola."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "El siguiente inicia la repetición."
        },
        {
          "nombre": "Paso 9",
          "instruccion": "El jugador que termina se coloca al final de la cola."
        }
      ],
    "explicacion_breve": "Trabajan dos jugadores a la vez, uno por carril. Cada uno sale con balón desde su cola, conduce hasta el cono alto y deja el balón en esa zona. Continúa sin balón hasta el extremo del tramo de 3 conos bajos (rectos y paralelos, no en zigzag) y vuelve saltándolos lateralmente con rodillas altas. Llega de nuevo al balón y pasa desde la zona del cono alto al siguiente jugador de la cola. El jugador que termina se coloca al final de la cola.",
    "leyenda": "Cono alto: dejar balón · 3 conos bajos rectos: vuelta lateral con rodillas altas · Pase al siguiente · Final de cola"
  },
  "detalle": {
    "objetivos": [
      "Encadenar conducción, desmarque sin balón y pase de relevo.",
      "Mejorar la transición entre acción con balón y acción sin balón.",
      "Trabajar desplazamiento lateral con rodillas altas.",
      "Mejorar la precisión del pase al compañero siguiente."
    ],
    "claves_entrenador": [
      "«Conduce hasta el cono y deja el balón».",
      "«Sigue sin balón hasta el final».",
      "«Vuelve lateral por los tres conos con rodillas altas».",
      "«Llega al balón, pasa al siguiente y ponte al final».",
      "«Deja balón».",
      "«Sigue».",
      "«Lateral».",
      "«Rodillas arriba».",
      "«Vuelve al balón».",
      "«Pasa».",
      "«Conos rectos, no zigzag».",
      "«No te lleves el balón a los conos».",
      "«Pase desde el cono».",
      "«Después, final de la cola»."
    ],
    "montaje": [
      "Dos carriles paralelos.",
      "Una cola por carril.",
      "Un cono alto por carril en la zona donde se deja el balón.",
      "Tres conos bajos por carril colocados en línea recta y paralelos entre sí, delante del cono alto.",
      "El recorrido no se monta en zigzag ni con los conos en perpendicular."
    ],
    "desarrollo": [
      "Sale un jugador de cada cola con balón.",
      "Conduce hasta el cono alto.",
      "Deja el balón junto al cono alto.",
      "Continúa sin balón hasta el final del tramo de 3 conos.",
      "Vuelve por los 3 conos mediante saltos laterales con rodillas altas.",
      "Llega de nuevo a la zona del balón.",
      "Pasa el balón al siguiente jugador de la cola.",
      "El siguiente inicia la repetición.",
      "El jugador que termina se coloca al final de la cola."
    ],
    "que_buscamos": [
      "Mejora la capacidad de soltar el balón y volver a activarse sin él.",
      "Ayuda a enlazar acciones técnicas y desplazamientos rápidos.",
      "Refuerza la precisión del pase corto al compañero siguiente."
    ],
    "que_observar": [
      "Que los 3 conos estén rectos y paralelos.",
      "Que el balón se deje junto al cono alto.",
      "Que el tramo de conos se haga sin balón.",
      "Que la vuelta sea lateral y con elevación clara de rodillas.",
      "Que el pase final salga desde la zona del balón.",
      "Que el jugador no conduzca el balón hasta el compañero."
    ],
    "correcciones": [
      "Montar los conos en zigzag o perpendicular.",
      "Llevarse el balón al tramo de conos.",
      "Hacer la vuelta sin elevar las rodillas.",
      "Conducir el balón hasta el compañero en vez de pasar desde el cono.",
      "No ir al final de la cola."
    ],
    "reglas": [
      "3 conos rectos y paralelos.",
      "Vuelta lateral con rodillas altas.",
      "El tramo de conos se hace sin balón.",
      "Pase desde la zona del cono alto al siguiente.",
      "El jugador termina al final de la cola.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir la distancia de conducción.",
      "Separar la fase con balón de la fase sin balón.",
      "Trabajar primero la vuelta lateral sin pase y luego añadir el relevo."
    ],
    "si_sale_bien": [
      "Aumentar la velocidad de ejecución.",
      "Exigir más precisión en el pase al siguiente.",
      "Trabajar los dos carriles a más ritmo."
    ],
    "variantes": [
      "Fútbol 7: 2 carriles de 7-9 jugadores. · 7-10 min.",
      "Fútbol 11: 2-3 carriles de 6-8 jugadores. · 8-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7599677432911645974.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Trabajan dos jugadores a la vez, uno por carril.",
        "Cada jugador sale con balón desde su cola.",
        "Conduce hasta el cono alto y deja el balón en esa zona.",
        "Continúa sin balón hasta el extremo del tramo de conos.",
        "Los 3 conos bajos están rectos y paralelos, no en zigzag.",
        "La vuelta se hace saltando lateralmente los 3 conos con rodillas altas.",
        "Después llega de nuevo al balón y pasa al siguiente jugador de la cola.",
        "El jugador que termina se coloca al final de la cola.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-VUELTA-LATERAL-PASE/CampoBase_Conduccion_Dejar_Balon_3_Conos_Vuelta_Lateral_Pase_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-VUELTA-LATERAL-PASE/frames/f",
    "total": 207,
    "frameMs": 100
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-VUELTA-LATERAL-PASE/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-PIES-RAPIDOS-SPRINT-3-VARIACIONES",
  "nombre": "Pies rápidos + sprint explosivo — 3 variaciones",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Pies rápidos",
      "Aceleración",
      "Sprint",
      "Agilidad",
      "Cambio de dirección",
      "Velocidad de reacción",
      "Sin balón"
    ],
    "tiempo_estimado_15": "7-9 min",
    "jugadores": {
      "total": 15,
      "organizacion": "3 carriles de 5 jugadores. Un jugador activo por carril."
    },
    "material": "5 conos/cúpulas verdes cercanos en patrón escalonado + 1 cono verde adelantado para el sprint. Sin balón.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador entra en la zona de conos."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Realiza pies rápidos con apoyos cortos atravesando el patrón (BASE)."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "VARIACIÓN 1: alterna desplazamientos hacia delante y hacia atrás, finaliza orientado hacia la salida."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "VARIACIÓN 2: realiza desplazamientos laterales rápidos manteniendo el cuerpo bajo."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Sale del último apoyo sin detenerse."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Acelera en sprint explosivo hasta la referencia adelantada."
        }
      ],
    "explicacion_breve": "El jugador trabaja individualmente y sin balón sobre un patrón de cinco conos verdes cercanos, con un cono verde más adelantado como referencia de sprint. En los tres bloques hay trabajo rápido de pies dentro de la zona de conos y transferencia inmediata a sprint. BASE: pies rápidos atravesando el patrón. VARIACIÓN 1: adelante-atrás antes de enlazar con el sprint. VARIACIÓN 2: desplazamientos laterales rápidos antes de enlazar con sprint frontal.",
    "leyenda": "5 conos verdes: patrón de pies rápidos · Cono adelantado: sprint · Base / Variación 1 (adelante-atrás) / Variación 2 (lateral)"
  },
  "detalle": {
    "objetivos": [
      "Mejorar la rapidez de pies en espacio corto.",
      "Cambiar de patrón de apoyo sin perder control.",
      "Transferir un trabajo coordinativo corto a una salida explosiva.",
      "Reducir la pausa entre el último apoyo y el sprint."
    ],
    "claves_entrenador": [
      "«Pies activos desde el primer apoyo».",
      "«Primero calidad; después velocidad».",
      "«Al salir del patrón, no te frenes».",
      "«Apoyos cortos».",
      "«Rápido de pies».",
      "«Último apoyo y sal».",
      "«Sprint explosivo».",
      "«Adelante, atrás».",
      "«No cruces los pies».",
      "«Termina orientado y acelera».",
      "«Desplaza lateral».",
      "«Cadera baja».",
      "«Pies cortos».",
      "«Gira la intención y sprint».",
      "«No mires al suelo todo el tiempo».",
      "«No alargues los pasos».",
      "«Sin pausa antes del sprint».",
      "«Primer paso fuerte»."
    ],
    "montaje": [
      "Colocar cinco conos verdes cercanos formando el patrón escalonado visible.",
      "Colocar una referencia verde adelantada en la dirección del sprint.",
      "Dejar espacio libre desde la salida del patrón hasta el cono final."
    ],
    "desarrollo": [
      "El jugador entra en la zona de conos.",
      "Realiza pies rápidos con apoyos cortos atravesando el patrón (BASE).",
      "VARIACIÓN 1: alterna desplazamientos hacia delante y hacia atrás, finaliza orientado hacia la salida.",
      "VARIACIÓN 2: realiza desplazamientos laterales rápidos manteniendo el cuerpo bajo.",
      "Sale del último apoyo sin detenerse.",
      "Acelera en sprint explosivo hasta la referencia adelantada."
    ],
    "que_buscamos": [
      "Reacelerar después de un ajuste corto.",
      "Mejorar los primeros pasos tras un cambio de dirección.",
      "Responder con rapidez a correcciones defensivas y movimientos de apoyo.",
      "Pasar de apoyos cortos a carrera de máxima intención."
    ],
    "que_observar": [
      "Que no pise los conos.",
      "Que los apoyos sean rápidos y controlados.",
      "Que la VARIACIÓN 1 conserve la lógica adelante-atrás.",
      "Que la VARIACIÓN 2 sea lateral y no se convierta en carrera frontal.",
      "Que la salida a sprint sea inmediata.",
      "Que no pierda postura por buscar velocidad demasiado pronto."
    ],
    "correcciones": [
      "Pasos demasiado largos.",
      "Pisar o desplazar los conos.",
      "Frenarse al terminar el patrón.",
      "Cruzar los pies en el desplazamiento lateral.",
      "Perder la orientación en el patrón adelante-atrás.",
      "Salir al sprint sin un primer paso agresivo."
    ],
    "reglas": [
      "Sin balón.",
      "Cinco conos cercanos más una referencia final.",
      "Hay BASE + VARIACIÓN 1 + VARIACIÓN 2.",
      "VARIACIÓN 1: adelante-atrás antes del sprint.",
      "VARIACIÓN 2: lateral antes del sprint frontal.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Trabajar solo la BASE.",
      "Reducir el número de conos de cinco a tres temporalmente.",
      "Acortar el sprint.",
      "Hacer el patrón caminando rápido antes de volver a velocidad."
    ],
    "si_sale_bien": [
      "Aumentar ligeramente la velocidad de pies.",
      "Mantener la misma colocación y exigir salida más explosiva.",
      "Alternar lado de entrada en la VARIACIÓN 2.",
      "Encadenar las tres formas con descansos completos."
    ],
    "variantes": [
      "Fútbol 7: 3 carriles de 5 jugadores. Un jugador activo por carril. · 7-9 min.",
      "Fútbol 11: 3-4 carriles de 4-6 jugadores. · 9-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: agi_7601164361222163734.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El ejercicio se realiza individualmente y sin balón.",
        "El montaje utiliza cinco conos verdes cercanos en patrón escalonado y un cono verde más adelantado.",
        "En los tres bloques hay trabajo rápido de pies y transferencia inmediata a sprint.",
        "VARIATION 1 está rotulada en el vídeo como FORWARD-BACK PEDAL INTO SPRINT.",
        "VARIATION 2 está rotulada en el vídeo como LATERAL SHUFFLES INTO SPRINT.",
        "No se observa una señal externa del entrenador antes de la salida.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-PIES-RAPIDOS-SPRINT-3-VARIACIONES/CampoBase_Pies_Rapidos_Sprint_3_Variaciones_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-PIES-RAPIDOS-SPRINT-3-VARIACIONES/frames/f",
    "total": 207,
    "frameMs": 70
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-PIES-RAPIDOS-SPRINT-3-VARIACIONES/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-FINALIZACION-PRIMERAS-SERVICIO-CENTRAL-CAMBIO-FILA",
  "nombre": "Finalización de primeras con servicio central y cambio de fila",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Remate de primeras",
      "Pase raso",
      "Desmarque de llegada",
      "Ambos perfiles",
      "Cambio de fila",
      "Portero",
      "Servicio del entrenador"
    ],
    "tiempo_estimado_15": "7-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1 portero + 14 jugadores de campo en 2 filas de 7. El entrenador sirve desde el centro."
    },
    "material": "Balones, 1 portería y 1 portero.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Los jugadores esperan en dos filas, una a cada lado del entrenador."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Sale el primer jugador de uno de los lados y entra en carrera hacia la zona de finalización."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "El entrenador sirve un balón raso desde la zona central hacia su carril de llegada."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "El jugador ajusta la carrera y finaliza de primeras a portería."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Después de finalizar, el jugador se desplaza a la fila opuesta."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Se repite la misma lógica desde el otro lado."
        }
      ],
    "explicacion_breve": "El entrenador se sitúa en una zona central con varios balones y un portero defiende la portería. Los jugadores esperan en dos filas, una a cada lado del entrenador. Sale el primer jugador de un lado, entra en carrera hacia la zona de finalización, y el entrenador sirve un balón raso hacia su carril de llegada. El jugador ajusta la carrera y finaliza de primeras a portería. Después de finalizar, cambia a la fila opuesta. Izquierda y derecha son el mismo ejercicio, no variantes independientes.",
    "leyenda": "Entrenador: sirve balón raso desde el centro · Portero en portería · Remate de primeras · Cambio a la fila opuesta"
  },
  "detalle": {
    "objetivos": [
      "Llegar al balón con el paso ajustado para rematar sin control previo.",
      "Coordinar la carrera con el momento del servicio.",
      "Finalizar desde ambos lados sin detener la acción.",
      "Mejorar precisión y velocidad de ejecución."
    ],
    "claves_entrenador": [
      "«Entra en carrera, no esperes parado».",
      "«Ataca el balón y remata de primeras».",
      "«Después del remate, cambia de fila».",
      "«Ajusta el último paso».",
      "«Ataca el balón».",
      "«De primeras».",
      "«Mira portería».",
      "«Cambia de fila».",
      "«No llegues demasiado pronto».",
      "«No esperes al balón».",
      "«Pie de apoyo al lado del balón».",
      "«Golpea limpio, no solo fuerte»."
    ],
    "montaje": [
      "Portería con portero.",
      "Entrenador en zona central con balones.",
      "Dos filas laterales, una a cada lado del entrenador.",
      "Zona libre entre las filas y la portería para la carrera de llegada y el remate."
    ],
    "desarrollo": [
      "Los jugadores esperan en dos filas, una a cada lado del entrenador.",
      "Sale el primer jugador de uno de los lados y entra en carrera hacia la zona de finalización.",
      "El entrenador sirve un balón raso desde la zona central hacia su carril de llegada.",
      "El jugador ajusta la carrera y finaliza de primeras a portería.",
      "Después de finalizar, el jugador se desplaza a la fila opuesta.",
      "Se repite la misma lógica desde el otro lado."
    ],
    "que_buscamos": [
      "Finalizar centros rasos o pases atrás sin necesidad de controlar.",
      "Atacar balones que llegan desde un compañero situado por dentro.",
      "Mejorar la llegada desde un costado hacia zona de remate.",
      "Resolver rápido antes de que la defensa pueda ajustar."
    ],
    "que_observar": [
      "Que el jugador llegue en movimiento y no espere parado el pase.",
      "Que el servicio del entrenador tenga dirección y velocidad útiles para rematar.",
      "Que el jugador ajuste los últimos pasos antes del golpeo.",
      "Que la finalización sea de primeras.",
      "Que el cambio de fila se haga por fuera de la zona activa y sin cruzarse con el siguiente jugador.",
      "Que se trabajen ambos lados."
    ],
    "correcciones": [
      "Salir demasiado pronto y tener que frenar.",
      "Salir tarde y no llegar limpio al balón.",
      "Esperar al balón en vez de atacarlo.",
      "Dar un control previo cuando el objetivo es rematar de primeras.",
      "Golpear desequilibrado por no ajustar los últimos pasos.",
      "Olvidar el cambio de fila después del remate."
    ],
    "reglas": [
      "Entrenador en zona central con balones.",
      "Portero en portería.",
      "Servicio raso del entrenador hacia el carril de llegada.",
      "Finalización de primeras.",
      "Dos filas laterales.",
      "Después de finalizar, el jugador cambia a la fila opuesta.",
      "Izquierda y derecha son el mismo ejercicio, no variantes distintas.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir la distancia de carrera.",
      "Bajar ligeramente la velocidad del servicio.",
      "Permitir una repetición técnica a menor velocidad antes de volver al remate de primeras."
    ],
    "si_sale_bien": [
      "Aumentar ligeramente la velocidad del servicio manteniendo precisión.",
      "Variar la zona de llegada del pase raso sin cambiar la lógica del ejercicio.",
      "Exigir orientación del remate a zonas concretas de la portería."
    ],
    "variantes": [
      "Fútbol 7: 1 portero + 14 jugadores de campo en 2 filas de 7. El entrenador sirve desde el centro. · 7-10 min.",
      "Fútbol 11: 1-2 porteros y el resto repartido en 2 filas. El entrenador sirve desde zona central. · 9-13 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7160310012487666949.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El entrenador se sitúa en una zona central con varios balones.",
        "Hay un portero defendiendo la portería.",
        "El entrenador sirve un balón raso hacia el carril de llegada.",
        "Un jugador entra en carrera desde un lateral y finaliza a portería.",
        "Las finalizaciones visibles se realizan de primeras.",
        "La acción se observa entrando desde ambos lados.",
        "Los jugadores están organizados en dos filas, una a cada lado del entrenador.",
        "Después de finalizar, cada jugador cambia a la fila opuesta.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-FINALIZACION-PRIMERAS-SERVICIO-CENTRAL-CAMBIO-FILA/CampoBase_Finalizacion_Primeras_Servicio_Central_Cambio_Fila_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-FINALIZACION-PRIMERAS-SERVICIO-CENTRAL-CAMBIO-FILA/frames/f",
    "total": 81,
    "frameMs": 100
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-FINALIZACION-PRIMERAS-SERVICIO-CENTRAL-CAMBIO-FILA/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-DUELOS-3V2-FINALIZACION-ROBO-ROTACION",
  "nombre": "Duelos 3v2 con finalización — robo = fin y rotación por roles",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Superioridad ofensiva",
      "3v2",
      "Toma de decisión",
      "Finalización",
      "Defensa en inferioridad",
      "Portero"
    ],
    "tiempo_estimado_15": "10-14 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1 portero + 8 atacantes + 6 defensores. Activos: 3 atacantes + 2 defensores + portero; el resto espera en sus colas."
    },
    "material": "1 portería grande, balones y petos de dos colores.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Entran 3 atacantes contra 2 defensores."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Los atacantes progresan hacia portería intentando crear un jugador libre."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Los defensores temporizan, basculan y cierran líneas de pase/tiro."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "La acción continúa hasta finalización, balón fuera o robo defensivo."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Si los defensores roban, la repetición termina en ese instante."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Los 3 atacantes vuelven a la cola de atacantes."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Los 2 defensores vuelven a la cola de defensores."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Entra el siguiente grupo."
        }
      ],
    "explicacion_breve": "El ejercicio enfrenta 3 atacantes contra 2 defensores con portería grande y portero. Los atacantes progresan hacia portería buscando finalizar la superioridad; los defensores protegen portería e intentan cortar o robar. Cuando los defensores roban, la repetición termina inmediatamente (no hay transición ofensiva). Tras terminar, los atacantes vuelven a la cola de atacantes y los defensores a la cola de defensores.",
    "leyenda": "3 atacantes vs 2 defensores · Portería grande con portero · Robo = fin de repetición · Rotación por roles (atacantes y defensores en colas separadas)"
  },
  "detalle": {
    "objetivos": [
      "Aprovechar una superioridad 3v2 para llegar a finalización.",
      "Elegir con rapidez entre conducción, pase y tiro según la respuesta defensiva.",
      "Coordinar amplitud y apoyos entre los tres atacantes.",
      "Entrenar a los dos defensores para temporizar, cerrar líneas y proteger portería."
    ],
    "claves_entrenador": [
      "«Tres contra dos: abrid el campo y atacad con decisión».",
      "«Defensores: uno aprieta y el otro cubre».",
      "«Si hay robo, se acaba».",
      "«Amplitud».",
      "«Fija y suelta».",
      "«Ataca el espacio».",
      "«Temporiza».",
      "«Cubre».",
      "«Tira si aparece».",
      "«No os juntéis los tres».",
      "«No conduzcas si el pase libera a un compañero».",
      "«Defensor cercano presiona; segundo defensor cubre».",
      "«Robo: fin y cada uno a su cola»."
    ],
    "montaje": [
      "Portería grande con portero.",
      "2 defensores por delante de portería.",
      "3 atacantes preparados para iniciar el ataque.",
      "Cola de atacantes separada de la cola de defensores para la rotación por roles."
    ],
    "desarrollo": [
      "Entran 3 atacantes contra 2 defensores.",
      "Los atacantes progresan hacia portería intentando crear un jugador libre.",
      "Los defensores temporizan, basculan y cierran líneas de pase/tiro.",
      "La acción continúa hasta finalización, balón fuera o robo defensivo.",
      "Si los defensores roban, la repetición termina en ese instante.",
      "Los 3 atacantes vuelven a la cola de atacantes.",
      "Los 2 defensores vuelven a la cola de defensores.",
      "Entra el siguiente grupo."
    ],
    "que_buscamos": [
      "Resolver transiciones o ataques con ventaja numérica.",
      "Atacar espacios libres cuando un defensor salta al poseedor.",
      "Mejorar la decisión del último pase o el momento de tiro.",
      "Defender inferioridades sin precipitar la entrada."
    ],
    "que_observar": [
      "Amplitud real de los tres atacantes.",
      "Velocidad de circulación y decisión.",
      "Momento del último pase.",
      "No atacar siempre por el centro.",
      "Perfil corporal de los defensores.",
      "Distancia de cobertura entre los dos defensores.",
      "Que el robo termine la repetición sin contraataque posterior.",
      "Rotación correcta por roles."
    ],
    "correcciones": [
      "Atacantes demasiado juntos.",
      "Conducción excesiva con compañero libre.",
      "Pase demasiado pronto sin fijar defensor.",
      "Defensores saltando los dos al balón.",
      "Defensor de cobertura demasiado lejos.",
      "Seguir jugando tras un robo en vez de cortar la repetición."
    ],
    "reglas": [
      "3 atacantes contra 2 defensores.",
      "Si los defensores roban, termina la repetición.",
      "Defensores vuelven a cola de defensores.",
      "Atacantes vuelven a cola de atacantes.",
      "No existe transición ofensiva tras el robo.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir el espacio de salida y acercar atacantes a zona de decisión.",
      "Permitir 3v1 durante unas repeticiones para entender la ocupación de espacios.",
      "Congelar una jugada y recolocar amplitud/apoyos antes de reiniciar.",
      "Dar ventaja de salida al ataque si los defensores dominan demasiado."
    ],
    "si_sale_bien": [
      "Aumentar ligeramente la distancia de inicio.",
      "Limitar tiempo máximo de ataque como progresión.",
      "Exigir finalización tras un número reducido de pases solo como progresión CampoBase.",
      "Cambiar el jugador que inicia con balón entre repeticiones."
    ],
    "variantes": [
      "Fútbol 7: 1 portero + 8 atacantes + 6 defensores. Activos: 3 atacantes + 2 defensores + portero. · 10-14 min.",
      "Fútbol 11: 1 estación con 1 portero y dos colas por rol; con dos porterías/porteros se pueden montar 2 estaciones. · 12-16 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7274017964146380038.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El ejercicio enfrenta 3 atacantes contra 2 defensores con portería grande y portero.",
        "Los atacantes progresan hacia portería buscando finalizar la superioridad.",
        "Los defensores protegen portería e intentan cortar o robar la jugada.",
        "Se observan repeticiones sucesivas con nuevos grupos.",
        "Cuando los defensores roban, la repetición termina inmediatamente.",
        "Tras terminar, los defensores vuelven a la cola de defensores y los atacantes a la cola de atacantes.",
        "No hay transición ofensiva de los defensores tras el robo.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-DUELOS-3V2-FINALIZACION-ROBO-ROTACION/CampoBase_Duelos_3vs2_Finalizacion_Robo_Rotacion_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-DUELOS-3V2-FINALIZACION-ROBO-ROTACION/frames/f",
    "total": 207,
    "frameMs": 70
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-DUELOS-3V2-FINALIZACION-ROBO-ROTACION/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-IDA-CONOS-VUELTA-PICAS-FINALIZACION",
  "nombre": "Ida por conos, vuelta por picas y finalización",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Pase",
      "Juego de primeras",
      "Coordinación",
      "Conos",
      "Zigzag",
      "Picas",
      "Velocidad",
      "Finalización",
      "Portero"
    ],
    "tiempo_estimado_15": "8-12 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1 portero, 1 entrenador como apoyo y resto en fila; con grupo grande, 2 estaciones equivalentes."
    },
    "material": "Balones, conos, 4 picas, 1 cono amarillo, 1 portería y 1 portero.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador inicia la acción con un pase al entrenador."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Avanza por el carril de conos."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Durante la ida combina con el entrenador y devuelve de primeras."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Completa un segundo intercambio de pase durante el recorrido de conos."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Al llegar al final de la ida, cambia de sentido."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Regresa realizando zigzag entre las 4 picas."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Al completar las picas, el entrenador juega el balón al espacio."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "El jugador acelera para atacar el pase."
        },
        {
          "nombre": "Paso 9",
          "instruccion": "Finaliza a portería."
        },
        {
          "nombre": "Paso 10",
          "instruccion": "Después del remate continúa en sprint hasta el cono amarillo."
        },
        {
          "nombre": "Paso 11",
          "instruccion": "En el cono amarillo gira y regresa."
        }
      ],
    "explicacion_breve": "El jugador inicia con un pase al entrenador y avanza por el carril de conos, combinando con él y devolviendo de primeras. Al llegar al final de la ida cambia de sentido y regresa haciendo zigzag entre las 4 picas. Al completar las picas, el entrenador juega el balón al espacio; el jugador acelera para atacarlo, finaliza a portería y, después del remate, continúa en sprint hasta el cono amarillo, donde gira y regresa.",
    "leyenda": "Carril de conos: ida con pases · 4 picas: vuelta en zigzag · Pase al espacio: aceleración · Finalización a portería · Cono amarillo: sprint final"
  },
  "detalle": {
    "objetivos": [
      "Encadenar pase, desplazamiento y devolución sin detener la acción.",
      "Mantener precisión durante el recorrido de ida.",
      "Realizar una vuelta coordinada en zigzag entre las picas.",
      "Cambiar de ritmo al recibir el pase al espacio.",
      "Finalizar después de una secuencia técnica y coordinativa."
    ],
    "claves_entrenador": [
      "«Pasa y avanza por los conos».",
      "«Devuelve de primeras».",
      "«Vuelve por las picas haciendo zigzag».",
      "«Al pase al espacio, acelera».",
      "«Después de rematar, sigue hasta el cono amarillo y vuelve».",
      "«Pasa y muévete».",
      "«De primeras».",
      "«Por los conos».",
      "«Ahora vuelve por las picas».",
      "«Zigzag completo».",
      "«Acelera».",
      "«Ataca el balón».",
      "«Finaliza».",
      "«Sigue al cono».",
      "«Gira y vuelve».",
      "«No te pares después de pasar».",
      "«Perfílate antes de recibir».",
      "«No te saltes ninguna pica».",
      "«Primer paso fuerte al salir».",
      "«No pares después del remate»."
    ],
    "montaje": [
      "Zona de salida del jugador.",
      "Carril de ida marcado con conos.",
      "Entrenador colocado como apoyo lateral del recorrido.",
      "Carril de vuelta formado por 4 picas.",
      "Espacio libre para el pase de aceleración.",
      "Portería con portero.",
      "Cono amarillo para el sprint posterior a la finalización."
    ],
    "desarrollo": [
      "El jugador inicia la acción con un pase al entrenador.",
      "Avanza por el carril de conos.",
      "Durante la ida combina con el entrenador y devuelve de primeras.",
      "Completa un segundo intercambio de pase durante el recorrido de conos.",
      "Al llegar al final de la ida, cambia de sentido.",
      "Regresa realizando zigzag entre las 4 picas.",
      "Al completar las picas, el entrenador juega el balón al espacio.",
      "El jugador acelera para atacar el pase.",
      "Finaliza a portería.",
      "Después del remate continúa en sprint hasta el cono amarillo.",
      "En el cono amarillo gira y regresa."
    ],
    "que_buscamos": [
      "Mejorar apoyos y pases rápidos en movimiento.",
      "Trabajar el juego de primeras.",
      "Acelerar después de combinar.",
      "Atacar un balón al espacio.",
      "Finalizar tras una acción previa de alta coordinación."
    ],
    "que_observar": [
      "Que la ida se haga por los conos.",
      "Que los pases se realicen sin detener el desplazamiento.",
      "Que la vuelta se haga por las 4 picas.",
      "Que el zigzag pase entre todas las picas.",
      "Que el jugador acelere al pase al espacio.",
      "Que complete la finalización.",
      "Que continúe hasta el cono amarillo y regrese."
    ],
    "correcciones": [
      "Confundir el recorrido de ida y vuelta.",
      "Pararse después del pase.",
      "Añadir un control innecesario en las devoluciones.",
      "Saltarse una pica.",
      "Hacer el zigzag demasiado abierto.",
      "Esperar el balón al espacio.",
      "Pararse después de finalizar."
    ],
    "reglas": [
      "Ida por conos con intercambios de pase de primeras.",
      "Vuelta en zigzag por las 4 picas.",
      "Pase al espacio para activar la aceleración.",
      "Finalización a portería.",
      "Sprint al cono amarillo y regreso.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Aumentar la separación entre obstáculos.",
      "Reducir la velocidad de los pases.",
      "Acortar el pase al espacio."
    ],
    "si_sale_bien": [
      "Aumentar la velocidad de los intercambios.",
      "Exigir mayor precisión en la finalización.",
      "Aumentar moderadamente la velocidad del pase al espacio."
    ],
    "variantes": [
      "Fútbol 7: 1 portero, 1 entrenador como apoyo y resto en fila; con grupo grande, 2 estaciones equivalentes. · 8-12 min.",
      "Fútbol 11: 2 estaciones paralelas recomendadas. · 10-14 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7307032701830204677.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El jugador inicia con un pase al entrenador y avanza por el carril de conos.",
        "Durante la ida combina con el entrenador y devuelve de primeras.",
        "Al llegar al final de la ida cambia de sentido y regresa en zigzag entre las 4 picas.",
        "Al completar las picas, el entrenador juega el balón al espacio.",
        "El jugador acelera, finaliza a portería y continúa en sprint hasta el cono amarillo.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-IDA-CONOS-VUELTA-PICAS-FINALIZACION/CampoBase_Ida_Conos_Vuelta_Picas_Finalizacion_V2.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-IDA-CONOS-VUELTA-PICAS-FINALIZACION/frames/f",
    "total": 147,
    "frameMs": 105
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-IDA-CONOS-VUELTA-PICAS-FINALIZACION/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL",
  "nombre": "3 finalizaciones consecutivas — centro, zona exterior y centro lateral",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Finalización",
      "Tiro",
      "Pase raso",
      "Centro lateral",
      "Remate de primeras",
      "Desmarque",
      "Ataque a portería"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1 estación de finalización con 1 portero, 1 finalizador y 2 servidores; el resto rota por cola."
    },
    "material": "3 muñecos, 1 portería, 1 portero, balones y servidores.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador inicia la repetición preparado frente al primer sector."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Recibe un pase raso, rodea la primera referencia y finaliza por la zona central."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Sin detener la secuencia, cambia de zona hacia el sector exterior."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Recibe un segundo pase raso y finaliza desde la zona exterior."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Continúa su carrera hacia el área."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Ataca el centro lateral."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Remata de primeras."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Tras la tercera finalización termina la repetición."
        }
      ],
    "explicacion_breve": "El mismo jugador realiza tres finalizaciones consecutivas en una sola repetición. La primera acción termina con una finalización por la zona central de portería; la segunda se realiza desde una zona exterior; la tercera llega tras un centro lateral y se remata de primeras. Entre finalizaciones el jugador continúa desplazándose para enlazar la siguiente acción.",
    "leyenda": "3 muñecos: referencias de zona · Finalización central → exterior → centro lateral de primeras · Portero en portería"
  },
  "detalle": {
    "objetivos": [
      "Mejorar tres contextos diferentes de finalización en una misma secuencia.",
      "Aumentar la velocidad de preparación del remate.",
      "Atacar el área después de una primera y segunda finalización.",
      "Mejorar la precisión del golpeo bajo fatiga corta específica."
    ],
    "claves_entrenador": [
      "«Tres finalizaciones seguidas; no paramos entre una y otra».",
      "«Prepara el cuerpo antes de cada golpeo».",
      "«Después de tirar, cambia rápido de zona».",
      "«Finaliza centro».",
      "«Abre a zona exterior».",
      "«Ataca el área».",
      "«De primeras al centro».",
      "«No te quedes mirando el tiro».",
      "«Primer control preparado para finalizar».",
      "«Llega perfilado».",
      "«Ataca el centro, no esperes el balón»."
    ],
    "montaje": [
      "Tres muñecos distribuidos frente al área y en los sectores laterales.",
      "Portería con portero.",
      "Servidores con balones fuera de la zona de remate."
    ],
    "desarrollo": [
      "El jugador inicia la repetición preparado frente al primer sector.",
      "Recibe un pase raso, rodea la primera referencia y finaliza por la zona central.",
      "Sin detener la secuencia, cambia de zona hacia el sector exterior.",
      "Recibe un segundo pase raso y finaliza desde la zona exterior.",
      "Continúa su carrera hacia el área.",
      "Ataca el centro lateral.",
      "Remata de primeras.",
      "Tras la tercera finalización termina la repetición."
    ],
    "que_buscamos": [
      "Finalizar desde posiciones centrales tras recepción.",
      "Resolver ocasiones desde zonas exteriores.",
      "Atacar centros laterales dentro del área.",
      "Reaccionar rápido tras una primera acción de remate y volver a estar disponible."
    ],
    "que_observar": [
      "Que la primera finalización sea por zona central.",
      "Que el jugador cambie inmediatamente a la segunda zona.",
      "Que la segunda acción sea una finalización desde zona exterior.",
      "Que en la tercera acción ataque el área y remate de primeras.",
      "Que no pierda intensidad entre remates.",
      "Que el portero esté preparado para tres acciones seguidas."
    ],
    "correcciones": [
      "Pararse después del primer tiro.",
      "Llegar mal orientado al segundo balón.",
      "Esperar el centro en vez de atacar su trayectoria.",
      "Dar un control extra en la tercera acción cuando se busca remate de primeras.",
      "Priorizar potencia y perder precisión."
    ],
    "reglas": [
      "Tres finalizaciones consecutivas en una sola repetición.",
      "Primera: zona central. Segunda: zona exterior. Tercera: centro lateral de primeras.",
      "En la tercera finalización no se fija derecha o izquierda del servidor.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Bajar la velocidad y separar las tres acciones.",
      "Hacer una repetición de cada finalización por separado.",
      "Acercar los servicios.",
      "Repetir solo la tercera acción hasta automatizar el ataque al centro."
    ],
    "si_sale_bien": [
      "Aumentar el ritmo entre finalizaciones.",
      "Variar ligeramente la altura o velocidad del centro lateral.",
      "Pedir zonas objetivo dentro de portería.",
      "Alternar superficie de golpeo en las dos primeras finalizaciones."
    ],
    "variantes": [
      "Fútbol 7: 1 estación con 1 portero, 1 finalizador y 2 servidores; el resto rota por cola. · 8-10 min.",
      "Fútbol 11: 2 estaciones si hay 2 porterías; 1 portero, 1 finalizador y 2 servidores por estación. · 10-12 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7391956673264487712.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "El mismo jugador realiza tres finalizaciones consecutivas en una sola repetición.",
        "El montaje utiliza tres muñecos, una portería con portero y servidores con balones.",
        "La primera acción termina con una finalización por la zona central de portería.",
        "La segunda finalización se realiza desde una zona exterior.",
        "La tercera finalización llega tras un centro lateral y se remata de primeras.",
        "Entre finalizaciones el jugador continúa desplazándose para enlazar la siguiente acción.",
        "En la tercera finalización no se fija derecha o izquierda del servidor.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL/CampoBase_3_Finalizaciones_Centro_Exterior_Centro_Lateral_V1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL/frames/f",
    "total": 207,
    "frameMs": 67
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-DEFINICION-CABEZA-COMPETICION-PORTERO-FIJO",
  "nombre": "Competición de definición de cabeza con portero fijo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "Remate de cabeza",
      "Competición",
      "Pase aéreo con las manos",
      "Portero fijo",
      "Puntuación por equipos"
    ],
    "tiempo_estimado_15": "8-12 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1 portero fijo + 2 filas de 7, una a cada lado de la portería."
    },
    "material": "Balones, 1 portería, 1 portero fijo y petos para diferenciar equipos.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Los equipos esperan en dos filas verticales, una a cada lado de la portería."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "El servidor del equipo que tiene el turno lanza el balón con las manos."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "El primer rematador sale de la fila y entra hacia la zona frontal."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Ataca el balón y remata de cabeza."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Si marca, su equipo suma 1 punto."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "El portero permanece fijo."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Ataca el equipo contrario."
        }
      ],
    "explicacion_breve": "Los jugadores se colocan en dos filas verticales perfectas, una roja y una azul, cada una a un lado de la portería. Desde la parte delantera de cada fila se manda el balón con las manos hacia la zona de remate de cabeza. El primer rematador sale de la fila, ataca el balón y remata de cabeza; cada gol vale 1 punto. El portero permanece fijo defendiendo los remates de ambos equipos, que alternan intento a intento.",
    "leyenda": "Dos filas (roja y azul) a cada lado de la portería · Servicio con las manos · Remate de cabeza · Gol = 1 punto · Portero fijo"
  },
  "detalle": {
    "objetivos": [
      "Atacar el balón en el momento correcto.",
      "Coordinar entrada, salto y cabeceo.",
      "Dirigir el remate.",
      "Mejorar la definición aérea en competición."
    ],
    "claves_entrenador": [
      "«Una fila a cada lado de la portería».",
      "«Servidor delante de la fila».",
      "«Servicio con las manos a la zona frontal».",
      "«Ataca el balón».",
      "«Cada gol vale un punto».",
      "«Sirve».",
      "«Ataca».",
      "«Salta».",
      "«Frente».",
      "«Dirige».",
      "«Siguiente equipo»."
    ],
    "montaje": [
      "Dos filas verticales perfectamente alineadas, una a cada lado de la portería.",
      "Fila roja a un lado y fila azul al otro.",
      "El servidor se sitúa delante de la fila.",
      "La zona de remate queda delante de la portería.",
      "El portero permanece fijo.",
      "Se lleva marcador por equipos."
    ],
    "desarrollo": [
      "Los equipos esperan en dos filas verticales, una a cada lado de la portería.",
      "El servidor del equipo que tiene el turno lanza el balón con las manos.",
      "El primer rematador sale de la fila y entra hacia la zona frontal.",
      "Ataca el balón y remata de cabeza.",
      "Si marca, su equipo suma 1 punto.",
      "El portero permanece fijo.",
      "Ataca el equipo contrario."
    ],
    "que_buscamos": [
      "Finalizar centros y balones aéreos dentro del área.",
      "Mejorar el tiempo de entrada a zona de remate.",
      "Aprender a dirigir el cabeceo con oposición del portero."
    ],
    "que_observar": [
      "Que las filas estén rectas y perfectamente alineadas.",
      "Que haya una fila a cada lado de la portería.",
      "Que el servidor esté delante de su fila.",
      "Que el balón llegue a una zona rematable.",
      "Que el jugador ataque el balón en movimiento.",
      "Que el portero permanezca fijo."
    ],
    "correcciones": [
      "Filas desalineadas.",
      "Servicio que no llega a zona rematable.",
      "Rematador que espera el balón en vez de atacarlo.",
      "Portero que sale de su posición fija."
    ],
    "reglas": [
      "Dos filas verticales perfectas, una roja y una azul, a cada lado de la portería.",
      "Servicio con las manos hacia la zona de remate.",
      "Cada gol vale 1 punto.",
      "Portero fijo.",
      "Los equipos alternan intento a intento.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Acercar el servicio a la zona de remate.",
      "Reducir la distancia de entrada.",
      "Practicar el cabeceo sin oposición antes de volver a la competición."
    ],
    "si_sale_bien": [
      "Aumentar la dificultad del servicio (altura o dirección).",
      "Exigir remate dirigido a zonas concretas de la portería.",
      "Aumentar el número de rondas manteniendo la calidad."
    ],
    "variantes": [
      "Fútbol 7: 1 portero fijo + 2 filas de 7, una a cada lado de la portería. · 8-12 min.",
      "Fútbol 11: 1-2 porteros fijos y dos filas, una a cada lado de la portería. · 10-14 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7434876587218193696.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Los jugadores se colocan en dos filas verticales perfectas, una roja y una azul.",
        "Cada fila se sitúa a un lado de la portería.",
        "Desde la parte delantera de cada fila se manda el balón con las manos hacia la zona de remate de cabeza.",
        "Cada gol vale 1 punto.",
        "La versión CampoBase usa portero fijo.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-DEFINICION-CABEZA-COMPETICION-PORTERO-FIJO/CampoBase_Definicion_Cabeza_Competicion_Portero_Fijo_V4.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-DEFINICION-CABEZA-COMPETICION-PORTERO-FIJO/frames/f",
    "total": 59,
    "frameMs": 139
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-DEFINICION-CABEZA-COMPETICION-PORTERO-FIJO/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-FINALIZACION-DOBLE-2-BALONES-TRANSICION-1V1-CAMBIO-CARRIL-V2",
  "nombre": "Finalización doble — 2 balones + transición defensiva + 1v1 + cambio de carril",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Finalización",
      "Conducción",
      "2 balones",
      "1v1",
      "Transición ataque-defensa",
      "Portero",
      "Cambio de rol",
      "Cambio de carril"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "2 colas de 7-8 jugadores; salen 2 por repetición."
    },
    "material": "1 portería con portero, balones, conos azules y amarillos, y discos naranjas.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "J1 y J2 salen simultáneamente, cada uno con su balón."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "J1 conduce desde el disco naranja inferior por la diagonal de 3 conos azules."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "J2 conduce desde el disco naranja de banda por la línea transversal de 4 conos amarillos."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "J1 termina antes su recorrido y realiza la primera finalización."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Nada más tirar, J1 cambia de rol y corre a defender."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "J2 conserva su propio balón, sale de los amarillos y ataca a J1 en un 1v1."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "J2 busca superar al defensor y realizar la segunda finalización."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Termina la repetición."
        },
        {
          "nombre": "Paso 9",
          "instruccion": "J1 va a la cola amarilla y J2 a la cola azul."
        }
      ],
    "explicacion_breve": "Salen dos jugadores a la vez, cada uno con balón. J1 recorre la línea de 3 conos azules en diagonal y finaliza primero; J2 recorre simultáneamente la línea de 4 conos amarillos en transversal y conserva su balón. Tras finalizar, J1 cambia inmediatamente a defensor. J2 continúa con su balón y se genera un 1v1 antes de la segunda finalización. Al terminar, ambos cambian de carril: J1 va a la cola amarilla y J2 a la cola azul.",
    "leyenda": "Azul: diagonal de 3 conos · Amarillo: línea transversal de 4 conos · J1 finaliza y defiende · J2 ataca 1v1 · Cambio de carril al final"
  },
  "detalle": {
    "objetivos": [
      "Encadenar conducción, finalización y transición defensiva inmediata.",
      "Trabajar el 1v1 con balón conservado desde el inicio.",
      "Mejorar el cambio de rol ataque-defensa.",
      "Trabajar la finalización en dos contextos distintos."
    ],
    "claves_entrenador": [
      "«Salís los dos a la vez».",
      "«Azul finaliza y cambia ya a defender».",
      "«Amarillo conserva su balón y ataca el 1v1».",
      "«Después, a la cola contraria»."
    ],
    "montaje": [
      "1 portería con portero.",
      "Salida azul: disco naranja inferior + 3 conos azules en diagonal hacia la zona de finalización.",
      "Salida amarilla: disco naranja en banda derecha + 4 conos amarillos en línea transversal hacia dentro.",
      "Disco blanco central como referencia espacial.",
      "Una cola en cada punto de salida."
    ],
    "desarrollo": [
      "J1 y J2 salen simultáneamente, cada uno con su balón.",
      "J1 conduce desde el disco naranja inferior por la diagonal de 3 conos azules.",
      "J2 conduce desde el disco naranja de banda por la línea transversal de 4 conos amarillos.",
      "J1 termina antes su recorrido y realiza la primera finalización.",
      "Nada más tirar, J1 cambia de rol y corre a defender.",
      "J2 conserva su propio balón, sale de los amarillos y ataca a J1 en un 1v1.",
      "J2 busca superar al defensor y realizar la segunda finalización.",
      "Termina la repetición.",
      "J1 va a la cola amarilla y J2 a la cola azul."
    ],
    "que_buscamos": [
      "Transición rápida de ataque a defensa.",
      "Mantener el balón propio durante la primera finalización del compañero.",
      "Resolver un 1v1 con intención de finalizar.",
      "Cambiar de rol y de carril con naturalidad."
    ],
    "que_observar": [
      "Salida simultánea de los dos jugadores.",
      "Dos balones al inicio; J2 conserva el suyo hasta el 1v1.",
      "3 conos azules en diagonal, no como carril paralelo.",
      "4 conos amarillos en línea transversal desde la banda, no en zigzag.",
      "Primera finalización rápida de J1.",
      "Cambio mental inmediato de J1 a defensor.",
      "J2 ataca el 1v1 con intención de finalizar.",
      "Cambio de carril al terminar."
    ],
    "correcciones": [
      "Salidas desincronizadas.",
      "Convertir la diagonal azul en un carril paralelo.",
      "Convertir la línea amarilla en zigzag.",
      "J1 que se queda mirando el tiro en vez de defender.",
      "J2 que pierde el balón antes del 1v1.",
      "Olvidar el cambio de carril al terminar."
    ],
    "reglas": [
      "2 balones al inicio, uno por jugador.",
      "Azul: diagonal de 3 conos. Amarillo: línea transversal de 4 conos.",
      "Los dos recorridos no son carriles paralelos.",
      "J1 finaliza primero y pasa a defender.",
      "J2 conserva su balón y ataca el 1v1.",
      "Al terminar, ambos cambian de carril (cola contraria).",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Acortar recorridos sin cambiar la geometría.",
      "Separar más las salidas.",
      "Hacer primero la transición a defensor sin 1v1 completo.",
      "Reducir velocidad y exigir control del segundo balón."
    ],
    "si_sale_bien": [
      "Aumentar velocidad de conducción.",
      "Limitar toques de J2 en el 1v1.",
      "Pedir finalización con pierna menos dominante en una vuelta.",
      "Reducir el tiempo de reacción defensiva de J1."
    ],
    "variantes": [
      "Fútbol 7: 2 colas de 7-8 jugadores; salen 2 por repetición. · 8-10 min.",
      "Fútbol 11: 2 colas de 8-11 jugadores o duplicar el montaje. · 10-14 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7457876736861113633.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Salen dos jugadores a la vez, cada uno con balón.",
        "J1 recorre la línea de 3 conos azules y finaliza primero.",
        "J2 recorre simultáneamente la línea de 4 conos amarillos y conserva su balón.",
        "Tras finalizar, J1 cambia inmediatamente a defensor.",
        "J2 continúa con su balón y se genera un 1v1 antes de la segunda finalización.",
        "Hay portero en ambas finalizaciones.",
        "La colocación azul es una diagonal y la amarilla una línea transversal; no son carriles paralelos.",
        "Al terminar, ambos cambian de carril y van a la cola contraria.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-FINALIZACION-DOBLE-2-BALONES-TRANSICION-1V1-CAMBIO-CARRIL-V2/CampoBase_Finalizacion_Doble_2_Balones_Transicion_1v1_Cambio_Carril_V2.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-FINALIZACION-DOBLE-2-BALONES-TRANSICION-1V1-CAMBIO-CARRIL-V2/frames/f",
    "total": 206,
    "frameMs": 70
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-FINALIZACION-DOBLE-2-BALONES-TRANSICION-1V1-CAMBIO-CARRIL-V2/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-DEFINICION-4-PICAS-DISPARO-ROTACION",
  "nombre": "Definición con 4 picas, secuencia de pase y disparo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "Pase",
      "Disparo",
      "Rotación",
      "4 picas",
      "Portero"
    ],
    "tiempo_estimado_15": "8-12 min",
    "jugadores": {
      "total": 10,
      "organizacion": "4 jugadores activos + portero; resto espera repartido en las picas."
    },
    "material": "4 picas, balones, 1 portería y 1 portero.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El balón parte de la pica 1."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Se pasa a la pica 2."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "De la pica 2 se pasa a la pica 3."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "De la pica 3 se pasa a la pica 4."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "Desde la pica 4 se finaliza con disparo."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "Durante toda esta secuencia los jugadores permanecen fijos."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "Una vez finaliza el disparo, rotan todos los jugadores simultáneamente a la siguiente pica."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Tras completar la rotación comienza una nueva repetición."
        }
      ],
    "explicacion_breve": "El balón parte de la pica 1 y sigue la secuencia pica 1 → pica 2 → pica 3 → pica 4, desde donde se dispara a portería. Durante toda la secuencia solo se mueve el balón: los jugadores permanecen fijos en su pica. Una vez finaliza el disparo, rotan todos los jugadores simultáneamente a la siguiente pica (1→2, 2→3, 3→4, 4→1) y comienza una nueva repetición.",
    "leyenda": "4 picas: secuencia de pase · Solo se mueve el balón · Disparo desde la pica 4 · Rotación simultánea al terminar"
  },
  "detalle": {
    "objetivos": [
      "Mantener una circulación limpia entre las 4 picas.",
      "Preparar la última recepción para finalizar.",
      "Finalizar a portería tras la secuencia.",
      "Realizar una rotación conjunta y ordenada al terminar."
    ],
    "claves_entrenador": [
      "«Solo se mueve el balón durante la secuencia».",
      "«No rotamos hasta terminar el disparo».",
      "«Después del disparo, rotan todos».",
      "«Pase».",
      "«Siguiente».",
      "«Último pase».",
      "«Dispara».",
      "«Ahora todos rotan».",
      "«Mantén tu posición».",
      "«No te muevas antes del final».",
      "«Control orientado».",
      "«Rotación todos a la vez»."
    ],
    "montaje": [
      "4 picas colocadas formando el recorrido.",
      "Un jugador fijo en cada pica durante la acción.",
      "Portería frente a la última pica.",
      "El balón inicia en la primera pica."
    ],
    "desarrollo": [
      "El balón parte de la pica 1.",
      "Se pasa a la pica 2.",
      "De la pica 2 se pasa a la pica 3.",
      "De la pica 3 se pasa a la pica 4.",
      "Desde la pica 4 se finaliza con disparo.",
      "Durante toda esta secuencia los jugadores permanecen fijos.",
      "Una vez finaliza el disparo, rotan todos los jugadores simultáneamente a la siguiente pica.",
      "Tras completar la rotación comienza una nueva repetición."
    ],
    "que_buscamos": [
      "Mejorar continuidad de pase previa a la finalización.",
      "Preparar el último receptor para definir con pocos toques.",
      "Trabajar precisión y ritmo antes del disparo."
    ],
    "que_observar": [
      "Que durante la circulación solo se mueva el balón.",
      "Que ningún jugador rote antes del disparo.",
      "Que el orden de pases sea correcto.",
      "Que la finalización salga desde la última pica.",
      "Que la rotación final sea simultánea y ordenada."
    ],
    "correcciones": [
      "Moverse antes de finalizar la secuencia.",
      "Rotar individualmente tras cada pase.",
      "Romper el orden de pases.",
      "Llegar mal orientado al disparo.",
      "Rotar de forma desordenada al final."
    ],
    "reglas": [
      "4 picas.",
      "El balón sigue la secuencia pica 1 → pica 2 → pica 3 → pica 4.",
      "Desde la última pica se dispara a portería.",
      "Durante los pases y el disparo los jugadores permanecen fijos.",
      "Al terminar la acción completa, rotan todos simultáneamente a la siguiente pica.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir distancias.",
      "Permitir un control extra.",
      "Realizar la rotación caminando al principio."
    ],
    "si_sale_bien": [
      "Aumentar velocidad del balón.",
      "Limitar toques.",
      "Exigir disparo con pierna no dominante."
    ],
    "variantes": [
      "Fútbol 7: 4 jugadores activos + portero; resto espera repartido en las picas. · 8-12 min.",
      "Fútbol 11: una o dos ruedas de 4 picas. · 10-14 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7474262238640065799.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Son 4 picas.",
        "El balón sigue la secuencia de una pica a la siguiente y desde la última se dispara.",
        "Durante la secuencia solo se mueve el balón.",
        "Los jugadores permanecen fijos mientras circula el balón.",
        "Al terminar la acción completa rotan todos los jugadores simultáneamente.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-DEFINICION-4-PICAS-DISPARO-ROTACION/CampoBase_Definicion_4_Picas_Disparo_Rotacion_V3.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-DEFINICION-4-PICAS-DISPARO-ROTACION/frames/f",
    "total": 105,
    "frameMs": 146
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-DEFINICION-4-PICAS-DISPARO-ROTACION/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-DEFINICION-PASE-ENTRE-LINEAS-FILTRADO",
  "nombre": "Definición con pase entre líneas y pase filtrado",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "Pase",
      "Entre líneas",
      "Pase filtrado",
      "Desmarque",
      "Rotación",
      "Portero"
    ],
    "tiempo_estimado_15": "8-12 min",
    "jugadores": {
      "total": 9,
      "organizacion": "3 activos + 1 portero; resto en estaciones."
    },
    "material": "3 maniquíes, 1 portería, balones y 1 portero.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "A pasa desde la cola a B, junto al maniquí izquierdo."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "B recibe y pasa a C, junto al maniquí derecho."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "B sale del puesto izquierdo hacia la zona izquierda de finalización."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "C recibe."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "C mete un pase filtrado entre líneas hacia B."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "B recibe y finaliza a portería."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "El portero defiende."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "Rotación: C→izquierda, B→cola, A→derecha."
        }
      ],
    "explicacion_breve": "A pasa desde la cola a B, junto al maniquí izquierdo. B recibe y pasa a C, junto al maniquí derecho, y sale del puesto izquierdo hacia la zona izquierda de finalización. C recibe y mete un pase filtrado entre líneas hacia B, que recibe y finaliza a portería. El maniquí central representa un defensor. Al terminar, rotan: C pasa a la izquierda, B a la cola y A a la derecha.",
    "leyenda": "3 maniquíes (izquierdo, central, derecho) · A→B→C→B→disparo · Pase filtrado entre líneas · Rotación C→izquierda, B→cola, A→derecha"
  },
  "detalle": {
    "objetivos": [
      "Jugar entre líneas.",
      "Sincronizar pase filtrado y desmarque.",
      "Finalizar tras recepción filtrada."
    ],
    "claves_entrenador": [
      "«Primer pase limpio».",
      "«Juega rápido».",
      "«Ataca la zona izquierda de finalización».",
      "«Filtra ahora».",
      "«Finaliza»."
    ],
    "montaje": [
      "Maniquí izquierdo en el lateral izquierdo de la frontal.",
      "Maniquí central en el centro y algo más adelantado hacia portería (representa un defensor).",
      "Maniquí derecho en el lateral derecho.",
      "Cola inicial retrasada y aproximadamente centrada."
    ],
    "desarrollo": [
      "A pasa desde la cola a B, junto al maniquí izquierdo.",
      "B recibe y pasa a C, junto al maniquí derecho.",
      "B sale del puesto izquierdo hacia la zona izquierda de finalización.",
      "C recibe.",
      "C mete un pase filtrado entre líneas hacia B.",
      "B recibe y finaliza a portería.",
      "El portero defiende.",
      "Rotación: C→izquierda, B→cola, A→derecha."
    ],
    "que_buscamos": [
      "Pase limpio y rápido.",
      "Perfil corporal orientado.",
      "Tercer hombre.",
      "Pase filtrado con timing.",
      "Temporización del desmarque.",
      "Definición."
    ],
    "que_observar": [
      "Geometría de los 3 maniquíes.",
      "Solo 3 jugadores activos.",
      "Timing del desmarque de B hacia portería.",
      "Calidad del pase filtrado.",
      "Orientación final."
    ],
    "correcciones": [
      "Primer pase impreciso.",
      "Segundo pase lento.",
      "Desmarque anticipado o tardío.",
      "Pase filtrado sin intención.",
      "Mala orientación en la finalización."
    ],
    "reglas": [
      "3 maniquíes: izquierdo, central y derecho.",
      "El central representa un defensor.",
      "3 jugadores activos + portero.",
      "Recorrido del balón: A → B → C → B → disparo.",
      "Rotación: C→izquierda, B→cola, A→derecha.",
      "Las distancias, tiempos, series y organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Reducir distancias.",
      "Permitir un control extra.",
      "Ralentizar el desmarque."
    ],
    "si_sale_bien": [
      "Aumentar velocidad del balón.",
      "Limitar toques.",
      "Exigir finalización con pierna no dominante."
    ],
    "variantes": [
      "Fútbol 7: 3 activos + 1 portero; resto en estaciones. · 8-12 min.",
      "Fútbol 11: 1-2 estaciones paralelas. · 10-14 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7507607569884646674.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "3 maniquíes: izquierdo, central y derecho.",
        "El central representa un defensor.",
        "3 jugadores activos + portero.",
        "Recorrido del balón: A → B → C → B → disparo.",
        "B se desmarca hacia la zona izquierda de finalización.",
        "C filtra a B entre líneas.",
        "Rotación: C→izquierda, B→cola, A→derecha.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-DEFINICION-PASE-ENTRE-LINEAS-FILTRADO/CampoBase_Definicion_Pase_Entre_Lineas_Filtrado_V2.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-DEFINICION-PASE-ENTRE-LINEAS-FILTRADO/frames/f",
    "total": 113,
    "frameMs": 144
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-DEFINICION-PASE-ENTRE-LINEAS-FILTRADO/video.mp4"
},
{
  "id": "CAMPOBASE-VIDEO-PASE-BALON-ESPACIO-2-CONOS-1V1-FINALIZACION",
  "nombre": "Pared inicial + circuito de conos + centro lateral y remate",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Pase",
      "Pared",
      "Circuito de conos",
      "Desmarque",
      "Centro lateral",
      "Remate",
      "Coordinación",
      "Portero"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 12,
      "organizacion": "Parejas alternando los roles de centrador y rematador, con 1 portero; el resto espera en cola."
    },
    "material": "1 portería, 1 portero, un circuito de conos bajos y altos y 1 balón.",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "A inicia con balón y pasa a B."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "A sale inmediatamente hacia el carril exterior."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "B devuelve el balón a A."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "B entra en el circuito de conos y completa el recorrido."
        },
        {
          "nombre": "Paso 5",
          "instruccion": "A progresa con balón por la banda."
        },
        {
          "nombre": "Paso 6",
          "instruccion": "B sale del circuito y ataca la zona de remate."
        },
        {
          "nombre": "Paso 7",
          "instruccion": "A realiza un centro lateral desde el carril exterior."
        },
        {
          "nombre": "Paso 8",
          "instruccion": "B ajusta su carrera y remata ante el portero."
        },
        {
          "nombre": "Paso 9",
          "instruccion": "La siguiente pareja inicia una nueva repetición."
        }
      ],
    "explicacion_breve": "Trabajan dos jugadores de campo y un portero. A inicia con balón, pasa a B y sale por la banda. B devuelve el balón y completa el circuito de conos para atacar el área. A progresa por fuera y realiza un centro lateral; B llega desde el circuito y remata a portería. Las dos acciones del vídeo son repeticiones del mismo ejercicio.",
    "leyenda": "A: pasador y centrador · B: apoyo, circuito de conos y rematador · P: portero · Naranja: conos · Blanco: pase/devolución · Amarillo: centro lateral"
  },
  "detalle": {
    "objetivos": [
      "Coordinar pared, desdoblamiento por banda y llegada al área.",
      "Mejorar la ejecución del centro lateral tras progresión.",
      "Trabajar el remate después de un circuito de coordinación."
    ],
    "claves_entrenador": [
      "«Pasa y sal por banda».",
      "«Devuelve y entra al circuito».",
      "«Levanta la cabeza antes de centrar».",
      "«Ataca el área con decisión».",
      "«Ajusta la carrera y remata»."
    ],
    "montaje": [
      "Colocar una portería con portero.",
      "Preparar una zona inicial de pase y devolución.",
      "Montar un circuito visible con conos bajos y altos para el rematador.",
      "Dejar un carril exterior libre para la progresión y el centro.",
      "Situar una cola de jugadores en la zona de inicio."
    ],
    "desarrollo": [
      "A inicia con balón y pasa a B.",
      "A sale inmediatamente hacia el carril exterior.",
      "B devuelve el balón a A.",
      "B entra en el circuito de conos y completa el recorrido.",
      "A progresa con balón por la banda.",
      "B sale del circuito y ataca la zona de remate.",
      "A realiza un centro lateral desde el carril exterior.",
      "B ajusta su carrera y remata ante el portero.",
      "La siguiente pareja inicia una nueva repetición."
    ],
    "que_buscamos": [
      "Precisión en el pase y la devolución.",
      "Sincronización entre la progresión exterior y el circuito.",
      "Centro lateral dirigido a la carrera del compañero.",
      "Llegada al área y remate con buen perfil corporal."
    ],
    "que_observar": [
      "A sale por fuera después del pase inicial.",
      "B completa el circuito de conos antes de entrar al área.",
      "El centro se produce desde el carril lateral.",
      "B llega al centro y finaliza ante el portero.",
      "No hay oposición entre los dos jugadores de campo."
    ],
    "correcciones": [
      "Esperar parado después del pase.",
      "Devolver el balón fuera de la carrera del centrador.",
      "Recortar o saltarse el circuito de conos.",
      "Centrar sin mirar la llegada del compañero.",
      "Entrar demasiado pronto o demasiado tarde al remate."
    ],
    "reglas": [
      "Participan dos jugadores de campo y un portero por repetición.",
      "A realiza el pase inicial, recibe la devolución, progresa por banda y centra.",
      "B devuelve, completa el circuito de conos y remata el centro.",
      "La acción termina con el remate a portería.",
      "Las dos secuencias del vídeo son repeticiones del mismo ejercicio.",
      "La rotación entre puestos, las distancias, los tiempos y la organización F7/F11 son adaptación CampoBase."
    ],
    "si_sale_mal": [
      "Acortar la distancia del circuito y del centro.",
      "Ensayar por separado la pared y la salida por banda.",
      "Realizar primero el circuito sin balón y terminar con un centro raso."
    ],
    "si_sale_bien": [
      "Aumentar el ritmo de la pared y de la llegada.",
      "Alternar centros rasos y a media altura.",
      "Exigir remate de primeras con ambas piernas."
    ],
    "variantes": [
      "Fútbol 7: una pareja activa + 1 portero; alternar centrador y rematador. · 10-12 min.",
      "Fútbol 11: montar el circuito por ambos lados y alternar centros. · 12-15 min."
    ],
    "fuente": {
      "documento": "Vídeo real: fin_7476067467341679927.mp4",
      "adaptacion_operativa": true,
      "notas": [
        "Migue confirma que es un circuito de conos con varios jugadores en cadena.",
        "No es un 1v1.",
        "Un jugador progresa por banda y centra; el otro completa el circuito y remata.",
        "Las dos secuencias del vídeo son repeticiones del mismo ejercicio.",
        "La rotación y la organización de las colas no se ven completas; se describen como adaptación operativa.",
        "El audio del vídeo no contiene instrucciones útiles del entrenador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-VIDEO-PASE-BALON-ESPACIO-2-CONOS-1V1-FINALIZACION/CampoBase_Circuito_Conos_Centro_Remate_V3.gif",
    "frames": "assets/ejercicios/CAMPOBASE-VIDEO-PASE-BALON-ESPACIO-2-CONOS-1V1-FINALIZACION/frames/f",
    "total": 150,
    "frameMs": 100
  },
  "video": "https://mdzpygfwugawlmknywxa.supabase.co/storage/v1/object/public/ejercicio-videos/CAMPOBASE-VIDEO-PASE-BALON-ESPACIO-2-CONOS-1V1-FINALIZACION/video.mp4"
},
{
  "id": "CAMPOBASE-PACK150-001-ESCALERA-BASICA-FRONTAL",
  "nombre": "Escalera básica frontal — un pie por cuadro",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": ["Coordinación", "Velocidad de pies", "Agilidad", "Desplazamiento"],
    "tiempo_estimado_15": "5-8 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8 en fila, uno por turno"
    },
    "material": "1 escalera de coordinación (o cinta adhesiva para marcar 10 cuadros de 30x30 cm)",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "El jugador entra por un extremo apoyando un pie por cuadro sin pisar líneas."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Al llegar al final, sale corriendo 5 metros más y desacelera."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Vuelve caminando por fuera."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "El siguiente turno inicia."
        }
      ],
    "explicacion_breve": "El jugador entra por un extremo de la escalera apoyando un pie por cuadro sin pisar las líneas. Al llegar al final sale corriendo 5 metros más, desacelera y vuelve caminando por fuera para que inicie el siguiente.",
    "leyenda": "Azul: jugador · Escalera blanca: coordinación · Flecha azul: carrera · Flecha amarilla discontinua: sprint"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar velocidad de pies.",
      "Mejorar la coordinación motora fina en desplazamiento hacia delante."
    ],
    "claves_entrenador": [
      "Mirar al frente, nunca al suelo.",
      "La coordinación se logra con visión periférica y ritmo constante."
    ],
    "montaje": [
      "Colocar la escalera en el suelo o marcar 10 cuadros de 30x30 cm con cinta.",
      "Dejar 5 metros libres al final para el sprint de salida."
    ],
    "desarrollo": [
      "El jugador entra por un extremo apoyando un pie por cuadro sin pisar líneas.",
      "Al llegar al final, sale corriendo 5 metros más y desacelera.",
      "Vuelve caminando por fuera.",
      "El siguiente turno inicia."
    ],
    "que_buscamos": [
      "Velocidad de pies.",
      "Coordinación motora fina.",
      "Ritmo constante."
    ],
    "que_observar": [
      "Un pie por cuadro.",
      "No pisar las líneas.",
      "Mirada al frente."
    ],
    "correcciones": [
      "Mirar al frente.",
      "Ritmo constante.",
      "No pisar las líneas."
    ],
    "reglas": [
      "Un pie por cuadro.",
      "No pisar las líneas.",
      "Salir corriendo 5 metros al final.",
      "Volver caminando por fuera."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Marcar los cuadros más grandes."
    ],
    "si_sale_bien": [
      "Aumentar la velocidad progresivamente hasta el máximo sin fallar la técnica."
    ],
    "variantes": [
      "Fútbol 7: 1-8 jugadores en fila, uno por turno. · 5-8 min.",
      "Fútbol 11: 1-8 jugadores en fila, uno por turno. · 5-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 001",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: media.",
        "Espacio: 3 x 1 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-001-ESCALERA-BASICA-FRONTAL/CampoBase_Escalera_Basica_Frontal.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-001-ESCALERA-BASICA-FRONTAL/frames/f",
    "total": 42,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-002-ESCALERA-DOS-PIES-POR-CUADRO",
  "nombre": "Escalera dos pies por cuadro",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": ["Cadencia de pies", "Ritmo de contacto", "Coordinación", "Equilibrio"],
    "tiempo_estimado_15": "5-8 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8 en fila, uno por turno"
    },
    "material": "1 escalera de coordinación",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Preparar escalera de 10 cuadros."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "El jugador entra apoyando AMBOS pies dentro de cada cuadro (izq-der en cada uno)."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Cadencia lo más rápida posible sin perder equilibrio."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Al salir, sprint de 5 m y regreso caminando."
        }
      ],
    "explicacion_breve": "El jugador entra por un extremo apoyando ambos pies dentro de cada cuadro (izquierda-derecha en cada uno), con la cadencia más rápida posible sin perder equilibrio. Al salir hace un sprint de 5 metros y vuelve caminando por fuera.",
    "leyenda": "Azul: jugador · Escalera blanca: coordinación · Flecha azul: carrera · Flecha amarilla discontinua: sprint"
  },
  "detalle": {
    "objetivos": [
      "Trabajar cadencia rápida de pies.",
      "Trabajar ritmo de contacto con el suelo."
    ],
    "claves_entrenador": [
      "Brazos siempre en movimiento sincronizado con los pies.",
      "Sin los brazos se pierde equilibrio y ritmo."
    ],
    "montaje": [
      "Preparar escalera de 10 cuadros."
    ],
    "desarrollo": [
      "Preparar escalera de 10 cuadros.",
      "El jugador entra apoyando AMBOS pies dentro de cada cuadro (izq-der en cada uno).",
      "Cadencia lo más rápida posible sin perder equilibrio.",
      "Al salir, sprint de 5 m y regreso caminando."
    ],
    "que_buscamos": [
      "Cadencia rápida de pies.",
      "Ritmo de contacto con el suelo.",
      "Equilibrio."
    ],
    "que_observar": [
      "Ambos pies dentro de cada cuadro.",
      "Cadencia rápida.",
      "Brazos sincronizados con los pies."
    ],
    "correcciones": [
      "Brazos sincronizados con los pies.",
      "No perder el equilibrio.",
      "Cadencia constante."
    ],
    "reglas": [
      "Ambos pies dentro de cada cuadro.",
      "Cadencia lo más rápida posible.",
      "Sprint de 5 m al salir.",
      "Regreso caminando."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Marcar los cuadros más grandes."
    ],
    "si_sale_bien": [
      "Cronometrar cada pasada y batir marca personal 3 veces por sesión."
    ],
    "variantes": [
      "Fútbol 7: 1-8 jugadores en fila, uno por turno. · 5-8 min.",
      "Fútbol 11: 1-8 jugadores en fila, uno por turno. · 5-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 002",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: media-alta.",
        "Espacio: 3 x 1 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-002-ESCALERA-DOS-PIES-POR-CUADRO/CampoBase_Escalera_Dos_Pies_Por_Cuadro.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-002-ESCALERA-DOS-PIES-POR-CUADRO/frames/f",
    "total": 33,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-003-ESCALERA-LATERAL-DENTRO-FUERA",
  "nombre": "Escalera lateral — dentro/fuera",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": ["Coordinación multiplanar", "Agilidad lateral", "Desplazamiento lateral"],
    "tiempo_estimado_15": "6-10 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8, uno por turno"
    },
    "material": "1 escalera de coordinación",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Ubicar al jugador de lado a la escalera."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Pie dominante entra en cuadro, luego el otro; salen ambos hacia el lado opuesto de la escalera."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Avanzar así hasta el final de la escalera, siempre lateralmente."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Repetir del lado contrario para trabajar ambos pies."
        }
      ],
    "explicacion_breve": "El jugador se coloca de lado a la escalera. El pie dominante entra en el cuadro y luego el otro; ambos salen hacia el lado opuesto. Avanza así hasta el final, siempre lateralmente, y repite del lado contrario para trabajar ambos pies.",
    "leyenda": "Azul: jugador · Escalera blanca: coordinación · Flecha azul: desplazamiento lateral"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar coordinación multiplanar.",
      "Desarrollar agilidad lateral."
    ],
    "claves_entrenador": [
      "Rodillas semiflexionadas siempre.",
      "Postura baja de defensor para transferir al juego real."
    ],
    "montaje": [
      "Colocar la escalera en el suelo."
    ],
    "desarrollo": [
      "Ubicar al jugador de lado a la escalera.",
      "Pie dominante entra en cuadro, luego el otro; salen ambos hacia el lado opuesto de la escalera.",
      "Avanzar así hasta el final de la escalera, siempre lateralmente.",
      "Repetir del lado contrario para trabajar ambos pies."
    ],
    "que_buscamos": [
      "Coordinación multiplanar.",
      "Agilidad lateral.",
      "Postura baja."
    ],
    "que_observar": [
      "Movimiento lateral.",
      "Rodillas semiflexionadas.",
      "Ambos pies trabajando."
    ],
    "correcciones": [
      "Rodillas semiflexionadas.",
      "Postura baja de defensor.",
      "Movimiento lateral constante."
    ],
    "reglas": [
      "De lado a la escalera.",
      "Pie dominante entra, luego el otro.",
      "Salir por el lado opuesto.",
      "Repetir del lado contrario."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Marcar los cuadros más grandes."
    ],
    "si_sale_bien": [
      "Añadir un balón conducido con la mano opuesta al desplazamiento."
    ],
    "variantes": [
      "Fútbol 7: 1-8 jugadores, uno por turno. · 6-10 min.",
      "Fútbol 11: 1-8 jugadores, uno por turno. · 6-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 003",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 3 x 2 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-003-ESCALERA-LATERAL-DENTRO-FUERA/CampoBase_Escalera_Lateral_Dentro_Fuera.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-003-ESCALERA-LATERAL-DENTRO-FUERA/frames/f",
    "total": 34,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-004-ICKY-SHUFFLE-ESCALERA",
  "nombre": "Icky Shuffle en escalera",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": ["Coordinación compleja", "Cambio de pie", "Patrón cruzado"],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 6,
      "organizacion": "1-6, uno por turno"
    },
    "material": "1 escalera de coordinación",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Iniciar con pie derecho FUERA lateral izquierdo de la escalera."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Entrar con pie izquierdo al primer cuadro, luego derecho."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Salir con pie izquierdo por el lado derecho de la escalera."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Repetir el patrón invertido en el próximo cuadro, avanzando en zigzag."
        }
      ],
    "explicacion_breve": "El jugador inicia con el pie derecho fuera (lateral izquierdo de la escalera), entra con el pie izquierdo al primer cuadro y luego el derecho, sale con el pie izquierdo por el lado derecho, y repite el patrón invertido en el próximo cuadro avanzando en zigzag.",
    "leyenda": "Azul: jugador · Escalera blanca: coordinación · Flecha azul: zigzag"
  },
  "detalle": {
    "objetivos": [
      "Automatizar patrones complejos de coordinación con cambio de pie."
    ],
    "claves_entrenador": [
      "Al principio hacer LENTO para aprender el patrón.",
      "La velocidad viene después, no antes."
    ],
    "montaje": [
      "Colocar la escalera en el suelo."
    ],
    "desarrollo": [
      "Iniciar con pie derecho FUERA lateral izquierdo de la escalera.",
      "Entrar con pie izquierdo al primer cuadro, luego derecho.",
      "Salir con pie izquierdo por el lado derecho de la escalera.",
      "Repetir el patrón invertido en el próximo cuadro, avanzando en zigzag."
    ],
    "que_buscamos": [
      "Automatización del patrón.",
      "Cambio de pie.",
      "Coordinación compleja."
    ],
    "que_observar": [
      "Patrón cruzado correcto.",
      "Cambio de pie.",
      "Avance en zigzag."
    ],
    "correcciones": [
      "Hacerlo lento primero.",
      "Aprender el patrón antes de acelerar.",
      "Cambio de pie correcto."
    ],
    "reglas": [
      "Pie derecho fuera, lateral izquierdo.",
      "Entrar izquierdo, luego derecho.",
      "Salir por el lado derecho.",
      "Repetir patrón invertido en zigzag."
    ],
    "si_sale_mal": [
      "Hacerlo lento hasta dominar el patrón.",
      "Descomponer el movimiento por partes."
    ],
    "si_sale_bien": [
      "Agregar salida explosiva con sprint de 8-10 metros."
    ],
    "variantes": [
      "Fútbol 7: 1-6 jugadores, uno por turno. · 8-10 min.",
      "Fútbol 11: 1-6 jugadores, uno por turno. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 004",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 3 x 2 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-004-ICKY-SHUFFLE-ESCALERA/CampoBase_Icky_Shuffle_Escalera.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-004-ICKY-SHUFFLE-ESCALERA/frames/f",
    "total": 40,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-005-ESCALERA-SALIDA-EXPLOSIVA-BALON",
  "nombre": "Escalera con salida explosiva a balón",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": ["Coordinación", "Recepción", "Control", "Salida explosiva"],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 mínimo (o pared)"
    },
    "material": "1 escalera + 1 balón",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Escalera colocada. Un asistente/compañero a 5 m del final con balón."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Jugador cruza la escalera (patrón a elección) y sale corriendo."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Al salir, recibe pase raso del compañero y controla con el pie más adecuado."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Devuelve pase, corre a la fila. Rotación."
        }
      ],
    "explicacion_breve": "Con la escalera colocada y un compañero a 5 m del final con balón, el jugador cruza la escalera (patrón a elección) y sale corriendo. Al salir recibe un pase raso y controla con el pie más adecuado, devuelve el pase y corre a la fila para rotar.",
    "leyenda": "Azul: jugador · Amarillo: compañero · Balón: pase raso · Flecha azul discontinua: pase"
  },
  "detalle": {
    "objetivos": [
      "Transferir la coordinación al gesto técnico real de recepción y control."
    ],
    "claves_entrenador": [
      "El control debe ser orientado hacia una zona libre, no simplemente parar el balón."
    ],
    "montaje": [
      "Escalera colocada.",
      "Un asistente/compañero a 5 m del final con balón."
    ],
    "desarrollo": [
      "Escalera colocada. Un asistente/compañero a 5 m del final con balón.",
      "Jugador cruza la escalera (patrón a elección) y sale corriendo.",
      "Al salir, recibe pase raso del compañero y controla con el pie más adecuado.",
      "Devuelve pase, corre a la fila. Rotación."
    ],
    "que_buscamos": [
      "Transferencia de la coordinación al gesto técnico.",
      "Recepción y control.",
      "Control orientado."
    ],
    "que_observar": [
      "Salida explosiva.",
      "Recepción del pase raso.",
      "Control orientado a zona libre."
    ],
    "correcciones": [
      "Control orientado a zona libre.",
      "No parar el balón.",
      "Salida explosiva."
    ],
    "reglas": [
      "Compañero a 5 m del final con balón.",
      "Cruzar la escalera y salir corriendo.",
      "Recibir pase raso y controlar.",
      "Devolver pase y rotar."
    ],
    "si_sale_mal": [
      "Reducir la velocidad de la escalera.",
      "Pase más lento y cercano."
    ],
    "si_sale_bien": [
      "Variar la altura del pase entrante (raso, medio, alto) para trabajar todas las superficies."
    ],
    "variantes": [
      "Fútbol 7: 2 jugadores mínimo (o pared). · 10-12 min.",
      "Fútbol 11: 2 jugadores mínimo (o pared). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 005",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 10 x 3 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-005-ESCALERA-SALIDA-EXPLOSIVA-BALON/CampoBase_Escalera_Salida_Explosiva_Balon.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-005-ESCALERA-SALIDA-EXPLOSIVA-BALON/frames/f",
    "total": 23,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-006-SLALOM-FRONTAL-CONOS",
  "nombre": "Slalom frontal entre conos",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": ["Aceleración corta", "Precisión de trayectoria", "Zigzag"],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10, uno por turno"
    },
    "material": "5 conos o marcadores",
    "series": [
        {
          "nombre": "Paso 1",
          "instruccion": "Colocar 5 conos en línea separados por 1,5 metros."
        },
        {
          "nombre": "Paso 2",
          "instruccion": "Jugador arranca a máxima velocidad haciendo zigzag entre los conos."
        },
        {
          "nombre": "Paso 3",
          "instruccion": "Al final, sprint recto de 5 m y desaceleración."
        },
        {
          "nombre": "Paso 4",
          "instruccion": "Vuelta trotando por fuera de los conos."
        }
      ],
    "explicacion_breve": "Con 5 conos en línea separados por 1,5 metros, el jugador arranca a máxima velocidad haciendo zigzag entre los conos. Al final hace un sprint recto de 5 metros y desacelera, y vuelve trotando por fuera de los conos.",
    "leyenda": "Azul: jugador · Cono naranja: marcador · Flecha azul: zigzag · Flecha amarilla discontinua: sprint"
  },
  "detalle": {
    "objetivos": [
      "Trabajar aceleración corta.",
      "Trabajar precisión de trayectoria."
    ],
    "claves_entrenador": [
      "El pie de apoyo debe pisar del lado externo del cono para cambiar de dirección con eficacia."
    ],
    "montaje": [
      "Colocar 5 conos en línea separados por 1,5 metros."
    ],
    "desarrollo": [
      "Colocar 5 conos en línea separados por 1,5 metros.",
      "Jugador arranca a máxima velocidad haciendo zigzag entre los conos.",
      "Al final, sprint recto de 5 m y desaceleración.",
      "Vuelta trotando por fuera de los conos."
    ],
    "que_buscamos": [
      "Aceleración corta.",
      "Precisión de trayectoria.",
      "Cambio de dirección."
    ],
    "que_observar": [
      "Zigzag entre conos.",
      "Pie de apoyo al lado externo del cono.",
      "Sprint final."
    ],
    "correcciones": [
      "Pie de apoyo al lado externo del cono.",
      "Cambio de dirección eficaz.",
      "Aceleración máxima."
    ],
    "reglas": [
      "5 conos en línea a 1,5 m.",
      "Zigzag a máxima velocidad.",
      "Sprint recto de 5 m al final.",
      "Vuelta trotando por fuera."
    ],
    "si_sale_mal": [
      "Separar más los conos.",
      "Reducir la velocidad inicial."
    ],
    "si_sale_bien": [
      "Agregar balón conducido durante el slalom, alternando pies."
    ],
    "variantes": [
      "Fútbol 7: 1-10 jugadores, uno por turno. · 6-8 min.",
      "Fútbol 11: 1-10 jugadores, uno por turno. · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 006",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: media.",
        "Espacio: 10 x 2 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-006-SLALOM-FRONTAL-CONOS/CampoBase_Slalom_Frontal_Conos.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-006-SLALOM-FRONTAL-CONOS/frames/f",
    "total": 50,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-007-SLALOM-LATERAL-DEFENSIVO",
  "nombre": "Slalom lateral defensivo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Postura defensiva",
      "Desplazamiento lateral",
      "Agilidad"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8, uno por turno"
    },
    "material": "5 conos",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Colocar 5 conos en línea con separación de 2 metros."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Jugador posicionado lateralmente al inicio, con rodillas flexionadas."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Se desplaza en zigzag entre los conos SIN cruzar los pies, mirando siempre al frente."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Al final, sprint frontal explosivo de 5 metros."
      }
    ],
    "explicacion_breve": "El jugador se desplaza lateralmente en zigzag entre 5 conos sin cruzar los pies, con rodillas flexionadas y mirando al frente, y termina con un sprint frontal de 5 metros.",
    "leyenda": "Azul: jugador (defensor) · Cono naranja: marcador · Flecha azul: desplazamiento lateral · Flecha amarilla discontinua: sprint"
  },
  "detalle": {
    "objetivos": [
      "Reforzar postura y desplazamiento del defensor en situación 1v1."
    ],
    "claves_entrenador": [
      "Los pies NUNCA se cruzan. Se separan y se juntan alternadamente, como un defensor real."
    ],
    "montaje": [
      "Colocar 5 conos en línea con separación de 2 metros."
    ],
    "desarrollo": [
      "Colocar 5 conos en línea con separación de 2 metros.",
      "Jugador posicionado lateralmente al inicio, con rodillas flexionadas.",
      "Se desplaza en zigzag entre los conos SIN cruzar los pies, mirando siempre al frente.",
      "Al final, sprint frontal explosivo de 5 metros."
    ],
    "que_buscamos": [
      "Postura defensiva",
      "Desplazamiento lateral",
      "Agilidad"
    ],
    "que_observar": [
      "Que los pies no se crucen.",
      "Postura baja de defensor.",
      "Mirada al frente."
    ],
    "correcciones": [
      "Separar y juntar los pies alternadamente.",
      "Bajar el centro de gravedad."
    ],
    "reglas": [
      "No cruzar los pies.",
      "Rodillas flexionadas.",
      "Mirar al frente.",
      "Sprint final de 5 m."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar una señal visual al final que indique hacia qué lado hacer el sprint."
    ],
    "variantes": [
      "Fútbol 7: 1-8, uno por turno. · 8-10 min.",
      "Fútbol 11: 1-8, uno por turno. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 007",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 10 x 3 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-007-SLALOM-LATERAL-DEFENSIVO/CampoBase_Slalom_Lateral_Defensivo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-007-SLALOM-LATERAL-DEFENSIVO/frames/f",
    "total": 50,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-008-CAMBIO-DIRECCION-CRUZ",
  "nombre": "Cambio de dirección en cruz (4 conos)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Frenado",
      "Giro",
      "Reaceleración",
      "Reacción"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 6,
      "organizacion": "1-6, uno por turno"
    },
    "material": "4 conos + 1 cono central",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Colocar 4 conos formando una cruz de 5 metros de radio, con uno en el centro."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Jugador en el centro. Adulto o entrenador nombra un cono (norte/sur/este/oeste)."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Jugador corre al cono nombrado, lo toca con la mano, y vuelve al centro."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Se le nombra el próximo cono en cuanto vuelve. 8-10 repeticiones."
      }
    ],
    "explicacion_breve": "Con 4 conos en cruz y uno central, el jugador corre al cono que nombra el entrenador, lo toca con la mano y vuelve al centro, repitiendo 8-10 veces.",
    "leyenda": "Azul: jugador · Cono naranja: marcador · Flecha azul: ida y vuelta"
  },
  "detalle": {
    "objetivos": [
      "Mejorar la capacidad de frenado, giro y reaceleración en múltiples direcciones."
    ],
    "claves_entrenador": [
      "El primer paso post-cambio debe ser explosivo y bajo. Nunca lento y de pie erguido."
    ],
    "montaje": [
      "Colocar 4 conos formando una cruz de 5 metros de radio, con uno en el centro."
    ],
    "desarrollo": [
      "Colocar 4 conos formando una cruz de 5 metros de radio, con uno en el centro.",
      "Jugador en el centro. Adulto o entrenador nombra un cono (norte/sur/este/oeste).",
      "Jugador corre al cono nombrado, lo toca con la mano, y vuelve al centro.",
      "Se le nombra el próximo cono en cuanto vuelve. 8-10 repeticiones."
    ],
    "que_buscamos": [
      "Frenado",
      "Giro",
      "Reaceleración",
      "Reacción"
    ],
    "que_observar": [
      "Primer paso explosivo y bajo.",
      "Frenado antes del giro.",
      "Reacción al estímulo."
    ],
    "correcciones": [
      "Primer paso explosivo y bajo.",
      "No frenar de pie erguido."
    ],
    "reglas": [
      "Tocar el cono con la mano.",
      "Volver al centro.",
      "Reaccionar al cono nombrado."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Realizar la misma dinámica conduciendo un balón hacia cada cono."
    ],
    "variantes": [
      "Fútbol 7: 1-6, uno por turno. · 8-10 min.",
      "Fútbol 11: 1-6, uno por turno. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 008",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 8 x 8 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-008-CAMBIO-DIRECCION-CRUZ/CampoBase_Cambio_Direccion_Cruz.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-008-CAMBIO-DIRECCION-CRUZ/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-009-T-DRILL-AGILIDAD",
  "nombre": "T-drill de agilidad",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Sprint",
      "Desplazamiento lateral",
      "Carrera atrás"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8, uno por turno"
    },
    "material": "4 conos",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Colocar 3 conos formando la parte superior de una T (separados 4 m entre sí), y 1 cono en la base a 8 m del central."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Jugador sale del cono base y hace sprint frontal hasta el cono central."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Se desplaza LATERALMENTE hasta el cono izquierdo, toca, y vuelve lateralmente al cono derecho."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Vuelve al central lateralmente, y corre HACIA ATRÁS al cono base."
      }
    ],
    "explicacion_breve": "En una T de 4 conos, el jugador hace sprint frontal al central, se desplaza lateralmente a izquierda y derecha, y vuelve corriendo hacia atrás a la base.",
    "leyenda": "Azul: jugador · Cono naranja: marcador · Flecha azul: recorrido · Flecha amarilla discontinua: carrera atrás"
  },
  "detalle": {
    "objetivos": [
      "Trabajar sprint, desplazamiento lateral y carrera atrás en un solo circuito."
    ],
    "claves_entrenador": [
      "Al desplazarse lateralmente, mantener el pecho apuntando al frente en TODO momento."
    ],
    "montaje": [
      "Colocar 3 conos formando la parte superior de una T (separados 4 m entre sí), y 1 cono en la base a 8 m del central."
    ],
    "desarrollo": [
      "Colocar 3 conos formando la parte superior de una T (separados 4 m entre sí), y 1 cono en la base a 8 m del central.",
      "Jugador sale del cono base y hace sprint frontal hasta el cono central.",
      "Se desplaza LATERALMENTE hasta el cono izquierdo, toca, y vuelve lateralmente al cono derecho.",
      "Vuelve al central lateralmente, y corre HACIA ATRÁS al cono base."
    ],
    "que_buscamos": [
      "Sprint",
      "Desplazamiento lateral",
      "Carrera atrás"
    ],
    "que_observar": [
      "Pecho al frente en el lateral.",
      "Tocar los conos.",
      "Carrera atrás controlada."
    ],
    "correcciones": [
      "Mantener el pecho al frente.",
      "No cruzar los pies en el lateral."
    ],
    "reglas": [
      "Sprint frontal al central.",
      "Lateral sin cruzar pies.",
      "Carrera atrás a la base."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Cronometrar y buscar romper récord personal semana a semana."
    ],
    "variantes": [
      "Fútbol 7: 1-8, uno por turno. · 10-12 min.",
      "Fútbol 11: 1-8, uno por turno. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 009",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 10 x 8 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-009-T-DRILL-AGILIDAD/CampoBase_T_Drill_Agilidad.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-009-T-DRILL-AGILIDAD/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-010-SPRINT-FRENO-REACCION-VISUAL",
  "nombre": "Sprint - freno - reacción visual",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Desaceleración",
      "Reacción",
      "Sprint"
    ],
    "tiempo_estimado_15": "10 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2+ (uno corre, otro da la señal)"
    },
    "material": "2 conos de colores distintos",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Colocar 2 conos de colores diferentes a 5 m de distancia entre sí."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Jugador arranca sprint de 8 m hacia una zona neutra."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "El entrenador levanta la mano o grita un color EN el momento del sprint."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "El jugador debe frenar y correr al cono del color indicado."
      }
    ],
    "explicacion_breve": "El jugador hace un sprint de 8 m y, cuando el entrenador grita un color, frena y corre al cono de ese color.",
    "leyenda": "Azul: jugador · Cono rojo/azul: destino · Flecha azul: sprint · Flecha amarilla discontinua: reacción"
  },
  "detalle": {
    "objetivos": [
      "Entrenar la desaceleración controlada y la respuesta a estímulo externo."
    ],
    "claves_entrenador": [
      "El freno se hace bajando el centro de gravedad, NO apretando talones. Rodillas absorben el impacto."
    ],
    "montaje": [
      "Colocar 2 conos de colores diferentes a 5 m de distancia entre sí."
    ],
    "desarrollo": [
      "Colocar 2 conos de colores diferentes a 5 m de distancia entre sí.",
      "Jugador arranca sprint de 8 m hacia una zona neutra.",
      "El entrenador levanta la mano o grita un color EN el momento del sprint.",
      "El jugador debe frenar y correr al cono del color indicado."
    ],
    "que_buscamos": [
      "Desaceleración",
      "Reacción",
      "Sprint"
    ],
    "que_observar": [
      "Freno bajando el centro de gravedad.",
      "Rodillas absorben el impacto.",
      "Reacción al color."
    ],
    "correcciones": [
      "Bajar el centro de gravedad al frenar.",
      "No apretar los talones."
    ],
    "reglas": [
      "Sprint de 8 m.",
      "Frenar al oír el color.",
      "Correr al cono indicado."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar un tercer color y estímulo auditivo doble (voz + palma) para desafiar la atención."
    ],
    "variantes": [
      "Fútbol 7: 2+ (uno corre, otro da la señal). · 10 min.",
      "Fútbol 11: 2+ (uno corre, otro da la señal). · 10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 010",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 15 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-010-SPRINT-FRENO-REACCION-VISUAL/CampoBase_Sprint_Freno_Reaccion_Visual.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-010-SPRINT-FRENO-REACCION-VISUAL/frames/f",
    "total": 50,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-011-EJERCICIO-SEMAFORO",
  "nombre": "Ejercicio del semáforo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Reacción visual",
      "Control corporal"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15, corriendo libremente"
    },
    "material": "Ninguno (voz o pañuelos)",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Jugadores corren libremente por el espacio a ritmo suave."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Entrenador grita 'ROJO' → todos frenan inmediatamente y se quedan quietos."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "'AMARILLO' → trote muy suave en el sitio."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "'VERDE' → sprint corto de 5 m hacia adelante."
      }
    ],
    "explicacion_breve": "Los jugadores corren libremente y reaccionan a las señales: ROJO frenan, AMARILLO trote en el sitio, VERDE sprint de 5 m.",
    "leyenda": "Azul: jugador · Flecha azul: movimiento"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar reacción a estímulos visuales y control corporal simultáneos."
    ],
    "claves_entrenador": [
      "El objetivo NO es la velocidad — es que la reacción sea inmediata al estímulo."
    ],
    "montaje": [
      "Jugadores corren libremente por el espacio a ritmo suave."
    ],
    "desarrollo": [
      "Jugadores corren libremente por el espacio a ritmo suave.",
      "Entrenador grita 'ROJO' → todos frenan inmediatamente y se quedan quietos.",
      "'AMARILLO' → trote muy suave en el sitio.",
      "'VERDE' → sprint corto de 5 m hacia adelante."
    ],
    "que_buscamos": [
      "Reacción visual",
      "Control corporal"
    ],
    "que_observar": [
      "Reacción inmediata.",
      "Control corporal.",
      "Atención al estímulo."
    ],
    "correcciones": [
      "Reaccionar al instante.",
      "No anticiparse a la señal."
    ],
    "reglas": [
      "ROJO: frenar.",
      "AMARILLO: trote en el sitio.",
      "VERDE: sprint de 5 m."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Añadir señales visuales (pañuelos de colores) sin voz para forzar atención visual constante."
    ],
    "variantes": [
      "Fútbol 7: 1-15, corriendo libremente. · 8-10 min.",
      "Fútbol 11: 1-15, corriendo libremente. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 011",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: media.",
        "Espacio: 15 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-011-EJERCICIO-SEMAFORO/CampoBase_Ejercicio_Semaforo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-011-EJERCICIO-SEMAFORO/frames/f",
    "total": 40,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-012-REACCION-BALON-CAIDO",
  "nombre": "Reacción al balón caído",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Tiempo de reacción",
      "Arranque explosivo"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (uno con balón, otro reacciona)"
    },
    "material": "1 balón",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Adulto/compañero sostiene el balón con brazo estirado a la altura del hombro."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Jugador a 3 m de frente, en postura básica de defensor (rodillas flexionadas)."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "En cualquier momento, el balón cae. El jugador debe correr y agarrarlo (o tocarlo) antes del segundo bote."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "10 repeticiones. Alternar roles."
      }
    ],
    "explicacion_breve": "El compañero sostiene el balón con el brazo estirado y lo suelta; el jugador, a 3 m en postura de defensor, corre a agarrarlo antes del segundo bote.",
    "leyenda": "Azul: jugador · Amarillo: compañero · Balón: cae · Flecha azul: arranque"
  },
  "detalle": {
    "objetivos": [
      "Trabajar tiempo de reacción y arranque explosivo desde parada."
    ],
    "claves_entrenador": [
      "La postura de espera es CLAVE. Rodillas bajas, peso adelante, no de pie erguido esperando."
    ],
    "montaje": [
      "Adulto/compañero sostiene el balón con brazo estirado a la altura del hombro."
    ],
    "desarrollo": [
      "Adulto/compañero sostiene el balón con brazo estirado a la altura del hombro.",
      "Jugador a 3 m de frente, en postura básica de defensor (rodillas flexionadas).",
      "En cualquier momento, el balón cae. El jugador debe correr y agarrarlo (o tocarlo) antes del segundo bote.",
      "10 repeticiones. Alternar roles."
    ],
    "que_buscamos": [
      "Tiempo de reacción",
      "Arranque explosivo"
    ],
    "que_observar": [
      "Postura de espera.",
      "Arranque explosivo.",
      "Reacción al balón."
    ],
    "correcciones": [
      "Rodillas bajas, peso adelante.",
      "No esperar de pie erguido."
    ],
    "reglas": [
      "Postura de defensor.",
      "Agarrar antes del segundo bote.",
      "Alternar roles."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar la distancia progresivamente (4 m, 5 m, 6 m) y variar la altura desde donde cae el balón."
    ],
    "variantes": [
      "Fútbol 7: 2 (uno con balón, otro reacciona). · 6-8 min.",
      "Fútbol 11: 2 (uno con balón, otro reacciona). · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 012",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: media-alta.",
        "Espacio: 5 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-012-REACCION-BALON-CAIDO/CampoBase_Reaccion_Balon_Caido.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-012-REACCION-BALON-CAIDO/frames/f",
    "total": 40,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-013-SALTOS-OBSTACULOS-BAJOS",
  "nombre": "Saltos sobre obstáculos bajos",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Potencia reactiva",
      "Coordinación de aterrizaje"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 6,
      "organizacion": "1-6, uno por turno"
    },
    "material": "4-6 conos bajos o aros",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Colocar 4-6 obstáculos bajos (15-25 cm) en línea, separados por 60 cm."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "El jugador salta con AMBOS pies juntos sobre cada obstáculo."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "El contacto con el suelo entre saltos debe ser MÍNIMO (efecto rebote)."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Al terminar la línea, sprint corto de 5 m."
      }
    ],
    "explicacion_breve": "El jugador salta con ambos pies juntos sobre 4-6 obstáculos bajos en línea, con contacto mínimo con el suelo, y termina con un sprint de 5 m.",
    "leyenda": "Azul: jugador · Valla amarilla: obstáculo · Flecha azul: recorrido · Flecha amarilla discontinua: sprint"
  },
  "detalle": {
    "objetivos": [
      "Trabajar potencia reactiva del tren inferior y coordinación de aterrizaje."
    ],
    "claves_entrenador": [
      "El aterrizaje debe ser silencioso. Ruido fuerte al caer = mala absorción de impacto."
    ],
    "montaje": [
      "Colocar 4-6 obstáculos bajos (15-25 cm) en línea, separados por 60 cm."
    ],
    "desarrollo": [
      "Colocar 4-6 obstáculos bajos (15-25 cm) en línea, separados por 60 cm.",
      "El jugador salta con AMBOS pies juntos sobre cada obstáculo.",
      "El contacto con el suelo entre saltos debe ser MÍNIMO (efecto rebote).",
      "Al terminar la línea, sprint corto de 5 m."
    ],
    "que_buscamos": [
      "Potencia reactiva",
      "Coordinación de aterrizaje"
    ],
    "que_observar": [
      "Aterrizaje silencioso.",
      "Efecto rebote.",
      "Ambos pies juntos."
    ],
    "correcciones": [
      "Aterrizar silencioso.",
      "Absorber el impacto con las rodillas."
    ],
    "reglas": [
      "Saltar con ambos pies juntos.",
      "Contacto mínimo con el suelo.",
      "Sprint final de 5 m."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Alternar saltos: 2 pies → 1 pie izquierdo → 1 pie derecho, cambiando cada 2 obstáculos."
    ],
    "variantes": [
      "Fútbol 7: 1-6, uno por turno. · 8-10 min.",
      "Fútbol 11: 1-6, uno por turno. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 013",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 5 x 2 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-013-SALTOS-OBSTACULOS-BAJOS/CampoBase_Saltos_Obstaculos_Bajos.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-013-SALTOS-OBSTACULOS-BAJOS/frames/f",
    "total": 50,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-014-SALTO-LATERAL-LINEA",
  "nombre": "Salto lateral sobre línea (skater jumps)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Estabilidad lateral",
      "Transferencia de peso"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8, uno por turno"
    },
    "material": "1 línea marcada o cinta",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Marcar una línea recta en el suelo. Jugador de pie a un lado."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Salta LATERALMENTE cruzando la línea, aterrizando con el pie contrario (izq → der, der → izq)."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Al aterrizar, sostener 1 segundo en equilibrio antes del próximo salto."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "3 series de 10 saltos por lado."
      }
    ],
    "explicacion_breve": "El jugador salta lateralmente cruzando una línea, aterrizando con el pie contrario y sosteniendo 1 segundo de equilibrio antes del siguiente salto.",
    "leyenda": "Azul: jugador · Línea blanca: marca · Flecha azul: salto lateral"
  },
  "detalle": {
    "objetivos": [
      "Fortalecer estabilidad lateral y transferencia de peso pierna a pierna."
    ],
    "claves_entrenador": [
      "Al aterrizar, la rodilla NO debe caer hacia adentro. Alineada con el pie."
    ],
    "montaje": [
      "Marcar una línea recta en el suelo. Jugador de pie a un lado."
    ],
    "desarrollo": [
      "Marcar una línea recta en el suelo. Jugador de pie a un lado.",
      "Salta LATERALMENTE cruzando la línea, aterrizando con el pie contrario (izq → der, der → izq).",
      "Al aterrizar, sostener 1 segundo en equilibrio antes del próximo salto.",
      "3 series de 10 saltos por lado."
    ],
    "que_buscamos": [
      "Estabilidad lateral",
      "Transferencia de peso"
    ],
    "que_observar": [
      "Rodilla alineada con el pie.",
      "Equilibrio al aterrizar.",
      "Transferencia de peso."
    ],
    "correcciones": [
      "No dejar caer la rodilla hacia adentro.",
      "Alinear rodilla con el pie."
    ],
    "reglas": [
      "Aterrizar con el pie contrario.",
      "Sostener 1 s de equilibrio.",
      "3 series de 10 saltos."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar la distancia del salto poco a poco y luego eliminar la pausa de aterrizaje."
    ],
    "variantes": [
      "Fútbol 7: 1-8, uno por turno. · 6-8 min.",
      "Fútbol 11: 1-8, uno por turno. · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 014",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media-alta.",
        "Espacio: 2 x 1 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-014-SALTO-LATERAL-LINEA/CampoBase_Salto_Lateral_Linea.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-014-SALTO-LATERAL-LINEA/frames/f",
    "total": 40,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-015-SALTO-PROFUNDIDAD-ARRANQUE",
  "nombre": "Salto en profundidad + arranque",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Potencia de salto",
      "Sprint inmediato"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 6,
      "organizacion": "1-6, uno por turno"
    },
    "material": "1 caja o step de 30 cm",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Colocar un step o caja baja (30 cm) al inicio del recorrido."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Jugador se sube al step, y cae con ambos pies."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "En el momento del aterrizaje, arranca inmediatamente en sprint de 8 metros."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "5-6 repeticiones con recuperación completa entre cada una."
      }
    ],
    "explicacion_breve": "El jugador se sube a un step de 30 cm, cae con ambos pies y arranca inmediatamente en un sprint de 8 metros.",
    "leyenda": "Azul: jugador · Caja marrón: step 30 cm · Flecha azul discontinua: caída · Flecha amarilla: sprint"
  },
  "detalle": {
    "objetivos": [
      "Transferir la potencia del salto en acción de sprint inmediato."
    ],
    "claves_entrenador": [
      "La transición aterrizaje-sprint debe ser INSTANTÁNEA. Sin pausa, sin ajuste, salir ya."
    ],
    "montaje": [
      "Colocar un step o caja baja (30 cm) al inicio del recorrido."
    ],
    "desarrollo": [
      "Colocar un step o caja baja (30 cm) al inicio del recorrido.",
      "Jugador se sube al step, y cae con ambos pies.",
      "En el momento del aterrizaje, arranca inmediatamente en sprint de 8 metros.",
      "5-6 repeticiones con recuperación completa entre cada una."
    ],
    "que_buscamos": [
      "Potencia de salto",
      "Sprint inmediato"
    ],
    "que_observar": [
      "Transición instantánea.",
      "Caída con ambos pies.",
      "Sprint explosivo."
    ],
    "correcciones": [
      "Salir sin pausa tras aterrizar.",
      "No ajustar la postura antes de arrancar."
    ],
    "reglas": [
      "Caer con ambos pies.",
      "Arrancar al instante.",
      "Sprint de 8 m."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar la altura del step gradualmente (nunca más de 50 cm en menores de 15 años)."
    ],
    "variantes": [
      "Fútbol 7: 1-6, uno por turno. · 8-10 min.",
      "Fútbol 11: 1-6, uno por turno. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 015",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 10 x 2 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-015-SALTO-PROFUNDIDAD-ARRANQUE/CampoBase_Salto_Profundidad_Arranque.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-015-SALTO-PROFUNDIDAD-ARRANQUE/frames/f",
    "total": 40,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-016-COORDINACION-CRUZADA",
  "nombre": "Coordinación cruzada rodilla-mano opuesta",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Coordinación cruzada",
      "Estabilidad postural"
    ],
    "tiempo_estimado_15": "5-6 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15, individual"
    },
    "material": "Ninguno",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Jugador de pie, brazos a los lados."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Sube rodilla derecha y toca con mano IZQUIERDA."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Baja. Sube rodilla izquierda, toca con mano derecha."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Ritmo constante, 30 segundos. Descansa 15. Repite 4 veces."
      }
    ],
    "explicacion_breve": "De pie, el jugador sube la rodilla derecha y la toca con la mano izquierda, y viceversa, a ritmo constante durante 30 segundos.",
    "leyenda": "Azul: jugador · Flecha azul: movimiento cruzado"
  },
  "detalle": {
    "objetivos": [
      "Trabajar coordinación cruzada del cerebro y estabilidad postural."
    ],
    "claves_entrenador": [
      "El objetivo no es velocidad — es coordinación cruzada limpia. Si se pierde, bajar ritmo."
    ],
    "montaje": [
      "Jugador de pie, brazos a los lados."
    ],
    "desarrollo": [
      "Jugador de pie, brazos a los lados.",
      "Sube rodilla derecha y toca con mano IZQUIERDA.",
      "Baja. Sube rodilla izquierda, toca con mano derecha.",
      "Ritmo constante, 30 segundos. Descansa 15. Repite 4 veces."
    ],
    "que_buscamos": [
      "Coordinación cruzada",
      "Estabilidad postural"
    ],
    "que_observar": [
      "Coordinación cruzada limpia.",
      "Estabilidad postural.",
      "Ritmo constante."
    ],
    "correcciones": [
      "Bajar el ritmo si se pierde la coordinación.",
      "Movimiento cruzado limpio."
    ],
    "reglas": [
      "Rodilla derecha con mano izquierda.",
      "Rodilla izquierda con mano derecha.",
      "Ritmo constante."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Cerrar los ojos durante el ejercicio para desafiar propiocepción."
    ],
    "variantes": [
      "Fútbol 7: 1-15, individual. · 5-6 min.",
      "Fútbol 11: 1-15, individual. · 5-6 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 016",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: baja.",
        "Espacio: 1 x 1 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-016-COORDINACION-CRUZADA/CampoBase_Coordinacion_Cruzada.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-016-COORDINACION-CRUZADA/frames/f",
    "total": 30,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-017-SKIPPING-ALTO-SPRINT",
  "nombre": "Skipping alto con progresión a sprint",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Activación del muslo",
      "Carrera explosiva"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10, uno por turno"
    },
    "material": "Ninguno (conos opcional)",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Jugador arranca haciendo skipping alto (rodillas al pecho) durante 5 metros."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Al llegar al cono/marca, transiciona a sprint durante 10 metros."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Desacelera y vuelve caminando."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "6-8 repeticiones con pausa entre cada una."
      }
    ],
    "explicacion_breve": "El jugador hace skipping alto (rodillas al pecho) durante 5 m y, al llegar al cono, transiciona a un sprint de 10 m.",
    "leyenda": "Azul: jugador · Cono naranja: marca · Flecha azul: skipping · Flecha amarilla: sprint"
  },
  "detalle": {
    "objetivos": [
      "Activar musculatura del muslo y transferir a la carrera explosiva."
    ],
    "claves_entrenador": [
      "En el skipping, los brazos deben acompañar activamente el movimiento — no colgar inertes."
    ],
    "montaje": [
      "Jugador arranca haciendo skipping alto (rodillas al pecho) durante 5 metros."
    ],
    "desarrollo": [
      "Jugador arranca haciendo skipping alto (rodillas al pecho) durante 5 metros.",
      "Al llegar al cono/marca, transiciona a sprint durante 10 metros.",
      "Desacelera y vuelve caminando.",
      "6-8 repeticiones con pausa entre cada una."
    ],
    "que_buscamos": [
      "Activación del muslo",
      "Carrera explosiva"
    ],
    "que_observar": [
      "Rodillas al pecho.",
      "Brazos activos.",
      "Transición a sprint."
    ],
    "correcciones": [
      "Acompañar con los brazos.",
      "No colgar los brazos inertes."
    ],
    "reglas": [
      "Skipping alto 5 m.",
      "Sprint 10 m.",
      "Brazos activos."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Alternar variantes: talones al glúteo, saltos alternados, skipping lateral."
    ],
    "variantes": [
      "Fútbol 7: 1-10, uno por turno. · 6-8 min.",
      "Fútbol 11: 1-10, uno por turno. · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 017",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 15 x 2 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-017-SKIPPING-ALTO-SPRINT/CampoBase_Skipping_Alto_Sprint.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-017-SKIPPING-ALTO-SPRINT/frames/f",
    "total": 40,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-018-TALONES-GLUTEO-SPRINT",
  "nombre": "Talones al glúteo con sprint final",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Fase de recobro",
      "Aceleración"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10, uno por turno"
    },
    "material": "Ninguno",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Jugador arranca 'pateando' con los talones hacia el glúteo durante 5 metros."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Al llegar a la marca, cambia a sprint durante 10 metros."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Desacelera y camina al punto de inicio."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "6-8 repeticiones."
      }
    ],
    "explicacion_breve": "El jugador patea con los talones hacia el glúteo durante 5 m y, al llegar a la marca, cambia a un sprint de 10 m.",
    "leyenda": "Azul: jugador · Cono naranja: marca · Flecha azul: talones al glúteo · Flecha amarilla: sprint"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la fase de recobro de la carrera y transferir a la aceleración."
    ],
    "claves_entrenador": [
      "El talón debe TOCAR el glúteo. Si no llega, se está haciendo mal — bajar velocidad, mejorar técnica."
    ],
    "montaje": [
      "Jugador arranca 'pateando' con los talones hacia el glúteo durante 5 metros."
    ],
    "desarrollo": [
      "Jugador arranca 'pateando' con los talones hacia el glúteo durante 5 metros.",
      "Al llegar a la marca, cambia a sprint durante 10 metros.",
      "Desacelera y camina al punto de inicio.",
      "6-8 repeticiones."
    ],
    "que_buscamos": [
      "Fase de recobro",
      "Aceleración"
    ],
    "que_observar": [
      "El talón toca el glúteo.",
      "Fase de recobro.",
      "Transición a sprint."
    ],
    "correcciones": [
      "Bajar velocidad si el talón no llega.",
      "Mejorar la técnica de recobro."
    ],
    "reglas": [
      "Talones al glúteo 5 m.",
      "Sprint 10 m.",
      "El talón toca el glúteo."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Combinar en circuito con skipping alto y sprint (ejercicio 22 usa esta base)."
    ],
    "variantes": [
      "Fútbol 7: 1-10, uno por turno. · 6-8 min.",
      "Fútbol 11: 1-10, uno por turno. · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 018",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 15 x 2 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-018-TALONES-GLUTEO-SPRINT/CampoBase_Talones_Gluteo_Sprint.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-018-TALONES-GLUTEO-SPRINT/frames/f",
    "total": 40,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-019-CIRCUITO-COORDINATIVO-COMPLETO",
  "nombre": "Circuito coordinativo completo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Coordinación",
      "Finalización",
      "Circuito"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3+ mínimo"
    },
    "material": "1 escalera, 5 conos, 3 obstáculos, 1 balón, 1 portería",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Secuencia 1: escalera (patrón a elección) - 5 m."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Secuencia 2: slalom entre 5 conos - 5 m."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Secuencia 3: saltos sobre 3 obstáculos bajos - 3 m."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Secuencia 4: recibir pase y finalizar a portería."
      }
    ],
    "explicacion_breve": "Circuito de 4 secuencias: escalera, slalom entre conos, saltos sobre obstáculos y finalización a portería tras recibir un pase.",
    "leyenda": "Azul: jugador · Escalera/conos/vallas: secuencias · Balón: pase · Portería: finalización"
  },
  "detalle": {
    "objetivos": [
      "Integrar escalera, slalom, salto y finalización en secuencia realista."
    ],
    "claves_entrenador": [
      "Es un circuito realista, no un test. La calidad de la finalización importa más que el tiempo."
    ],
    "montaje": [
      "Secuencia 1: escalera (patrón a elección) - 5 m."
    ],
    "desarrollo": [
      "Secuencia 1: escalera (patrón a elección) - 5 m.",
      "Secuencia 2: slalom entre 5 conos - 5 m.",
      "Secuencia 3: saltos sobre 3 obstáculos bajos - 3 m.",
      "Secuencia 4: recibir pase y finalizar a portería."
    ],
    "que_buscamos": [
      "Coordinación",
      "Finalización",
      "Circuito"
    ],
    "que_observar": [
      "Calidad de la finalización.",
      "Encadenar las secuencias.",
      "Control antes del remate."
    ],
    "correcciones": [
      "Priorizar la calidad de la finalización.",
      "No correr por correr."
    ],
    "reglas": [
      "Escalera, slalom, saltos y finalización.",
      "Recibir pase antes de rematar.",
      "Calidad en la finalización."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Cronometrar el circuito completo y competir por mejor tiempo entre jugadores."
    ],
    "variantes": [
      "Fútbol 7: 3+ mínimo. · 15-20 min.",
      "Fútbol 11: 3+ mínimo. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 019",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 20 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-019-CIRCUITO-COORDINATIVO-COMPLETO/CampoBase_Circuito_Coordinativo_Completo_v4.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-019-CIRCUITO-COORDINATIVO-COMPLETO/frames/f",
    "total": 72,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-020-REACCION-PELOTAS-TENIS",
  "nombre": "Reacción con pelotas de tenis",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Reflejos oculares",
      "Coordinación óculo-manual",
      "Velocidad de reacción"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (uno tira, otro reacciona)"
    },
    "material": "2 pelotas de tenis",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Jugador de pie frente al compañero a 2 m de distancia, brazos abajo."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Compañero suelta o tira SUAVEMENTE una pelota. Jugador debe agarrarla antes del primer bote."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Progresivamente, compañero tira DOS pelotas simultáneas (una a cada mano)."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "3 series de 20 segundos, 30 segundos de descanso."
      }
    ],
    "explicacion_breve": "El compañero suelta una pelota de tenis y el jugador debe agarrarla antes del primer bote; luego se progresa a dos pelotas simultáneas.",
    "leyenda": "Azul: jugador · Amarillo: compañero · Pelota: cae · Flecha azul: reacción"
  },
  "detalle": {
    "objetivos": [
      "Entrenar reflejos oculares, coordinación óculo-manual y velocidad de reacción."
    ],
    "claves_entrenador": [
      "La postura de espera es CLAVE — rodillas semiflexionadas, brazos relajados listos para reaccionar."
    ],
    "montaje": [
      "Jugador de pie frente al compañero a 2 m de distancia, brazos abajo."
    ],
    "desarrollo": [
      "Jugador de pie frente al compañero a 2 m de distancia, brazos abajo.",
      "Compañero suelta o tira SUAVEMENTE una pelota. Jugador debe agarrarla antes del primer bote.",
      "Progresivamente, compañero tira DOS pelotas simultáneas (una a cada mano).",
      "3 series de 20 segundos, 30 segundos de descanso."
    ],
    "que_buscamos": [
      "Reflejos oculares",
      "Coordinación óculo-manual",
      "Velocidad de reacción"
    ],
    "que_observar": [
      "Reflejos oculares.",
      "Coordinación óculo-manual.",
      "Postura de espera."
    ],
    "correcciones": [
      "Rodillas semiflexionadas.",
      "Brazos relajados listos para reaccionar."
    ],
    "reglas": [
      "Agarrar antes del primer bote.",
      "Postura de espera.",
      "Progresar a dos pelotas."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Variar la altura y velocidad de las pelotas, o usar 3 pelotas de colores con reglas."
    ],
    "variantes": [
      "Fútbol 7: 2 (uno tira, otro reacciona). · 6-8 min.",
      "Fútbol 11: 2 (uno tira, otro reacciona). · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 020",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: 3 x 3 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-020-REACCION-PELOTAS-TENIS/CampoBase_Reaccion_Pelotas_Tenis_v4.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-020-REACCION-PELOTAS-TENIS/frames/f",
    "total": 48,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-021-ESPEJO-COMPANERO",
  "nombre": "Espejo del compañero (mirroring)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Reacción visual",
      "Anticipación"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "Ninguno",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Dos jugadores frente a frente separados por 2 metros."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Uno es 'líder' y se mueve libremente (adelante, atrás, laterales, saltos suaves)."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "El otro debe COPIAR sus movimientos como si fuera un espejo, en tiempo real."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Cambiar roles cada 30 segundos. 6-8 rondas."
      }
    ],
    "explicacion_breve": "Dos jugadores frente a frente: uno es líder y se mueve libremente, el otro copia sus movimientos como un espejo en tiempo real, cambiando roles cada 30 segundos.",
    "leyenda": "Azul: líder (A) · Amarillo: espejo (B) · Flecha: movimiento"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar reacción visual y capacidad de anticipación en 1v1."
    ],
    "claves_entrenador": [
      "El objetivo NO es imitar exacto — es reaccionar rápido. Mirar caderas del líder, no pies."
    ],
    "montaje": [
      "Dos jugadores frente a frente separados por 2 metros."
    ],
    "desarrollo": [
      "Dos jugadores frente a frente separados por 2 metros.",
      "Uno es 'líder' y se mueve libremente (adelante, atrás, laterales, saltos suaves).",
      "El otro debe COPIAR sus movimientos como si fuera un espejo, en tiempo real.",
      "Cambiar roles cada 30 segundos. 6-8 rondas."
    ],
    "que_buscamos": [
      "Reacción visual",
      "Anticipación"
    ],
    "que_observar": [
      "Reacción rápida.",
      "Anticipación.",
      "Mirada a las caderas."
    ],
    "correcciones": [
      "Mirar las caderas, no los pies.",
      "Reaccionar rápido, no imitar exacto."
    ],
    "reglas": [
      "Copiar en tiempo real.",
      "Cambiar roles cada 30 s.",
      "Mirar las caderas del líder."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar balón (líder conduce, seguidor debe reflejar sin balón), o hacer 2v2."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 8-10 min.",
      "Fútbol 11: 2 por pareja. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 021",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 5 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-021-ESPEJO-COMPANERO/CampoBase_Espejo_Companero.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-021-ESPEJO-COMPANERO/frames/f",
    "total": 40,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-022-AGILIDAD-REACTIVA-1V1",
  "nombre": "Agilidad reactiva 1v1 sin balón (sombreado)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Agilidad",
      "Marcaje individual"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "4 conos delimitando zona",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Delimitar una zona rectangular con 4 conos."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Un jugador es 'atacante' — se mueve libremente por la zona sin balón, cambiando de dirección."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Otro es 'defensor' — debe seguirlo a 1-2 m de distancia, sin dejarse superar."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "60 segundos por ronda. Cambio de roles. 4-6 rondas."
      }
    ],
    "explicacion_breve": "En una zona rectangular, el atacante se mueve libremente sin balón y el defensor lo sigue a 1-2 m sin dejarse superar, durante 60 segundos por ronda.",
    "leyenda": "Azul: atacante (A) · Púrpura: defensor (D) · Flecha azul: movimiento"
  },
  "detalle": {
    "objetivos": [
      "Transferir agilidad al gesto real de marcaje individual."
    ],
    "claves_entrenador": [
      "El defensor debe mirar el CENTRO DE GRAVEDAD del atacante (caderas), no los pies o el balón."
    ],
    "montaje": [
      "Delimitar una zona rectangular con 4 conos."
    ],
    "desarrollo": [
      "Delimitar una zona rectangular con 4 conos.",
      "Un jugador es 'atacante' — se mueve libremente por la zona sin balón, cambiando de dirección.",
      "Otro es 'defensor' — debe seguirlo a 1-2 m de distancia, sin dejarse superar.",
      "60 segundos por ronda. Cambio de roles. 4-6 rondas."
    ],
    "que_buscamos": [
      "Agilidad",
      "Marcaje individual"
    ],
    "que_observar": [
      "Distancia de marcaje.",
      "Centro de gravedad del atacante.",
      "Cambios de dirección."
    ],
    "correcciones": [
      "Mirar las caderas del atacante.",
      "Mantener 1-2 m de distancia."
    ],
    "reglas": [
      "Seguir a 1-2 m.",
      "No dejarse superar.",
      "Cambiar roles cada 60 s."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar un balón al atacante. Convertir en 1v1 real con posesión."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 10-12 min.",
      "Fútbol 11: 2 por pareja. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 022",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 10 x 8 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-022-AGILIDAD-REACTIVA-1V1/CampoBase_Agilidad_Reactiva_1v1.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-022-AGILIDAD-REACTIVA-1V1/frames/f",
    "total": 50,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-023-CIRCUITO-COORDINACION-MOTORA",
  "nombre": "Circuito de coordinación motora general",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Coordinación motora",
      "Agilidad"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10, uno por turno"
    },
    "material": "Escalera, 3 aros, 2 conos",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Secuencia 1: escalera (2 pies por cuadro) - 3 m."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Secuencia 2: 3 aros en zigzag - 1 pie en cada uno."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Secuencia 3: salto a pies juntos entre 2 conos (1 m), con bote en medio."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Secuencia 4: trote suave de vuelta al punto inicial."
      }
    ],
    "explicacion_breve": "Circuito de 4 secuencias: escalera, 3 aros en zigzag, salto a pies juntos entre 2 conos (con bote en medio) y trote de vuelta.",
    "leyenda": "Azul: jugador · Escalera/aros/conos: secuencias · Flecha azul: recorrido"
  },
  "detalle": {
    "objetivos": [
      "Combinar movimientos coordinativos variados en un solo bloque de trabajo."
    ],
    "claves_entrenador": [
      "Al inicio, hacer TODO el circuito lento — enfocado en técnica. La velocidad se agrega semanas después."
    ],
    "montaje": [
      "Secuencia 1: escalera (2 pies por cuadro) - 3 m."
    ],
    "desarrollo": [
      "Secuencia 1: escalera (2 pies por cuadro) - 3 m.",
      "Secuencia 2: 3 aros en zigzag - 1 pie en cada uno.",
      "Secuencia 3: salto a pies juntos entre 2 conos (1 m), con bote en medio.",
      "Secuencia 4: trote suave de vuelta al punto inicial."
    ],
    "que_buscamos": [
      "Coordinación motora",
      "Agilidad"
    ],
    "que_observar": [
      "Técnica de cada secuencia.",
      "Bote en medio entre conos.",
      "Ritmo controlado."
    ],
    "correcciones": [
      "Hacerlo lento al inicio.",
      "Enfocarse en la técnica."
    ],
    "reglas": [
      "Escalera, aros, salto y trote.",
      "Bote en medio entre los conos.",
      "Técnica antes que velocidad."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar dificultad de escalera (Icky Shuffle) y agregar balón conducido en la vuelta."
    ],
    "variantes": [
      "Fútbol 7: 1-10, uno por turno. · 10-12 min.",
      "Fútbol 11: 1-10, uno por turno. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 023",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: media.",
        "Espacio: 12 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-023-CIRCUITO-COORDINACION-MOTORA/CampoBase_Circuito_Coordinacion_Motora.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-023-CIRCUITO-COORDINACION-MOTORA/frames/f",
    "total": 50,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-024-OCHO-INVERTIDO-CONOS",
  "nombre": "Ocho invertido con conos (figura 8)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Giros continuos",
      "Desaceleración",
      "Equilibrio dinámico"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8, uno por turno"
    },
    "material": "2 conos",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Colocar 2 conos separados por 3 metros."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Jugador dibuja con su carrera un OCHO alrededor de los conos, sin detenerse."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Girar SIEMPRE por el lado externo del cono."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "30-40 segundos de trabajo, 30 segundos de descanso. 4-5 series."
      }
    ],
    "explicacion_breve": "El jugador dibuja con su carrera un ocho alrededor de 2 conos separados por 3 m, girando siempre por el lado externo, sin detenerse.",
    "leyenda": "Azul: jugador · Cono naranja: marcador · Círculo azul: figura 8"
  },
  "detalle": {
    "objetivos": [
      "Trabajar giros continuos, desaceleración y equilibrio dinámico."
    ],
    "claves_entrenador": [
      "Al girar, apoyar bien el pie externo y usar el interno para impulsar la salida."
    ],
    "montaje": [
      "Colocar 2 conos separados por 3 metros."
    ],
    "desarrollo": [
      "Colocar 2 conos separados por 3 metros.",
      "Jugador dibuja con su carrera un OCHO alrededor de los conos, sin detenerse.",
      "Girar SIEMPRE por el lado externo del cono.",
      "30-40 segundos de trabajo, 30 segundos de descanso. 4-5 series."
    ],
    "que_buscamos": [
      "Giros continuos",
      "Desaceleración",
      "Equilibrio dinámico"
    ],
    "que_observar": [
      "Giros continuos.",
      "Pie externo al girar.",
      "Equilibrio dinámico."
    ],
    "correcciones": [
      "Apoyar el pie externo.",
      "Impulsar con el pie interno."
    ],
    "reglas": [
      "Dibujar un ocho.",
      "Girar por el lado externo.",
      "Sin detenerse."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Añadir un balón conducido durante los ochos, alternando pies según el cono."
    ],
    "variantes": [
      "Fútbol 7: 1-8, uno por turno. · 6-8 min.",
      "Fútbol 11: 1-8, uno por turno. · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 024",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: 6 x 3 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-024-OCHO-INVERTIDO-CONOS/CampoBase_Ocho_Invertido_Conos.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-024-OCHO-INVERTIDO-CONOS/frames/f",
    "total": 50,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-025-COORDINACION-PAREJA-PASE",
  "nombre": "Coordinación en pareja — pase con cambio de dirección",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Coordinación/motricidad",
    "que_se_trabaja": [
      "Coordinación",
      "Pase",
      "Control"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "1 balón, 4 conos",
    "series": [
      {
        "nombre": "Secuencia 1",
        "instruccion": "Colocar 2 conos en línea para cada jugador (2 líneas paralelas separadas por 5 m)."
      },
      {
        "nombre": "Secuencia 2",
        "instruccion": "Jugador A pasa a Jugador B, y hace slalom por los conos de su lado hasta el otro extremo."
      },
      {
        "nombre": "Secuencia 3",
        "instruccion": "Jugador B controla, pasa de vuelta a A, y hace su propio slalom."
      },
      {
        "nombre": "Secuencia 4",
        "instruccion": "Trabajo continuo 45 segundos. Descanso 30. Repetir 5 veces."
      }
    ],
    "explicacion_breve": "Dos jugadores se pasan el balón y, tras cada pase, cada uno hace slalom por los 2 conos de su línea, en trabajo continuo de 45 segundos.",
    "leyenda": "Azul: jugador A · Amarillo: jugador B · Cono naranja: slalom · Balón: pase · Flecha azul discontinua: pase"
  },
  "detalle": {
    "objetivos": [
      "Integrar coordinación pura al gesto técnico de pase y control."
    ],
    "claves_entrenador": [
      "B conserva el balón y espera a que A complete el slalom y vuelva a su posición antes de devolver el pase."
    ],
    "montaje": [
      "Colocar 2 conos en línea para cada jugador (2 líneas paralelas separadas por 5 m)."
    ],
    "desarrollo": [
      "Colocar 2 conos en línea para cada jugador (2 líneas paralelas separadas por 5 m).",
      "Jugador A pasa a Jugador B, y hace slalom por los conos de su lado hasta el otro extremo.",
      "Jugador B controla, pasa de vuelta a A, y hace su propio slalom.",
      "Trabajo continuo 45 segundos. Descanso 30. Repetir 5 veces."
    ],
    "que_buscamos": [
      "Coordinación",
      "Pase",
      "Control"
    ],
    "que_observar": [
      "Timing del pase.",
      "Control antes de pasar.",
      "Slalom por los conos."
    ],
    "correcciones": [
      "Esperar a que el compañero vuelva antes de pasar.",
      "Controlar antes de pasar."
    ],
    "reglas": [
      "Pasar y hacer slalom.",
      "2 conos por jugador.",
      "Trabajo continuo 45 s."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Alternar pases con pie no dominante en cada segunda repetición."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 10-12 min.",
      "Fútbol 11: 2 por pareja. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 1 Agilidad y Coordinación, ejercicio 025",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media-alta.",
        "Espacio: 10 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-025-COORDINACION-PAREJA-PASE/CampoBase_Coordinacion_Pareja_Pase_v4.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-025-COORDINACION-PAREJA-PASE/frames/f",
    "total": 84,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-026-DEFINICION-ESTATICA-PIE-DOMINANTE",
  "nombre": "Definición estática — pie dominante",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Remate raso",
      "Interior del pie",
      "Precisión"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8 (fila)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Colocar el balón parado a 10-12 metros de la portería."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Jugador toma 2-3 pasos de carrera y remata a portería."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Focalizar en interior del pie, tobillo firme y apuntar a esquina."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 remates. Recoger balones y siguiente turno."
      }
    ],
    "explicacion_breve": "Con el balón parado a 10-12 metros, el jugador toma 2-3 pasos de carrera y remata a portería con el interior del pie dominante, apuntando a la esquina.",
    "leyenda": "Azul: jugador · Balón: parado · Portería: remate a esquina · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la técnica pura del remate raso con el interior del pie dominante."
    ],
    "claves_entrenador": [
      "El pie de apoyo debe apuntar a donde quieres que vaya el balón. Cabeza sobre el balón al golpear."
    ],
    "montaje": [
      "Colocar el balón parado a 10-12 metros de la portería."
    ],
    "desarrollo": [
      "Colocar el balón parado a 10-12 metros de la portería.",
      "Jugador toma 2-3 pasos de carrera y remata a portería.",
      "Focalizar en interior del pie, tobillo firme y apuntar a esquina.",
      "10 remates. Recoger balones y siguiente turno."
    ],
    "que_buscamos": [
      "Remate raso",
      "Interior del pie",
      "Precisión"
    ],
    "que_observar": [
      "Pie de apoyo orientado al objetivo.",
      "Cabeza sobre el balón.",
      "Tobillo firme."
    ],
    "correcciones": [
      "Orientar el pie de apoyo al objetivo.",
      "Cabeza sobre el balón al golpear."
    ],
    "reglas": [
      "Balón parado a 10-12 m.",
      "Interior del pie dominante.",
      "Tobillo firme.",
      "Apuntar a esquina."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Marcar zonas objetivo en la portería (esquinas) y contar aciertos."
    ],
    "variantes": [
      "Fútbol 7: 1-8 (fila). · 8-10 min.",
      "Fútbol 11: 1-8 (fila). · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 026",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: media.",
        "Espacio: 15 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-026-DEFINICION-ESTATICA-PIE-DOMINANTE/CampoBase_Definicion_Estatica_Pie_Dominante.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-026-DEFINICION-ESTATICA-PIE-DOMINANTE/frames/f",
    "total": 48,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-027-DEFINICION-ESTATICA-PIE-NO-DOMINANTE",
  "nombre": "Definición estática — pie no dominante",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Remate",
      "Pie no dominante",
      "Técnica"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Balón parado a 10 metros de la portería."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Jugador remata ÚNICAMENTE con el pie no dominante."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Foco en técnica, NO en fuerza. La fuerza llega con la repetición."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 remates con pie no dominante. Descanso 30 s. Repetir 3 series."
      }
    ],
    "explicacion_breve": "Con el balón parado a 10 metros, el jugador remata únicamente con el pie no dominante, priorizando la técnica sobre la fuerza.",
    "leyenda": "Azul: jugador · Balón: parado · Portería: remate · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar el uso del pie no dominante para ampliar el repertorio ofensivo."
    ],
    "claves_entrenador": [
      "Al inicio va a salir feo. Acéptalo. La pierna 'mala' se hace buena con repetición, no con fuerza."
    ],
    "montaje": [
      "Balón parado a 10 metros de la portería."
    ],
    "desarrollo": [
      "Balón parado a 10 metros de la portería.",
      "Jugador remata ÚNICAMENTE con el pie no dominante.",
      "Foco en técnica, NO en fuerza. La fuerza llega con la repetición.",
      "10 remates con pie no dominante. Descanso 30 s. Repetir 3 series."
    ],
    "que_buscamos": [
      "Remate",
      "Pie no dominante",
      "Técnica"
    ],
    "que_observar": [
      "Uso del pie no dominante.",
      "Técnica antes que fuerza.",
      "Repetición."
    ],
    "correcciones": [
      "Priorizar la técnica.",
      "No buscar fuerza al inicio."
    ],
    "reglas": [
      "Rematar solo con el pie no dominante.",
      "Foco en técnica.",
      "10 remates por serie."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Alternar remates: 5 con pie dominante, 5 con no dominante, ver diferencia técnica."
    ],
    "variantes": [
      "Fútbol 7: 1-8. · 8-10 min.",
      "Fútbol 11: 1-8. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 027",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: 15 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-027-DEFINICION-ESTATICA-PIE-NO-DOMINANTE/CampoBase_Definicion_Estatica_Pie_No_Dominante.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-027-DEFINICION-ESTATICA-PIE-NO-DOMINANTE/frames/f",
    "total": 48,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-028-DEFINICION-PRIMER-TOQUE-PASE-RASO",
  "nombre": "Definición primer toque tras pase raso",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Primer toque",
      "Remate",
      "Timing de carrera"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2+ (pasador y rematador)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Pasador ubicado en el borde del área con balones."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Rematador entra en carrera desde 15 m atrás."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Pasador entrega pase raso al espacio, rematador define de PRIMERA."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 remates por jugador. Rotar roles."
      }
    ],
    "explicacion_breve": "El pasador entrega un pase raso al espacio y el rematador, que entra en carrera desde 15 m atrás, define de primera intención.",
    "leyenda": "Amarillo: pasador (P) · Azul: rematador (R) · Balón: pase raso · Flecha azul: pase · Flecha roja: carrera/remate"
  },
  "detalle": {
    "objetivos": [
      "Automatizar el remate de primera intención sin control previo."
    ],
    "claves_entrenador": [
      "El pie llega al balón — el balón no espera al pie. Timing de la carrera es todo."
    ],
    "montaje": [
      "Pasador ubicado en el borde del área con balones."
    ],
    "desarrollo": [
      "Pasador ubicado en el borde del área con balones.",
      "Rematador entra en carrera desde 15 m atrás.",
      "Pasador entrega pase raso al espacio, rematador define de PRIMERA.",
      "8 remates por jugador. Rotar roles."
    ],
    "que_buscamos": [
      "Primer toque",
      "Remate",
      "Timing de carrera"
    ],
    "que_observar": [
      "Timing de la carrera.",
      "Remate de primera.",
      "Pase al espacio."
    ],
    "correcciones": [
      "Ajustar el timing de la carrera.",
      "No controlar antes de rematar."
    ],
    "reglas": [
      "Pase raso al espacio.",
      "Remate de primera.",
      "8 remates por jugador."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Variar la velocidad y ángulo del pase entrante para simular situaciones reales."
    ],
    "variantes": [
      "Fútbol 7: 2+ (pasador y rematador). · 10-12 min.",
      "Fútbol 11: 2+ (pasador y rematador). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 028",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 20 x 12 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-028-DEFINICION-PRIMER-TOQUE-PASE-RASO/CampoBase_Definicion_Primer_Toque_Pase_Raso.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-028-DEFINICION-PRIMER-TOQUE-PASE-RASO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-029-DEFINICION-PRIMER-TOQUE-PASE-AEREO",
  "nombre": "Definición primer toque tras pase aéreo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Volea",
      "Media volea",
      "Juego aéreo"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2+ (lanzador y rematador)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Lanzador a 15 m del rematador, con balón en mano."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Lanza balón alto en curva hacia el rematador."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Rematador ataca el balón en el aire y define de volea o media volea."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 remates por jugador. Descanso 1 minuto entre series."
      }
    ],
    "explicacion_breve": "El lanzador envía un balón alto en curva y el rematador lo ataca en el aire para definir de volea o media volea.",
    "leyenda": "Amarillo: lanzador (L) · Azul: rematador (R) · Balón: pase aéreo · Flecha azul: trayectoria aérea · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Trabajar volea y media volea sobre balón alto entrante."
    ],
    "claves_entrenador": [
      "El cuerpo se inclina hacia atrás para pegarle por arriba. Ojos en el balón hasta el impacto."
    ],
    "montaje": [
      "Lanzador a 15 m del rematador, con balón en mano."
    ],
    "desarrollo": [
      "Lanzador a 15 m del rematador, con balón en mano.",
      "Lanza balón alto en curva hacia el rematador.",
      "Rematador ataca el balón en el aire y define de volea o media volea.",
      "8 remates por jugador. Descanso 1 minuto entre series."
    ],
    "que_buscamos": [
      "Volea",
      "Media volea",
      "Juego aéreo"
    ],
    "que_observar": [
      "Inclinación del cuerpo.",
      "Ojos en el balón.",
      "Contacto en el aire."
    ],
    "correcciones": [
      "Inclinar el cuerpo hacia atrás.",
      "Mantener los ojos en el balón."
    ],
    "reglas": [
      "Balón alto en curva.",
      "Atacar el balón en el aire.",
      "Volea o media volea."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Variar altura y velocidad del balón lanzado; alternar entre volea y media volea."
    ],
    "variantes": [
      "Fútbol 7: 2+ (lanzador y rematador). · 10-12 min.",
      "Fútbol 11: 2+ (lanzador y rematador). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 029",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-029-DEFINICION-PRIMER-TOQUE-PASE-AEREO/CampoBase_Definicion_Primer_Toque_Pase_Aereo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-029-DEFINICION-PRIMER-TOQUE-PASE-AEREO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},

{
  "id": "CAMPOBASE-PACK150-030-DEFINICION-TRAS-CONDUCCION-RAPIDA",
  "nombre": "Definición tras conducción rápida",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Conducción",
      "Toma de decisión",
      "Finalización"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8"
    },
    "material": "5 conos + 6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Colocar 4 conos formando slalom desde 25 m del área."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Jugador conduce el balón haciendo slalom rápido entre los conos."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Al salir del último cono, dispara a portería de primera intención."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 repeticiones con recuperación completa entre cada una."
      }
    ],
    "explicacion_breve": "El jugador conduce el balón haciendo slalom rápido entre 4 conos y, al salir del último, dispara a portería de primera intención.",
    "leyenda": "Azul: jugador · Cono naranja: slalom · Balón: conducción · Flecha roja: conducción/remate"
  },
  "detalle": {
    "objetivos": [
      "Combinar conducción a velocidad + toma de decisión + finalización."
    ],
    "claves_entrenador": [
      "NO frenar antes del remate. La finalización viene con la velocidad de la conducción."
    ],
    "montaje": [
      "Colocar 4 conos formando slalom desde 25 m del área."
    ],
    "desarrollo": [
      "Colocar 4 conos formando slalom desde 25 m del área.",
      "Jugador conduce el balón haciendo slalom rápido entre los conos.",
      "Al salir del último cono, dispara a portería de primera intención.",
      "8 repeticiones con recuperación completa entre cada una."
    ],
    "que_buscamos": [
      "Conducción",
      "Toma de decisión",
      "Finalización"
    ],
    "que_observar": [
      "Velocidad de conducción.",
      "Salida del último cono.",
      "Remate sin frenar."
    ],
    "correcciones": [
      "No frenar antes del remate.",
      "Mantener la velocidad de conducción."
    ],
    "reglas": [
      "Slalom entre 4 conos.",
      "Disparo de primera intención.",
      "No frenar antes del remate."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar un defensor pasivo al final del slalom para forzar decisión rápida."
    ],
    "variantes": [
      "Fútbol 7: 1-8. · 12-15 min.",
      "Fútbol 11: 1-8. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 030",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 25 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-030-DEFINICION-TRAS-CONDUCCION-RAPIDA/CampoBase_Definicion_Tras_Conduccion_Rapida.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-030-DEFINICION-TRAS-CONDUCCION-RAPIDA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-031-1V1-PORTERO-CENTRO",
  "nombre": "1v1 con portero desde el centro",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "1v1",
      "Decisión"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (atacante y portero)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Atacante inicia a 25 m de la portería con balón conducido lento."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Cuando cruza los 18 m, el portero sale a achicar."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Atacante debe decidir: definir raso a un lado, o hacer vaselina por encima."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6 repeticiones. Rotar roles."
      }
    ],
    "explicacion_breve": "El atacante conduce lento desde 25 m y, cuando cruza los 18 m y el portero sale a achicar, decide entre definir raso a un lado o hacer vaselina por encima.",
    "leyenda": "Azul: atacante (J) · Verde: portero (K) · Balón: conducción · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la definición cara a cara con el portero — decisión y ejecución."
    ],
    "claves_entrenador": [
      "Mira al portero, no al balón. Si sale abajo, vaselina. Si se queda quieto, raso a un palo."
    ],
    "montaje": [
      "Atacante inicia a 25 m de la portería con balón conducido lento."
    ],
    "desarrollo": [
      "Atacante inicia a 25 m de la portería con balón conducido lento.",
      "Cuando cruza los 18 m, el portero sale a achicar.",
      "Atacante debe decidir: definir raso a un lado, o hacer vaselina por encima.",
      "6 repeticiones. Rotar roles."
    ],
    "que_buscamos": [
      "Definición",
      "1v1",
      "Decisión"
    ],
    "que_observar": [
      "Lectura del portero.",
      "Decisión raso o vaselina.",
      "Ejecución."
    ],
    "correcciones": [
      "Mirar al portero, no al balón.",
      "Decidir según la salida del portero."
    ],
    "reglas": [
      "Conducir lento desde 25 m.",
      "Decidir raso o vaselina.",
      "6 repeticiones."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Añadir un defensor persiguiendo desde atrás para agregar presión."
    ],
    "variantes": [
      "Fútbol 7: 2 (atacante y portero). · 12-15 min.",
      "Fútbol 11: 2 (atacante y portero). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 031",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 25 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-031-1V1-PORTERO-CENTRO/CampoBase_1v1_Portero_Centro.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-031-1V1-PORTERO-CENTRO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-032-1V1-PORTERO-BANDA",
  "nombre": "1v1 con portero por banda",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "1v1",
      "Ángulo cerrado"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (atacante y portero)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Atacante conduce por la banda hacia el fondo del área."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Portero achica cubriendo el primer palo."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Atacante decide: remate al segundo palo, atrás para compañero, o buscar rebote."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6 repeticiones por banda (izq y der). Rotar."
      }
    ],
    "explicacion_breve": "El atacante conduce por la banda hacia el fondo del área y, con el portero cubriendo el primer palo, decide entre rematar al segundo palo, pasar atrás o buscar rebote.",
    "leyenda": "Azul: atacante (J) · Verde: portero (K) · Balón: conducción · Flecha roja: remate al segundo palo"
  },
  "detalle": {
    "objetivos": [
      "Definir desde ángulo cerrado — decisiones y ejecución precisa."
    ],
    "claves_entrenador": [
      "El segundo palo suele estar abierto — buscar cruzarla con interior del pie fuerte."
    ],
    "montaje": [
      "Atacante conduce por la banda hacia el fondo del área."
    ],
    "desarrollo": [
      "Atacante conduce por la banda hacia el fondo del área.",
      "Portero achica cubriendo el primer palo.",
      "Atacante decide: remate al segundo palo, atrás para compañero, o buscar rebote.",
      "6 repeticiones por banda (izq y der). Rotar."
    ],
    "que_buscamos": [
      "Definición",
      "1v1",
      "Ángulo cerrado"
    ],
    "que_observar": [
      "Ángulo cerrado.",
      "Segundo palo abierto.",
      "Decisión de remate."
    ],
    "correcciones": [
      "Buscar el segundo palo.",
      "Cruzarla con el interior del pie fuerte."
    ],
    "reglas": [
      "Conducir por la banda.",
      "Cubrir el primer palo.",
      "Buscar el segundo palo."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar un compañero cerca del punto de penalti para pase atrás como opción."
    ],
    "variantes": [
      "Fútbol 7: 2 (atacante y portero). · 12-15 min.",
      "Fútbol 11: 2 (atacante y portero). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 032",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-032-1V1-PORTERO-BANDA/CampoBase_1v1_Portero_Banda.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-032-1V1-PORTERO-BANDA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-033-FINALIZACION-2V1-PORTERO",
  "nombre": "Finalización 2v1 al portero",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "2v1",
      "Superioridad"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (2 atacantes + portero)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "2 atacantes inician a 25 m de la portería, separados 10 m entre sí."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Uno lleva el balón conduciéndolo hacia el área."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Portero elige a quién achicar. El atacante con balón decide: definir o pasar al libre."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6 repeticiones. Rotar roles."
      }
    ],
    "explicacion_breve": "Dos atacantes inician a 25 m separados 10 m; uno conduce hacia el área y, cuando el portero elige a quién achicar, decide entre definir o pasar al libre.",
    "leyenda": "Azul: atacantes (A1/A2) · Verde: portero (K) · Flecha azul: pase · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la definición con superioridad numérica en el último tercio."
    ],
    "claves_entrenador": [
      "El atacante con balón mira al portero HASTA el último momento — el portero delata su decisión."
    ],
    "montaje": [
      "2 atacantes inician a 25 m de la portería, separados 10 m entre sí."
    ],
    "desarrollo": [
      "2 atacantes inician a 25 m de la portería, separados 10 m entre sí.",
      "Uno lleva el balón conduciéndolo hacia el área.",
      "Portero elige a quién achicar. El atacante con balón decide: definir o pasar al libre.",
      "6 repeticiones. Rotar roles."
    ],
    "que_buscamos": [
      "Definición",
      "2v1",
      "Superioridad"
    ],
    "que_observar": [
      "Lectura del portero.",
      "Pase al libre.",
      "Definición."
    ],
    "correcciones": [
      "Mirar al portero hasta el final.",
      "Pasar al libre si achica."
    ],
    "reglas": [
      "2 atacantes separados 10 m.",
      "Decidir definir o pasar.",
      "6 repeticiones."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar un defensor pasivo para transformar en 2v1+1 (más realista)."
    ],
    "variantes": [
      "Fútbol 7: 3 (2 atacantes + portero). · 12-15 min.",
      "Fútbol 11: 3 (2 atacantes + portero). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 033",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 25 x 20 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-033-FINALIZACION-2V1-PORTERO/CampoBase_Finalizacion_2v1_Portero.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-033-FINALIZACION-2V1-PORTERO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-034-FINALIZACION-3V2-SUPERIORIDAD",
  "nombre": "Finalización 3v2 con superioridad",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "3v2",
      "Ataque colectivo"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 6,
      "organizacion": "6 (3 atacantes, 2 defensores, portero)"
    },
    "material": "1 portería + balones",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "3 atacantes contra 2 defensores + portero."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Los atacantes salen desde el medio del campo con balón."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Deben crear situación de gol combinando pases y movimientos."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Máximo 4 toques antes de definir. 6-8 repeticiones."
      }
    ],
    "explicacion_breve": "Tres atacantes salen desde el medio del campo contra dos defensores y portero, y deben crear situación de gol combinando pases y movimientos con un máximo de 4 toques.",
    "leyenda": "Azul: atacantes (A) · Púrpura: defensores (D) · Verde: portero (K) · Flecha azul: pase · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Definir en situación de ataque colectivo con oposición defensiva."
    ],
    "claves_entrenador": [
      "La superioridad se aprovecha con MOVIMIENTO — quedarse quieto la anula. Correr sin balón vale más que con."
    ],
    "montaje": [
      "3 atacantes contra 2 defensores + portero."
    ],
    "desarrollo": [
      "3 atacantes contra 2 defensores + portero.",
      "Los atacantes salen desde el medio del campo con balón.",
      "Deben crear situación de gol combinando pases y movimientos.",
      "Máximo 4 toques antes de definir. 6-8 repeticiones."
    ],
    "que_buscamos": [
      "Definición",
      "3v2",
      "Ataque colectivo"
    ],
    "que_observar": [
      "Movimiento sin balón.",
      "Combinación de pases.",
      "Superioridad aprovechada."
    ],
    "correcciones": [
      "Moverse sin balón.",
      "No quedarse quieto."
    ],
    "reglas": [
      "3 atacantes vs 2 defensores.",
      "Máximo 4 toques.",
      "Combinar pases y movimientos."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Quitar el límite de toques y agregar tiempo (10 segundos para definir)."
    ],
    "variantes": [
      "Fútbol 7: 6 (3 atacantes, 2 defensores, portero). · 15-20 min.",
      "Fútbol 11: 6 (3 atacantes, 2 defensores, portero). · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 034",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 30 x 25 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-034-FINALIZACION-3V2-SUPERIORIDAD/CampoBase_Finalizacion_3v2_Superioridad.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-034-FINALIZACION-3V2-SUPERIORIDAD/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-035-CARA-A-CARA-CHIP-RASO",
  "nombre": "Cara a cara — vaselina vs raso (decisión)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "Vaselina",
      "Decisión"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (atacante y portero)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Atacante con balón a 15 m de la portería, portero a 6 m."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Portero elige aleatoriamente: quedarse quieto o salir a achicar."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Atacante debe leer y decidir: raso si el portero se queda, vaselina si sale."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 repeticiones por jugador."
      }
    ],
    "explicacion_breve": "Con el atacante a 15 m y el portero a 6 m, el portero elige aleatoriamente quedarse quieto o salir a achicar, y el atacante lee y decide: raso si se queda, vaselina si sale.",
    "leyenda": "Azul: atacante (J) · Verde: portero (K) · Flecha roja: raso · Flecha roja discontinua: vaselina"
  },
  "detalle": {
    "objetivos": [
      "Entrenar la decisión rápida entre vaselina por encima o raso al palo."
    ],
    "claves_entrenador": [
      "La vaselina requiere pegarle con la puntera abajo del balón — casi 'pellizcarlo'. Practicar la técnica primero solo."
    ],
    "montaje": [
      "Atacante con balón a 15 m de la portería, portero a 6 m."
    ],
    "desarrollo": [
      "Atacante con balón a 15 m de la portería, portero a 6 m.",
      "Portero elige aleatoriamente: quedarse quieto o salir a achicar.",
      "Atacante debe leer y decidir: raso si el portero se queda, vaselina si sale.",
      "10 repeticiones por jugador."
    ],
    "que_buscamos": [
      "Definición",
      "Vaselina",
      "Decisión"
    ],
    "que_observar": [
      "Lectura del portero.",
      "Decisión raso o vaselina.",
      "Técnica de la vaselina."
    ],
    "correcciones": [
      "Puntera abajo del balón.",
      "Decidir según la salida del portero."
    ],
    "reglas": [
      "Leer al portero.",
      "Raso si se queda, vaselina si sale.",
      "10 repeticiones."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar defensor persiguiendo para forzar decisión aún más rápida."
    ],
    "variantes": [
      "Fútbol 7: 2 (atacante y portero). · 10-12 min.",
      "Fútbol 11: 2 (atacante y portero). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 035",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media-alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-035-CARA-A-CARA-CHIP-RASO/CampoBase_Cara_a_Cara_Chip_Raso.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-035-CARA-A-CARA-CHIP-RASO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-036-CABECEO-ESTATICO-SALTO",
  "nombre": "Cabeceo estático + salto",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Cabeceo",
      "Juego aéreo",
      "Impulso vertical"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (lanzador + rematador)"
    },
    "material": "5 balones",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Lanzador a 3 m del rematador, con balón en manos."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Lanza el balón alto hacia arriba del rematador."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Rematador salta y cabecea el balón de vuelta al lanzador con la frente."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 cabeceos por jugador. Rotar."
      }
    ],
    "explicacion_breve": "El lanzador envía el balón alto hacia arriba del rematador, que salta y cabecea de vuelta con la frente.",
    "leyenda": "Amarillo: lanzador (L) · Azul: rematador (R) · Flecha azul: trayectoria · Flecha roja: cabeceo de vuelta"
  },
  "detalle": {
    "objetivos": [
      "Introducir la técnica del cabeceo con impulso vertical."
    ],
    "claves_entrenador": [
      "Golpear con la FRENTE, ojos abiertos hasta el contacto. Cuello firme, empuje del cuerpo entero."
    ],
    "montaje": [
      "Lanzador a 3 m del rematador, con balón en manos."
    ],
    "desarrollo": [
      "Lanzador a 3 m del rematador, con balón en manos.",
      "Lanza el balón alto hacia arriba del rematador.",
      "Rematador salta y cabecea el balón de vuelta al lanzador con la frente.",
      "10 cabeceos por jugador. Rotar."
    ],
    "que_buscamos": [
      "Cabeceo",
      "Juego aéreo",
      "Impulso vertical"
    ],
    "que_observar": [
      "Golpeo con la frente.",
      "Ojos abiertos.",
      "Impulso vertical."
    ],
    "correcciones": [
      "Golpear con la frente.",
      "Cuello firme."
    ],
    "reglas": [
      "Balón alto hacia el rematador.",
      "Cabecear con la frente.",
      "10 cabeceos."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Marcar zonas de la portería y buscar dirigir el cabeceo hacia esquinas."
    ],
    "variantes": [
      "Fútbol 7: 2 (lanzador + rematador). · 8-10 min.",
      "Fútbol 11: 2 (lanzador + rematador). · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 036",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: 5 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-036-CABECEO-ESTATICO-SALTO/CampoBase_Cabeceo_Estatico_Salto.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-036-CABECEO-ESTATICO-SALTO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-037-CABECEO-TRAS-CENTRO-BANDA",
  "nombre": "Cabeceo tras centro por banda",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Cabeceo",
      "Centro",
      "Juego aéreo"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3+ (centrador, rematador, portero)"
    },
    "material": "6 balones + portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Centrador ubicado en la banda con balones."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Rematador arranca desde el punto de penalti hacia el segundo palo."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Centrador tira balón alto al segundo palo. Rematador cabecea."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 cabeceos por jugador. Alternar bandas."
      }
    ],
    "explicacion_breve": "El centrador envía un balón alto al segundo palo y el rematador, que arranca desde el punto de penalti, cabecea a portería.",
    "leyenda": "Amarillo: centrador (C) · Azul: rematador (R) · Flecha azul: centro · Flecha roja: cabeceo"
  },
  "detalle": {
    "objetivos": [
      "Definir de cabeza tras balón centrado desde banda."
    ],
    "claves_entrenador": [
      "El movimiento clave: primero SALIR del área, luego ENTRAR con velocidad al balón. No esperarlo quieto."
    ],
    "montaje": [
      "Centrador ubicado en la banda con balones."
    ],
    "desarrollo": [
      "Centrador ubicado en la banda con balones.",
      "Rematador arranca desde el punto de penalti hacia el segundo palo.",
      "Centrador tira balón alto al segundo palo. Rematador cabecea.",
      "8 cabeceos por jugador. Alternar bandas."
    ],
    "que_buscamos": [
      "Cabeceo",
      "Centro",
      "Juego aéreo"
    ],
    "que_observar": [
      "Movimiento de salida y entrada.",
      "Ataque al balón.",
      "Cabeceo al segundo palo."
    ],
    "correcciones": [
      "Salir del área y entrar con velocidad.",
      "No esperar quieto."
    ],
    "reglas": [
      "Centro al segundo palo.",
      "Arrancar desde el punto de penalti.",
      "8 cabeceos."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar defensor marcando al rematador — trabajar cabeceo con presión."
    ],
    "variantes": [
      "Fútbol 7: 3+ (centrador, rematador, portero). · 12-15 min.",
      "Fútbol 11: 3+ (centrador, rematador, portero). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 037",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 25 x 20 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-037-CABECEO-TRAS-CENTRO-BANDA/CampoBase_Cabeceo_Tras_Centro_Banda.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-037-CABECEO-TRAS-CENTRO-BANDA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-038-CABECEO-DEFENSIVO-OFENSIVO",
  "nombre": "Cabeceo defensivo → ofensivo (cambio de rol)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Cabeceo",
      "Juego aéreo",
      "Cambio de rol"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (lanzador, defensor/rematador, receptor)"
    },
    "material": "5 balones",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Lanzador tira balón alto al centro del área."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Jugador ejecuta cabeceo DEFENSIVO (largo, arriba y lejos)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Luego, sale rápido a atacar el próximo balón alto y cabecea a portería."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Alternar: 3 defensivos, 3 ofensivos. 4 series."
      }
    ],
    "explicacion_breve": "El jugador ejecuta un cabeceo defensivo (largo, arriba y lejos) y luego sale rápido a atacar el próximo balón alto para cabecear a portería.",
    "leyenda": "Amarillo: lanzador (L) · Azul: jugador (J) · Flecha roja: despeje / cabeceo"
  },
  "detalle": {
    "objetivos": [
      "Trabajar el juego aéreo en ambas fases — despejar y luego atacar."
    ],
    "claves_entrenador": [
      "Cabeceo defensivo: pega en la MITAD BAJA del balón para elevar. Ofensivo: MITAD ALTA para bajarlo."
    ],
    "montaje": [
      "Lanzador tira balón alto al centro del área."
    ],
    "desarrollo": [
      "Lanzador tira balón alto al centro del área.",
      "Jugador ejecuta cabeceo DEFENSIVO (largo, arriba y lejos).",
      "Luego, sale rápido a atacar el próximo balón alto y cabecea a portería.",
      "Alternar: 3 defensivos, 3 ofensivos. 4 series."
    ],
    "que_buscamos": [
      "Cabeceo",
      "Juego aéreo",
      "Cambio de rol"
    ],
    "que_observar": [
      "Despeje alto y lejos.",
      "Cambio de rol.",
      "Cabeceo ofensivo."
    ],
    "correcciones": [
      "Defensivo: mitad baja. Ofensivo: mitad alta.",
      "Salir rápido tras despejar."
    ],
    "reglas": [
      "Cabeceo defensivo largo y alto.",
      "Salir rápido a atacar.",
      "Alternar defensivo/ofensivo."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Realizar la secuencia bajo fatiga (tras 30 s de correr en el sitio antes de cada cabeceo)."
    ],
    "variantes": [
      "Fútbol 7: 3 (lanzador, defensor/rematador, receptor). · 10-12 min.",
      "Fútbol 11: 3 (lanzador, defensor/rematador, receptor). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 038",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media-alta.",
        "Espacio: 15 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-038-CABECEO-DEFENSIVO-OFENSIVO/CampoBase_Cabeceo_Defensivo_Ofensivo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-038-CABECEO-DEFENSIVO-OFENSIVO/frames/f",
    "total": 72,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-039-REMATE-LARGA-DISTANCIA-ESTATICO",
  "nombre": "Remate de larga distancia estático",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Remate",
      "Empeine",
      "Larga distancia"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Balón parado a 22-25 metros de la portería."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Jugador toma 3-4 pasos de carrera y remata con el empeine."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Foco en trayectoria (rasa o alta pero controlada) y precisión."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 remates. Descanso 1 min. 3 series."
      }
    ],
    "explicacion_breve": "Con el balón parado a 22-25 metros, el jugador toma 3-4 pasos de carrera y remata con el empeine, con foco en trayectoria y precisión.",
    "leyenda": "Azul: jugador (J) · Balón: parado · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la técnica pura del disparo lejano con empeine."
    ],
    "claves_entrenador": [
      "El pie de apoyo bien al costado del balón. Peso del cuerpo va HACIA el balón, no hacia atrás."
    ],
    "montaje": [
      "Balón parado a 22-25 metros de la portería."
    ],
    "desarrollo": [
      "Balón parado a 22-25 metros de la portería.",
      "Jugador toma 3-4 pasos de carrera y remata con el empeine.",
      "Foco en trayectoria (rasa o alta pero controlada) y precisión.",
      "8 remates. Descanso 1 min. 3 series."
    ],
    "que_buscamos": [
      "Remate",
      "Empeine",
      "Larga distancia"
    ],
    "que_observar": [
      "Pie de apoyo al costado.",
      "Peso hacia el balón.",
      "Trayectoria controlada."
    ],
    "correcciones": [
      "Pie de apoyo al costado del balón.",
      "Peso hacia el balón."
    ],
    "reglas": [
      "Balón parado a 22-25 m.",
      "Rematar con el empeine.",
      "8 remates por serie."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Marcar cuadrantes de la portería (4 zonas) y contar aciertos por zona."
    ],
    "variantes": [
      "Fútbol 7: 1-8. · 10-12 min.",
      "Fútbol 11: 1-8. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 039",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 30 x 20 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-039-REMATE-LARGA-DISTANCIA-ESTATICO/CampoBase_Remate_Larga_Distancia_Estatico.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-039-REMATE-LARGA-DISTANCIA-ESTATICO/frames/f",
    "total": 48,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-040-REMATE-LARGA-DISTANCIA-CONDUCCION",
  "nombre": "Remate de larga distancia con conducción",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Conducción",
      "Remate",
      "Larga distancia"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugador arranca conduciendo desde 35 m de la portería."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Al llegar a los 25 m, remata sin frenar la conducción."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El remate DEBE ir dentro de los 3 palos aunque no gol."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6 remates por serie. 3 series con descanso completo."
      }
    ],
    "explicacion_breve": "El jugador arranca conduciendo desde 35 m y, al llegar a los 25 m, remata sin frenar la conducción, con el remate dentro de los 3 palos.",
    "leyenda": "Azul: jugador (J) · Balón: conducción · Flecha roja: conducción / remate"
  },
  "detalle": {
    "objetivos": [
      "Combinar conducción + remate de media/larga distancia."
    ],
    "claves_entrenador": [
      "Al 4.º toque, sacar el balón un poco del cuerpo para dar espacio al pie remate. No pegar 'encima' del balón."
    ],
    "montaje": [
      "Jugador arranca conduciendo desde 35 m de la portería."
    ],
    "desarrollo": [
      "Jugador arranca conduciendo desde 35 m de la portería.",
      "Al llegar a los 25 m, remata sin frenar la conducción.",
      "El remate DEBE ir dentro de los 3 palos aunque no gol.",
      "6 remates por serie. 3 series con descanso completo."
    ],
    "que_buscamos": [
      "Conducción",
      "Remate",
      "Larga distancia"
    ],
    "que_observar": [
      "Conducción a velocidad.",
      "Remate sin frenar.",
      "Precisión."
    ],
    "correcciones": [
      "Sacar el balón del cuerpo.",
      "No pegar encima del balón."
    ],
    "reglas": [
      "Conducir desde 35 m.",
      "Rematar sin frenar.",
      "Dentro de los 3 palos."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar defensor pasivo apareciendo a los 20 m para forzar remate más rápido."
    ],
    "variantes": [
      "Fútbol 7: 1-8. · 10-12 min.",
      "Fútbol 11: 1-8. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 040",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 35 x 20 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-040-REMATE-LARGA-DISTANCIA-CONDUCCION/CampoBase_Remate_Larga_Distancia_Conduccion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-040-REMATE-LARGA-DISTANCIA-CONDUCCION/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-041-REMATE-PRIMERA-BORDE-AREA",
  "nombre": "Remate de primera desde borde de área",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Primer toque",
      "Remate",
      "Definición"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (pasador + rematador)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Pasador ubicado dentro del área."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Rematador espera en el borde del área (a 18 m)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Pasador envía balón raso al rematador."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Rematador define de primera intención SIN controlar."
      }
    ],
    "explicacion_breve": "El pasador, dentro del área, envía un balón raso al rematador que espera en el borde del área, y este define de primera intención sin controlar.",
    "leyenda": "Amarillo: pasador (P) · Azul: rematador (R) · Flecha azul: pase raso · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Definir de primera tras rebote o pase corto desde el borde del área."
    ],
    "claves_entrenador": [
      "Timing: el pie golpea el balón cuando cruza tu línea. No esperar a que llegue debajo tuyo."
    ],
    "montaje": [
      "Pasador ubicado dentro del área."
    ],
    "desarrollo": [
      "Pasador ubicado dentro del área.",
      "Rematador espera en el borde del área (a 18 m).",
      "Pasador envía balón raso al rematador.",
      "Rematador define de primera intención SIN controlar."
    ],
    "que_buscamos": [
      "Primer toque",
      "Remate",
      "Definición"
    ],
    "que_observar": [
      "Timing del remate.",
      "Remate de primera.",
      "Sin control previo."
    ],
    "correcciones": [
      "Golpear cuando cruza tu línea.",
      "No esperar a que llegue debajo."
    ],
    "reglas": [
      "Pase raso desde el área.",
      "Remate de primera.",
      "Sin controlar."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Pases desde diferentes ángulos (frontal, diagonal, lateral) para variar decisiones."
    ],
    "variantes": [
      "Fútbol 7: 2 (pasador + rematador). · 10-12 min.",
      "Fútbol 11: 2 (pasador + rematador). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 041",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-041-REMATE-PRIMERA-BORDE-AREA/CampoBase_Remate_Primera_Borde_Area.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-041-REMATE-PRIMERA-BORDE-AREA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-042-DEFINICION-DEFENSOR-PASIVO",
  "nombre": "Definición con defensor pasivo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "Decisión",
      "Ángulo"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (atacante, defensor pasivo, portero)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Atacante recibe balón a 20 m de la portería."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Defensor 'pasivo' — sigue de cerca sin robar activamente."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Atacante debe encontrar el momento y ángulo para definir."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 repeticiones. Rotar roles."
      }
    ],
    "explicacion_breve": "El atacante recibe a 20 m y, con un defensor pasivo que sigue de cerca sin robar, debe encontrar el momento y ángulo para definir.",
    "leyenda": "Azul: atacante (A) · Púrpura: defensor pasivo (D) · Verde: portero (K) · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Introducir presión defensiva sin oposición real, para trabajar decisión."
    ],
    "claves_entrenador": [
      "El defensor pasivo obliga a pensar EN DÓNDE definir, no solo A DÓNDE. Buscar zonas libres de la portería."
    ],
    "montaje": [
      "Atacante recibe balón a 20 m de la portería."
    ],
    "desarrollo": [
      "Atacante recibe balón a 20 m de la portería.",
      "Defensor 'pasivo' — sigue de cerca sin robar activamente.",
      "Atacante debe encontrar el momento y ángulo para definir.",
      "8 repeticiones. Rotar roles."
    ],
    "que_buscamos": [
      "Definición",
      "Decisión",
      "Ángulo"
    ],
    "que_observar": [
      "Búsqueda del ángulo.",
      "Momento de definir.",
      "Zonas libres."
    ],
    "correcciones": [
      "Buscar zonas libres.",
      "Pensar en dónde definir."
    ],
    "reglas": [
      "Defensor pasivo sin robar.",
      "Encontrar el ángulo.",
      "8 repeticiones."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar gradualmente la actividad del defensor (semi-activo, luego activo total)."
    ],
    "variantes": [
      "Fútbol 7: 3 (atacante, defensor pasivo, portero). · 12-15 min.",
      "Fútbol 11: 3 (atacante, defensor pasivo, portero). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 042",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-042-DEFINICION-DEFENSOR-PASIVO/CampoBase_Definicion_Defensor_Pasivo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-042-DEFINICION-DEFENSOR-PASIVO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-043-DEFINICION-DEFENSOR-ACTIVO",
  "nombre": "Definición con defensor activo (1v1 completo)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "1v1",
      "Presión real"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (atacante, defensor, portero)"
    },
    "material": "balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Atacante inicia a 25 m con balón."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Defensor arranca desde 3 m detrás — persigue activo."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Atacante debe superar al defensor y definir antes de que lo recupere."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 repeticiones. Alternar roles."
      }
    ],
    "explicacion_breve": "El atacante inicia a 25 m con balón y un defensor que arranca 3 m detrás persigue activo; el atacante debe superarlo y definir antes de que lo recupere.",
    "leyenda": "Azul: atacante (A) · Púrpura: defensor activo (D) · Verde: portero (K) · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Definir bajo presión real de un defensor que quita."
    ],
    "claves_entrenador": [
      "Contra defensor activo, el primer toque debe ser hacia adelante — si es al costado, pierde ventaja."
    ],
    "montaje": [
      "Atacante inicia a 25 m con balón."
    ],
    "desarrollo": [
      "Atacante inicia a 25 m con balón.",
      "Defensor arranca desde 3 m detrás — persigue activo.",
      "Atacante debe superar al defensor y definir antes de que lo recupere.",
      "8 repeticiones. Alternar roles."
    ],
    "que_buscamos": [
      "Definición",
      "1v1",
      "Presión real"
    ],
    "que_observar": [
      "Primer toque hacia adelante.",
      "Superar al defensor.",
      "Definir rápido."
    ],
    "correcciones": [
      "Primer toque hacia adelante.",
      "No tocar al costado."
    ],
    "reglas": [
      "Defensor persigue activo.",
      "Superar y definir.",
      "8 repeticiones."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar límite de tiempo (5 segundos) desde inicio hasta remate obligatorio."
    ],
    "variantes": [
      "Fútbol 7: 3 (atacante, defensor, portero). · 15-20 min.",
      "Fútbol 11: 3 (atacante, defensor, portero). · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 043",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 25 x 20 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-043-DEFINICION-DEFENSOR-ACTIVO/CampoBase_Definicion_Defensor_Activo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-043-DEFINICION-DEFENSOR-ACTIVO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-044-RONDO-TERMINANDO-GOL",
  "nombre": "Rondo terminando en gol",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Posesión",
      "Transición",
      "Definición"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 6,
      "organizacion": "6+ (4v2 o 5v2 + portero)"
    },
    "material": "balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Rondo 4v2 (o 5v2) a 25 m de la portería."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Cuando los atacantes completan 6 pases consecutivos, se abre el juego."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Los 4 atacantes atacan la portería con transición inmediata."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Defensores del rondo defienden. 10-12 rondas."
      }
    ],
    "explicacion_breve": "En un rondo 4v2 a 25 m, al completar 6 pases consecutivos se abre el juego y los 4 atacantes atacan la portería con transición inmediata.",
    "leyenda": "Azul: atacantes (A) · Púrpura: defensores (D) · Flecha azul: pase · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Combinar posesión con transición inmediata a la definición."
    ],
    "claves_entrenador": [
      "La transición del rondo al gol debe ser INSTANTÁNEA — no reorganizar, atacar YA con lo que hay."
    ],
    "montaje": [
      "Rondo 4v2 (o 5v2) a 25 m de la portería."
    ],
    "desarrollo": [
      "Rondo 4v2 (o 5v2) a 25 m de la portería.",
      "Cuando los atacantes completan 6 pases consecutivos, se abre el juego.",
      "Los 4 atacantes atacan la portería con transición inmediata.",
      "Defensores del rondo defienden. 10-12 rondas."
    ],
    "que_buscamos": [
      "Posesión",
      "Transición",
      "Definición"
    ],
    "que_observar": [
      "Posesión del rondo.",
      "Transición instantánea.",
      "Definición."
    ],
    "correcciones": [
      "Atacar ya, sin reorganizar.",
      "Transición instantánea."
    ],
    "reglas": [
      "Rondo 4v2.",
      "6 pases consecutivos.",
      "Transición inmediata."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Reducir a 3v2 y a 3 pases mínimos para intensificar."
    ],
    "variantes": [
      "Fútbol 7: 6+ (4v2 o 5v2 + portero). · 15-20 min.",
      "Fútbol 11: 6+ (4v2 o 5v2 + portero). · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 044",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 25 x 20 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-044-RONDO-TERMINANDO-GOL/CampoBase_Rondo_Terminando_Gol.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-044-RONDO-TERMINANDO-GOL/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-045-FINALIZACION-REBOTE-PORTERO",
  "nombre": "Finalización tras rebote de portero",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "Rebote",
      "Anticipación"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (rematador 1, cazador, portero)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Rematador 1 dispara a portería desde 20 m (portero debe atajar)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Segundo jugador (cazador) espera en el área, atento al rebote."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Si hay rebote (por atajada o palo), el cazador remata de primera."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6 series. Rotar los roles."
      }
    ],
    "explicacion_breve": "El rematador 1 dispara desde 20 m y, si hay rebote (atajada o palo), el cazador que espera en el área remata de primera.",
    "leyenda": "Azul: rematador 1 (R1) y cazador (CZ) · Verde: portero (K) · Flecha roja: disparo / remate"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la definición del segundo balón (rebote) y la anticipación."
    ],
    "claves_entrenador": [
      "El cazador NUNCA descansa. Anticipar el rebote antes que el portero lo controle."
    ],
    "montaje": [
      "Rematador 1 dispara a portería desde 20 m (portero debe atajar)."
    ],
    "desarrollo": [
      "Rematador 1 dispara a portería desde 20 m (portero debe atajar).",
      "Segundo jugador (cazador) espera en el área, atento al rebote.",
      "Si hay rebote (por atajada o palo), el cazador remata de primera.",
      "6 series. Rotar los roles."
    ],
    "que_buscamos": [
      "Definición",
      "Rebote",
      "Anticipación"
    ],
    "que_observar": [
      "Anticipación del rebote.",
      "Remate de primera.",
      "Atención del cazador."
    ],
    "correcciones": [
      "Anticipar el rebote.",
      "No descansar."
    ],
    "reglas": [
      "Disparo desde 20 m.",
      "Cazador atento al rebote.",
      "Remate de primera."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Añadir un defensor marcando al cazador para dificultar la anticipación."
    ],
    "variantes": [
      "Fútbol 7: 3 (rematador 1, cazador, portero). · 12-15 min.",
      "Fútbol 11: 3 (rematador 1, cazador, portero). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 045",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-045-FINALIZACION-REBOTE-PORTERO/CampoBase_Finalizacion_Rebote_Portero.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-045-FINALIZACION-REBOTE-PORTERO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-046-SECUENCIAS-ROTATIVAS-DEFINICION",
  "nombre": "Secuencias rotativas de definición",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Remate",
      "Ángulos",
      "Definición"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 6,
      "organizacion": "3-6"
    },
    "material": "12 balones + 1 portería + conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Secuencia 1: remate frontal a 18 m."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Secuencia 2: remate diagonal desde 20 m izquierda."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Secuencia 3: remate diagonal desde 20 m derecha."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Jugador hace 3 remates en cada secuencia, rota tras completar todas."
      }
    ],
    "explicacion_breve": "Tres secuencias de remate (frontal a 18 m, diagonal izquierda y diagonal derecha a 20 m); el jugador hace 3 remates en cada una y rota al completar todas.",
    "leyenda": "Azul: secuencias (E1/E2/E3) · Flecha roja: remate"
  },
  "detalle": {
    "objetivos": [
      "Trabajar remate desde 3 ángulos distintos en una sola sesión."
    ],
    "claves_entrenador": [
      "El ángulo cambia dónde apuntar — desde diagonal, siempre buscar el palo LEJANO al portero."
    ],
    "montaje": [
      "Secuencia 1: remate frontal a 18 m."
    ],
    "desarrollo": [
      "Secuencia 1: remate frontal a 18 m.",
      "Secuencia 2: remate diagonal desde 20 m izquierda.",
      "Secuencia 3: remate diagonal desde 20 m derecha.",
      "Jugador hace 3 remates en cada secuencia, rota tras completar todas."
    ],
    "que_buscamos": [
      "Remate",
      "Ángulos",
      "Definición"
    ],
    "que_observar": [
      "Ángulo de cada secuencia.",
      "Palo lejano desde diagonal.",
      "Rotación."
    ],
    "correcciones": [
      "Buscar el palo lejano desde diagonal.",
      "Ajustar el ángulo."
    ],
    "reglas": [
      "3 secuencias de remate.",
      "3 remates por secuencia.",
      "Rotar al completar."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar defensor en cada secuencia, o pases previos de un compañero."
    ],
    "variantes": [
      "Fútbol 7: 3-6. · 15-20 min.",
      "Fútbol 11: 3-6. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 046",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 25 x 25 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-046-SECUENCIAS-ROTATIVAS-DEFINICION/CampoBase_Secuencias_Rotativas_Definicion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-046-SECUENCIAS-ROTATIVAS-DEFINICION/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-047-VASELINA-CHIP-PORTERO-ADELANTADO",
  "nombre": "Vaselina al portero adelantado",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Vaselina",
      "Definición",
      "Cara a cara"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (atacante y portero)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Atacante conduce despacio hacia la portería."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Portero está posicionado adelantado (a 5 m de la portería)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Atacante ejecuta vaselina por encima del portero."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 repeticiones. Rotar roles."
      }
    ],
    "explicacion_breve": "El atacante conduce despacio y, con el portero adelantado a 5 m, ejecuta una vaselina por encima de él.",
    "leyenda": "Azul: atacante (J) · Verde: portero adelantado (K) · Flecha roja: vaselina"
  },
  "detalle": {
    "objetivos": [
      "Especializar la técnica de la vaselina en cara a cara con portero saliendo."
    ],
    "claves_entrenador": [
      "La vaselina se hace con la puntera BAJO el balón, sin acompañar el remate. Golpe corto y seco."
    ],
    "montaje": [
      "Atacante conduce despacio hacia la portería."
    ],
    "desarrollo": [
      "Atacante conduce despacio hacia la portería.",
      "Portero está posicionado adelantado (a 5 m de la portería).",
      "Atacante ejecuta vaselina por encima del portero.",
      "8 repeticiones. Rotar roles."
    ],
    "que_buscamos": [
      "Vaselina",
      "Definición",
      "Cara a cara"
    ],
    "que_observar": [
      "Técnica de la vaselina.",
      "Puntera bajo el balón.",
      "Golpe corto y seco."
    ],
    "correcciones": [
      "Puntera bajo el balón.",
      "Sin acompañar el remate."
    ],
    "reglas": [
      "Portero adelantado.",
      "Vaselina por encima.",
      "8 repeticiones."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Variar la altura de posición del portero (más adelantado o menos) para adaptar la vaselina."
    ],
    "variantes": [
      "Fútbol 7: 2 (atacante y portero). · 10-12 min.",
      "Fútbol 11: 2 (atacante y portero). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 047",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-047-VASELINA-CHIP-PORTERO-ADELANTADO/CampoBase_Vaselina_Chip_Portero_Adelantado.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-047-VASELINA-CHIP-PORTERO-ADELANTADO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-048-VOLEA-SOBRE-PASE-ALTO",
  "nombre": "Volea sobre pase alto",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Volea",
      "Juego aéreo",
      "Definición"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (lanzador y rematador)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Lanzador a 15 m del rematador, con balón en manos."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Lanza balón alto en parábola hacia el pie del rematador."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Rematador ejecuta VOLEA (golpear en el aire, sin control)."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8 remates. Rotar."
      }
    ],
    "explicacion_breve": "El lanzador envía un balón alto en parábola hacia el pie del rematador, que ejecuta una volea en el aire sin control.",
    "leyenda": "Amarillo: lanzador (L) · Azul: rematador (R) · Flecha azul: pase aéreo · Flecha roja: volea"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la ejecución de la volea completa (balón sin tocar suelo)."
    ],
    "claves_entrenador": [
      "El cuerpo se inclina levemente hacia atrás. Pie de apoyo BIEN plantado, rodilla del remate flexionada."
    ],
    "montaje": [
      "Lanzador a 15 m del rematador, con balón en manos."
    ],
    "desarrollo": [
      "Lanzador a 15 m del rematador, con balón en manos.",
      "Lanza balón alto en parábola hacia el pie del rematador.",
      "Rematador ejecuta VOLEA (golpear en el aire, sin control).",
      "8 remates. Rotar."
    ],
    "que_buscamos": [
      "Volea",
      "Juego aéreo",
      "Definición"
    ],
    "que_observar": [
      "Inclinación del cuerpo.",
      "Pie de apoyo plantado.",
      "Contacto en el aire."
    ],
    "correcciones": [
      "Inclinar levemente hacia atrás.",
      "Pie de apoyo plantado."
    ],
    "reglas": [
      "Pase alto en parábola.",
      "Volea en el aire.",
      "8 remates."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar velocidad y altura del pase; alternar entre volea de derecha e izquierda."
    ],
    "variantes": [
      "Fútbol 7: 2 (lanzador y rematador). · 12-15 min.",
      "Fútbol 11: 2 (lanzador y rematador). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 048",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-048-VOLEA-SOBRE-PASE-ALTO/CampoBase_Volea_Sobre_Pase_Alto.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-048-VOLEA-SOBRE-PASE-ALTO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-049-MEDIA-VOLEA-SUPERFICIE-EXTERIOR",
  "nombre": "Media volea con superficie exterior",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Media volea",
      "Superficie exterior",
      "Definición"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (lanzador + rematador)"
    },
    "material": "6 balones + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Lanzador tira balón bombeado que caiga cerca del rematador."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Rematador ejecuta MEDIA VOLEA (balón pica una vez y se remata)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Alternar entre superficie interior y exterior del pie."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6 remates por superficie. Rotar."
      }
    ],
    "explicacion_breve": "El lanzador tira un balón bombeado que pica una vez cerca del rematador, que ejecuta una media volea alternando interior y exterior del pie.",
    "leyenda": "Amarillo: lanzador (L) · Azul: rematador (R) · Flecha azul: pase bombeado · Flecha roja: media volea"
  },
  "detalle": {
    "objetivos": [
      "Ampliar repertorio de finalización con superficie técnica avanzada."
    ],
    "claves_entrenador": [
      "La media volea requiere leer el bote. Golpear cuando el balón está SUBIENDO, no cayendo."
    ],
    "montaje": [
      "Lanzador tira balón bombeado que caiga cerca del rematador."
    ],
    "desarrollo": [
      "Lanzador tira balón bombeado que caiga cerca del rematador.",
      "Rematador ejecuta MEDIA VOLEA (balón pica una vez y se remata).",
      "Alternar entre superficie interior y exterior del pie.",
      "6 remates por superficie. Rotar."
    ],
    "que_buscamos": [
      "Media volea",
      "Superficie exterior",
      "Definición"
    ],
    "que_observar": [
      "Lectura del bote.",
      "Golpear subiendo.",
      "Superficie interior/exterior."
    ],
    "correcciones": [
      "Golpear cuando sube.",
      "Leer el bote."
    ],
    "reglas": [
      "Balón bombeado que pica una vez.",
      "Media volea.",
      "Alternar interior/exterior."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Ejecutar bajo presión de defensor pasivo apareciendo cerca del remate."
    ],
    "variantes": [
      "Fútbol 7: 2 (lanzador + rematador). · 10-12 min.",
      "Fútbol 11: 2 (lanzador + rematador). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 049",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-14+.",
        "Intensidad: alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-049-MEDIA-VOLEA-SUPERFICIE-EXTERIOR/CampoBase_Media_Volea_Superficie_Exterior.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-049-MEDIA-VOLEA-SUPERFICIE-EXTERIOR/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-050-CIRCUITO-COMPLETO-FINALIZACION",
  "nombre": "Circuito completo de finalización (4 secuencias)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Finalización",
    "que_se_trabaja": [
      "Definición",
      "Circuito",
      "Finalización"
    ],
    "tiempo_estimado_15": "20-25 min",
    "jugadores": {
      "total": 4,
      "organizacion": "4+ (un jugador recorre las 4 secuencias; el entrenador o un compañero da los pases)"
    },
    "material": "balones + 1 portería + 5 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Secuencia 1: remate estático a 18 m con pie dominante (balón parado, sin pase)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Secuencia 2: definición primer toque tras pase del entrenador."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Secuencia 3: 1v1 con portero desde 20 m (el jugador conduce el balón)."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Secuencia 4: cabeceo tras centro por banda del entrenador."
      }
    ],
    "explicacion_breve": "Circuito de 4 secuencias que recorre el MISMO jugador: remate estático a 18 m, definición primer toque tras pase, 1v1 con portero desde 20 m y cabeceo tras centro por banda. Los pases los da el entrenador (o un compañero) desde la zona de servicio.",
    "leyenda": "Azul: secuencias (E1-E4) · Flecha roja: remate · Flecha azul: centro"
  },
  "detalle": {
    "objetivos": [
      "Integrar todo el trabajo de finalización en un circuito realista."
    ],
    "claves_entrenador": [
      "En circuito, la calidad importa MÁS que la cantidad. Mejor 1 remate perfecto que 5 apurados."
    ],
    "montaje": [
      "Secuencia 1: remate estático a 18 m con pie dominante (balón parado, sin pase)."
    ],
    "desarrollo": [
      "Secuencia 1: remate estático a 18 m con pie dominante (balón parado, sin pase).",
      "Secuencia 2: definición primer toque tras pase del entrenador.",
      "Secuencia 3: 1v1 con portero desde 20 m (el jugador conduce el balón).",
      "Secuencia 4: cabeceo tras centro por banda del entrenador."
    ],
    "que_buscamos": [
      "Definición",
      "Circuito",
      "Finalización"
    ],
    "que_observar": [
      "Calidad del remate.",
      "Encadenar secuencias.",
      "Técnica de cada secuencia."
    ],
    "correcciones": [
      "Priorizar la calidad.",
      "No apurar los remates."
    ],
    "reglas": [
      "El mismo jugador recorre las 4 secuencias.",
      "Los pases los da el entrenador o un compañero.",
      "Calidad sobre cantidad."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Cronometrar circuito completo y buscar mejorar tiempo con calidad mantenida."
    ],
    "variantes": [
      "Fútbol 7: 4+ (un jugador recorre las 4 secuencias; el entrenador o un compañero da los pases). · 20-25 min.",
      "Fútbol 11: 4+ (un jugador recorre las 4 secuencias; el entrenador o un compañero da los pases). · 20-25 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 2 Definición y Finalización, ejercicio 050",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 40 x 25 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-050-CIRCUITO-COMPLETO-FINALIZACION/CampoBase_Circuito_Completo_Finalizacion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-050-CIRCUITO-COMPLETO-FINALIZACION/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-051-DOMINIOS-INDIVIDUALES-PIE-DOMINANTE",
  "nombre": "Dominios individuales — pie dominante",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Dominio",
      "Control",
      "Pie dominante"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 (individual)"
    },
    "material": "1 balón por jugador",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Cada jugador con su balón, distribuidos por el espacio."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Realizar dominios con el empeine del pie dominante, sin dejar caer."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Contar los dominios seguidos y buscar batir el récord personal."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 series de 60 segundos con 30s de descanso."
      }
    ],
    "explicacion_breve": "Cada jugador, con su balón, realiza dominios con el empeine del pie dominante sin dejar caer, contando los seguidos para batir su récord personal.",
    "leyenda": "Azul: jugador (J) · Balón: dominio (sube y baja)"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar el control fino del balón y la sensibilidad con el pie dominante."
    ],
    "claves_entrenador": [
      "El toque debe ser SUAVE, no fuerte. Balón cerca del pie, no lejos."
    ],
    "montaje": [
      "Cada jugador con su balón, distribuidos por el espacio."
    ],
    "desarrollo": [
      "Cada jugador con su balón, distribuidos por el espacio.",
      "Realizar dominios con el empeine del pie dominante, sin dejar caer.",
      "Contar los dominios seguidos y buscar batir el récord personal.",
      "3 series de 60 segundos con 30s de descanso."
    ],
    "que_buscamos": [
      "Dominio",
      "Control",
      "Pie dominante"
    ],
    "que_observar": [
      "Suavidad del toque.",
      "Balón cerca del pie.",
      "Récord personal."
    ],
    "correcciones": [
      "Toque suave, no fuerte.",
      "Balón cerca del pie."
    ],
    "reglas": [
      "Dominios con el empeine del pie dominante.",
      "Sin dejar caer el balón.",
      "3 series de 60s."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Ejecutar dominios mientras se camina lentamente por el espacio."
    ],
    "variantes": [
      "Fútbol 7: 1-15 (individual). · 6-8 min.",
      "Fútbol 11: 1-15 (individual). · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 051",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: baja.",
        "Espacio: 2 x 2 m por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-051-DOMINIOS-INDIVIDUALES-PIE-DOMINANTE/CampoBase_Dominios_Individuales_Pie_Dominante.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-051-DOMINIOS-INDIVIDUALES-PIE-DOMINANTE/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-052-DOMINIOS-ALTERNANDO-PIES",
  "nombre": "Dominios alternando pies",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Dominio",
      "Ambidextría",
      "Coordinación"
    ],
    "tiempo_estimado_15": "6-8 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15"
    },
    "material": "1 balón por jugador",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Cada jugador con balón."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Alternar dominios: 1 con pie derecho, 1 con pie izquierdo, sin parar."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Buscar mantener el ritmo constante sin perder el balón."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 series de 60s. Registrar el récord de dominios alternados seguidos."
      }
    ],
    "explicacion_breve": "Cada jugador alterna dominios (uno con pie derecho, uno con pie izquierdo) sin parar, buscando mantener el ritmo constante sin perder el balón.",
    "leyenda": "Azul: jugador (J) · Balón: dominio alternando pies"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar ambidextría y coordinación con ambos pies en el dominio."
    ],
    "claves_entrenador": [
      "Ritmo antes que velocidad. Al inicio, aceptar que el pie 'malo' va a fallar más."
    ],
    "montaje": [
      "Cada jugador con balón."
    ],
    "desarrollo": [
      "Cada jugador con balón.",
      "Alternar dominios: 1 con pie derecho, 1 con pie izquierdo, sin parar.",
      "Buscar mantener el ritmo constante sin perder el balón.",
      "3 series de 60s. Registrar el récord de dominios alternados seguidos."
    ],
    "que_buscamos": [
      "Dominio",
      "Ambidextría",
      "Coordinación"
    ],
    "que_observar": [
      "Alternancia de pies.",
      "Ritmo constante.",
      "Récord de dominios alternados."
    ],
    "correcciones": [
      "Ritmo antes que velocidad.",
      "Aceptar el fallo del pie no dominante."
    ],
    "reglas": [
      "Alternar pie derecho e izquierdo.",
      "Mantener el ritmo constante.",
      "3 series de 60s."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Introducir la regla: cada 5 dominios debe ir muslo (izq o der) intercalado."
    ],
    "variantes": [
      "Fútbol 7: 1-15. · 6-8 min.",
      "Fútbol 11: 1-15. · 6-8 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 052",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: baja-media.",
        "Espacio: 2 x 2 m por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-052-DOMINIOS-ALTERNANDO-PIES/CampoBase_Dominios_Alternando_Pies.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-052-DOMINIOS-ALTERNANDO-PIES/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-053-DOMINIOS-MUSLO-CABEZA",
  "nombre": "Dominios con muslo y cabeza",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Dominio",
      "Muslo",
      "Cabeza"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15"
    },
    "material": "1 balón por jugador",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Cada jugador con balón, empieza con dominios en pie."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Cada 3 dominios, subir el balón a MUSLO y hacer 2 dominios ahí."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Luego elevar a CABEZA y dar 2 cabeceos suaves."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Bajar de nuevo a pie y repetir el ciclo. 4-5 minutos continuos."
      }
    ],
    "explicacion_breve": "Cada jugador empieza con dominios en pie y, cada 3 dominios, sube el balón a muslo (2 dominios) y luego a cabeza (2 cabeceos suaves), bajando de nuevo a pie para repetir el ciclo.",
    "leyenda": "Azul: jugador (J) · Balón: sube pie → muslo → cabeza"
  },
  "detalle": {
    "objetivos": [
      "Ampliar el repertorio técnico del control con superficies distintas del cuerpo."
    ],
    "claves_entrenador": [
      "Al pasar de una superficie a otra, el toque debe ser MÁS SUAVE que el anterior."
    ],
    "montaje": [
      "Cada jugador con balón, empieza con dominios en pie."
    ],
    "desarrollo": [
      "Cada jugador con balón, empieza con dominios en pie.",
      "Cada 3 dominios, subir el balón a MUSLO y hacer 2 dominios ahí.",
      "Luego elevar a CABEZA y dar 2 cabeceos suaves.",
      "Bajar de nuevo a pie y repetir el ciclo. 4-5 minutos continuos."
    ],
    "que_buscamos": [
      "Dominio",
      "Muslo",
      "Cabeza"
    ],
    "que_observar": [
      "Cambio de superficie.",
      "Suavidad del toque.",
      "Ciclo completo."
    ],
    "correcciones": [
      "Toque más suave al cambiar de superficie.",
      "Mantener el ciclo sin parar."
    ],
    "reglas": [
      "Ciclo pie → muslo → cabeza.",
      "Toque más suave al cambiar de superficie.",
      "4-5 min continuos."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Establecer secuencia fija: 3 pie + 2 muslo + 2 cabeza + 2 muslo + 3 pie, sin parar."
    ],
    "variantes": [
      "Fútbol 7: 1-15. · 8-10 min.",
      "Fútbol 11: 1-15. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 053",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: baja.",
        "Espacio: 2 x 2 m por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-053-DOMINIOS-MUSLO-CABEZA/CampoBase_Dominios_Muslo_Cabeza.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-053-DOMINIOS-MUSLO-CABEZA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-054-DOMINIOS-PROGRESIVOS-CIRCUITO",
  "nombre": "Dominios progresivos en circuito",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Dominio",
      "Movimiento",
      "Estabilidad"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8"
    },
    "material": "1 balón por jugador",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugador arranca haciendo dominios en el sitio."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Sin dejar caer el balón, avanza 5 pasos con dominios en movimiento."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Al llegar, hace 5 dominios alternando pies rápidos."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Devuelve el balón al pie de apoyo y para. Repite 4-5 veces."
      }
    ],
    "explicacion_breve": "El jugador arranca con dominios en el sitio, avanza 5 pasos con dominios en movimiento, hace 5 dominios alternando pies rápidos y para devolviendo el balón al pie de apoyo.",
    "leyenda": "Azul: jugador (J) · Cono: referencia del circuito · Flecha roja: avance"
  },
  "detalle": {
    "objetivos": [
      "Combinar dominios con movimiento y patrones específicos."
    ],
    "claves_entrenador": [
      "El objetivo NO es la cantidad — es la estabilidad del balón durante todo el circuito."
    ],
    "montaje": [
      "Jugador arranca haciendo dominios en el sitio."
    ],
    "desarrollo": [
      "Jugador arranca haciendo dominios en el sitio.",
      "Sin dejar caer el balón, avanza 5 pasos con dominios en movimiento.",
      "Al llegar, hace 5 dominios alternando pies rápidos.",
      "Devuelve el balón al pie de apoyo y para. Repite 4-5 veces."
    ],
    "que_buscamos": [
      "Dominio",
      "Movimiento",
      "Estabilidad"
    ],
    "que_observar": [
      "Estabilidad del balón.",
      "Dominios en movimiento.",
      "Parada controlada."
    ],
    "correcciones": [
      "Priorizar la estabilidad.",
      "No buscar la cantidad."
    ],
    "reglas": [
      "Dominios en el sitio.",
      "Avanzar 5 pasos sin dejar caer.",
      "5 dominios rápidos y parar."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar giros de 180° o 360° cada 5 dominios sin perder el balón."
    ],
    "variantes": [
      "Fútbol 7: 1-8. · 10-12 min.",
      "Fútbol 11: 1-8. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 054",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media.",
        "Espacio: 5 x 5 m por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-054-DOMINIOS-PROGRESIVOS-CIRCUITO/CampoBase_Dominios_Progresivos_Circuito.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-054-DOMINIOS-PROGRESIVOS-CIRCUITO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-055-CONTROL-ORIENTADO-INTERIOR",
  "nombre": "Control orientado con interior",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Control",
      "Primer toque",
      "Orientación"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "1 balón por pareja + 2 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Colocar 2 conos separados 5m. Un jugador de cada lado."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Uno pasa raso al compañero."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El compañero recibe con INTERIOR y con el mismo toque orienta el balón hacia el cono al costado."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Devuelve pase. 10 controles por lado, luego cambiar."
      }
    ],
    "explicacion_breve": "Con 2 conos separados 5 m y un jugador a cada lado, uno pasa raso y el compañero recibe con el interior orientando el balón hacia el cono al costado en el mismo toque.",
    "leyenda": "Amarillo: pasador (P) · Azul: receptor (R) · Cono: objetivo del control · Flecha azul: pase · Flecha roja: control orientado"
  },
  "detalle": {
    "objetivos": [
      "Entrenar el primer toque de recepción orientado hacia el espacio libre."
    ],
    "claves_entrenador": [
      "El pie recibe el balón LATERALMENTE, no de frente. Se abre y lleva el balón hacia donde vas a ir."
    ],
    "montaje": [
      "Colocar 2 conos separados 5m. Un jugador de cada lado."
    ],
    "desarrollo": [
      "Colocar 2 conos separados 5m. Un jugador de cada lado.",
      "Uno pasa raso al compañero.",
      "El compañero recibe con INTERIOR y con el mismo toque orienta el balón hacia el cono al costado.",
      "Devuelve pase. 10 controles por lado, luego cambiar."
    ],
    "que_buscamos": [
      "Control",
      "Primer toque",
      "Orientación"
    ],
    "que_observar": [
      "Recepción lateral.",
      "Orientación al cono libre.",
      "Primer toque."
    ],
    "correcciones": [
      "Recibir lateralmente, no de frente.",
      "Orientar hacia el espacio libre."
    ],
    "reglas": [
      "Pase raso al compañero.",
      "Control con interior orientado.",
      "10 controles por lado."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar defensor pasivo por detrás para forzar orientar hacia el lado libre."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 10-12 min.",
      "Fútbol 11: 2 por pareja. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 055",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: 10 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-055-CONTROL-ORIENTADO-INTERIOR/CampoBase_Control_Orientado_Interior.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-055-CONTROL-ORIENTADO-INTERIOR/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-056-CONTROL-BALON-ALTO-MUSLO",
  "nombre": "Control de balón alto con muslo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Control",
      "Muslo",
      "Recepción aérea"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "1 balón por pareja",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Lanzador tira balón en parábola alta hacia el receptor."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Receptor eleva rodilla, absorbe con la parte superior del muslo."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El balón debe caer a los pies del receptor, controlado."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 recepciones. Cambio de roles."
      }
    ],
    "explicacion_breve": "El lanzador tira el balón en parábola alta y el receptor eleva la rodilla para absorber con la parte superior del muslo, dejando que el balón caiga controlado a sus pies.",
    "leyenda": "Naranja: lanzador (L) · Azul: receptor (R) · Flecha azul: trayectoria del balón (parábola) · Flecha roja: elevar rodilla/muslo"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la recepción de balón alto con muslo, la superficie técnica más difícil."
    ],
    "claves_entrenador": [
      "El muslo va SUBIENDO cuando el balón desciende. Absorber, no rebotar. Piensa: el muslo es un colchón."
    ],
    "montaje": [
      "Lanzador tira balón en parábola alta hacia el receptor."
    ],
    "desarrollo": [
      "Lanzador tira balón en parábola alta hacia el receptor.",
      "Receptor eleva rodilla, absorbe con la parte superior del muslo.",
      "El balón debe caer a los pies del receptor, controlado.",
      "10 recepciones. Cambio de roles."
    ],
    "que_buscamos": [
      "Control",
      "Muslo",
      "Recepción aérea"
    ],
    "que_observar": [
      "Elevación de la rodilla.",
      "Absorción (no rebote).",
      "Balón controlado a los pies."
    ],
    "correcciones": [
      "Absorber, no rebotar.",
      "El muslo sube cuando el balón desciende."
    ],
    "reglas": [
      "Parábola alta del lanzador.",
      "Absorber con la parte superior del muslo.",
      "10 recepciones por jugador."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Recibir con muslo → primer toque orientado al lado → pase al compañero."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 10-12 min.",
      "Fútbol 11: 2 por pareja. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 056",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media.",
        "Espacio: 8 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-056-CONTROL-BALON-ALTO-MUSLO/CampoBase_Control_Balon_Alto_Muslo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-056-CONTROL-BALON-ALTO-MUSLO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-057-CONTROL-PECHO-DESCARGA",
  "nombre": "Control con pecho + descarga",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Control",
      "Pecho",
      "Descarga"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "1 balón por pareja",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Lanzador tira balón fuerte y alto al pecho del receptor."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Receptor absorbe con el pecho (hombros hacia atrás, torso echado)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Balón cae, receptor lo controla con el pie y pasa de vuelta."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 recepciones cada uno."
      }
    ],
    "explicacion_breve": "El lanzador tira el balón fuerte y alto al pecho del receptor, que absorbe con el pecho (hombros atrás, torso echado) y descarga al pie para devolver el pase.",
    "leyenda": "Naranja: lanzador (L) · Azul: receptor (R) · Flecha azul: trayectoria del balón · Flecha azul sólida: descarga al pie"
  },
  "detalle": {
    "objetivos": [
      "Recibir balón alto con pecho y descargar al pie para próximo pase."
    ],
    "claves_entrenador": [
      "El pecho se INCLINA hacia atrás en el momento del contacto. Nunca de pie erguido — rebota lejos."
    ],
    "montaje": [
      "Lanzador tira balón fuerte y alto al pecho del receptor."
    ],
    "desarrollo": [
      "Lanzador tira balón fuerte y alto al pecho del receptor.",
      "Receptor absorbe con el pecho (hombros hacia atrás, torso echado).",
      "Balón cae, receptor lo controla con el pie y pasa de vuelta.",
      "10 recepciones cada uno."
    ],
    "que_buscamos": [
      "Control",
      "Pecho",
      "Descarga"
    ],
    "que_observar": [
      "Inclinación del torso.",
      "Absorción con el pecho.",
      "Descarga al pie."
    ],
    "correcciones": [
      "Inclinar el pecho hacia atrás.",
      "No recibir de pie erguido."
    ],
    "reglas": [
      "Balón fuerte y alto al pecho.",
      "Absorber con el pecho (torso echado).",
      "10 recepciones cada uno."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Balón muy fuerte + defensor pasivo cerca (aumentar presión de decisión)."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 10-12 min.",
      "Fútbol 11: 2 por pareja. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 057",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: media-alta.",
        "Espacio: 10 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-057-CONTROL-PECHO-DESCARGA/CampoBase_Control_Pecho_Descarga.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-057-CONTROL-PECHO-DESCARGA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-058-RECEPCION-GIRO-ADVERSARIO-ESPALDA",
  "nombre": "Recepción y giro con adversario a la espalda",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Recepción",
      "Giro",
      "Protección"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (pasador, receptor, defensor)"
    },
    "material": "1 balón + 2 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Colocar receptor a 10m del pasador, con defensor pasivo a 1m detrás."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Pasador entrega balón raso al receptor."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Receptor debe recibir, girar en el mismo movimiento y encarar a la portería imaginaria."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 giros por receptor. Rotar."
      }
    ],
    "explicacion_breve": "Con el receptor a 10 m del pasador y un defensor pasivo a 1 m detrás, el receptor recibe, gira en el mismo movimiento y encara a la portería imaginaria.",
    "leyenda": "Naranja: pasador (P) · Azul: receptor (R) · Púrpura: defensor pasivo (D) · Flecha azul: pase · Flecha roja: giro del receptor"
  },
  "detalle": {
    "objetivos": [
      "Aprender a girar con balón cuando hay un defensor detrás."
    ],
    "claves_entrenador": [
      "Antes de recibir, MIRAR por encima del hombro para saber por qué lado girar. Nunca sin mirar."
    ],
    "montaje": [
      "Colocar receptor a 10m del pasador, con defensor pasivo a 1m detrás."
    ],
    "desarrollo": [
      "Colocar receptor a 10m del pasador, con defensor pasivo a 1m detrás.",
      "Pasador entrega balón raso al receptor.",
      "Receptor debe recibir, girar en el mismo movimiento y encarar a la portería imaginaria.",
      "10 giros por receptor. Rotar."
    ],
    "que_buscamos": [
      "Recepción",
      "Giro",
      "Protección"
    ],
    "que_observar": [
      "Mirada por encima del hombro.",
      "Giro en el mismo movimiento.",
      "Encarar la portería."
    ],
    "correcciones": [
      "Mirar antes de recibir.",
      "Girar en el mismo movimiento."
    ],
    "reglas": [
      "Defensor pasivo a 1 m detrás.",
      "Recibir y girar en el mismo movimiento.",
      "10 giros por receptor."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Defensor activo — trata de recuperar el balón antes del giro completo."
    ],
    "variantes": [
      "Fútbol 7: 3 (pasador, receptor, defensor). · 12-15 min.",
      "Fútbol 11: 3 (pasador, receptor, defensor). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 058",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 12 x 8 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-058-RECEPCION-GIRO-ADVERSARIO-ESPALDA/CampoBase_Recepcion_Giro_Adversario_Espalda.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-058-RECEPCION-GIRO-ADVERSARIO-ESPALDA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-059-PASE-CORTO-CONTRA-PARED",
  "nombre": "Pase corto contra pared",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Pase corto",
      "Control",
      "Precisión"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 1,
      "organizacion": "1 (o varios en paralelo)"
    },
    "material": "1 balón + pared",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugador a 3-4m de una pared con balón."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Pases suaves contra la pared con interior del pie."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Controlar el rebote con la SUPERFICIE INTERIOR y volver a pasar."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 series de 30 pases alternando pies."
      }
    ],
    "explicacion_breve": "El jugador, a 3-4 m de una pared, hace pases suaves con el interior del pie y controla el rebote con la superficie interior para volver a pasar, alternando pies.",
    "leyenda": "Azul: jugador (J) · Pared: superficie de rebote · Flecha azul: pase y rebote"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar la técnica pura del pase corto con precisión y rebote controlado."
    ],
    "claves_entrenador": [
      "El pase y el control son UN SOLO gesto. Interior contra interior. Sin pasos intermedios."
    ],
    "montaje": [
      "Jugador a 3-4m de una pared con balón."
    ],
    "desarrollo": [
      "Jugador a 3-4m de una pared con balón.",
      "Pases suaves contra la pared con interior del pie.",
      "Controlar el rebote con la SUPERFICIE INTERIOR y volver a pasar.",
      "3 series de 30 pases alternando pies."
    ],
    "que_buscamos": [
      "Pase corto",
      "Control",
      "Precisión"
    ],
    "que_observar": [
      "Precisión del pase.",
      "Control del rebote.",
      "Alternancia de pies."
    ],
    "correcciones": [
      "Pase y control como un solo gesto.",
      "Interior contra interior."
    ],
    "reglas": [
      "Pases suaves con el interior.",
      "Controlar el rebote con el interior.",
      "3 series de 30 pases."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar la fuerza del pase progresivamente — mismo control."
    ],
    "variantes": [
      "Fútbol 7: 1 (o varios en paralelo). · 8-10 min.",
      "Fútbol 11: 1 (o varios en paralelo). · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 059",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: baja-media.",
        "Espacio: 3 x 3 m por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-059-PASE-CORTO-CONTRA-PARED/CampoBase_Pase_Corto_Contra_Pared.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-059-PASE-CORTO-CONTRA-PARED/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-060-PASE-CORTO-TRIOS-TRIANGULOS",
  "nombre": "Pase corto en tríos (triángulos)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Pase corto",
      "Orientación",
      "Posesión"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 por trío"
    },
    "material": "1 balón por trío + 3 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "3 jugadores formando un triángulo equilátero de 8m de lado (marcado con conos)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Balón circula: A pasa a B, B pasa a C, C pasa a A."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Cada jugador debe orientar el cuerpo ANTES de recibir para dar el próximo pase."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "45 segundos continuos. Descanso 30s. 5-6 series."
      }
    ],
    "explicacion_breve": "Tres jugadores en triángulo equilátero de 8 m hacen circular el balón (A→B→C→A), orientando el cuerpo antes de recibir para dar el próximo pase.",
    "leyenda": "Azul: A · Naranja: B · Verde: C · Flecha azul: pase · Flecha curva: control orientado"
  },
  "detalle": {
    "objetivos": [
      "Trabajar el pase corto en tres direcciones y la orientación del cuerpo."
    ],
    "claves_entrenador": [
      "Perfil abierto SIEMPRE — nunca dar pase de espaldas al próximo compañero."
    ],
    "montaje": [
      "3 jugadores formando un triángulo equilátero de 8m de lado (marcado con conos)."
    ],
    "desarrollo": [
      "3 jugadores formando un triángulo equilátero de 8m de lado (marcado con conos).",
      "Balón circula: A pasa a B, B pasa a C, C pasa a A.",
      "Cada jugador debe orientar el cuerpo ANTES de recibir para dar el próximo pase.",
      "45 segundos continuos. Descanso 30s. 5-6 series."
    ],
    "que_buscamos": [
      "Pase corto",
      "Orientación",
      "Posesión"
    ],
    "que_observar": [
      "Orientación del cuerpo.",
      "Precisión del pase.",
      "Perfil abierto."
    ],
    "correcciones": [
      "Orientar el cuerpo antes de recibir.",
      "Nunca de espaldas al próximo pase."
    ],
    "reglas": [
      "Triángulo equilátero de 8 m.",
      "Circulación A→B→C→A.",
      "45 s continuos, 5-6 series."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Cambiar dirección del pase (empezar sentido horario, cambiar a antihorario)."
    ],
    "variantes": [
      "Fútbol 7: 3 por trío. · 10-12 min.",
      "Fútbol 11: 3 por trío. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — Sección 3 Pase, Técnica y Posesión, ejercicio 060",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: 8 x 8 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-060-PASE-CORTO-TRIOS-TRIANGULOS/CampoBase_Pase_Corto_Trios_Triangulos.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-060-PASE-CORTO-TRIOS-TRIANGULOS/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-061-PASE-CORTO-MOVIL-CUADRADO",
  "nombre": "Pase corto móvil en cuadrado",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Pase corto",
      "Movilidad",
      "Pase y sigue"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 4,
      "organizacion": "4 por cuadrado"
    },
    "material": "1 balón + 4 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "4 jugadores, uno en cada esquina de un cuadrado de 10m."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "A pasa a B, y CORRE al lugar de B (regla: pasa y sigue al lugar del que recibe)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "B pasa a C y corre a lugar de C. Y así sucesivamente."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "60 segundos continuos. Descanso 30s. 4-5 series."
      }
    ],
    "explicacion_breve": "Cuatro jugadores en las esquinas de un cuadrado de 10 m se pasan el balón y, tras cada pase, corren al lugar del que recibe, en un ciclo continuo.",
    "leyenda": "A, B, C, D: jugadores en las esquinas · Flecha azul: pase · Flecha roja: carrera al lugar del que recibe"
  },
  "detalle": {
    "objetivos": [
      "Combinar pase con desplazamiento — moverse tras el pase."
    ],
    "claves_entrenador": [
      "El pase sale ANTES de que empieces a correr. Nunca esperar a haber llegado."
    ],
    "montaje": [
      "4 jugadores, uno en cada esquina de un cuadrado de 10m."
    ],
    "desarrollo": [
      "4 jugadores, uno en cada esquina de un cuadrado de 10m.",
      "A pasa a B, y CORRE al lugar de B (regla: pasa y sigue al lugar del que recibe).",
      "B pasa a C y corre a lugar de C. Y así sucesivamente.",
      "60 segundos continuos. Descanso 30s. 4-5 series."
    ],
    "que_buscamos": [
      "Pase corto",
      "Movilidad",
      "Pase y sigue"
    ],
    "que_observar": [
      "Pase antes de correr.",
      "Movilidad tras el pase.",
      "Ritmo continuo."
    ],
    "correcciones": [
      "Pasar antes de correr.",
      "No esperar a llegar para pasar."
    ],
    "reglas": [
      "Pasar y correr al lugar del que recibe.",
      "60 s continuos.",
      "4-5 series."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Invertir la regla: 'pase y corre al OPUESTO' (más complejo cognitivamente)."
    ],
    "variantes": [
      "Fútbol 7: 4 por cuadrado. · 10-12 min.",
      "Fútbol 11: 4 por cuadrado. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 061",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 10 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-061-PASE-CORTO-MOVIL-CUADRADO/CampoBase_Pase_Corto_Movil_Cuadrado.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-061-PASE-CORTO-MOVIL-CUADRADO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-062-PASE-CORTO-ALTERNANDO-PIES-PRESION",
  "nombre": "Pase corto alternando pies con presión",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Pase",
      "Pie no dominante",
      "Presión"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (2 pasadores + 1 recuperador pasivo)"
    },
    "material": "1 balón + 4 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "2 jugadores separados por 10m, un recuperador entre ellos."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Se pasan la pelota alternando pie derecho y pie izquierdo estrictamente."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El recuperador presiona SOLO al que va a recibir, tratando de tocar la pelota."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "60s por serie. Rotar recuperador. 6 series."
      }
    ],
    "explicacion_breve": "Dos pasadores separados 10 m se pasan la pelota alternando estrictamente pie derecho e izquierdo, mientras un recuperador pasivo presiona al que va a recibir.",
    "leyenda": "A, B: pasadores · D: recuperador pasivo · Flecha azul: pase · Flecha roja: presión al receptor"
  },
  "detalle": {
    "objetivos": [
      "Ampliar el pase al pie no dominante bajo presión moderada."
    ],
    "claves_entrenador": [
      "El pie no dominante mejora solo con REPETICIÓN. Sin repetición, no hay progreso posible."
    ],
    "montaje": [
      "2 jugadores separados por 10m, un recuperador entre ellos."
    ],
    "desarrollo": [
      "2 jugadores separados por 10m, un recuperador entre ellos.",
      "Se pasan la pelota alternando pie derecho y pie izquierdo estrictamente.",
      "El recuperador presiona SOLO al que va a recibir, tratando de tocar la pelota.",
      "60s por serie. Rotar recuperador. 6 series."
    ],
    "que_buscamos": [
      "Pase",
      "Pie no dominante",
      "Presión"
    ],
    "que_observar": [
      "Alternancia de pies.",
      "Pase bajo presión.",
      "Precisión del pie no dominante."
    ],
    "correcciones": [
      "Repetir con el pie no dominante.",
      "Presionar solo al receptor."
    ],
    "reglas": [
      "Alternar pie derecho e izquierdo.",
      "Presión solo al receptor.",
      "60 s por serie, 6 series."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Convertir al recuperador en activo — si roba, cambia de rol."
    ],
    "variantes": [
      "Fútbol 7: 3 (2 pasadores + 1 recuperador pasivo). · 12-15 min.",
      "Fútbol 11: 3 (2 pasadores + 1 recuperador pasivo). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 062",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media.",
        "Espacio: 12 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-062-PASE-CORTO-ALTERNANDO-PIES-PRESION/CampoBase_Pase_Corto_Alternando_Pies_Presion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-062-PASE-CORTO-ALTERNANDO-PIES-PRESION/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-063-PASE-MEDIO-15M-CONTRA-PARED",
  "nombre": "Pase medio 15m contra pared",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Pase medio",
      "Empeine",
      "Precisión"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 1,
      "organizacion": "1 (o varios)"
    },
    "material": "1 balón + pared",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugador a 15m de la pared con balón."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Pase con EMPEINE, buscando que el balón llegue rasante a la pared."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Controlar el rebote (que llega rápido) con superficie firme."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 series de 20 pases alternando pies. 1 min descanso."
      }
    ],
    "explicacion_breve": "El jugador, a 15 m de una pared, hace pases con el empeine buscando que el balón llegue rasante, y controla el rebote rápido con superficie firme.",
    "leyenda": "J: jugador · Pared: superficie de rebote · Flecha azul: pase y rebote"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la técnica del pase medio (empeine) con precisión."
    ],
    "claves_entrenador": [
      "Pie de apoyo BIEN al lado del balón. Empeine tenso, tobillo firme, seguir con el pie post-golpe."
    ],
    "montaje": [
      "Jugador a 15m de la pared con balón."
    ],
    "desarrollo": [
      "Jugador a 15m de la pared con balón.",
      "Pase con EMPEINE, buscando que el balón llegue rasante a la pared.",
      "Controlar el rebote (que llega rápido) con superficie firme.",
      "3 series de 20 pases alternando pies. 1 min descanso."
    ],
    "que_buscamos": [
      "Pase medio",
      "Empeine",
      "Precisión"
    ],
    "que_observar": [
      "Empeine tenso.",
      "Balón rasante.",
      "Control del rebote."
    ],
    "correcciones": [
      "Pie de apoyo al lado del balón.",
      "Empeine tenso y tobillo firme."
    ],
    "reglas": [
      "Pase con empeine rasante.",
      "Controlar el rebote con superficie firme.",
      "3 series de 20 pases."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Marcar zona objetivo en la pared (cuadrado) y contar aciertos."
    ],
    "variantes": [
      "Fútbol 7: 1 (o varios). · 10-12 min.",
      "Fútbol 11: 1 (o varios). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 063",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media.",
        "Espacio: 18 x 3 m por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-063-PASE-MEDIO-15M-CONTRA-PARED/CampoBase_Pase_Medio_15m_Contra_Pared.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-063-PASE-MEDIO-15M-CONTRA-PARED/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-064-PASE-LARGO-25M-EMPEINE",
  "nombre": "Pase largo 25m con empeine",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Pase largo",
      "Empeine",
      "Cambio de orientación"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "1 balón por pareja",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "2 jugadores separados por 25m."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Pases largos con empeine, buscando que llegue medio-alto y controlable."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El receptor controla al primer toque, con superficie a elección."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "12 pases por jugador. Descanso 1 min. 4 series."
      }
    ],
    "explicacion_breve": "Dos jugadores separados 25 m se pasan el balón largo con el empeine, buscando que llegue medio-alto y controlable, y el receptor controla al primer toque.",
    "leyenda": "A, B: jugadores · Flecha azul: trayectoria del balón (medio-alto)"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar el pase largo preciso — cambio de orientación del juego."
    ],
    "claves_entrenador": [
      "El pie de apoyo debe estar LEJOS del balón (35-40cm). Sin espacio, no hay empeine limpio."
    ],
    "montaje": [
      "2 jugadores separados por 25m."
    ],
    "desarrollo": [
      "2 jugadores separados por 25m.",
      "Pases largos con empeine, buscando que llegue medio-alto y controlable.",
      "El receptor controla al primer toque, con superficie a elección.",
      "12 pases por jugador. Descanso 1 min. 4 series."
    ],
    "que_buscamos": [
      "Pase largo",
      "Empeine",
      "Cambio de orientación"
    ],
    "que_observar": [
      "Pie de apoyo lejos del balón.",
      "Altura del pase.",
      "Control al primer toque."
    ],
    "correcciones": [
      "Pie de apoyo lejos del balón.",
      "Empeine limpio."
    ],
    "reglas": [
      "Pase largo con empeine.",
      "Llegada medio-alta y controlable.",
      "12 pases por jugador."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Ambos jugadores deben moverse (no estáticos) — pase al espacio, no al pie."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 12-15 min.",
      "Fútbol 11: 2 por pareja. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 064",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: media-alta.",
        "Espacio: 30 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-064-PASE-LARGO-25M-EMPEINE/CampoBase_Pase_Largo_25m_Empeine.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-064-PASE-LARGO-25M-EMPEINE/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-065-CAMBIO-JUEGO-LARGA-DISTANCIA",
  "nombre": "Cambio de juego larga distancia",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Tecnificación",
    "que_se_trabaja": [
      "Pase largo",
      "Cambio de banda",
      "Pase aéreo"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "1 balón por pareja",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugadores en bandas opuestas de un rectángulo de 40m x 15m."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Uno tira pase largo AÉREO (curva) hacia el otro."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Receptor controla con muslo, pecho o pie — según altura del balón."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 cambios por jugador. Descanso completo. 3 series."
      }
    ],
    "explicacion_breve": "Dos jugadores en bandas opuestas de un rectángulo de 40x15 m se pasan el balón con pase largo aéreo y curvo, y el receptor controla con muslo, pecho o pie según la altura.",
    "leyenda": "A, B: jugadores en bandas opuestas · Flecha azul: pase aéreo curvo"
  },
  "detalle": {
    "objetivos": [
      "Trabajar el cambio de banda con pase largo aéreo de 30-40m."
    ],
    "claves_entrenador": [
      "Para que el balón vaya alto, pie de apoyo un poco ATRÁS del balón + golpe en la parte baja."
    ],
    "montaje": [
      "Jugadores en bandas opuestas de un rectángulo de 40m x 15m."
    ],
    "desarrollo": [
      "Jugadores en bandas opuestas de un rectángulo de 40m x 15m.",
      "Uno tira pase largo AÉREO (curva) hacia el otro.",
      "Receptor controla con muslo, pecho o pie — según altura del balón.",
      "10 cambios por jugador. Descanso completo. 3 series."
    ],
    "que_buscamos": [
      "Pase largo",
      "Cambio de banda",
      "Pase aéreo"
    ],
    "que_observar": [
      "Curva del pase.",
      "Altura del balón.",
      "Control con la superficie adecuada."
    ],
    "correcciones": [
      "Pie de apoyo atrás del balón.",
      "Golpe en la parte baja."
    ],
    "reglas": [
      "Pase largo aéreo y curvo.",
      "Control según altura del balón.",
      "10 cambios por jugador."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Receptor debe pasarla al pie derecho o izquierdo según indicación del lanzador."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 12-15 min.",
      "Fútbol 11: 2 por pareja. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 065",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-14+.",
        "Intensidad: alta.",
        "Espacio: 40 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-065-CAMBIO-JUEGO-LARGA-DISTANCIA/CampoBase_Cambio_Juego_Larga_Distancia.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-065-CAMBIO-JUEGO-LARGA-DISTANCIA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-066-RONDO-4V1-CLASICO",
  "nombre": "Rondo 4v1 clásico",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Posesión",
      "Rondo",
      "Pase corto"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 5,
      "organizacion": "5 (4 posesores + 1 recuperador)"
    },
    "material": "1 balón + 4 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "4 jugadores en las esquinas de un cuadrado de 6m, uno en el centro (recuperador)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Los 4 se pasan el balón entre sí, tratando de no perderlo."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El del centro trata de tocarlo o interceptar el pase."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "El que pierde pasa al centro. Trabajo continuo 8-10 min."
      }
    ],
    "explicacion_breve": "Cuatro posesores en las esquinas de un cuadrado de 6 m se pasan el balón tratando de no perderlo, mientras un recuperador central intenta tocarlo o interceptar el pase.",
    "leyenda": "A, B, C, D: posesores · R: recuperador central · Flecha azul: pase"
  },
  "detalle": {
    "objetivos": [
      "Introducir el concepto de posesión con superioridad simple."
    ],
    "claves_entrenador": [
      "Perfil abierto SIEMPRE — cuerpo apuntando a MÁS de un compañero."
    ],
    "montaje": [
      "4 jugadores en las esquinas de un cuadrado de 6m, uno en el centro (recuperador)."
    ],
    "desarrollo": [
      "4 jugadores en las esquinas de un cuadrado de 6m, uno en el centro (recuperador).",
      "Los 4 se pasan el balón entre sí, tratando de no perderlo.",
      "El del centro trata de tocarlo o interceptar el pase.",
      "El que pierde pasa al centro. Trabajo continuo 8-10 min."
    ],
    "que_buscamos": [
      "Posesión",
      "Rondo",
      "Pase corto"
    ],
    "que_observar": [
      "Perfil abierto.",
      "Precisión del pase.",
      "Movilidad del recuperador."
    ],
    "correcciones": [
      "Perfil abierto siempre.",
      "Cuerpo apuntando a más de un compañero."
    ],
    "reglas": [
      "4 posesores + 1 recuperador.",
      "No perder el balón.",
      "El que pierde pasa al centro."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Añadir regla de máximo 2 toques por posesión (obliga velocidad de decisión)."
    ],
    "variantes": [
      "Fútbol 7: 5 (4 posesores + 1 recuperador). · 10-12 min.",
      "Fútbol 11: 5 (4 posesores + 1 recuperador). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 066",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-8+.",
        "Intensidad: media.",
        "Espacio: 6 x 6 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-066-RONDO-4V1-CLASICO/CampoBase_Rondo_4v1_Clasico.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-066-RONDO-4V1-CLASICO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-067-RONDO-4V2-CON-SALIDAS",
  "nombre": "Rondo 4v2 con salidas",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Posesión",
      "Rondo",
      "Salida"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 6,
      "organizacion": "6"
    },
    "material": "1 balón + 4 conos + 2 objetivos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "4 posesores + 2 recuperadores dentro de un cuadrado de 8m."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Los posesores buscan pasar la pelota entre sí y, cuando pueden, SACARLA fuera del cuadrado a un objetivo (compañero externo)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Los 2 recuperadores presionan intentando robar o forzar pase malo."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Se cuentan las 'salidas' logradas. Trabajo 10-12 min con rotación."
      }
    ],
    "explicacion_breve": "Cuatro posesores y dos recuperadores dentro de un cuadrado de 8 m; los posesores circulan y, cuando pueden, sacan el balón a un objetivo externo.",
    "leyenda": "A, B, C, D: posesores · R1, R2: recuperadores · O: objetivo externo · Flecha azul: pase · Flecha roja: salida al objetivo"
  },
  "detalle": {
    "objetivos": [
      "Rondo con 2 recuperadores + regla de salida hacia zonas objetivo."
    ],
    "claves_entrenador": [
      "El objetivo NO es solo mantener — es CIRCULAR con propósito hacia la salida."
    ],
    "montaje": [
      "4 posesores + 2 recuperadores dentro de un cuadrado de 8m."
    ],
    "desarrollo": [
      "4 posesores + 2 recuperadores dentro de un cuadrado de 8m.",
      "Los posesores buscan pasar la pelota entre sí y, cuando pueden, SACARLA fuera del cuadrado a un objetivo (compañero externo).",
      "Los 2 recuperadores presionan intentando robar o forzar pase malo.",
      "Se cuentan las 'salidas' logradas. Trabajo 10-12 min con rotación."
    ],
    "que_buscamos": [
      "Posesión",
      "Rondo",
      "Salida"
    ],
    "que_observar": [
      "Circulación con propósito.",
      "Salida al objetivo.",
      "Presión de los recuperadores."
    ],
    "correcciones": [
      "Circular con propósito.",
      "Buscar la salida, no solo mantener."
    ],
    "reglas": [
      "4 posesores + 2 recuperadores.",
      "Salir a un objetivo externo.",
      "Contar las salidas logradas."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Reducir el cuadrado a 6x6m para intensificar la presión."
    ],
    "variantes": [
      "Fútbol 7: 6. · 12-15 min.",
      "Fútbol 11: 6. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 067",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 8 x 8 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-067-RONDO-4V2-CON-SALIDAS/CampoBase_Rondo_4v2_Con_Salidas.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-067-RONDO-4V2-CON-SALIDAS/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-068-RONDO-5V2-PRESION-ACTIVA",
  "nombre": "Rondo 5v2 con presión activa",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Posesión",
      "Rondo",
      "Presión"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 7,
      "organizacion": "7"
    },
    "material": "1 balón + 4 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "5 posesores en un cuadrado de 10m + 2 recuperadores dentro."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Circulación libre — los 5 se pasan la pelota."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Los 2 recuperadores presionan agresivamente sin parar."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Contar los pases consecutivos como record. Cambiar recuperadores cada 60s."
      }
    ],
    "explicacion_breve": "Cinco posesores en un cuadrado de 10 m circulan el balón mientras dos recuperadores presionan agresivamente sin parar, contando los pases consecutivos.",
    "leyenda": "A-E: posesores · R1, R2: recuperadores · Flecha azul: pase · Flecha roja: presión"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la circulación de pelota bajo presión constante."
    ],
    "claves_entrenador": [
      "Un pase malo se paga inmediatamente. Precisión > velocidad. Pausa antes que error."
    ],
    "montaje": [
      "5 posesores en un cuadrado de 10m + 2 recuperadores dentro."
    ],
    "desarrollo": [
      "5 posesores en un cuadrado de 10m + 2 recuperadores dentro.",
      "Circulación libre — los 5 se pasan la pelota.",
      "Los 2 recuperadores presionan agresivamente sin parar.",
      "Contar los pases consecutivos como record. Cambiar recuperadores cada 60s."
    ],
    "que_buscamos": [
      "Posesión",
      "Rondo",
      "Presión"
    ],
    "que_observar": [
      "Precisión del pase.",
      "Circulación libre.",
      "Presión constante."
    ],
    "correcciones": [
      "Precisión antes que velocidad.",
      "Pausa antes que error."
    ],
    "reglas": [
      "5 posesores + 2 recuperadores.",
      "Presión agresiva constante.",
      "Contar pases consecutivos."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Reducir a 6x6m o agregar máximo de 2 toques."
    ],
    "variantes": [
      "Fútbol 7: 7. · 12-15 min.",
      "Fútbol 11: 7. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 068",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 10 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-068-RONDO-5V2-PRESION-ACTIVA/CampoBase_Rondo_5v2_Presion_Activa.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-068-RONDO-5V2-PRESION-ACTIVA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-069-RONDO-6V3-CON-LINEAS",
  "nombre": "Rondo 6v3 con líneas",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Posesión",
      "Posicional",
      "Pase entre líneas"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 9,
      "organizacion": "9"
    },
    "material": "1 balón + 6 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "6 posesores distribuidos en 2 líneas paralelas (3 y 3), separadas por 5m."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "3 recuperadores adentro tratan de robar."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Regla: el balón debe cambiar de línea al menos cada 4 pases."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Trabajo continuo 12-15 min. Rotar recuperadores cada 90s."
      }
    ],
    "explicacion_breve": "Seis posesores en dos líneas paralelas de tres, con tres recuperadores dentro, deben cambiar de línea al menos cada cuatro pases.",
    "leyenda": "A, B, C: línea inferior · D, E, F: línea superior · R1-R3: recuperadores · Flecha azul: pase entre líneas"
  },
  "detalle": {
    "objetivos": [
      "Introducir el juego posicional con líneas y roles diferenciados."
    ],
    "claves_entrenador": [
      "Cambiar de línea = pase entre líneas defensivas. Este es el pase MÁS VALIOSO del fútbol moderno."
    ],
    "montaje": [
      "6 posesores distribuidos en 2 líneas paralelas (3 y 3), separadas por 5m."
    ],
    "desarrollo": [
      "6 posesores distribuidos en 2 líneas paralelas (3 y 3), separadas por 5m.",
      "3 recuperadores adentro tratan de robar.",
      "Regla: el balón debe cambiar de línea al menos cada 4 pases.",
      "Trabajo continuo 12-15 min. Rotar recuperadores cada 90s."
    ],
    "que_buscamos": [
      "Posesión",
      "Posicional",
      "Pase entre líneas"
    ],
    "que_observar": [
      "Cambio de línea.",
      "Pase entre líneas.",
      "Ocupación de espacios."
    ],
    "correcciones": [
      "Cambiar de línea con regularidad.",
      "Buscar el pase entre líneas."
    ],
    "reglas": [
      "2 líneas de 3 posesores.",
      "Cambiar de línea cada 4 pases.",
      "Rotar recuperadores cada 90 s."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar comodín móvil entre líneas para trabajar el pase interior."
    ],
    "variantes": [
      "Fútbol 7: 9. · 15-20 min.",
      "Fútbol 11: 9. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 069",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 15 x 12 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-069-RONDO-6V3-CON-LINEAS/CampoBase_Rondo_6v3_Con_Lineas.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-069-RONDO-6V3-CON-LINEAS/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-070-RONDO-TRIDIMENSIONAL-COMODINES",
  "nombre": "Rondo tridimensional con comodines",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Posesión",
      "Comodines",
      "Apoyo externo"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 8,
      "organizacion": "8 (3v3 + 2 comodines)"
    },
    "material": "1 balón + 4 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "2 equipos de 3 dentro del cuadrado + 2 comodines externos (uno a cada lado)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "El equipo con balón puede usar los comodines para apoyarse (siempre a favor de quien tiene la pelota)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Objetivo: mantener 6 pases consecutivos = 1 punto."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Trabajo continuo 15 min. Se cuentan puntos por equipo."
      }
    ],
    "explicacion_breve": "Dos equipos de tres dentro del cuadrado, con dos comodines externos que apoyan siempre al equipo con balón; el objetivo es mantener seis pases consecutivos.",
    "leyenda": "A, B, C: equipo 1 · D, E, F: equipo 2 · C1, C2: comodines externos · Flecha azul: pase"
  },
  "detalle": {
    "objetivos": [
      "Sumar comodines móviles como referencia externa para la salida."
    ],
    "claves_entrenador": [
      "Los comodines son 'zonas seguras' — usarlos cuando hay presión, no cuando el juego fluye."
    ],
    "montaje": [
      "2 equipos de 3 dentro del cuadrado + 2 comodines externos (uno a cada lado)."
    ],
    "desarrollo": [
      "2 equipos de 3 dentro del cuadrado + 2 comodines externos (uno a cada lado).",
      "El equipo con balón puede usar los comodines para apoyarse (siempre a favor de quien tiene la pelota).",
      "Objetivo: mantener 6 pases consecutivos = 1 punto.",
      "Trabajo continuo 15 min. Se cuentan puntos por equipo."
    ],
    "que_buscamos": [
      "Posesión",
      "Comodines",
      "Apoyo externo"
    ],
    "que_observar": [
      "Uso de los comodines.",
      "Apoyo externo.",
      "Mantener la posesión."
    ],
    "correcciones": [
      "Usar comodines bajo presión.",
      "No abusar cuando el juego fluye."
    ],
    "reglas": [
      "3v3 + 2 comodines externos.",
      "Comodines a favor del que tiene el balón.",
      "6 pases consecutivos = 1 punto."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Reducir a 1 comodín, o hacer los comodines móviles alrededor del perímetro."
    ],
    "variantes": [
      "Fútbol 7: 8 (3v3 + 2 comodines). · 15-20 min.",
      "Fútbol 11: 8 (3v3 + 2 comodines). · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 070",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 12 x 10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-070-RONDO-TRIDIMENSIONAL-COMODINES/CampoBase_Rondo_Tridimensional_Comodines.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-070-RONDO-TRIDIMENSIONAL-COMODINES/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-071-JUEGO-POSICIONAL-5V5-3-CUADRADO",
  "nombre": "Juego posicional 5v5+3 en cuadrado",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Posesión",
      "Posicional",
      "Comodines"
    ],
    "tiempo_estimado_15": "20-25 min",
    "jugadores": {
      "total": 13,
      "organizacion": "13"
    },
    "material": "1 balón + conos + 4 zonas objetivo",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Cuadrado de 25x20m con 4 zonas neutras en las esquinas."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "2 equipos de 5 juegan en el interior + 3 comodines (2 externos, 1 interno)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Cuando un equipo posee, los comodines juegan con ellos."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Objetivo: 6 pases consecutivos + parar el balón en una zona neutra = punto."
      }
    ],
    "explicacion_breve": "Dos equipos de cinco juegan en un cuadrado de 25x20 m con tres comodines y cuatro zonas neutras; el objetivo es seis pases consecutivos y parar el balón en una zona neutra.",
    "leyenda": "A1-A5: equipo 1 · B1-B5: equipo 2 · C: comodines · Flecha azul: pase"
  },
  "detalle": {
    "objetivos": [
      "Combinar posesión con salida a objetivos + presión bilateral."
    ],
    "claves_entrenador": [
      "El comodín interno es LA CLAVE — recibe entre líneas y desorganiza al rival. Usarlo mucho."
    ],
    "montaje": [
      "Cuadrado de 25x20m con 4 zonas neutras en las esquinas."
    ],
    "desarrollo": [
      "Cuadrado de 25x20m con 4 zonas neutras en las esquinas.",
      "2 equipos de 5 juegan en el interior + 3 comodines (2 externos, 1 interno).",
      "Cuando un equipo posee, los comodines juegan con ellos.",
      "Objetivo: 6 pases consecutivos + parar el balón en una zona neutra = punto."
    ],
    "que_buscamos": [
      "Posesión",
      "Posicional",
      "Comodines"
    ],
    "que_observar": [
      "Uso del comodín interno.",
      "Salida a zonas neutras.",
      "Presión bilateral."
    ],
    "correcciones": [
      "Usar mucho el comodín interno.",
      "Buscar la zona neutra."
    ],
    "reglas": [
      "5v5 + 3 comodines.",
      "6 pases consecutivos.",
      "Parar el balón en zona neutra = punto."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Después del punto, dejar que el equipo intente finalizar en una portería pequeña (transición)."
    ],
    "variantes": [
      "Fútbol 7: 13. · 20-25 min.",
      "Fútbol 11: 13. · 20-25 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 071",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-14+.",
        "Intensidad: alta.",
        "Espacio: 25 x 20 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-071-JUEGO-POSICIONAL-5V5-3-CUADRADO/CampoBase_Juego_Posicional_5v5_3_Cuadrado.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-071-JUEGO-POSICIONAL-5V5-3-CUADRADO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-072-SALIDA-LIMPIA-DESDE-DEFENSA-4V2",
  "nombre": "Salida limpia desde defensa (4v2 en zona baja)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Salida de balón",
      "Posesión",
      "Circulación"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 6,
      "organizacion": "6 + portero"
    },
    "material": "1 balón + 4 conos + portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "4 defensores + portero en zona baja, contra 2 delanteros presionando."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Portero inicia el juego con pase raso."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Los 4 defensores deben CIRCULAR el balón y salir jugando a una zona alta."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Si los delanteros roban, disparan a la portería. Trabajo 15 min con rotación."
      }
    ],
    "explicacion_breve": "Cuatro defensores y el portero, en zona baja, circulan el balón para salir jugando a una zona alta contra dos delanteros que presionan.",
    "leyenda": "K: portero · D1-D4: defensores · A1, A2: delanteros · Flecha azul: pase"
  },
  "detalle": {
    "objetivos": [
      "Aprender a salir jugando desde el fondo bajo presión de dos delanteros."
    ],
    "claves_entrenador": [
      "El pase clave sale del portero, NO de los centrales. El portero inicia todo si está bien perfilado."
    ],
    "montaje": [
      "4 defensores + portero en zona baja, contra 2 delanteros presionando."
    ],
    "desarrollo": [
      "4 defensores + portero en zona baja, contra 2 delanteros presionando.",
      "Portero inicia el juego con pase raso.",
      "Los 4 defensores deben CIRCULAR el balón y salir jugando a una zona alta.",
      "Si los delanteros roban, disparan a la portería. Trabajo 15 min con rotación."
    ],
    "que_buscamos": [
      "Salida de balón",
      "Posesión",
      "Circulación"
    ],
    "que_observar": [
      "Pase del portero.",
      "Circulación de los defensores.",
      "Salida a zona alta."
    ],
    "correcciones": [
      "El portero inicia la salida.",
      "Circular antes de salir."
    ],
    "reglas": [
      "4 defensores + portero.",
      "Salir jugando a zona alta.",
      "Si roban, disparan a portería."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar a 3 delanteros presionando (4v3) para dificultar la salida."
    ],
    "variantes": [
      "Fútbol 7: 6 + portero. · 15-20 min.",
      "Fútbol 11: 6 + portero. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 072",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 25 x 20 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-072-SALIDA-LIMPIA-DESDE-DEFENSA-4V2/CampoBase_Salida_Limpia_Desde_Defensa_4v2.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-072-SALIDA-LIMPIA-DESDE-DEFENSA-4V2/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-073-PASE-ENTRE-LINEAS-ROMPER-PASE",
  "nombre": "Pase entre líneas — romper con pase",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Pase filtrado",
      "Pase entre líneas",
      "Ruptura"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 8,
      "organizacion": "8 (4v2 + 2 receptores)"
    },
    "material": "1 balón + conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "4 posesores en zona 1, 2 defensores entre líneas, 2 receptores en zona 2."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Los 4 buscan pasar la pelota entre los defensores para llegar a los 2 receptores."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Cada pase entre líneas exitoso = 1 punto."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Trabajo 15 min con rotación."
      }
    ],
    "explicacion_breve": "Cuatro posesores en zona 1 buscan pasar el balón entre dos defensores para llegar a dos receptores en zona 2; cada pase entre líneas exitoso vale un punto.",
    "leyenda": "A-D: posesores (zona 1) · D1, D2: defensores · R1, R2: receptores (zona 2) · Flecha azul: pase filtrado"
  },
  "detalle": {
    "objetivos": [
      "Practicar el pase filtrado que rompe líneas defensivas."
    ],
    "claves_entrenador": [
      "El pase entre líneas requiere PERFIL abierto del pasador + movimiento del receptor. Ambos deben suceder."
    ],
    "montaje": [
      "4 posesores en zona 1, 2 defensores entre líneas, 2 receptores en zona 2."
    ],
    "desarrollo": [
      "4 posesores en zona 1, 2 defensores entre líneas, 2 receptores en zona 2.",
      "Los 4 buscan pasar la pelota entre los defensores para llegar a los 2 receptores.",
      "Cada pase entre líneas exitoso = 1 punto.",
      "Trabajo 15 min con rotación."
    ],
    "que_buscamos": [
      "Pase filtrado",
      "Pase entre líneas",
      "Ruptura"
    ],
    "que_observar": [
      "Perfil abierto del pasador.",
      "Movimiento del receptor.",
      "Pase filtrado."
    ],
    "correcciones": [
      "Perfil abierto + movimiento del receptor.",
      "Buscar la ventana entre defensores."
    ],
    "reglas": [
      "4 posesores + 2 defensores + 2 receptores.",
      "Pase entre líneas = 1 punto.",
      "Rotación."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Reducir la ventana entre defensores (más juntos) para aumentar dificultad."
    ],
    "variantes": [
      "Fútbol 7: 8 (4v2 + 2 receptores). · 15-20 min.",
      "Fútbol 11: 8 (4v2 + 2 receptores). · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 073",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 25 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-073-PASE-ENTRE-LINEAS-ROMPER-PASE/CampoBase_Pase_Entre_Lineas_Romper_Pase.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-073-PASE-ENTRE-LINEAS-ROMPER-PASE/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-074-CIRCULACION-TRIANGULOS-OFENSIVOS",
  "nombre": "Circulación en triángulos ofensivos",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Posesión",
      "Triángulos",
      "Tercer hombre"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 7,
      "organizacion": "7 (3-4-3 conceptual)"
    },
    "material": "1 balón + conos + portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "3 jugadores en base, 4 en medio, 3 arriba — formando triángulos entre líneas."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "El balón circula desde atrás buscando siempre el tercer hombre libre."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Al llegar al tercio final, buscan crear ocasión de gol."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Trabajo 20 min con rotación cada 5 min."
      }
    ],
    "explicacion_breve": "Tres jugadores en base, cuatro en medio y tres arriba forman triángulos entre líneas; el balón circula desde atrás buscando siempre el tercer hombre libre hasta crear ocasión de gol.",
    "leyenda": "B1-B3: base · M1-M4: medio · F1-F3: ataque · Flecha azul: pase"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la circulación fluida en triángulos móviles con progresión hacia la portería."
    ],
    "claves_entrenador": [
      "Concepto clave: 'buscar al tercer hombre'. Nunca pasar y quedarse — moverse para reaparecer."
    ],
    "montaje": [
      "3 jugadores en base, 4 en medio, 3 arriba — formando triángulos entre líneas."
    ],
    "desarrollo": [
      "3 jugadores en base, 4 en medio, 3 arriba — formando triángulos entre líneas.",
      "El balón circula desde atrás buscando siempre el tercer hombre libre.",
      "Al llegar al tercio final, buscan crear ocasión de gol.",
      "Trabajo 20 min con rotación cada 5 min."
    ],
    "que_buscamos": [
      "Posesión",
      "Triángulos",
      "Tercer hombre"
    ],
    "que_observar": [
      "Búsqueda del tercer hombre.",
      "Circulación fluida.",
      "Progresión al tercio final."
    ],
    "correcciones": [
      "Buscar al tercer hombre.",
      "Moverse para reaparecer."
    ],
    "reglas": [
      "3-4-3 conceptual.",
      "Buscar el tercer hombre.",
      "Progresar a portería."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Añadir 3 defensores para que hagan una línea de presión intermedia."
    ],
    "variantes": [
      "Fútbol 7: 7 (3-4-3 conceptual). · 15-20 min.",
      "Fútbol 11: 7 (3-4-3 conceptual). · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 074",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 40 x 25 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-074-CIRCULACION-TRIANGULOS-OFENSIVOS/CampoBase_Circulacion_Triangulos_Ofensivos.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-074-CIRCULACION-TRIANGULOS-OFENSIVOS/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-075-PASE-Y-VA-DAR-E-IR-2-JUGADORES",
  "nombre": "Pase y va (dar e ir) — 2 jugadores",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Posesión",
    "que_se_trabaja": [
      "Pared",
      "Pase y va",
      "Desmarque"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 (o pareja + defensor)"
    },
    "material": "1 balón + 2 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "A tiene el balón, B está a 5m adelantado."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "A pasa a B, A hace movimiento diagonal hacia adelante para 'ganar la espalda'."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "B devuelve pase de primera al espacio que dejó A al moverse."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "A recibe y progresa. Repetir 10 veces por jugador."
      }
    ],
    "explicacion_breve": "A pasa a B y hace un movimiento diagonal para ganar la espalda; B devuelve de primera al espacio que dejó A, que recibe y progresa.",
    "leyenda": "A: inicia la pared · B: devuelve de primera · Flecha azul: pase · Flecha roja: carrera diagonal de A"
  },
  "detalle": {
    "objetivos": [
      "Automatizar el gesto técnico-táctico más fundamental del fútbol: pared."
    ],
    "claves_entrenador": [
      "El pase de A sale MIENTRAS empieza a correr — no primero pasar y después correr. Es UN gesto."
    ],
    "montaje": [
      "A tiene el balón, B está a 5m adelantado."
    ],
    "desarrollo": [
      "A tiene el balón, B está a 5m adelantado.",
      "A pasa a B, A hace movimiento diagonal hacia adelante para 'ganar la espalda'.",
      "B devuelve pase de primera al espacio que dejó A al moverse.",
      "A recibe y progresa. Repetir 10 veces por jugador."
    ],
    "que_buscamos": [
      "Pared",
      "Pase y va",
      "Desmarque"
    ],
    "que_observar": [
      "Pase mientras corre.",
      "Movimiento diagonal.",
      "Devolución de primera."
    ],
    "correcciones": [
      "Pasar mientras se corre.",
      "Devolver de primera al espacio."
    ],
    "reglas": [
      "Pase y movimiento diagonal.",
      "Devolución de primera al espacio.",
      "10 repeticiones por jugador."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Agregar defensor pasivo entre A y B, luego activo."
    ],
    "variantes": [
      "Fútbol 7: 2 (o pareja + defensor). · 12-15 min.",
      "Fútbol 11: 2 (o pareja + defensor). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 075",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media-alta.",
        "Espacio: 15 x 5 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-075-PASE-Y-VA-DAR-E-IR-2-JUGADORES/CampoBase_Pase_Y_Va_Dar_E_Ir_2_Jugadores.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-075-PASE-Y-VA-DAR-E-IR-2-JUGADORES/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-076-TROTE-CONTINUO-AEROBICO-BASE",
  "nombre": "Trote continuo aeróbico base",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Resistencia",
      "Aeróbico",
      "Base"
    ],
    "tiempo_estimado_15": "15-25 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15"
    },
    "material": "cronómetro",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugadores trotan a ritmo continuo, constante, cómodo."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Deben poder mantener una conversación mientras trotan."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Duración progresiva: iniciar en 15 min, subir a 25 min con las semanas."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Al terminar, 5 min de caminata + estiramiento suave."
      }
    ],
    "explicacion_breve": "Los jugadores trotan a ritmo continuo, constante y cómodo, pudiendo mantener una conversación, con duración progresiva de 15 a 25 minutos.",
    "leyenda": "J: jugador · Flecha roja: trote continuo"
  },
  "detalle": {
    "objetivos": [
      "Construir base aeróbica y capacidad cardiovascular general."
    ],
    "claves_entrenador": [
      "Nunca correr rápido en este ejercicio — la base aeróbica se construye en ritmo BAJO sostenido."
    ],
    "montaje": [
      "Jugadores trotan a ritmo continuo, constante, cómodo."
    ],
    "desarrollo": [
      "Jugadores trotan a ritmo continuo, constante, cómodo.",
      "Deben poder mantener una conversación mientras trotan.",
      "Duración progresiva: iniciar en 15 min, subir a 25 min con las semanas.",
      "Al terminar, 5 min de caminata + estiramiento suave."
    ],
    "que_buscamos": [
      "Resistencia",
      "Aeróbico",
      "Base"
    ],
    "que_observar": [
      "Ritmo bajo sostenido.",
      "Capacidad de conversación.",
      "Duración progresiva."
    ],
    "correcciones": [
      "No correr rápido.",
      "Mantener ritmo bajo."
    ],
    "reglas": [
      "Ritmo continuo y cómodo.",
      "Poder conversar mientras se trota.",
      "Duración progresiva."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar duración 2 min por semana, hasta llegar a 30-35 min continuos."
    ],
    "variantes": [
      "Fútbol 7: 1-15. · 15-25 min.",
      "Fútbol 11: 1-15. · 15-25 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 076",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: baja-media.",
        "Espacio: pista o campo abierto."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-076-TROTE-CONTINUO-AEROBICO-BASE/CampoBase_Trote_Continuo_Aerobico_Base.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-076-TROTE-CONTINUO-AEROBICO-BASE/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-077-CARRERA-CONTINUA-CAMBIOS-RITMO",
  "nombre": "Carrera continua con cambios de ritmo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Resistencia",
      "Cambios de ritmo",
      "Cardiovascular"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15"
    },
    "material": "cronómetro",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Trote continuo de base durante 3 min."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Acelerar a ritmo alto (70-80% del máximo) durante 1 min."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Volver a trote suave 2 min de recuperación."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Repetir 4-5 veces según nivel. Cierre con 5 min caminata."
      }
    ],
    "explicacion_breve": "Trote continuo de base, aceleración a ritmo alto y vuelta a trote suave de recuperación, repitiendo el ciclo varias veces.",
    "leyenda": "J: jugador · Flecha roja: carrera · Flecha azul: trote de recuperación"
  },
  "detalle": {
    "objetivos": [
      "Adaptar el sistema cardiovascular a variaciones típicas del partido."
    ],
    "claves_entrenador": [
      "El cambio de ritmo es más importante que la velocidad absoluta. Simula acciones reales del partido."
    ],
    "montaje": [
      "Trote continuo de base durante 3 min."
    ],
    "desarrollo": [
      "Trote continuo de base durante 3 min.",
      "Acelerar a ritmo alto (70-80% del máximo) durante 1 min.",
      "Volver a trote suave 2 min de recuperación.",
      "Repetir 4-5 veces según nivel. Cierre con 5 min caminata."
    ],
    "que_buscamos": [
      "Resistencia",
      "Cambios de ritmo",
      "Cardiovascular"
    ],
    "que_observar": [
      "Cambio de ritmo.",
      "Recuperación.",
      "Ritmo alto al 70-80%."
    ],
    "correcciones": [
      "Priorizar el cambio de ritmo.",
      "No buscar velocidad absoluta."
    ],
    "reglas": [
      "Trote base 3 min.",
      "Aceleración 1 min.",
      "Recuperación 2 min."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Reducir tiempo de recuperación (2 min → 1:30 → 1 min) manteniendo intensidad."
    ],
    "variantes": [
      "Fútbol 7: 1-15. · 15-20 min.",
      "Fútbol 11: 1-15. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 077",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media.",
        "Espacio: pista o campo abierto."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-077-CARRERA-CONTINUA-CAMBIOS-RITMO/CampoBase_Carrera_Continua_Cambios_Ritmo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-077-CARRERA-CONTINUA-CAMBIOS-RITMO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-078-HIIT-JUGADO-30S-ALTO-30S-RECUPERACION",
  "nombre": "HIIT jugado: 30s alto / 30s recuperación",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Resistencia",
      "HIIT",
      "Anaeróbico"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15"
    },
    "material": "cronómetro",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Fase de trabajo: 30 segundos a INTENSIDAD MÁXIMA (sprint corto, cambios de dirección)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Fase de recuperación: 30 segundos de trote muy suave o caminata."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Serie de 8 bloques (16 min totales)."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Descanso completo 5 min entre series."
      }
    ],
    "explicacion_breve": "Alternar 30 segundos a intensidad máxima con 30 segundos de recuperación, en series de ocho bloques.",
    "leyenda": "J: jugador · Flecha roja: sprint máximo · Flecha azul: recuperación"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la potencia anaeróbica y capacidad de recuperación entre esfuerzos."
    ],
    "claves_entrenador": [
      "En los 30s de trabajo, ir al 100%. Sin dosificar. Solo así el efecto HIIT aparece."
    ],
    "montaje": [
      "Fase de trabajo: 30 segundos a INTENSIDAD MÁXIMA (sprint corto, cambios de dirección)."
    ],
    "desarrollo": [
      "Fase de trabajo: 30 segundos a INTENSIDAD MÁXIMA (sprint corto, cambios de dirección).",
      "Fase de recuperación: 30 segundos de trote muy suave o caminata.",
      "Serie de 8 bloques (16 min totales).",
      "Descanso completo 5 min entre series."
    ],
    "que_buscamos": [
      "Resistencia",
      "HIIT",
      "Anaeróbico"
    ],
    "que_observar": [
      "Intensidad máxima.",
      "Recuperación.",
      "Número de bloques."
    ],
    "correcciones": [
      "Ir al 100% en el trabajo.",
      "No dosificar."
    ],
    "reglas": [
      "30 s a intensidad máxima.",
      "30 s de recuperación.",
      "8 bloques por serie."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar a 10 bloques por serie, o reducir recuperación a 20 segundos."
    ],
    "variantes": [
      "Fútbol 7: 1-15. · 15-20 min.",
      "Fútbol 11: 1-15. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 078",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: campo o zona 20x20m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-078-HIIT-JUGADO-30S-ALTO-30S-RECUPERACION/CampoBase_HIIT_Jugado_30s_Alto_30s_Recuperacion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-078-HIIT-JUGADO-30S-ALTO-30S-RECUPERACION/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-079-SPRINTS-REPETIDOS-RECUPERACION-COMPLETA",
  "nombre": "Sprints repetidos con recuperación completa",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Velocidad",
      "Sprint",
      "Potencia"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10"
    },
    "material": "conos + cronómetro",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Marcar distancia de 20 metros con 2 conos."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Sprint máximo de 20m — meta batir el mejor tiempo personal."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Caminar de vuelta al inicio (1-2 min de recuperación COMPLETA)."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8-10 sprints por sesión."
      }
    ],
    "explicacion_breve": "Sprint máximo de 20 metros con recuperación completa caminando de vuelta, repitiendo 8-10 veces por sesión.",
    "leyenda": "J: jugador · Cono: salida y meta · Flecha roja: sprint máximo · Flecha gris: caminar de vuelta"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar velocidad máxima y potencia sin acumular fatiga."
    ],
    "claves_entrenador": [
      "La recuperación DEBE ser completa. Si no, el trabajo se convierte en resistencia, no en velocidad."
    ],
    "montaje": [
      "Marcar distancia de 20 metros con 2 conos."
    ],
    "desarrollo": [
      "Marcar distancia de 20 metros con 2 conos.",
      "Sprint máximo de 20m — meta batir el mejor tiempo personal.",
      "Caminar de vuelta al inicio (1-2 min de recuperación COMPLETA).",
      "8-10 sprints por sesión."
    ],
    "que_buscamos": [
      "Velocidad",
      "Sprint",
      "Potencia"
    ],
    "que_observar": [
      "Velocidad máxima.",
      "Recuperación completa.",
      "Tiempo personal."
    ],
    "correcciones": [
      "Recuperación completa.",
      "No acumular fatiga."
    ],
    "reglas": [
      "Sprint máximo de 20 m.",
      "Recuperación completa.",
      "8-10 sprints por sesión."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Aumentar distancia a 30m, o añadir arrancada desde distintas posiciones (parado, sentado, boca abajo)."
    ],
    "variantes": [
      "Fútbol 7: 1-10. · 15-20 min.",
      "Fútbol 11: 1-10. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 079",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 20-30 m lineales."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-079-SPRINTS-REPETIDOS-RECUPERACION-COMPLETA/CampoBase_Sprints_Repetidos_Recuperacion_Completa.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-079-SPRINTS-REPETIDOS-RECUPERACION-COMPLETA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-080-SPRINTS-RECUPERACION-INCOMPLETA-RSA",
  "nombre": "Sprints con recuperación incompleta (RSA)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Velocidad",
      "RSA",
      "Resistencia a la velocidad"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10"
    },
    "material": "conos + cronómetro",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Sprint máximo de 20m."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Recuperación ACTIVA (trote suave) durante 20 segundos."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Nuevo sprint máximo. Repetir 6-8 sprints por serie."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3-4 series con 3-4 min de descanso entre series."
      }
    ],
    "explicacion_breve": "Sprint máximo de 20 metros con recuperación activa de 20 segundos, repitiendo 6-8 sprints por serie en 3-4 series.",
    "leyenda": "J: jugador · Cono: salida y meta · Flecha roja: sprint máximo · Flecha azul: trote de recuperación"
  },
  "detalle": {
    "objetivos": [
      "Entrenar la capacidad de repetir sprints — el gesto más real del fútbol."
    ],
    "claves_entrenador": [
      "RSA = Repeated Sprint Ability. Es lo que distingue a un jugador que aguanta 90 min al 100%."
    ],
    "montaje": [
      "Sprint máximo de 20m."
    ],
    "desarrollo": [
      "Sprint máximo de 20m.",
      "Recuperación ACTIVA (trote suave) durante 20 segundos.",
      "Nuevo sprint máximo. Repetir 6-8 sprints por serie.",
      "3-4 series con 3-4 min de descanso entre series."
    ],
    "que_buscamos": [
      "Velocidad",
      "RSA",
      "Resistencia a la velocidad"
    ],
    "que_observar": [
      "Capacidad de repetir sprints.",
      "Recuperación activa.",
      "Mantenimiento de la velocidad."
    ],
    "correcciones": [
      "Recuperación activa.",
      "Mantener la intensidad en cada sprint."
    ],
    "reglas": [
      "Sprint máximo de 20 m.",
      "Recuperación activa 20 s.",
      "6-8 sprints por serie."
    ],
    "si_sale_mal": [
      "Reducir la velocidad.",
      "Simplificar el movimiento."
    ],
    "si_sale_bien": [
      "Reducir recuperación a 15s, o aumentar a 10-12 sprints por serie."
    ],
    "variantes": [
      "Fútbol 7: 1-10. · 15-20 min.",
      "Fútbol 11: 1-10. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 080",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-14+.",
        "Intensidad: muy alta.",
        "Espacio: 20 m lineales."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-080-SPRINTS-RECUPERACION-INCOMPLETA-RSA/CampoBase_Sprints_Recuperacion_Incompleta_RSA.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-080-SPRINTS-RECUPERACION-INCOMPLETA-RSA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-081-CIRCUITO-FUERZA-PESO-CORPORAL",
  "nombre": "Circuito de fuerza con peso corporal",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Fuerza general",
      "Peso corporal",
      "Técnica"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, distribuidos en 4 secuencias"
    },
    "material": "colchoneta opcional",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Secuencia 1: 15 sentadillas."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Secuencia 2: 10 flexiones (rodillas si no llega)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Secuencia 3: 30s de plancha frontal."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Secuencia 4: 10 puentes de glúteo. Circuito completo × 4 rondas."
      }
    ],
    "explicacion_breve": "Circuito de cuatro secuencias con sentadillas, flexiones, plancha frontal y puentes de glúteo, completado durante cuatro rondas.",
    "leyenda": "SEN: sentadillas · FLEX: flexiones · PLAN: plancha frontal · PUE: puente de glúteo"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar fuerza general del cuerpo sin necesidad de material."
    ],
    "claves_entrenador": [
      "Técnica primero, cantidad después. Una sentadilla bien hecha vale 5 mal hechas."
    ],
    "montaje": [
      "Secuencia 1: 15 sentadillas."
    ],
    "desarrollo": [
      "Secuencia 1: 15 sentadillas.",
      "Secuencia 2: 10 flexiones (rodillas si no llega).",
      "Secuencia 3: 30s de plancha frontal.",
      "Secuencia 4: 10 puentes de glúteo. Circuito completo × 4 rondas."
    ],
    "que_buscamos": [
      "Fuerza general",
      "Peso corporal",
      "Técnica"
    ],
    "que_observar": [
      "Técnica de cada movimiento.",
      "Control postural.",
      "Continuidad entre secuencias."
    ],
    "correcciones": [
      "Reducir repeticiones si se pierde la técnica.",
      "Usar apoyo de rodillas en las flexiones si hace falta."
    ],
    "reglas": [
      "Completar las 4 secuencias.",
      "Realizar 4 rondas.",
      "Priorizar la técnica sobre la cantidad."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Aumentar repeticiones progresivamente (semana 1: 15 → semana 4: 25 sentadillas)."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, distribuidos en 4 secuencias. · 15-20 min.",
      "Fútbol 11: 1-15 jugadores, distribuidos en 4 secuencias. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 081",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media-alta.",
        "Espacio: campo o gimnasio pequeño."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-081-CIRCUITO-FUERZA-PESO-CORPORAL/CampoBase_Circuito_Fuerza_Peso_Corporal.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-081-CIRCUITO-FUERZA-PESO-CORPORAL/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-082-SENTADILLAS-SALTOS-VERTICALES",
  "nombre": "Sentadillas con saltos verticales",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Fuerza",
      "Potencia",
      "Tren inferior"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, 1 m² por jugador"
    },
    "material": "ninguno",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Bajar en sentadilla completa (muslos paralelos al suelo)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "En la subida, EXPLOTAR con salto vertical máximo."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Aterrizar suave, absorbiendo con rodillas semiflexionadas."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 series de 8-10 repeticiones. 90s de descanso."
      }
    ],
    "explicacion_breve": "El jugador enlaza una sentadilla completa con un salto vertical máximo y aterriza de forma suave antes de repetir.",
    "leyenda": "J: jugador · Flecha roja: salto vertical · Línea blanca: superficie de apoyo"
  },
  "detalle": {
    "objetivos": [
      "Trabajar fuerza + potencia del tren inferior en el mismo gesto."
    ],
    "claves_entrenador": [
      "El salto sale del EMPUJE de piernas, no de brazos. Los brazos solo acompañan."
    ],
    "montaje": [
      "Bajar en sentadilla completa (muslos paralelos al suelo)."
    ],
    "desarrollo": [
      "Bajar en sentadilla completa (muslos paralelos al suelo).",
      "En la subida, EXPLOTAR con salto vertical máximo.",
      "Aterrizar suave, absorbiendo con rodillas semiflexionadas.",
      "3 series de 8-10 repeticiones. 90s de descanso."
    ],
    "que_buscamos": [
      "Fuerza",
      "Potencia",
      "Tren inferior"
    ],
    "que_observar": [
      "Profundidad de la sentadilla.",
      "Impulso de piernas.",
      "Control del aterrizaje."
    ],
    "correcciones": [
      "No impulsar el salto solo con los brazos.",
      "Absorber el aterrizaje con las rodillas semiflexionadas."
    ],
    "reglas": [
      "Muslos paralelos al suelo.",
      "Salto vertical máximo.",
      "Aterrizaje suave con rodillas semiflexionadas."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Añadir chaleco lastrado (5-10% del peso corporal) o pausas isométricas en la bajada."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, 1 m² por jugador. · 10-12 min.",
      "Fútbol 11: 1-15 jugadores, 1 m² por jugador. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 082",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 1 m² por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-082-SENTADILLAS-SALTOS-VERTICALES/CampoBase_Sentadillas_Saltos_Verticales.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-082-SENTADILLAS-SALTOS-VERTICALES/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-083-ESTOCADAS-ALTERNADAS-ROTACION",
  "nombre": "Estocadas alternadas + rotación",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Fuerza unilateral",
      "Core",
      "Estabilidad"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, 3 × 1 m por jugador"
    },
    "material": "balón medicinal opcional",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Paso adelantado grande: rodilla trasera casi tocando el suelo."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "En la posición baja, rotar el torso hacia el lado de la pierna adelantada."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Volver al centro, empujar y subir; cambiar de pierna."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 series de 10 estocadas por pierna."
      }
    ],
    "explicacion_breve": "Cada repetición combina un paso adelantado amplio, una rotación del torso hacia la pierna adelantada y la vuelta al centro antes de alternar pierna.",
    "leyenda": "J: jugador · Flecha roja: paso adelantado · Flecha azul: rotación del torso"
  },
  "detalle": {
    "objetivos": [
      "Fortalecer piernas por separado + estabilidad del core en rotación."
    ],
    "claves_entrenador": [
      "La rodilla adelantada NUNCA debe pasar la punta del pie. Si pasa, dar paso más largo."
    ],
    "montaje": [
      "Paso adelantado grande: rodilla trasera casi tocando el suelo."
    ],
    "desarrollo": [
      "Paso adelantado grande: rodilla trasera casi tocando el suelo.",
      "En la posición baja, rotar el torso hacia el lado de la pierna adelantada.",
      "Volver al centro, empujar y subir; cambiar de pierna.",
      "3 series de 10 estocadas por pierna."
    ],
    "que_buscamos": [
      "Fuerza unilateral",
      "Core",
      "Estabilidad"
    ],
    "que_observar": [
      "Longitud del paso.",
      "Alineación de la rodilla.",
      "Control de la rotación."
    ],
    "correcciones": [
      "Alargar el paso si la rodilla supera la punta del pie.",
      "Volver al centro antes de subir."
    ],
    "reglas": [
      "Alternar pierna en cada repetición.",
      "Rotar hacia la pierna adelantada.",
      "10 estocadas por pierna."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Añadir balón medicinal ligero (2-3kg) para hacer la rotación con carga."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, 3 × 1 m por jugador. · 10-12 min.",
      "Fútbol 11: 1-15 jugadores, 3 × 1 m por jugador. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 083",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: media.",
        "Espacio: 3 × 1 m por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-083-ESTOCADAS-ALTERNADAS-ROTACION/CampoBase_Estocadas_Alternadas_Rotacion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-083-ESTOCADAS-ALTERNADAS-ROTACION/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-084-PLANCHA-FRONTAL-LATERAL-CORE-ESTATICO",
  "nombre": "Plancha frontal y lateral (core estático)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Core",
      "Estabilidad",
      "Fuerza estática"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, una colchoneta o zona de suelo por jugador"
    },
    "material": "colchoneta opcional",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Plancha frontal apoyado en antebrazos y punta de pies."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Cuerpo COMPLETAMENTE recto, sin cadera hundida ni levantada."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Mantener 30-60 segundos. 3 series."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Plancha lateral: 30-45 segundos por lado, 2 series."
      }
    ],
    "explicacion_breve": "El jugador mantiene primero la plancha frontal con el cuerpo recto y después realiza plancha lateral por ambos lados.",
    "leyenda": "F: plancha frontal · L: plancha lateral · Base: colchoneta opcional"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar la fuerza estática del core — base de toda estabilidad."
    ],
    "claves_entrenador": [
      "Contraer glúteos y abdomen ACTIVAMENTE. Sin contracción, la plancha pierde efecto."
    ],
    "montaje": [
      "Plancha frontal apoyado en antebrazos y punta de pies."
    ],
    "desarrollo": [
      "Plancha frontal apoyado en antebrazos y punta de pies.",
      "Cuerpo COMPLETAMENTE recto, sin cadera hundida ni levantada.",
      "Mantener 30-60 segundos. 3 series.",
      "Plancha lateral: 30-45 segundos por lado, 2 series."
    ],
    "que_buscamos": [
      "Core",
      "Estabilidad",
      "Fuerza estática"
    ],
    "que_observar": [
      "Alineación corporal.",
      "Cadera estable.",
      "Contracción activa de abdomen y glúteos."
    ],
    "correcciones": [
      "Corregir la cadera hundida o levantada.",
      "Acortar el tiempo si se pierde la posición."
    ],
    "reglas": [
      "Mantener el cuerpo completamente recto.",
      "Plancha frontal: 3 series.",
      "Plancha lateral: 2 series por lado."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Aumentar tiempo (60s → 90s), o añadir movimiento (elevar pierna alternadamente)."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, una colchoneta o zona de suelo por jugador. · 8-10 min.",
      "Fútbol 11: 1-15 jugadores, una colchoneta o zona de suelo por jugador. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 084",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: colchoneta o suelo."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-084-PLANCHA-FRONTAL-LATERAL-CORE-ESTATICO/CampoBase_Plancha_Frontal_Lateral_Core_Estatico.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-084-PLANCHA-FRONTAL-LATERAL-CORE-ESTATICO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-085-PUENTES-GLUTEOS-PROGRESION",
  "nombre": "Puentes de glúteos con progresión",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Glúteos",
      "Isquiotibiales",
      "Prevención de lesión"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, una colchoneta o zona de suelo por jugador"
    },
    "material": "colchoneta opcional",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Acostado boca arriba, rodillas flexionadas y pies apoyados."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Elevar cadera empujando con talones hasta formar línea recta rodilla-hombro."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Mantener 2 segundos arriba y bajar de forma controlada."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 series de 15 repeticiones. Progresión: puente con 1 pierna."
      }
    ],
    "explicacion_breve": "Tumbado boca arriba, el jugador eleva la cadera empujando con los talones, mantiene dos segundos y baja de forma controlada.",
    "leyenda": "J: jugador · Flecha roja: elevación de cadera · Base: colchoneta opcional"
  },
  "detalle": {
    "objetivos": [
      "Fortalecer glúteos e isquiotibiales — músculos clave para velocidad y prevención de lesión."
    ],
    "claves_entrenador": [
      "Empujar con TALONES, no con puntas. Sentir contracción en el glúteo, no en la baja espalda."
    ],
    "montaje": [
      "Acostado boca arriba, rodillas flexionadas y pies apoyados."
    ],
    "desarrollo": [
      "Acostado boca arriba, rodillas flexionadas y pies apoyados.",
      "Elevar cadera empujando con talones hasta formar línea recta rodilla-hombro.",
      "Mantener 2 segundos arriba y bajar de forma controlada.",
      "3 series de 15 repeticiones. Progresión: puente con 1 pierna."
    ],
    "que_buscamos": [
      "Glúteos",
      "Isquiotibiales",
      "Prevención de lesión"
    ],
    "que_observar": [
      "Línea rodilla-hombro.",
      "Contracción del glúteo.",
      "Control del descenso."
    ],
    "correcciones": [
      "Evitar empujar con las puntas.",
      "Reducir la altura si la carga pasa a la espalda baja."
    ],
    "reglas": [
      "Empujar con los talones.",
      "Mantener 2 segundos arriba.",
      "Bajar de forma controlada."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Puente con 1 pierna elevada (aumenta 3× la dificultad); luego con pausas isométricas."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, una colchoneta o zona de suelo por jugador. · 8-10 min.",
      "Fútbol 11: 1-15 jugadores, una colchoneta o zona de suelo por jugador. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 085",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: colchoneta o suelo."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-085-PUENTES-GLUTEOS-PROGRESION/CampoBase_Puentes_Gluteos_Progresion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-085-PUENTES-GLUTEOS-PROGRESION/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-086-ABDOMINALES-DINAMICOS-VARIADOS",
  "nombre": "Abdominales dinámicos variados",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Core",
      "Abdomen",
      "Fuerza"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, una colchoneta por jugador"
    },
    "material": "colchoneta",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Crunches clásicos: 15 repeticiones."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Bicicleta (codo a rodilla opuesta): 20 repeticiones."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Elevaciones de piernas rectas: 12 repeticiones."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Plancha con toque de hombro alternado: 20 repeticiones. Circuito × 3 rondas."
      }
    ],
    "explicacion_breve": "Circuito de cuatro ejercicios abdominales (crunches, bicicleta, elevaciones y plancha con toque) completado en tres rondas.",
    "leyenda": "CR: crunches · BI: bicicleta · EL: elevaciones · PL: plancha con toque"
  },
  "detalle": {
    "objetivos": [
      "Trabajar todas las secciones del abdomen con variedad de gestos."
    ],
    "claves_entrenador": [
      "El movimiento sale del ABDOMEN, no del cuello. Si duele el cuello, mal ejecutado."
    ],
    "montaje": [
      "Crunches clásicos: 15 repeticiones."
    ],
    "desarrollo": [
      "Crunches clásicos: 15 repeticiones.",
      "Bicicleta (codo a rodilla opuesta): 20 repeticiones.",
      "Elevaciones de piernas rectas: 12 repeticiones.",
      "Plancha con toque de hombro alternado: 20 repeticiones. Circuito × 3 rondas."
    ],
    "que_buscamos": [
      "Core",
      "Abdomen",
      "Fuerza"
    ],
    "que_observar": [
      "Técnica de cada gesto.",
      "Control del cuello.",
      "Continuidad entre secuencias."
    ],
    "correcciones": [
      "Bajar el ritmo si el cuello se tensa.",
      "Reducir repeticiones si se pierde la técnica."
    ],
    "reglas": [
      "Completar las 4 secuencias.",
      "Realizar 3 rondas.",
      "El movimiento sale del abdomen, no del cuello."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Aumentar repeticiones o añadir tiempo bajo tensión (movimiento MÁS lento)."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, una colchoneta por jugador. · 10-12 min.",
      "Fútbol 11: 1-15 jugadores, una colchoneta por jugador. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 086",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: colchoneta."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-086-ABDOMINALES-DINAMICOS-VARIADOS/CampoBase_Abdominales_Dinamicos_Variados.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-086-ABDOMINALES-DINAMICOS-VARIADOS/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-087-ESCALADA-VERTICAL-MOUNTAIN-CLIMBERS",
  "nombre": "Escalada vertical (mountain climbers)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Core",
      "Cardio",
      "Resistencia"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, 1 m² por jugador"
    },
    "material": "ninguno",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Posición de plancha alta (brazos extendidos, cuerpo recto)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Traer rodilla derecha al pecho, volver a la posición inicial."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Alternar rápidamente con la rodilla izquierda."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Trabajar 30-45 segundos. Descanso 30s. 4 series."
      }
    ],
    "explicacion_breve": "En posición de plancha alta, el jugador alterna rápidamente las rodillas hacia el pecho durante series de 30-45 segundos.",
    "leyenda": "J: jugador · Flecha roja: rodillas al pecho · Base: superficie de apoyo"
  },
  "detalle": {
    "objetivos": [
      "Trabajar core dinámico + resistencia cardiovascular integrada."
    ],
    "claves_entrenador": [
      "Cadera baja siempre — si sube, se convierte en trote. Cuerpo horizontal como una tabla."
    ],
    "montaje": [
      "Posición de plancha alta (brazos extendidos, cuerpo recto)."
    ],
    "desarrollo": [
      "Posición de plancha alta (brazos extendidos, cuerpo recto).",
      "Traer rodilla derecha al pecho, volver a la posición inicial.",
      "Alternar rápidamente con la rodilla izquierda.",
      "Trabajar 30-45 segundos. Descanso 30s. 4 series."
    ],
    "que_buscamos": [
      "Core",
      "Cardio",
      "Resistencia"
    ],
    "que_observar": [
      "Altura de la cadera.",
      "Ritmo de alternancia.",
      "Alineación del cuerpo."
    ],
    "correcciones": [
      "Bajar la cadera si sube.",
      "Reducir el ritmo si se pierde la posición."
    ],
    "reglas": [
      "Mantener la cadera baja.",
      "Cuerpo horizontal.",
      "4 series de 30-45 segundos."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Aumentar velocidad, o hacer variante cruzada (rodilla izq → codo der)."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, 1 m² por jugador. · 8-10 min.",
      "Fútbol 11: 1-15 jugadores, 1 m² por jugador. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 087",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 1 m² por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-087-ESCALADA-VERTICAL-MOUNTAIN-CLIMBERS/CampoBase_Escalada_Vertical_Mountain_Climbers.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-087-ESCALADA-VERTICAL-MOUNTAIN-CLIMBERS/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-088-BURPEES-CON-PROGRESION",
  "nombre": "Burpees con progresión",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Potencia",
      "Resistencia",
      "Coordinación"
    ],
    "tiempo_estimado_15": "10-15 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, 1 m² por jugador"
    },
    "material": "ninguno",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "De pie → bajar a cuclillas con manos en el suelo."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Extender piernas atrás (plancha). Opcional: 1 flexión."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Traer piernas de vuelta, y saltar arriba con brazos extendidos."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "5-10 burpees por serie, 4 series. 60-90s descanso."
      }
    ],
    "explicacion_breve": "Secuencia completa de burpee: de pie a cuclillas, extensión a plancha, vuelta y salto vertical con brazos extendidos.",
    "leyenda": "1: parado · 2: cuclillas · 3: plancha · 4: salto arriba"
  },
  "detalle": {
    "objetivos": [
      "Trabajar potencia + resistencia + coordinación del cuerpo entero."
    ],
    "claves_entrenador": [
      "Este ejercicio es DURO. Empezar con 5 rep y subir progresivamente. No sobreentrenarse."
    ],
    "montaje": [
      "De pie → bajar a cuclillas con manos en el suelo."
    ],
    "desarrollo": [
      "De pie → bajar a cuclillas con manos en el suelo.",
      "Extender piernas atrás (plancha). Opcional: 1 flexión.",
      "Traer piernas de vuelta, y saltar arriba con brazos extendidos.",
      "5-10 burpees por serie, 4 series. 60-90s descanso."
    ],
    "que_buscamos": [
      "Potencia",
      "Resistencia",
      "Coordinación"
    ],
    "que_observar": [
      "Coordinación de la secuencia.",
      "Extensión completa en plancha.",
      "Salto vertical final."
    ],
    "correcciones": [
      "Empezar con 5 repeticiones.",
      "No sobreentrenarse."
    ],
    "reglas": [
      "Completar la secuencia completa.",
      "4 series de 5-10 burpees.",
      "Descanso de 60-90 segundos."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Añadir la flexión completa en la fase de plancha; luego, salto vertical máximo al final."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, 1 m² por jugador. · 10-15 min.",
      "Fútbol 11: 1-15 jugadores, 1 m² por jugador. · 10-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 088",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: muy alta.",
        "Espacio: 1 m² por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-088-BURPEES-CON-PROGRESION/CampoBase_Burpees_Con_Progresion.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-088-BURPEES-CON-PROGRESION/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-089-CIRCUITO-CROSSFIT-ADAPTADO-FUTBOL",
  "nombre": "Circuito CrossFit adaptado al fútbol",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Fuerza",
      "Resistencia",
      "Técnica"
    ],
    "tiempo_estimado_15": "20-25 min",
    "jugadores": {
      "total": 10,
      "organizacion": "3-10 jugadores, distribuidos en 4 estaciones"
    },
    "material": "balones + colchoneta + conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Estación 1: 10 sentadillas con salto."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Estación 2: 10 flexiones + tocar hombro."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Estación 3: 20 mountain climbers."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Estación 4: 8 remates a portería. Circuito × 4 rondas."
      }
    ],
    "explicacion_breve": "Circuito de cuatro estaciones (sentadillas con salto, flexiones con toque, mountain climbers y remates a portería) completado en cuatro rondas sin parar.",
    "leyenda": "SEN+S: sentadillas + salto · FLEX+T: flexiones + toque · MC: mountain climbers · REMAT: remates a portería"
  },
  "detalle": {
    "objetivos": [
      "Combinar fuerza + resistencia + gestos técnicos del fútbol en un circuito integral."
    ],
    "claves_entrenador": [
      "El objetivo es NO parar entre estaciones — solo cambiar de una a otra rápido."
    ],
    "montaje": [
      "Estación 1: 10 sentadillas con salto."
    ],
    "desarrollo": [
      "Estación 1: 10 sentadillas con salto.",
      "Estación 2: 10 flexiones + tocar hombro.",
      "Estación 3: 20 mountain climbers.",
      "Estación 4: 8 remates a portería. Circuito × 4 rondas."
    ],
    "que_buscamos": [
      "Fuerza",
      "Resistencia",
      "Técnica"
    ],
    "que_observar": [
      "Continuidad entre estaciones.",
      "Técnica de cada gesto.",
      "Ritmo del circuito."
    ],
    "correcciones": [
      "Reducir repeticiones si se pierde la técnica.",
      "Mantener el ritmo sin parar."
    ],
    "reglas": [
      "Completar las 4 estaciones.",
      "Realizar 4 rondas.",
      "No parar entre estaciones."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Cronometrar el circuito completo y buscar reducir tiempo con calidad."
    ],
    "variantes": [
      "Fútbol 7: 3-10 jugadores, distribuidos en 4 estaciones. · 20-25 min.",
      "Fútbol 11: 3-10 jugadores, distribuidos en 4 estaciones. · 20-25 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 089",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-14+.",
        "Intensidad: alta.",
        "Espacio: 15x10 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-089-CIRCUITO-CROSSFIT-ADAPTADO-FUTBOL/CampoBase_Circuito_Crossfit_Adaptado_Futbol.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-089-CIRCUITO-CROSSFIT-ADAPTADO-FUTBOL/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-090-FUERZA-EXCENTRICA-ISQUIOTIBIALES-NORDIC-CURL",
  "nombre": "Fuerza excéntrica isquiotibiales (Nordic curl)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Isquiotibiales",
      "Prevención",
      "Fuerza excéntrica"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja (uno sostiene)"
    },
    "material": "colchoneta + compañero",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugador de rodillas sobre colchoneta, compañero sostiene tobillos firme."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Jugador se inclina LENTAMENTE hacia adelante manteniendo cuerpo recto."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Bajar tanto como pueda controlando (sin caer). Volver arriba con impulso de brazos."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 series de 6-8 repeticiones. Cada 3 días como máximo (recuperación necesaria)."
      }
    ],
    "explicacion_breve": "De rodillas y con los tobillos sujetos por un compañero, el jugador se inclina lentamente hacia adelante controlando el descenso.",
    "leyenda": "J: jugador · C: compañero · Flecha roja: inclinación · Línea gris: sujeción de tobillos"
  },
  "detalle": {
    "objetivos": [
      "Prevenir lesiones de isquiotibiales — la lesión #1 en fútbol."
    ],
    "claves_entrenador": [
      "Ejercicio MUY exigente. Baja lo que puedas controlando. Con el tiempo, bajarás más."
    ],
    "montaje": [
      "Jugador de rodillas sobre colchoneta, compañero sostiene tobillos firme."
    ],
    "desarrollo": [
      "Jugador de rodillas sobre colchoneta, compañero sostiene tobillos firme.",
      "Jugador se inclina LENTAMENTE hacia adelante manteniendo cuerpo recto.",
      "Bajar tanto como pueda controlando (sin caer). Volver arriba con impulso de brazos.",
      "3 series de 6-8 repeticiones. Cada 3 días como máximo (recuperación necesaria)."
    ],
    "que_buscamos": [
      "Isquiotibiales",
      "Prevención",
      "Fuerza excéntrica"
    ],
    "que_observar": [
      "Control del descenso.",
      "Cuerpo recto.",
      "Sujeción firme de tobillos."
    ],
    "correcciones": [
      "Bajar solo lo que se pueda controlar.",
      "No forzar el descenso."
    ],
    "reglas": [
      "Bajar controlando, sin caer.",
      "3 series de 6-8 repeticiones.",
      "Cada 3 días como máximo."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Objetivo: llegar a poder bajar completamente sin caer y subir sin brazos (nivel élite)."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja (uno sostiene). · 8-10 min.",
      "Fútbol 11: 2 por pareja (uno sostiene). · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 090",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-14+.",
        "Intensidad: alta.",
        "Espacio: colchoneta."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-090-FUERZA-EXCENTRICA-ISQUIOTIBIALES-NORDIC-CURL/CampoBase_Fuerza_Excentrica_Isquiotibiales_Nordic_Curl.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-090-FUERZA-EXCENTRICA-ISQUIOTIBIALES-NORDIC-CURL/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-091-FUERZA-EXPLOSIVA-SALTO-VERTICAL-HORIZONTAL",
  "nombre": "Fuerza explosiva con salto vertical + horizontal",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Potencia",
      "Pliometría",
      "Tren inferior"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10 jugadores, 5x2 m por jugador"
    },
    "material": "conos o marcas",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Serie 1: 5 saltos verticales máximos con recuperación completa."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Serie 2: 5 saltos horizontales (broad jump) máximos."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Serie 3: alternar 1 vertical + 1 horizontal, 6 repeticiones."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Recuperación 2 min entre series. 3 series totales."
      }
    ],
    "explicacion_breve": "Series de saltos verticales y horizontales máximos, alternando ambos planos con recuperación completa entre series.",
    "leyenda": "J: salto vertical · J2: salto horizontal · Flecha roja: dirección del salto"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la potencia en múltiples direcciones y planos."
    ],
    "claves_entrenador": [
      "En cada salto, dar el máximo. Sin dosificar. La calidad importa más que la cantidad."
    ],
    "montaje": [
      "Serie 1: 5 saltos verticales máximos con recuperación completa."
    ],
    "desarrollo": [
      "Serie 1: 5 saltos verticales máximos con recuperación completa.",
      "Serie 2: 5 saltos horizontales (broad jump) máximos.",
      "Serie 3: alternar 1 vertical + 1 horizontal, 6 repeticiones.",
      "Recuperación 2 min entre series. 3 series totales."
    ],
    "que_buscamos": [
      "Potencia",
      "Pliometría",
      "Tren inferior"
    ],
    "que_observar": [
      "Máxima potencia en cada salto.",
      "Técnica de aterrizaje.",
      "Recuperación entre series."
    ],
    "correcciones": [
      "No dosificar el esfuerzo.",
      "Mantener la calidad por encima de la cantidad."
    ],
    "reglas": [
      "Dar el máximo en cada salto.",
      "Recuperación completa entre series.",
      "3 series totales."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Añadir saltos laterales (lateral bounds) para trabajar transferencia lateral."
    ],
    "variantes": [
      "Fútbol 7: 1-10 jugadores, 5x2 m por jugador. · 10-12 min.",
      "Fútbol 11: 1-10 jugadores, 5x2 m por jugador. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 091",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 5x2 m por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-091-FUERZA-EXPLOSIVA-SALTO-VERTICAL-HORIZONTAL/CampoBase_Fuerza_Explosiva_Salto_Vertical_Horizontal.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-091-FUERZA-EXPLOSIVA-SALTO-VERTICAL-HORIZONTAL/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-092-TRABAJO-PLIOMETRICO-CON-CONOS",
  "nombre": "Trabajo pliométrico con conos",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Pliometría",
      "Reactividad",
      "Potencia"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10 jugadores, 10x3 m"
    },
    "material": "6-8 conos bajos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Colocar 6-8 conos bajos en línea, separados por 60 cm."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Saltar con 2 pies juntos sobre cada cono, contacto MÍNIMO con el suelo."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Al terminar, sprint de 5m."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6-8 pasadas con recuperación completa entre cada una."
      }
    ],
    "explicacion_breve": "Saltos con dos pies juntos sobre una línea de conos bajos, con contacto mínimo con el suelo y sprint final de 5 metros.",
    "leyenda": "J: jugador · Cono naranja: cono bajo · Arco rojo: salto · Flecha roja: sprint final"
  },
  "detalle": {
    "objetivos": [
      "Desarrollar la reactividad y potencia con estímulo variado."
    ],
    "claves_entrenador": [
      "El objetivo es 'rebotar' del suelo, no aplastarlo. Sonido de aterrizaje = ligero."
    ],
    "montaje": [
      "Colocar 6-8 conos bajos en línea, separados por 60 cm."
    ],
    "desarrollo": [
      "Colocar 6-8 conos bajos en línea, separados por 60 cm.",
      "Saltar con 2 pies juntos sobre cada cono, contacto MÍNIMO con el suelo.",
      "Al terminar, sprint de 5m.",
      "6-8 pasadas con recuperación completa entre cada una."
    ],
    "que_buscamos": [
      "Pliometría",
      "Reactividad",
      "Potencia"
    ],
    "que_observar": [
      "Reactividad del salto.",
      "Contacto mínimo con el suelo.",
      "Sprint final."
    ],
    "correcciones": [
      "Rebotar del suelo, no aplastarlo.",
      "Aterrizar ligero."
    ],
    "reglas": [
      "Saltar con 2 pies juntos.",
      "Contacto mínimo con el suelo.",
      "6-8 pasadas con recuperación completa."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Alternar 1 pie / 2 pies; luego pliometría cruzada con giro entre saltos."
    ],
    "variantes": [
      "Fútbol 7: 1-10 jugadores, 10x3 m. · 12-15 min.",
      "Fútbol 11: 1-10 jugadores, 10x3 m. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 092",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: alta.",
        "Espacio: 10x3 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-092-TRABAJO-PLIOMETRICO-CON-CONOS/CampoBase_Trabajo_Pliometrico_Con_Conos.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-092-TRABAJO-PLIOMETRICO-CON-CONOS/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-093-ACELERACION-DESDE-PARADO-POSICIONES",
  "nombre": "Aceleración desde parado en distintas posiciones",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Velocidad",
      "Explosividad",
      "Salida"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 10,
      "organizacion": "1-10 jugadores, 20 m lineales"
    },
    "material": "conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Sprint de 15m desde posición A: de pie parado."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Sprint de 15m desde posición B: sentado en el suelo."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Sprint de 15m desde posición C: acostado boca abajo."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "3 sprints por posición. Descanso 60s entre cada uno."
      }
    ],
    "explicacion_breve": "Sprints de 15 metros desde tres posiciones de inicio distintas: de pie, sentado y acostado boca abajo.",
    "leyenda": "A: de pie · B: sentado · C: acostado · Flecha roja: sprint 15m"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la salida explosiva desde múltiples posiciones de inicio."
    ],
    "claves_entrenador": [
      "La primera zancada define todo. Debe ser BAJA y EXPLOSIVA — como pistón."
    ],
    "montaje": [
      "Sprint de 15m desde posición A: de pie parado."
    ],
    "desarrollo": [
      "Sprint de 15m desde posición A: de pie parado.",
      "Sprint de 15m desde posición B: sentado en el suelo.",
      "Sprint de 15m desde posición C: acostado boca abajo.",
      "3 sprints por posición. Descanso 60s entre cada uno."
    ],
    "que_buscamos": [
      "Velocidad",
      "Explosividad",
      "Salida"
    ],
    "que_observar": [
      "Primera zancada.",
      "Explosividad de la salida.",
      "Técnica de sprint."
    ],
    "correcciones": [
      "Primera zancada baja y explosiva.",
      "No levantarse antes de arrancar."
    ],
    "reglas": [
      "3 sprints por posición.",
      "Descanso 60s entre sprints.",
      "Salida explosiva."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Añadir posición D: acostado boca arriba (más difícil de arrancar rápido)."
    ],
    "variantes": [
      "Fútbol 7: 1-10 jugadores, 20 m lineales. · 12-15 min.",
      "Fútbol 11: 1-10 jugadores, 20 m lineales. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 093",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 20 m lineales."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-093-ACELERACION-DESDE-PARADO-POSICIONES/CampoBase_Aceleracion_Desde_Parado_Posiciones.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-093-ACELERACION-DESDE-PARADO-POSICIONES/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-094-ARRANCADA-EXPLOSIVA-CON-ESTIMULO",
  "nombre": "Arrancada explosiva con estímulo",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Reacción",
      "Velocidad",
      "Potencia"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2+ (uno da señal)"
    },
    "material": "conos + silbato o palma",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugador de pie en el punto de partida, atento."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Entrenador da señal AUDITIVA (silbato) en momento aleatorio."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Jugador arranca sprint máximo de 15m."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6-8 arrancadas por sesión con descanso completo."
      }
    ],
    "explicacion_breve": "El jugador arranca un sprint máximo de 15 metros al recibir una señal auditiva del entrenador en un momento aleatorio.",
    "leyenda": "C: entrenador · J: jugador · Flecha discontinua: señal · Flecha continua: sprint"
  },
  "detalle": {
    "objetivos": [
      "Combinar reacción + potencia de arranque desde parado."
    ],
    "claves_entrenador": [
      "El foco NO es la velocidad — es el tiempo de reacción a la señal."
    ],
    "montaje": [
      "Jugador de pie en el punto de partida, atento."
    ],
    "desarrollo": [
      "Jugador de pie en el punto de partida, atento.",
      "Entrenador da señal AUDITIVA (silbato) en momento aleatorio.",
      "Jugador arranca sprint máximo de 15m.",
      "6-8 arrancadas por sesión con descanso completo."
    ],
    "que_buscamos": [
      "Reacción",
      "Velocidad",
      "Potencia"
    ],
    "que_observar": [
      "Tiempo de reacción.",
      "Explosividad del arranque.",
      "Atención a la señal."
    ],
    "correcciones": [
      "Centrarse en la reacción, no en la velocidad.",
      "Mantener la atención."
    ],
    "reglas": [
      "Reaccionar a la señal.",
      "Sprint máximo de 15m.",
      "6-8 arrancadas con descanso completo."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Alternar señales auditivas y visuales (mano levantada); cambiar de posición inicial."
    ],
    "variantes": [
      "Fútbol 7: 2+ (uno da señal). · 10-12 min.",
      "Fútbol 11: 2+ (uno da señal). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 094",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 15 m lineales."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-094-ARRANCADA-EXPLOSIVA-CON-ESTIMULO/CampoBase_Arrancada_Explosiva_Con_Estimulo.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-094-ARRANCADA-EXPLOSIVA-CON-ESTIMULO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-095-CAMBIO-DE-DIRECCION-CON-CARGA",
  "nombre": "Cambio de dirección con carga",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Fuerza",
      "Agilidad",
      "Cambio de dirección"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "chaleco lastrado 3-5kg o resistencia de compañero",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Jugador con chaleco lastrado (5% peso corporal) o con compañero sujetándolo por la cintura."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Realizar 4 cambios de dirección de 5m cada uno (zigzag)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Descansar 90 segundos."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Repetir 5-6 series."
      }
    ],
    "explicacion_breve": "Con chaleco lastrado o un compañero sujetando, el jugador realiza cambios de dirección en zigzag entre conos.",
    "leyenda": "J: jugador · C: compañero · Cono naranja: cono · Flecha roja: zigzag"
  },
  "detalle": {
    "objetivos": [
      "Trabajar fuerza específica de cambio de dirección bajo resistencia."
    ],
    "claves_entrenador": [
      "La resistencia AUMENTA la exigencia — la técnica debe seguir siendo perfecta. Sin técnica, no sirve."
    ],
    "montaje": [
      "Jugador con chaleco lastrado (5% peso corporal) o con compañero sujetándolo por la cintura."
    ],
    "desarrollo": [
      "Jugador con chaleco lastrado (5% peso corporal) o con compañero sujetándolo por la cintura.",
      "Realizar 4 cambios de dirección de 5m cada uno (zigzag).",
      "Descansar 90 segundos.",
      "Repetir 5-6 series."
    ],
    "que_buscamos": [
      "Fuerza",
      "Agilidad",
      "Cambio de dirección"
    ],
    "que_observar": [
      "Técnica del cambio de dirección.",
      "Control bajo carga.",
      "Ritmo del zigzag."
    ],
    "correcciones": [
      "Mantener la técnica perfecta bajo carga.",
      "No sacrificar técnica por velocidad."
    ],
    "reglas": [
      "4 cambios de dirección.",
      "Descanso de 90 segundos.",
      "5-6 series."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Aumentar carga progresivamente (5% → 7% → 10% del peso corporal)."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 12-15 min.",
      "Fútbol 11: 2 por pareja. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 095",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-14+.",
        "Intensidad: alta.",
        "Espacio: 10x8 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-095-CAMBIO-DE-DIRECCION-CON-CARGA/CampoBase_Cambio_De_Direccion_Con_Carga.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-095-CAMBIO-DE-DIRECCION-CON-CARGA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-097-FARTLEK-JUEGO-DE-VELOCIDADES",
  "nombre": "Fartlek — juego de velocidades",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Resistencia",
      "Ritmo",
      "Cambio de intensidad"
    ],
    "tiempo_estimado_15": "15-20 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, campo o pista"
    },
    "material": "cronómetro",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Correr continuo durante 15-20 minutos."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Cada 60 segundos, entrenador grita: 'RÁPIDO' (30s), 'MEDIO' (60s), 'LENTO' (60s)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Jugadores cambian intensidad según indicación, sin parar de correr."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Al terminar, 5 min de estiramiento."
      }
    ],
    "explicacion_breve": "Carrera continua de 15-20 minutos en la que el entrenador indica cambios de ritmo (rápido, medio, lento) sin parar de correr.",
    "leyenda": "Rojo: rápido · Amarillo: medio · Verde: lento · J: jugador"
  },
  "detalle": {
    "objetivos": [
      "Combinar todas las intensidades de forma jugada y variada."
    ],
    "claves_entrenador": [
      "El fartlek entrena TODOS los sistemas energéticos en el mismo ejercicio. Muy eficiente."
    ],
    "montaje": [
      "Correr continuo durante 15-20 minutos."
    ],
    "desarrollo": [
      "Correr continuo durante 15-20 minutos.",
      "Cada 60 segundos, entrenador grita: 'RÁPIDO' (30s), 'MEDIO' (60s), 'LENTO' (60s).",
      "Jugadores cambian intensidad según indicación, sin parar de correr.",
      "Al terminar, 5 min de estiramiento."
    ],
    "que_buscamos": [
      "Resistencia",
      "Ritmo",
      "Cambio de intensidad"
    ],
    "que_observar": [
      "Cambio de ritmo.",
      "Continuidad de la carrera.",
      "Respuesta a las indicaciones."
    ],
    "correcciones": [
      "No parar de correr.",
      "Ajustar la intensidad a la indicación."
    ],
    "reglas": [
      "Correr continuo sin parar.",
      "Cambiar intensidad según indicación.",
      "5 min de estiramiento al final."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Añadir cambios de dirección durante los tramos rápidos, o incluir toque de balón cada 3 min."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, campo o pista. · 15-20 min.",
      "Fútbol 11: 1-15 jugadores, campo o pista. · 15-20 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 097",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: variable.",
        "Espacio: campo o pista."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-097-FARTLEK-JUEGO-DE-VELOCIDADES/CampoBase_Fartlek_Juego_De_Velocidades.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-097-FARTLEK-JUEGO-DE-VELOCIDADES/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-098-TRABAJO-CON-BANDAS-ELASTICAS",
  "nombre": "Trabajo con bandas elásticas",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Glúteos",
      "Estabilizadores",
      "Fuerza"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 15,
      "organizacion": "1-15 jugadores, 2 m² por jugador"
    },
    "material": "banda elástica corta",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Banda alrededor de los muslos, justo arriba de las rodillas."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Sentadilla con paso lateral: 10 pasos derecha, 10 izquierda."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Puente de glúteos con banda: 15 repeticiones."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Elevación lateral de pierna: 15 por lado. Circuito × 3 rondas."
      }
    ],
    "explicacion_breve": "Con una banda elástica en los muslos, el jugador realiza pasos laterales, puentes de glúteos y elevaciones laterales de pierna en circuito.",
    "leyenda": "J: jugador · Flecha arriba: puente · Flecha derecha: paso lateral · Base: suelo"
  },
  "detalle": {
    "objetivos": [
      "Fortalecer glúteos y músculos estabilizadores con resistencia lateral."
    ],
    "claves_entrenador": [
      "El objetivo es NO dejar que la banda se destense en ningún momento del ejercicio."
    ],
    "montaje": [
      "Banda alrededor de los muslos, justo arriba de las rodillas."
    ],
    "desarrollo": [
      "Banda alrededor de los muslos, justo arriba de las rodillas.",
      "Sentadilla con paso lateral: 10 pasos derecha, 10 izquierda.",
      "Puente de glúteos con banda: 15 repeticiones.",
      "Elevación lateral de pierna: 15 por lado. Circuito × 3 rondas."
    ],
    "que_buscamos": [
      "Glúteos",
      "Estabilizadores",
      "Fuerza"
    ],
    "que_observar": [
      "Tensión de la banda.",
      "Técnica de cada movimiento.",
      "Control lateral."
    ],
    "correcciones": [
      "No dejar que la banda se destense.",
      "Mantener la resistencia constante."
    ],
    "reglas": [
      "Mantener la banda tensa.",
      "Completar las 3 secuencias.",
      "Circuito × 3 rondas."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Usar banda más gruesa (mayor resistencia); añadir salto lateral con banda."
    ],
    "variantes": [
      "Fútbol 7: 1-15 jugadores, 2 m² por jugador. · 10-12 min.",
      "Fútbol 11: 1-15 jugadores, 2 m² por jugador. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 098",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-13+.",
        "Intensidad: media.",
        "Espacio: 2 m² por jugador."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-098-TRABAJO-CON-BANDAS-ELASTICAS/CampoBase_Trabajo_Con_Bandas_Elasticas.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-098-TRABAJO-CON-BANDAS-ELASTICAS/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-099-CORE-APLICADO-AL-FUTBOL-CON-BALON",
  "nombre": "Core aplicado al fútbol (con balón)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Core",
      "Rotación",
      "Estabilidad"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "1 balón por pareja",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Sentados espalda con espalda, pasarse un balón con rotación del torso (30s)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Plancha con tocar balón alternadamente con cada mano (30s)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Sentado en V, pasarse balón por debajo de piernas alternadamente (30s)."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Circuito × 4 rondas con 30s descanso."
      }
    ],
    "explicacion_breve": "Por parejas, los jugadores pasan un balón con rotación del torso, tocan el balón en plancha y lo pasan por debajo de las piernas en circuito.",
    "leyenda": "A: jugador A · B: jugador B · Balón: balón · Flecha azul: pase con rotación"
  },
  "detalle": {
    "objetivos": [
      "Fortalecer el core con gestos específicos del fútbol."
    ],
    "claves_entrenador": [
      "El core del fútbol es DINÁMICO, no estático. Estos ejercicios lo entrenan tal como se usa en el juego."
    ],
    "montaje": [
      "Sentados espalda con espalda, pasarse un balón con rotación del torso (30s)."
    ],
    "desarrollo": [
      "Sentados espalda con espalda, pasarse un balón con rotación del torso (30s).",
      "Plancha con tocar balón alternadamente con cada mano (30s).",
      "Sentado en V, pasarse balón por debajo de piernas alternadamente (30s).",
      "Circuito × 4 rondas con 30s descanso."
    ],
    "que_buscamos": [
      "Core",
      "Rotación",
      "Estabilidad"
    ],
    "que_observar": [
      "Rotación del torso.",
      "Estabilidad en plancha.",
      "Control del balón."
    ],
    "correcciones": [
      "Mantener la rotación controlada.",
      "No despegar las espaldas."
    ],
    "reglas": [
      "Completar las 3 secuencias.",
      "Circuito × 4 rondas.",
      "Descanso de 30 segundos."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Usar balón medicinal ligero (2-3kg) en lugar de balón normal."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 10-12 min.",
      "Fútbol 11: 2 por pareja. · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 099",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: media.",
        "Espacio: 5x3 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-099-CORE-APLICADO-AL-FUTBOL-CON-BALON/CampoBase_Core_Aplicado_Al_Futbol_Con_Balon.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-099-CORE-APLICADO-AL-FUTBOL-CON-BALON/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-100-TEST-FISICO-COMPLETO-EVALUACION-INTEGRAL",
  "nombre": "Test físico completo — evaluación integral",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Preparación física",
    "que_se_trabaja": [
      "Evaluación",
      "Velocidad",
      "Potencia",
      "Agilidad",
      "Resistencia"
    ],
    "tiempo_estimado_15": "25-30 min",
    "jugadores": {
      "total": 8,
      "organizacion": "1-8 jugadores, campo abierto + colchoneta"
    },
    "material": "cronómetro + conos + planilla",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Test 1: Sprint 30m (velocidad)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Test 2: Salto vertical (potencia)."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Test 3: T-drill (agilidad)."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "Test 4: Yo-Yo Intermittent Recovery (resistencia)."
      }
    ],
    "explicacion_breve": "Batería de cuatro tests físicos: sprint de 30 metros, salto vertical, T-drill y Yo-Yo Intermittent Recovery.",
    "leyenda": "S: sprint 30m · J: salto vertical · T: T-drill · Y: Yo-Yo IR"
  },
  "detalle": {
    "objetivos": [
      "Medir el estado físico del jugador de forma estandarizada."
    ],
    "claves_entrenador": [
      "El test se hace 2-3 veces por año, siempre en las MISMAS condiciones para comparar honestamente."
    ],
    "montaje": [
      "Test 1: Sprint 30m (velocidad)."
    ],
    "desarrollo": [
      "Test 1: Sprint 30m (velocidad).",
      "Test 2: Salto vertical (potencia).",
      "Test 3: T-drill (agilidad).",
      "Test 4: Yo-Yo Intermittent Recovery (resistencia)."
    ],
    "que_buscamos": [
      "Evaluación",
      "Velocidad",
      "Potencia",
      "Agilidad",
      "Resistencia"
    ],
    "que_observar": [
      "Resultados de cada test.",
      "Condiciones de medición.",
      "Evolución trimestral."
    ],
    "correcciones": [
      "Mantener las mismas condiciones.",
      "Registrar honestamente los resultados."
    ],
    "reglas": [
      "Realizar los 4 tests.",
      "Mismas condiciones en cada medición.",
      "Registrar los resultados."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Registrar resultados en la Planilla Semanal del Sistema Anual y comparar cada trimestre."
    ],
    "variantes": [
      "Fútbol 7: 1-8 jugadores, campo abierto + colchoneta. · 25-30 min.",
      "Fútbol 11: 1-8 jugadores, campo abierto + colchoneta. · 25-30 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 100",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: máxima.",
        "Espacio: campo abierto + colchoneta."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-100-TEST-FISICO-COMPLETO-EVALUACION-INTEGRAL/CampoBase_Test_Fisico_Completo_Evaluacion_Integral.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-100-TEST-FISICO-COMPLETO-EVALUACION-INTEGRAL/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-101-POSTURA-DEFENSIVA-BASICA-SOMBREADO",
  "nombre": "Postura defensiva básica (sombreado sin balón)",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "que_se_trabaja": [
      "Defensa",
      "Postura",
      "Orientación"
    ],
    "tiempo_estimado_15": "8-10 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "4 conos delimitando zona",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Un atacante se mueve libremente por la zona (sin balón)."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "El defensor debe seguirlo a 1-2m de distancia, siempre con rodillas flexionadas."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Objetivo: mantener SIEMPRE el cuerpo entre el atacante y una portería imaginaria."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "60 segundos por ronda. Rotar. 4-6 rondas."
      }
    ],
    "explicacion_breve": "El defensor sigue al atacante a 1-2 metros manteniendo siempre el cuerpo entre el atacante y una portería imaginaria.",
    "leyenda": "A: atacante · D: defensor · Recuadro gris: zona delimitada · Flecha roja: seguimiento"
  },
  "detalle": {
    "objetivos": [
      "Automatizar la postura, distancia y orientación del defensor sin necesidad de balón."
    ],
    "claves_entrenador": [
      "El defensor mira el CENTRO DE GRAVEDAD del atacante (caderas), NUNCA los pies."
    ],
    "montaje": [
      "Un atacante se mueve libremente por la zona (sin balón)."
    ],
    "desarrollo": [
      "Un atacante se mueve libremente por la zona (sin balón).",
      "El defensor debe seguirlo a 1-2m de distancia, siempre con rodillas flexionadas.",
      "Objetivo: mantener SIEMPRE el cuerpo entre el atacante y una portería imaginaria.",
      "60 segundos por ronda. Rotar. 4-6 rondas."
    ],
    "que_buscamos": [
      "Defensa",
      "Postura",
      "Orientación"
    ],
    "que_observar": [
      "Distancia de marcaje.",
      "Orientación del cuerpo.",
      "Flexión de rodillas."
    ],
    "correcciones": [
      "Mirar las caderas, no los pies.",
      "Mantener la distancia de 1-2m."
    ],
    "reglas": [
      "Seguir a 1-2m de distancia.",
      "Cuerpo entre atacante y portería.",
      "4-6 rondas de 60 segundos."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Agregar balón al atacante — convierte el ejercicio en 1v1 real."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 8-10 min.",
      "Fútbol 11: 2 por pareja. · 8-10 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 101",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio sin balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: 8 x 6 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-101-POSTURA-DEFENSIVA-BASICA-SOMBREADO/CampoBase_Postura_Defensiva_Basica_Sombreado.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-101-POSTURA-DEFENSIVA-BASICA-SOMBREADO/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-102-MARCAJE-INDIVIDUAL-CUERPO-ENTRE-BALON-JUGADOR",
  "nombre": "Marcaje individual — cuerpo entre balón y jugador",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "que_se_trabaja": [
      "Defensa",
      "Marcaje",
      "Interceptación"
    ],
    "tiempo_estimado_15": "10-12 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (pasador, receptor, defensor)"
    },
    "material": "1 balón + conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Pasador a 10m, receptor a 5m del pasador, defensor detrás del receptor."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Cuando pasador va a pasar, defensor debe ubicarse ENTRE el balón y el receptor."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El objetivo del defensor: interceptar o llegar al balón antes del receptor."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "10 pases. Rotar roles."
      }
    ],
    "explicacion_breve": "El defensor se ubica entre el balón y el receptor para interceptar o llegar antes al balón.",
    "leyenda": "P: pasador · D: defensor · R: receptor · Línea azul: pase · Flecha azul: interceptar"
  },
  "detalle": {
    "objetivos": [
      "Aprender la posición correcta al marcar a un rival que va a recibir."
    ],
    "claves_entrenador": [
      "Perfil abierto: hombros ligeramente rotados para ver AMBOS — atacante Y balón."
    ],
    "montaje": [
      "Pasador a 10m, receptor a 5m del pasador, defensor detrás del receptor."
    ],
    "desarrollo": [
      "Pasador a 10m, receptor a 5m del pasador, defensor detrás del receptor.",
      "Cuando pasador va a pasar, defensor debe ubicarse ENTRE el balón y el receptor.",
      "El objetivo del defensor: interceptar o llegar al balón antes del receptor.",
      "10 pases. Rotar roles."
    ],
    "que_buscamos": [
      "Defensa",
      "Marcaje",
      "Interceptación"
    ],
    "que_observar": [
      "Posición del defensor.",
      "Perfil abierto.",
      "Lectura del pase."
    ],
    "correcciones": [
      "Perfil abierto para ver ambos.",
      "Anticiparse al pase."
    ],
    "reglas": [
      "Ubicarse entre balón y receptor.",
      "Interceptar o llegar antes.",
      "10 pases y rotar roles."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Aumentar velocidad y ángulo del pase del pasador para dificultar la lectura."
    ],
    "variantes": [
      "Fútbol 7: 3 (pasador, receptor, defensor). · 10-12 min.",
      "Fútbol 11: 3 (pasador, receptor, defensor). · 10-12 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 102",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: media.",
        "Espacio: 12 x 8 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-102-MARCAJE-INDIVIDUAL-CUERPO-ENTRE-BALON-JUGADOR/CampoBase_Marcaje_Individual_Cuerpo_Entre_Balon_Jugador.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-102-MARCAJE-INDIVIDUAL-CUERPO-ENTRE-BALON-JUGADOR/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-103-1V1-DEFENSIVO-RECUPERAR-BALON-SIN-GOL",
  "nombre": "1v1 defensivo — recuperar balón sin gol",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "que_se_trabaja": [
      "Defensa",
      "1v1",
      "Robo"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 2,
      "organizacion": "2 por pareja"
    },
    "material": "1 balón + 4 conos",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Zona delimitada. Atacante inicia con balón en un extremo."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Debe conducir hasta la línea opuesta sin perder la pelota."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "Defensor debe robarle o forzarlo fuera de la zona."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "30-45 segundos por duelo. Rotar. Ganador: quien más veces logre el objetivo."
      }
    ],
    "explicacion_breve": "En una zona delimitada, el atacante conduce hasta la línea opuesta mientras el defensor intenta robarle o forzarlo fuera.",
    "leyenda": "A: atacante · D: defensor · Balón: balón · Recuadro gris: zona · Flecha roja: conducción"
  },
  "detalle": {
    "objetivos": [
      "Trabajar la técnica pura del robo sin la presión del arco."
    ],
    "claves_entrenador": [
      "Nunca 'ir al balón'. Primero acompañar al atacante, esperar el momento — el balón viene solo."
    ],
    "montaje": [
      "Zona delimitada. Atacante inicia con balón en un extremo."
    ],
    "desarrollo": [
      "Zona delimitada. Atacante inicia con balón en un extremo.",
      "Debe conducir hasta la línea opuesta sin perder la pelota.",
      "Defensor debe robarle o forzarlo fuera de la zona.",
      "30-45 segundos por duelo. Rotar. Ganador: quien más veces logre el objetivo."
    ],
    "que_buscamos": [
      "Defensa",
      "1v1",
      "Robo"
    ],
    "que_observar": [
      "Acompañamiento del atacante.",
      "Momento del robo.",
      "Control de la zona."
    ],
    "correcciones": [
      "No ir al balón directamente.",
      "Acompañar y esperar el momento."
    ],
    "reglas": [
      "Conducir hasta la línea opuesta.",
      "Robar o forzar fuera de la zona.",
      "30-45 segundos por duelo."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Añadir tiempo límite (10 segundos para robar). Aumenta la agresividad."
    ],
    "variantes": [
      "Fútbol 7: 2 por pareja. · 12-15 min.",
      "Fútbol 11: 2 por pareja. · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 103",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-10+.",
        "Intensidad: alta.",
        "Espacio: 10 x 6 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-103-1V1-DEFENSIVO-RECUPERAR-BALON-SIN-GOL/CampoBase_1v1_Defensivo_Recuperar_Balon_Sin_Gol.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-103-1V1-DEFENSIVO-RECUPERAR-BALON-SIN-GOL/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-104-1V1-DEFENSIVO-CON-PORTERIA",
  "nombre": "1v1 defensivo con portería",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "que_se_trabaja": [
      "Defensa",
      "1v1",
      "Cierre"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (atacante, defensor, portero)"
    },
    "material": "1 balón + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "Atacante inicia con balón a 25m del arco."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "Defensor arranca desde el punto de penalti para llegar cerca del atacante."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El defensor debe evitar que el atacante remate o gol."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "8-10 duelos. Rotar roles."
      }
    ],
    "explicacion_breve": "El defensor debe evitar que el atacante remate o marque gol, cerrando el ángulo de tiro.",
    "leyenda": "A: atacante · D: defensor · K: portero · Flecha roja: ataque · Flecha discontinua: cierre"
  },
  "detalle": {
    "objetivos": [
      "Defender un ataque real de 1v1 con arco propio detrás."
    ],
    "claves_entrenador": [
      "Nunca lanzarse al piso salvo último recurso. Un slide fallido = el atacante gana metros."
    ],
    "montaje": [
      "Atacante inicia con balón a 25m del arco."
    ],
    "desarrollo": [
      "Atacante inicia con balón a 25m del arco.",
      "Defensor arranca desde el punto de penalti para llegar cerca del atacante.",
      "El defensor debe evitar que el atacante remate o gol.",
      "8-10 duelos. Rotar roles."
    ],
    "que_buscamos": [
      "Defensa",
      "1v1",
      "Cierre"
    ],
    "que_observar": [
      "Cierre del ángulo de tiro.",
      "Posición del defensor.",
      "Momento del robo."
    ],
    "correcciones": [
      "No lanzarse al piso salvo último recurso.",
      "Cerrar el ángulo de tiro."
    ],
    "reglas": [
      "Evitar el remate o gol.",
      "8-10 duelos.",
      "Rotar roles."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Iniciar el defensor desde MÁS lejos, dando ventaja al atacante."
    ],
    "variantes": [
      "Fútbol 7: 3 (atacante, defensor, portero). · 12-15 min.",
      "Fútbol 11: 3 (atacante, defensor, portero). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 104",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 25 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-104-1V1-DEFENSIVO-CON-PORTERIA/CampoBase_1v1_Defensivo_Con_Porteria.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-104-1V1-DEFENSIVO-CON-PORTERIA/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
{
  "id": "CAMPOBASE-PACK150-105-1V2-DEFENSOR-SOLITARIO-CONTRA-2-ATACANTES",
  "nombre": "1v2 defensor solitario contra 2 atacantes",
  "estado": "validado",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "que_se_trabaja": [
      "Defensa",
      "Inferioridad",
      "Retraso"
    ],
    "tiempo_estimado_15": "12-15 min",
    "jugadores": {
      "total": 3,
      "organizacion": "3 (2 atacantes + 1 defensor + opcional portero)"
    },
    "material": "1 balón + 1 portería",
    "series": [
      {
        "nombre": "Paso 1",
        "instruccion": "2 atacantes salen desde la mitad del campo con balón."
      },
      {
        "nombre": "Paso 2",
        "instruccion": "1 defensor solitario debe evitar el gol."
      },
      {
        "nombre": "Paso 3",
        "instruccion": "El objetivo del defensor NO es robar — es RETRASAR y forzar mal pase."
      },
      {
        "nombre": "Paso 4",
        "instruccion": "6-8 rondas. Rotar."
      }
    ],
    "explicacion_breve": "Un defensor solitario debe retrasar el avance de dos atacantes y forzar un mal pase en lugar de intentar robar.",
    "leyenda": "A1/A2: atacantes · D: defensor · K: portero · Flecha roja: conducción · Flecha azul: pase · Flecha discontinua: desmarque"
  },
  "detalle": {
    "objetivos": [
      "Aprender a retrasar y forzar decisiones cuando hay inferioridad numérica."
    ],
    "claves_entrenador": [
      "En 1v2 nunca vas al balón. Cubrís la línea de pase, obligás a que jueguen incómodos."
    ],
    "montaje": [
      "2 atacantes salen desde la mitad del campo con balón."
    ],
    "desarrollo": [
      "2 atacantes salen desde la mitad del campo con balón.",
      "1 defensor solitario debe evitar el gol.",
      "El objetivo del defensor NO es robar — es RETRASAR y forzar mal pase.",
      "6-8 rondas. Rotar."
    ],
    "que_buscamos": [
      "Defensa",
      "Inferioridad",
      "Retraso"
    ],
    "que_observar": [
      "Cobertura de la línea de pase.",
      "Retraso del avance.",
      "Toma de decisión del atacante."
    ],
    "correcciones": [
      "No ir al balón.",
      "Cubrir la línea de pase."
    ],
    "reglas": [
      "Retrasar el avance.",
      "Forzar mal pase.",
      "6-8 rondas y rotar."
    ],
    "si_sale_mal": [
      "Reducir repeticiones o tiempo.",
      "Priorizar una ejecución técnica y controlada."
    ],
    "si_sale_bien": [
      "Aumentar a 1v3 (defensor muy en inferioridad) para trabajo mental extremo."
    ],
    "variantes": [
      "Fútbol 7: 3 (2 atacantes + 1 defensor + opcional portero). · 12-15 min.",
      "Fútbol 11: 3 (2 atacantes + 1 defensor + opcional portero). · 12-15 min."
    ],
    "fuente": {
      "documento": "Pack150 Manual Completo — ejercicio 105",
      "adaptacion_operativa": true,
      "notas": [
        "Ejercicio con balón.",
        "Edad recomendada: Sub-12+.",
        "Intensidad: alta.",
        "Espacio: 20 x 15 m."
      ]
    }
  },
  "animacion": {
    "gif": "assets/ejercicios/CAMPOBASE-PACK150-105-1V2-DEFENSOR-SOLITARIO-CONTRA-2-ATACANTES/CampoBase_1v2_Defensor_Solitario_Contra_2_Atacantes.gif",
    "frames": "assets/ejercicios/CAMPOBASE-PACK150-105-1V2-DEFENSOR-SOLITARIO-CONTRA-2-ATACANTES/frames/f",
    "total": 60,
    "frameMs": 100
  }
},
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
    video: item.video || '',
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
