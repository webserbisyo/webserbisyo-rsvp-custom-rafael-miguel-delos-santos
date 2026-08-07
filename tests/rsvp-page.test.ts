import test from "node:test";
import assert from "node:assert";

test("contract: client-theme.css defines Option B RSVP tokens and ClientRsvpPage uses generous dock clearance", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(
    new URL("../src/client/styles/client-theme.css", import.meta.url),
    "utf-8"
  );
  const rsvpPageTsx = await fs.readFile(
    new URL("../src/client/rsvp/ClientRsvpPage.tsx", import.meta.url),
    "utf-8"
  );
  const rsvpFormTsx = await fs.readFile(
    new URL("../src/client/rsvp/ClientRsvpForm.tsx", import.meta.url),
    "utf-8"
  );

  // Check Option B tokens in client-theme.css
  assert.ok(
    css.includes("--wedding-rsvp-surface: var(--wedding-surface-ivory);"),
    "client-theme.css must map --wedding-rsvp-surface to ivory surface variable"
  );
  assert.ok(
    css.includes("--wedding-rsvp-field: #ffffff;"),
    "client-theme.css must map --wedding-rsvp-field to white input background"
  );

  // Check ClientRsvpPage.tsx uses generous bottom clearance for FloatingGuestDock
  assert.ok(
    rsvpPageTsx.includes("pb-36"),
    "ClientRsvpPage.tsx must use pb-36 for FloatingGuestDock bottom clearance"
  );

  assert.ok(
    rsvpPageTsx.includes("WeddingDecoration"),
    "ClientRsvpPage must use the centralized WeddingDecoration component",
  );
  for (const position of [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ]) {
    assert.ok(
      rsvpPageTsx.includes(`position="${position}"`),
      `ClientRsvpPage must render an RSVP decoration at ${position}`,
    );
  }
  assert.ok(
    !rsvpPageTsx.includes("/images/decoration/dianne/"),
    "ClientRsvpPage must not import Dianne floral image paths directly",
  );
  assert.ok(
    rsvpPageTsx.includes("wedding-rsvp-content relative z-20"),
    "RSVP content must layer above card decorations",
  );
  assert.ok(
    rsvpPageTsx.includes("wedding-rsvp-couple-name"),
    "RSVP heading must use its dedicated responsive one-line class",
  );

  assert.ok(
    css.includes(".wedding-rsvp-pattern"),
    "RSVP shell must expose a dedicated pattern layer",
  );
  assert.ok(
    css.includes("section-pattern-garden-blooms.webp"),
    "RSVP pattern must reuse the approved garden-blooms asset",
  );
  assert.ok(
    css.includes(".wedding-decoration--target-rsvp"),
    "RSVP floral sizing must remain centralized in theme CSS",
  );
  assert.ok(
    css.includes("font-size: clamp(2rem, 10vw, 4rem);"),
    "RSVP heading must use the measured responsive font range",
  );
  assert.ok(css.includes("white-space: nowrap;"), "RSVP heading must not wrap");
  assert.ok(
    !css.includes("--wedding-decoration-optical-x-tl"),
    "RSVP finalization must not introduce optical translation variables",
  );

  // Check ClientRsvpForm.tsx omits hardcoded inline hex colors
  assert.ok(
    !rsvpFormTsx.includes("bg-[#fffaf1]/30"),
    "ClientRsvpForm.tsx must NOT contain hardcoded companion background bg-[#fffaf1]/30"
  );
  assert.ok(
    !rsvpFormTsx.includes("border-[#a84f45]"),
    "ClientRsvpForm.tsx must NOT contain hardcoded red border hex border-[#a84f45]"
  );
  assert.ok(
    rsvpFormTsx.includes("wedding-rsvp-companion-card"),
    "ClientRsvpForm.tsx must use wedding-rsvp-companion-card class"
  );
});
