# Alcance del rediseño — CampoBase (OpenDesign)

Este documento define EXACTAMENTE qué puede y qué no puede cambiar el agente de diseño sobre esta copia de CampoBase.

## Versión de trabajo

Esta carpeta contiene **CampoBase 2.16.5**, la versión estable y publicada. Es una copia aislada para diseño; la versión real en producción no se toca desde aquí.

## Objetivo de esta fase — DISEÑAR LA FICHA DE EJERCICIO

Diseñar la **ficha visual de un ejercicio de fútbol** (la tarjeta que muestra un ejercicio completo), tomando como referencia la imagen que Migue ha aprobado (una ficha generada por ChatGPT). El objetivo es que la ficha se vea **clara, ordenada y profesional**, con:

- **Cabecera** con número y nombre del ejercicio, sobre una barra de color por categoría.
- **Barra de datos rápidos** con iconos: edad, jugadores, duración, intensidad, espacio, material.
- **Cuerpo en dos columnas** (en escritorio): izquierda con objetivos / qué se trabaja / montaje / desarrollo / reglas / variantes; derecha con el **diagrama táctico** arriba y el desarrollo paso a paso debajo.
- **Pie** con qué observar / errores / correcciones.
- **Leyenda** y **medidas** del diagrama.
- **Poco ruido visual**, prioridad a entender el ejercicio.

## Referencia visual

Migue tiene una imagen de referencia (ficha de ChatGPT) que es el modelo a seguir. El diseño debe parecerse a esa ficha en **estructura y claridad**, adaptado a los colores y tipografía de CampoBase.

## PROHIBIDO — no tocar bajo ningún concepto

- **Colores de marca de CampoBase**: el rojo `#c8102e`, el dorado `#ffd700`, el verde oscuro `#173f35`, el verde lima `#d8f06a`, el césped `#eef3ee` y el verde de diagrama `#285f42`/`#32754f` se mantienen. **Sí se permite** usar un código de color por categoría de ejercicio (verde, azul, naranja, etc.) SOLO en la cabecera de la ficha, como en la imagen de referencia — pero sin alterar los colores de marca del resto de la app.
- **Lógica y datos**: no tocar Supabase, IndexedDB, sincronización, PIN, permisos, plantilla, partidos, sesiones ni tácticas guardadas.
- **Funcionalidad 2.16.x**: no tocar la lógica de cambios, reparto, porteros, puntuación ni recordatorio.
- **Despliegue**: no tocar GitHub, credenciales, service worker ni producción.

## Qué SÍ puede tocar

- `styles.css` (libremente, para la ficha de ejercicio).
- El **HTML de la ficha de ejercicio** en `js/app.js` (función `exerciseCardHTML`), SOLO la maquetación/estructura de esa tarjeta, sin tocar eventos, datos ni lógica. Antes de tocar `app.js`, debe proponerlo y esperar aprobación.

## Datos disponibles del ejercicio (para el diseño)

Cada ejercicio tiene estos campos (ver `docs/ejercicios/ESPECIFICACION_EJERCICIOS.md` y los JSON de ejemplo en `docs/ejercicios/`):

- `id`, `nombre`, `estado`
- `clasificacion` (categoría principal + subcategorías)
- `nivel`, `edad`, `jugadores`, `duracion`, `intensidad`, `espacio`, `material`
- `objetivos`, `que_se_trabaja`, `que_buscamos`
- `montaje`, `desarrollo` (paso a paso), `reglas`, `rotacion`
- `que_observar`, `errores_habituales`, `correcciones`
- `si_sale_mal`, `si_sale_bien`, `variantes`
- `diagramas` (campo en metros + elementos + acciones)

## Regla de trabajo

1. Primero presenta un **diagnóstico** y **propuestas concretas** (con un boceto o descripción clara de la ficha), sin modificar archivos.
2. Solo después de aprobación, aplica cambios limitados al alcance permitido.
3. Ante cualquier duda sobre si algo entra en el alcance, **no lo toques** y pregunta.
