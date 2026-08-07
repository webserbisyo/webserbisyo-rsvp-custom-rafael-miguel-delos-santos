import test from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import {
  DIANNE_ATTIRE_PALETTE,
  DIANNE_ATTIRE_ILLUSTRATION,
  clientConfig,
} from "../src/client/client.config";

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

test("Client-local attire illustration configuration", () => {
  assert.ok(DIANNE_ATTIRE_ILLUSTRATION, "Illustration config must exist");
  assert.strictEqual(
    DIANNE_ATTIRE_ILLUSTRATION.src,
    "/images/attire/dianne-attire-illustration.webp",
    "Illustration source must use public semantic asset path"
  );
  assert.ok(
    DIANNE_ATTIRE_ILLUSTRATION.alt.length > 20,
    "Illustration must have descriptive alt text"
  );
  assert.strictEqual(DIANNE_ATTIRE_ILLUSTRATION.width, 2752);
  assert.strictEqual(DIANNE_ATTIRE_ILLUSTRATION.height, 1536);

  // Check clientConfig integration
  const configAttire = clientConfig.sections?.attire as {
    illustration?: typeof DIANNE_ATTIRE_ILLUSTRATION;
  };
  assert.ok(configAttire?.illustration, "clientConfig.sections.attire must include illustration");
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

  // 1. Verify AttireSection renders Next/Image illustration from config
  assert.ok(
    attireSectionTsx.includes("import Image from \"next/image\""),
    "AttireSection must import Next/Image"
  );
  assert.ok(
    attireSectionTsx.includes("illustration.src"),
    "AttireSection must render illustration src dynamically from config"
  );
  assert.ok(
    !attireSectionTsx.includes("/images/attire/dianne-attire-illustration.webp"),
    "Image asset path must not be hardcoded in AttireSection.tsx"
  );

  // 2. Verify Content Order: Heading -> Illustration -> Guidance -> Compact Palette Card
  const headingPos = attireSectionTsx.indexOf("SectionHeading");
  const illustrationPos = attireSectionTsx.indexOf("Four-Model Fashion Illustration");
  const guidancePos = attireSectionTsx.indexOf("Standalone Guideline Paragraph");
  const cardPos = attireSectionTsx.indexOf("Compact Warm Ivory Dress Code Card");

  assert.ok(headingPos < illustrationPos, "Heading must render before Illustration");
  assert.ok(illustrationPos < guidancePos, "Illustration must render before Guidance Paragraph");
  assert.ok(guidancePos < cardPos, "Guideline Paragraph must render before Palette Card");

  // 3. Verify Palette Card uses 5-column horizontal grid layout
  assert.ok(
    attireSectionTsx.includes("grid grid-cols-5"),
    "AttireSection palette container must use grid grid-cols-5"
  );
  assert.ok(
    !attireSectionTsx.includes("flex-wrap"),
    "AttireSection must remove old flex-wrap layout"
  );
  assert.ok(
    !attireSectionTsx.includes("overflow-x-auto"),
    "AttireSection must not use horizontal scroll rail"
  );

  // 4. Verify Swatch component label safety rules
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
  assert.ok(
    attireSwatchTsx.includes("min-w-0"),
    "AttireColorSwatch must use min-w-0 for flex/grid child flex safety"
  );
});
