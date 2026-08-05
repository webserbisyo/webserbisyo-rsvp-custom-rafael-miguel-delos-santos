import test from "node:test";
import assert from "node:assert";
import { deriveCoupleBranding } from "../src/client/utils/derive-couple-branding";

test("deriveCoupleBranding: derives initials when separate partner names exist", () => {
  const result = deriveCoupleBranding({
    partnerOneName: "John",
    partnerTwoName: "Dianne",
    displayAs: "John & Dianne",
    weddingDate: "2027-04-18",
  });

  assert.deepStrictEqual(result.monogram, ["J", "D"]);
  assert.strictEqual(result.coupleLabel, "John & Dianne");
  assert.strictEqual(result.copyrightYear, "2027");
});

test("deriveCoupleBranding: parses displayAs when separate partner names are missing", () => {
  const result = deriveCoupleBranding({
    displayAs: "Rafael & Isabella",
    weddingDate: "2026-12-31",
  });

  assert.deepStrictEqual(result.monogram, ["R", "I"]);
  assert.strictEqual(result.coupleLabel, "Rafael & Isabella");
  assert.strictEqual(result.copyrightYear, "2026");
});

test("deriveCoupleBranding: handles titles and multi-word names", () => {
  const result = deriveCoupleBranding({
    partnerOneName: "Dr. John Paul",
    partnerTwoName: "Dianne Marie",
  });

  assert.deepStrictEqual(result.monogram, ["J", "D"]);
  assert.strictEqual(result.coupleLabel, "Dr. John Paul & Dianne Marie");
});

test("deriveCoupleBranding: handles displayAs delimiters like and, +, /", () => {
  const r1 = deriveCoupleBranding({ displayAs: "Romeo and Juliet" });
  assert.deepStrictEqual(r1.monogram, ["R", "J"]);

  const r2 = deriveCoupleBranding({ displayAs: "Alex + Sam" });
  assert.deepStrictEqual(r2.monogram, ["A", "S"]);

  const r3 = deriveCoupleBranding({ displayAs: "Chris / Taylor" });
  assert.deepStrictEqual(r3.monogram, ["C", "T"]);
});

test("deriveCoupleBranding: returns null monogram for missing or single names", () => {
  const result = deriveCoupleBranding({
    displayAs: "Single Name Only",
  });

  assert.strictEqual(result.monogram, null);
  assert.strictEqual(result.coupleLabel, "Single Name Only");
});

test("deriveCoupleBranding: extracts 4-digit year from ISO date strings", () => {
  const result = deriveCoupleBranding({
    weddingDate: "2028-09-15T00:00:00.000Z",
  });
  assert.strictEqual(result.copyrightYear, "2028");
});

test("contract: client-theme.css defines .wedding-hero-message-text and HeroSection consumes it", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(
    new URL("../src/client/styles/client-theme.css", import.meta.url),
    "utf-8"
  );
  const heroTsx = await fs.readFile(
    new URL("../src/client/sections/HeroSection.tsx", import.meta.url),
    "utf-8"
  );

  assert.ok(
    css.includes(".wedding-hero-message-text"),
    "client-theme.css must define .wedding-hero-message-text"
  );
  assert.ok(
    heroTsx.includes('className="wedding-hero-message-text"'),
    "HeroSection.tsx must use wedding-hero-message-text className"
  );
});

test("contract: ContactSection and ClientMonogram contain no stale hardcoded client identity", async () => {
  const fs = await import("node:fs/promises");
  const contactTsx = await fs.readFile(
    new URL("../src/client/sections/ContactSection.tsx", import.meta.url),
    "utf-8"
  );
  const monogramTsx = await fs.readFile(
    new URL("../src/client/components/ClientMonogram.tsx", import.meta.url),
    "utf-8"
  );
  const configTs = await fs.readFile(
    new URL("../src/client/client.config.ts", import.meta.url),
    "utf-8"
  );

  assert.ok(!contactTsx.includes("Rafael"), "ContactSection must not contain hardcoded Rafael");
  assert.ok(!contactTsx.includes("Isabella"), "ContactSection must not contain hardcoded Isabella");
  assert.ok(!contactTsx.includes("R & I"), "ContactSection must not contain hardcoded R & I");
  assert.ok(!monogramTsx.includes('["J", "D"]'), "ClientMonogram must not default to hardcoded J & D");
  assert.ok(!configTs.includes('monogram: ["J", "D"]'), "client.config.ts must not default to hardcoded J & D");
});
