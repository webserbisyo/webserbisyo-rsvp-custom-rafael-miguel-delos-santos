# Client Customization Rules

Client customization is frontend-only.

Current Phase 1 status:

- This repo is still the neutral reusable starter.
- `src/client/` is the planned future customization boundary.
- Phase 1 defines the rules and guard expectations only. It does not implement the `src/client/` runtime yet.

Future client customization should:

- live under `src/client/` once that boundary exists
- keep the platform data layer untouched
- use public API data instead of hardcoded event content
- keep the one-page runtime structure intact unless a later approved phase says otherwise
- use real public-safe client assets and approved visual design work

Client customization must not:

- bypass or replace the WebSerbisyo public API
- change `src/lib/public-event-api.ts`, `src/lib/normalize-public-event.ts`, `src/lib/platform-render-model.ts`, or `src/types/public-event.ts`
- add backend/database/auth/admin/billing/payment logic
- add Supabase or server actions
- revive `/r/[slug]/rsvp/embed`, iframe RSVP, or `postMessage` RSVP
- use `rsvpEmbedUrl`
- fake RSVP success or simulate working RSVP submission
- expose hidden custom frontend origins as public guest URLs
- weaken the offline/PWA safety rules

RSVP rule:

- Homepage RSVP may remain inline on `/`, become compact, or become CTA-only.
- Local `/rsvp` is the supported dedicated custom RSVP page.
- Keep `#rsvp` and `#rsvp-form`.
- Any future RSVP submission wiring is out of scope for starter customization and requires an official public WebSerbisyo API contract.
- Preserve `?access=` when linking from `/` to `/rsvp`.
- Forward `?access=` to the platform public GET and RSVP POST endpoints when Private Link mode is used.

PWA rule:

- Future clones may customize manifest names, theme colors, and local icon assets.
- Keep service workers navigation-only for offline fallback.
- Do not cache `/api/*`, RSVP `POST`s, RSVP responses, or private data.
- Do not queue or fake offline RSVP submissions.

Starter neutrality rule:

- Do not commit client-specific design defaults back into the reusable starter.
- Do not hardcode couple names, dates, venues, sponsors, gifts, QR codes, photos, or contact details into reusable baseline files.
