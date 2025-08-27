/* eslint-disable no-restricted-globals */

// This service worker file is responsible for handling push notifications.

self.addEventListener('push', (event) => {
  if (!event.data) {
    console.error('Push event but no data');
    return;
  }

  const data = event.data.json();
  const title = data.title || 'BartaNow';
  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // Make sure you have an icon in your public folder
    badge: '/badge-72x72.png', // And a badge
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus().then(cli => cli.navigate(urlToOpen));
      }
      return clients.openWindow(urlToOpen);
    })
  );
});
