import { weddingSectionRegistry } from "@/config/wedding-section-registry";
import type { NormalizedSection, WeddingSectionKey } from "@/types/public-event";

export const requiredWeddingSections = ["host_info", "main_event", "venue", "rsvp_form"] as const;

export const optionalWeddingSections = [
  "countdown",
  "music_effects",
  "secondary_event",
  "timeline_program",
  "entourage",
  "principal_sponsors",
  "attire_motif",
  "extra_info",
  "gallery",
  "gift_details",
  "guestbook",
  "story_message",
  "contact_socials"
] as const;

export function isWeddingSectionKey(key: string): key is WeddingSectionKey {
  return key in weddingSectionRegistry;
}

function hasValue(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasValue);
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).some(hasValue);
  return true;
}

export function shouldRenderSection(section: NormalizedSection, source: "design" | "snapshot" | "live"): boolean {
  if (!isWeddingSectionKey(section.key) || !section.enabled) return false;
  if (source === "design") return true;
  if ((requiredWeddingSections as readonly string[]).includes(section.key)) return true;
  return hasValue(section.content);
}
