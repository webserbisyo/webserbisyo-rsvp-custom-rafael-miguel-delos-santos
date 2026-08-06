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
