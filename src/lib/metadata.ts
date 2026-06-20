import type { EventWebsiteRenderModel } from "@/types/public-event";

export function safePublicCanonicalUrl(value?: string | null): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (hostname.endsWith(".vercel.app") || hostname === "localhost" || hostname === "127.0.0.1") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function buildPageTitle(event?: EventWebsiteRenderModel): string {
  const displayName = event?.coupleDisplayName || event?.title;
  return displayName ? `${displayName} | WebSerbisyo RSVP` : "WebSerbisyo RSVP Event";
}

export function buildPageDescription(event?: EventWebsiteRenderModel): string {
  if (!event) return "A public event website powered by WebSerbisyo RSVP.";
  return `Public event website for ${event.coupleDisplayName || event.title}.`;
}
