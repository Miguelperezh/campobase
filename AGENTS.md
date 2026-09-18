# CampoBase — instrucciones para agentes

## LECTURA OBLIGATORIA ANTES DE TOCAR NADA

Todo agente debe detenerse y leer, en este orden:

1. `AGENTS.md` completo.
2. `README.md` para entender la arquitectura y funciones actuales.
3. La documentación específica del área:
   - ejercicios/sesiones/vídeos: `docs/EJERCICIOS.md`;
   - migración R2: la sección de migración de este archivo y sus scripts.
4. Los archivos y tests directamente relacionados con la tarea antes de editar.

Si no ha leído lo anterior, NO debe modificar el proyecto.

## GUARDARRAÍLES GLOBALES

CampoBase es una aplicación ya validada. La prioridad es conservar lo que funciona.

- NO trabajar directamente sobre `main`.
- NO fusionar automáticamente a `main` sin validación.
- NO borrar, sustituir ni rediseñar una función validada para resolver otra tarea.
- NO hacer refactors amplios si la tarea puede resolverse con un cambio pequeño y aditivo.
- NO cambiar contratos de datos, IDs, nombres de campos, rutas, tablas o formatos persistidos salvo necesidad explícita y migración segura.
- NO borrar datos reales de Supabase.
- NO borrar archivos actuales de Supabase Storage mientras exista una migración sin validar.
- NO introducir secretos, claves privadas o tokens en Git, frontend, logs o documentación.
- NO asumir que un cambio visual/técnico autoriza cambios de UX no solicitados.
- NO modificar ejercicios validados existentes salvo petición explícita de Miguel.
- NO cambiar IDs de ejercicios: las sesiones los referencian por `exerciseId`.
- NO alterar jugadores, partidos, sesiones, estadísticas, tácticas, Auth o configuración por una tarea de vídeos.
- NO convertir componentes estáticos validados a otra arquitectura solo por preferencia técnica.
- Ante una duda que pueda romper datos o comportamiento, detener el cambio destructivo y preservar el estado actual.

### Regla de cambio mínimo

Cada tarea debe tocar solo los archivos necesarios. Si aparecen cambios colaterales no indispensables, revertirlos antes de presentar el trabajo.

### Regla de pruebas

Antes de considerar una tarea terminada:
- ejecutar tests relacionados;
- ejecutar `npm test` cuando el cambio pueda afectar lógica compartida;
- ejecutar `npm run check`;
- revisar que no haya regresiones en las funciones afectadas;
- no declarar éxito si las pruebas no se han ejecutado o han fallado.

### Regla de rollback

Los cambios deben ser reversibles. Mantener ramas/commits claros y no eliminar la fuente anterior hasta haber validado la sustitución.


## CONTEXTO SEPARADO POR AGENTE / CONVERSACIÓN

Cada agente debe trabajar en su propio bloque y NO reescribir ni mezclar el contexto de otro agente.

Formato obligatorio al iniciar o continuar trabajo:
- fecha;
- agente;
- tarea;
- rama;
- estado actual;
- archivos tocados;
- pruebas realizadas;
- pendiente / siguiente paso.

### ChatGPT — coordinación, GitHub y Supabase
- Puede trabajar con GitHub y Supabase cuando las conexiones estén disponibles.
- No debe afirmar que ha subido archivos a Cloudflare R2 si no dispone de acceso de escritura real a Cloudflare.
- Si una tarea requiere R2 y no hay acceso directo, debe dejar el trabajo preparado/documentado para el agente que sí tenga ese acceso.
- Debe mantener el contexto de esta conversación separado del bloque de Antigravity y PrograMARIO.

### Antigravity — ejecución local en el Mac
- Puede usar el Terminal local y la sesión de Wrangler ya autorizada.
- Es el agente preferente para operaciones R2 cuando Cloudflare no esté disponible como conector.
- Debe leer primero este archivo y la documentación específica de la tarea.
- Debe ejecutar por sí mismo los comandos y verificaciones; no pedir a Miguel que copie comandos salvo bloqueo real de autorización.

### PrograMARIO — programación e integración
- Debe respetar los mismos guardarraíles globales.
- Debe limitarse a programación, integración y pruebas de la tarea asignada.
- No debe cambiar arquitectura, UX, datos persistidos ni servicios externos fuera del alcance pedido.
- Si necesita una operación externa (R2, Supabase, despliegue), debe dejarla claramente indicada sin simular que se ha ejecutado.

### Regla de traspaso entre agentes
Cuando un agente termina o queda bloqueado, debe dejar en SU bloque:
- qué hizo exactamente;
- qué no hizo;
- por qué se detuvo;
- commit/PR/rama;
- comando o acción siguiente, si procede;
- cualquier validación pendiente.

Ningún agente debe borrar el historial de otro agente. Si una conversación nueva continúa una tarea anterior, debe leer primero el bloque del agente anterior y después añadir su propio estado.

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
