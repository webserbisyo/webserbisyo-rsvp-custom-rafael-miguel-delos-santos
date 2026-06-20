import type { EventWebsiteRenderModel, GuestbookMessage, NormalizedSection } from "@/types/public-event";

export const platformSectionKeys = [
  "host_info",
  "countdown",
  "music_effects",
  "main_event",
  "venue",
  "secondary_event",
  "timeline_program",
  "entourage",
  "principal_sponsors",
  "attire_motif",
  "extra_info",
  "rsvp_form",
  "gift_details",
  "guestbook",
  "story_message",
  "contact_socials"
] as const;

export type PlatformSectionKey = (typeof platformSectionKeys)[number];

export type PlatformTimelineItem = {
  description: string;
  id: string;
  time: string;
  title: string;
};

export type PlatformEntourageGroup = {
  groupTitle: string;
  id: string;
  names: string;
};

export type PlatformExtraInfoItem = {
  details: string;
  id: string;
  title: string;
};

export type PlatformGiftOption = {
  description: string;
  id: string;
  imageAlt: string;
  imageUrl: string;
  title: string;
};

export type PlatformGuestbookMessage = {
  approvedAt: string | null;
  guestName: string;
  id: string;
  message: string;
  submittedAt: string | null;
};

export type PlatformRenderModel = {
  attireDressCode: {
    colorMotifNote: string;
    dressCodeNote: string;
    sectionIntro: string;
  };
  ceremony: {
    endTime: string;
    eventDate: string;
    eventLabel: string;
    eventTime: string;
    rsvpDeadline: string;
    scheduleNote: string;
  };
  contactSocials: {
    contactNumber: string;
    contactPerson: string;
    email: string;
    facebookUrl: string;
    instagramUrl: string;
    tikTokUrl: string;
  };
  countdown: {
    shortNote: string;
    title: string;
  };
  coupleInfo: {
    brideName: string;
    displayAs: string;
    groomName: string;
    hostLine: string;
    shortHostMessage: string;
  };
  entourage: {
    groups: PlatformEntourageGroup[];
    introLine: string;
  };
  extraInfo: {
    items: PlatformExtraInfoItem[];
    sectionIntro: string;
    sectionTitle: string;
  };
  giftDetails: {
    giftNote: string;
    options: PlatformGiftOption[];
    sectionIntro: string;
  };
  guestbook: {
    emptyStateMessage: string;
    sectionIntro: string;
    sectionTitle: string;
  };
  loveStory: {
    sectionIntro: string;
    storyBody: string;
    storyTitle: string;
  };
  musicEffects: {
    musicLink: string;
    musicTitle: string;
    playButtonLabel: string;
    shortNote: string;
  };
  principalSponsors: {
    introLine: string;
    names: string;
  };
  reception: {
    address: string;
    endTime: string;
    mapsLink: string;
    note: string;
    startTime: string;
    title: string;
    venueName: string;
  };
  rsvpForm: {
    body: string;
    companionAgeEnabled: boolean;
    companionLimit: string;
    companionNameEnabled: boolean;
    emailEnabled: boolean;
    emailRequired: boolean;
    foodAllergiesEnabled: boolean;
    messageToHostEnabled: boolean;
    note: string;
    phoneEnabled: boolean;
    phoneRequired: boolean;
    plusOneEnabled: boolean;
    title: string;
  };
  timelineProgram: {
    items: PlatformTimelineItem[];
  };
  venue: {
    address: string;
    arrivalNote: string;
    mapsLink: string;
    venueName: string;
  };
};

export type PlatformRendererContext = {
  draft: PlatformRenderModel;
  eventSlug: string;
  guestbookMessages: PlatformGuestbookMessage[];
  previewMode?: "dashboard";
  sections: PlatformSectionKey[];
};

const platformSectionKeySet = new Set<string>(platformSectionKeys);
const requiredSectionKeys = new Set<string>(["host_info", "main_event", "venue", "rsvp_form"]);

export function isPlatformSectionKey(value: string): value is PlatformSectionKey {
  return platformSectionKeySet.has(value);
}

export function buildPlatformRendererContext(event: EventWebsiteRenderModel): PlatformRendererContext {
  const rawRenderModel = record(event.raw.renderModel);
  const sectionsByKey = sectionsByKeyFromEvent(event);
  const sections = visiblePlatformSections(event.sections, event.source);

  return {
    draft: {
      attireDressCode: buildAttireDressCode(sectionsByKey.get("attire_motif"), rawRenderModel),
      ceremony: buildCeremony(sectionsByKey.get("main_event"), rawRenderModel, event),
      contactSocials: buildContactSocials(sectionsByKey.get("contact_socials"), rawRenderModel),
      countdown: buildCountdown(sectionsByKey.get("countdown"), rawRenderModel),
      coupleInfo: buildCoupleInfo(sectionsByKey.get("host_info"), rawRenderModel, event),
      entourage: buildEntourage(sectionsByKey.get("entourage"), rawRenderModel),
      extraInfo: buildExtraInfo(sectionsByKey.get("extra_info"), rawRenderModel),
      giftDetails: buildGiftDetails(sectionsByKey.get("gift_details"), rawRenderModel),
      guestbook: buildGuestbook(sectionsByKey.get("guestbook"), rawRenderModel),
      loveStory: buildLoveStory(sectionsByKey.get("story_message"), rawRenderModel),
      musicEffects: buildMusicEffects(sectionsByKey.get("music_effects"), rawRenderModel),
      principalSponsors: buildPrincipalSponsors(sectionsByKey.get("principal_sponsors"), rawRenderModel),
      reception: buildReception(sectionsByKey.get("secondary_event"), rawRenderModel),
      rsvpForm: buildRsvpForm(sectionsByKey.get("rsvp_form"), rawRenderModel),
      timelineProgram: buildTimelineProgram(sectionsByKey.get("timeline_program"), rawRenderModel),
      venue: buildVenue(sectionsByKey.get("venue"), rawRenderModel)
    },
    eventSlug: event.eventSlug,
    guestbookMessages: normalizePlatformGuestbookMessages(event.guestbookMessages),
    previewMode: event.previewMode,
    sections
  };
}

function sectionsByKeyFromEvent(event: EventWebsiteRenderModel): Map<PlatformSectionKey, Record<string, unknown>> {
  const output = new Map<PlatformSectionKey, Record<string, unknown>>();
  for (const section of event.sections) {
    if (isPlatformSectionKey(section.key)) {
      output.set(section.key, section.content);
    }
  }
  return output;
}

function visiblePlatformSections(sections: NormalizedSection[], source: EventWebsiteRenderModel["source"]): PlatformSectionKey[] {
  return sections
    .filter((section) => {
      if (!isPlatformSectionKey(section.key) || !section.enabled) return false;
      if (source === "design") return true;
      if (requiredSectionKeys.has(section.key)) return true;
      return hasValue(section.content);
    })
    .map((section) => section.key as PlatformSectionKey);
}

function buildCoupleInfo(
  content: Record<string, unknown> | undefined,
  rawRenderModel: Record<string, unknown>,
  event: EventWebsiteRenderModel
): PlatformRenderModel["coupleInfo"] {
  const raw = record(rawRenderModel.coupleInfo);
  const groomName = firstString(content?.groomName, content?.groom, personName(content?.groom), raw.groomName);
  const brideName = firstString(content?.brideName, content?.bride, personName(content?.bride), raw.brideName);
  const coupleNames = groomName && brideName ? `${groomName} & ${brideName}` : groomName || brideName;
  const displayAs =
    firstString(content?.displayAs, content?.coupleNames, content?.displayName, raw.displayAs) ||
    coupleNames ||
    event.coupleDisplayName ||
    event.title;

  return {
    brideName,
    displayAs,
    groomName,
    hostLine: firstString(content?.hostLine, content?.kicker, raw.hostLine),
    shortHostMessage: firstString(content?.shortHostMessage, content?.hostCopy, content?.message, content?.description, raw.shortHostMessage)
  };
}

function buildCountdown(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["countdown"] {
  const raw = record(rawRenderModel.countdown);
  return {
    shortNote: firstString(content?.shortNote, content?.description, raw.shortNote),
    title: firstString(content?.title, content?.label, raw.title) || "Counting down to the celebration"
  };
}

function buildMusicEffects(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["musicEffects"] {
  const raw = record(rawRenderModel.musicEffects);
  return {
    musicLink: firstString(content?.musicLink, content?.link, content?.url, raw.musicLink),
    musicTitle: firstString(content?.musicTitle, content?.title, raw.musicTitle) || "Wedding ambience",
    playButtonLabel: firstString(content?.playButtonLabel, content?.buttonLabel, raw.playButtonLabel) || "Play",
    shortNote: firstString(content?.shortNote, content?.description, raw.shortNote)
  };
}

function buildCeremony(
  content: Record<string, unknown> | undefined,
  rawRenderModel: Record<string, unknown>,
  event: EventWebsiteRenderModel
): PlatformRenderModel["ceremony"] {
  const raw = record(rawRenderModel.ceremony);
  const dateTime = firstString(content?.dateTime, event.eventDate, raw.eventDate);
  return {
    endTime: firstString(content?.endTime, raw.endTime),
    eventDate: firstString(content?.eventDate, dateTime, raw.eventDate),
    eventLabel: firstString(content?.eventLabel, content?.label, content?.title, raw.eventLabel) || "Wedding Ceremony",
    eventTime: firstString(content?.eventTime, dateTime, raw.eventTime),
    rsvpDeadline: firstString(content?.rsvpDeadline, event.rsvpDeadlineLabel, raw.rsvpDeadline),
    scheduleNote: firstString(content?.scheduleNote, content?.note, raw.scheduleNote)
  };
}

function buildVenue(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["venue"] {
  const raw = record(rawRenderModel.venue);
  return {
    address: firstString(content?.address, raw.address),
    arrivalNote: firstString(content?.arrivalNote, content?.note, raw.arrivalNote),
    mapsLink: firstString(content?.mapsLink, content?.mapsUrl, raw.mapsLink),
    venueName: firstString(content?.venueName, content?.name, raw.venueName) || "Venue"
  };
}

function buildReception(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["reception"] {
  const raw = record(rawRenderModel.reception);
  const dateTime = firstString(content?.dateTime);
  return {
    address: firstString(content?.address, raw.address),
    endTime: firstString(content?.endTime, raw.endTime),
    mapsLink: firstString(content?.mapsLink, content?.mapsUrl, raw.mapsLink),
    note: firstString(content?.note, content?.description, raw.note),
    startTime: firstString(content?.startTime, dateTime, raw.startTime),
    title: firstString(content?.title, content?.label, raw.title) || "Reception",
    venueName: firstString(content?.venueName, content?.venue, raw.venueName)
  };
}

function buildTimelineProgram(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["timelineProgram"] {
  const raw = record(rawRenderModel.timelineProgram);
  const items = arrayOfRecords(content?.items).length ? arrayOfRecords(content?.items) : arrayOfRecords(raw.items);
  return {
    items: items.map((item, index) => ({
      description: firstString(item.description, item.body, item.details),
      id: firstString(item.id) || `timeline-${index + 1}`,
      time: firstString(item.time),
      title: firstString(item.title, item.label) || "Program Item"
    }))
  };
}

function buildEntourage(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["entourage"] {
  const raw = record(rawRenderModel.entourage);
  const groups = arrayOfRecords(content?.groups).length ? arrayOfRecords(content?.groups) : arrayOfRecords(raw.groups);
  return {
    groups: groups.map((group, index) => ({
      groupTitle: firstString(group.groupTitle, group.title, group.label) || "Wedding Party",
      id: firstString(group.id) || `entourage-${index + 1}`,
      names: namesToLines(group.names)
    })),
    introLine: firstString(content?.introLine, content?.intro, raw.introLine)
  };
}

function buildPrincipalSponsors(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["principalSponsors"] {
  const raw = record(rawRenderModel.principalSponsors);
  return {
    introLine: firstString(content?.introLine, content?.intro, raw.introLine),
    names: namesToLines(content?.names) || firstString(raw.names)
  };
}

function buildAttireDressCode(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["attireDressCode"] {
  const raw = record(rawRenderModel.attireDressCode);
  return {
    colorMotifNote: firstString(content?.colorMotifNote, content?.motif, raw.colorMotifNote),
    dressCodeNote: firstString(content?.dressCodeNote, content?.dressCode, raw.dressCodeNote),
    sectionIntro: firstString(content?.sectionIntro, content?.intro, content?.notes, raw.sectionIntro)
  };
}

function buildExtraInfo(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["extraInfo"] {
  const raw = record(rawRenderModel.extraInfo);
  const items = arrayOfRecords(content?.items).length ? arrayOfRecords(content?.items) : arrayOfRecords(raw.items);
  return {
    items: items.map((item, index) => ({
      details: firstString(item.details, item.body, item.description),
      id: firstString(item.id) || `extra-info-${index + 1}`,
      title: firstString(item.title, item.label) || "Note"
    })),
    sectionIntro: firstString(content?.sectionIntro, content?.intro, raw.sectionIntro),
    sectionTitle: firstString(content?.sectionTitle, content?.title, raw.sectionTitle) || "Extra Info"
  };
}

function buildRsvpForm(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["rsvpForm"] {
  const raw = record(rawRenderModel.rsvpForm);
  return {
    body: firstString(content?.body, content?.description, raw.body),
    companionAgeEnabled: boolValue(content?.companionAgeEnabled, raw.companionAgeEnabled),
    companionLimit: firstString(content?.companionLimit, raw.companionLimit) || "1",
    companionNameEnabled: boolValue(content?.companionNameEnabled, raw.companionNameEnabled),
    emailEnabled: boolValue(content?.emailEnabled, raw.emailEnabled, true),
    emailRequired: boolValue(content?.emailRequired, raw.emailRequired),
    foodAllergiesEnabled: boolValue(content?.foodAllergiesEnabled, raw.foodAllergiesEnabled),
    messageToHostEnabled: boolValue(content?.messageToHostEnabled, raw.messageToHostEnabled, true),
    note: firstString(content?.note, raw.note),
    phoneEnabled: boolValue(content?.phoneEnabled, raw.phoneEnabled),
    phoneRequired: boolValue(content?.phoneRequired, raw.phoneRequired),
    plusOneEnabled: boolValue(content?.plusOneEnabled, raw.plusOneEnabled),
    title: firstString(content?.title, content?.label, raw.title) || "Confirm Your Attendance"
  };
}

function buildGiftDetails(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["giftDetails"] {
  const raw = record(rawRenderModel.giftDetails);
  const options = arrayOfRecords(content?.options).length ? arrayOfRecords(content?.options) : arrayOfRecords(raw.options);
  return {
    giftNote: firstString(content?.giftNote, content?.note, raw.giftNote),
    options: options.map((option, index) => {
      const image = record(option.image);
      return {
        description: firstString(option.description, option.body, option.details),
        id: firstString(option.id) || `gift-option-${index + 1}`,
        imageAlt: firstString(image.alt, option.imageAlt, option.title, option.label),
        imageUrl: firstString(image.url, option.imageUrl, option.url),
        title: firstString(option.title, option.label) || "Gift option"
      };
    }),
    sectionIntro: firstString(content?.sectionIntro, content?.intro, raw.sectionIntro)
  };
}

function buildGuestbook(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["guestbook"] {
  const raw = record(rawRenderModel.guestbook);
  return {
    emptyStateMessage: firstString(content?.emptyStateMessage, raw.emptyStateMessage) || "Approved guest messages will appear here soon.",
    sectionIntro: firstString(content?.sectionIntro, content?.intro, raw.sectionIntro) || "Messages shared by family and friends.",
    sectionTitle: firstString(content?.sectionTitle, content?.title, raw.sectionTitle) || "A Note from Our Guests"
  };
}

function buildLoveStory(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["loveStory"] {
  const raw = record(rawRenderModel.loveStory);
  return {
    sectionIntro: firstString(content?.sectionIntro, content?.intro, raw.sectionIntro),
    storyBody: firstString(content?.storyBody, content?.body, content?.story, content?.message, content?.description, raw.storyBody),
    storyTitle: firstString(content?.storyTitle, content?.title, raw.storyTitle) || "Our Story"
  };
}

function buildContactSocials(content: Record<string, unknown> | undefined, rawRenderModel: Record<string, unknown>): PlatformRenderModel["contactSocials"] {
  const raw = record(rawRenderModel.contactSocials);
  const socials = arrayOfRecords(content?.socials);
  return {
    contactNumber: firstString(content?.contactNumber, content?.phone, raw.contactNumber),
    contactPerson: firstString(content?.contactPerson, content?.contactName, raw.contactPerson),
    email: firstString(content?.email, raw.email),
    facebookUrl: firstString(content?.facebookUrl, socialUrl(socials, "facebook"), raw.facebookUrl),
    instagramUrl: firstString(content?.instagramUrl, socialUrl(socials, "instagram"), raw.instagramUrl),
    tikTokUrl: firstString(content?.tikTokUrl, socialUrl(socials, "tiktok"), raw.tikTokUrl)
  };
}

function normalizePlatformGuestbookMessages(messages: GuestbookMessage[]): PlatformGuestbookMessage[] {
  return messages
    .filter((message) => stringValue(message.message))
    .map((message, index) => ({
      approvedAt: stringValue(message.createdAt) || null,
      guestName: stringValue(message.name) || "Guest",
      id: stringValue(message.id) || `guestbook-${index + 1}`,
      message: stringValue(message.message),
      submittedAt: stringValue(message.createdAt) || null
    }));
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    const next = stringValue(value);
    if (next) return next;
  }
  return "";
}

function boolValue(...values: unknown[]): boolean {
  for (const value of values) {
    if (typeof value === "boolean") return value;
  }
  return false;
}

function arrayOfRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object" && !Array.isArray(item)))
    : [];
}

function personName(value: unknown): string {
  const person = record(value);
  return firstString(
    person.displayName,
    person.fullName,
    [stringValue(person.firstName), stringValue(person.lastName)].filter(Boolean).join(" "),
    person.name
  );
}

function namesToLines(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => stringValue(item)).filter(Boolean).join("\n");
  }
  return stringValue(value);
}

function socialUrl(socials: Record<string, unknown>[], label: string): string {
  const match = socials.find((social) => stringValue(social.label).toLowerCase().replace(/\s+/g, "") === label);
  return firstString(match?.url, match?.href);
}

function hasValue(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasValue);
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).some(hasValue);
  return true;
}
