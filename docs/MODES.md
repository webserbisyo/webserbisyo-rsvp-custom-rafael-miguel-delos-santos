# Modes

The starter has three render modes.

## Design mode

`NEXT_PUBLIC_DESIGN_MODE=true`

Design mode is for layout and visual work. It may render safe sample data from `src/data/sample-event.json`. If `.webserbisyo/event.snapshot.json` exists, design mode may render that local snapshot for layout testing.

Design mode must show a visible badge. Sample names, sample dates, demo photos, and demo QR media are allowed only in this mode.

## Live mode

`NEXT_PUBLIC_DESIGN_MODE=false`

Live mode fetches only:

```txt
GET {NEXT_PUBLIC_WEBSERBISYO_API_URL}/api/public/events/{NEXT_PUBLIC_EVENT_SLUG}
```

Live mode must never fall back to sample data or local snapshots. Missing API URL or event slug renders setup/unavailable UI.

## Snapshot mode

Snapshot data lives at `.webserbisyo/event.snapshot.json` and is local-only. It is useful for testing layouts against a real public payload without repeatedly fetching the API.

Snapshots must never be committed and must never be used when `NEXT_PUBLIC_DESIGN_MODE=false`.

## Public env rule

All `NEXT_PUBLIC_*` values are browser-public and may be inlined at build time. Never put secrets, hidden custom origins, service role keys, database URLs, payment secrets, admin tokens, or private data in any `NEXT_PUBLIC_*` variable.
