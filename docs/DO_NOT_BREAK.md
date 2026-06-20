# Do Not Break

Phase 1 scope:

- This phase creates docs and guard foundations only.
- Do not change runtime rendering behavior in Phase 1.
- Do not change data fetching, normalization, section keys, or RSVP behavior in Phase 1.

Protected files:

- `src/lib/public-event-api.ts`
- `src/lib/normalize-public-event.ts`
- `src/lib/platform-render-model.ts`
- `src/lib/env.ts`
- `src/types/public-event.ts`
- `src/components/platform/EventWebsiteRenderer.tsx`
- `src/components/platform/PublicEventPageContent.tsx`
- `src/lib/rsvp-url.ts`
- `src/config/wedding-section-registry.ts`
- `src/app/page.tsx`

Protected runtime contract:

- The active runtime path is `src/app/page.tsx` -> `src/components/platform/PublicEventPageContent.tsx` -> `src/components/platform/EventWebsiteRenderer.tsx`.
- Dashboard/Event Website section order is the source of truth.
- Required section order and enabled/disabled state must continue to come from the ordered `event.sections` list or the platform render-context section list.
- Homepage RSVP may stay inline, become compact, or become CTA-only on `/`.
- Required RSVP anchors remain `#rsvp` and `#rsvp-form`.
- Local `/rsvp` is the supported dedicated custom RSVP page.
- No `/r/[slug]/rsvp` route.
- No `/r/[slug]/rsvp/embed` route.
- No iframe or `postMessage` RSVP behavior.
- No `rsvpEmbedUrl`.
- No fake RSVP success or simulated working submission.
- Direct RSVP submission must call the official platform API contract.

Protected architecture rules:

- Do not bypass the WebSerbisyo public API.
- Do not add backend/database logic.
- Do not add Supabase packages or service-role usage.
- Do not add server actions, auth, admin, billing, or payment logic.
- Do not expose hidden custom frontend origins in UI, metadata, or public env.
- Do not rename platform section keys without updating registry, docs, and types together.
- Do not hardcode section order in a custom renderer unless a later task explicitly approves a client-specific exception.
- Do not let disabled sections render.
- Do not let nav links point to anchors for sections that are not actually rendered.

Planned customization boundary:

- `src/client/` is the client-editable boundary introduced in Phase 2.
- It is inert by default in this phase.
- Do not import `src/client/client-registry.ts` into the platform renderer yet.
- Do not wire section slots or section overrides yet.
- Do not use `src/client/` as a reason to weaken security, API ownership, or RSVP protections.
- Treat protected platform/data files as non-customization targets unless a later approved runtime-hook phase explicitly changes that.

Phase 3 rule:

- `src/client/` may be imported only at the page-shell level in this phase.
- Do not modify `src/components/platform/PublicEventPageContent.tsx` or `src/components/platform/EventWebsiteRenderer.tsx` to support client overrides.
- Do not make sections overrideable yet.

Phase 4 rule:

- client nav/footer support must remain optional and config-driven
- defaults must stay disabled in the neutral starter
- do not add route groups or multi-page routes yet
- keep RSVP links on local anchors only

Phase 5 rule:

- the client renderer switch must remain disabled by default in the neutral starter
- do not modify `src/components/platform/PublicEventPageContent.tsx` or `src/components/platform/EventWebsiteRenderer.tsx` to support client mode
- do not wire section-level slot overrides yet

Phase 6 rule:

- optional client libraries must stay under `src/client` patterns
- do not install clone-only libraries into the neutral starter unless explicitly approved
- do not import client library wrappers into protected platform/data files

Phase 7 rule:

- do not "fix" responsiveness by weakening RSVP rules
- do not edit protected platform/data files for client-specific responsive design unless a separate approved platform bugfix task requires it
- do not make the neutral starter client-specific while improving responsive behavior
- keep responsive clone work inside `src/client` and related clone docs

Starter neutrality:

- The starter must remain a neutral reusable base.
- Client-specific visual identity, venue language, couple names, or one-off editorial design must not become starter defaults.
- Client work belongs in future client-boundary files, not in protected platform/data files.

Realtime Contract:

- Custom frontends must submit RSVPs only through: `POST /api/public/events/[eventSlug]/rsvp`
- Custom repos must not write directly to Supabase.
- Custom repos must not add service-role keys.
- Custom repos must not fake RSVP success.
- Custom repos must not bypass the platform API.
- Dashboard realtime notifications and RSVP Responses table refresh depend on the platform API inserting into `rsvp_responses`.
- Future clones may customize UI, layout, animations, and styling, but must preserve the submit adapter/data boundary.
- `eventSlug` must remain the stable platform data key.
- Same-origin `/api` is required in the wildcard production flow because `/api` stays platform-owned.
- Raw hidden `.vercel.app` origins are preview-only unless API origin behavior is intentionally configured for that environment.
- Local direct starter dev may not own `/api`; that is expected unless local rewrite/proxy support is intentionally added later.
- Capacity and validation failures must display the platform API message.
- Rejected RSVP moderation remains dashboard/platform-owned only.
- Gift QR/image rendering is public-data-only in this starter. Do not add upload/storage ownership here.
- PWA caching must stay static-only: offline shell, local logo, local icons, and manifest.
- Never cache `/api/*`, authenticated data, RSVP `POST`s, or RSVP submission responses.
- Never queue or fake offline RSVP success.
- Never drop `?access=` during local route changes, canonical handling, or custom nav components.
- Never remove request-scoped public event loader dedupe between metadata and page rendering.
- Never let clone-only effects force large eager imports into the root layout or both public routes by default.
- Never point manifest icons to relative paths that depend on the current route depth.

Dashboard Section Order Contract:

- Dashboard/Event Website section order is the source of truth for clones.
- Custom client renderers must render from the ordered enabled `event.sections` list or the equivalent platform render-context section list.
- Custom layout is allowed, but section order and enabled/disabled status must remain platform-driven.
- Custom clones may change structure, cards, grids, spacing, animations, and section UI under `src/client/`.

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
- Fallback RSVP URL remains the official platform `/r/[slug]/rsvp`.
- Old `/r/[slug]/rsvp/embed` remains forbidden.
- iframe RSVP remains forbidden.
- custom RSVP forms must call the same-origin platform API: `POST /api/public/events/[eventSlug]/rsvp`
- fake RSVP success remains forbidden.
- direct Supabase writes remain forbidden.
- no iframe/embed RSVP is allowed
- if Private Link mode is active, preserve and forward `?access=` on homepage and `/rsvp`
- do not strip `?access=` during local `/` -> `/rsvp` navigation
- invalid or regenerated-old private links must not leak event data
