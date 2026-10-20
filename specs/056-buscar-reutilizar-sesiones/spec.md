# Buscar y reutilizar sesiones

La petición de mejoras se concreta en dos necesidades del entrenador: localizar sesiones guardadas y reutilizar una preparación sin sobrescribir la anterior. Se mantiene el diseño, colores, contenidos, permisos y funciones validadas.

- Buscador local por nombre, campo, fecha, notas y ejercicio; filtros Todas/Pendientes/Realizadas y contador de resultados. Estado solo en memoria, sin escrituras ni dependencia de red. El buscador general debe funcionar por sesión, no por el grupo entero.
- Reutilizar sesión abre una nueva preparación editable con los mismos bloques, tiempos, consignas, material y notas, con fecha local actual que el usuario puede cambiar. No copia ID, realización, asistencia, cronómetro ni datos de cuenta. Solo Guardar sesión crea un nuevo registro.
- Si existe un borrador abierto, pedir confirmación antes de sustituirlo. Cancelar conserva el borrador y no escribe. Si faltan ejercicios, no sustituirlos por otros silenciosamente; informar y conservar original.
- Búsqueda no oculta controles para recuperar resultados. Móvil 390 px sin recortes. Delegado conserva exactamente sus permisos: no se añade creación/borrado.
- Pruebas únicamente en bases aisladas; ninguna sesión real se borra, duplica ni modifica para verificar.
