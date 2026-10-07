# Especificación 001: Integración de Ejercicios (Lotes 801 al 1000) y Sincronización de Caché

**Estado**: Implementado y Validado  
**Fecha**: 04/10/2026  
**Módulo**: Biblioteca de Ejercicios / PWA Offline  

---

## 1. Contexto y Problema
En la última sincronización, el usuario informó que la aplicación mostraba **1062 ejercicios** en lugar del catálogo completo esperado. La causa raíz fue doble:
1. Existencia de lotes pendientes de integración (lotes 801 a 1000 con 179 nuevos ejercicios) en la carpeta de documentos.
2. Persistencia de caché en el Service Worker (`sw.js`) de la PWA, que continuaba sirviendo el catálogo previo de 1060 ejercicios (+ 2 ejercicios personales guardados por el usuario = 1062) debido a que `sw.js` no incluía `js/ejercicios-lotes-151-650.js` en su lista de revalidación ni se había renovado la clave de caché.

Adicionalmente, se requiere adherencia estricta al sistema **SDD (Spec-Driven Development)** y asegurar que no aparezcan textos residuales automáticos ni identificadores técnicos en la interfaz de usuario.

---

## 2. Objetivos y Requisitos

### R1. Integración de Contenido (Lotes 801 a 1000)
- Ingestar los ejercicios de los lotes 801-850, 851-900, 901-950 y 951-1000 procedentes de `CampoBase_Documentos`.
- Total de nuevos ejercicios: **179** (elevando el catálogo oficial de 1.060 a **1.239**).
- Conservar e integrar activos multimedia correspondientes:
  - 179 miniaturas PNG en `library-v2/assets/previews/`.
  - 179 vídeos MP4 en `library-v2/assets/videos/`.

### R2. Limpieza y Calidad de Textos
- **Cero textos automáticos**: Eliminar cualquier aparición del prefijo *"Aplicar la regla documentada:"*.
- **Cero identificadores técnicos en la interfaz**: Ocultar códigos internos (ej. `f7-1999598`) en títulos y tarjetas visibles.
- **Normalización**: Asignar `formato_juego` canónico (`futbol_7`, `futbol_11`, `todos`) y clasificar rigurosamente los 50 ejercicios del lote 801-850 con `ludico: true`.

### R3. Resolución de Caché y Entrega PWA
- Actualizar `sw.js`:
  - Registrar `./js/ejercicios-lotes-151-650.js` en `ASSETS`.
  - Registrar `'/js/ejercicios-lotes-151-650.js'` en `REVALIDATE_PATHS`.
  - Incrementar la versión de `CACHE` (`...-v60-lotes-151-1000`).
- Purga automática en entorno local (`localhost`): eliminar cachés obsoletas de `window.caches` al arrancar.

### R4. Calidad y Verificación
- Suite de pruebas de regresión 100% verde (`npm test` con 574 tests).
- Verificación de sintaxis (`npm run check`).
- Proveer URLs clickables de previsualización al usuario.
