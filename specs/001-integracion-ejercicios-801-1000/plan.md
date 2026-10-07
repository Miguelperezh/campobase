# Plan de Implementación: Especificación 001

**Especificación**: `specs/001-integracion-ejercicios-801-1000/spec.md`  
**Metodología**: SDD (Spec-Driven Development)  

---

## Fases del Plan

### Fase 1: Constitución y Reglas Invariantes
- [x] Establecer `docs/constitution.md` con las reglas invariantes de CampoBase.
- [x] Crear `MEMORY.md` para persistencia del estado técnico y métricas del catálogo.
- [x] Garantizar que no se toque la lógica de partido (Fase 1), convocatorias ni bases de datos de usuario.

### Fase 2: Ingesta, Auditoría y Staging de Activos Multimedia
- [x] Escanear los lotes 801 a 1000 en `CampoBase_Documentos`:
  - Lote 801-850: 50 ejercicios.
  - Lote 851-900: 50 ejercicios.
  - Lote 901-950: 50 ejercicios.
  - Lote 951-1000: 29 ejercicios.
- [x] Validar que no existen colisiones de identificadores con el catálogo previo.
- [x] Copiar las 179 miniaturas a `library-v2/assets/previews/`.
- [x] Copiar los 179 vídeos a `library-v2/assets/videos/`.
- [x] Actualizar `scripts/github-release-video-manifest.json` para reflejar la totalidad de activos multimedia (1.252).

### Fase 3: Compilación y Normalización del Catálogo
- [x] Ejecutar script de compilación `scripts/build-lotes-151-650.py` integrando lotes 151 al 1000.
- [x] Limpieza sistemática de textos: eliminar prefijos *"Aplicar la regla documentada:"*.
- [x] Clasificación lúdica: marcar lote 801-850 con `ludico: true`.
- [x] Generar `js/ejercicios-lotes-151-650.js` consolidado con 829 ejercicios.

### Fase 4: Resolución de Caché y Entrega PWA
- [x] Actualizar `sw.js`:
  - Registrar `./js/ejercicios-lotes-151-650.js` en `ASSETS`.
  - Registrar `'/js/ejercicios-lotes-151-650.js'` en `REVALIDATE_PATHS`.
  - Renovar clave de caché con sufijo `-v60-lotes-151-1000`.
- [x] Actualizar `js/app.js`:
  - Añadir purga de `window.caches` en entornos locales (`localhost`) para erradicar cachés obsoletas durante el desarrollo.

### Fase 5: Validación Automatizada
- [x] Actualizar prueba de recuento en `tests/exercise-format-filter.test.js` a 1.239 ejercicios oficiales.
- [x] Ejecutar suite completa `npm test` (574 tests verdes).
- [x] Ejecutar verificación sintáctica `npm run check`.

### Fase 6: Entrega y Validación de Usuario
- [x] Proporcionar URLs clickables para validación en navegador.
- [x] Documentar la resolución de la discrepancia de 1062 ejercicios.
