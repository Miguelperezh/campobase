# Plan

1. Releer los calendarios y comprobar los 16 payloads remotos por todos sus campos frente al lote cotejado, sin reescribirlos.
2. Derivar las anotaciones `calendarRest` desde el snapshot de ajustes de la cuenta actual. Renderizar solo dentro de Calendario y sus filtros/mes, separadas de los flujos deportivos.
3. Permitir lectura remota de esas anotaciones al delegado únicamente bajo su permiso Calendario vigente; mantener denegadas las mutaciones.
4. Versionar exclusivamente el código cambiado y los consumidores necesarios. Documentar sin alterar secciones ajenas de los manuales.
5. Validar sintaxis, suite y recorridos de calendario. Revisar e integrar por PR, desplegar la lectura compatible y el cliente, y comprobar recursos públicos.
6. Insertar las dos anotaciones con propietario explícito, comprobación de identidad y operación aditiva. Comparar contenido de partidos y versiones de otros registros antes/después; no descomprimir el historial pesado para calcular huellas.
