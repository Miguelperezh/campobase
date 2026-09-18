# Migración de vídeos a Tigris

Rama: `tigris-video-migration`

Este trabajo solo afecta al almacenamiento de vídeo. No modifica las reglas de ejercicios, interfaz ni otras áreas.

## Estado

- Fuente actual: Supabase Storage, bucket `ejercicio-videos`.
- Destino: Tigris Object Storage.
- Endpoint S3 estándar: `https://t3.storage.dev`.
- Manifiesto actual: 323 MP4.
- Los originales de Supabase NO se borran durante la migración.

## Credenciales

El script usa exclusivamente variables de entorno:
- `TIGRIS_ACCESS_KEY_ID`
- `TIGRIS_SECRET_ACCESS_KEY`
- `TIGRIS_BUCKET`
- opcional `TIGRIS_ENDPOINT` (por defecto `https://t3.storage.dev`)
- opcional `TIGRIS_REGION` (por defecto `auto`)

Nunca guardar secretos en Git.

## Ejecución por agentes

Prueba de un solo vídeo:
`node scripts/migrate-supabase-videos-to-tigris.mjs --only=library-v2-preview/pdf150-094/ejercicio.mp4`

Migración completa:
`node scripts/migrate-supabase-videos-to-tigris.mjs`

El script:
1. descarga cada MP4 público actual desde Supabase;
2. comprueba su tamaño;
3. firma la subida con AWS Signature V4 directamente contra Tigris;
4. conserva exactamente la misma ruta;
5. fija `Content-Type: video/mp4` y cache de 24h;
6. verifica la URL del objeto tras subirlo.

## Condición previa

El bucket debe existir y estar configurado para servir públicamente los vídeos de CampoBase. Hasta validar un vídeo real, no cambiar la URL de producción.
