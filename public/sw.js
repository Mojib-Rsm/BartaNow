// This is a basic service worker for PWA capabilities.
// It can be expanded to include caching strategies for offline support.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // event.waitUntil(
  //   caches.open(CACHE_NAME).then((cache) => {
  //     console.log('Service Worker: Caching app shell');
  //     return cache.addAll(FILES_TO_CACHE);
  //   })
  // );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // event.waitUntil(
  //   caches.keys().then((keyList) => {
  //     return Promise.all(
  //       keyList.map((key) => {
  //         if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
  //           console.log('Service Worker: Removing old cache', key);
  //           return caches.delete(key);
  //         }
  //       })
  //     );
  //   })
  // );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // We are not implementing any caching strategy for now.
  // This is just a placeholder for future PWA features.
  event.respondWith(fetch(event.request));
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'BartaNow';
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: {
      url: data.url || self.location.origin,
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
