import type { EventWebsiteRenderModel } from "@/types/public-event";

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function safePublicCanonicalUrl(value?: string | null): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (
      hostname.endsWith(".vercel.app") ||
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      /^172\.(1[6-9]|2[0-9]|3[01])\./.test(hostname) ||
      hostname.endsWith(".webserbisyo.com") ||
      hostname === "webserbisyo.com"
    ) {
      return undefined;
    }
    return url.toString();
  } catch {
    return undefined;
  }
}

export function buildPageTitle(event?: EventWebsiteRenderModel): string {
  const displayName = event?.coupleDisplayName || event?.title;
  return displayName ? `${displayName} | Wedding Invitation` : "Wedding Invitation";
}

export function buildPageDescription(event?: EventWebsiteRenderModel): string {
  const displayName = event?.coupleDisplayName || event?.title;
  if (!displayName) {
    return "Join us as we celebrate our wedding. View event details and RSVP online.";
  }
  return `Join ${displayName} as they celebrate their wedding. View event details and RSVP online.`;
}
