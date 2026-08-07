import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  DEFAULT_PETAL_THEME,
  resolvePetalTheme,
} from "../src/client/theme/resolve-petal-theme";
import { PETAL_COLOR_WEIGHTS } from "../src/client/components/FallingPetals";

test("PETAL_COLOR_WEIGHTS weights sum to exactly 100 with correct roles", () => {
  const totalWeight = PETAL_COLOR_WEIGHTS.reduce(
    (sum, item) => sum + item.weight,
    0,
  );
  assert.equal(totalWeight, 100, "Petal color weights must total 100");

  const roles = PETAL_COLOR_WEIGHTS.map((item) => item.role);
  assert.deepEqual(roles, [
    "primary",
    "secondary",
    "light",
    "metallic",
    "botanical",
  ]);
});

test("client-theme.css defines rules for all 5 semantic petal color roles and canvas shadow", () => {
  const cssPath = path.join(
    process.cwd(),
    "src/client/styles/client-theme.css",
  );
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  assert.ok(
    cssContent.includes("--wedding-petal-primary-base"),
    "CSS must define --wedding-petal-primary-base",
  );
  assert.ok(
    cssContent.includes("--wedding-petal-secondary-base"),
    "CSS must define --wedding-petal-secondary-base",
  );
  assert.ok(
    cssContent.includes("--wedding-petal-light-base"),
    "CSS must define --wedding-petal-light-base",
  );
  assert.ok(
    cssContent.includes("--wedding-petal-metallic-base"),
    "CSS must define --wedding-petal-metallic-base",
  );
  assert.ok(
    cssContent.includes("--wedding-petal-botanical-base"),
    "CSS must define --wedding-petal-botanical-base",
  );
  assert.ok(
    cssContent.includes("--wedding-petal-canvas-shadow"),
    "CSS must define --wedding-petal-canvas-shadow",
  );
});

test("resolvePetalTheme returns typed fallback when element or computed style is unavailable", () => {
  const resolved = resolvePetalTheme(null);
  assert.deepEqual(resolved, DEFAULT_PETAL_THEME);
  assert.equal(resolved.primary.base, "#b98282");
  assert.equal(resolved.secondary.base, "#d6a6a0");
  assert.equal(resolved.light.base, "#d8c8a9");
  assert.equal(resolved.metallic.base, "#9a7b45");
  assert.equal(resolved.botanical.base, "#7a836b");
});

test("FallingPetals.tsx no longer contains hardcoded tropical coral or salmon colors", () => {
  const petalsPath = path.join(
    process.cwd(),
    "src/client/components/FallingPetals.tsx",
  );
  const content = fs.readFileSync(petalsPath, "utf-8");

  const staleColors = [
    "#FFC5D0",
    "#FF98AC",
    "#F77992",
    "#EA667F",
    "#DC5D6E",
    "#FFAF91",
    "rgba(201, 114, 88, 0.12)",
  ];

  for (const staleColor of staleColors) {
    assert.equal(
      content.includes(staleColor),
      false,
      `FallingPetals.tsx must not contain hardcoded color ${staleColor}`,
    );
  }
});

test("FallingPetals.tsx retains prefers-reduced-motion check, pointer-events-none, and aria-hidden", () => {
  const petalsPath = path.join(
    process.cwd(),
    "src/client/components/FallingPetals.tsx",
  );
  const content = fs.readFileSync(petalsPath, "utf-8");

  assert.ok(
    content.includes("prefers-reduced-motion: reduce"),
    "FallingPetals.tsx must check prefers-reduced-motion",
  );
  assert.ok(
    content.includes("pointer-events-none"),
    "FallingPetals canvas must be pointer-events-none",
  );
  assert.ok(
    content.includes('aria-hidden="true"'),
    "FallingPetals canvas must be aria-hidden=true",
  );
});

test("FallingPetals.tsx preserves route-specific particle reductions for /rsvp", () => {
  const petalsPath = path.join(
    process.cwd(),
    "src/client/components/FallingPetals.tsx",
  );
  const content = fs.readFileSync(petalsPath, "utf-8");

  assert.ok(
    content.includes('const isRsvp = pathname === "/rsvp"'),
    "FallingPetals.tsx must check for /rsvp pathname",
  );
  assert.ok(
    content.includes("targetCount: isRsvp ? 12 : 20"),
    "FallingPetals.tsx must reduce mobile count on /rsvp",
  );
});
