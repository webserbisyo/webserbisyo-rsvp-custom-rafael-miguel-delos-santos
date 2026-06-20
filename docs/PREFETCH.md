# Prefetch

Run:

```bash
npm run prefetch:event -- your-platform-event-slug
```

or:

```bash
npm run prefetch:event your-platform-event-slug
```

The script reads `NEXT_PUBLIC_WEBSERBISYO_API_URL` or defaults to `https://webserbisyo.com`, fetches `/api/public/events/[slug]`, and writes `.webserbisyo/event.snapshot.json`.

Snapshots are local-only, ignored by git, and used only when `NEXT_PUBLIC_DESIGN_MODE=true`. Live mode never reads snapshots.
