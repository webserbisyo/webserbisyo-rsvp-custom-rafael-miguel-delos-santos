# Customization Layer

The starter architecture has three layers:

- Layer 0: platform core outside this repo
- Layer 1: protected starter baseline inside this repo
- Layer 2: client layer under `src/client/`

Layer 0: platform core outside this repo

- public API ownership
- RSVP backend ownership
- section key contract
- moderation, publishing, and hidden custom origin ownership

Layer 1: protected starter baseline

- active runtime flow: `src/app/page.tsx` -> `src/components/platform/PublicEventPageContent.tsx` -> `src/components/platform/EventWebsiteRenderer.tsx`
- public API fetcher
- normalized public event data
- platform render-model adapter
- inline RSVP anchors and one-page flow
- metadata safety
- neutral starter CSS baseline

Layer 2: client layer

- future path: `src/client/`
- intended use: client-specific theme overrides, assets, safe wrapper-level customization, and optional additive UI enhancements
- present in Phase 2 as an inert boundary
- imported in Phase 3 only at the page-shell level

Important Phase 2 note:

- `src/client/` now exists.
- It is currently wired only through a minimal page-shell wrapper.
- Default output remains unchanged because the wrapper config is disabled by default.
- Protected platform files remain the source of truth until a later runtime-hook phase is approved.

Current Phase 3 limit:

- no section slots
- no per-section override registry wiring
- no edits to `src/components/platform/EventWebsiteRenderer.tsx`
- no changes to RSVP behavior

Current Phase 4 limit:

- optional nav/footer support is allowed only through `src/client` config and wrapper components
- defaults remain disabled
- no multi-page routes
- no route groups
- no section-slot registry wiring

Current Phase 5 limit:

- a page-level client renderer switch is allowed only through `src/client`
- the switch is disabled by default in the neutral starter
- `EventWebsiteRenderer` stays protected
- no section-slot registry wiring
- no multi-page routes

Current Phase 6 addition:

- library protocol and wrapper paths now exist under `src/client/libs/`
- clone-only library usage is documented without changing starter dependencies

Current Phase 7 addition:

- the responsiveness contract now lives in `docs/RESPONSIVENESS.md`
- shared breakpoint guidance now lives in `src/client/responsive.ts`
- the customization layer is structurally ready for clones
- actual client designs still belong in cloned repos, not in the neutral starter

Rules for future client customization:

- do not change API ownership
- do not change protected data normalization
- do not change section keys
- do not change inline RSVP ownership or anchors
- do not revive removed RSVP routes or embed patterns
- do not fake working submission behavior

Dashboard Section Order Contract:

- Dashboard/Event Website section order is the source of truth.
- Custom client renderers must render from the ordered enabled `event.sections` list or the equivalent platform render-context section list.
- Do not hardcode section order unless a client-specific exception is explicitly approved.
- Disabled sections must not render.
- Nav links should derive from enabled sections or only point to valid rendered anchors.
- Custom layout remains allowed inside `src/client/`, including structure, cards, grids, spacing, animations, and section UI.

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
- fake RSVP success remains forbidden.
- direct Supabase writes remain forbidden.
