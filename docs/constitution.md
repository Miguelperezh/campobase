# Constitución de CampoBase (`docs/constitution.md`)

Este documento define los principios fundacionales, inmutables y no negociables del proyecto **CampoBase**. Cualquier desarrollo, refactorización o ampliación técnica debe someterse a esta constitución.

---

## 1. Principios Fundacionales No Negociables

### I. Local-First Estricto
- La aplicación **debe funcionar de forma instantánea y completa offline**.
- La base de datos primaria en cliente es **IndexedDB** (`js/db.js`). 
- Nunca se bloqueará la interfaz de usuario ni la renderización esperando peticiones de red o servicios en la nube.
- Toda escritura se persiste localmente primero y se despacha a la cola de sincronización asíncrona en segundo plano sin interrumpir la experiencia táctil.

### II. Cero (0 €) Coste de Almacenamiento y Operación
- Ninguna funcionalidad añadida debe incrementar costes fijos o variables de infraestructura.
- Los recursos estáticos multimedia (vídeos demostrativos, esquemas o assets) se consumen directamente o se integran de manera ligera y desacoplada sin requerir hosting de pago (utilizando GitHub Releases para almacenamiento ilimitado a coste cero).

### III. Cero Dependencias Runtime Pesadas
- CampoBase se fundamenta en **Vanilla JavaScript nativo (ES Modules)**, HTML5 semántico y CSS3 puro con Custom Properties.
- No se admiten frameworks pesados (React, Angular, Vue) ni librerías de componentes que degraden el rendimiento en terminales móviles o tabletas a pie de campo.

### IV. Suite de Tests Automatizados al 100% en Verde
- Ningún commit, cambio ni despliegue puede romper la suite de tests existente (`npm test`).
- Todo cambio estructural, de dominio o de interfaz crítica debe acompañarse de sus tests unitarios y de integración correspondientes ejecutados sobre Node.js nativo (`node:test`).
- La ejecución de `npm run check` (sintaxis y referencias) debe mantenerse limpia de advertencias y errores.

### V. Fidelidad Absoluta al Diseño Validado y Metodología Oficial
- Los formatos de exportación, fichas de trabajo, pizarras tácticas y dossiers A4 para entrenadores deben replicar con exactitud milimétrica las especificaciones validadas.
- La experiencia visual en pantalla (vista previa) debe ser idéntica al resultado físico impreso (`Vista Previa === Impresión`).
- La taxonomía, códigos de rol (Portero, Defensa, Atacante, Neutro, Entrenador), tipografías, jerarquía y espaciados son canónicos.

---

## 2. Flujo de Desarrollo Dirigido por Especificaciones (Spec-Driven Development — SDD)

A partir de la versión v60, todo nuevo requerimiento o corrección debe seguir el ciclo formal:

1. **Constitución (`docs/constitution.md`):** Validación de encaje con los principios fundamentales.
2. **Especificación (`specs/<id>/spec.md`):** Definición detallada del requerimiento, contexto, criterios de aceptación y casos límite.
3. **Plan de Arquitectura (`specs/<id>/plan.md`):** Diseño técnico, análisis de impacto, archivos afectados y estrategia de regresión cero.
4. **Lista de Tareas (`specs/<id>/tasks.md`):** Desglose atómico de tareas con checkboxes de verificación y trazabilidad directa con tests.
5. **Implementación y Verificación:** Ejecución de código, paso de linter (`npm run check`) y suite de tests completa (`npm test`).
6. **Registro en Agente (`agente.md`):** Documentación técnica concisa de la entrega preservando el historial previo.

---

## 3. Delimitación de Ámbitos y Enfoque de Tarea
1. **Aislamiento de módulos**: Si una tarea concierne a la biblioteca de ejercicios, el agente debe operar exclusivamente sobre la gestión, normalización, conversión, almacenamiento y visualización de ejercicios.
2. **No injerencia en Fase 1 / Partido**: Queda prohibido alterar la lógica de partidos en vivo, actas, convocatorias, cronómetros, rotaciones de minutos o pizarras tácticas cuando se trabaja en ejercicios u otros subsistemas independientes.

---

## 4. Estándares de Contenido y Calidad en Ejercicios
1. **Orden en biblioteca («en la punta de arriba»)**: Los últimos ejercicios introducidos en la app deben figurar siempre al inicio absoluto del catálogo (`EJERCICIOS_VALIDADOS`) para aparecer los primeros al entrar a la biblioteca.
2. **Prohibición de textos técnicos y residuales**:
   - Nunca deben aparecer cadenas de scraping o prompts automáticos como *"Aplicar la regla documentada:"*.
   - Los textos de objetivos, desarrollo (*como_se_hace* / *fases*) y variantes deben estar completamente redactados en lenguaje técnico futbolístico claro y profesional.
3. **Ocultación de códigos técnicos en la interfaz**:
   - Códigos internos como `f7-1999598` o prefijos técnicos nunca deben exponerse al usuario en títulos, subtítulos ni tarjetas visibles. Los títulos deben ser futbolísticos y limpios (ej. *"Finalización 2 vs 2 con porteros"*).
4. **Taxonomía y metadatos**:
   - `formato_juego` debe normalizarse siempre (`futbol_7`, `futbol_11`, `todos`).
   - El flag `ludico: true` debe activarse ante cualquier contenido de calentamiento lúdico, juego recreativo o mención a dinámicas lúdicas (`/l[uú]dic/i`).
   - Categorías principales: *Calentamiento*, *Técnica*, *Táctica*, *Físico*, *Porteros*, *Acciones a balón parado*.

---

## 5. Comunicación y Enlaces Interactivos
1. **URLs siempre clickables**: Todas las direcciones web y enlaces locales provistos al usuario en las respuestas del agente deben formatearse obligatoriamente como enlaces Markdown clickables (`[Texto descriptivo](http://...)` o `<http://...>`).
2. **Claridad en los conteos de catálogo**: Explicar siempre con precisión el desglose de los ejercicios mostrados: catálogo oficial validado vs. ejercicios personales del usuario (*Mis ejercicios* guardados en IndexedDB local).
