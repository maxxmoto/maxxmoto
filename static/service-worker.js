const CACHE = 'maxxmoto-v3';
const PRECACHE = [
  '/',
  '/static/newlogo.webp',
  '/static/newlogo.png',
  '/static/maxxmotofaviconjfif.jfif',
  '/static/apple-touch-icon.png',
  '/static/manifest.json',
  '/static/service-worker.js',
  '/static/cookies.svg',
  '/static/telegram.svg',
  '/static/avito.svg',
  '/static/404.svg'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE).catch(() => {}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if (res.ok && (e.request.url.includes('/static/') || e.request.destination === 'image')) {
          return caches.open(CACHE).then(cache => {
            cache.put(e.request, res.clone());
            return res;
          });
        }
        return res;
      });
    })
  );
});
