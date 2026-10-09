# SDD047 · Colores guardados en Partido en vivo

Miguel informa que sus colores siguen sin respetarse. Corregir únicamente la aplicación visual de las preferencias existentes, para entrenador y delegado en ordenador/móvil. Conservar datos, PIN, permisos, planes y colores persistidos. No escribir pruebas en Supabase.

Criterios: fondo/texto elegidos prevalecen sobre CSS fijo; los controles del marcador, reloj, goles y filas apuntan al DOM real; elecciones antiguas siguen funcionando; delegado recibe preferencias del partido sin editarlas; regenerar el panel no pierde colores. Mantener preferencias explícitas anteriores de Modo Campo.
