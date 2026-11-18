# Plan

1. Medir producción sin cuenta con Chrome móvil, CPU y red limitadas; separar red, arranque, caché y renovación de sesión.
2. Reproducir fuentes bloqueantes, esperas del worker sobre caché y bloqueo del SDK con respuestas retenidas.
3. Corregir cargas iniciales y caché activa completa; deduplicar instalaciones, limitar concurrencia, conservar medios de la app y cachés ajenas.
4. Separar apertura local autorizada del titular de renovación remota, con guardias de cuenta/PIN/base/snapshot antes y después de cada espera. Revisión independiente de carreras.
5. Verificar fuentes y PDF reales, caché/offline/actualización, autenticación negativa, suite completa y recorrido general móvil/escritorio.
6. Revisar diff, publicar por PR y comprobar main, Pages y recursos públicos; repetir medición pública comparable.
