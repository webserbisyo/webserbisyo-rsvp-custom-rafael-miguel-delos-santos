/**
 * Build Client View Model
 *
 * Transforms the untyped `event.raw.renderModel` (Record<string, unknown>)
 * into a fully-typed ClientViewModel. This is the single point where
 * `any` → typed conversion happens. Downstream sections receive typed props.
 */

import type {
  ClientViewModel,
  ClientTimelineItem,
  ClientEntourageGroup,
  ClientExtraInfoItem,
  ClientGiftOption,
  ClientAttireSwatch,
} from "./client-view-model";
import { deriveCoupleBranding } from "../utils/derive-couple-branding";

/** Safe accessor — returns a sub-object or empty object. */
function obj(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const v = source[key];
  return (v && typeof v === "object" && !Array.isArray(v) ? v : {}) as Record<string, unknown>;
}

/** Safe accessor — returns an array or empty array. */
function arr(source: Record<string, unknown>, key: string): unknown[] {
  const v = source[key];
  return Array.isArray(v) ? v : [];
}

/** Safe string accessor. */
function str(source: Record<string, unknown>, key: string): string | undefined {
  const v = source[key];
  return typeof v === "string" ? v : undefined;
}

const DEFAULT_DIANNE_ATTIRE_PALETTE: ClientAttireSwatch[] = [
  { name: "Sand", hex: "#E8C97A" },
  { name: "Taupe", hex: "#B0A496" },
  { name: "Sage Green", hex: "#7A9E7E" },
  { name: "Dusty Blue", hex: "#9AB8C2" },
  { name: "Shell Pink", hex: "#FCD5CE" },
];

function parseAttirePalette(attireRaw: Record<string, unknown>): ClientAttireSwatch[] {
  const rawArray = arr(attireRaw, "palette");
  if (rawArray.length > 0) {
    const valid = rawArray
      .map((item) => {
        const it = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        const name = str(it, "name")?.trim();
        const hex = str(it, "hex")?.trim();
        if (name && hex && /^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
          return { name, hex };
        }
        return null;
      })
      .filter((item): item is ClientAttireSwatch => item !== null);

    if (valid.length > 0) return valid;
  }

  return DEFAULT_DIANNE_ATTIRE_PALETTE;
}

function getSectionRaw(raw: Record<string, unknown>, key: string): Record<string, unknown> {
  const direct = obj(raw, key);
  if (Object.keys(direct).length > 0) return direct;

  const sectionsByKey = obj(raw, "sectionsByKey");
  const byKey = obj(sectionsByKey, key);
  if (Object.keys(byKey).length > 0) return byKey;

  const sectionsArr = arr(raw, "sections");
  for (const s of sectionsArr) {
    if (s && typeof s === "object") {
      const sec = s as Record<string, unknown>;
      if (sec.key === key || sec.type === key) {
        const content = obj(sec, "content");
        if (Object.keys(content).length > 0) return content;
        return sec;
      }
    }
  }

  return {};
}

export function buildClientViewModel(raw: Record<string, unknown>): ClientViewModel {
  const coupleInfoRaw = getSectionRaw(raw, "host_info");
  const ceremonyRaw = getSectionRaw(raw, "main_event");
  const venueRaw = getSectionRaw(raw, "venue");
  const countdownRaw = getSectionRaw(raw, "countdown");
  const musicRaw = getSectionRaw(raw, "music_effects");
  const receptionRaw = getSectionRaw(raw, "reception");
  const timelineRaw = getSectionRaw(raw, "timeline_program");
  const entourageRaw = getSectionRaw(raw, "entourage");
  const sponsorsRaw = getSectionRaw(raw, "principal_sponsors");
  const attireRaw = Object.keys(getSectionRaw(raw, "attire")).length > 0 ? getSectionRaw(raw, "attire") : getSectionRaw(raw, "attireDressCode");
  const extraRaw = getSectionRaw(raw, "extra_info");
  const giftRaw = getSectionRaw(raw, "gift_details");
  const guestbookRaw = getSectionRaw(raw, "guestbook");
  const loveStoryRaw = getSectionRaw(raw, "love_story");
  const contactRaw = getSectionRaw(raw, "contact_socials");

  const branding = deriveCoupleBranding({
    partnerOneName: str(coupleInfoRaw, "groomName"),
    partnerTwoName: str(coupleInfoRaw, "brideName"),
    displayAs: str(coupleInfoRaw, "displayAs"),
    weddingDate: str(ceremonyRaw, "eventDate"),
  });

  return {
    branding,
    coupleInfo: {
      displayAs: str(coupleInfoRaw, "displayAs") ?? "",
      hostLine: str(coupleInfoRaw, "hostLine"),
      shortHostMessage: str(coupleInfoRaw, "shortHostMessage"),
    },
    ceremony: {
      eventDate: str(ceremonyRaw, "eventDate"),
      eventTime: str(ceremonyRaw, "eventTime"),
      eventLabel: str(ceremonyRaw, "eventLabel"),
      scheduleNote: str(ceremonyRaw, "scheduleNote"),
      endTime: str(ceremonyRaw, "endTime"),
      rsvpDeadline: str(ceremonyRaw, "rsvpDeadline"),
    },
    venue: {
      venueName: str(venueRaw, "venueName"),
      address: str(venueRaw, "address"),
      mapsLink: str(venueRaw, "mapsLink"),
      arrivalNote: str(venueRaw, "arrivalNote"),
    },
    countdown: {
      title: str(countdownRaw, "title"),
      shortNote: str(countdownRaw, "shortNote"),
    },
    musicEffects: {
      musicLink: str(musicRaw, "musicLink"),
      musicTitle: str(musicRaw, "musicTitle"),
      shortNote: str(musicRaw, "shortNote"),
      playButtonLabel: str(musicRaw, "playButtonLabel"),
    },
    reception: {
      receptionLabel: str(receptionRaw, "title"),
      venueName: str(receptionRaw, "venueName"),
      fullAddress: str(receptionRaw, "address"),
      startTime: str(receptionRaw, "startTime"),
      endTime: str(receptionRaw, "endTime"),
      googleMapsLink: str(receptionRaw, "mapsLink"),
      receptionNote: str(receptionRaw, "note"),
    },
    timelineProgram: {
      items: arr(timelineRaw, "items").map((item) => {
        const it = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          time: str(it, "time"),
          title: str(it, "title"),
          activity: str(it, "activity"),
          description: str(it, "description"),
        } satisfies ClientTimelineItem;
      }),
    },
    entourage: {
      introLine: str(entourageRaw, "introLine"),
      groups: arr(entourageRaw, "groups").map((g) => {
        const gr = (g && typeof g === "object" ? g : {}) as Record<string, unknown>;
        return {
          groupTitle: str(gr, "groupTitle"),
          role: str(gr, "role"),
          names: str(gr, "names") ?? "",
        } satisfies ClientEntourageGroup;
      }),
    },
    principalSponsors: {
      introLine: str(sponsorsRaw, "introLine"),
      names: str(sponsorsRaw, "names") ?? "",
    },
    attireDressCode: {
      title: str(attireRaw, "title"),
      shortNote: str(attireRaw, "shortNote"),
      sectionIntro: str(attireRaw, "sectionIntro"),
      dressCodeNote: str(attireRaw, "dressCodeNote"),
      colorMotifNote: str(attireRaw, "colorMotifNote"),
      palette: parseAttirePalette(attireRaw),
    },
    extraInfo: {
      sectionTitle: str(extraRaw, "sectionTitle"),
      sectionIntro: str(extraRaw, "sectionIntro"),
      items: arr(extraRaw, "items").map((item) => {
        const it = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
        return {
          title: str(it, "title") ?? "",
          details: str(it, "details"),
        } satisfies ClientExtraInfoItem;
      }),
    },
    giftDetails: {
      sectionIntro: str(giftRaw, "sectionIntro"),
      giftNote: str(giftRaw, "giftNote"),
      options: arr(giftRaw, "options").map((opt) => {
        const o = (opt && typeof opt === "object" ? opt : {}) as Record<string, unknown>;
        const imgRaw = obj(o, "image");
        const hasImage = str(imgRaw, "url");
        return {
          title: str(o, "title") ?? "",
          description: str(o, "description"),
          image: hasImage ? { url: hasImage, alt: str(imgRaw, "alt") } : undefined,
          linkUrl: str(o, "linkUrl"),
          linkLabel: str(o, "linkLabel"),
        } satisfies ClientGiftOption;
      }),
    },
    guestbook: {
      sectionTitle: str(guestbookRaw, "sectionTitle"),
      sectionIntro: str(guestbookRaw, "sectionIntro"),
      emptyStateMessage: str(guestbookRaw, "emptyStateMessage"),
    },
    loveStory: {
      storyTitle: str(loveStoryRaw, "storyTitle"),
      sectionIntro: str(loveStoryRaw, "sectionIntro"),
      storyBody: str(loveStoryRaw, "storyBody"),
    },
    contactSocials: {
      title: str(contactRaw, "title"),
      shortNote: str(contactRaw, "shortNote"),
      email: str(contactRaw, "email"),
      contactNumber: str(contactRaw, "contactNumber"),
      facebookUrl: str(contactRaw, "facebookUrl"),
      instagramUrl: str(contactRaw, "instagramUrl"),
      tikTokUrl: str(contactRaw, "tikTokUrl"),
      eventHashtag: str(contactRaw, "eventHashtag"),
    },
  };
}
