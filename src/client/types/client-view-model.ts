/**
 * Client View Model Types
 *
 * Typed bridge between `event.raw.renderModel` (untyped any) and the client
 * section components. Each section imports only the sub-type it needs.
 *
 * These map 1:1 with the shape the platform API delivers inside renderModel
 * so extraction from the monolith is trivial — no data transformations.
 */

// ─── Section Sub-Models ──────────────────────────────────────────────

export type ClientCoupleInfo = {
  displayAs: string;
  hostLine?: string;
  shortHostMessage?: string;
};

export type ClientCeremonyData = {
  eventDate?: string;
  eventTime?: string;
  eventLabel?: string;
  scheduleNote?: string;
  endTime?: string;
  rsvpDeadline?: string;
};

export type ClientVenueData = {
  venueName?: string;
  address?: string;
  mapsLink?: string;
  arrivalNote?: string;
};

export type ClientCountdownData = {
  title?: string;
  shortNote?: string;
};

export type ClientMusicData = {
  musicLink?: string;
  musicTitle?: string;
  shortNote?: string;
  playButtonLabel?: string;
};

export type ClientReceptionData = {
  receptionLabel?: string;
  venueName?: string;
  fullAddress?: string;
  startTime?: string;
  endTime?: string;
  googleMapsLink?: string;
  receptionNote?: string;
};

export type ClientTimelineItem = {
  time?: string;
  title?: string;
  activity?: string;
  description?: string;
};

export type ClientEntourageGroup = {
  groupTitle?: string;
  role?: string;
  names: string;
};

export type ClientAttireData = {
  title?: string;
  shortNote?: string;
  sectionIntro?: string;
  dressCodeNote?: string;
  colorMotifNote?: string;
};

export type ClientExtraInfoItem = {
  title: string;
  details?: string;
};

export type ClientGiftOption = {
  title: string;
  description?: string;
  image?: { url: string; alt?: string };
  linkUrl?: string;
  linkLabel?: string;
};

export type ClientGuestbookData = {
  sectionTitle?: string;
  sectionIntro?: string;
  emptyStateMessage?: string;
};

export type ClientLoveStoryData = {
  storyTitle?: string;
  sectionIntro?: string;
  storyBody?: string;
};

export type ClientContactData = {
  title?: string;
  shortNote?: string;
  email?: string;
  contactNumber?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tikTokUrl?: string;
  eventHashtag?: string;
};

export type ClientSponsorData = {
  introLine?: string;
  names: string;
};

// ─── Top-Level View Model ────────────────────────────────────────────

export type ClientViewModel = {
  coupleInfo: ClientCoupleInfo;
  ceremony: ClientCeremonyData;
  venue: ClientVenueData;
  countdown: ClientCountdownData;
  musicEffects: ClientMusicData;
  reception: ClientReceptionData;
  timelineProgram: { items: ClientTimelineItem[] };
  entourage: { groups: ClientEntourageGroup[]; introLine?: string };
  principalSponsors: ClientSponsorData;
  attireDressCode: ClientAttireData;
  extraInfo: {
    sectionTitle?: string;
    sectionIntro?: string;
    items: ClientExtraInfoItem[];
  };
  giftDetails: {
    sectionIntro?: string;
    giftNote?: string;
    options: ClientGiftOption[];
  };
  guestbook: ClientGuestbookData;
  loveStory: ClientLoveStoryData;
  contactSocials: ClientContactData;
};
