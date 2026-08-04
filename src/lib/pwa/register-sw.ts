export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  // Development mode: Disable Service Worker registration to prevent stale Next.js
  // Turbopack dev chunk caching and HMR WebSocket interception over LAN/localhost.
  if (process.env.NODE_ENV !== "production") {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      })
      .catch(() => {});

    if ("caches" in window) {
      const APP_CACHE_PREFIX = "custom-rsvp-offline-";
      caches
        .keys()
        .then((keys) => {
          for (const key of keys) {
            if (key.startsWith(APP_CACHE_PREFIX)) {
              caches.delete(key).catch(() => {});
            }
          }
        })
        .catch(() => {});
    }
    return;
  }

  // Production mode: Register /sw.js for PWA offline capabilities
  const register = () => {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .catch(() => {});
  };

  if (document.readyState === "complete") {
    register();
    return;
  }

  window.addEventListener("load", register, { once: true });
}
