# Vivo: plan guardado, colores y sincronización

## Alcance autorizado
El automático del entrenador y delegado aplica la siguiente ventana completa del plan guardado, con entradas, salidas y recolocaciones. No inventa reparto si hay plan, no adelanta ventanas automáticamente y pide confirmación. Manual permite desviación explícita. Mantener GOOOL/PARADÓN, avisos, aplicar/aplazar y edición de preparación. No modificar datos existentes, minutos, colores ni planes mediante pruebas.

Colores: ajustes persistidos prevalecen sobre caché antigua en cualquier dispositivo; vista previa explícita sigue temporal. Delegado no abre editor; solo entrenador (o demo aislada) guarda. Permisos concedidos/retirados aplican navegación vigente tras sincronización. Diseño Claude móvil y dashboard sin recortes según SDD044.

## Criterios
- Ventanas hechas/aplazadas no bloquean el siguiente aviso; cerrar aviso no borra ventana.
- Con plan agotado/aplazado, automático no vuelve al balance genérico.
- Sin plan, conservar automático existente.
- Ajustes del dispositivo no ocultan colores recibidos.
- No anunciar sincronización real probada a partir de nube simulada.

## Bloqueo remoto confirmado en lectura
09/10/2026: Supabase pin-login publicado ACTIVE v3 valida ownerPinHash exclusivamente. Consulta agregada equipo_miembros role=delegate: 0 cuentas. PIN local no equivale a sesión remota del delegado. No se ha creado usuario, otorgado permiso, compartido JWT del dueño ni cambiado backend/RLS. Hace falta cuenta propia del delegado con acceso limitado y autorización para activarla; no dar por garantizado piloto entre dispositivos físicos.
