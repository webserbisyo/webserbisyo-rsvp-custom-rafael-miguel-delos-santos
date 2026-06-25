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
} from "./client-view-model";

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

export function buildClientViewModel(raw: Record<string, unknown>): ClientViewModel {
  const coupleInfoRaw = obj(raw, "coupleInfo");
  const ceremonyRaw = obj(raw, "ceremony");
  const venueRaw = obj(raw, "venue");
  const countdownRaw = obj(raw, "countdown");
  const musicRaw = obj(raw, "musicEffects");
  const receptionRaw = obj(raw, "reception");
  const timelineRaw = obj(raw, "timelineProgram");
  const entourageRaw = obj(raw, "entourage");
  const sponsorsRaw = obj(raw, "principalSponsors");
  const attireRaw = obj(raw, "attireDressCode");
  const extraRaw = obj(raw, "extraInfo");
  const giftRaw = obj(raw, "giftDetails");
  const guestbookRaw = obj(raw, "guestbook");
  const loveStoryRaw = obj(raw, "loveStory");
  const contactRaw = obj(raw, "contactSocials");

  return {
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
