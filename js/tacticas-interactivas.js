// Tácticas del manual de Migue (Unión Viera Alevín D).
// Cada táctica es una ficha completa con bloques. La pizarra táctica personal
// de Migue es independiente del GIF: se abre plegada y no reproduce los
// movimientos de la animación.
// Estructura: { id, nombre, formacion, organizacion, principio, bloques[] }
// Cada bloque: { id, orden, nombre_corto, titulo, objetivo, idea_clave,
//   decisiones[], que_vigilar[], consignas[], errores[], animacion, fuente }

export const TACTICAS_INTERACTIVAS = Object.freeze([
{
  "id": "CAMPOBASE-TACTICA-1231-GUIA-COMPLETA",
  "nombre": "Sistema 1-2-3-1",
  "formacion": "1-2-3-1",
  "organizacion": "1 portero · 2 defensas · 3 medios · 1 delantero",
  "principio": "Provocar una decisión rival y reconocer qué compañero o espacio queda libre.",
  "bloques": [
    {
      "id": "bloque-1-funciones",
      "orden": 1,
      "nombre_corto": "Funciones",
      "titulo": "Posiciones, variantes y funciones",
      "objetivo": "Comprender cómo se transforma el 1-2-3-1 sin convertir las posiciones en lugares rígidos.",
      "idea_clave": "Si uno abandona su zona, otro ocupa o protege el espacio que deja.",
      "decisiones": [
        "Elegir exteriores como interiores o carrileros según el partido.",
        "Si un defensa sale a banda, el otro protege el centro.",
        "Si el 9 abandona el carril central, el 4 puede atacarlo."
      ],
      "que_vigilar": [
        "Equilibrio entre 3 y 2.",
        "Apoyos cercanos al 4.",
        "Amplitud real de 11 y 7."
      ],
      "consignas": ["Uno sale, otro cubre", "Cuatro, apoyo", "Nueve fija"],
      "errores": [
        "Posiciones estáticas.",
        "Dejar solo al 4.",
        "Moverse sin cubrir el espacio liberado."
      ],
      "animacion": {
        "frames": "assets/tacticas/CAMPOBASE-TACTICA-1231-GUIA-COMPLETA/bloque-1/frames/f",
        "total": 189
      },
      "fuente": { "documento": "Táctica 1-2-3-1 · Bloque 1 (Funciones)", "seccion": "Funciones" }
    },
    {
      "id": "bloque-2-salida",
      "orden": 2,
      "nombre_corto": "Salida",
      "titulo": "Salida de balón",
      "objetivo": "Superar la primera presión mediante superioridad, fijación y elección del jugador libre.",
      "idea_clave": "Poseedor → rival que salta → compañero que queda libre.",
      "decisiones": [
        "Portero, 3 y 2 generan el 3 contra 1.",
        "El defensa libre conduce hasta fijar.",
        "Si cierran fuera, usar al 9 de cara; si no conviene jugar corto, directo hacia banda."
      ],
      "que_vigilar": [
        "Distancias de la primera línea.",
        "Pase después de fijar.",
        "Segunda jugada protegida."
      ],
      "consignas": ["Defensa libre", "Conduce y fija", "Nueve, de cara", "Atrae y cambia"],
      "errores": [
        "Pasar demasiado pronto.",
        "Cerrar los dos exteriores.",
        "Jugar directo al centro sin equilibrio."
      ],
      "animacion": {
        "frames": "assets/tacticas/CAMPOBASE-TACTICA-1231-GUIA-COMPLETA/bloque-2/frames/f",
        "total": 196
      },
      "fuente": { "documento": "Táctica 1-2-3-1 · Bloque 2 (Salida de balón)", "seccion": "Salida de balón" }
    },
    {
      "id": "bloque-3-ataque",
      "orden": 3,
      "nombre_corto": "Ataque",
      "titulo": "Ataque organizado",
      "objetivo": "Crear ventajas cuando el balón ya está controlado en la zona media o alta.",
      "idea_clave": "Circular o conducir, provocar el salto y atacar inmediatamente el espacio liberado.",
      "decisiones": [
        "El defensa libre progresa.",
        "Si sale un central rival, el 9 rompe a su espalda.",
        "Si el 9 viene, 4, 7 u 11 atacan el carril que libera."
      ],
      "que_vigilar": [
        "Momento de la ruptura.",
        "Amplitud del lado contrario.",
        "Paciencia si el rival bascula bien."
      ],
      "consignas": ["Si sale, espalda", "Si cierran, fuera", "Nueve viene; otro rompe"],
      "errores": [
        "Romper antes del salto.",
        "Acercarse todos al balón.",
        "Forzar cuando el rival está bien colocado."
      ],
      "animacion": {
        "frames": "assets/tacticas/CAMPOBASE-TACTICA-1231-GUIA-COMPLETA/bloque-3/frames/f",
        "total": 196
      },
      "fuente": { "documento": "Táctica 1-2-3-1 · Bloque 3 (Ataque organizado)", "seccion": "Ataque organizado" }
    },
    {
      "id": "bloque-4-defensa",
      "orden": 4,
      "nombre_corto": "Defensa",
      "titulo": "Defensa organizada",
      "objetivo": "Orientar, bascular, cubrir y reorganizarse desde bloque alto hasta bloque bajo.",
      "idea_clave": "Balón rival → jugador que sale → compañero que cubre → equipo que bascula.",
      "decisiones": [
        "El 9 orienta la salida hacia banda.",
        "El exterior cercano presiona y el bloque achica.",
        "En bloque bajo, 11–3–2–7 forman la línea de cuatro y el 4 protege delante."
      ],
      "que_vigilar": [
        "Intensidad y dirección del 9.",
        "Cobertura interior.",
        "Retorno de los exteriores."
      ],
      "consignas": ["Orienta a banda", "Todos basculamos", "Centro cerrado", "Si no robamos, replegamos"],
      "errores": [
        "Presionar uno solo.",
        "Saltar dos al mismo rival.",
        "Mantener una presión cuando el bloque está roto."
      ],
      "animacion": {
        "frames": "assets/tacticas/CAMPOBASE-TACTICA-1231-GUIA-COMPLETA/bloque-4/frames/f",
        "total": 196
      },
      "fuente": { "documento": "Táctica 1-2-3-1 · Bloque 4 (Defensa)", "seccion": "Defensa organizada" }
    },
    {
      "id": "bloque-5-transicion",
      "orden": 5,
      "nombre_corto": "Transición",
      "titulo": "Transición defensa–ataque",
      "objetivo": "Atacar el desorden rival desde el instante anterior a la recuperación.",
      "idea_clave": "La contra empieza antes del robo, pero la primera acción después de recuperar debe asegurar el balón.",
      "decisiones": [
        "Antes del robo, 7 reconoce la banda libre y 9 prepara la diagonal.",
        "Quien recupera busca primero un pase seguro y cercano al 4.",
        "El 4 activa al jugador exterior; el 9 ofrece apoyo y después ataca profundidad."
      ],
      "que_vigilar": [
        "Preparación antes del robo.",
        "Primer pase seguro.",
        "Acelerar solo cuando aparece la ventaja."
      ],
      "consignas": ["Preparados antes", "Primero seguro", "Ahora acelera", "Apoyo y ruptura"],
      "errores": [
        "Salir todos antes de recuperar.",
        "Intentar el pase lejano desde el robo.",
        "Acelerar sin haber asegurado la posesión."
      ],
      "animacion": {
        "frames": "assets/tacticas/CAMPOBASE-TACTICA-1231-GUIA-COMPLETA/bloque-5/frames/f",
        "total": 196
      },
      "fuente": { "documento": "Táctica 1-2-3-1 · Bloque 5 (Transición)", "seccion": "Transición defensa–ataque" }
    }
  ]
}
]);

export function findTacticaInteractiva(id) {
  return TACTICAS_INTERACTIVAS.find((t) => t.id === id);
}

// Tácticas interactivas asociadas a una formación concreta.
export function tacticasDeFormacion(formacion) {
  return TACTICAS_INTERACTIVAS.filter((t) => t.formacion === formacion);
}
