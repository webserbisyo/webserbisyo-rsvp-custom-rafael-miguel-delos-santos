# Public API

The starter fetches:

```txt
GET {NEXT_PUBLIC_WEBSERBISYO_API_URL}/api/public/events/{NEXT_PUBLIC_EVENT_SLUG}
```

Do not assume `/website`. Do not call admin APIs. Do not call Supabase directly.

The API URL builder is centralized in `src/lib/urls.ts`; response handling is centralized in `src/lib/public-event-api.ts`.

The fetcher supports only the public success envelope:

```ts
{ data: PublicEventDto }
```

Malformed responses render a controlled unavailable state. Raw errors are not thrown into the UI.

Supported improved fields include `data.content.layout.sectionOrder`, `data.content.layout.enabledSections`, `data.content.sections`, `data.guestbookMessages`, `data.urls.publicWebsiteUrl`, and `data.formatted`.

Current supported public fields include:

- `data.urls.fallbackUrl`
- `data.urls.publicWebsiteUrl`
- `data.formatted.*`
- `data.sectionsByKey`
- `data.content.layout.sectionOrder`
- `data.content.layout.enabledSections`
- `data.content.sections`
- `data.publicGuestbookMessages`

Preview query params may choose a safe event slug, but they must never choose the API base URL. `NEXT_PUBLIC_WEBSERBISYO_API_URL` remains the only API origin.

RSVP remains platform-owned. The starter keeps the RSVP section inline within the one-page event flow by default and may also expose a dedicated local `/rsvp` page. Submission must stay on the official same-origin platform contract: `POST /api/public/events/[eventSlug]/rsvp`.

Private Link support uses the platform capability URL query: `?access=LONG_TOKEN`.

- Public event reads must forward `?access=` to `GET /api/public/events/[eventSlug]`.
- RSVP submits must forward `?access=` to `POST /api/public/events/[eventSlug]/rsvp`.
- Do not rename the query key.
- Do not hide or reimplement private-link verification inside the clone.

Capacity and validation failures must surface the platform API message. Rejected RSVP moderation remains dashboard/platform-owned only.

Same-origin `/api` works through the proper wildcard/custom-domain production path. Raw hidden `.vercel.app` deployments are preview-only unless API origin behavior is intentionally configured.

PWA/offline support in this starter is static-only. Do not cache `/api/*`, RSVP `POST`s, RSVP responses, or private data. Offline mode must not queue or fake RSVP submissions.
