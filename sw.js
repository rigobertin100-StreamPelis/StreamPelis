const CACHE_NAME = 'plusultra-v1';
// Solo cacheamos la estructura básica para que la app abra instantáneamente
const ASSETS = [
  '/',
  'index.html',
  'manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  // Estrategia: Intentar red, si falla buscar en caché
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
