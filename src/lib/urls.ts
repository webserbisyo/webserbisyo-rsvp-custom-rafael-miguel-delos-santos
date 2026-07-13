export function joinPublicApiUrl(
  apiBaseUrl: string,
  eventSlug: string,
): string {
  const cleanBase = apiBaseUrl.replace(/\/+$/, "");
  return `${cleanBase}/api/public/events/${encodeURIComponent(eventSlug)}`;
}

export function joinDraftPreviewApiUrl(
  apiBaseUrl: string,
  eventSlug: string,
): string {
  const cleanBase = apiBaseUrl.replace(/\/+$/, "");
  return `${cleanBase}/api/dashboard/event/preview/${encodeURIComponent(eventSlug)}`;
}
