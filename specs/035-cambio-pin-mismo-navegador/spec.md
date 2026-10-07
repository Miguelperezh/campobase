# Cambio de PIN en el mismo navegador
Problema: los permisos concedidos/retirados al delegado no se reflejan al cambiar entre tres PIN. La salida por PIN también desconecta la cuenta SaaS, y restauraciones asíncronas pueden reabrir la app con un rol anterior.

Requisitos: mantener la conexión del equipo al bloquear el acceso PIN; resolver titular/delegado/demo desde la configuración actual; impedir que una restauración antigua cambie el rol elegido; respetar los permisos guardados por el usuario. Ambas pantallas de PIN usan el mismo camino validado. No modificar PIN ni permisos manualmente, datos, esquema o RLS. La salida completa de cuenta conserva su comportamiento.
