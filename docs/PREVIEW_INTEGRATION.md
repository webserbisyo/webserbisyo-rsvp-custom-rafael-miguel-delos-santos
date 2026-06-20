# Preview Integration

The main WebSerbisyo RSVP platform may open this custom frontend or display it in an embedded dashboard preview after Super Admin saves `custom_frontend_origin_url` and enables the custom website.

This repo remains frontend-only. It still fetches event data only from:

```txt
{NEXT_PUBLIC_WEBSERBISYO_API_URL}/api/public/events/{eventSlug}
```

The default preview output should use the same platform-compatible public renderer baseline as the main account preview. Dashboard preview chrome or badges must remain isolated from normal guest runtime.

## Safe Query Params

Supported preview query params:

- `eventSlug`
- `preview`
- `source`

`eventSlug` may override `NEXT_PUBLIC_EVENT_SLUG` only in safe preview contexts:

- `preview=dashboard`
- `source=dashboard`
- local development
- explicit design mode

The API base URL is never read from the query string. It must come from `NEXT_PUBLIC_WEBSERBISYO_API_URL`.

## Dashboard Badge

`preview=dashboard` or `source=dashboard` may show isolated dashboard context when intentionally implemented. Guest/live production mode should not show debug badges unless design mode or snapshot mode is active.

## Public URL Rules

The custom frontend origin is a hidden infrastructure URL, not the public guest URL.

Guests should continue to use the main platform public wildcard URL:

```txt
https://{clientSubdomain}.rsvp.webserbisyo.com
```

The public canonical URL should prefer `data.urls.publicWebsiteUrl`. Dashboard preview mode omits canonical metadata and marks the page noindex so embedded/open preview cannot poison SEO.

Never expose the hidden custom frontend origin in UI, public metadata, guest docs, or `NEXT_PUBLIC_*` values.
The RSVP section stays inline in the page flow. Preview integration must not revive removed platform RSVP routes or removed RSVP embed modes.
