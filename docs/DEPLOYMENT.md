# Deployment

Local setup:

```bash
cp .env.example .env.local
npm run dev
```

Vercel setup:

- Set `NEXT_PUBLIC_WEBSERBISYO_API_URL`.
- Set `NEXT_PUBLIC_EVENT_SLUG`.
- Set `NEXT_PUBLIC_DESIGN_MODE=false`.
- Set `NEXT_PUBLIC_TEMPLATE_ID`.

Deploy the app. Copy the hidden deploy origin URL, then paste it in Super Admin as `custom_frontend_origin_url` and enable the custom website.

Guests still use `https://{clientSubdomain}.rsvp.webserbisyo.com`. The main platform wildcard proxy will later serve the custom design through that public URL.

Do not expose the hidden `.vercel.app` origin in metadata, canonical URLs, UI, docs for guests, or public env values. `NEXT_PUBLIC_*` values are browser-public and must never contain secrets.

Snapshots in `.webserbisyo/` are local-only and ignored by git. They must not be deployed as a live data source.

Dashboard preview:

- The platform may open the hidden custom origin or show it inside embedded dashboard preview screens.
- Supported query params are `eventSlug`, `preview`, and `source`.
- Use `preview=dashboard` or `source=dashboard` when the platform needs a dashboard preview badge.
- Do not add query params for API base URL, auth, admin, billing, payment, or RSVP submission.
- Dashboard preview metadata is noindex and does not emit canonical URLs.
