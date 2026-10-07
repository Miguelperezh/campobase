# Actualización fluida y estados realizados

Solicitud: reducir la espera al entrar con titular/delegado, actualizar sin expulsar ni alterar formato/colores y conservar sesiones/asistencias realizadas al salir y volver a entrar.

Alcance: mantener diseño y funciones validados. No escribir ni sembrar datos de producción; no modificar PIN, permisos, RLS o esquemas. La autorización vigente permite publicar código en main/Pages después de validar.

Hallazgos: Actualizar ocultaba errores y navegaba de nuevo; el contexto de equipo se consultaba repetidamente en una descarga; se construían tarjetas del catálogo oculto; distintos módulos interpretaban de forma diferente los marcadores históricos de sesión realizada. El diálogo podía cerrarse antes de completar la carga. Consulta Supabase de solo lectura: 11 sesiones vigentes, 10 completed=true/status=closed y esas 10 con asistencia vinculada vigente. No hay evidencia de borrado de esos registros.

Criterios: conservar acceso, vista, datos, colores y estados tras Actualizar/recarga; no convertir un fallo de red en éxito ni abrir una app vacía sin datos; unificar la lectura histórica sin migraciones. La caché de contexto dura 5 segundos, depende de cliente/cuenta y excluye fallos. El polling de permisos continúa vigente.
