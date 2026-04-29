const CACHE_NAME = 'plusultra-v2';
const IMAGE_CACHE = 'plusultra-images';

// Archivos básicos de la interfaz
const ASSETS = [
  '/',
  '/index.html',
  'https://cdn.jsdelivr.net/npm/hls.js@latest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ESTRATEGIA PARA IMÁGENES (Cache First)
  // Si es una imagen de R2 o de tu dominio, buscar en caché primero
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          return response || fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // ESTRATEGIA PARA EL JSON DEL WORKER (Stale-While-Revalidate)
  if (url.hostname.includes('workers.dev')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Para todo lo demás (Firebase, etc), red normal
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});
