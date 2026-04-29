const CACHE_NAME = 'plusultra-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// Instalación: Guardar archivos básicos en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Estrategia: Cargar de la red, pero si falla o es lento, usar caché
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
