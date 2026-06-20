export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

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
