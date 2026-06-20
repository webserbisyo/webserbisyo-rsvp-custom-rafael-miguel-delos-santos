# Library Protocol

The neutral starter stays minimal. Client presentation libraries belong only in cloned client repos unless a library is already approved and installed here.

Starter policy:

- keep the starter neutral and reusable
- keep platform/data files free from client-library imports
- document library usage under `src/client/libs/`
- avoid installing optional client UI libraries in the neutral starter

Client clone policy:

- add UI libraries only under `src/client` patterns
- import through wrapper hubs when practical
- document active libraries in `src/client/client.config.ts`

Allowed presentation categories:

- UI components
- icons
- animation and motion
- decorative effects
- frontend-only carousels and galleries

Prohibited categories:

- backend, database, auth, billing, or payment ownership
- service-role usage
- iframe RSVP
- fake RSVP submit or fake success

Recommended import paths:

- icons: `@/client/libs/icons`
- shadcn: `@/client/libs/shadcn/*` or `@/client/components/ui/*` in a clone
- motion: `@/client/libs/motion/*`
- ReactBits-style components: `@/client/libs/reactbits/*`

Validation after adding a library in a clone:

- confirm the page still renders
- confirm homepage RSVP anchors stay at `#rsvp` and `#rsvp-form`
- confirm local `/rsvp` still renders if the clone supports it
- confirm no backend logic was added
- confirm responsive behavior at `375px`, `768px`, and `1280px`
- confirm no horizontal overflow
- confirm inline RSVP still works after the library is added
- run `npm run typecheck`
- run `npm run lint`
- run `npm run build`
- run `npm run guard:neutral-starter`
- run `npm run validate`
- run `git diff --check`
