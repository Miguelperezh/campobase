# FútbolControl — Fase 0 · Inventario y congelación de lo validado

Fecha: 2026-09-11
Rama de trabajo: `refactor/futbolcontrol-phase0-1`
Backup previo: `backup/pre-futbolcontrol-20260911`
Base: `main`

## Regla principal

Este cambio NO elimina, simplifica, sustituye ni reescribe funciones ya validadas. La Fase 0 congela el comportamiento actual y la Fase 1 cambia únicamente la marca visible de CampoBase a FútbolControl de forma compatible.

## Navegación y módulos existentes que se conservan

- Plantilla.
- Asistencia.
- Sesiones de entrenamiento.
- Ejercicios.
- Tácticas.
- Calendario y resultados.
- Convocatorias.
- Preparación de partido.
- Partido en vivo.
- Ajustes.
- Vista delegado por rol/PIN.
- Modo demo por PIN.

## Funciones protegidas

### Plantilla y jugador
- Nombre.
- Dorsal (se muestra como `Dorsal`, sin introducir `#` como formato obligatorio).
- Foto.
- Pierna dominante.
- Posiciones múltiples.
- Notas internas.
- Estadísticas de Liga y Pretemporada.
- Goles, tarjetas, lesiones, incidencias, convocatorias, rotaciones, tardanzas, ausencias, minutos y media.
- Historial por jugador.
- Motivos de menos minutos.
- Valoraciones 1–5.

### Convocatorias
- Máximo de convocados configurado actualmente.
- Rotación justa.
- Exclusiones manuales y motivo.
- Minutos objetivo.
- Porteros.
- Edición y borrado con recálculo.

### Partido
- Preparación previa.
- Formación.
- Alineación.
- Porteros.
- Persistencia de posiciones.
- Partido en vivo.
- Cronómetro.
- Marcador.
- Cambios.
- Minutos.
- Eventos/incidencias.
- Valoración posterior.
- Comentarios individuales/colectivos.
- El minuto en vivo y el corregido después representan el mismo dato.
- Separación Liga / Pretemporada.

### Delegado
- PIN propio.
- Solo ve la parte de partido permitida.
- El entrenador decide `Mostrar al delegado`.
- Se mantiene la lógica de mostrar el partido 20 minutos antes cuando corresponda, usando hora canaria (`Atlantic/Canary`).
- No se convierte en pestaña normal de navegación.

### Entrenamientos
- Asistencia.
- Sesiones.
- Bloques.
- Duraciones.
- Añadir ejercicios a sesión.
- Reordenar/quitar ejercicios.
- Historial.

### Ejercicios
- Biblioteca existente.
- Filtros.
- Favoritos.
- Vídeos/animaciones.
- Visor de ejercicio.
- Añadir a sesión.
- `+ Ejercicio`.
- Trabajo actual de integración de creación con pizarra.
- Trabajo actual de integración de creación en movimiento.
- No se reescribe esa integración durante Fase 0/1.

### Tácticas
- Formaciones.
- Guías interactivas.
- Animaciones.
- Pizarra editable.
- Uso en preparación y partido en vivo.

### Ajustes y personalización — requisito protegido
- Nombre del equipo.
- Formato F7 / F11.
- Escudo cargable por el usuario.
- Colores principales de la app.
- Color/fondo de la app.
- Detalles visuales.
- Colores de fuentes/textos.
- Copias de seguridad/importación-exportación.
- PIN propietario.
- PIN delegado.
- PIN demo.

Aunque alguna de estas opciones de personalización no aparezca todavía en la versión `main` inspeccionada, se considera requisito vigente y no debe perderse en la reorganización posterior.

## Elementos técnicos que NO se renombran en Fase 1

Para evitar romper compatibilidad se conservan por ahora:

- repositorio `campobase`;
- proyecto Supabase actual;
- claves locales `campobase.*`;
- IndexedDB/cachés existentes;
- funciones internas como `createCampoBaseCloudStore`;
- adaptadores como `toCampoBaseExercise`;
- IDs históricos `CAMPOBASE-*` de ejercicios/medios;
- rutas de media existentes;
- nombres de buckets/tablas ya usados;
- cualquier referencia técnica que pueda afectar a sincronización, caché, sesiones o datos históricos.

La marca visible sí pasa a FútbolControl; la migración técnica interna se hará más adelante solo si aporta valor y después de pruebas.

## Criterio de validación antes de reorganizar pestañas

Antes de Fase 2 debe poder verificarse que:

1. todas las funciones anteriores siguen accesibles;
2. no se ha perdido ningún campo de jugador ni partido;
3. delegado y demo siguen funcionando;
4. F7/F11 no cambia;
5. Supabase e IndexedDB siguen usando los mismos datos;
6. ejercicios/tácticas/sesiones siguen cargando;
7. la integración de `+ Ejercicio` no se ha alterado;
8. el cambio de marca no modifica datos ni IDs.
