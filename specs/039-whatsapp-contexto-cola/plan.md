# Plan
1. Extraer resolución pura de eventos y horario para compartirla entre formulario y generador.
2. Corregir filtros y datos de mensajes sin reescribir funciones validadas.
3. Confirmar mutaciones por contenido exacto y en la base que originó la subida; impedir que reparación de faltantes sustituya una mutación pendiente.
4. Probar casos de mensajes, filtros, tombstones y cola con red retenida y dos IndexedDB independientes.
5. Versionar app, plantillas, db y sync-core conjuntamente; comprobar CI y publicación de los archivos.
