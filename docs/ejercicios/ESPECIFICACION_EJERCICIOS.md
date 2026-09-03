# Especificación de la biblioteca de ejercicios — CampoBase

> **Fuente de verdad:** este documento define cómo se representan los ejercicios de fútbol en CampoBase. Fue acordado con Migue a partir de la propuesta de ChatGPT (2026-09-03) y es el estándar canónico.
>
> **Principio rector:** el ejercicio es el **dato** (JSON). La pizarra, la ficha visual, el PDF o cualquier animación se **renderizan a partir de esos datos**. Nunca al revés.

---

## 1. Reglas obligatorias para generar la biblioteca

### 1.1 El JSON es la fuente de verdad
No se genera primero una imagen y luego se describe. Primero se crea el ejercicio completo como datos estructurados. La pizarra, la ficha visual, el PDF o cualquier animación se renderizan a partir de esos mismos datos.

### 1.2 No inventar datos de la fuente
Cuando un ejercicio proceda de un PDF, libro, web o documento:
- se conserva el concepto original;
- se registra siempre la fuente;
- no se inventan duración, espacio, jugadores, reglas o material que no aparezcan.

Si falta un dato imprescindible, se puede proponer, pero marcándolo expresamente como `"adaptacion_propia": true`.

### 1.3 Diferenciar original y adaptado
Cada ejercicio debe incluir un bloque `origen`:

```json
"origen": {
  "tipo": "fuente | adaptacion | propio",
  "fuente": "...",
  "ejercicio_original": "...",
  "pagina": "...",
  "url": "...",
  "adaptado_a": "Alevin 10-11 F7",
  "notas_adaptacion": "..."
}
```

Nunca se presenta una adaptación como si fuese el ejercicio original.

### 1.4 Contexto principal
Los ejercicios adaptados para Migue priorizan:
- Alevín 10-11 años
- Fútbol 7
- Entrenamientos de 60 minutos
- Desarrollo técnico y toma de decisiones
- Mucho balón, poca espera
- Explicaciones sencillas
- Evitar cargas físicas propias de adolescentes o adultos

### 1.5 Clasificación obligatoria
Cada ejercicio tiene **UNA categoría principal**:

`Calentamiento / activación`, `Tecnificación`, `Técnico-táctico`, `Táctica`, `Coordinación / motricidad`, `Posesión`, `Juego reducido`, `Finalización`, `Transición`, `Porteros`, `Físico integrado con balón`.

Y **etiquetas secundarias** (contenido trabajado):

`Pase`, `Control`, `Control orientado`, `Conducción`, `Regate`, `1x1`, `2x1`, `2x2`, `Presión`, `Cobertura`, `Apoyo`, `Desmarque`, `Finalización`, `Cambio de orientación`, `Transición`, `Repliegue`, `Salida de balón`, etc.

**No confundir categoría principal con contenido trabajado.**

### 1.6 Aptitud por edad
Añadir siempre:

```json
"apto_alevin_10_11": {
  "estado": "si | con_adaptacion | no",
  "motivo": "..."
}
```

Un ejercicio pensado para SUB14+ no pasa automáticamente a Alevín.

### 1.7 Montaje sin ambigüedades
El montaje debe permitir que un entrenador nuevo prepare el ejercicio sin consultar otra fuente. Debe indicar: dimensiones, distancias entre conos, ubicación de porterías, posición inicial de cada jugador, quién comienza con balón, número de filas, número de grupos, material exacto.

Evitar frases como "colocar los jugadores como en el gráfico". El texto debe ser autosuficiente.

### 1.8 Desarrollo paso a paso
Describir siempre con etiquetas: `Jugador A`, `Jugador B`, `Jugador C`, `Defensor D1`, `Defensor D2`, `Portero P`, `Comodín C1`.

Ejemplo:
1. Jugador A pasa a Jugador B.
2. Jugador A realiza un desmarque hacia el cono 3.
3. Jugador B controla orientado.
4. Jugador B devuelve el balón a Jugador A.
5. Jugador A finaliza.

No usar frases vagas ("se realiza la acción", "los jugadores se mueven", "se continúa el ejercicio").

### 1.9 Rotación obligatoria
Siempre que haya posiciones diferentes, explicar quién pasa a cada posición (ej. `A → B`, `B → C`, `C → fila de A`). Si no existe rotación: `"rotacion": "no aplica"`.

### 1.10 Diagramas basados en coordenadas
El campo se representa en **metros**. Origen: `x=0, y=0` = esquina inferior izquierda. Nunca guardar posiciones únicamente en píxeles.

Cada elemento debe tener: `id`, `tipo`, posición `x/y`, `etiqueta`, y `rol` cuando corresponda.

### 1.11 Elementos permitidos en la pizarra
`jugador`, `defensor`, `comodin`, `portero`, `balon`, `cono`, `pica`, `aro`, `escalera`, `miniporteria`, `porteria`, `zona`, `linea`, `texto`.

### 1.12 Acciones permitidas
`pase`, `conduccion`, `movimiento`, `aceleracion`, `disparo`, `centro`, `presion`, `cobertura`.

Cada acción debe tener: `origen`, `destino`, `orden`, `tipo de trayectoria`.

### 1.13 Coherencia automática
Antes de guardar un ejercicio, comprobar:
- Si material dice 8 conos → el gráfico debe contener 8 conos.
- Si hay 6 jugadores → deben aparecer 6, o explicar por qué solo se representa una parte.
- Si A tiene el balón → el balón debe estar junto a A.
- Si el paso 1 dice "A pasa a B" → debe existir una flecha de pase A→B.
- Si el texto dice 20×10 m → el campo debe representar 20×10 m.
- Si existe rotación → debe aparecer en texto o en un gráfico específico.

Si hay contradicción, **no generar la ficha** hasta corregirla.

### 1.14 Varios gráficos cuando sea necesario
No meter todo en una única pizarra. Usar `Gráfico 1 — Montaje inicial`, `Gráfico 2 — Desarrollo`, `Gráfico 3 — Rotación` cuando ayude a entender la tarea.

### 1.15 Claridad por encima de estética
El diseño visual aprobado usa: fondo blanco, campo verde, títulos azules, información por bloques, iconos claros, flechas diferenciadas, leyenda, medidas, poco ruido visual. La prioridad es **entender el ejercicio**. No añadir elementos decorativos que puedan confundirse con elementos del ejercicio.

### 1.16 Contenido de la ficha visual (mínimo)
Número de ejercicio, nombre, tipo principal, etiquetas, nivel, edad, jugadores, duración, intensidad, espacio, material, objetivos, qué se trabaja, montaje paso a paso, desarrollo paso a paso, reglas, variantes, qué buscamos, qué debo observar, errores habituales, correcciones breves, si sale mal, si sale bien, leyenda, pizarra/s, fuente.

### 1.17 Correcciones para niños
Las correcciones desde el campo deben ser cortas: "Balón cerca", "Mira antes", "Abre", "Apoya", "Uno sale", "Otro cubre", "Vuelve", "Pasa y muévete".

Separar: **explicación para el entrenador** y **frase corta que usará con el jugador**.

### 1.18 No duplicar ejercicios
Antes de crear un ejercicio nuevo, comprobar si ya existe otro con la misma estructura y objetivo. Si solo cambia una regla pequeña, guardarlo como **variante**, no como ejercicio distinto.

### 1.19 Identificador único
IDs consistentes: `TEC-CON-001`, `TEC-PAS-001`, `POSE-RON-001`, `FIN-1V1-001`, `TAC-SAL-001`, `TRA-AD-001`, `COO-001`. Nunca reutilizar un ID.

### 1.20 Contenido validado = bloqueado
Si Migue marca una ficha como `"estado": "validado"`, no cambiar texto, posiciones, medidas, diagramas, clasificación, material ni desarrollo sin autorización explícita. Las nuevas versiones se guardan como revisión distinta, nunca sobrescribiendo silenciosamente la versión validada.

### 1.21 Validación lógica del recorrido (antes de dar por terminado)
Simular mentalmente la tarea paso a paso:
- ¿Dónde está cada jugador al principio?
- ¿Quién tiene el balón?
- ¿A quién pasa?
- ¿A dónde se desplaza?
- ¿Puede realizar físicamente esa acción desde esa posición?
- ¿Las flechas corresponden con el texto?
- ¿Dónde termina?
- ¿Cómo vuelve a empezar el ejercicio?
- ¿Quién rota con quién?

Si alguno de estos puntos no puede responderse sin interpretar o adivinar, el ejercicio todavía no está suficientemente explicado.

---

## 2. Sistema de coordenadas

```
ORIGEN = esquina inferior izquierda

(0,20) ───────────────── (10,20)
   │                         │
   │                         │
   │                         │
   │                         │
(0,0) ────────────────── (10,0)

x = ancho
y = largo
unidad = metros
```

El dibujo **no depende de píxeles**. Si la ficha mide 600 px o 2000 px, el ejercicio es el mismo.

---

## 3. Estructura de datos completa

### 3.1 Ejercicio (raíz)

```json
{
  "id": "TEC-CON-001",
  "nombre": "Conducción en zig-zag",
  "estado": "borrador | validado",

  "clasificacion": {
    "categoria_principal": "Tecnificación individual",
    "subcategorias": ["Conducción", "Control", "Cambio de dirección", "Coordinación"],
    "momento_juego": "Técnico aislado"
  },

  "nivel": "Principiante",

  "edad": {
    "min": 6,
    "max": 12,
    "recomendada": "Alevín 10-11",
    "apto_alevin": "si"
  },

  "apto_alevin_10_11": {
    "estado": "si | con_adaptacion | no",
    "motivo": "..."
  },

  "jugadores": {
    "min": 4,
    "max": 16,
    "por_grupo": 1,
    "numero_grupos": null
  },

  "duracion": {
    "total_min": 15,
    "total_max": 20,
    "series": null,
    "repeticiones": null,
    "descanso_seg": null
  },

  "intensidad": "Media",

  "espacio": { "ancho_m": 10, "largo_m": 20 },

  "material": [
    { "tipo": "cono", "cantidad": 8 },
    { "tipo": "balon", "cantidad": "1 por jugador" }
  ],

  "objetivos": ["..."],
  "que_se_trabaja": ["..."],
  "que_buscamos": "...",
  "montaje": ["..."],
  "desarrollo": [
    { "paso": 1, "texto": "..." },
    { "paso": 2, "texto": "..." }
  ],
  "reglas": ["..."],
  "rotacion": "A → B · B → C · C → fila de A | no aplica",
  "que_observar": ["..."],
  "errores_habituales": ["..."],
  "correcciones": ["..."],
  "si_sale_mal": ["..."],
  "si_sale_bien": ["..."],
  "variantes": ["..."],

  "origen": {
    "tipo": "fuente | adaptacion | propio",
    "fuente": "...",
    "ejercicio_original": "...",
    "pagina": "...",
    "url": "...",
    "adaptado_a": "Alevin 10-11 F7",
    "notas_adaptacion": "..."
  },

  "diagramas": []
}
```

### 3.2 Diagrama

```json
{
  "id": "montaje",
  "titulo": "Gráfico 1 · Montaje inicial",

  "campo": {
    "ancho_m": 10,
    "largo_m": 20,
    "orientacion": "vertical",
    "mostrar_medidas": true
  },

  "elementos": [ /* ver 3.3 */ ]
}
```

### 3.3 Elementos

**Jugador (atacante):**
```json
{ "id": "jugador_A", "tipo": "jugador", "etiqueta": "A", "rol": "poseedor", "equipo": "atacante", "posicion": { "x": 5.0, "y": 1.5 }, "orientacion_grados": 0 }
```

**Defensor:**
```json
{ "id": "defensor_1", "tipo": "jugador", "etiqueta": "D1", "rol": "defensor", "equipo": "defensor", "posicion": { "x": 5.0, "y": 11.0 }, "orientacion_grados": 180 }
```

**Comodín:**
```json
{ "id": "comodin_1", "tipo": "jugador", "etiqueta": "C", "rol": "comodin", "equipo": "neutral", "posicion": { "x": 2.0, "y": 10.0 } }
```

**Balón:**
```json
{ "id": "balon_1", "tipo": "balon", "poseedor": "jugador_A", "posicion": { "x": 5.25, "y": 1.7 } }
```

**Cono:**
```json
{ "id": "cono_1", "tipo": "cono", "posicion": { "x": 4, "y": 3.5 } }
```

**Texto:**
```json
{ "id": "salida", "tipo": "texto", "texto": "SALIDA", "posicion": { "x": 5, "y": 0.7 } }
```

### 3.4 Acciones (flechas)

**Pase:**
```json
{ "id": "accion_1", "tipo": "flecha", "accion": "pase", "origen": { "elemento": "jugador_A" }, "destino": { "elemento": "jugador_B" }, "trayectoria": "recta", "orden": 1 }
```

**Conducción (curva, con puntos):**
```json
{ "id": "accion_2", "tipo": "flecha", "accion": "conduccion", "origen": { "x": 5.0, "y": 1.5 }, "puntos": [ { "x": 5.0, "y": 1.5 }, { "x": 3.6, "y": 3.5 }, { "x": 6.4, "y": 5.5 } ], "trayectoria": "curva", "orden": 1 }
```

**Movimiento sin balón:**
```json
{ "id": "accion_3", "tipo": "flecha", "accion": "movimiento", "origen": { "elemento": "jugador_A" }, "destino": { "x": 7.0, "y": 12.0 }, "trayectoria": "recta", "orden": 2 }
```

**Disparo:**
```json
{ "id": "accion_4", "tipo": "flecha", "accion": "disparo", "origen": { "elemento": "jugador_A" }, "destino": { "elemento": "porteria_1" }, "trayectoria": "recta", "orden": 3 }
```

### 3.5 Vocabulario de tipos de acción

```json
{
  "tipos_accion": {
    "pase":        { "linea": "discontinua",     "punta": true },
    "conduccion":  { "linea": "ondulada",        "punta": true },
    "movimiento":  { "linea": "continua",        "punta": true },
    "aceleracion": { "linea": "continua_gruesa", "punta": true },
    "disparo":     { "linea": "continua_gruesa", "punta": true }
  }
}
```

### 3.6 Acciones con orden (para animación futura)

```json
{
  "acciones": [
    { "orden": 1, "accion": "pase", "desde": "A", "hasta": "B" },
    { "orden": 2, "accion": "movimiento", "desde": "A", "hasta": "A1" },
    { "orden": 3, "accion": "pase", "desde": "B", "hasta": "A1" }
  ]
}
```

Esto permite animar el ejercicio paso a paso en el futuro, porque se sabe que primero ocurre 1, después 2 y después 3.

---

## 4. Árbol de la biblioteca

```
EJERCICIO
│
├── Identificación
│   ├── id
│   ├── nombre
│   ├── categoría principal
│   ├── subcategorías
│   ├── nivel
│   └── edad
│
├── Organización
│   ├── jugadores
│   ├── grupos
│   ├── duración
│   ├── intensidad
│   ├── espacio
│   └── material
│
├── Contenido
│   ├── objetivos
│   ├── qué se trabaja
│   ├── qué buscamos
│   ├── montaje
│   ├── desarrollo paso a paso
│   ├── reglas
│   └── rotaciones
│
├── Entrenador
│   ├── qué observar
│   ├── errores habituales
│   ├── correcciones breves
│   ├── si sale mal
│   ├── si sale bien
│   └── variantes
│
├── Diagramas
│   ├── campo
│   ├── jugadores
│   ├── balones
│   ├── conos
│   ├── porterías
│   ├── zonas
│   ├── textos
│   └── acciones/flechas
│
└── Fuente
    ├── documento
    ├── ejercicio original
    ├── página
    ├── URL
    └── tipo de adaptación
```

---

## 5. Separación de capas (importante)

Guardar **dos capas diferentes**:

1. **`exercise_data`** — toda la lógica del ejercicio (texto, material, posiciones, flechas, clasificación).
2. **`visual_layout`** — la colocación concreta de bloques de la ficha visual.

Así se puede rediseñar la app mañana sin tocar ni reinterpretar los ejercicios.

---

## 6. Estado de adopción

- [x] Esquema acordado con Migue (2026-09-03).
- [ ] Mapeo al formato interno de CampoBase (`js/real-exercises.js`).
- [ ] Renderizador ampliado (porterías, zonas, textos, comodines, orientación, varios estados).
- [ ] Migración de ejercicios existentes (decisión: opción A — migrar todo).
- [ ] Importación de ejercicios nuevos desde PDFs (vía bot Visión).
- [ ] Diseño de la tarjeta visual (OpenDesign propone, PrograMARIO implementa).
