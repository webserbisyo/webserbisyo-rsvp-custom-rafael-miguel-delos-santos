import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import manifestGenerator from "../src/app/manifest";
import { WEDDING_BROWSER_THEME_COLOR } from "../src/config/browser-theme";

test("WEDDING_BROWSER_THEME_COLOR equals approved dark espresso #171512", () => {
  assert.equal(
    WEDDING_BROWSER_THEME_COLOR,
    "#171512",
    "WEDDING_BROWSER_THEME_COLOR must be #171512",
  );
});

test("src/app/layout.tsx exports viewport metadata using WEDDING_BROWSER_THEME_COLOR and sets SSR root style", () => {
  const layoutPath = path.join(process.cwd(), "src/app/layout.tsx");
  const content = fs.readFileSync(layoutPath, "utf-8");

  assert.ok(
    content.includes("export const viewport: Viewport"),
    "layout.tsx must export viewport metadata",
  );
  assert.ok(
    content.includes("themeColor: WEDDING_BROWSER_THEME_COLOR"),
    "viewport themeColor must use WEDDING_BROWSER_THEME_COLOR",
  );
  assert.ok(
    content.includes('"--wedding-browser-surface": WEDDING_BROWSER_THEME_COLOR'),
    "Root html must set --wedding-browser-surface CSS variable",
  );
  assert.ok(
    content.includes("backgroundColor: WEDDING_BROWSER_THEME_COLOR"),
    "Root html must set SSR backgroundColor",
  );
});

test("src/app/manifest.ts exports App Router manifest with #171512 theme and background colors", () => {
  const manifestData = manifestGenerator();

  assert.equal(
    manifestData.theme_color,
    "#171512",
    "manifest theme_color must be #171512",
  );
  assert.equal(
    manifestData.background_color,
    "#171512",
    "manifest background_color must be #171512",
  );
  assert.equal(
    manifestData.name,
    "WebSerbisyo RSVP Event",
    "manifest name must be preserved",
  );
  assert.equal(
    manifestData.display,
    "standalone",
    "manifest display must be standalone",
  );
});

test("legacy static public/manifest.webmanifest is removed in favor of App Router manifest route", () => {
  const legacyManifestPath = path.join(process.cwd(), "public/manifest.webmanifest");
  assert.equal(
    fs.existsSync(legacyManifestPath),
    false,
    "public/manifest.webmanifest must be removed when replaced by src/app/manifest.ts",
  );
});

test("src/styles/globals.css sets html background to --wedding-browser-surface with #171512 fallback and body inherits", () => {
  const globalsPath = path.join(process.cwd(), "src/styles/globals.css");
  const cssContent = fs.readFileSync(globalsPath, "utf-8");

  assert.ok(
    cssContent.includes("background-color: var(--wedding-browser-surface, #171512);"),
    "globals.css html must define background-color with #171512 fallback",
  );
  assert.ok(
    cssContent.includes("background-color: inherit;"),
    "globals.css body must inherit root background-color",
  );
});

test("public/offline.html theme-color meta tag is set to #171512", () => {
  const offlinePath = path.join(process.cwd(), "public/offline.html");
  const offlineContent = fs.readFileSync(offlinePath, "utf-8");

  assert.ok(
    offlineContent.includes('<meta name="theme-color" content="#171512" />'),
    "offline.html theme-color meta tag must be #171512",
  );
  assert.ok(
    offlineContent.includes("background: #171512;"),
    "offline.html body background must be #171512",
  );
});

test("no stale #c96b48 browser metadata exists in src/app/ or public/ manifest files", () => {
  const layoutContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/layout.tsx"),
    "utf-8",
  );
  const manifestContent = fs.readFileSync(
    path.join(process.cwd(), "src/app/manifest.ts"),
    "utf-8",
  );

  assert.equal(
    layoutContent.includes("#c96b48"),
    false,
    "layout.tsx must not contain stale #c96b48",
  );
  assert.equal(
    manifestContent.includes("#c96b48"),
    false,
    "manifest.ts must not contain stale #c96b48",
  );
});
