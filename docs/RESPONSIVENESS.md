# Responsiveness Contract

This starter stays neutral by default. Client-specific responsive polish belongs in cloned repos under `src/client/`.

## Target widths

- Mobile baseline: `360px`
- Mobile regression checks: `361px` and `375px`
- Tablet target: `768px`
- Desktop target: `1280px`
- Optional wide target: `1440px`

## Required checks for every client clone

- Test `/` at `360px`, `361px`, `375px`, `768px`, and `1280px`
- Verify `#rsvp` and `#rsvp-form`
- Verify enabled client nav if `layout.navEnabled` is `true`
- Verify enabled client footer if `layout.footerEnabled` is `true`
- Verify the client renderer if `renderer.mode = "client"` and `allowClientRenderer = true`
- Verify any UI library components added under `src/client/`

## Responsive rules

- Build mobile-first
- No horizontal overflow
- Keep tap targets comfortable on mobile
- Keep sticky or floating CTA UI from covering RSVP form controls
- Keep images and decorative assets responsive
- Wrap long Filipino names, long venue names, and long addresses safely
- Respect reduced motion
- Keep homepage RSVP anchors stable on `/`
- Verify `/rsvp` if the clone enables the dedicated page
- Keep form controls full-width and reserve select chevron spacing
- Do not simulate submit success
- Re-test offline fallback at mobile widths after changing icons, manifest, or offline copy

## Client library checks

After adding clone-only libraries such as shadcn, ReactBits-style components, motion, or decorative effects:

- test at `360px`
- test at `361px`
- test at `375px`
- test at `768px`
- test at `1280px`
- verify no horizontal overflow
- verify homepage RSVP anchors still work
- verify `/rsvp` still works if enabled
- verify motion respects reduced motion

## Known platform baseline checks

The protected baseline already includes several responsive safeguards and should not be redesigned in this repo just for clone-specific styling:

- `src/styles/components.css` already uses responsive grids and `@media (max-width: 640px)` adjustments
- platform text blocks already use `overflow-wrap` protections in several areas
- platform layouts already include `min-width: 0` protections to avoid grid and flex overflow
- the active renderer keeps homepage RSVP anchors at `#rsvp` and `#rsvp-form`

If a future task finds a true platform responsiveness bug, handle that as a separate platform-safe bugfix task. Do not edit protected platform files in clone customization work just to chase a client-specific look.

## Final checklist

- `360px` passed
- `361px` passed
- `375px` passed
- `768px` passed
- `1280px` passed
- no horizontal overflow
- RSVP anchors work
- client nav/footer work if enabled
- platform data still loads
- `npm run typecheck` passed
- `npm run lint` passed
- `npm run build` passed
- `npm run guard:neutral-starter` passed
- `npm run validate` passed
