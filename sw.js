const CACHE = 'campobase-v2.10.0';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest',
  './js/app.js', './js/db.js', './js/domain.js', './js/training-domain.js', './js/real-exercises.js', './js/exercise-planning.js', './js/tactics.js', './js/sync-core.js', './js/supabase-client.js',
  './vendor/supabase.js',
  './icons/icon-192.svg', './icons/icon-512.svg', './icons/escudo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

// Network-first: siempre intenta la red primero (versión más reciente).
// Solo cae a caché si no hay conexión. Así las actualizaciones se ven al instante.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached ?? caches.match('./index.html')))
  );
});
