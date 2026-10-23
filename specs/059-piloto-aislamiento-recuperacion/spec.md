# Piloto para clubes y entrenadores

Miguel quiere ofrecer CampoBase en piloto y exige evitar pérdida o mezcla de datos. Confirma un equipo por cuenta para empezar. Cada titular conserva sus datos, colores y planes; el delegado mantiene identidad propia y exclusivamente permisos concedidos.

Prioridad de esta entrega: seguridad y recuperación antes de ampliar funciones o rediseñar. Auditoría de código y servidor con consultas de lectura; nunca usar datos reales para probar escrituras.

## Criterios de aceptación

- Una lectura o subida iniciada en A no puede terminar sobre B aunque cambie la cuenta, el PIN o el rol durante una espera. Tampoco puede renderizarse A en la pantalla de B.
- Un error de red/cuota no importa datos de una base histórica sin acreditar procedencia. Las colas y sus versiones no se pierden en recuperaciones fallidas.
- Compartir acceso móvil no comparte credenciales, tokens ni la identidad del titular. El móvil exige su acceso propio.
- Restaurar JSON valida formato, procedencia, cuenta y rol antes de escribir, muestra resumen/confirmación y conserva una copia previa recuperable. Una copia no autentica ni vincula cuentas.
- Delegados por correo y PIN usan autorización de servidor por membresía y permisos actuales. REST no les concede acceso de titular.
- Vídeos: lectura de biblioteca existente conservada; escritura autenticada únicamente sobre archivos propios, nunca anónima ni ajena. No mover ni borrar vídeos al desplegar.
- Conservar formato, menús y preferencias; información de guardado/nube fiel al resultado real.
- Probar casos A/B con IDs coincidentes, peticiones retenidas, revocación, desconexión y recarga en navegador aislado a 1440/390. No prometer disponibilidad absoluta ni móvil físico validado.
- Publicar solo correcciones probadas, con SDD, AGENTS/agente y trazabilidad. Las reglas de servidor cambian solo tras revisión del SQL, pruebas de autorización sin escritura deportiva y comparación de integridad antes/después.
