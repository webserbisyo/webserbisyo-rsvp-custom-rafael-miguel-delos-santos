import test from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import {
  PRINCESS_ANNE_ATTIRE_PALETTE,
  clientConfig,
} from "../src/client/client.config";

test("Client-local active attire configuration for Princess Anne", () => {
  const configAttire = clientConfig.sections?.attire as {
    illustration?: { src: string };
    palette?: Array<{ label: string; color: string }>;
  };

  // Active config must specify Princess Anne starter palette
  assert.ok(configAttire?.palette, "clientConfig.sections.attire must configure palette");
  assert.strictEqual(configAttire.palette.length, 5, "Palette must contain 5 colors");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[0].label, "Dusty Blue");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[0].color, "#7498AB");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[1].label, "Blue Slate");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[1].color, "#3F6475");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[2].label, "Mist Blue");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[2].color, "#DCE8ED");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[3].label, "Champagne Sand");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[3].color, "#D6C3A7");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[4].label, "Evening Navy");
  assert.strictEqual(PRINCESS_ANNE_ATTIRE_PALETTE[4].color, "#17313D");

  // Active config must specify approved Princess Anne attire illustration
  assert.strictEqual(
    configAttire?.illustration?.src,
    "/images/attire/princess-anne-attire-illustration-blue-hour-romance.webp",
    "Active Princess Anne config must specify approved attire illustration"
  );
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

  // 1. Verify DEFAULT_PALETTE and fragile text checks are absent from AttireSection
  assert.ok(
    !attireSectionTsx.includes("DEFAULT_PALETTE"),
    "AttireSection must NOT contain a DEFAULT_PALETTE fallback with another client's colors"
  );
  assert.ok(
    !attireSectionTsx.includes("displayIntro.includes(\"beachfront\")"),
    "AttireSection must NOT use fragile beachfront string suppression"
  );
  assert.ok(
    !attireSectionTsx.includes("#D8C8A9"),
    "AttireSection must NOT contain hardcoded Dianne champagne color"
  );
  assert.ok(
    !attireSectionTsx.includes("#7A836B"),
    "AttireSection must NOT contain hardcoded Dianne sage olive color"
  );

  // 2. Verify AttireSection renders Next/Image illustration dynamically from config only when present
  assert.ok(
    attireSectionTsx.includes("import Image from \"next/image\""),
    "AttireSection must import Next/Image"
  );
  assert.ok(
    attireSectionTsx.includes("illustration && illustration.src"),
    "AttireSection must check illustration && illustration.src before rendering"
  );
  assert.ok(
    !attireSectionTsx.includes("/images/attire/dianne-attire-illustration.webp"),
    "Image asset path must not be hardcoded in AttireSection.tsx"
  );

  // 3. Verify Content Order & Conditional Guarding
  const headingPos = attireSectionTsx.indexOf("SectionHeading");
  const illustrationPos = attireSectionTsx.indexOf("Four-Model Fashion Illustration");
  const guidancePos = attireSectionTsx.indexOf("Standalone Guideline Paragraph");
  const cardPos = attireSectionTsx.indexOf("Compact Warm Ivory Dress Code Card");

  assert.ok(headingPos < illustrationPos, "Heading must render before Illustration");
  assert.ok(illustrationPos < guidancePos, "Illustration must render before Guidance Paragraph");
  assert.ok(guidancePos < cardPos, "Guideline Paragraph must render before Palette Card");

  // 4. Verify Palette Card uses 5-column horizontal grid layout when palette exists
  assert.ok(
    attireSectionTsx.includes("grid grid-cols-5"),
    "AttireSection palette container must use grid grid-cols-5"
  );
  assert.ok(
    attireSectionTsx.includes("hasPalette && palette"),
    "AttireSection must conditionally render palette swatches block only when palette is present"
  );

  // 5. Verify Swatch component label safety rules
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
