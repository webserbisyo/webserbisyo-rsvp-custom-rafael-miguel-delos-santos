# AI Quick Reference

Read first:

- `AGENTS.md`
- `docs/DO_NOT_BREAK.md`
- `docs/SECTION_MAP.md`
- `docs/CLIENT_GUIDE.md`

Hard rules:

- do not touch protected data/runtime files unless the task explicitly requires it
- do not add backend, database, Supabase, server actions, auth, admin, billing, or payment logic
- do not revive `/r/[slug]/rsvp/embed`, iframe RSVP, `postMessage`, or `rsvpEmbedUrl`
- do not fake RSVP success or simulated working submit behavior
- custom RSVP forms must call the same-origin platform API: `POST /api/public/events/[eventSlug]/rsvp`
- capacity and validation failures must display the platform API message
- rejected RSVP moderation stays dashboard/platform-owned
- do not hardcode custom section order when the platform already provides ordered enabled sections
- keep homepage RSVP anchors stable on `/` with `#rsvp` and `#rsvp-form`
- use local `/rsvp` for the dedicated custom RSVP page
- treat raw `.vercel.app` deployments as preview-only unless API origin behavior is intentionally configured

Current architecture:

- active runtime: `src/app/page.tsx` -> `src/components/platform/PublicEventPageContent.tsx` -> `src/components/platform/EventWebsiteRenderer.tsx`
- protected data/runtime files live in `src/lib/*`, `src/types/*`, and `src/components/platform/*`
- future client design work should target `src/client/` once a later phase creates it

Phase 2 boundary:

- `src/client/` now exists
- it is inert by default
- do not wire it into protected runtime files yet unless a later approved phase explicitly requires it

Phase 3 boundary:

- `src/client/` is now imported only at the page-shell level
- do not edit `src/components/platform/EventWebsiteRenderer.tsx` for client-specific design
- do not add section-slot overrides yet
- keep homepage RSVP anchors at `#rsvp` and `#rsvp-form`

Phase 4 boundary:

- optional client nav/footer support is config-driven inside `src/client`
- defaults remain disabled
- use local anchors only for navigation
- multi-page routes are still out of scope

Phase 5 boundary:

- a page-level client renderer switch now exists in `src/client/client.config.ts`
- it is disabled by default
- `EventWebsiteRenderer` remains protected
- do not add section slots yet

Phase 6 boundary:

- library usage should be organized under `src/client/libs/`
- use wrapper imports where practical
- shadcn, Framer Motion, and ReactBits-style libraries are clone-only unless already installed and approved
- follow `docs/RESPONSIVENESS.md` and `src/client/responsive.ts`
- test at `360px`, `361px`, `375px`, `768px`, and `1280px`

Safe prompt example:

> Add a future-ready client customization boundary under `src/client/` without changing public API fetching, section keys, inline RSVP behavior, or platform renderer ownership.

Safe future prompt example:

> Customize the client visual design inside `src/client/` only. Do not edit `src/lib` or `src/components/platform`. Keep homepage RSVP anchors stable and use local `/rsvp` for the dedicated page.

Safe clone prompt examples:

> In this cloned client repo, add a ReactBits-inspired hero inside `src/client/renderer` only. Do not edit `src/lib` or platform renderer. Keep RSVP inline.

> In this cloned client repo, use motion only inside `src/client` for scroll reveals. Do not add fake RSVP success.

> In this cloned client repo, add shadcn Button and Card components under `src/client/components/ui` only. Do not modify `EventWebsiteRenderer`.

> In this cloned client repo, keep dashboard section reorder intact by rendering from the ordered enabled `event.sections` list or the platform render-context section list.

> Make the client hero responsive at `375px`, `768px`, and `1280px`. Work inside `src/client` only.

> Add a motion reveal inside `src/client`, respect reduced motion, and do not change RSVP behavior.

> Use ReactBits-style components inside `src/client` only and verify no horizontal overflow.

Unsafe prompt patterns:

- "Point a custom clone to `/r/[slug]/rsvp` instead of using local `/rsvp`"
- "Submit RSVP locally"
- "Use Supabase directly"
- "Edit EventWebsiteRenderer for client-specific design"
- "Add iframe RSVP"
- "Add per-section client override slots right now"
- "Recreate `/r/[slug]/rsvp/embed` or iframe RSVP"
- "Rewrite EventWebsiteRenderer to support client mode"
- "Install shadcn and rewrite EventWebsiteRenderer"
- "Wire the RSVP form to submit anyway"
- "Add a temporary fake RSVP success modal"
- "Replace the public API with local hardcoded client data"
- "Move section rendering out of the protected platform files without preserving parity"
- "Hardcode a custom section order and ignore dashboard reorder"
- "Fix responsiveness by editing EventWebsiteRenderer"
- "Keep `/rsvp` but wire fake success or direct Supabase writes"
- "Hide platform capacity errors behind a generic success/failure banner"
- "Ignore mobile and only design desktop"

Dashboard Section Order Contract:

- Dashboard/Event Website section order is the source of truth.
- Custom renderers must render from the ordered enabled `event.sections` list or the platform render-context section list.
- Disabled sections must not render.
- Nav links should derive from enabled sections or only target valid rendered anchors.

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

Phase 1 reminder:

- if `src/client/` does not exist yet, do not invent broad runtime changes inside protected platform files just to make customization easier
- prefer docs, guard updates, and additive boundaries over renderer rewrites
