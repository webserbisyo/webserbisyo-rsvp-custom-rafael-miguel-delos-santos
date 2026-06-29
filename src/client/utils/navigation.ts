/**
 * Scrolls to a specific hash element on the page and updates the URL hash cleanly
 * without causing chained hashes (e.g. /#our-story#hero).
 * 
 * @param href The target hash (e.g. "#hero" or "#our-story")
 * @returns true if the navigation was handled as a local scroll, false otherwise
 */
export function scrollToHash(href: string): boolean {
  if (!href.startsWith("#")) return false;

  const id = href.slice(1);
  const target = document.getElementById(id);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (id === "hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    return false;
  }

  // Update the URL hash cleanly using the URL constructor to prevent chained hashes
  try {
    const url = new URL(window.location.href);
    url.hash = href;
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // Fallback if URL constructor is not supported or fails
    window.history.pushState(null, "", href);
  }

  return true;
}
