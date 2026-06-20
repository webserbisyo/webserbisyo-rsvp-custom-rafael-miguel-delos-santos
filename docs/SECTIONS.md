# Sections

Wedding registry keys:

- `host_info` -> platform Couple Info section
- `countdown` -> platform Countdown section
- `music_effects` -> platform Music section
- `main_event` -> platform Ceremony section
- `venue` -> platform Venue section
- `secondary_event` -> platform Reception section
- `timeline_program` -> platform Timeline section
- `entourage` -> platform Entourage section
- `principal_sponsors` -> platform Principal Sponsors section
- `attire_motif` -> platform Attire section
- `extra_info` -> platform Extra Info section
- `gallery` -> future platform-supported gallery foundation
- `rsvp_form` -> platform inline RSVP foundation section
- `gift_details` -> platform Gift Details section
- `guestbook` -> platform Guestbook section
- `story_message` -> platform Love Story section
- `contact_socials` -> platform Contact/Socials footer section

Required sections: `host_info`, `main_event`, `venue`, `rsvp_form`.

Optional sections: `countdown`, `music_effects`, `secondary_event`, `timeline_program`, `entourage`, `principal_sponsors`, `attire_motif`, `extra_info`, `gallery`, `gift_details`, `guestbook`, `story_message`, `contact_socials`.

Future keys visible in platform config but not implemented here: `overview`, `style_theme`.

`gallery` is a foundation section. Production gallery rendering requires main platform editor/API support and live public image data. Do not hardcode a client gallery in the starter.

Live mode renders enabled sections in API order, hides empty optional sections, and skips unknown keys safely.

Section text comes from clients and guests. Cards, pills, and footer lines must preserve the platform look while allowing long names, notes, and messages to wrap safely.

The starter default must use the same general section/card rhythm as the main platform wedding preview flow:

- Couple Info
- Countdown
- Music & Effects
- Ceremony
- Venue
- Reception
- Timeline / Program
- Entourage
- Principal Sponsors
- Attire / Motif
- Extra Info
- RSVP
- Gift Details
- Guestbook
- Love Story
- Contact/Footer

Gallery is future platform-supported. Keep the foundation section, but do not render Gallery in live mode unless the public API provides real gallery data. Design mode may show an empty gallery note for review.

Current supported order sources, in priority order:

- `data.sections` as an ordered string array.
- `data.content.layout.sectionOrder`.
- Legacy website section order fields.
- Object key order as a final fallback.

The platform section keys above are protected. Do not rename them for design work.

Stable anchor mapping:

- `host_info` -> `data-preview-section="host_info"`
- `countdown` -> `#countdown`
- `main_event` -> `data-preview-section="main_event"`
- `venue` -> `data-preview-section="venue"`
- `secondary_event` -> `data-preview-section="secondary_event"`
- `timeline_program` -> `data-preview-section="timeline_program"`
- `attire_motif` -> `data-preview-section="attire_motif"`
- `gallery` -> future platform-supported anchor only when implemented
- `gift_details` -> `data-preview-section="gift_details"`
- `guestbook` -> `data-preview-section="guestbook"`
- `rsvp_form` -> `#rsvp` and `#rsvp-form`
- `contact_socials` -> `data-preview-section="contact_socials"`
