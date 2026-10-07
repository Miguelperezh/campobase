# Especificación SDD 014: Corrección de PDF de Plan de Partido, Minutos Reales, Edición de Tramos y Personalización Visual En Vivo

## 1. Contexto y Diagnóstico del Problema

Tras la auditoría visual con las capturas aportadas por el entrenador (Migue), se han identificado los siguientes fallos críticos:

### 1.1 PDF de Impresión de Plan de Partido Roto y Desbordado
- **Causa técnica**: La Hoja 1 (`cbx-pmp-page-1`) desborda la altura A4 (297 mm / 1122 px) cuando existen múltiples ventanas de cambios con muchos jugadores por ventana (en Alevines F7 es completamente válido y reglamentario cambiar desde 1 hasta los 7 jugadores a la vez). `generatePdfBlob` recortaba rígidamente a `finalHeight = Math.min(imgHeight, 297)`, partiendo por la mitad el texto y los elementos del minuto final (ej. minuto 50′ cortado en «Relevo bajo palos»).
- **Flexibilidad de sustituciones en Alevines (de 1 a todos)**: En fútbol base / Alevines, las sustituciones son volantes e ilimitadas. La app y el plan deben admitir y representar con total fidelidad cualquier volumen de cambios (desde 1 solo jugador hasta el bloque completo de 7), calculando con exactitud los minutos reales jugados sin truncar ni desbordar la hoja física de impresión.

### 1.2 Reparto por Tramos en Convocatoria No Editable
- En Convocatoria, la tarjeta «PLAN POR TRAMOS» se mostraba como un bloque estático que indicaba «No hay cambios previstos» y dejaba a la mitad de los convocados con 0 minutos si no se había configurado previamente en Preparación de partido.
- No ofrecía un botón directo para editar los tramos, cambiar de modo («Escalonado» vs. «Por partes») ni generar la rotación equitativa directamente desde la propia vista de Convocatoria.

### 1.3 Carencia de Previsualizaciones En Vivo y Controles Inmutables
- **Textos y fondo de 1.er lanzador / especialistas**: Fijos con fondo rojo e inmutables, sin selectores para color de fondo ni de texto.
- **Colores de los dorsales**: Los números de los jugadores en Plantilla, Convocatoria y fichas no disponen de controles propios de fondo y texto.
- **Botón de WhatsApp**: El color del texto no se puede editar o queda fijado por reglas de CSS con `!important`.
- **Falta de previsualizaciones inmediatas (WYSIWYG)**: El usuario no puede ver en directo cómo queda cada elemento al lado o debajo del control mientras lo ajusta.

---

## 2. Requerimientos Funcionales y de Interfaz

### R1. Paginación y Diseño Dinámico del PDF de Plan de Partido
1. El renderizador `buildMatchPlanHtml` debe calcular la altura o cantidad de momentos para distribuir limpiamente las secciones en páginas A4 (`cb-print-page`) sin recortar líneas ni cajas.
2. Cada bloque de momento (`cbx-pmp-moment-card`) debe tener un diseño compacto y seguro para impresión (`break-inside: avoid`), asegurando que ninguna ventana quede cortada horizontalmente entre hojas.
3. Si un partido cuenta con 3 o más momentos de cambio explicados, el cronograma debe paginar con fluidez o distribuirse para que la Hoja 1 y la Hoja 2 mantengan márgenes y pie de página limpios.

### R2. Rotación Flexible en Alevines (de 1 a Todos) y Edición de Tramos en Convocatoria
1. **Flexibilidad total de cambios (1 a todos)**:
   - En Alevines y F7, el entrenador puede planificar ventanas con cualquier número de sustituciones (desde 1 jugador puntual hasta cambiar el bloque completo de 7).
   - El sistema calcula con total exactitud los minutos acumulados y los porcentajes de partido de cada convocado según los momentos reales definidos.
2. **Edición interactiva en Convocatoria**:
   - Botón directo «✏️ Editar tramos / cambios» en la cabecera de «PLAN POR TRAMOS» que permite acceder al editor de rotaciones o modificar directamente los momentos.
   - Botón «⚡ Generar rotación equitativa» si el plan está vacío («No hay cambios previstos»), rellenando al instante la rotación para todos los convocados según el modo preferido (escalonado o por partes).
   - Selector interactivo funcional para conmutar entre «Escalonado» y «Por partes».

### R3. Personalización Completa y Previsualizaciones En Vivo (Ajustes)
1. **Nuevos controles dedicados en Ajustes**:
   - **Especialistas y Lanzadores**:
     - Color de fondo de «1.er lanzador / capitán» (`--sp-lead-bg`).
     - Color de texto de «1.er lanzador / capitán» (`--sp-lead-ink`).
     - Color de fondo de «2.º / 3.er lanzador» (`--sp-sub-bg`).
     - Color de texto de «2.º / 3.er lanzador» (`--sp-sub-ink`).
   - **Dorsales de Jugadores**:
     - Color de fondo de dorsal (`--dorsal-bg`).
     - Color del número/texto de dorsal (`--dorsal-ink`).
   - **Botón de WhatsApp**:
     - Color de fondo (`--wa-bg`, permitiendo personalizar o mantener verde WhatsApp).
     - Color de texto (`--wa-ink`).
2. **Mini-Previsualizaciones En Vivo (WYSIWYG)**:
   - Debajo o al lado de cada grupo de ajuste, incorporar una muestra visual real en tiempo real que reacciona instantáneamente (`oninput` y `change`) a los cambios de color, fuente y fondo:
     - Muestra en vivo de tarjeta de Lanzador con su distintivo y dorsal.
     - Muestra en vivo de Dorsales de jugadores (en campo y convocados).
     - Muestra en vivo del botón de WhatsApp con su texto y fondo actualizados.
     - Muestra en vivo de tarjetas, fondos y textos generales.

---

## 3. Criterios de Aceptación

- [ ] El PDF exportado de Plan de Partido no corta ninguna línea, texto ni bloque de momento a la mitad.
- [ ] Los minutos calculados en la tabla del PDF y en Convocatoria reflejan los minutos reales exactos jugados por cada convocado (reparto equitativo).
- [ ] En Convocatoria es posible generar y editar la rotación de tramos sin pantallas congeladas.
- [ ] En Ajustes existen selectores de color para «1.er lanzador», dorsales y botón de WhatsApp, con previsualización visible y reactiva en el acto.
- [ ] Los 666+ tests unitarios y de integración pasan al 100% en `npm test` y 0 errores en `npm run check`.
