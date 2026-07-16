/**
 * QuizRank India - Offline Service Worker
 * Enables cached offline access for quiz questions, categories, and results.
 */

const CACHE_NAME = "quizrank-static-v1";
const API_CACHE_NAME = "quizrank-api-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html"
];

// Install Event: Pre-cache core shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline shell");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[Service Worker] Pre-cache warning (non-fatal in dev mode):", err);
      });
    })
  );
  // Force active service worker immediately
  self.skipWaiting();
});

// Activate Event: Cleanup stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log("[Service Worker] Deleting obsolete cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Handle cache/network interaction
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Bypassing non-http protocols (e.g., websocket connections, chrome-extensions)
  if (!event.request.url.startsWith("http")) {
    return;
  }

  // API Request interception
  if (requestUrl.pathname.startsWith("/api/")) {
    // We only cache GET requests (quizzes, categories, questions, blogs, leaderboard)
    if (event.request.method !== "GET") {
      return;
    }

    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          console.log("[Service Worker] Offline fallback for API request:", event.request.url);
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Default elegant JSON fallback for uncached API items when offline
            return new Response(
              JSON.stringify({
                error: "Offline Mode",
                message: "This content was not cached for offline access yet.",
                isOfflineFallback: true
              }),
              {
                headers: { "Content-Type": "application/json" }
              }
            );
          });
        })
    );
    return;
  }

  // Static Assets or regular page routing
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful static responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache for static resources
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If HTML request failed, return index.html
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/index.html") || caches.match("/");
          }
        });
      })
  );
});
