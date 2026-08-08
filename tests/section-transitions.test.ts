import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  clientSectionRegistry,
  getVisibleClientSectionKeys,
  type ClientSectionKey,
  type SectionSurface,
} from "../src/client/client-section-registry";
import {
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionContract,
} from "../src/lib/event-website-section-contract";
import type { EventWebsiteRenderModel } from "../src/types/public-event";

const canonicalOrder = eventWebsiteSectionContract.map((entry) => entry.key);

function renderModel(
  disabled: ClientSectionKey[] = [],
): EventWebsiteRenderModel {
  return {
    assets: {},
    contractVersion: EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
    coupleDisplayName: "Synthetic Event",
    eventSlug: "synthetic-event",
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
    title: "Synthetic Event",
  };
}

test("WaveDivider and SectionTransition component files are completely removed from filesystem", () => {
  const waveDividerPath = path.join(
    process.cwd(),
    "src/client/components/WaveDivider.tsx",
  );
  const sectionTransitionPath = path.join(
    process.cwd(),
    "src/client/components/SectionTransition.tsx",
  );
  const sectionTransitionsHelperPath = path.join(
    process.cwd(),
    "src/client/section-transitions.ts",
  );

  assert.equal(
    fs.existsSync(waveDividerPath),
    false,
    "WaveDivider.tsx must not exist",
  );
  assert.equal(
    fs.existsSync(sectionTransitionPath),
    false,
    "SectionTransition.tsx must not exist",
  );
  assert.equal(
    fs.existsSync(sectionTransitionsHelperPath),
    false,
    "section-transitions.ts must not exist",
  );
});

test("client-section-registry contains no wave or transition fields or types", () => {
  for (const key of canonicalOrder) {
    const descriptor =
      clientSectionRegistry[key as keyof typeof clientSectionRegistry];
    assert.ok(descriptor, `Descriptor for ${key} must exist`);
    assert.ok(descriptor.surface, `Surface for ${key} must exist`);
    assert.equal(
      "preferredTransition" in descriptor,
      false,
      `preferredTransition must not exist on ${key}`,
    );
    assert.equal(
      "acceptedEntryTransitions" in descriptor,
      false,
      `acceptedEntryTransitions must not exist on ${key}`,
    );
    assert.equal(
      "entryBackground" in descriptor,
      false,
      `entryBackground must not exist on ${key}`,
    );
    assert.equal(
      "exitBackground" in descriptor,
      false,
      `exitBackground must not exist on ${key}`,
    );
  }
});

test("ClientEventRenderer contains no SectionTransition or wave divider imports or rendering", () => {
  const rendererPath = path.join(
    process.cwd(),
    "src/client/renderer/ClientEventRenderer.tsx",
  );
  const content = fs.readFileSync(rendererPath, "utf-8");

  assert.equal(
    content.includes("SectionTransition"),
    false,
    "ClientEventRenderer must not import or render SectionTransition",
  );
  assert.equal(
    content.includes("WaveDivider"),
    false,
    "ClientEventRenderer must not import or render WaveDivider",
  );
});

test("client-theme.css contains no wave height or section transition aliases", () => {
  const cssPath = path.join(
    process.cwd(),
    "src/client/styles/client-theme.css",
  );
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  assert.equal(
    cssContent.includes("--section-bg-ivory"),
    false,
    "--section-bg-ivory alias must be removed",
  );
  assert.equal(
    cssContent.includes("--section-bg-seafoam"),
    false,
    "--section-bg-seafoam alias must be removed",
  );
  assert.equal(
    cssContent.includes("--section-bg-coral"),
    false,
    "--section-bg-coral alias must be removed",
  );
  assert.equal(
    cssContent.includes("--section-bg-gallery-peach"),
    false,
    "--section-bg-gallery-peach alias must be removed",
  );
});

test("section ordering and visibility remain intact without transition wrappers", () => {
  const visible = getVisibleClientSectionKeys(renderModel());
  assert.deepEqual(visible, canonicalOrder);
});

const ALLOWED_SURFACES: Set<SectionSurface> = new Set([
  "photo",
  "light",
  "warm",
  "olive",
  "dark",
]);

const APPROVED_SURFACE_SEQUENCE: Record<ClientSectionKey, SectionSurface> = {
  host_info: "dark",
  countdown: "warm",
  music_effects: "olive",
  gallery: "warm",
  main_event: "light",
  venue: "warm",
  secondary_event: "light",
  timeline_program: "olive",
  entourage: "light",
  principal_sponsors: "warm",
  attire_motif: "light",
  extra_info: "warm",
  rsvp_form: "dark",
  gift_details: "light",
  guestbook: "warm",
  story_message: "light",
  contact_socials: "dark",
};

test("registry surfaces use only valid semantic surface roles", () => {
  for (const key of canonicalOrder) {
    const surface = clientSectionRegistry[key as ClientSectionKey].surface;
    assert.ok(
      ALLOWED_SURFACES.has(surface),
      `Section ${key} surface "${surface}" is not a valid semantic surface role`,
    );
  }
});

test("registry surfaces match the approved hybrid surface sequence exactly", () => {
  for (const key of canonicalOrder) {
    const expected = APPROVED_SURFACE_SEQUENCE[key as ClientSectionKey];
    const actual = clientSectionRegistry[key as ClientSectionKey].surface;
    assert.equal(
      actual,
      expected,
      `Section ${key} surface must be "${expected}", got "${actual}"`,
    );
  }
});

test("Ceremony, Venue, and Reception no longer form a three-section same-surface run", () => {
  const ceremonySurface = clientSectionRegistry.main_event.surface;
  const venueSurface = clientSectionRegistry.venue.surface;
  const receptionSurface = clientSectionRegistry.secondary_event.surface;

  const isTripleSame =
    ceremonySurface === venueSurface && venueSurface === receptionSurface;
  assert.equal(
    isTripleSame,
    false,
    "Ceremony, Venue, and Reception must not all share the same surface role",
  );
});

test("Entourage, Sponsors, and Attire no longer form a three-section same-surface run", () => {
  const entourageSurface = clientSectionRegistry.entourage.surface;
  const sponsorsSurface = clientSectionRegistry.principal_sponsors.surface;
  const attireSurface = clientSectionRegistry.attire_motif.surface;

  const isTripleSame =
    entourageSurface === sponsorsSurface && sponsorsSurface === attireSurface;
  assert.equal(
    isTripleSame,
    false,
    "Entourage, Sponsors, and Attire must not all share the same surface role",
  );
});

test("section components do not hardcode manual surface role literals", () => {
  const sectionsDir = path.join(process.cwd(), "src/client/sections");
  const files = fs.readdirSync(sectionsDir).filter((f) => f.endsWith(".tsx"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(sectionsDir, file), "utf-8");
    const matches = content.match(
      /data-tone=["'](light|warm|olive|dark|photo)["']/g,
    );
    assert.equal(
      matches,
      null,
      `File ${file} must not hardcode data-tone literal, found: ${matches?.join(", ")}`,
    );
  }
});

test("ClientEventRenderer applies surface prop centrally from registry", () => {
  const rendererPath = path.join(
    process.cwd(),
    "src/client/renderer/ClientEventRenderer.tsx",
  );
  const content = fs.readFileSync(rendererPath, "utf-8");

  assert.ok(
    content.includes("clientSectionRegistry[key].surface"),
    "ClientEventRenderer must read surface from clientSectionRegistry[key].surface",
  );
  assert.ok(
    content.includes("surface={surface}"),
    "ClientEventRenderer must pass surface={surface} to section components",
  );
});

test("ClientFooter uses centralized dark surface CSS variable", () => {
  const footerPath = path.join(
    process.cwd(),
    "src/client/components/ClientFooter.tsx",
  );
  const content = fs.readFileSync(footerPath, "utf-8");

  assert.ok(
    content.includes("var(--wedding-surface-dark)"),
    "ClientFooter must use var(--wedding-surface-dark)",
  );
});

test("client-theme.css defines rules for all 5 semantic surface roles", () => {
  const cssPath = path.join(
    process.cwd(),
    "src/client/styles/client-theme.css",
  );
  const content = fs.readFileSync(cssPath, "utf-8");

  assert.ok(
    content.includes('data-tone="photo"'),
    "CSS must define rule for data-tone=photo",
  );
  assert.ok(
    content.includes('data-tone="light"'),
    "CSS must define rule for data-tone=light",
  );
  assert.ok(
    content.includes('data-tone="warm"'),
    "CSS must define rule for data-tone=warm",
  );
  assert.ok(
    content.includes('data-tone="olive"'),
    "CSS must define rule for data-tone=olive",
  );
  assert.ok(
    content.includes('data-tone="dark"'),
    "CSS must define rule for data-tone=dark",
  );
});
