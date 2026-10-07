# Constitución de CampoBase (constitution.md)

Este documento establece las reglas invariantes, principios rectores y restricciones de ingeniería del proyecto **CampoBase**. Es de obligado cumplimiento para todos los agentes, desarrolladores y herramientas automáticas que interactúen con el repositorio.

---

## Artículo 1. Invarianza del Software Validado y Protección de Datos
1. **Añadir antes que rehacer**: CampoBase actual es una base validada y en producción. Queda estrictamente prohibido refactorizar, renombrar, reestructurar o eliminar módulos validados sin solicitud explícita del usuario.
2. **Protección absoluta de datos de usuario**:
   - Nunca borrar ni mutar destructivamente registros guardados en IndexedDB ni en Supabase (jugadores, plantillas, partidos, convocatorias, asistencias, eventos en vivo ni sesiones personalizadas creadas por entrenadores).
   - No forzar migraciones destructivas ni sobrescribir datos personales de plantillas.
   - Preservar compatibilidad con versiones anteriores: ningún campo nuevo puede ser obligatorio para registros antiguos.
3. **Persistencia de identificadores**: Los IDs canónicos de ejercicios, jugadores, partidos y sesiones no deben cambiarse silenciosamente.

---

## Artículo 2. Delimitación de Ámbitos y Enfoque de Tarea
1. **Aislamiento de módulos**: Si una tarea concierne a la biblioteca de ejercicios, el agente debe operar exclusivamente sobre la gestión, normalización, conversión, almacenamiento y visualización de ejercicios.
2. **No injerencia en Fase 1 / Partido**: Queda prohibido alterar la lógica de partidos en vivo, actas, convocatorias, cronómetros, rotaciones de minutos o pizarras tácticas cuando se trabaja en ejercicios u otros subsistemas independientes.

---

## Artículo 3. Estándares de Contenido y Calidad en Ejercicios
1. **Prohibición de textos técnicos y residuales**:
   - Nunca deben aparecer cadenas de scraping o prompts automáticos como *"Aplicar la regla documentada:"*.
   - Los textos de objetivos, desarrollo (*como_se_hace* / *fases*) y variantes deben estar completamente redactados en lenguaje técnico futbolístico claro y profesional.
2. **Ocultación de códigos técnicos en la interfaz**:
   - Códigos internos como `f7-1999598` o prefijos técnicos nunca deben exponerse al usuario en títulos, subtítulos ni tarjetas visibles. Los títulos deben ser futbolísticos y limpios (ej. *"Finalización 2 vs 2 con porteros"*).
3. **Integridad de activos multimedia**:
   - Todo ejercicio del catálogo debe disponer de su miniatura representativa (`preview.png`) y su vídeo ilustrativo (`ejercicio.mp4`).
   - Los vídeos se referencian mediante enlaces canónicos alojados (o fallbacks locales en `library-v2/assets/videos/`).
4. **Taxonomía y metadatos**:
   - `formato_juego` debe normalizarse siempre (`futbol_7`, `futbol_11`, `todos`).
   - El flag `ludico: true` debe activarse ante cualquier contenido de calentamiento lúdico, juego recreativo o mención a dinámicas lúdicas (`/l[uú]dic/i`).
   - Categorías principales: *Calentamiento*, *Técnica*, *Táctica*, *Físico*, *Porteros*, *Acciones a balón parado*.

---

## Artículo 4. Arquitectura Offline-First, Service Worker y Gestión de Caché
1. **Garantía de disponibilidad offline**: Todos los activos esenciales de la aplicación deben estar listados en `ASSETS` del Service Worker (`sw.js`).
2. **Invalidación de caché y entrega inmediata**:
   - Cuando se integren nuevos módulos de datos o ejercicios (`ejercicios-lotes-*.js`), deben incluirse en `ASSETS` y en `REVALIDATE_PATHS`.
   - La clave `CACHE` de `sw.js` debe actualizarse para que las PWAs instaladas y navegadores móviles detecten la nueva versión y purguen activos obsoletos sin dejar a los usuarios con catálogos incompletos.
   - En entornos locales (`localhost`), la app debe impedir que Service Workers antiguos sirvan datos obsoletos.

---

## Artículo 5. Verificación Continua y Cero Regresiones (Suite Verde)
1. **Obligatoriedad de pruebas automáticas**: Ningún cambio puede considerarse finalizado sin ejecutar y validar con éxito:
   - `npm test`: 100% de los tests pasando (cero fallos, cero omitidos).
   - `npm run check`: Verificación estricta de sintaxis en todos los módulos clave.
2. **Pruebas de regresión**: Si se añade una nueva funcionalidad o lote, debe extenderse o adaptarse el test correspondiente (`tests/exercise-format-filter.test.js`, etc.) para verificar la exactitud de los conteos.

---

## Artículo 6. Comunicación y Enlaces Interactivos
1. **URLs siempre clickables**: Todas las direcciones web y enlaces locales provistos al usuario en las respuestas del agente deben formatearse obligatoriamente como enlaces Markdown clickables (`[Texto descriptivo](http://...)` o `<http://...>`).
2. **Claridad en los conteos de catálogo**: Explicar siempre con precisión el desglose de los ejercicios mostrados: catálogo oficial validado vs. ejercicios personales del usuario (*Mis ejercicios* guardados en IndexedDB local).
