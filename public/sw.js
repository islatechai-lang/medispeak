// MediSpeak Service Worker — Pre-caches all audio files for offline use
const CACHE_NAME = 'medispeak-audio-v1';

// All pre-generated audio files to cache on install
const AUDIO_FILES = [
  '/audio/ceb/emergency/emg_1.wav',
  '/audio/ceb/emergency/emg_2.wav',
  '/audio/ceb/emergency/emg_3.wav',
  '/audio/ceb/emergency/emg_4.wav',
  '/audio/ceb/emergency/emg_5.wav',
  '/audio/ceb/emergency/emg_6.wav',
  '/audio/ceb/emergency/emg_7.wav',
  '/audio/ceb/emergency/emg_8.wav',
  '/audio/ceb/phrases/1.wav',
  '/audio/ceb/phrases/10.wav',
  '/audio/ceb/phrases/11.wav',
  '/audio/ceb/phrases/12.wav',
  '/audio/ceb/phrases/13.wav',
  '/audio/ceb/phrases/14.wav',
  '/audio/ceb/phrases/15.wav',
  '/audio/ceb/phrases/16.wav',
  '/audio/ceb/phrases/17.wav',
  '/audio/ceb/phrases/19.wav',
  '/audio/ceb/phrases/2.wav',
  '/audio/ceb/phrases/20.wav',
  '/audio/ceb/phrases/21.wav',
  '/audio/ceb/phrases/22.wav',
  '/audio/ceb/phrases/23.wav',
  '/audio/ceb/phrases/24.wav',
  '/audio/ceb/phrases/25.wav',
  '/audio/ceb/phrases/3.wav',
  '/audio/ceb/phrases/4.wav',
  '/audio/ceb/phrases/5.wav',
  '/audio/ceb/phrases/6.wav',
  '/audio/ceb/phrases/7.wav',
  '/audio/ceb/phrases/8.wav',
  '/audio/ceb/phrases/9.wav',
  '/audio/ceb/symptoms/back.wav',
  '/audio/ceb/symptoms/chest.wav',
  '/audio/ceb/symptoms/cold.wav',
  '/audio/ceb/symptoms/feverish.wav',
  '/audio/ceb/symptoms/head.wav',
  '/audio/ceb/symptoms/joints.wav',
  '/audio/ceb/symptoms/p0.wav',
  '/audio/ceb/symptoms/p10.wav',
  '/audio/ceb/symptoms/p4.wav',
  '/audio/ceb/symptoms/p6.wav',
  '/audio/ceb/symptoms/p8.wav',
  '/audio/ceb/symptoms/stomach.wav',
  '/audio/ceb/symptoms/sweat.wav',
  '/audio/ceb/symptoms/throat.wav',
  '/audio/ilo/emergency/emg_1.wav',
  '/audio/ilo/emergency/emg_2.wav',
  '/audio/ilo/emergency/emg_3.wav',
  '/audio/ilo/emergency/emg_4.wav',
  '/audio/ilo/emergency/emg_5.wav',
  '/audio/ilo/emergency/emg_6.wav',
  '/audio/ilo/emergency/emg_7.wav',
  '/audio/ilo/emergency/emg_8.wav',
  '/audio/ilo/phrases/1.wav',
  '/audio/ilo/phrases/10.wav',
  '/audio/ilo/phrases/11.wav',
  '/audio/ilo/phrases/12.wav',
  '/audio/ilo/phrases/13.wav',
  '/audio/ilo/phrases/14.wav',
  '/audio/ilo/phrases/15.wav',
  '/audio/ilo/phrases/16.wav',
  '/audio/ilo/phrases/17.wav',
  '/audio/ilo/phrases/18.wav',
  '/audio/ilo/phrases/19.wav',
  '/audio/ilo/phrases/2.wav',
  '/audio/ilo/phrases/20.wav',
  '/audio/ilo/phrases/21.wav',
  '/audio/ilo/phrases/22.wav',
  '/audio/ilo/phrases/23.wav',
  '/audio/ilo/phrases/24.wav',
  '/audio/ilo/phrases/25.wav',
  '/audio/ilo/phrases/26.wav',
  '/audio/ilo/phrases/3.wav',
  '/audio/ilo/phrases/4.wav',
  '/audio/ilo/phrases/5.wav',
  '/audio/ilo/phrases/6.wav',
  '/audio/ilo/phrases/7.wav',
  '/audio/ilo/phrases/8.wav',
  '/audio/ilo/phrases/9.wav',
  '/audio/ilo/symptoms/back.wav',
  '/audio/ilo/symptoms/chest.wav',
  '/audio/ilo/symptoms/cold.wav',
  '/audio/ilo/symptoms/feverish.wav',
  '/audio/ilo/symptoms/head.wav',
  '/audio/ilo/symptoms/hot.wav',
  '/audio/ilo/symptoms/joints.wav',
  '/audio/ilo/symptoms/p10.wav',
  '/audio/ilo/symptoms/p2.wav',
  '/audio/ilo/symptoms/p4.wav',
  '/audio/ilo/symptoms/p6.wav',
  '/audio/ilo/symptoms/p8.wav',
  '/audio/ilo/symptoms/shortness.wav',
  '/audio/ilo/symptoms/stomach.wav',
  '/audio/ilo/symptoms/sweat.wav',
  '/audio/ilo/symptoms/throat.wav',
  '/audio/tl/emergency/emg_1.wav',
  '/audio/tl/emergency/emg_2.wav',
  '/audio/tl/emergency/emg_3.wav',
  '/audio/tl/emergency/emg_4.wav',
  '/audio/tl/emergency/emg_5.wav',
  '/audio/tl/emergency/emg_6.wav',
  '/audio/tl/emergency/emg_7.wav',
  '/audio/tl/emergency/emg_8.wav',
  '/audio/tl/phrases/1.wav',
  '/audio/tl/phrases/10.wav',
  '/audio/tl/phrases/11.wav',
  '/audio/tl/phrases/12.wav',
  '/audio/tl/phrases/13.wav',
  '/audio/tl/phrases/14.wav',
  '/audio/tl/phrases/15.wav',
  '/audio/tl/phrases/16.wav',
  '/audio/tl/phrases/17.wav',
  '/audio/tl/phrases/18.wav',
  '/audio/tl/phrases/19.wav',
  '/audio/tl/phrases/2.wav',
  '/audio/tl/phrases/20.wav',
  '/audio/tl/phrases/21.wav',
  '/audio/tl/phrases/22.wav',
  '/audio/tl/phrases/23.wav',
  '/audio/tl/phrases/24.wav',
  '/audio/tl/phrases/25.wav',
  '/audio/tl/phrases/3.wav',
  '/audio/tl/phrases/4.wav',
  '/audio/tl/phrases/5.wav',
  '/audio/tl/phrases/6.wav',
  '/audio/tl/phrases/7.wav',
  '/audio/tl/phrases/8.wav',
  '/audio/tl/phrases/9.wav',
  '/audio/tl/symptoms/back.wav',
  '/audio/tl/symptoms/chest.wav',
  '/audio/tl/symptoms/cold.wav',
  '/audio/tl/symptoms/feverish.wav',
  '/audio/tl/symptoms/head.wav',
  '/audio/tl/symptoms/hot.wav',
  '/audio/tl/symptoms/joints.wav',
  '/audio/tl/symptoms/p0.wav',
  '/audio/tl/symptoms/p10.wav',
  '/audio/tl/symptoms/p2.wav',
  '/audio/tl/symptoms/p6.wav',
  '/audio/tl/symptoms/p8.wav',
  '/audio/tl/symptoms/stomach.wav',
  '/audio/tl/symptoms/sweat.wav',
  '/audio/tl/symptoms/throat.wav',
  '/audio/war/emergency/emg_1.wav',
  '/audio/war/emergency/emg_2.wav',
  '/audio/war/emergency/emg_3.wav',
  '/audio/war/emergency/emg_4.wav',
  '/audio/war/emergency/emg_5.wav',
  '/audio/war/emergency/emg_6.wav',
  '/audio/war/emergency/emg_7.wav',
  '/audio/war/emergency/emg_8.wav',
  '/audio/war/phrases/1.wav',
  '/audio/war/phrases/10.wav',
  '/audio/war/phrases/11.wav',
  '/audio/war/phrases/12.wav',
  '/audio/war/phrases/13.wav',
  '/audio/war/phrases/14.wav',
  '/audio/war/phrases/15.wav',
  '/audio/war/phrases/16.wav',
  '/audio/war/phrases/17.wav',
  '/audio/war/phrases/19.wav',
  '/audio/war/phrases/2.wav',
  '/audio/war/phrases/20.wav',
  '/audio/war/phrases/21.wav',
  '/audio/war/phrases/22.wav',
  '/audio/war/phrases/24.wav',
  '/audio/war/phrases/25.wav',
  '/audio/war/phrases/26.wav',
  '/audio/war/phrases/3.wav',
  '/audio/war/phrases/4.wav',
  '/audio/war/phrases/5.wav',
  '/audio/war/phrases/6.wav',
  '/audio/war/phrases/7.wav',
  '/audio/war/phrases/8.wav',
  '/audio/war/phrases/9.wav',
  '/audio/war/symptoms/back.wav',
  '/audio/war/symptoms/chest.wav',
  '/audio/war/symptoms/cold.wav',
  '/audio/war/symptoms/feverish.wav',
  '/audio/war/symptoms/head.wav',
  '/audio/war/symptoms/joints.wav',
  '/audio/war/symptoms/p10.wav',
  '/audio/war/symptoms/p2.wav',
  '/audio/war/symptoms/p4.wav',
  '/audio/war/symptoms/p6.wav',
  '/audio/war/symptoms/stomach.wav',
  '/audio/war/symptoms/sweat.wav',
  '/audio/war/symptoms/throat.wav',
];

// Install: pre-cache all audio files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Add files one by one so a single 404 doesn't break the whole install
      let cached = 0;
      for (const url of AUDIO_FILES) {
        try {
          await cache.add(url);
          cached++;
        } catch (e) {
          console.warn(`[SW] Failed to cache: ${url}`);
        }
      }
      console.log(`[SW] Pre-cached ${cached}/${AUDIO_FILES.length} audio files`);
    })
  );
  // Activate immediately, don't wait for old tabs to close
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  // Take control of all tabs immediately
  self.clients.claim();
});

// Fetch: cache-first for audio files, network-first for everything else
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only intercept requests for audio files
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }
        // Not in cache — try network, and cache the response for next time
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Offline and not cached
          return new Response('Audio not available offline', { status: 503 });
        });
      })
    );
  }
  // All other requests pass through to the network normally
});
