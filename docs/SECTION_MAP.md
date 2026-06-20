# Section Map

This map reflects the current active runtime and the current `PlatformRenderModel`.

Active runtime renderer:

- `src/components/platform/PublicEventPageContent.tsx`
- `src/components/platform/EventWebsiteRenderer.tsx`

Phase 5 note:

- a page-level client renderer scaffold now exists under `src/client/renderer/*`
- it is disabled by default in the neutral starter
- section-level overrides remain deferred
- clone-only presentation libraries should stay in `src/client/libs/*` and must not change section-key or RSVP contracts

Section list:

## `host_info`

- Human label: Couple Info
- Purpose: primary hero/couple identity section
- Runtime status: active
- Required/optional: required
- PlatformRenderModel fields: `coupleInfo.displayAs`, `coupleInfo.hostLine`, `coupleInfo.shortHostMessage`, `coupleInfo.groomName`, `coupleInfo.brideName`
- Anchor guidance: `data-preview-section="host_info"`
- Future customization note: future `src/client/` work may wrap or style this section without changing its data contract

## `countdown`

- Human label: Countdown
- Purpose: event countdown block
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `countdown.title`, `countdown.shortNote`, ceremony date/time fields used for countdown target
- Anchor guidance: `#countdown`
- Future customization note: keep countdown logic platform-owned; future `src/client/` work should stay presentational

## `music_effects`

- Human label: Music
- Purpose: music/effects CTA block
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `musicEffects.musicLink`, `musicEffects.musicTitle`, `musicEffects.playButtonLabel`, `musicEffects.shortNote`
- Anchor guidance: `data-preview-section="music_effects"`
- Future customization note: future `src/client/` work may restyle the card and CTA without changing link ownership

## `main_event`

- Human label: Ceremony
- Purpose: ceremony date/time/deadline section
- Runtime status: active
- Required/optional: required
- PlatformRenderModel fields: `ceremony.eventLabel`, `ceremony.eventDate`, `ceremony.eventTime`, `ceremony.endTime`, `ceremony.scheduleNote`, `ceremony.rsvpDeadline`
- Anchor guidance: `data-preview-section="main_event"`
- Future customization note: keep ceremony data parsing in the protected render-model layer

## `venue`

- Human label: Venue
- Purpose: venue name, address, and map link
- Runtime status: active
- Required/optional: required
- PlatformRenderModel fields: `venue.venueName`, `venue.address`, `venue.mapsLink`, `venue.arrivalNote`
- Anchor guidance: `data-preview-section="venue"`
- Future customization note: future client work may decorate the venue block, but must not change map-link ownership

## `secondary_event`

- Human label: Reception
- Purpose: secondary event or reception details
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `reception.title`, `reception.venueName`, `reception.address`, `reception.startTime`, `reception.endTime`, `reception.note`, `reception.mapsLink`
- Anchor guidance: `data-preview-section="secondary_event"`
- Future customization note: keep section optionality and visibility logic untouched

## `timeline_program`

- Human label: Timeline / Program
- Purpose: event schedule list
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `timelineProgram.items[]` with `id`, `time`, `title`, `description`
- Anchor guidance: `data-preview-section="timeline_program"`
- Future customization note: future client work may change presentation only

## `entourage`

- Human label: Entourage
- Purpose: wedding entourage groups and names
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `entourage.introLine`, `entourage.groups[]` with `id`, `groupTitle`, `names`
- Anchor guidance: `data-preview-section="entourage"`
- Future customization note: future client styling can reorganize layout visually, not semantically

## `principal_sponsors`

- Human label: Principal Sponsors
- Purpose: sponsor names list
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `principalSponsors.introLine`, `principalSponsors.names`
- Anchor guidance: `data-preview-section="principal_sponsors"`
- Future customization note: keep long-name wrapping support intact

## `attire_motif`

- Human label: Attire / Dress Code
- Purpose: dress code and color motif guidance
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `attireDressCode.sectionIntro`, `attireDressCode.dressCodeNote`, `attireDressCode.colorMotifNote`
- Anchor guidance: `data-preview-section="attire_motif"`
- Future customization note: future `src/client/` work should remain token/styling-focused

## `extra_info`

- Human label: Extra Info
- Purpose: extra notes and guest guidance
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `extraInfo.sectionTitle`, `extraInfo.sectionIntro`, `extraInfo.items[]` with `id`, `title`, `details`
- Anchor guidance: `data-preview-section="extra_info"`
- Future customization note: preserve safe text wrapping and optional visibility

## `rsvp_form`

- Human label: RSVP
- Purpose: inline RSVP foundation block
- Runtime status: active
- Required/optional: required
- PlatformRenderModel fields: `rsvpForm.title`, `rsvpForm.body`, `rsvpForm.note`, `rsvpForm.plusOneEnabled`, `rsvpForm.companionLimit`, `rsvpForm.companionNameEnabled`, `rsvpForm.companionAgeEnabled`, `rsvpForm.emailEnabled`, `rsvpForm.emailRequired`, `rsvpForm.phoneEnabled`, `rsvpForm.phoneRequired`, `rsvpForm.foodAllergiesEnabled`, `rsvpForm.messageToHostEnabled`
- Anchor guidance: `#rsvp` and `#rsvp-form`
- Future customization note: future `src/client/` work may style or wrap the section, but must not change ownership or submission behavior
- Special rule: homepage anchors stay inline, dedicated local `/rsvp` is allowed, submit stays disabled, no iframe, no fake success

## `gift_details`

- Human label: Gift Details
- Purpose: gift options and notes
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `giftDetails.sectionIntro`, `giftDetails.giftNote`, `giftDetails.options[]` with `id`, `title`, `description`, `imageUrl`, `imageAlt`
- Anchor guidance: `data-preview-section="gift_details"`
- Future customization note: do not generate fake QR codes or media

## `guestbook`

- Human label: Guestbook
- Purpose: approved guest messages
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `guestbook.sectionTitle`, `guestbook.sectionIntro`, `guestbook.emptyStateMessage`; plus `guestbookMessages[]`
- Anchor guidance: `data-preview-section="guestbook"`
- Future customization note: preserve approved-message-only behavior

## `story_message`

- Human label: Love Story
- Purpose: story/message section
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `loveStory.storyTitle`, `loveStory.storyBody`, `loveStory.sectionIntro`
- Anchor guidance: `data-preview-section="story_message"`
- Future customization note: future client work may restyle copy presentation without changing data parsing

## `contact_socials`

- Human label: Contact / Socials
- Purpose: footer-style contact and social links section
- Runtime status: active
- Required/optional: optional
- PlatformRenderModel fields: `contactSocials.contactPerson`, `contactSocials.contactNumber`, `contactSocials.email`, `contactSocials.facebookUrl`, `contactSocials.instagramUrl`, `contactSocials.tikTokUrl`
- Anchor guidance: `data-preview-section="contact_socials"`
- Future customization note: keep it inside the one-page flow and preserve public-safe links only

Foundation/inactive note:

## `gallery`

- Human label: Gallery
- Purpose: future gallery foundation
- Runtime status: not active in the current renderer
- Required/optional: optional foundation only
- Notes: appears in types/docs/legacy registry, but is not part of the active `PlatformRenderModel` section list used by `EventWebsiteRenderer.tsx`
- Future customization note: do not treat gallery as an active runtime section until a later approved phase adds real platform-backed support
