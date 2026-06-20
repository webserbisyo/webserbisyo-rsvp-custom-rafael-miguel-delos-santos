export function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function arrayOfRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object" && !Array.isArray(item)))
    : [];
}

export function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

const DEFAULT_LOCALE = "en-PH";
const DEFAULT_TIME_ZONE = "Asia/Manila";

function safeTimeZone(timezone?: string | null): string {
  const value = text(timezone);
  if (!value) return DEFAULT_TIME_ZONE;
  try {
    new Intl.DateTimeFormat(DEFAULT_LOCALE, { timeZone: value }).format(new Date());
    return value;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

export function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: string | null, timezone?: string | null): string {
  const date = parseDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: "long",
    timeZone: safeTimeZone(timezone)
  }).format(date);
}

export function formatTime(value?: string | null, timezone?: string | null): string {
  const date = parseDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    timeStyle: "short",
    timeZone: safeTimeZone(timezone)
  }).format(date);
}

export function formatDateTime(value?: string | null, timezone?: string | null): string {
  const date = parseDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: safeTimeZone(timezone)
  }).format(date);
}

export function formatEventSchedule(value?: string | null, timezone?: string | null): string {
  return formatDateTime(value, timezone);
}

export function formatRsvpDeadline(value?: string | null, timezone?: string | null): string {
  const formatted = formatDate(value, timezone);
  return formatted ? `Please RSVP by ${formatted}.` : "";
}
