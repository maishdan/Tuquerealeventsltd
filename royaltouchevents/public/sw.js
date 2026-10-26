// TOQUE REAL EVENTS LIMITED — Official PWA Service Worker
const CACHE_NAME = "toquereal-pwa-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/site.webmanifest",
  "/new logo.png",
  "/favicon.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network-First Strategy for Live Supabase API Data with Cache Fallback
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass cache for Supabase REST API requests to ensure 100% real-time data
  if (url.hostname.includes("supabase.co")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Offline mode. Real data will refresh when reconnected." }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // Network-First for HTML/App Navigation
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === "GET") {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match("/");
        });
      })
  );
});
