import { formatDate, formatDateTime, formatRsvpDeadline, formatTime } from "@/lib/formatters";
import type {
  EventWebsiteRenderModel,
  GuestbookMessage,
  NormalizedSection,
  PublicMediaAsset,
  PublicEventDto,
  PublicEventSection
} from "@/types/public-event";

type NormalizeInput = {
  event: PublicEventDto;
  source: "design" | "snapshot" | "live";
  previewMode?: "dashboard";
  eventSlug: string;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function boolValue(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function arrayOfStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => stringValue(item)).filter(Boolean);
}

function arrayOfRecords(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object" && !Array.isArray(item)));
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    const next = stringValue(value);
    if (next) return next;
  }
  return "";
}

function sectionFromObject(key: string, value: unknown, enabledOverride?: boolean): NormalizedSection {
  const section = record(value);
  const ownEnabled = boolValue(section.enabled ?? section.isEnabled ?? section.visible);
  return {
    key,
    title: stringValue(section.title),
    enabled: enabledOverride ?? ownEnabled ?? true,
    content: record(section.content ?? section.data ?? section)
  };
}

function normalizeSections(event: PublicEventDto): NormalizedSection[] {
  const content = record(event.content);
  const layout = record(content.layout);
  const website = record(event.website ?? event.websiteContent);
  const websiteLayout = record(website.layout);
  const contentSections = record(content.sections);
  const websiteSections = record(website.sections);
  const sectionsByKey = record(event.sectionsByKey);
  const enabledSections = record(layout.enabledSections ?? websiteLayout.enabledSections);
  const rawSections = event.sections ?? content.sections ?? website.sections;

  if (Array.isArray(event.sections) && event.sections.every((section) => typeof section === "string")) {
    const order = arrayOfStrings(event.sections);
    return order.map((key) => sectionFromObject(key, sectionsByKey[key] ?? contentSections[key] ?? websiteSections[key], boolValue(enabledSections[key])));
  }

  if (Array.isArray(rawSections)) {
    return rawSections
      .map((section: PublicEventSection) => {
        const key = stringValue(section.key ?? section.type);
        if (!key) return null;
        const ownEnabled = boolValue(section.enabled ?? section.isEnabled ?? section.visible);
        const normalized: NormalizedSection = {
          key,
          title: stringValue(section.title) || undefined,
          enabled: boolValue(enabledSections[key]) ?? ownEnabled ?? true,
          content: record(section.content ?? section.data ?? section)
        };
        return normalized;
      })
      .filter((section): section is NormalizedSection => Boolean(section));
  }

  const sectionsRecord = record(rawSections);
  const order = arrayOfStrings(event.sections).length
    ? arrayOfStrings(event.sections)
    : arrayOfStrings(layout.sectionOrder).length
      ? arrayOfStrings(layout.sectionOrder)
      : arrayOfStrings(websiteLayout.sectionOrder).length
        ? arrayOfStrings(websiteLayout.sectionOrder)
        : arrayOfStrings(website.sectionOrder).length
          ? arrayOfStrings(website.sectionOrder)
          : Object.keys(sectionsRecord).length
            ? Object.keys(sectionsRecord)
            : Object.keys(sectionsByKey).length
              ? Object.keys(sectionsByKey)
              : Object.keys(contentSections).length
                ? Object.keys(contentSections)
                : Object.keys(websiteSections);

  return order.map((key) => sectionFromObject(key, sectionsByKey[key] ?? sectionsRecord[key] ?? contentSections[key] ?? websiteSections[key], boolValue(enabledSections[key])));
}

function normalizeGuestbookMessages(event: PublicEventDto): GuestbookMessage[] {
  const content = record(event.content);
  const website = record(event.website ?? event.websiteContent);
  const messages = event.publicGuestbookMessages ?? event.guestbookMessages ?? content.publicGuestbookMessages ?? content.guestbookMessages ?? website.publicGuestbookMessages ?? website.guestbookMessages;
  return arrayOfRecords(messages)
    .filter((message) => message.isApproved !== false && stringValue(message.message))
    .map((message) => {
      const guestObj = record(message.guest);
      const rsvpObj = record(message.rsvp);
      return {
        id: (typeof message.id === "string" || typeof message.id === "number") ? message.id : undefined,
        name: firstString(
          message.guestName,
          message.name,
          message.fullName,
          message.displayName,
          message.senderName,
          message.authorName,
          guestObj.name,
          rsvpObj.name
        ) || undefined,
        message: stringValue(message.message),
        createdAt: stringValue(message.createdAt) || undefined,
        isApproved: message.isApproved === true
      };
    });
}

function normalizeAssets(event: PublicEventDto): Record<string, PublicMediaAsset> {
  const output: Record<string, PublicMediaAsset> = {};
  const content = record(event.content);
  const assetSource = event.assets ?? content.assets;

  if (Array.isArray(assetSource)) {
    for (const item of assetSource) {
      const asset = record(item) as PublicMediaAsset;
      const slot = stringValue(asset.slot);
      const url = stringValue(asset.url ?? asset.src);
      if (slot && url) output[slot] = { ...asset, slot, url };
    }
    return output;
  }

  for (const [slot, value] of Object.entries(record(assetSource))) {
    if (typeof value === "string") {
      const url = stringValue(value);
      if (url) output[slot] = { slot, url };
      continue;
    }

    const asset = record(value) as PublicMediaAsset;
    const url = stringValue(asset.url ?? asset.src);
    if (url) output[slot] = { ...asset, slot: stringValue(asset.slot) || slot, url };
  }

  return output;
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

function joinedCoupleNames(content: Record<string, unknown>): string {
  const groomName = firstString(content.groomName, content.groom, personName(content.groom));
  const brideName = firstString(content.brideName, content.bride, personName(content.bride));
  return groomName && brideName ? `${groomName} & ${brideName}` : groomName || brideName;
}

function normalizeCoupleDisplayName(sections: NormalizedSection[], fallbackTitle: string): string {
  const hostInfo = sections.find((section) => section.key === "host_info");
  const content = hostInfo?.content ?? {};
  return (
    firstString(content.displayAs, record(content.host_info).displayAs, record(content.hostInfo).displayAs) ||
    joinedCoupleNames(content) ||
    stringValue(content.coupleNames) ||
    stringValue(content.names) ||
    stringValue(content.displayName) ||
    fallbackTitle ||
    "WebSerbisyo RSVP Event"
  );
}

export function normalizePublicEvent({
  event,
  source,
  previewMode,
  eventSlug
}: NormalizeInput): EventWebsiteRenderModel {
  const slug = stringValue(event.slug ?? event.eventSlug) || eventSlug;
  const sections = normalizeSections(event);
  const eventTitle = stringValue(event.title ?? event.name);
  const coupleDisplayName = normalizeCoupleDisplayName(sections, eventTitle);
  const title = coupleDisplayName || eventTitle || "WebSerbisyo RSVP Event";
  const urls = record(event.urls);
  const formatted = record(event.formatted);
  const eventDate = stringValue(event.eventDate ?? event.date);
  const timezone = stringValue(event.timezone) || "Asia/Manila";
  const rsvpDeadline = stringValue(event.rsvp?.deadline ?? record(event.content).rsvpDeadline);

  return {
    source,
    previewMode,
    eventSlug: slug,
    title,
    coupleDisplayName,
    status: event.status,
    eventDate,
    eventDateLabel: stringValue(formatted.eventDate) || formatDate(eventDate, timezone),
    eventTimeLabel: stringValue(formatted.eventTime) || formatTime(eventDate, timezone),
    eventDateTimeLabel: stringValue(formatted.eventDateTime) || formatDateTime(eventDate, timezone),
    rsvpDeadlineLabel: stringValue(formatted.rsvpDeadline) || formatRsvpDeadline(rsvpDeadline, timezone),
    timezone,
    publicUrl: stringValue(urls.publicWebsiteUrl ?? event.publicUrl ?? urls.fallbackUrl ?? event.fallbackUrl),
    sections,
    guestbookMessages: normalizeGuestbookMessages(event),
    assets: normalizeAssets(event),
    raw: event
  };
}
