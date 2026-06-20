# Client Boundary Instructions

This folder is the planned AI-safe customization boundary for future cloned client repos.

Rules:

- Future client visual customization belongs here.
- This Phase 3 boundary is imported only at the page-shell level.
- Default visual output remains unchanged because wrapper features are disabled by default.
- Do not edit protected platform/data files for client styling.
- Do not bypass the WebSerbisyo public API.
- Do not add backend, database, Supabase, or server actions.
- Do not add auth, admin, billing, or payment logic.
- Do not add platform RSVP routes or route-based embed flows.
- Do not add embedded RSVP modes, cross-window messaging, or legacy RSVP URL helpers.
- Do not simulate working RSVP submission outcomes.
- Do not hardcode section order when the platform already provides ordered enabled sections.
- Keep homepage RSVP anchors stable at `#rsvp` and `#rsvp-form`.
- Use local `/rsvp` for the dedicated custom RSVP page.
- Treat raw `.vercel.app` deployments as preview-only unless API origin behavior is intentionally configured.

Safe direction:

- Put future client-specific config, assets, styles, components, and optional libraries under `src/client/`.
- Keep runtime hooks limited to wrapper-level concerns in this phase.
- Keep nav and footer config-driven and anchor-based.
- Keep dashboard/Event Website section order and enabled/disabled state platform-driven.
- Keep the client renderer switch disabled by default in the neutral starter.
- Keep per-section override wiring deferred until a later approved phase.
- Keep multi-page routing deferred.
- Prefer `src/client/libs/*` wrapper imports for client libraries where available.
- Treat shadcn, ReactBits-style libraries, and motion libraries as clone-only unless already installed and approved.

Dashboard Section Order Contract:

- Dashboard/Event Website section order is the source of truth.
- Custom client renderers must render from the ordered enabled `event.sections` list or the equivalent platform render-context section list.
- Disabled sections must not render.
- Nav links should derive from enabled sections or only target valid rendered anchors.
- Custom layout remains allowed under `src/client/`, including structure, cards, grids, spacing, animations, and section UI.

Safe renderer pattern:

```tsx
const orderedSections = event.sections.filter((section) => section.enabled);

return orderedSections.map((section) => {
  const renderSection = sectionRenderers[section.key];
  if (!renderSection) return null;
  return <Fragment key={section.key}>{renderSection(section)}</Fragment>;
});
```

Website QR and RSVP QR Contract:

- Website QR opens the full clean public website URL.
- RSVP QR opens the dedicated custom `/rsvp` URL when the clone supports it.
- Fallback website URL remains `/r/[slug]`.
- Fallback RSVP URL remains the official platform fallback RSVP page.
- The legacy embed RSVP path remains forbidden.
- iframe RSVP remains forbidden.
- pretend-success RSVP behavior remains forbidden.
- custom RSVP forms must call the same-origin platform API: `POST /api/public/events/[eventSlug]/rsvp`
- direct Supabase writes remain forbidden.
- capacity and validation failures must display the platform API message
- rejected RSVP moderation remains dashboard/platform-owned only
- gift QR/image rendering is public-data-only; do not add upload ownership here
- PWA support must remain static-only; do not cache `/api/*`, RSVP `POST`s, RSVP responses, or private data
- do not queue or fake offline RSVP submissions

Responsiveness contract:

- Start at `360px`.
- Re-test `361px` and `375px`.
- Then test `768px` and `1280px`.
- Use mobile-first CSS and utility patterns.
- Avoid fixed widths that break long names, long venues, or long addresses.
- Keep tap targets accessible on touch devices.
- Select controls must reserve right-side chevron spacing and avoid text collision.
- Respect reduced motion.
- Re-test after adding UI libraries under `src/client`.
- Keep homepage RSVP anchors at `#rsvp` and `#rsvp-form`.
- No iframe RSVP, platform RSVP routes, or pretend-success RSVP UI.
- Preserve `?access=` when the homepage links to the dedicated `/rsvp` page.
- Forward `?access=` to the platform public GET and RSVP POST requests.
