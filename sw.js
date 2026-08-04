const CACHE_VERSION = 'v2';
const CACHE_NAME = `word-counter-${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './js/scripts.js',
  './css/styles.css',
  './offline.html',
  './icon-256x256.svg',
  './icon-256x256.png',
  './icon-192x192.png',
  './icon-512x512.png',
  './install.svg',
  './settings.svg',
  './manifest.webmanifest',
  './fonts/Inter-Bold.woff2',
  './fonts/Inter-Regular.woff2',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('word-counter-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // Return offline page for navigation requests when offline
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html').then((offlineResponse) => {
            return offlineResponse || caches.match('./index.html');
          });
        }
      });
    })
  );
});