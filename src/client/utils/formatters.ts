/**
 * Client Formatters
 *
 * Shared date/time formatting utilities extracted from
 * ClientEventRenderer.tsx and ClientRsvpPage.tsx.
 *
 * The platform's src/lib/formatters.ts is a separate module with
 * different signatures (timezone-aware) — this file does not replace it.
 */

/**
 * Formats a time string "HH:MM" to "H:MM AM/PM".
 * Returns empty string if input is falsy.
 */
export function formatTime(t?: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Formats a date string "YYYY-MM-DD" to a long locale date.
 * Uses en-PH locale (e.g. "Saturday, April 19, 2027").
 * Returns empty string if input is falsy.
 *
 * Note: Appends T00:00:00 to avoid timezone offset issues with Date parsing.
 */
export function formatDate(d?: string): string {
  if (!d) return "";
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a datetime string "YYYY-MM-DDTHH:MM" to "Month DD, YYYY at H:MM AM/PM".
 * Returns empty string if input is falsy.
 */
export function formatDateTime(dt?: string): string {
  if (!dt) return "";
  const dateObj = new Date(dt);
  if (isNaN(dateObj.getTime())) return "";

  const dateStr = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateStr} at ${timeStr}`;
}
