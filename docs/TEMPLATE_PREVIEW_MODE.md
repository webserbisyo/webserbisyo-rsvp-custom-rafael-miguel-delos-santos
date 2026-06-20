# Template Preview Mode

Template preview is design mode with sample data. It is for evaluating reusable layouts before connecting a real event slug.

Use:

```env
NEXT_PUBLIC_DESIGN_MODE=true
NEXT_PUBLIC_EVENT_SLUG=your-platform-event-slug
```

The slug may be omitted locally when previewing only sample data. Live deployments should explicitly set `NEXT_PUBLIC_DESIGN_MODE=false` and a real platform event slug.

Do not publish preview URLs as guest-facing event URLs. Guests should use the public WebSerbisyo RSVP subdomain or the platform-proxied custom domain.
