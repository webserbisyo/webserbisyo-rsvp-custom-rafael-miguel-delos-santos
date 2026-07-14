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
  { disabled: [], name: "all-sections", slug: "all-sections", snapshotPair: ["music_effects", "main_event"] },
  { disabled: ["music_effects"], name: "music-disabled", slug: "music-disabled", snapshotPair: ["countdown", "main_event"] },
  { disabled: [], name: "music-reenabled", slug: "music-reenabled", snapshotPair: ["music_effects", "main_event"] },
  { disabled: ["countdown"], name: "countdown-disabled", slug: "countdown-disabled", snapshotPair: ["host_info", "music_effects"] },
  {
    disabled: ["countdown", "music_effects"],
    name: "countdown-and-music-disabled",
    slug: "countdown-and-music-disabled",
    snapshotPair: ["main_event", "venue"],
  },
  { disabled: ["secondary_event"], name: "reception-disabled", slug: "reception-disabled", snapshotPair: ["main_event", "venue"] },
  {
    disabled: ["secondary_event", "timeline_program"],
    name: "reception-and-timeline-disabled",
    slug: "reception-and-timeline-disabled",
    snapshotPair: ["venue", "entourage"],
  },
  {
    disabled: ["entourage", "principal_sponsors", "attire_motif"],
    name: "three-consecutive-disabled",
    slug: "three-consecutive-disabled",
    snapshotPair: ["main_event", "venue"],
  },
  { disabled: ["story_message"], name: "story-disabled", slug: "story-disabled", snapshotPair: ["guestbook", "contact_socials"] },
  {
    disabled: [
      "countdown",
      "music_effects",
      "secondary_event",
      "timeline_program",
      "entourage",
      "principal_sponsors",
      "attire_motif",
      "extra_info",
      "gift_details",
      "guestbook",
      "story_message",
      "contact_socials",
    ],
    name: "all-optional-disabled",
    slug: "all-optional-disabled",
    snapshotPair: ["main_event", "venue"],
  },
] as const;

const sectionKeyById = {
  attire: "attire_motif",
  ceremony: "main_event",
  contact: "contact_socials",
  countdown: "countdown",
  entourage: "entourage",
  "extra-info": "extra_info",
  gifts: "gift_details",
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

const canonicalSectionOrder = [
  "host_info",
  "countdown",
  "music_effects",
  "main_event",
  "venue",
  "secondary_event",
  "timeline_program",
  "entourage",
  "principal_sponsors",
  "attire_motif",
  "extra_info",
  "rsvp_form",
  "gift_details",
  "guestbook",
  "story_message",
  "contact_socials",
] as const;

for (const scenario of scenarios) {
  for (const viewport of viewports) {
    test(`${scenario.name} at ${viewport.name}`, async ({ page }) => {
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
          canvas, [data-scroll-progress] { visibility: hidden !important; }
        `,
      });
      await page.evaluate(() => document.fonts.ready);

      for (const disabledKey of scenario.disabled) {
        const sectionId = Object.entries(sectionKeyById).find(([, key]) => key === disabledKey)?.[0];
        if (sectionId) {
          await expect(page.locator(`#${sectionId}`)).toHaveCount(0);
          await expect(page.locator(`a[href="#${sectionId}"]`)).toHaveCount(0);
        }
      }

      const transitions = await page.locator("main").evaluate((main) => {
        const transitions = Array.from(
          main.querySelectorAll<HTMLElement>(":scope > [data-section-transition]"),
        ).map((element) => ({
          display: getComputedStyle(element).display,
          from: element.dataset.transitionFrom,
          svgCount: element.querySelectorAll("svg").length,
          to: element.dataset.transitionTo,
          variant: element.dataset.transitionVariant,
        }));

        return transitions;
      });

      const disabledKeys = new Set<string>(scenario.disabled);
      const expectedKeys = canonicalSectionOrder.filter((key) => !disabledKeys.has(key));
      const expectedPairs = expectedKeys
        .slice(0, -1)
        .map((key, index) => [key, expectedKeys[index + 1]]);

      expect(transitions).toHaveLength(expectedKeys.length - 1);
      expect(transitions.map(({ from, to }) => [from, to])).toEqual(expectedPairs);
      for (const transition of transitions) {
        if (transition.variant === "none") {
          expect(transition.display).toBe("none");
        } else if (transition.variant === "wave" || transition.variant === "bouquet") {
          expect(transition.svgCount).toBe(1);
        }
      }

      const canvas = page.locator("canvas");
      await expect(canvas).toHaveCount(1);
      await expect(canvas).toHaveCSS("pointer-events", "none");

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);

      if (scenario.name === "all-sections" || scenario.name === "music-reenabled") {
        const musicExit = page.locator(
          '[data-transition-from="music_effects"][data-transition-to="main_event"]',
        );
        await expect(musicExit).toHaveAttribute("data-from-background", "seafoam");
        await expect(musicExit).toHaveAttribute("data-to-background", "ivory");
        await expect(musicExit.locator("svg")).toHaveCSS("background-color", "rgb(253, 246, 237)");
      }

      if (scenario.name === "reception-disabled") {
        const venueExit = page.locator(
          '[data-transition-from="venue"][data-transition-to="timeline_program"]',
        );
        await expect(venueExit).toHaveAttribute("data-transition-variant", "none");
        await expect(venueExit.locator("img")).toHaveCount(0);
      }

      if (scenario.name === "story-disabled") {
        await expect(page.getByRole("link", { name: "Our Story" })).toHaveCount(0);
      }

      const [snapshotFrom, snapshotTo] = scenario.snapshotPair;
      const snapshotTransition = page.locator(
        `[data-transition-from="${snapshotFrom}"][data-transition-to="${snapshotTo}"]`,
      );
      await expect(snapshotTransition).toHaveCount(1);
      await expect(snapshotTransition).not.toHaveCSS("display", "none");
      const transitionMarkup = await snapshotTransition.evaluate(
        (element) => element.outerHTML,
      );
      await page.evaluate((markup) => {
        const container = document.createElement("main");
        container.innerHTML = markup;
        document.body.replaceChildren(container);
        window.scrollTo(0, 0);
      }, transitionMarkup);
      const isolatedTransition = page.locator("[data-section-transition]");
      await expect(isolatedTransition).toHaveScreenshot(
        `${scenario.name}-${viewport.name}.png`,
      );
    });
  }
}
