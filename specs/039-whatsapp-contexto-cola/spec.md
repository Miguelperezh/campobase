# SDD 039 — WhatsApp, selección de eventos y conservación de cambios

Solicitud: texto pegado del 08/10/2026. Conservar las pantallas y ajustes validados y todos los datos reales. Autorización vigente para publicar código en main/Pages; no ejecutar escrituras, migraciones o semillas de Supabase.

## Requisitos
- Resolver exactamente match:id o callup:id. Nunca usar el primer partido o sesión cuando falle una selección.
- Usar campo, mapa y hora reales. Citación 45 minutos antes, incluso al cruzar medianoche. Datos ausentes se indican como pendientes de confirmar.
- Liga: jugadores numerados con dorsal y nombre completo; Descansan con viñetas sin motivos. Motivos solo en mensaje privado del excluido, sin campo, mapa u horas.
- Amistoso/torneo: toda la plantilla. Conservar elección de equipación, dos equipaciones completas, paseo, camiseta roja, agua y espinilleras.
- Entrenamiento: hora/campo reales, camiseta roja y balón identificado. Semana sin sesiones no inventa una programación; mantener varias sesiones del mismo día y el domingo.
- Selector genérico: excluir pasados, jugados y ya convocados. Excepción funcional: Enviar por WhatsApp desde una convocatoria ofrece únicamente ese contexto explícito; no muestra otros partidos.
- Guardado de convocatoria inmediato y durable en IndexedDB; subida de lote en segundo plano. Una respuesta antigua no puede borrar una edición posterior de la cola.
- Serializar subidas y reconocer tombstones remotos sin resucitar registros eliminados; conservar cambios pendientes.

## Fuera de alcance
No modificar diseño, colores guardados, permisos, PIN, equipos, fichas, biblioteca ni backend/RLS. No considerar una nube simulada prueba de autenticación real o de un móvil físico.
