# SDD064 — Borrar un jugador desde Plantilla

El botón Borrar de cada ficha debe permitir al entrenador retirar ese jugador de su plantilla. La confirmación muestra el nombre y el dorsal cuando esté disponible. Cancelar conserva la ficha. Confirmar actúa sobre el identificador de esa ficha en el equipo abierto y conserva los registros de partidos, convocatorias, planes y asistencias. Los jugadores homónimos se distinguen por ID. El delegado conserva sus permisos de lectura. La demo utiliza exclusivamente sus datos aislados.

El resultado local es visible al confirmar, incluso sin conexión. La eliminación se envía con la cola existente y se representa en la nube mediante la marca de baja habitual. Un cambio de cuenta, PIN o ficha durante la confirmación exige volver a abrirla. Las pruebas usan únicamente registros ficticios.
