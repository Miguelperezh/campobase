# Validación SDD060 — 23/10/2026

- Reproducción anterior en navegador: escribir 17:50 mantenía 18:15 en el texto generado; la comparación exacta del mensaje fallaba. Fuente anterior servida solo en la prueba local, sin cambiar producción.
- `npm run check`: correcto. `npm test`: 925/925 correctas.
- Regresión de plantilla: grupo y familia, los tres tonos; comparar el mensaje entero demuestra que cambia únicamente la hora. Sin inicio mantiene hora explícita; sin hora propia conserva cálculo y «Por confirmar».
- `node tests/browser-whatsapp-call-time.mjs`: app completa a 1440 y 390 px, cero errores de página. Citación inicial −45 min; cambio de inicio recalcula mientras no se edite la citación; edición manual inmediata y conservada ante otros cambios. Copia y URL de envío usan el texto actual y respetan una nota libre. Otro partido y retorno de pestaña cargan su horario propio, incluido 00:20 → 23:35.
- Prueba con IndexedDB aislada y registros sintéticos completos. Los registros antes/después son iguales. Nube bloqueada, enlaces interceptados: ningún mensaje enviado ni escritura en cuentas reales. Esto no sustituye una prueba física con el teléfono del usuario.
- Recursos nuevos versionados con `20261023-whatsapp-call-time-1`; sin borrado de IndexedDB/localStorage.

Publicación: pendiente de CI, fusión y comprobación pública.
