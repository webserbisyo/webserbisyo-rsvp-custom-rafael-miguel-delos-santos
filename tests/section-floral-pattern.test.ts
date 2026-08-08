import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  getVisibleClientSectionKeys,
  type ClientSectionKey,
} from "../src/client/client-section-registry";
import {
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionContract,
} from "../src/lib/event-website-section-contract";
import type { EventWebsiteRenderModel } from "../src/types/public-event";

const canonicalOrder = eventWebsiteSectionContract.map((entry) => entry.key);

function buildRenderModel(
  disabled: ClientSectionKey[] = [],
): EventWebsiteRenderModel {
  return {
    assets: {},
    contractVersion: EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
    coupleDisplayName: "Dianne & Novio",
    eventSlug: "dianne-novio",
    guestbookMessages: [],
    publishedRevision: 1,
    raw: {},
    savedRevision: 1,
    sections: canonicalOrder.map((key) => ({
      content: {},
      enabled: !disabled.includes(key),
      key,
    })),
    source: "live",
    title: "Dianne & Novio Wedding",
  };
}

test("WebP floral trace asset files exist in public/images/decoration/", () => {
  const densePath = path.join(
    process.cwd(),
    "public/images/decoration/section-pattern-dense-allover.webp",
  );
  const openPath = path.join(
    process.cwd(),
    "public/images/decoration/section-pattern-open-framed.webp",
  );

  assert.ok(fs.existsSync(densePath), "Dense allover asset must exist");
  assert.ok(fs.existsSync(openPath), "Open framed asset must exist");
});

test("SectionFloralPatternContext component file exists", () => {
  const contextPath = path.join(
    process.cwd(),
    "src/client/components/SectionFloralPatternContext.tsx",
  );
  assert.ok(
    fs.existsSync(contextPath),
    "SectionFloralPatternContext.tsx must exist",
  );
});

test("ClientEventRenderer centrally imports and uses SectionFloralPatternContext for eligible sections", () => {
  const rendererPath = path.join(
    process.cwd(),
    "src/client/renderer/ClientEventRenderer.tsx",
  );
  const content = fs.readFileSync(rendererPath, "utf-8");

  assert.ok(
    content.includes("SectionFloralPatternContext"),
    "ClientEventRenderer must import SectionFloralPatternContext",
  );
  assert.ok(
    content.includes('key !== "host_info"'),
    "ClientEventRenderer must exclude host_info (Hero) from pattern context",
  );
  assert.ok(
    content.includes("dense-allover"),
    "ClientEventRenderer must alternate dense-allover variant",
  );
  assert.ok(
    content.includes("open-framed"),
    "ClientEventRenderer must alternate open-framed variant",
  );
});

test("client-theme.css defines semantic wash variables and section pattern background rule", () => {
  const cssPath = path.join(
    process.cwd(),
    "src/client/styles/client-theme.css",
  );
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  assert.ok(
    cssContent.includes("--wedding-pattern-wash-light"),
    "CSS must define --wedding-pattern-wash-light",
  );
  assert.ok(
    cssContent.includes("--wedding-pattern-wash-warm"),
    "CSS must define --wedding-pattern-wash-warm",
  );
  assert.ok(
    cssContent.includes("--wedding-pattern-wash-olive"),
    "CSS must define --wedding-pattern-wash-olive",
  );
  assert.ok(
    cssContent.includes("--wedding-pattern-wash-dark"),
    "CSS must define --wedding-pattern-wash-dark",
  );
  assert.ok(
    cssContent.includes(".wedding-section-pattern-context"),
    "CSS must contain .wedding-section-pattern-context background rule",
  );
  assert.ok(
    cssContent.includes('[data-floral-pattern="open-framed"]'),
    "CSS must contain open-framed variant visibility boost rule",
  );
});

test("alternation logic correctly assigns pattern variants to visible sections and recalculates on disabled sections", () => {
  const fullVisible = getVisibleClientSectionKeys(buildRenderModel());
  const eligibleFull = fullVisible.filter((k) => k !== "host_info");

  // First eligible section after Hero -> dense-allover (index 0)
  assert.equal(eligibleFull.indexOf("countdown"), 0);
  assert.equal(0 % 2 === 0 ? "dense-allover" : "open-framed", "dense-allover");

  // Second eligible section -> open-framed (index 1)
  assert.equal(eligibleFull.indexOf("music_effects"), 1);
  assert.equal(1 % 2 === 0 ? "dense-allover" : "open-framed", "open-framed");

  // Disabling 'countdown' causes 'music_effects' to become index 0 -> dense-allover
  const disabledCountdown = getVisibleClientSectionKeys(
    buildRenderModel(["countdown"]),
  );
  const eligibleDisabled = disabledCountdown.filter((k) => k !== "host_info");
  assert.equal(eligibleDisabled.indexOf("music_effects"), 0);
  assert.equal(0 % 2 === 0 ? "dense-allover" : "open-framed", "dense-allover");
});

test("individual section components do not import or hardcode section pattern context", () => {
  const sectionsDir = path.join(process.cwd(), "src/client/sections");
  const files = fs.readdirSync(sectionsDir).filter((f) => f.endsWith(".tsx"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(sectionsDir, file), "utf-8");
    assert.equal(
      content.includes("SectionFloralPatternContext"),
      false,
      `Section component ${file} must not import SectionFloralPatternContext`,
    );
    assert.equal(
      content.includes("section-pattern-"),
      false,
      `Section component ${file} must not reference section-pattern- assets`,
    );
  }
});
