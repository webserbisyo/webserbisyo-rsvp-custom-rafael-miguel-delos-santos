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

export type SectionBackgroundToken =
  | "coral"
  | "coral-deep"
  | "cocoa"
  | "cream"
  | "gallery-peach"
  | "gallery-sand"
  | "ivory"
  | "seafoam"
  | "seafoam-light";

export type SectionBackgroundKind = "accent" | "gradient" | "image" | "solid";
export type SectionDecorativeTransition = "bouquet" | "decorativeGradient";
export type SectionTransitionVariant =
  | "accentBandWave"
  | SectionDecorativeTransition
  | "imageToSolidWave"
  | "none"
  | "subtleWave";

export type SectionVisualTheme = {
  acceptedEntryTransitions?: SectionDecorativeTransition[];
  background: SectionBackgroundToken;
  backgroundKind: SectionBackgroundKind;
  entryBackground?: SectionBackgroundToken;
  exitBackground?: SectionBackgroundToken;
  preferredTransition?: SectionDecorativeTransition;
};

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
  visual: SectionVisualTheme;
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
    visual: { background: "ivory", backgroundKind: "image" },
  },
  countdown: {
    anchor: "#countdown",
    group: "Explore",
    icon: Clock3,
    key: "countdown",
    label: "Countdown",
    topNav: true,
    visual: {
      background: "cream",
      backgroundKind: "solid",
      preferredTransition: "decorativeGradient",
    },
  },
  music_effects: {
    anchor: "#music",
    key: "music_effects",
    label: "Music",
    visual: {
      background: "seafoam",
      backgroundKind: "gradient",
      acceptedEntryTransitions: ["decorativeGradient"],
      entryBackground: "seafoam-light",
      exitBackground: "seafoam",
    },
  },
  gallery: {
    anchor: "#gallery",
    group: "Explore",
    icon: Image,
    key: "gallery",
    label: "Gallery",
    topNav: true,
    visual: {
      background: "gallery-peach",
      backgroundKind: "gradient",
      entryBackground: "gallery-peach",
      exitBackground: "gallery-sand",
    },
  },
  main_event: {
    anchor: "#ceremony",
    dock: true,
    group: "Guest Essentials",
    icon: CalendarDays,
    key: "main_event",
    label: "Ceremony",
    visual: { background: "ivory", backgroundKind: "solid" },
  },
  venue: {
    anchor: "#venue",
    dock: true,
    group: "Guest Essentials",
    icon: MapPin,
    key: "venue",
    label: "Venue",
    visual: {
      background: "cream",
      backgroundKind: "solid",
      preferredTransition: "bouquet",
    },
  },
  secondary_event: {
    anchor: "#reception",
    dock: true,
    group: "Guest Essentials",
    icon: Utensils,
    key: "secondary_event",
    label: "Reception",
    visual: {
      acceptedEntryTransitions: ["bouquet"],
      background: "ivory",
      backgroundKind: "solid",
    },
  },
  timeline_program: {
    anchor: "#timeline",
    group: "Explore",
    icon: CalendarDays,
    key: "timeline_program",
    label: "Timeline",
    topNav: true,
    visual: { background: "cream", backgroundKind: "solid" },
  },
  entourage: {
    anchor: "#entourage",
    group: "Wedding Info",
    icon: Users,
    key: "entourage",
    label: "Entourage",
    visual: { background: "ivory", backgroundKind: "solid" },
  },
  principal_sponsors: {
    anchor: "#sponsors",
    group: "Wedding Info",
    icon: Award,
    key: "principal_sponsors",
    label: "Sponsors",
    visual: { background: "cream", backgroundKind: "solid" },
  },
  attire_motif: {
    anchor: "#attire",
    dock: true,
    group: "Guest Essentials",
    icon: Shirt,
    key: "attire_motif",
    label: "Attire",
    visual: { background: "ivory", backgroundKind: "solid" },
  },
  extra_info: {
    anchor: "#extra-info",
    group: "Wedding Info",
    icon: Sparkles,
    key: "extra_info",
    label: "Details",
    topNav: true,
    visual: { background: "cream", backgroundKind: "solid" },
  },
  rsvp_form: {
    anchor: "/rsvp",
    dock: true,
    group: "Guest Essentials",
    icon: Mail,
    key: "rsvp_form",
    label: "RSVP",
    primary: true,
    visual: {
      background: "coral",
      backgroundKind: "accent",
      entryBackground: "coral",
      exitBackground: "coral-deep",
    },
  },
  gift_details: {
    anchor: "#gifts",
    group: "Wedding Info",
    icon: Gift,
    key: "gift_details",
    label: "Gifts",
    visual: { background: "ivory", backgroundKind: "solid" },
  },
  guestbook: {
    anchor: "#guestbook",
    group: "Explore",
    icon: MessageCircle,
    key: "guestbook",
    label: "Guestbook",
    topNav: true,
    visual: { background: "cream", backgroundKind: "solid" },
  },
  story_message: {
    anchor: "#our-story",
    group: "Explore",
    icon: BookOpen,
    key: "story_message",
    label: "Story",
    topNav: true,
    visual: { background: "ivory", backgroundKind: "solid" },
  },
  contact_socials: {
    anchor: "#contact",
    group: "Support",
    icon: Phone,
    key: "contact_socials",
    label: "Contact",
    visual: { background: "cocoa", backgroundKind: "accent" },
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
