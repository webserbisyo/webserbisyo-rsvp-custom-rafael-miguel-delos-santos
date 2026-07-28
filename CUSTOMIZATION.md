# Custom RSVP Template — Client Customization & Hero Setup

This document outlines the workflow for creating a new client branch from this template and configuring hero artwork, website framing, and social share previews.

---

## 1. Single Source of Truth for Hero Artwork

The hero background artwork and social preview metadata share a single configuration point:

📁 `src/config/template-branding.ts`

```typescript
export const templateBranding = {
  hero: {
    imagePath: "/wedding-assets/The-ceremony-arch.webp", // Single hero image source
    websitePosition: "center 40%",                       // Framing for responsive website viewports
    socialPosition: "center 30%",                        // Framing for social sharing cards
  },
  social: {
    siteName: "WebSerbisyo RSVP",
    brandLabel: "WebSerbisyo RSVP",
  },
} as const;
```

---

## 2. New Client Branch Workflow

When creating a new client branch (e.g. `client-john-and-mary`):

1. **Create Branch**: Duplicate or create a new branch from `main`.
2. **Add Hero Asset**: Place the new client's hero image under `public/wedding-assets/` (or `public/images/`).
3. **Update Config**: Update `templateBranding.hero.imagePath` in `src/config/template-branding.ts`.
4. **Adjust Website Crop**: Adjust `templateBranding.hero.websitePosition` for responsive browser viewing (consumed by `HeroSection.tsx`).
5. **Set Environment**: Set `PUBLIC_EVENT_URL` and `NEXT_PUBLIC_EVENT_SLUG` in environment configuration if applicable.
6. **Deploy**: Build and deploy to Vercel.

---

## 3. How White-Label Social Previews Work

- **Shared Hero Image**: Replacing `imagePath` in `templateBranding.ts` automatically updates both:
  1. The live website Hero section (`HeroSection.tsx`)
  2. Facebook/Messenger `og:image` and Twitter `twitter:image` tags in rendered HTML
- **Extension-Based Asset Delivery**: Social preview metadata points directly to the configured client image asset (e.g., `/wedding-assets/The-ceremony-arch.webp`). This bypasses extensionless proxy route collisions on custom domains.
- **Dynamic Event Data**: Couple names, event date, page titles, and metadata descriptions are pulled automatically from the public event API / loader.
- **No Manual Screenshots**: No separate `og-preview.png` or Playwright image generation scripts are required.

---

## 4. Purging Social Platform Cache

Social platforms (Facebook, Messenger, LinkedIn) aggressively cache Open Graph previews:

1. Open [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/).
2. Enter your live custom domain URL (e.g. `https://rafael-and-isabella.rsvp.webserbisyo.com`).
3. Click **Debug**, then click **Scrape Again**.
4. Confirm the updated social card displays the client's Hero image and couple details.
