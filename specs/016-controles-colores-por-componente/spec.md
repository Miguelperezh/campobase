# SDD 016 — Colores configurables por componente

## Alcance autorizado (4 de octubre de 2026)
Corregir exclusivamente colores y controles por pestaña/subpestaña y el desbordamiento de los botones de sesiones. Preservar diseño, datos, navegación y funciones validadas. Trabajar en rama aislada; desplegar únicamente campobase-preview. Main original y Supabase productivo quedan intactos.

## Criterios de aceptación
- Rueda de ajustes accesible en cada pantalla; ventanas de ejercicios y comunicador con ajustes propios.
- Fondos, fuentes y acentos por pantalla; cada botón puede configurar fondo y texto de forma independiente.
- Convocatoria: separar + Convocatoria, cabecera del rival, convocados, fuera y estados del selector del plan.
- Sesiones: colores de cada acción y textos efectivos; botones dentro del ancho de tarjeta.
- Biblioteca y ficha: textos inferiores y cierre configurables.
- Menú lateral y navegación inferior con controles distintos.
- Preferencias conservadas tras refresco y nuevas renderizaciones. Restablecer un botón no borra otros colores.

## Clarificaciones
El usuario pide conservar todo lo validado. No se introducen cambios de biblioteca, sesiones, datos, autenticación ni backend. Se reutiliza settings.theme y la protección de escritura de la preview.
