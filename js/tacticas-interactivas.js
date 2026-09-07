// Tácticas del manual de Migue (Unión Viera Alevín D).
// Cada táctica es una ficha completa con bloques. La pizarra táctica personal
// de Migue es independiente del GIF: se abre plegada y no reproduce los
// movimientos de la animación.
// Estructura: { id, nombre, formacion, organizacion, principio, framesManifest,
//   team?, bloques[] }
// Cada bloque: { id, orden, nombre_corto, titulo, objetivo, idea_clave,
//   decisiones[], que_vigilar[], consignas[], errores[], animacion, fuente }
// `framesManifest` apunta al manifiesto de duraciones de esa táctica (módulo
// tactica-XXXX-frames.js). `team` (opcional) permite una numeración de dorsales
// distinta de la canónica de tactics.js para que la pizarra coincida con el GIF.

import { TACTICA_1231_FRAMES } from './tactica-1231-frames.js';
import { TACTICA_1213_FRAMES } from './tactica-1213-frames.js';

export const TACTICAS_INTERACTIVAS = Object.freeze([
{
  "id": "CAMPOBASE-TACTICA-1231-GUIA-COMPLETA",
  "nombre": "Sistema 1-2-3-1",
  "formacion": "1-2-3-1",
  "organizacion": "1 portero · 2 defensas · 3 medios · 1 delantero",
  "principio": "Provocar una decisión rival y reconocer qué compañero o espacio queda libre.",
  "framesManifest": TACTICA_1231_FRAMES,
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
},
{
  "id": "CAMPOBASE-TACTICA-1213-GUIA-COMPLETA",
  "nombre": "Sistema 1-2-1-3",
  "formacion": "1-2-1-3",
  "organizacion": "1 portero · 2 defensas · 1 medio · 3 delanteros",
  "principio": "El sistema se interpreta por funciones, no por posiciones rígidas: cada movimiento exige una compensación colectiva.",
  "framesManifest": TACTICA_1213_FRAMES,
  "team": [
    { "x": 50, "y": 90, "n": "1", "pos": "Portero" },
    { "x": 30, "y": 76, "n": "4", "pos": "Defensa izq." },
    { "x": 70, "y": 76, "n": "5", "pos": "Defensa der." },
    { "x": 50, "y": 58, "n": "6", "pos": "Mediocentro" },
    { "x": 25, "y": 34, "n": "8", "pos": "Delantero izq." },
    { "x": 50, "y": 30, "n": "9", "pos": "Delantero centro" },
    { "x": 75, "y": 34, "n": "10", "pos": "Delantero der." }
  ],
  "bloques": [
    {
      "id": "bloque-1-funciones",
      "orden": 1,
      "nombre_corto": "Funciones",
      "titulo": "Posicionamiento, variantes y funciones",
      "objetivo": "Comprender la estructura base 1-2-1-3 y las dobles funciones según balón, compañero y espacio.",
      "idea_clave": "Si un jugador abre, otro protege u ocupa el espacio interior.",
      "decisiones": [
        "8 y 10 se abren como carrileros o se meten por dentro como mediapuntas.",
        "Si 8/10 están por dentro, 4 y 5 dan amplitud.",
        "Si un central se proyecta, los demás compensan.",
        "6 baja y equilibra cuando un defensor sale o aparece una pérdida."
      ],
      "que_vigilar": [
        "Equilibrio cuando 8/10 se abren o se meten por dentro.",
        "Amplitud desde 4/5 cuando 8/10 están por dentro.",
        "Lectura del 6 para sostener o bajar."
      ],
      "consignas": ["Uno abre, otro cubre", "Seis sostiene", "Cuatro y cinco dan amplitud"],
      "errores": [
        "Enseñar el sistema como posiciones inmóviles.",
        "Abrir sin proteger el espacio interior.",
        "Salir 4/5 sin que 6 lea cuándo sostener o bajar."
      ],
      "animacion": {
        "frames": "assets/tacticas/CAMPOBASE-TACTICA-1213-GUIA-COMPLETA/bloque-1/frames/f",
        "total": 196
      },
      "fuente": { "documento": "Táctica 1-2-1-3 · Bloque 1 (Posicionamiento y funciones)", "seccion": "Posicionamiento, variantes y funciones" }
    },
    {
      "id": "bloque-2-defensa",
      "orden": 2,
      "nombre_corto": "Defensa",
      "titulo": "Comportamiento defensivo",
      "objetivo": "Proteger el carril central, bascular juntos y defender el área con superioridad.",
      "idea_clave": "Centro antes que banda; balón fuera, bloque junto.",
      "decisiones": [
        "Orientar al rival hacia banda y tapar el carril central.",
        "Temporizar el 1 contra 1 y esperar ayudas.",
        "En bloque bajo, cerrar el área con línea de 5."
      ],
      "que_vigilar": [
        "Basculación colectiva al lado del balón.",
        "Ayudas y defensa del centro.",
        "8 y 10 también defienden."
      ],
      "consignas": ["Centro antes que banda", "Balón fuera, bloque junto", "Temporiza antes de entrar"],
      "errores": [
        "Perseguir al rival y dejar el centro abierto.",
        "Entrar al 1 contra 1 sin esperar ayudas.",
        "No replegar a línea de 5 cuando el rival hunde."
      ],
      "animacion": {
        "frames": "assets/tacticas/CAMPOBASE-TACTICA-1213-GUIA-COMPLETA/bloque-2/frames/f",
        "total": 196
      },
      "fuente": { "documento": "Táctica 1-2-1-3 · Bloque 2 (Comportamiento defensivo)", "seccion": "Comportamiento defensivo" }
    },
    {
      "id": "bloque-3-salida",
      "orden": 3,
      "nombre_corto": "Salida",
      "titulo": "Salida de balón",
      "objetivo": "Salir en corto y en largo usando la amplitud de 8 y 10 para estirar al rival.",
      "idea_clave": "Abrir, fijar y encontrar al libre.",
      "decisiones": [
        "Fijar al rival por fuera y usar la amplitud de 8 y 10.",
        "4 recibe y conduce; si saltan a 4, aparece 6.",
        "Si saltan a 6, cambio al lado libre con 5.",
        "Alternativa de juego largo con 9, 8 y 10 preparados para la caída."
      ],
      "que_vigilar": [
        "8 y 10 realmente abiertos y altos.",
        "6 visible como apoyo central.",
        "El poseedor fija antes de soltar."
      ],
      "consignas": ["Abre, fija y encuentra al libre", "Cuatro conduce", "Seis, apoyo central"],
      "errores": [
        "Pasar sin fijar al rival.",
        "No usar la amplitud de 8 y 10.",
        "Jugar largo sin preparar la caída y la segunda jugada."
      ],
      "animacion": {
        "frames": "assets/tacticas/CAMPOBASE-TACTICA-1213-GUIA-COMPLETA/bloque-3/frames/f",
        "total": 196
      },
      "fuente": { "documento": "Táctica 1-2-1-3 · Bloque 3 (Salida de balón)", "seccion": "Salida de balón" }
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
