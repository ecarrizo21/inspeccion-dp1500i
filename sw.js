const cacheName = 'dp1500i-general-v1-' + self.registration.scope;
self.addEventListener('install',event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll([
    './','./index.html','./draft.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'
  ])).then(() => self.skipWaiting()));
});
self.addEventListener('activate',event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event => {
  if(event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(cacheName).then(async cache =>
    (await cache.match(event.request)) || (event.request.mode === 'navigate' && await cache.match('./index.html')) || fetch(event.request)
  ));
});
