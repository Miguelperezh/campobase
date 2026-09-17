# Auditoría de integración — nuevos ejercicios 2026-09-17

Estado: preparación segura; no integrado en main.

## Ejercicios actuales del ZIP principal

1. `CAMPOBASE-VIDEO-3-FINALIZACIONES-CENTRO-EXTERIOR-CENTRO-LATERAL` — 3 finalizaciones consecutivas — centro, zona exterior y centro lateral — Finalización — Fútbol 11
2. `CAMPOBASE-VIDEO-6-SALTOS-LATERALES-KNEE-DRIVE-SPRINT-13-7M` — 6 saltos laterales, knee drive y sprint de 13,7 m — Coordinación/motricidad — Fútbol 11
3. `CAMPOBASE-VIDEO-CONDUCCION-DEJAR-BALON-3-CONOS-VUELTA-LATERAL-PASE` — Conducción + dejar balón + 3 conos + vuelta lateral + pase — Coordinación/motricidad — Fútbol 11
4. `CAMPOBASE-VIDEO-CONDUCCION-FRENADA-PLANTA-SPRINT-IDA-VUELTA-RECUPERACION` — Conducción, frenada con planta, sprint ida/vuelta y recuperación del balón — Coordinación/motricidad — Fútbol 11
5. `CAMPOBASE-VIDEO-DESPLAZAMIENTO-LATERAL-PROGRESIVO-PASILLO` — Desplazamiento lateral progresivo en pasillo con cambios de apoyo — Coordinación/motricidad — Fútbol 11
6. `CAMPOBASE-VIDEO-DUELOS-3V2-FINALIZACION-ROBO-ROTACION` — Duelos 3v2 con finalización — robo = fin y rotación por roles — Finalización — Fútbol 11
7. `CAMPOBASE-VIDEO-FINALIZACION-DOBLE-2-BALONES-TRANSICION-1V1-CAMBIO-CARRIL-V2` — Finalización doble — 2 balones + transición defensiva + 1v1 + cambio de carril — Finalización — Fútbol 7
8. `CAMPOBASE-PASE-BALON-ESPACIO-2-CONOS-1V1-FINALIZACION-V2` — Pase + balón al espacio + carrera por 2 conos + 1v1 + finalización — Finalización — Fútbol 7
9. `CAMPOBASE-VIDEO-PIES-RAPIDOS-SPRINT-3-VARIACIONES` — Pies rápidos + sprint explosivo — 3 variaciones — Coordinación/motricidad — Fútbol 11
10. `CAMPOBASE-VIDEO-REACCION-GIRO-INICIAL-SENALES-LATERALES-CONO-BALON-V3` — Reacción con giro inicial, señales laterales, toque de cono y balón final — Coordinación/motricidad — Fútbol 7
11. `CAMPOBASE-VIDEO-REACTIVE-KNEE-DRIVE-SKATER-3-VARIACIONES` — Reactive knee drive + skater jump combo — 3 variaciones — Coordinación/motricidad — Fútbol 11
12. `CAMPOBASE-VIDEO-RODILLAS-ALTAS-LATERALES-ZIGZAG-COD-SPRINT` — Rodillas altas laterales + zigzag de cambios de dirección y sprint — Coordinación/motricidad — Fútbol 11

## Exclusiones
- `CampoBase_NUEVO_FORMATO_RESTO_4_VERSIONES_ANTERIORES(1).zip` contiene exclusivamente `99_VERSIONES_ANTERIORES_NO_USAR`; no integrar.

## Arquitectura confirmada
- Colección principal: `EJERCICIOS_VALIDADOS`.
- Visor actual ya soporta MP4 principal, preview/poster y vídeo real adicional.
- Bucket actual: `ejercicio-videos` (público, 50 MB por archivo).
- No se requiere modificar tablas existentes para los campos nuevos si se integran de forma backward-compatible.

## Rama
- Base limpia desde `main`: `integrar-ejercicios-nuevo-formato-20260917`.
- La rama antigua `integrar-ejercicios-video-20260917` se conserva intacta; está divergida y contiene solo un placeholder de un ejercicio.
