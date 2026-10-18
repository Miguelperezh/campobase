# Validación 18/10/2026
- npm run check y 829 pruebas correctas; git diff --check sin errores.
- tests/browser-match-edit-access.mjs en app completa demo aislada a 1440/390: botón único fijo en seis estados (finished, closed, completed, closedAt, finishedAt y planned), desde tarjeta y Ver detalle. Repintar mantiene acceso, Editar datos generales sigue presente y no se apilan modales.
- Cancelar tras recorrer todos los estados conserva literalmente el partido original. Guardado y reapertura reales: marcador 2–3, dos goleadores, penalti, asistente corregido, goles encajados 2+1 entre ambos porteros, minutos 34 y puntuación 5; nota, campo y preparación intactos. Cero errores de página.
- No se han tocado registros reales, colores, preferencias, impresión, permisos o PIN; solo código y documentos. No se ha probado móvil físico.
- Build preparado: 20261018-match-edit-2. Publicación pendiente de CI y verificación pública.
