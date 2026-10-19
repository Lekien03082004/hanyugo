const CACHE_NAME = 'hanyugo-v16';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (e) {
          console.warn('Cache error for:', asset, e);
        }
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null)
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // TTS proxy: try network, if offline fail fast so phone uses offline Web Speech
  if (event.request.url.includes('/tts')) {
    return event.respondWith(
      fetch(event.request).catch(() => new Response('', { status: 503 }))
    );
  }

  // Cache-First Strategy: Luôn trả về từ bộ nhớ đệm điện thoại ngay lập tức (0.05s)
  // Giúp ứng dụng mở tức thì khi tắt máy tính hoặc không có mạng!
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Cập nhật ngầm trong nền nếu có mạng, không làm chặn ứng dụng
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Nếu chưa có trong cache thì tải từ mạng và lưu vào cache
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      }).catch(async () => {
        // Fallback về trang chủ nếu mất mạng hoặc offline
        if (event.request.mode === 'navigate' || event.request.destination === 'document') {
          const fallback = (await caches.match('./index.html')) || (await caches.match('./'));
          if (fallback) return fallback;
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
