# Plan
Módulo learning-ui separado, dominio puro, CSS limitado a aprendizaje. Sección añadida a #app y navegación Entreno/escritorio existente. Color bindings añade proveedor específico al editor común. Registros independientes por partido, jugador-fecha y fecha de bloque; nunca main/players/matches/trainingSessions. Guardar consulta versión previa y bloquea conflicto; borradores no se reconstruyen por refresh.

Versionar HTML/importaciones/PWA. Probar dominio y UI aislada con IndexedDB independiente, luego smoke aplicación demo y regresión check/test. No cambios a autenticación/permisos ni escrituras Supabase deportivas.
