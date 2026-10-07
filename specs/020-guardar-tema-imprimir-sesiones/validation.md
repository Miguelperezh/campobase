# Validación
- npm run check correcto; npm test: 692/692.
- Chrome aislado: selectores nativos change y selección final sin evento, Guardar y refresh con snapshot antiguo mantienen fondo/texto elegidos. Regresión de componentes y menús locales a 390/1280 px.
- Sesión de cinco ejercicios: DOM 2/2/1 y PDF Chromium A4 real de cuatro páginas (portada + tres). Portada personalizada vigente en vez de snapshot viejo; imágenes decodificadas; contenido ajustado al espacio.
- Cierre desde cabecera y Ajustes bloquea acceso, muestra diálogo y elimina marcadores de rol. Se mantiene sin conexión, sin leer datos remotos para cerrar. SaaS limita signOut a scope local.
- Navegador sin errores ni escrituras remotas. Prueba reproducible: tests/browser-save-print-logout.mjs (fixture privada por CAMPOBASE_TEST_FIXTURE, Playwright instalado).
- Entrega limitada a rama aislada y repositorio separado campobase-preview. Main original y backend intactos.

Preview: commit 7a3ca44, fuente 2c6bf0a7. Main original comprobado sin cambios: 360b2b2dce3cc454a644b5d8fe428ccdc2df8557.
