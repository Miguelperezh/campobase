# Tareas de Implementación: Especificación 001

**Especificación**: `specs/001-integracion-ejercicios-801-1000/spec.md`  
**Plan**: `specs/001-integracion-ejercicios-801-1000/plan.md`  

---

## Lista de Tareas

- [x] **T1. Marco SDD y Gobernanza**
  - [x] Crear `docs/constitution.md` con las reglas de ingeniería e invariantes.
  - [x] Crear `MEMORY.md` para seguimiento continuo de estado y catálogo.
  - [x] Estructurar directorio `specs/001-integracion-ejercicios-801-1000/`.

- [x] **T2. Extracción y Verificación de Lotes Nuevos**
  - [x] Auditar lotes en `/Users/miguelperez/Documents/Codex/2026-09-09/files-mentioned-by-the-user-figuras/outputs/CampoBase_Documentos/`.
  - [x] Confirmar 179 nuevos ejercicios repartidos en lotes 801-850, 851-900, 901-950 y 951-1000.
  - [x] Verificar que ninguno tenga colisión de ID ni textos automáticos *"Aplicar la regla documentada:"*.

- [x] **T3. Sincronización de Activos Multimedia**
  - [x] Copiar 179 miniaturas a `library-v2/assets/previews/`.
  - [x] Copiar 179 vídeos a `library-v2/assets/videos/`.
  - [x] Actualizar manifiesto `scripts/github-release-video-manifest.json` (1.252 ítems totales).

- [x] **T4. Compilación del Catálogo de Datos**
  - [x] Actualizar `scripts/build-lotes-151-650.py` con rangos de lotes hasta el 1000.
  - [x] Generar `js/ejercicios-lotes-151-650.js` con 829 ejercicios.
  - [x] Verificar que `EJERCICIOS_VALIDADOS` sume exactamente 1.239 ejercicios.

- [x] **T5. Corrección de Service Worker y Caché PWA**
  - [x] Añadir `./js/ejercicios-lotes-151-650.js` a `ASSETS` en `sw.js`.
  - [x] Añadir `'/js/ejercicios-lotes-151-650.js'` a `REVALIDATE_PATHS` en `sw.js`.
  - [x] Actualizar clave `CACHE` en `sw.js` para forzar invalidación de versiones previas.
  - [x] Añadir purga de `window.caches` en `js/app.js` para ejecuciones locales (`isLocal`).

- [x] **T6. Pruebas y Validación Técnica**
  - [x] Actualizar `tests/exercise-format-filter.test.js` para validar el recuento de 1.239 ejercicios.
  - [x] Ejecutar `npm test` y verificar 574/574 pruebas aprobadas.
  - [x] Ejecutar `npm run check` y comprobar sintaxis limpia.

- [x] **T7. Validación de Usuario y Enlaces Clickables**
  - [x] Generar enlaces directos clickables a la aplicación y previsualizador.
  - [x] Elaborar informe explicativo de la resolución del conteo de 1062 a 1239/1241.
