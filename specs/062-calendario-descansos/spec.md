# SDD062 — Jornadas de descanso en el calendario

Petición del 17/11/2026: volver a verificar los 16 partidos de Liga del Unión Viera Alevín D frente a los dos PDF y añadir las jornadas 6 y 15 como «Descansa». Conservar todos los datos, colores, planes y funciones existentes.

## Criterios

- Los 16 partidos ya incorporados conservan exactamente fechas, horas, rivales, condición, campos y enlaces de Maps cotejados. No se recrean ni actualizan.
- J6: 24/01/2027. J15: 18/04/2027. Son anotaciones de calendario, sin hora, rival, localía, resultado, campo ni mapa ficticios.
- Persisten como dos registros independientes de `settings`, `recordType: calendarRest`; nunca como partidos o entrenamientos. No crean convocatorias, asistencia, preparación, directo ni estadísticas.
- Calendario los muestra como «Descansa» en su fecha y jornada, en Todos/Liga y al seleccionar el día. Los descansos pasados permanecen visibles fuera del archivo de partidos jugados.
- Se reutiliza la presentación y el tema actuales. No se añaden menús de configuración ni rediseño.
- La cuenta titular recibe sus registros por la sincronización existente. El delegado solo puede leerlos si ya tiene el permiso Calendario; no se conceden permisos ni se permite escribirlos.
- Única escritura deportiva autorizada de esta continuación: insertar esas dos anotaciones ausentes en la cuenta del equipo confirmado. Conservar registros previos, incluidos los 16 partidos, ajustes y tombstones.
- Verificar datos en producción después de confirmar el lote y presentación con perfiles aislados a 1440/390. No enviar WhatsApp ni escribir datos de prueba en cuentas reales.
