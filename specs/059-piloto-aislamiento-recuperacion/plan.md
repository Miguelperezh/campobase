# Plan de protección para el piloto

1. Auditar cliente, colas, copias, roles y políticas reales con lectura. Reproducir fallos en IndexedDB y cuentas ficticias.
2. Fijar contexto de identidad/base/revisión por operación y revalidarlo después de cada espera y antes de transacción/petición. Reconciliar sobre la base capturada, no sobre la cuenta que esté activa después.
3. Desactivar migración automática de legacy sin pertenencia; conservar versiones en cola y pedir recuperación explícita acreditada.
4. Copias con propietario/manifiesto, validación previa y recuperación atómica local. Enlace de móvil sin secretos y sin autenticación por datos de URL.
5. Delegados: contexto servidor canónico, misma ruta filtrada para correo/PIN, restricciones de servidor por membresía. Storage: escrituras propias autenticadas. Mantener servicio de lectura y RPC validados.
6. Vista y cachés por cuenta; no aceptar respuestas antiguas ni usar preferencias ajenas como valores de una cuenta nueva. Lecturas no reparan resultados deportivos automáticamente.
7. Pruebas unitarias y reales de navegador aislado, revisión, CI, despliegue gradual compatible, comprobación pública y de integridad remota. Documentar límites y operación del piloto.

Modelo actual mantenido: un titular por equipo y un delegado asociado. No añadir estructura multi-equipo/club compartida, seeds, cambios de PIN ni concesiones de permisos reales.
