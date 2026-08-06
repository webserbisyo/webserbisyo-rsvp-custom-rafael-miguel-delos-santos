import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-360", width: 360, height: 800 },
] as const;

const scenarios = [
  { disabled: [], name: "all-sections", slug: "all-sections" },
  { disabled: ["music_effects"], name: "music-disabled", slug: "music-disabled" },
  { disabled: ["countdown"], name: "countdown-disabled", slug: "countdown-disabled" },
  { disabled: ["secondary_event"], name: "reception-disabled", slug: "reception-disabled" },
  { disabled: ["story_message"], name: "story-disabled", slug: "story-disabled" },
] as const;

const sectionKeyById = {
  attire: "attire_motif",
  ceremony: "main_event",
  contact: "contact_socials",
  countdown: "countdown",
  entourage: "entourage",
  "extra-info": "extra_info",
  gifts: "gift_details",
  gallery: "gallery",
  guestbook: "guestbook",
  hero: "host_info",
  music: "music_effects",
  reception: "secondary_event",
  rsvp: "rsvp_form",
  sponsors: "principal_sponsors",
  "our-story": "story_message",
  timeline: "timeline_program",
  venue: "venue",
} as const;

for (const scenario of scenarios) {
  for (const viewport of viewports) {
    test(`straight boundary layout: ${scenario.name} at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/?eventSlug=${scenario.slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(300);
      await page.addStyleTag({
        content: `
          *, *::before, *::after {
            animation-delay: 0s !important;
            animation-duration: 0s !important;
            caret-color: transparent !important;
            transition-delay: 0s !important;
            transition-duration: 0s !important;
          }
          html { scroll-behavior: auto !important; }
          canvas, nextjs-portal, [data-scroll-progress] { visibility: hidden !important; }
        `,
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);

      // Verify disabled sections are absent
      for (const disabledKey of scenario.disabled) {
        const sectionId = Object.entries(sectionKeyById).find(([, key]) => key === disabledKey)?.[0];
        if (sectionId) {
          await expect(page.locator(`#${sectionId}`)).toHaveCount(0);
          await expect(page.locator(`a[href="#${sectionId}"]`)).toHaveCount(0);
        }
      }

      // Assert zero transition nodes or wave SVGs exist in main
      const transitionsCount = await page.locator("main [data-section-transition]").count();
      expect(transitionsCount).toBe(0);

      const waveSvgCount = await page.locator("main svg[data-wave-variant]").count();
      expect(waveSvgCount).toBe(0);

      // Assert no horizontal overflow
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    });
  }
}
