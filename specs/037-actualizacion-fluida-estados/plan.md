# Plan
1. Rama fix/fluid-refresh-session-state desde main cfc80295.
2. Reutilizar sincronización, almacenamiento, permisos y diseño actuales. Actualizar en la pantalla y agrupar llamadas; reducir trabajo de catálogo y contexto.
3. Normalizar en memoria los marcadores de realización, mantener la reapertura explícita coherente y esperar datos antes de desbloquear.
4. Probar con SDK sintético, red con demora y fallos, recargas, dos roles y 390px; repetir prueba de tres PIN y permisos para regresión.
5. Validar sintaxis/tests, CI y bytes públicos; publicar únicamente código/documentación. Nunca restaurar datos ficticios o copias antiguas en Supabase.
