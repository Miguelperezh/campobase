# Validación
- Sintaxis completa: correcta.
- Suite existente: 690/690, sin omisiones. Dos expectativas antiguas sobre el nombre del generador y el restablecimiento global se adaptan al nuevo comportamiento solicitado.
- Navegador crítico: navegación, guardar/reabrir preparación, preparar partido y añadir ejercicio: correcto.
- Navegador de colores con copia de datos y Supabase bloqueado: controles de Convocatoria, independencia Editar/WhatsApp/Borrar, barras GF/GC, rangos de especialistas, banner Tácticas, ámbito del panel y restablecimiento; correcto.
- Sugerencia de rotaciones con preparación manual existente: muestra parejas y conserva idénticos todos los registros matches/callups/settings. No se guarda automáticamente.
- Regresión de sesiones, ficha de ejercicios y WhatsApp: correcta a 390 y 1280 px. Cero errores de página y cero escrituras remotas.
- Prueba reproducible: tests/browser-local-colors.mjs; recibe CAMPOBASE_TEST_FIXTURE (copia privada de datos) y CAMPOBASE_PREVIEW_ROOT, usa Playwright/Chrome existentes. No incluye datos personales en Git.
- Publicación de esta corrección: únicamente preview independiente; main y Supabase sin modificaciones durante este bloque.

- Fuente final: 198949eb; preview: 2e5c612. URL de prueba: https://miguelperezh.github.io/campobase-preview/v2/?revision=2e5c612. La referencia versionada de Hoy evita reutilizar el gráfico previo.
- Main original comprobado mediante GitHub: 360b2b2dce3cc454a644b5d8fe428ccdc2df8557, idéntico al inicio del bloque.
