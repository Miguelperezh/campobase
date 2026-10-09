# Plan de implementación autorizada del servidor

1. Mantener acceso visible por PIN 0000 y vinculación de equipo existente.
2. Implementar validación del PIN del delegado con identidad separada y acceso restringido; no compartir sesión propietario.
3. Hacer cumplir permisos actuales y prohibición de edición de colores en servidor.
4. Conectar sesión a cola durable de sincronización existente.
5. Validar PIN erróneo, ambigüedad, concesión/retirada, colores solo lectura, eventos bidireccionales y recarga en sesiones independientes.
6. Publicar código/servicio sin alterar registros existentes. Comprobar en dispositivos físicos antes de declarar piloto validado.
