# Agent Instructions

This repo is the neutral reusable WebSerbisyo RSVP custom starter.

Read before editing:

- `AGENTS.md`
- `docs/DO_NOT_BREAK.md`
- `docs/CLIENT_GUIDE.md`
- `docs/SECTION_MAP.md`
- `docs/AI_QUICKREF.md`

Protected runtime/data layer:

- `src/app/page.tsx`
- `src/components/platform/*`
- `src/lib/env.ts`
- `src/lib/public-event-api.ts`
- `src/lib/normalize-public-event.ts`
- `src/lib/platform-render-model.ts`
- `src/lib/rsvp-url.ts`
- `src/types/public-event.ts`

Rules:

- Keep this repo frontend-only.
- Do not bypass the WebSerbisyo public API.
- Do not add Supabase, server actions, database logic, auth, admin, billing, or payment logic.
- Do not revive `/r/[slug]/rsvp`, `/r/[slug]/rsvp/embed`, iframe RSVP, `postMessage`, or `rsvpEmbedUrl`.
- Keep homepage RSVP anchors stable on `/` with `#rsvp` and `#rsvp-form`.
- Use local `/rsvp` for the dedicated custom RSVP page.
- Same-origin `/api` belongs to the platform wildcard/custom-domain flow. Treat raw `.vercel.app` deployments as preview-only unless API origin behavior is intentionally configured.
- Preserve `?access=` private-link queries and forward them to the platform public GET and RSVP POST APIs.
- Avoid React hydration errors (#418): Never use non-deterministic values (random, current time, Intl.DateTimeFormat) or browser-only globals (window, localStorage) during initial render. Use `useEffect` or `suppressHydrationWarning` for values that must differ between server and client.
- Fast routing: Preserve SPA-like navigation between `/` and `/rsvp`. If query params (like `?access=`) are used in client components to build links, update them in `useEffect` after mount to avoid server/client mismatch.
- Do not fake RSVP success or simulate working submission behavior.
- Keep PWA behavior narrow: cache only the static offline shell and local icon assets.
- Do not cache `/api/*`, RSVP `POST`s, or RSVP responses.
- Do not queue or fake offline RSVP submissions.
- Do not put client-specific design, copy, or editorial layout into protected starter platform files.
- Do not hardcode couple names, dates, venues, sponsors, gifts, or contact details in reusable starter runtime files.

Customization guidance:

- This Phase 1 repo change adds docs and guard foundations only.
- `src/client/` is the planned future client-editable boundary. Do not assume it is implemented yet.
- Future client customization should target `src/client/` once that boundary exists.
- Until then, do not treat protected platform/data files as general customization targets.

Starter expectations:

- Keep the starter neutral and reusable.
- Preserve the current runtime flow: `src/app/page.tsx` -> `src/components/platform/PublicEventPageContent.tsx` -> `src/components/platform/EventWebsiteRenderer.tsx`.
- Preserve one-page inline RSVP behavior and local anchor scrolling.
- Preserve platform section order, safe unknown-key skipping, and public-data ownership.
- Capacity failures must surface the platform API message.
- Rejected RSVP moderation remains dashboard/platform-owned only.
- Gift QR/image rendering is public-data-only in this starter. Do not add upload ownership here.
- Private Link is a capability URL, not full auth. Keep the token only in the URL/query flow and never invent offline/private access behavior.
