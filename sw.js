// Define el nombre y la versión de la caché
const CACHE_NAME = 'lego-store-pwa-shell-v1';

// Lista de archivos que componen el App Shell y que se almacenarán en caché
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com/',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
  // NOTA: No podemos cachear 'app.js' porque está embebido en index.html.
  // Si estuviera en un archivo separado, lo añadiríamos aquí: '/app.js'
];

// Evento 'install': se dispara cuando el Service Worker se instala.
// Aquí es donde almacenamos en caché nuestro App Shell.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Abriendo caché y almacenando el App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: App Shell cacheado con éxito');
        return self.skipWaiting(); // Fuerza la activación del nuevo SW
      })
  );
});

// Evento 'activate': se dispara cuando el Service Worker se activa.
// Aquí limpiamos cachés antiguas para evitar conflictos.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Toma el control de la página inmediatamente
});

// Evento 'fetch': se dispara cada vez que la aplicación realiza una petición de red.
// Interceptamos la petición y respondemos desde la caché si es posible.
self.addEventListener('fetch', event => {
  // Estrategia: Cache, falling back to network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la respuesta está en la caché, la devolvemos
        if (response) {
          console.log(`Service Worker: Sirviendo desde caché: ${event.request.url}`);
          return response;
        }

        // Si no está en la caché, la buscamos en la red
        console.log(`Service Worker: Buscando en red: ${event.request.url}`);
        return fetch(event.request).then(
          (networkResponse) => {
            // No clonamos ni guardamos respuestas de extensiones de chrome
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !event.request.url.startsWith('http')) {
              return networkResponse;
            }
            // Importante: Clonamos la respuesta. Una respuesta es un 'Stream'
            // y solo puede ser consumida una vez. Necesitamos una para el navegador
            // y otra para la caché.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // No cacheamos la respuesta si es de una extensión
                if(!event.request.url.startsWith('chrome-extension')){
                    cache.put(event.request, responseToCache);
                }
              });

            return networkResponse;
          }
        ).catch(error => {
            console.error('Service Worker: Fallo en el fetch, el usuario está probablemente offline.', error);
            // Opcional: Podrías devolver una página de fallback para el offline aquí.
        });
      })
  );
});