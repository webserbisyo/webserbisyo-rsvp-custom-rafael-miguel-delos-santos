const CACHE_NAME = "custom-rsvp-offline-v1";
const OFFLINE_URL = "/offline.html";
const STATIC_ASSETS = [
  OFFLINE_URL,
  "/favicon.ico",
  "/icon.png",
  "/apple-icon.png",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
  "/images/brand/webserbisyo-logo.jpeg",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode !== "navigate") return;

  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
});
