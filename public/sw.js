// This is the service worker file for handling push notifications.

// Listen for the 'install' event, which fires when the service worker is installed.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  // Skip waiting to ensure the new service worker activates immediately.
  self.skipWaiting();
});

// Listen for the 'activate' event, which fires when the service worker is activated.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Claim all clients to ensure the service worker controls any open pages.
  event.waitUntil(self.clients.claim());
});

// Listen for the 'push' event, which is the core of handling incoming push messages.
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');
  
  // The data from the push message is in event.data.
  // We default to a generic message if no data is present.
  const notificationData = event.data?.json() ?? {
    title: 'BartaNow',
    body: 'You have a new notification!',
    url: '/',
  };

  const { title, body, url } = notificationData;

  const options = {
    body: body,
    icon: '/logo.png', // Icon for the notification
    badge: '/badge.png', // Badge for the notification bar on mobile
    data: {
      url: url || '/', // URL to open when the notification is clicked
    },
  };

  // Show the notification. waitUntil ensures the service worker doesn't terminate
  // before the notification is displayed.
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Listen for the 'notificationclick' event, which fires when a user clicks on a notification.
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked.');

  // Close the notification
  event.notification.close();

  const urlToOpen = event.notification.data.url;

  // This looks for an existing window with the same URL and focuses it.
  // If no such window is found, it opens a new one.
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
