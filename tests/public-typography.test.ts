import test from "node:test";
import assert from "node:assert";

test("contract: client-theme.css defines V4-inspired section title scale and numeric display", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(
    new URL("../src/client/styles/client-theme.css", import.meta.url),
    "utf-8"
  );
  const headingTsx = await fs.readFile(
    new URL("../src/client/components/SectionHeading.tsx", import.meta.url),
    "utf-8"
  );

  assert.ok(
    css.includes("clamp(2.5rem, 5vw, 4rem)"),
    "client-theme.css must define V4-inspired title clamp clamp(2.5rem, 5vw, 4rem)"
  );
  assert.ok(
    css.includes("line-height: 0.98"),
    ".wedding-section-title must use line-height: 0.98"
  );
  assert.ok(
    css.includes("letter-spacing: -0.035em"),
    ".wedding-section-title must use letter-spacing: -0.035em"
  );
  assert.ok(
    css.includes(".wedding-numeric-display"),
    "client-theme.css must define .wedding-numeric-display"
  );

  assert.ok(
    headingTsx.includes('className="wedding-display wedding-section-title mb-4"'),
    "SectionHeading.tsx title element must rely on .wedding-section-title without conflicting inline size/weight classes"
  );
});

test("contract: CountdownSection uses .wedding-numeric-display and omits hardcoded Poppins/colors", async () => {
  const fs = await import("node:fs/promises");
  const countdownTsx = await fs.readFile(
    new URL("../src/client/sections/CountdownSection.tsx", import.meta.url),
    "utf-8"
  );

  assert.ok(
    countdownTsx.includes("wedding-numeric-display"),
    "CountdownSection.tsx must use .wedding-numeric-display for timer digits"
  );
  assert.ok(
    !countdownTsx.includes("font-poppins"),
    "CountdownSection.tsx must not contain hardcoded font-poppins"
  );
  assert.ok(
    !countdownTsx.includes("#5c4638"),
    "CountdownSection.tsx must not contain hardcoded color #5c4638"
  );
  assert.ok(
    !countdownTsx.includes("#d45f3f"),
    "CountdownSection.tsx must not contain hardcoded color #d45f3f"
  );
});

test("contract: HeroSection overlay middle is 38% on mobile and 28% on desktop with weight 600 name", async () => {
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
    css.includes("--wedding-hero-overlay-middle: rgb(23 21 18 / 38%);"),
    "client-theme.css must set mobile middle overlay to 38%"
  );
  assert.ok(
    css.includes("--wedding-hero-overlay-middle: rgb(23 21 18 / 28%);"),
    "client-theme.css must set desktop middle overlay to 28%"
  );
  assert.ok(
    css.includes(".wedding-hero-name"),
    "client-theme.css must define .wedding-hero-name rule"
  );
  assert.ok(
    css.includes("font-weight: 600;"),
    ".wedding-hero-name must specify font-weight: 600"
  );
  assert.ok(
    !heroTsx.includes("font-medium leading-[1.08]"),
    "HeroSection.tsx h1 must rely on .wedding-hero-name without font-medium utility"
  );
});
