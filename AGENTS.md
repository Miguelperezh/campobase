# CampoBase — instrucciones para agentes

## Estado vigente: migración de vídeos Supabase Storage → Cloudflare R2

Objetivo: reducir el egress de Supabase sin cambiar el comportamiento de CampoBase.

### Invariantes
- NO modificar `main` directamente. Trabajar en `r2-video-migration` o una rama derivada y validar antes de fusionar.
- NO borrar objetos de Supabase hasta que R2 esté completo y validado.
- NO mover jugadores, partidos, sesiones, estadísticas, Auth ni configuración fuera de Supabase.
- Los usuarios normales no deben gestionar vídeos. El vídeo es contenido administrado por el propietario.
- Las sesiones guardan `exerciseId`; no incrustan el MP4. Deben seguir sincronizando por Supabase.
- Mantener las rutas de objeto exactamente iguales en R2 para evitar reescrituras masivas.
- No exponer claves de Cloudflare/R2 en frontend ni en Git.
- No pedir al usuario que suba 323 vídeos manualmente.

### Recursos
- Supabase project ref: `mdzpygfwugawlmknywxa`
- Supabase bucket actual: `ejercicio-videos`
- R2 bucket: `campobase-videos`
- R2 public dev URL: `https://pub-15e00678d78749c6861d652d01832b5c.r2.dev`
- Rama: `r2-video-migration`
- Script: `scripts/migrate-supabase-videos-to-r2.mjs`
- Manifiesto: `scripts/r2-migration-manifest.json`

### Ejecución autónoma preferente

- Si el agente se ejecuta en el Mac de Miguel, debe reutilizar primero la sesión existente de Wrangler. El login ya fue autorizado correctamente el 18/09/2026 mediante `npx wrangler login`.
- Antes de pedir ninguna intervención al usuario, ejecutar `npx wrangler whoami`. Si responde autenticado, continuar sin preguntas.
- No pedir al usuario que copie comandos, descargue archivos, suba vídeos manualmente ni use ChatGPT Work.
- Un agente local con acceso al repositorio y al Terminal debe ejecutar por sí mismo la prueba, la migración y las verificaciones.
- Si la sesión Wrangler ha caducado de verdad, entonces y solo entonces solicitar una nueva autorización OAuth.
- Para automatización independiente del Mac se puede usar GitHub Actions, pero requiere una credencial Cloudflare no interactiva guardada de forma segura como secreto de GitHub. Nunca guardar esa credencial en archivos del repositorio.

### Procedimiento para un agente con acceso al equipo/Cloudflare
1. Verificar autenticación de Wrangler con `npx wrangler whoami`. Si ya está autenticado, no preguntar nada al usuario.
2. Probar un único objeto:
   `node scripts/migrate-supabase-videos-to-r2.mjs --only=library-v2-preview/pdf150-094/ejercicio.mp4`
3. Verificar que responde:
   `https://pub-15e00678d78749c6861d652d01832b5c.r2.dev/library-v2-preview/pdf150-094/ejercicio.mp4`
4. Si la prueba es correcta, ejecutar:
   `node scripts/migrate-supabase-videos-to-r2.mjs`
5. Validar cantidad y tamaños. No borrar Supabase.
6. Cambiar `VIDEO_PUBLIC_BASE_URL` en `js/ejercicio-videos.js` a la URL R2 solo en la rama.
7. Ejecutar tests/checks del proyecto y probar reproducción, seek/range y sesiones en móvil/desktop.
8. Para producción, sustituir `.r2.dev` por dominio personalizado antes de fusionar, si está disponible.
9. Para futuras subidas desde CampoBase, implementar Worker/presigned upload a R2; nunca incluir secretos R2 en el navegador.

### Nota de seguridad
Si un agente no tiene autorización Cloudflare, debe intentar usar la sesión local de Wrangler o el mecanismo seguro de credenciales del entorno. Solo debe pedir una autorización de cuenta cuando sea técnicamente imprescindible; nunca pedir que el usuario copie secretos al chat.
