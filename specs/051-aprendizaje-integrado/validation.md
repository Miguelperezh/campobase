# Validación 10/10/2026
- Sintaxis: npm run check correcto. Suite: 818 tests, 0 fallos.
- tests/browser-learning.mjs: IndexedDB aislado, sin solicitudes externas. Guarda y recupera revisión, evaluación parcial y objetivos. Ajusta fondo/fuente en editor real, guarda/recarga; solo apartado actual. Conserva borradores ante refresh y bloquea conflicto previo al guardado. Campo original, marcador y plan deportivo intactos. Anchos 1440/390 sin desbordamiento.
- App completa con demo vacía y jugador temporal en base demo aislada: navegación, tres apartados, editor contextual y ausencia de errores de JS a ambos anchos. Sin escrituras deportivas reales.
- Corregido fallo del ID del botón de foco individual que interrumpía refresh antes de cargar objetivos.
- No se ha probado dispositivo móvil físico ni sincronización remota con dos cuentas de las nuevas evaluaciones. Se reutiliza el transporte propietario de settings existente; no se cambian Supabase ni permisos.

## Publicación 11/10/2026
PR135 fusionada en main 66ba9334. CI de revisión y main correctos; Pages 38138316357 completado. Verificación SHA256 de diez archivos públicos de aplicación contra copia validada, build 20261010-learning-1. Sin escrituras sobre datos reales.
