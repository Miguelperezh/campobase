# Validación
La prueba aislada ejecuta los módulos reales con un SDK sintético desde el inicio. Cambia permisos en `cb-delegate-permissions-form`, cierra con botones reales, recarga y alterna titular/delegado/demo. Comprueba acceso permitido/denegado y menús reales de escritorio y móvil. No hay escrituras remotas, ni permisos reales preasignados.

Cuenta sintética activa para evitar que el diálogo de facturación interfiera con la entrada PIN. La prueba no acredita una entrada remota en un dispositivo sin sesión SaaS. Sintaxis y 722 tests pasan. Regresión de navegador pasa, también ante una nueva respuesta de contexto coach mientras el PIN delegado está activo. Pendientes: CI y versión pública servida.
