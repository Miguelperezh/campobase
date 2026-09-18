# CampoBase — reglas para ejercicios

Este documento es obligatorio para cualquier agente que vaya a crear, editar, integrar, migrar o relacionar ejercicios con sesiones o vídeos.

## Fuente de verdad actual

La biblioteca oficial/validada de ejercicios vive en el código del repositorio, no en Supabase.

- Agregador: `js/ejercicios-validados.js`
- Nuevo formato: `js/ejercicios-nuevo-formato.js`
- Ficheros individuales del nuevo formato: `js/ejercicios-nuevo-formato/*.js`
- La aplicación carga la biblioteca con `EJERCICIOS_VALIDADOS`.
- En `refresh()`, `state.exercises` se reconstruye desde `EJERCICIOS_VALIDADOS`.
- El propio código documenta que los ejercicios validados oficiales viven en JS y no se guardan en la base.

Por tanto, añadir un ejercicio oficial nuevo mediante un agente con acceso a GitHub NO requiere acceso de escritura a Supabase para crear la ficha del ejercicio.

## Qué sí sincroniza Supabase

Supabase sigue siendo la fuente compartida para datos dinámicos de CampoBase.

En particular:
- las sesiones se guardan como `recordType: 'trainingSession'`;
- cada bloque de una sesión referencia un ejercicio mediante `exerciseId`;
- la metadata dinámica de vídeos se puede guardar como `recordType: 'exerciseVideo'`;
- jugadores, partidos, estadísticas, configuraciones y demás datos de usuario siguen en Supabase.

Un ejercicio nuevo integrado en el catálogo de código estará disponible en todos los dispositivos tras desplegar la nueva versión de la app. Una sesión creada en cualquier dispositivo seguirá sincronizándose mediante Supabase y conservará el `exerciseId`.

## Regla para nuevos ejercicios creados por IA/agentes

Cuando Miguel pida crear un ejercicio oficial nuevo:

1. Leer primero `AGENTS.md` completo y este documento.
2. NO editar ni reemplazar ejercicios ya validados salvo petición explícita de Miguel.
3. Añadir el ejercicio de forma aditiva.
4. Usar un ID nuevo, estable y único. Nunca reciclar IDs.
5. Preferir un fichero individual nuevo dentro de `js/ejercicios-nuevo-formato/` y registrarlo en `js/ejercicios-nuevo-formato.js`.
6. Mantener el esquema y campos del formato validado existente. No inventar una estructura paralela.
7. Si el ejercicio lleva vídeo, no guardar el MP4 en Supabase Storage después de completar la migración R2. El fichero pesado debe ir a R2.
8. No exponer credenciales de R2 en frontend, repositorio, logs ni documentación.
9. No modificar el esquema de Supabase para añadir un ejercicio oficial salvo que exista una necesidad nueva, explícita y validada.
10. Ejecutar las pruebas pertinentes y `npm run check` antes de proponer fusión.

## Sesiones

Las sesiones NO contienen ni duplican vídeos. Guardan bloques con:
- `exerciseId`
- tipo de bloque
- duración
- notas

Esto es un contrato protegido. No incrustar MP4, blobs ni copias completas del ejercicio dentro de una sesión.

Si un agente cambia o elimina un ID usado por sesiones históricas, romperá esas referencias. Por eso:
- no renombrar IDs existentes;
- no borrar ejercicios existentes sin migración explícita;
- no reutilizar un ID para otro ejercicio.

## Vídeos

Arquitectura objetivo:
- ficha oficial del ejercicio: GitHub/código;
- archivo MP4: Cloudflare R2;
- metadata dinámica cuando proceda: Supabase;
- sesión: solo referencia `exerciseId`.

Los vídeos deben poder reproducirse desde móvil, tablet y ordenador mediante URL pública/controlada de R2.

Para futuras subidas realizadas desde la propia app:
- usar un Worker o URL firmada;
- nunca poner claves R2 secretas en JavaScript cliente;
- solo el propietario debe poder gestionar altas/bajas de vídeo.

## Cambios prohibidos sin autorización explícita

- Reescribir la biblioteca existente.
- Convertir todos los ejercicios a registros Supabase.
- Eliminar ejercicios validados.
- Cambiar IDs existentes.
- Cambiar formatos/categorías masivamente.
- Sustituir diagramas, vídeos o textos ya validados.
- Alterar sesiones históricas para adaptarlas a una refactorización.
- Cambiar diseño/UX de la biblioteca como efecto colateral de una tarea técnica.
- Introducir dependencias externas innecesarias.

## Validación mínima antes de integrar un ejercicio

Comprobar:
- aparece en biblioteca;
- filtros siguen funcionando;
- ficha abre correctamente;
- datos rápidos/material/duración son coherentes;
- diagrama/animación/vídeo, si existen, cargan;
- puede añadirse a una sesión;
- la sesión se guarda y vuelve a abrir conservando el mismo `exerciseId`;
- móvil y escritorio no presentan regresiones evidentes;
- `npm test`;
- `npm run check`.

Si falla cualquier punto, no fusionar.
