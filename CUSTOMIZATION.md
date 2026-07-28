# Custom RSVP Template — Client Customization & Hero Setup

This document outlines the workflow for creating a new client branch from this template and configuring hero artwork, website framing, and social share previews.

---

## 1. Single Source of Truth for Hero Artwork

The hero background artwork and social preview cards share a single configuration point:

📁 `src/config/template-branding.ts`

```typescript
export const templateBranding = {
  hero: {
    imagePath: "/wedding-assets/The-ceremony-arch.webp", // Single hero image source
    websitePosition: "center 40%",                       // Framing for responsive website viewports
    socialPosition: "center 30%",                        // Framing for 1200x630 social share cards
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
2. **Add Hero Asset**: Place the new hero image under `public/wedding-assets/` (or `public/images/`).
3. **Update Config**: Update `templateBranding.hero.imagePath` in `src/config/template-branding.ts`.
4. **Adjust Crops**:
   - `websitePosition`: Adjust for responsive browser viewing (consumed by `HeroSection.tsx`).
   - `socialPosition`: Adjust for fixed 1200 × 630 landscape social cards (consumed by `opengraph-image.tsx` & `twitter-image.tsx`).
5. **Set Environment**: Set `PUBLIC_EVENT_URL` and `NEXT_PUBLIC_EVENT_SLUG` in environment configuration if applicable.
6. **Deploy**: Build and deploy to Vercel.

---

## 3. How Dynamic Social Previews Work

- **No Manual Screenshots or PNG Generation**: Social preview cards (`og:image` and `twitter:image`) are generated on demand via Next.js file-based image endpoints (`src/app/opengraph-image.tsx` and `src/app/twitter-image.tsx`).
- **Dynamic Event Data**: Couple names, event date, and metadata descriptions are pulled automatically from the public event API / loader.
- **Unified Hero Image**: Replacing `imagePath` in `templateBranding.ts` automatically updates both the live website Hero background and the social preview card after deployment.

---

## 4. Purging Social Platform Cache

Social platforms (Facebook, Messenger, LinkedIn) aggressively cache Open Graph previews:

1. Open [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/).
2. Enter your live custom domain URL (e.g. `https://rafael-and-isabella.rsvp.webserbisyo.com`).
3. Click **Debug**, then click **Scrape Again**.
4. Confirm the updated 1200 × 630 preview card renders correctly.
