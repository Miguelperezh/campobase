# SDD063 — Apertura con cobertura móvil

Petición del 18/11/2026: reducir la espera al abrir CampoBase fuera de Wi-Fi. Conservar datos, cuentas, permisos, PIN, colores, planes y diseño existentes.

## Criterios de aceptación

- La copia del código de la versión activa responde sin esperar una red lenta. Una actualización incompleta no sustituye una versión offline completa ni mezcla su HTML con otros módulos.
- La descarga de actualizaciones no compite con la primera pantalla: comienza tras los datos locales, con comprobación de emergencia si falla el arranque. Descargar una vez cada archivo físico y conservar las URLs históricas necesarias.
- Fuentes configurables no bloquean el arranque; herramientas PDF solo se cargan al imprimir. El PDF conserva modelo, escudo y colores y espera fuentes cuando corresponde.
- Titular con PIN local revalidado y snapshot de su propia cuenta puede abrir sin esperar la renovación remota. Delegados, primeras entradas y cuentas sin copia válida conservan las comprobaciones remotas. Las respuestas antiguas no cambian identidad o acceso.
- La activación inicial no recarga la página. Una actualización con usuario activo conserva el formulario y el directo actuales; la versión completa se abre en la siguiente navegación.
- No modificar filas de producción, semillas, permisos o planes. No limpiar IndexedDB ni preferencias. Pruebas aisladas, sin escrituras remotas.
- Medir antes/después y distinguir red simulada, pruebas causales y móviles físicos. No prometer acceso instantáneo para primeras descargas, dispositivos reales o red inexistente sin caché.
