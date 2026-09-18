# AGENTS.md — CampoBase

Este archivo contiene normas permanentes para cualquier agente que trabaje en este repositorio.

## 0. Lectura obligatoria antes de modificar CampoBase

Antes de tocar código, datos, Supabase, ejercicios, sesiones, vídeos, diseño o navegación:

1. Leer `AGENTS.md`.
2. Leer la documentación específica del área que se vaya a tocar.
3. Para ejercicios, leer obligatoriamente `docs/ejercicios/ESPECIFICACION_EJERCICIOS.md`.
4. Revisar el código y los datos actuales antes de modificar nada.
5. Si una regla nueva contradice una antigua, prevalece la más reciente y explícita.

## 1. Reglas generales de seguridad

- CampoBase actual es la base validada.
- Añadir antes que rehacer.
- No borrar, sustituir, rediseñar ni reestructurar funciones ya validadas sin autorización explícita.
- No tocar `main` para cambios funcionales sin haber trabajado y probado antes en una rama.
- No eliminar datos existentes de usuarios, jugadores, partidos, sesiones, ejercicios, vídeos o Supabase.
- No cambiar IDs existentes silenciosamente.
- No romper compatibilidad con registros antiguos.
- No hacer obligatorios campos nuevos para datos antiguos.
- No modificar el diseño general de la app salvo petición explícita.
- No tocar el editor/pizarra ni sus funciones validadas salvo que la tarea lo exija expresamente.
- Antes de fusionar, ejecutar pruebas y revisar errores de consola/regresión.
- Si una modificación puede provocar pérdida de datos, duplicados o romper una función validada, detenerse antes de aplicarla.

---

# 2. Ejercicios — normas vigentes

La especificación detallada vive en:

`docs/ejercicios/ESPECIFICACION_EJERCICIOS.md`

Las reglas siguientes son obligatorias y tienen prioridad sobre descripciones antiguas incompatibles.

## 2.1 Principio de fidelidad

Un ejercicio procedente de vídeo debe representar el ejercicio real de la fuente.

No inventar silenciosamente:
- recorridos;
- posiciones;
- variantes;
- material;
- rotaciones;
- roles;
- número de balones;
- gestos;
- tiempos observados;
- lógica de la acción.

Si existe una duda importante sobre el movimiento o la geometría, debe resolverse antes de dar el ejercicio por validado.

Si el usuario corrige un único punto de un ejercicio ya validado, cambiar solo ese punto y conservar el resto.

## 2.2 Nuevo formato de ejercicio

Para ejercicios nuevos procedentes de vídeo, el paquete normal es:

- `preview.png`
- `ejercicio.mp4`
- `video_muestra_humanos.mp4`
- `data.json`
- `ficha.md`
- `origen.json`
- `qa.json`

Puede conservarse además `fuente_animacion.gif` como fuente histórica o trazabilidad cuando exista, pero:

**el formato principal de reproducción es MP4, no GIF.**

### Significado

- `preview.png`: montaje inicial limpio.
- `ejercicio.mp4`: demostración gráfica principal del ejercicio.
- `video_muestra_humanos.mp4`: vídeo real con personas del que procede el ejercicio.
- `data.json`: fuente estructurada principal de datos.
- `ficha.md`: explicación ampliada.
- `origen.json`: procedencia y trazabilidad.
- `qa.json`: control de calidad.

No meter storyboards de validación en el paquete final salvo petición expresa.

## 2.3 Preview y MP4

### preview.png
Debe mostrar el montaje inicial de forma limpia y útil.

### ejercicio.mp4
Debe:
- corresponder exactamente al mismo ejercicio descrito en `data.json`;
- mostrar movimiento real de jugadores y balón;
- conservar la lógica y geometría validadas;
- no llevar paneles de interfaz;
- no llevar cabeceras decorativas;
- no llevar textos explicativos superpuestos;
- mostrar flechas solo mientras sucede la acción correspondiente;
- evitar flechas permanentes decorativas;
- usar MP4/H.264 compatible con web/app cuando proceda.

No convertir el MP4 nuevo a GIF como formato principal.

## 2.4 Vídeo humano obligatorio cuando exista fuente en vídeo

Los ejercicios creados a partir de vídeo deben conservar también el vídeo real de muestra con humanos.

En la app deben poder coexistir:
1. vídeo gráfico principal del ejercicio;
2. vídeo de muestra con humanos.

No eliminar ni sustituir vídeos existentes.

La integración debe ser backward-compatible: los ejercicios antiguos que solo tengan el campo de vídeo anterior deben seguir funcionando.

## 2.5 Categorías oficiales

Cada ejercicio tiene una categoría principal de este conjunto:

- Calentamiento/activación
- Tecnificación
- Técnico-táctico
- Táctica
- Posesión
- Juego reducido
- Finalización
- Transición
- Coordinación/motricidad
- Preparación física
- Preparación física integrada
- Porteros

No usar `Técnica` como categoría cuando corresponda `Tecnificación`.

## 2.6 Fútbol 7 / Fútbol 11

`Fútbol 7` y `Fútbol 11` son una dimensión/filtro independiente de la categoría principal.

No sustituyen categorías como Finalización, Táctica, Tecnificación, etc.

Regla vigente para los ejercicios importados desde vídeo:
- Fútbol 7: ejercicios con niños y los identificados mediante señales izquierda/derecha o códigos de color como naranja, verde, blanco, etc.
- Fútbol 11: el resto.

Si `data.json` ya contiene `formato_futbol`, respetar ese valor y no recalcularlo arbitrariamente.

## 2.7 “Qué se trabaja”

No copiar automáticamente el objetivo ni un campo antiguo.

Debe salir de la mecánica real del ejercicio.

Usar aproximadamente un máximo de 4 contenidos realmente útiles y distintos.

Evitar duplicados semánticos o etiquetas genéricas que no aporten información.

## 2.8 Terminología

La palabra visible **“chip”** está prohibida en el contenido para entrenadores.

Según el contexto usar:
- picar el balón;
- balón picado;
- pase picado;
- remate picado.

No llamar “chips” a las etiquetas visuales de interfaz.

Usar español de España:
- portero;
- portería;
- cono;
- peto;
- escalera de coordinación;
- valla;
- conducción;
- regate;
- mediapunta cuando proceda.

## 2.9 Convenciones visuales nuevas

Por defecto:
- atacante: azul;
- defensor: rojo;
- portero: morado;
- entrenador: gris;
- cono: naranja salvo que la fuente necesite distinguir colores;
- balón: blanco/negro;
- campo: franjas `#8BC753` y `#84C04D`.

Usar fichas/símbolos simples para táctica, pases, finalización y desplazamientos.

Usar representación corporal más detallada solo cuando el gesto corporal sea realmente necesario para entender el ejercicio.

No numerar visiblemente los ejercicios como “Ejercicio 001”, salvo petición específica.

## 2.10 Integración en la app

Los ejercicios nuevos deben integrarse en la estructura existente de CampoBase, no en una biblioteca paralela.

Deben funcionar, cuando corresponda, en:
- biblioteca/listado;
- búsqueda;
- categorías;
- filtros;
- “Qué se trabaja”;
- vista del ejercicio;
- selección para sesiones;
- sesiones guardadas;
- reproducción del vídeo gráfico;
- reproducción del vídeo humano.

Antes de insertar:
- comprobar duplicado por ID;
- comprobar duplicado por nombre;
- comprobar si ya existe como otra versión.

Si ya existe, no sobrescribir automáticamente.

Las versiones anteriores deben conservarse como respaldo y no aparecer como ejercicios actuales.

## 2.11 Supabase

Supabase es fuente de verdad cuando la app use esos datos.

Al integrar ejercicios:
- añadir sin borrar;
- conservar tablas, columnas e IDs existentes;
- evitar migraciones invasivas;
- mantener compatibilidad con registros antiguos;
- no convertir campos nuevos en obligatorios para datos existentes;
- conservar URLs/rutas ya usadas por la app;
- no eliminar vídeos existentes.

## 2.12 Editor/pizarra: no romper

No modificar sin petición explícita las funciones validadas de:
- mover;
- seleccionar;
- tamaño;
- orientación libre;
- espejo horizontal;
- reflejo vertical;
- giro -90°/+90°;
- duplicar;
- borrar;
- fases;
- deshacer/rehacer;
- guardar/persistencia;
- inversión específica del fondo de red de porterías, cuando exista.

## 2.13 QA obligatorio

Antes de considerar terminado un ejercicio o una importación, comprobar en este orden:

**fuente → preview → primer frame del MP4 → MP4 completo → data.json/ficha**

Todo debe representar el mismo ejercicio.

Además revisar:
- categoría correcta;
- F7/F11 correcto;
- “Qué se trabaja” correcto;
- materiales;
- recorridos;
- balones;
- rotaciones;
- vídeo humano;
- duplicados;
- búsqueda/filtros;
- selección en sesiones;
- persistencia;
- errores nuevos de consola;
- regresión de ejercicios antiguos.

No dar por terminado solo porque compile.

## 2.14 Regla de versiones validadas

Contenido marcado como validado no se modifica silenciosamente.

Si se crea una revisión:
- conservar la versión anterior;
- distinguir claramente la nueva;
- no convertir una versión antigua en activa por accidente.

---

## 3. Documentación

Documentación específica actual:
- Ejercicios: `docs/ejercicios/ESPECIFICACION_EJERCICIOS.md`
- Ejemplos y fuentes: `docs/ejercicios/`

Si se añaden documentos de sesiones, vídeos, Supabase, arquitectura o diseño, deben enlazarse también desde este archivo.

