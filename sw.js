/* ==========================================================================
   SHIKSHA SETU - SERVICE WORKER FOR OFFLINE LEARNING & CACHE API
   Network First Strategy with Automatic Cache Busting
   ========================================================================== */

const CACHE_NAME = 'shiksha-setu-cache-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/api.js',
  './js/sync.js',
  './js/data.js',
  './js/language.js',
  './js/accessibility.js',
  './js/progress.js',
  './js/quiz.js',
  './js/builder.js',
  './js/app.js'
];

// Install Event - Immediately activate new service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing new version:', CACHE_NAME);
  self.skipWaiting();
});

// Activate Event - Delete all old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          console.log('[Service Worker] Purging cache:', cache);
          return caches.delete(cache);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - NETWORK FIRST strategy to guarantee fresh updates when online
self.addEventListener('fetch', (event) => {
  // Bypass Service Worker for API requests
  if (event.request.url.includes('/api/v1/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('./index.html');
        });
      })
  );
});
