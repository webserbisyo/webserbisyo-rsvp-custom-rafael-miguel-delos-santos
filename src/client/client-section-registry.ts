import type { ComponentType } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  Clock3,
  Gift,
  Home,
  Image,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shirt,
  Sparkles,
  Users,
  Utensils,
} from "@/client/libs/icons";
import {
  eventWebsiteSectionContract,
  requiredWeddingSections,
  type WeddingSectionKey,
} from "@/lib/event-website-section-contract";
import type { EventWebsiteRenderModel } from "@/types/public-event";

export type ClientSectionKey = WeddingSectionKey | "gallery";
export type ClientNavigationGroup =
  "Explore" | "Guest Essentials" | "Wedding Info" | "Support";

/**
 * Semantic section surface roles.
 *
 * These six roles are the ONLY valid section surfaces.
 * All theme overrides resolve through these roles.
 * No raw colors, legacy aliases, or per-section hardcoded backgrounds are permitted.
 *
 * - photo     : Hero image background / photo-backed surface
 * - light     : Primary Pearl Ivory editorial surface
 * - secondary : Cloud White secondary surface
 * - soft      : Mist Blue soft accent surface
 * - accent    : Signature Dusty Blue statement feature surface
 * - dark      : Evening Navy deep statement surface
 */
export type SectionSurface =
  | "photo"
  | "light"
  | "secondary"
  | "soft"
  | "accent"
  | "dark";

export type ClientSectionDescriptor = {
  anchor: string;
  designOnly?: boolean;
  dock?: boolean;
  group?: ClientNavigationGroup;
  icon?: ComponentType<{ className?: string }>;
  key: ClientSectionKey;
  label: string;
  primary?: boolean;
  topNav?: boolean;
  surface: SectionSurface;
};

export const clientSectionRegistry: Record<
  ClientSectionKey,
  ClientSectionDescriptor
> = {
  host_info: {
    anchor: "#hero",
    group: "Explore",
    icon: Home,
    key: "host_info",
    label: "Home",
    surface: "photo",
  },

  countdown: {
    anchor: "#countdown",
    group: "Explore",
    icon: Clock3,
    key: "countdown",
    label: "Countdown",
    topNav: true,
    surface: "soft",
  },
  music_effects: {
    anchor: "#music",
    key: "music_effects",
    label: "Music",
    surface: "accent",
  },
  gallery: {
    anchor: "#gallery",
    group: "Explore",
    icon: Image,
    key: "gallery",
    label: "Gallery",
    topNav: true,
    surface: "secondary",
  },
  main_event: {
    anchor: "#ceremony",
    dock: true,
    group: "Guest Essentials",
    icon: CalendarDays,
    key: "main_event",
    label: "Ceremony",
    surface: "light",
  },
  venue: {
    anchor: "#venue",
    dock: true,
    group: "Guest Essentials",
    icon: MapPin,
    key: "venue",
    label: "Venue",
    surface: "soft",
  },
  secondary_event: {
    anchor: "#reception",
    dock: true,
    group: "Guest Essentials",
    icon: Utensils,
    key: "secondary_event",
    label: "Reception",
    surface: "light",
  },
  timeline_program: {
    anchor: "#timeline",
    group: "Explore",
    icon: CalendarDays,
    key: "timeline_program",
    label: "Timeline",
    topNav: true,
    surface: "dark",
  },
  entourage: {
    anchor: "#entourage",
    group: "Wedding Info",
    icon: Users,
    key: "entourage",
    label: "Entourage",
    surface: "secondary",
  },
  principal_sponsors: {
    anchor: "#sponsors",
    group: "Wedding Info",
    icon: Award,
    key: "principal_sponsors",
    label: "Sponsors",
    surface: "soft",
  },
  attire_motif: {
    anchor: "#attire",
    dock: true,
    group: "Guest Essentials",
    icon: Shirt,
    key: "attire_motif",
    label: "Attire",
    surface: "light",
  },
  extra_info: {
    anchor: "#extra-info",
    group: "Wedding Info",
    icon: Sparkles,
    key: "extra_info",
    label: "Details",
    topNav: true,
    surface: "soft",
  },
  rsvp_form: {
    anchor: "/rsvp",
    dock: true,
    group: "Guest Essentials",
    icon: Mail,
    key: "rsvp_form",
    label: "RSVP",
    primary: true,
    surface: "dark",
  },
  gift_details: {
    anchor: "#gifts",
    group: "Wedding Info",
    icon: Gift,
    key: "gift_details",
    label: "Gifts",
    surface: "light",
  },
  guestbook: {
    anchor: "#guestbook",
    group: "Explore",
    icon: MessageCircle,
    key: "guestbook",
    label: "Guestbook",
    topNav: true,
    surface: "soft",
  },
  story_message: {
    anchor: "#our-story",
    group: "Explore",
    icon: BookOpen,
    key: "story_message",
    label: "Story",
    topNav: true,
    surface: "light",
  },
  contact_socials: {
    anchor: "#contact",
    group: "Support",
    icon: Phone,
    key: "contact_socials",
    label: "Contact",
    surface: "dark",
  },
};

const requiredSectionSet = new Set<string>(requiredWeddingSections);
const contractOrder = eventWebsiteSectionContract.map((entry) => entry.key);

export function getVisibleClientSectionKeys(
  event: EventWebsiteRenderModel,
): ClientSectionKey[] {
  const visible = event.sections
    .filter((section) => section.enabled)
    .map((section) => section.key)
    .filter((key): key is ClientSectionKey => {
      const descriptor = clientSectionRegistry[key as ClientSectionKey];
      return Boolean(
        descriptor && (!descriptor.designOnly || event.source === "design"),
      );
    });
  const keys = new Set<ClientSectionKey>(visible);

  for (const key of contractOrder) {
    if (requiredSectionSet.has(key)) {
      keys.add(key);
    }
  }

  return [
    ...visible,
    ...Array.from(keys).filter((key) => !visible.includes(key)),
  ];
}

export function getVisibleClientSections(event: EventWebsiteRenderModel) {
  return getVisibleClientSectionKeys(event).map(
    (key) => clientSectionRegistry[key],
  );
}
