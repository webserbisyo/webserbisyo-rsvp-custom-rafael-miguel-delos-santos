import test from "node:test";
import assert from "node:assert";

test("contract: client-theme.css defines centralized typography scale variables and semantic title roles", async () => {
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
    css.includes("--wedding-type-section-title-size: clamp(2.65rem, 5.8vw, 4.75rem);"),
    "client-theme.css must define central section title variable"
  );
  assert.ok(
    css.includes("--wedding-type-section-title-compact-size: clamp(2.15rem, 4.4vw, 3.5rem);"),
    "client-theme.css must define compact title size variable"
  );
  assert.ok(
    css.includes("--wedding-type-page-title-size: clamp(2.5rem, 5.2vw, 4.25rem);"),
    "client-theme.css must define page title size variable"
  );
  assert.ok(
    css.includes("--wedding-type-numeric-display-size: clamp(2.4rem, 7.5vw, 5.5rem);"),
    "client-theme.css must define numeric display size variable"
  );
  assert.ok(
    css.includes(".wedding-section-title--compact"),
    "client-theme.css must define .wedding-section-title--compact modifier"
  );
  assert.ok(
    css.includes(".wedding-page-title"),
    "client-theme.css must define .wedding-page-title role"
  );

  assert.ok(
    headingTsx.includes('scale = "standard"'),
    "SectionHeading.tsx must support optional scale prop"
  );
});

test("contract: GallerySection, RsvpCtaSection, and ClientRsvpPage consume centralized display roles without local utility bypasses", async () => {
  const fs = await import("node:fs/promises");
  const galleryTsx = await fs.readFile(
    new URL("../src/client/sections/GallerySection.tsx", import.meta.url),
    "utf-8"
  );
  const rsvpCtaTsx = await fs.readFile(
    new URL("../src/client/sections/RsvpCtaSection.tsx", import.meta.url),
    "utf-8"
  );
  const rsvpPageTsx = await fs.readFile(
    new URL("../src/client/rsvp/ClientRsvpPage.tsx", import.meta.url),
    "utf-8"
  );

  assert.ok(
    galleryTsx.includes("wedding-section-title--compact"),
    "GallerySection.tsx title must use .wedding-section-title--compact"
  );
  assert.ok(
    !galleryTsx.includes("font-serif text-[#3B2A1A]"),
    "GallerySection.tsx must not contain legacy font-serif text-[#3B2A1A]"
  );

  assert.ok(
    rsvpCtaTsx.includes("wedding-section-title"),
    "RsvpCtaSection.tsx title must use .wedding-section-title"
  );
  assert.ok(
    !rsvpCtaTsx.includes("font-serif text-white text-3xl"),
    "RsvpCtaSection.tsx title must not contain legacy font-serif utility classes"
  );

  assert.ok(
    rsvpPageTsx.includes("wedding-page-title"),
    "ClientRsvpPage.tsx title must use .wedding-page-title"
  );
  assert.ok(
    !rsvpPageTsx.includes("text-3xl md:text-4xl font-normal"),
    "ClientRsvpPage.tsx title must not contain local font size/weight utilities"
  );
});

test("contract: CountdownSection uses .wedding-numeric-display with centralized scale and omits hardcoded Poppins/colors", async () => {
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
