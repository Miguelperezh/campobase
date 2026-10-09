# Validación

Antes: caché matchPreset=0 con remoto null activaba cabecera cyan y perdía elecciones uiParts. Tras corregir fallback, prueba falló por cabecera inexistente del delegado. Componentes comunes resuelven ambas divergencias sin cambiar valores almacenados.

Navegador aislado con todas las hojas reales, 390 y 1440px y rol delegado activo. Paleta contrastada y caché contradictoria: cabecera, marcador, nombre, estado y Gol coinciden; regeneración conserva, 14 filas/7+7 casillas, no aparecen Mostrar/Desbloquear/Salir exclusivos de owner. Abrir/cerrar Gol sin registrar y comprobar ausencia de pageerror.

Copia de tema real en memoria, sin datos personales en repo: 106 elecciones guardadas que tienen equivalentes existentes coinciden en cada ancho, sin divergencias de estilo calculado. No se prueban móvil físico ni mutaciones deportivas reales. No se escribe Supabase ni se cambia auth/PIN/permisos/plan/reloj.

806/806 pruebas pasan, npm run check y git diff --check correctos. PR133 integrado en main a11d5fe8f52d137ba43cc850976e052914352e06. Verificación main 37951332354 y Pages 37951332695 success. Los once archivos públicos cotejados coinciden byte a byte con el checkout validado (incluido CSS y service worker). Versión 20261009-delegate-colors-3. Publicación confirmada el 09/10/2026.
