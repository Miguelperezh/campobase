# Validación

Las preferencias actuales sí existen en configuracion/main. Dos mezclas causaban divergencia: refresh incorporaba claves exclusivas de campobase.theme local; mergeCloudRecord daba prioridad a la paleta local por el updatedAt general, y podía volver a subirla. La resolución visual también conservaba secciones retiradas del dispositivo.

Se selecciona el tema canónico completo cuando existe, incluyendo {}. Solo ausencia histórica del campo permite fallback. Presets, matchPreset y sem explícitos del snapshot se respetan; cola pendiente mantiene edición legítima sin red. Alias delegado añade IDs de herramientas tácticas equivalentes. No se cambia ningún registro remoto ni colores guardados, permisos, PIN, motores/planes/diseño.

Navegador aislado: DOM/hojas completas, 1440 y 390px, caché contradictoria de fuente y delegado. La caché no contamina state.settings.theme; regeneración conserva colores. Otra prueba usa una copia de la paleta real leída, sin almacenar datos personales ni tema en el repositorio: cabecera roja, botón automático negro/texto blanco y nombres negros coinciden entre vistas. Conexiones externas bloqueadas en pruebas; no constituye móvil físico ni escritura real.
