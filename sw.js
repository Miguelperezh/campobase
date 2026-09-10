const CACHE = 'campobase-v2.44.0-player-sync-attendance-2453-responsive-2455';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest',
  './js/app.js', './js/db.js', './js/domain.js', './js/demo-session.js', './js/training-domain.js', './js/real-exercises.js', './js/exercise-planning.js', './js/ejercicios-validados.js', './js/ejercicio-viewer.js', './js/ejercicio-videos.js', './js/media-lightbox.js', './js/frame-durations.js', './js/tactics.js', './js/live-tactics.js', './js/tacticas-interactivas.js', './js/tactica-viewer.js', './js/tactica-frame-durations.js', './js/tactica-1231-frames.js', './js/tactica-1213-frames.js', './js/tactica-1321-frames.js', './js/tactica-1222-frames.js', './js/tactica-1132-frames.js', './js/tactica-133-frames.js', './js/tactica-1312-frames.js', './js/tactica-final-frames.js', './js/tactica-11311-frames.js', './js/tactica-1141-frames.js', './js/tactica-1411-frames.js', './js/tactica-12211-frames.js', './js/tactic-board-controller.js', './js/tactica-guia-viewer.js', './js/squad-seed.js', './js/sync-core.js', './js/supabase-client.js', './js/plantilla-stats-sync.js', './js/match-calendar-sync.js', './js/match-postgame-editor.js', './js/calendar-substitutions-v2.js', './js/calendar-substitutions-entry.js', './js/session-visual-planner.js?v=2451', './js/session-materials.js?v=2452', './js/attendance-linked-sources.js?v=2453', './js/player-data-sync.js?v=2453', './js/attendance-history-responsive.js?v=2455', './js/runtime-refresh.js',
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