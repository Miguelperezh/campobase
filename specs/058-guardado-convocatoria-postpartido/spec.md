# Guardado real de convocatoria y postpartido

Miguel informa de validación nativa «Selecciona un elemento de la lista» al guardar una convocatoria antigua y de falta de guardado en «Guardar y sincronizar todo», con datos añadidos después del partido.

- Resolver el partido de una convocatoria histórica sin `matchId` cuando su relación es inequívoca. No escoger por similitud ni modificar IDs.
- Mostrar el partido seleccionado y señalar claramente cualquier dato que impida guardar; conservar el borrador ante errores.
- Permitir guardar minutos, puntuaciones y comentarios sin marcador previo: resultado desconocido sigue pendiente, nunca se convierte en 0–0.
- Mantener validaciones deportivas, roles, protección de cuenta/conflictos, cola local y confirmación de nube.
- No tocar colores, planes, convocatorias ni datos reales por publicar código.

Aceptación: pulsar botones reales en app completa a 1440/390, crear/editar convocatoria heredada, partido sin marcador, errores visibles y corregibles, reabrir y comprobar persistencia; ambigüedad no escribe. Nube/IndexedDB de prueba aislados, sin operaciones sobre datos reales.
