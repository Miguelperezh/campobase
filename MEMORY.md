# MEMORY.md — Memoria Persistente de CampoBase

Este archivo almacena el estado activo del proyecto, las especificaciones en curso, decisiones de arquitectura y métricas clave para mantener continuidad entre sesiones y agentes.

---

## 1. Estado del Catálogo de Ejercicios (Última actualización: 04/10/2026)

### Desglose del Catálogo Oficial (`EJERCICIOS_VALIDADOS`):
| Fuente / Archivo | Ejercicios | Descripción |
|---|:---:|---|
| `js/ejercicios-validados-base.js` | 398 | Base canónica inicial de CampoBase |
| `js/ejercicios-nuevo-formato.js` | 12 | Primer lote convertido al nuevo formato |
| `js/ejercicios-nuevos-lotes.js` | 60 | Lotes complementarios validados |
| `js/ejercicios-lotes-151-650.js` | 829 | Lotes 151 al 1000 consolidados |
| **Total Catálogo Oficial** | **1.239** | **Ejercicios validados y certificados** |

*Nota sobre la vista en la App:* Si el usuario tiene registros personalizados creados localmente en IndexedDB (`recordType === 'exercise'` no pertenecientes al catálogo oficial), la app muestra `(1.239 + N)`. Con 2 ejercicios personales, el total visible es **1.241**.

---

## 2. Última Integración: Lotes 801 al 1000 (179 Ejercicios)

- **Origen**: `/Users/miguelperez/Documents/Codex/2026-09-09/files-mentioned-by-the-user-figuras/outputs/CampoBase_Documentos/`
- **Lotes procesados**:
  - `801-850`: 50 ejercicios (`f7-1999348` a `f7-1999397`) — 100% clasificados como **Lúdicos** (`ludico: true`).
  - `851-900`: 50 ejercicios (`f7-1999294` a `f7-1999347`).
  - `901-950`: 50 ejercicios (`f7-1999244` a `f7-1999293`).
  - `951-1000`: 29 ejercicios (`f7-1999215` a `f7-1999243`).
- **Control de calidad aplicado**:
  - Cero colisiones de ID con el catálogo previo.
  - Eliminación absoluta de textos automáticos tipo *"Aplicar la regla documentada:"*.
  - Ocultación de identificadores técnicos (`f7-...`) en la interfaz de usuario.
  - Miniaturas copiadas a `library-v2/assets/previews/`.
  - Vídeos MP4 copiados a `library-v2/assets/videos/`.
  - Manifiesto de GitHub Releases (`scripts/github-release-video-manifest.json`) actualizado con 1.252 entradas.

---

## 3. Causa y Resolución de la Incidencia "1062 en la app"

### Diagnóstico de la Causa Raíz:
1. El usuario reportó ver **1062 ejercicios** en la app.
2. 1062 correspondía con exactitud matemática a: **1060 del catálogo anterior** + **2 ejercicios locales personales**.
3. El Service Worker (`sw.js`) de la PWA retenía la caché anterior (`campobase-v2.44.0-...-20260924-v59...`).
4. `sw.js` no incluía `js/ejercicios-lotes-151-650.js` en `ASSETS` ni en `REVALIDATE_PATHS`.

### Solución Implementada:
1. **Actualización de `sw.js`**:
   - Clave `CACHE` renovada a `...-v60-lotes-151-1000`.
   - Incorporación de `./js/ejercicios-lotes-151-650.js` en `ASSETS`.
   - Incorporación de `'/js/ejercicios-lotes-151-650.js'` en `REVALIDATE_PATHS`.
2. **Purga automática en Localhost**:
   - En `js/app.js` (`isLocal`), además de desregistrar el SW, se invoca `caches.delete()` sobre todas las claves de caché para evitar bloqueos por caché obsoleta durante el desarrollo.
3. **Verificación**: Servidor en puerto 8766 entrega los 1.239 ejercicios validados.

---

## 4. Entorno de Ejecución y URLs Operativas

- **Directorio del Proyecto**: `/Users/miguelperez/Desktop/HERMES/PrograMARIO/01_PROYECTOS/campobase`
- **Servidor Local Activo**: Puerto `8766` (`python3 -m http.server 8766`)
- **URLs de Verificación (Clickables)**:
  - App Principal: [http://localhost:8766/index.html#ejercicios](http://localhost:8766/index.html#ejercicios)
  - Vista Previa Biblioteca: [http://localhost:8766/preview-ejercicios.html](http://localhost:8766/preview-ejercicios.html)

---

## 5. Especificaciones SDD Activas
- `specs/001-integracion-ejercicios-801-1000/`:
  - `spec.md` (Especificación funcional y técnica de la integración)
  - `plan.md` (Plan de arquitectura y despliegue)
  - `tasks.md` (Control de tareas e hitos)
