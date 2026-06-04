self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.notification?.title || "FarmLedger";
  const options = {
    body: payload.notification?.body || "You have a new farm reminder.",
    icon: "/icon.svg",
    badge: "/icon.svg",
    data: payload.data || {}
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/notifications"));
});
