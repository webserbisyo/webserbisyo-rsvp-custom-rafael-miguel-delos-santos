# Performance

Keep assets, images, fonts, and bundles light. Proxy overhead is not the main issue; heavy client assets are.

Avoid large animation packages and unnecessary UI libraries in the starter. Client repos may add libraries such as shadcn, ReactBits, Motion, GSAP, or Framer Motion after baseline acceptance and with performance review.

Fast-route baseline for future clones:

- Keep `/` and `/rsvp` render paths lightweight. Do not import clone-only decorative systems globally when they are only used on one section or one route.
- Preserve request-scoped `loadPublicEvent()` dedupe so `generateMetadata()` and the page body do not issue duplicate public API reads for the same request.
- Preserve `?access=` through all local route transitions, especially `/` -> `/rsvp`.
- Do not replace same-origin API reads with direct third-party fetches or cross-origin browser calls.
- Keep public event reads conservative and launch-safe. Do not introduce browser HTTP caching for token-bearing event URLs.
- Lazy-load heavy effects such as music visualizers, confetti, particle systems, video backgrounds, carousels, and large motion libraries.
- Avoid heavy global animation wrappers in `src/app/layout.tsx` or shared shell components.
- Treat raw hidden `.vercel.app` deployments as preview-only unless guest-facing API origin behavior is intentionally configured.

Live fetches currently use conservative `cache: "no-store"` for launch safety. Revisit caching only when platform publish/unpublish behavior and proxy behavior are confirmed.

Media should stay public, optimized, and provider-aware. If `next/image` is introduced, use explicit approved `remotePatterns`; do not add broad wildcard image hosts.

PWA and asset contract:

- `favicon.ico`, `icon.png`, `apple-icon.png`, and `public/icons/*` must remain present.
- `manifest.webmanifest` icon paths must stay root-relative.
- `/` and `/rsvp` must inherit metadata icons and manifest links from the root layout.
- Private Link URLs with `?access=` must still load icons and manifest correctly. Private content access rules do not apply to static icon assets.
