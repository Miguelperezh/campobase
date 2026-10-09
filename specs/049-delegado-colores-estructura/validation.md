# Validación

Antes: caché matchPreset=0 con remoto null activaba cabecera cyan y perdía elecciones uiParts. Tras corregir fallback, prueba falló por cabecera inexistente del delegado. Componentes comunes resuelven ambas divergencias sin cambiar valores almacenados.

Navegador aislado con todas las hojas reales, 390 y 1440px y rol delegado activo. Paleta contrastada y caché contradictoria: cabecera, marcador, nombre, estado y Gol coinciden; regeneración conserva, 14 filas/7+7 casillas, no aparecen Mostrar/Desbloquear/Salir exclusivos de owner. Abrir/cerrar Gol sin registrar y comprobar ausencia de pageerror.

Copia de tema real en memoria, sin datos personales en repo: 106 elecciones guardadas que tienen equivalentes existentes coinciden en cada ancho, sin divergencias de estilo calculado. No se prueban móvil físico ni mutaciones deportivas reales. No se escribe Supabase ni se cambia auth/PIN/permisos/plan/reloj.

806/806 pruebas pasan, npm run check y git diff --check correctos. Pendiente confirmación final de publicación.
