// Tácticas interactivas del manual de Migue (Unión Viera Alevín D).
// Cada táctica se asocia a una formación existente (formacion) y añade un GIF
// animado con sus fases/variantes. La pizarra táctica actual NO se modifica.
// Estructura: { id, nombre, formacion, vista_rapida, detalle, animacion }

export const TACTICAS_INTERACTIVAS = Object.freeze([
{
  "id": "CAMPOBASE-TACTICA-01-1-3-2-1",
  "nombre": "Sistema base 1-3-2-1",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "sistema": "1-3-2-1",
    "que_se_trabaja": [
      "Estructura base",
      "Amplitud",
      "Profundidad",
      "Incorporación del 4",
      "Reacción tras pérdida"
    ],
    "jugadores": {
      "total": 7,
      "organizacion": "1 portero · 3 defensas (3-4-2) · 2 medios (11-7) · 1 delantero (9)"
    },
    "series": [
      {
        "nombre": "Base",
        "instruccion": "Tres por detrás del balón, dos medios y un delantero."
      },
      {
        "nombre": "Con balón",
        "instruccion": "2 y 3 dan amplitud; 7 y 11 ofrecen líneas; 9 mantiene profundidad."
      },
      {
        "nombre": "4 sube",
        "instruccion": "4 se incorpora al mediocampo cuando 2 y 3 mantienen equilibrio."
      },
      {
        "nombre": "Pérdida",
        "instruccion": "4 recupera la zona central entre 3 y 2."
      }
    ],
    "leyenda": "Rojo Unión Viera · Azul rival · Verde portero · Negro pase · Rojo discontinuo movimiento"
  },
  "detalle": {
    "que_busco": [
      "Seguridad sin bloque estático.",
      "Posiciones como referencias iniciales."
    ],
    "con_balon": [
      "2 y 3 amplitud.",
      "7 y 11 líneas por fuera y por dentro.",
      "9 profundidad.",
      "4 puede incorporarse con equilibrio detrás."
    ],
    "al_perder": [
      "4 vuelve entre 3 y 2."
    ],
    "fuente": {
      "documento": "Dia_de_Partido_y_Tacticas_Union_Viera_Alevin_D_COMPACTO_V3(1).pdf",
      "seccion": "Sistema base 1-3-2-1",
      "adaptacion_operativa": true,
      "notas": [
        "Pases representativos, no secuencia obligatoria."
      ]
    }
  },
  "formacion": "1-3-2-1",
  "animacion": {
    "gif": "assets/tacticas/CAMPOBASE-TACTICA-01-1-3-2-1/CampoBase_Tactica_01_Sistema_Base_1-3-2-1.gif",
    "frames": "assets/tacticas/CAMPOBASE-TACTICA-01-1-3-2-1/frames/f",
    "total": 40,
    "frameMs": 390
  }
},
{
  "id": "CAMPOBASE-TACTICA-02-EL-4",
  "nombre": "El 4 · pieza central del sistema",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "sistema": "Rol del 4 en 1-3-2-1",
    "que_se_trabaja": [
      "Protección central",
      "Cobertura",
      "Incorporación",
      "Repliegue"
    ],
    "series": [
      {
        "nombre": "Defensa",
        "instruccion": "4 entre 3 y 2; protege primero el centro."
      },
      {
        "nombre": "Banda",
        "instruccion": "Si lateral sale, 4 corrige por dentro y cubre."
      },
      {
        "nombre": "Ataque",
        "instruccion": "4 se incorpora; 2 y 3 mantienen equilibrio."
      },
      {
        "nombre": "Pérdida",
        "instruccion": "4 vuelve entre 3 y 2."
      }
    ],
    "leyenda": "Amarillo: zona principal del 4"
  },
  "detalle": {
    "en_defensa": [
      "Entre 3 y 2.",
      "Protege centro.",
      "Cubre por dentro.",
      "No persigue por todo el campo."
    ],
    "en_ataque": [
      "Puede incorporarse al mediocampo.",
      "2 y 3 equilibran detrás."
    ],
    "al_perder": [
      "Recupera la zona central."
    ],
    "fuente": {
      "documento": "Dia_de_Partido_y_Tacticas_Union_Viera_Alevin_D_COMPACTO_V3(1).pdf",
      "seccion": "El 4 · pieza central",
      "adaptacion_operativa": false
    }
  },
  "formacion": "1-3-2-1",
  "animacion": {
    "gif": "assets/tacticas/CAMPOBASE-TACTICA-02-EL-4/CampoBase_Tactica_02_El_4_Pieza_Central.gif",
    "frames": "assets/tacticas/CAMPOBASE-TACTICA-02-EL-4/frames/f",
    "total": 29,
    "frameMs": 538
  }
},
{
  "id": "CAMPOBASE-TACTICA-03-1-2-3-1",
  "nombre": "Variante 1 · 1-2-3-1",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "sistema": "1-2-3-1",
    "que_se_trabaja": [
      "Presencia estable en medio",
      "Apoyos",
      "Amplitud 7/11",
      "Protección central del 4"
    ],
    "series": [
      {
        "nombre": "Posición",
        "instruccion": "2 defensas, 11-4-7 en mediocampo y 9 arriba."
      },
      {
        "nombre": "Salida",
        "instruccion": "4 actúa como mediocentro claro y da apoyo para circular."
      },
      {
        "nombre": "Ataque",
        "instruccion": "7 y 11 dan amplitud; 4 no abandona la referencia central."
      },
      {
        "nombre": "Pérdida",
        "instruccion": "4 protege el centro; 2 y 3 no quedan demasiado separados."
      }
    ],
    "leyenda": "Amarillo: referencia central del 4"
  },
  "detalle": {
    "cuando_usarla": [
      "Cuando necesito más presencia estable en mediocampo y puedo asumir jugar con dos defensas."
    ],
    "que_gano": [
      "Tres referencias en mediocampo.",
      "Más apoyos.",
      "7 y 11 pueden dar amplitud sin dejar solo al 4."
    ],
    "que_vigilar": [
      "2 y 3 no demasiado separados.",
      "4 no demasiado arriba.",
      "Tras pérdida 4 protege el centro."
    ],
    "fuente": {
      "documento": "Dia_de_Partido_y_Tacticas_Union_Viera_Alevin_D_COMPACTO_V3(1).pdf",
      "seccion": "Variante 1 · 1-2-3-1",
      "adaptacion_operativa": true
    }
  },
  "formacion": "1-2-3-1",
  "animacion": {
    "gif": "assets/tacticas/CAMPOBASE-TACTICA-03-1-2-3-1/CampoBase_Tactica_03_Variante_1-2-3-1.gif",
    "frames": "assets/tacticas/CAMPOBASE-TACTICA-03-1-2-3-1/frames/f",
    "total": 35,
    "frameMs": 446
  }
},
{
  "id": "CAMPOBASE-TACTICA-04-1-2-2-2",
  "nombre": "Variante 2 · 1-2-2-2",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "sistema": "1-2-2-2",
    "que_se_trabaja": [
      "Más presencia arriba",
      "Pareja ofensiva",
      "Equilibrio de los medios"
    ],
    "series": [
      {
        "nombre": "Posición",
        "instruccion": "3-2 atrás, 4-7 en medio, 11-9 arriba."
      },
      {
        "nombre": "4 avanza",
        "instruccion": "Si 4 avanza, 7 mantiene equilibrio."
      },
      {
        "nombre": "7 avanza",
        "instruccion": "Si 7 avanza, 4 mantiene equilibrio."
      },
      {
        "nombre": "Equilibrio",
        "instruccion": "Los dos medios no suben claramente a la vez."
      }
    ],
    "leyenda": "Amarillo: zona del medio que conserva equilibrio"
  },
  "detalle": {
    "cuando_usarla": [
      "Más presencia arriba.",
      "9 aislado.",
      "Rival muy atrás."
    ],
    "regla_equilibrio": [
      "Si un medio avanza, el otro mantiene equilibrio.",
      "Si ambos suben, el equipo queda abierto por dentro."
    ],
    "fuente": {
      "documento": "Dia_de_Partido_y_Tacticas_Union_Viera_Alevin_D_COMPACTO_V3(1).pdf",
      "seccion": "Variante 2 · 1-2-2-2",
      "adaptacion_operativa": true
    }
  },
  "formacion": "1-2-2-2",
  "animacion": {
    "gif": "assets/tacticas/CAMPOBASE-TACTICA-04-1-2-2-2/CampoBase_Tactica_04_Variante_1-2-2-2.gif",
    "frames": "assets/tacticas/CAMPOBASE-TACTICA-04-1-2-2-2/frames/f",
    "total": 24,
    "frameMs": 650
  }
},
{
  "id": "CAMPOBASE-TACTICA-05-DEFENSA-BANDA",
  "nombre": "Defender ataque rival por banda",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "sistema": "Ajuste defensivo en 1-3-2-1",
    "que_se_trabaja": [
      "Salida del defensor del lado",
      "Cobertura del 4",
      "Cierre del defensor contrario",
      "Ayuda del medio de banda"
    ],
    "series": [
      {
        "nombre": "Inicio",
        "instruccion": "Rival progresa por banda."
      },
      {
        "nombre": "Defensor sale",
        "instruccion": "El defensor del lado sale al rival."
      },
      {
        "nombre": "4 cubre",
        "instruccion": "El 4 corrige por dentro y cubre el espacio."
      },
      {
        "nombre": "Cierre",
        "instruccion": "El defensor del lado contrario se cierra y el medio de banda ayuda."
      }
    ],
    "leyenda": "Ejemplo por izquierda; misma lógica reflejada en derecha."
  },
  "detalle": {
    "principios": [
      "Defensor del lado sale.",
      "4 cubre por dentro.",
      "Defensor contrario se cierra.",
      "Medio de banda ayuda.",
      "No saltan dos o tres al mismo rival."
    ],
    "fuente": {
      "documento": "Dia_de_Partido_y_Tacticas_Union_Viera_Alevin_D_COMPACTO_V3(1).pdf",
      "seccion": "Ataque rival por banda",
      "adaptacion_operativa": true,
      "notas": [
        "Ejemplo visual por banda izquierda; comportamiento simétrico por derecha."
      ]
    }
  },
  "formacion": "1-3-2-1",
  "animacion": {
    "gif": "assets/tacticas/CAMPOBASE-TACTICA-05-DEFENSA-BANDA/CampoBase_Tactica_05_Defender_Ataque_Rival_Banda.gif",
    "frames": "assets/tacticas/CAMPOBASE-TACTICA-05-DEFENSA-BANDA/frames/f",
    "total": 24,
    "frameMs": 633
  }
},
{
  "id": "CAMPOBASE-TACTICA-06-DEFENSA-CENTRO",
  "nombre": "Defender ataque rival por el centro",
  "estado": "propuesta",
  "enumerar_ejercicios": false,
  "vista_rapida": {
    "tipo_principal": "Táctica",
    "sistema": "Ajuste defensivo en 1-3-2-1",
    "que_se_trabaja": [
      "Protección central",
      "Escalonamiento 2-3",
      "Ayuda interior 7-11"
    ],
    "series": [
      {
        "nombre": "Inicio",
        "instruccion": "Rival progresa por el centro."
      },
      {
        "nombre": "4 protege",
        "instruccion": "4 protege primero la zona central."
      },
      {
        "nombre": "2-3 escalonan",
        "instruccion": "2 y 3 no saltan los dos al mismo tiempo."
      },
      {
        "nombre": "7-11 cierran",
        "instruccion": "7 y 11 se cierran unos metros para ayudar."
      }
    ],
    "leyenda": "Amarillo: zona prioritaria que protege el 4"
  },
  "detalle": {
    "principios": [
      "4 protege primero el centro.",
      "2 y 3 no saltan los dos a la vez.",
      "7 y 11 se cierran unos metros."
    ],
    "fuente": {
      "documento": "Dia_de_Partido_y_Tacticas_Union_Viera_Alevin_D_COMPACTO_V3(1).pdf",
      "seccion": "Ataque rival por el centro",
      "adaptacion_operativa": true,
      "notas": [
        "Se muestra 3 saliendo y 2 guardando como ejemplo; puede reflejarse según la jugada."
      ]
    }
  },
  "formacion": "1-3-2-1",
  "animacion": {
    "gif": "assets/tacticas/CAMPOBASE-TACTICA-06-DEFENSA-CENTRO/CampoBase_Tactica_06_Defender_Ataque_Rival_Centro.gif",
    "frames": "assets/tacticas/CAMPOBASE-TACTICA-06-DEFENSA-CENTRO/frames/f",
    "total": 24,
    "frameMs": 633
  }
}
]);

export function findTacticaInteractiva(id) {
  return TACTICAS_INTERACTIVAS.find((t) => t.id === id);
}

// Tácticas interactivas asociadas a una formación concreta.
export function tacticasDeFormacion(formacion) {
  return TACTICAS_INTERACTIVAS.filter((t) => t.formacion === formacion);
}
