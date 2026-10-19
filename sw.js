const CACHE_NAME = 'hanyugo-v13';
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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Some assets could not be pre-cached:', err);
      });
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
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Cập nhật ngầm trong nền nếu máy tính đang mở, không làm chặn ứng dụng
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
      }).catch(() => {
        // Fallback về trang chủ nếu là trang điều hướng
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
