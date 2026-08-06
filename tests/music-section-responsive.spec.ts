import { test, expect } from "@playwright/test";

const viewports = [
  { width: 1440, height: 900, name: "1440x900" },
  { width: 1280, height: 800, name: "1280x800" },
  { width: 1024, height: 768, name: "1024x768" },
  { width: 820, height: 1180, name: "820x1180" },
  { width: 768, height: 1024, name: "768x1024" },
  { width: 430, height: 932, name: "430x932" },
  { width: 390, height: 844, name: "390x844" },
  { width: 375, height: 812, name: "375x812" },
  { width: 320, height: 568, name: "320x568" },
];

test.describe("MusicSection Responsive Audit", () => {
  for (const vp of viewports) {
    test(`responsive layout check at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

      const musicSec = page.locator("#music");
      await expect(musicSec).toBeVisible();

      await musicSec.scrollIntoViewIfNeeded();

      // Assert zero page-level horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasOverflow).toBe(false);

      // Assert both collage assets A and B are visible
      const imgA = musicSec.locator('img[src*="music-story-collage"]');
      const imgB = musicSec.locator('img[src*="music-player-paper"]');
      await expect(imgA).toBeVisible();
      await expect(imgB).toBeVisible();

      // Assert playback button is rendered and meets touch height (>=44px)
      const button = musicSec.locator("button");
      await expect(button).toBeVisible();

      const buttonBox = await button.boundingBox();
      expect(buttonBox).not.toBeNull();
      if (buttonBox) {
        expect(buttonBox.height).toBeGreaterThanOrEqual(44);
      }
    });
  }
});
