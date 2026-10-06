# Plan
1. Extraer solamente SECTIONS del catálogo Claude, sin runtime exportado ni jugadores ficticios.
2. Adaptador semántico a DOM real, ampliado con inventario local para elementos existentes no representados. Las cabeceras de clasificación se leen de la tabla actual.
3. Editor vanilla con borrador en memoria. Preferencias nuevas uiParts aditivas dentro del mismo theme.views; compatibilidad con elementColors y tema legado. Aplicación al final, incluyendo GF/GC.
4. Reutilizar momentos, reparto, validación y exportador. Tramos individuales editables en memoria; al aplicar convertir a alineaciones completas actuales preservando IDs, posiciones y formación. Reutilizar savePreparacion.
5. Probar suite, navegador offline con copia de datos y Supabase bloqueado, escritorio/móvil; versionar recursos y publicar por PR/main/Pages autorizados.
