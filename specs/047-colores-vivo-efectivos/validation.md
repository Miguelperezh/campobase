# Validación

Causas identificadas: CSS de rediseño fijaba fondos/textos aun existiendo variables guardadas. Parte del catálogo apuntaba a clases/IDs inexistentes (cbx-live-score, player-timer, goal-for-btn). Delegado usa otro contenedor/IDs y no heredaba preferencias de Partido. Importaciones del catálogo seguían con URL de versión anterior.

Corrección de lectura/renderizado, sin escrituras ni cambios de autenticación, permisos o backend. Preferencias específicas de Modo Campo conservadas; otras pestañas intactas. No sustituye paletas ni planes. Alias de selectores antiguos aplicados solo a una copia en memoria.

801 tests pasan y npm run check correcto. Browser aislado con DOM completo y todas las hojas reales: 1440/390px, marcador/fondo/nombres/botón automático iguales entre vistas equivalentes; preferencias históricas del marcador funcionan. Regenerar ambos paneles conserva resultados. Tema original mantiene ausencia de views.delegado, probando que proyección no persiste. Cero errores de consola. Todas las conexiones externas bloqueadas: no prueba de móvil físico ni escrituras remotas.
