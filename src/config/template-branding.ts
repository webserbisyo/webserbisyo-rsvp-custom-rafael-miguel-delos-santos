/**
 * Shared Template Branding Configuration
 *
 * Single source of truth for template design choices and hero image artwork.
 * Replacing `hero.imagePath` here updates both:
 *  1. The live website Hero section (`HeroSection.tsx`)
 *  2. The dynamic social preview cards (`opengraph-image.tsx` & `twitter-image.tsx`)
 *
 * Note: Website and social preview crop positions are intentionally separate to allow
 * optimal framing for responsive browser viewports vs fixed 1200x630 social sharing cards.
 */
export const templateBranding = {
  hero: {
    imagePath: "/wedding-assets/dianne/dianne-hero-background.webp",
    websitePosition: "center 40%",
    socialPosition: "center 30%",
  },
  social: {
    siteName: "WebSerbisyo RSVP",
    brandLabel: "WebSerbisyo RSVP",
  },
} as const;

export type TemplateBranding = typeof templateBranding;
