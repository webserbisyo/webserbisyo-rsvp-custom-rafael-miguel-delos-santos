import test from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import { DIANNE_ATTIRE_PALETTE } from "../src/client/client.config";

test("Client-local attire palette configuration", () => {
  assert.strictEqual(DIANNE_ATTIRE_PALETTE.length, 5, "Palette must contain exactly 5 colors");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[0].label, "Champagne");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[0].color, "#D8C8A9");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[1].label, "Muted Gold");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[1].color, "#9A7B45");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[2].label, "Sage Olive");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[2].color, "#7A836B");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[3].label, "Warm Taupe");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[3].color, "#A99583");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[4].label, "Cocoa Black");
  assert.strictEqual(DIANNE_ATTIRE_PALETTE[4].color, "#3A302A");

  // Verify no white, off-white, or ivory swatch exists
  for (const item of DIANNE_ATTIRE_PALETTE) {
    const labelLower = item.label.toLowerCase();
    assert.ok(!labelLower.includes("white"), `Label ${item.label} must not contain white`);
    assert.ok(!labelLower.includes("ivory"), `Label ${item.label} must not contain ivory`);
  }
});

test("AttireSection and AttireColorSwatch design contract assertions", async () => {
  const attireSectionTsx = await fs.readFile(
    new URL("../src/client/sections/AttireSection.tsx", import.meta.url),
    "utf-8"
  );
  const attireSwatchTsx = await fs.readFile(
    new URL("../src/client/components/attire/AttireColorSwatch.tsx", import.meta.url),
    "utf-8"
  );

  // 1. Verify AttireSection uses AttireColorSwatch
  assert.ok(
    attireSectionTsx.includes("AttireColorSwatch"),
    "AttireSection must import and render AttireColorSwatch"
  );

  // 2. Verify redundant text summary is absent and clean label is present
  assert.ok(
    attireSectionTsx.includes("SUGGESTED GUEST COLORS"),
    "AttireSection must display SUGGESTED GUEST COLORS label"
  );
  assert.ok(
    !attireSectionTsx.includes("Sand, Ivory, Sage Green"),
    "AttireSection must not contain hardcoded generic color list text"
  );

  // 3. Verify no regex mutations exist
  assert.ok(
    !attireSectionTsx.includes("replace(/Ivory/gi"),
    "AttireSection must not contain regex replacements for Ivory"
  );

  // 4. Verify SpotlightCard is NOT used in AttireSection
  assert.ok(
    !attireSectionTsx.includes("SpotlightCard"),
    "AttireSection must use custom light card div instead of SpotlightCard"
  );

  // 5. Verify Swatch labels do not use break-words or break-all
  assert.ok(
    !attireSwatchTsx.includes("break-words"),
    "AttireColorSwatch must NOT use break-words"
  );
  assert.ok(
    !attireSwatchTsx.includes("break-all"),
    "AttireColorSwatch must NOT use break-all"
  );
  assert.ok(
    attireSwatchTsx.includes("break-normal"),
    "AttireColorSwatch must use break-normal"
  );

  // 6. Verify centered responsive 3+2 and 2+2+1 flex layout classes
  assert.ok(
    attireSwatchTsx.includes("w-[calc(50%-0.75rem)]"),
    "AttireColorSwatch must use 50% mobile item width"
  );
  assert.ok(
    attireSwatchTsx.includes("sm:w-[calc(33.333%-1rem)]"),
    "AttireColorSwatch must use 33.333% desktop item width"
  );
});
