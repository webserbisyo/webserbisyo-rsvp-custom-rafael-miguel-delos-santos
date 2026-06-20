# Security

Forbidden env names:

- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `RESEND_API_KEY`
- `PAYMENT_PROVIDER_SECRET`
- `ADMIN_SECRET`

Do not add auth, billing, payment, admin, database, service role, or private RSVP logic. Do not expose private platform data or hidden custom origins to guests.

All `NEXT_PUBLIC_*` variables are public. Treat them as values guests can inspect in browser JavaScript. Never place secrets or hidden custom frontend origins there.

Live mode must fetch only the public API. Do not read `.webserbisyo/event.snapshot.json` or sample data in live mode.
