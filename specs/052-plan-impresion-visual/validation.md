# Validación 17/10/2026
- npm run check y 824/824 tests. Expectativas del modelo anterior actualizadas únicamente donde cambia el diseño aprobado (partes/paginación/etiquetas); pruebas de minutos, borradores y acceso conservadas.
- Test nuevo: seis ventanas 17/26/35/47/53/61, 13 convocados, tres A4; cortes múltiples (0–17,35–53,61–70 = 44 min), división por partes sin pérdida, intercambio sin sustitución ficticia, identidad configurable y escape seguro. Fuente inmutable.
- tests/browser-print-visual.mjs con hojas reales y IndexedDB sin uso: 1440/390, escudo cargado, color configurado efectivo, impresión no oculta, botón real descarga PDF, cierre restaura pantalla y estado, otra identidad, F11/25 convocados/nombres extensos. Sin desbordamiento de contenido ni omisiones.
- PDF nativo 1440/390 y descarga 1440/390: todos tres A4, no vacíos, inspección visual de las tres páginas nativas y las tres descargadas. Cabecera, colores y campos completos en ambos transportes. Archivos de QA fuera del repositorio; datos sintéticos únicamente.
- No cambiar print-session-export, match-moments, editores, Supabase, datos o estilos globales. No se ha probado móvil físico.
- Publicación: pendiente de revisión/main/Pages.
