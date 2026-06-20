# Client Boundary

`src/client/` is the client customization boundary introduced in Phase 2 and minimally wired in Phase 3.

Use this folder in future client clones for:

- client-specific config
- client-specific visual styles
- client-specific assets
- optional additive components
- optional library integration notes
- wrapper-level UI hooks that do not replace protected platform rendering
- organized library wrappers under `src/client/libs/`

Protected files remain outside this folder:

- `src/lib/*`
- `src/types/*`
- `src/components/platform/*`
- `src/app/page.tsx`

Rules:

- local `/rsvp` is the supported dedicated custom RSVP page
- no legacy route-specific RSVP path
- no iframe RSVP
- no backend, Supabase, or server actions
- no fake submit or fake success
- custom RSVP forms must call the same-origin platform API: `POST /api/public/events/[eventSlug]/rsvp`
- keep homepage RSVP anchors stable with `#rsvp` and `#rsvp-form`
- do not edit `src/components/platform/EventWebsiteRenderer.tsx` for client-specific design
- do not add section-slot overrides here yet
- keep nav links on local anchors only
- do not add multi-page route groups here yet
- do not edit `src/components/platform/PublicEventPageContent.tsx` or `src/components/platform/EventWebsiteRenderer.tsx` to switch renderers
- prefer `src/client/libs/*` wrapper imports when a library hub exists
- shadcn, ReactBits-style libraries, and motion libraries are clone-only unless already installed and approved

Dashboard Section Order Contract:

- Dashboard/Event Website section order is the source of truth.
- Custom client renderers must render from the ordered enabled `event.sections` list or the equivalent platform render-context section list.
- Do not hardcode section order unless explicitly approved for a client-specific exception.
- Disabled sections must not render.
- Nav links should derive from enabled sections or only point to valid rendered anchors.
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

Phase 5 note:

- this boundary is now imported at the page-shell level only
- nav and footer are now config-driven
- default visual output remains unchanged because nav and footer are still disabled
- the page-level client renderer switch now exists, but it is disabled by default
- runtime hooks remain limited to the page wrapper in this phase
- section override mechanisms are deferred to a later phase
- multi-page routing is still deferred
- the library protocol now lives in `src/client/libs/README.md` and `docs/LIBRARY_PROTOCOL.md`

Responsiveness workflow:

- use `docs/RESPONSIVENESS.md` as the clone responsiveness contract
- use `src/client/responsive.ts` for shared breakpoint and checklist guidance
- test at `375px`, `768px`, and `1280px`
- retest after enabling client nav, client footer, or the client renderer
- retest after adding Lucide, shadcn, ReactBits-style components, or motion libraries in a clone
- keep homepage RSVP visible and usable at `#rsvp` and `#rsvp-form`
- do not introduce horizontal overflow while styling client-specific sections

Website QR and RSVP QR Contract:

- Website QR opens the full clean public website URL.
- RSVP QR opens the dedicated custom `/rsvp` URL when the clone supports it.
- Fallback website URL remains `/r/[slug]`.
- Fallback RSVP URL remains the official platform fallback RSVP page.
- The legacy embed RSVP path remains forbidden.
- iframe RSVP remains forbidden.
- pretend-success RSVP behavior remains forbidden.
- direct Supabase writes remain forbidden.
