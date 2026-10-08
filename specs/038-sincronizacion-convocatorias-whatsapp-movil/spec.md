# SDD 038 — Sincronización de Convocatorias, Desplegables Limpios y Caché de WhatsApp

## 1. Solicitud y Problemas Reportados
1. **Desplegable de partidos al crear convocatorias:** Siguen apareciendo partidos que ya han sido jugados y partidos que ya tienen convocatoria creada. El usuario no debe ver partidos pasados ni partidos con convocatoria existente al crear una nueva convocatoria.
2. **Convocatoria creada en móvil no aparece:** Al crear una convocatoria en el móvil, no se visualiza en la vista principal de convocatorias, o desaparece tras sincronizar con Supabase porque la reconciliación borraba datos locales no presentes en el snapshot remoto o porque se clasificaba automáticamente como jugada/archivada.
3. **Textos de WhatsApp en el ordenador no actualizados:** El navegador en el ordenador y el Service Worker continuaban sirviendo la versión en caché de `whatsapp-suite.js` debido a la ausencia de parámetro de versión en el import de `app.js` y en la lista de activos del Service Worker.

## 2. Alcance
- Modificar el filtrado del selector de partidos en `callupBuilder` (`js/app.js`) y en `populateWhatsAppEvents` (`js/app.js`).
- Modificar la clasificación de convocatorias en `isCallupPlayed` y la creación en `saveCallup` para asegurar `completed: false` por defecto en convocatorias nuevas.
- Blindar la reconciliación local-first en `js/sync-core.js` (`reconcileCloudSnapshot`) y `js/db.js` (`syncFromCloud`) para que los registros locales nunca se descarten si no existe una mutación de borrado explícita.
- Forzar la invalidación de caché de `whatsapp-suite.js` en `js/app.js`, `sw.js` y `index.html`.
- No alterar esquemas de datos ni borrar información de usuarios. Mantener la suite de tests al 100% en verde.

## 3. Criterios de Aceptación
1. En el selector de partido de nueva convocatoria solo aparecen partidos pendientes futuros sin convocatoria previa vinculada (ni por ID ni por fecha/rival).
2. Los partidos jugados (por estado, marcador, minutos, fecha pasada o convocatoria realizada) se excluyen estrictamente del selector de nueva convocatoria.
3. Las convocatorias creadas en el móvil se mantienen en la vista activa de convocatorias pendientes y se sincronizan bidireccionalmente con Supabase sin borrado destructivo.
4. Los nuevos textos de WhatsApp (ambas equipaciones completas, polo y pantalón de paseo, camiseta roja de calentamiento, y bloque `*Descansan:*` en negrita sin motivos) se cargan de inmediato en el ordenador y en el móvil.
5. 100% de tests unitarios pasando y chequeo de sintaxis limpio.
