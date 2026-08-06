import test from "node:test";
import assert from "node:assert";

test("contract: client-theme.css defines semantic drawer tokens and drawer.tsx consumes them", async () => {
  const fs = await import("node:fs/promises");
  const css = await fs.readFile(
    new URL("../src/client/styles/client-theme.css", import.meta.url),
    "utf-8"
  );
  const drawerTsx = await fs.readFile(
    new URL("../src/client/components/ui/drawer.tsx", import.meta.url),
    "utf-8"
  );
  const sitemapTsx = await fs.readFile(
    new URL("../src/client/components/SitemapDrawer.tsx", import.meta.url),
    "utf-8"
  );

  // Check CSS variables
  assert.ok(
    css.includes("--wedding-drawer-overlay: rgb(23 21 18 / 50%);"),
    "client-theme.css must define neutral espresso drawer overlay variable"
  );
  assert.ok(
    css.includes("--wedding-drawer-surface: var(--wedding-surface-ivory);"),
    "client-theme.css must define drawer surface variable"
  );
  assert.ok(
    css.includes(".wedding-drawer-link-label::after"),
    "client-theme.css must define underline pseudo-element background for drawer link labels"
  );

  // Check drawer.tsx uses semantic tokens and omits hardcoded red-brown bg-[#2D1B12]/40
  assert.ok(
    !drawerTsx.includes("bg-[#2D1B12]/40"),
    "drawer.tsx must NOT contain hardcoded sepia background bg-[#2D1B12]/40"
  );
  assert.ok(
    drawerTsx.includes("--wedding-drawer-overlay"),
    "drawer.tsx must consume --wedding-drawer-overlay variable"
  );
  assert.ok(
    !drawerTsx.includes("bg-[#FDFBF7]"),
    "drawer.tsx must NOT contain hardcoded hex background bg-[#FDFBF7]"
  );

  // Check SitemapDrawer.tsx uses scrollRef, ChevronDown scroll indicator, and underline animation
  assert.ok(
    sitemapTsx.includes("scrollRef"),
    "SitemapDrawer.tsx must attach scrollRef to the scroll container"
  );
  assert.ok(
    sitemapTsx.includes("ChevronDown"),
    "SitemapDrawer.tsx must render ChevronDown icon for scroll overflow"
  );
  assert.ok(
    sitemapTsx.includes("hasMoreBelow"),
    "SitemapDrawer.tsx must track hasMoreBelow scroll position state"
  );
  assert.ok(
    sitemapTsx.includes("wedding-drawer-link-label"),
    "SitemapDrawer.tsx must render wedding-drawer-link-label with underline animation"
  );
});
