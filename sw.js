const CACHE_NAME = 'plusultra-v3'; // Subimos versión para forzar actualización

const ASSETS = [
  '/',
  '/index.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Fuerza a que el nuevo SW tome el control
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Toma el control de las pestañas abiertas inmediatamente
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // NO CACHEAR peticiones de Firebase o autenticación
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    return; 
  }

  // Estrategia: Network First (Red primero, si falla, caché)
  // Esto evitará que te quedes pegado en el "Loading" si el Worker actualiza
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
