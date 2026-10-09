# Delegado remoto con PIN existente

Miguel confirma que el delegado entra con PIN 0000. No exigir correo como interfaz de acceso ni cambiar su PIN. El rol local delegado existe; no equivale a cuenta autenticada remota.

## Resultado requerido
- Validar en servidor el PIN configurado del delegado, vinculado al equipo correcto.
- Sesión propia limitada del delegado; nunca sesión/JWT del propietario.
- Leer permisos vigentes del propietario en cada operación protegida; quitar un permiso debe retirar acceso remoto, no solo ocultar pestaña.
- Colores: solo lectura para delegado. Conservar exactamente los ajustes del propietario.
- Permitir únicamente escrituras que correspondan a los permisos otorgados, incluidos eventos de partido en vivo cuando estén autorizados.
- Mantener los datos, sesiones, asistencias, planes, colores, PIN e IDs existentes.
- No usar 0000 como llave universal de todos los equipos. Resolver equipo por vínculo explícito; resolver ambigüedad sin divulgar equipos.
- Límite de intentos y sesiones independientes en escritorio y móvil. Ningún secreto de administrador en cliente.

## Evidencia
completePinLogin autentica en nube solo role=owner. getConfiguredPinRole reconoce 0000 localmente. pin-login desplegado v3 valida ownerPinHash exclusivamente; lectura agregada anterior muestra 0 miembros delegate. No modificar la función para entregar token owner a quien introduzca PIN delegado.

## Autorización confirmada
Miguel respondió «sí» a la adaptación de autenticación del servidor, sesión propia, permisos y conservación de datos. Permite identidad técnica y vínculo existente, reglas restrictivas y funciones. No permite editar datos, colores ni preasignar permisos reales. Ambos roles comparten los registros del mismo titular; ordenador y móvil sincronizan en ambas direcciones dentro de los permisos otorgados.
