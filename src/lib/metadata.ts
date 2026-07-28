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
  return displayName ? `${displayName} | Wedding Invitation` : "Rafael & Isabella | Wedding Invitation";
}

export function buildPageDescription(_event?: EventWebsiteRenderModel): string {
  return "Join Rafael and Isabella as they celebrate their wedding. View the event details and RSVP online.";
}
