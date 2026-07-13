import type {
  NormalizedSection,
  WeddingSectionKey,
} from "@/types/public-event";
import {
  eventWebsiteSectionContract,
  eventWebsiteSectionKeySet,
  requiredWeddingSections,
} from "@/lib/event-website-section-contract";

export { requiredWeddingSections };
export const optionalWeddingSections = eventWebsiteSectionContract
  .filter((entry) => entry.visibility === "optional")
  .map((entry) => entry.key);

export function isWeddingSectionKey(key: string): key is WeddingSectionKey {
  return eventWebsiteSectionKeySet.has(key);
}

function hasValue(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasValue);
  if (typeof value === "object")
    return Object.values(value as Record<string, unknown>).some(hasValue);
  return true;
}

export function shouldRenderSection(
  section: NormalizedSection,
  source: "design" | "snapshot" | "live",
): boolean {
  if (!isWeddingSectionKey(section.key) || !section.enabled) return false;
  if (source === "design") return true;
  if ((requiredWeddingSections as readonly string[]).includes(section.key))
    return true;
  return hasValue(section.content);
}
