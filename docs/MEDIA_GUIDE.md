# Media Guide

Use public-safe images only. Do not reference private buckets, signed admin URLs, dashboard-only URLs, or hidden custom frontend origins.

The starter currently uses a local `SmartImage` wrapper over standard `<img>` to avoid broad image host configuration. If `next/image` is introduced later, `next.config.ts` must use explicit `remotePatterns` for approved providers only. Do not allow broad wildcard domains unless the platform has a documented CDN host contract.

Gift QR rules:

- Design mode may show demo QR placeholders.
- Snapshot mode may render QR URLs present in the snapshot.
- Live mode may render only real QR/media URLs from the public API or public client repo assets.
- Live mode must not invent QR codes.
- Missing live gift media should use the neutral platform dashed/icon placeholder or render text-only gift information. It must not imply that a QR/photo exists.

Accessibility:

- Every rendered image needs meaningful alt text.
- Decorative images should have empty alt text only when they convey no content.
- QR images should identify the gift option they belong to.
