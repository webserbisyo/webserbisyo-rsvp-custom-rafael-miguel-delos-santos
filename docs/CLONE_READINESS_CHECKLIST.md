# Clone Readiness Checklist

1. Clone from this starter.
2. Set public env vars.
3. Keep the main platform public API as the data source.
4. Verify `/` renders.
5. Verify `#rsvp` and `#rsvp-form` exist.
6. Enable the client renderer only in a clone when ready.
7. Add UI libraries only under `src/client` patterns.
8. Verify dashboard/Event Website section reorder still works in the clone.
9. Run validation.
10. Deploy to a hidden Vercel origin.
11. Paste the hidden origin into the platform custom frontend origin field later.

Final readiness checks:

- docs and rules are complete
- `src/client` boundary is complete
- client renderer scaffold is complete
- client nav/footer scaffold is complete
- library protocol is complete
- responsiveness contract is complete
- client clones can add UI libraries under `src/client`
- client clones must test `360px`, `361px`, `375px`, `768px`, and `1280px`
- starter default output remains unchanged
- dashboard section reorder remains intact
- disabled sections stay hidden
- nav anchors only target rendered sections
- Website QR and RSVP QR rules are understood
- local `/rsvp` route is present
- no fake submit
- no platform data ownership changes
- raw `.vercel.app` is treated as preview-only unless API origin behavior is intentionally configured

Never do these in the starter or clone baseline:

- add `/r/[slug]/rsvp`
- add iframe RSVP
- add backend or Supabase logic
- add fake RSVP success

Dashboard Section Order Contract:

- Dashboard/Event Website section order is the source of truth.
- Custom client renderers must render from the ordered enabled `event.sections` list or the platform render-context section list.
- Do not hardcode section order unless explicitly approved for a client-specific exception.
- Disabled sections must not render.
- Nav links should derive from enabled sections or only point to valid anchors.
- Custom layout is allowed under `src/client/`, but order and enabled/disabled state must remain platform-driven.

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
- iframe RSVP remains forbidden.
- fake RSVP success remains forbidden.
- direct Supabase writes remain forbidden.
