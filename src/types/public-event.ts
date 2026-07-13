export type PublicEventStatus = "published" | "unpublished" | "draft" | string;

export type { WeddingSectionKey } from "@/lib/event-website-section-contract";

export type PublicRsvpState = {
  enabled?: boolean | null;
  deadline?: string | null;
  note?: string | null;
};

export type GuestbookMessage = {
  id?: string | number | null;
  name?: string | null;
  message?: string | null;
  createdAt?: string | null;
  isApproved?: boolean | null;
};

export type PublicEventSection = {
  key?: string | null;
  type?: string | null;
  title?: string | null;
  enabled?: boolean | null;
  isEnabled?: boolean | null;
  visible?: boolean | null;
  order?: number | null;
  content?: Record<string, unknown> | null;
  data?: Record<string, unknown> | null;
  items?: unknown[] | null;
};

export type EventWebsiteContent = {
  layout?: {
    sectionOrder?: string[] | null;
    enabledSections?: Record<string, boolean | null | undefined> | null;
  } | null;
  sections?: PublicEventSection[] | string[] | Record<string, unknown> | null;
  sectionOrder?: string[] | null;
  rsvp?: PublicRsvpState | null;
  guestbookMessages?: GuestbookMessage[] | null;
  [key: string]: unknown;
};

export type PublicEventUrls = {
  publicWebsiteUrl?: string | null;
  fallbackUrl?: string | null;
  [key: string]: unknown;
};

export type PublicEventFormatted = {
  eventDate?: string | null;
  eventTime?: string | null;
  eventDateTime?: string | null;
  rsvpDeadline?: string | null;
  [key: string]: unknown;
};

export type PublicAssetSlot =
  | "hero_background"
  | "couple_photo"
  | "venue_photo"
  | "gallery_image"
  | "gift_qr"
  | "monogram"
  | "section_decoration";

export type PublicMediaAsset = {
  slot?: PublicAssetSlot | string | null;
  url?: string | null;
  src?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  provider?: string | null;
  [key: string]: unknown;
};

export type PublicEventDto = {
  contractVersion?: number;
  id?: string | null;
  slug?: string | null;
  eventSlug?: string | null;
  title?: string | null;
  name?: string | null;
  status?: PublicEventStatus | null;
  eventType?: string | null;
  eventDate?: string | null;
  date?: string | null;
  timezone?: string | null;
  content?: EventWebsiteContent | null;
  website?: EventWebsiteContent | null;
  websiteContent?: EventWebsiteContent | null;
  sections?: PublicEventSection[] | string[] | Record<string, unknown> | null;
  rsvp?: PublicRsvpState | null;
  urls?: PublicEventUrls | null;
  formatted?: PublicEventFormatted | null;
  sectionsByKey?: Record<string, unknown> | null;
  assets?:
    | Record<string, PublicMediaAsset | string | null | undefined>
    | PublicMediaAsset[]
    | null;
  guestbookMessages?: GuestbookMessage[] | null;
  publicGuestbookMessages?: GuestbookMessage[] | null;
  publicUrl?: string | null;
  fallbackUrl?: string | null;
  savedRevision?: number;
  publishedRevision?: number;
  [key: string]: unknown;
};

export type PublicEventApiResponse = {
  data: PublicEventDto;
};

export type PublicEventApiError = {
  error: {
    code: string;
    message: string;
    scope: string;
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

export type NormalizedSection = {
  key: string;
  title?: string;
  enabled: boolean;
  content: Record<string, unknown>;
};

export type EventWebsiteRenderModel = {
  contractVersion: number;
  source: "design" | "snapshot" | "live";
  previewMode?: "dashboard";
  eventSlug: string;
  title: string;
  coupleDisplayName: string;
  status?: PublicEventStatus | null;
  eventDate?: string | null;
  eventDateLabel?: string | null;
  eventTimeLabel?: string | null;
  eventDateTimeLabel?: string | null;
  rsvpDeadlineLabel?: string | null;
  timezone?: string | null;
  publicUrl?: string | null;
  savedRevision: number;
  publishedRevision: number;
  sections: NormalizedSection[];
  guestbookMessages: GuestbookMessage[];
  assets: Record<string, PublicMediaAsset>;
  raw: PublicEventDto;
};

export type PublicEventResult =
  | { status: "available"; event: EventWebsiteRenderModel }
  | { status: "unavailable"; code?: string; message: string }
  | { status: "setup_error"; message: string }
  | { status: "network_error"; message: string }
  | { status: "malformed_response"; message: string };
