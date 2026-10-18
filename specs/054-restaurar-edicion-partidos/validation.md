# Validación 18/10/2026
- npm run check y 829 pruebas correctas; git diff --check sin errores.
- tests/browser-match-edit-access.mjs en app completa demo aislada a 1440/390: botón único fijo en seis estados (finished, closed, completed, closedAt, finishedAt y planned), desde tarjeta y Ver detalle. Repintar mantiene acceso, Editar datos generales sigue presente y no se apilan modales.
- Cancelar tras recorrer todos los estados conserva literalmente el partido original. Guardado y reapertura reales: marcador 2–3, dos goleadores, penalti, asistente corregido, goles encajados 2+1 entre ambos porteros, minutos 34 y puntuación 5; nota, campo y preparación intactos. Cero errores de página.
- No se han tocado registros reales, colores, preferencias, impresión, permisos o PIN; solo código y documentos. No se ha probado móvil físico.
- Regresión SDD053 correcta en fixture y app completa a 1440/390: carga explícita del plan, ambos porteros, conflictos, cambio de cuenta y cierre entrenador/delegado.
- Publicado: PR138 fusionada en main bb191850cb734b6d440239ab1e58edc9a5c356c9; revisión PR 39130328591, CI main 39130446558 y Pages 39130446748 correctos. Build 20261018-match-edit-2. Verificados por SHA256 16 recursos públicos, incluidos acceso/editor y archivos preservados de plan, impresión, colores, DB/sync.
