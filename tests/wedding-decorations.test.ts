import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { clientConfig, DIANNE_COMPONENT_FLORAL_DECORATIONS } from "../src/client/client.config";
import { getAlternatingDecorationOrientation } from "../src/client/components/decorations/get-decoration-placement";

const rootDir = process.cwd();

test("contract: four semantic WebP decoration assets exist in public/images/decoration/dianne/", () => {
  const assets = [
    "frame-corner-sprig-left.webp",
    "frame-corner-sprig-right.webp",
    "card-edge-flourish-left.webp",
    "card-edge-flourish-right.webp",
  ];

  for (const asset of assets) {
    const fullPath = path.join(rootDir, "public/images/decoration/dianne", asset);
    assert.ok(
      fs.existsSync(fullPath),
      `Expected destination asset to exist: ${asset}`
    );
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Expected non-zero size for ${asset}`);
  }
});

test("contract: asset paths in client configuration use lowercase kebab-case without raw numbered names", () => {
  const config = clientConfig.componentFlorals || DIANNE_COMPONENT_FLORAL_DECORATIONS;
  assert.ok(config, "Expected componentFlorals configuration to exist");

  const paths = [
    config.frameCorner.left.src,
    config.frameCorner.right.src,
    config.cardEdge.left.src,
    config.cardEdge.right.src,
  ];

  for (const srcPath of paths) {
    assert.match(
      srcPath,
      /^\/images\/decoration\/dianne\/[a-z0-9-]+\.webp$/,
      `Path must be lowercase kebab-case: ${srcPath}`
    );
    assert.ok(
      !srcPath.match(/\b(1|2|3|4)\.webp$/),
      `Raw numbered filename must not appear in production path: ${srcPath}`
    );
  }
});

test("contract: decoration assets configure 1254x1254 intrinsic dimensions", () => {
  const config = clientConfig.componentFlorals || DIANNE_COMPONENT_FLORAL_DECORATIONS;
  const items = [
    config.frameCorner.left,
    config.frameCorner.right,
    config.cardEdge.left,
    config.cardEdge.right,
  ];

  for (const item of items) {
    assert.equal(item.width, 1254);
    assert.equal(item.height, 1254);
  }
});

test("contract: getAlternatingDecorationOrientation provides deterministic orientation", () => {
  assert.equal(getAlternatingDecorationOrientation(0), "left");
  assert.equal(getAlternatingDecorationOrientation(1), "right");
  assert.equal(getAlternatingDecorationOrientation(2), "left");
  assert.equal(getAlternatingDecorationOrientation(3), "right");
});

test("contract: WeddingDecoration component contains no hardcoded Dianne file paths", () => {
  const compPath = path.join(rootDir, "src/client/components/decorations/WeddingDecoration.tsx");
  assert.ok(fs.existsSync(compPath), "WeddingDecoration.tsx must exist");
  const code = fs.readFileSync(compPath, "utf8");

  assert.ok(
    !code.includes("/images/decoration/dianne/"),
    "WeddingDecoration.tsx must read paths from config, not hardcode Dianne asset paths"
  );
  assert.ok(code.includes('alt=""'), 'Must use alt="" for presentation images');
  assert.ok(code.includes('aria-hidden="true"'), 'Must use aria-hidden="true"');
  assert.ok(code.includes("wedding-decoration"), "Must use semantic .wedding-decoration class");
});

test("contract: shared primitives, Hero, Footer, RSVP, Dock and forbidden components remain undecorated", () => {
  const forbiddenFiles = [
    "src/client/components/SpotlightCard.tsx",
    "src/client/sections/HeroSection.tsx",
    "src/client/components/ClientFooter.tsx",
    "src/client/components/ClientNav.tsx",
    "src/client/components/FloatingGuestDock.tsx",
    "src/client/components/SitemapDrawer.tsx",
    "src/client/rsvp/ClientRsvpForm.tsx",
  ];

  for (const file of forbiddenFiles) {
    const fullPath = path.join(rootDir, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");
      assert.ok(
        !content.includes("WeddingDecoration"),
        `Forbidden file must not import WeddingDecoration: ${file}`
      );
    }
  }
});

test("contract: CountdownSection uses top-corner frame-corner decorations on outer overflow-visible wrappers", () => {
  const file = path.join(rootDir, "src/client/sections/CountdownSection.tsx");
  const content = fs.readFileSync(file, "utf8");

  assert.ok(content.includes('family="frame-corner"'), "Countdown must use frame-corner family");
  assert.ok(content.includes('placementMode="edge-overlap"'), "Countdown must use edge-overlap placementMode");
  assert.ok(!content.includes("bottom-edge-left"), "Countdown must not use bottom-edge decoration positions");
  assert.ok(!content.includes("bottom-edge-right"), "Countdown must not use bottom-edge decoration positions");
  assert.ok(content.includes("overflow-visible"), "Countdown card wrapper must use overflow-visible");
});

test("contract: client-theme.css defines 1.0 opacity baseline and edge overlap z-index 15", () => {
  const cssPath = path.join(rootDir, "src/client/styles/client-theme.css");
  const css = fs.readFileSync(cssPath, "utf8");

  assert.ok(css.includes("--wedding-decoration-opacity-light: 1;"), "Opacity light variable must be 1");
  assert.ok(css.includes("--wedding-decoration-opacity-warm: 1;"), "Opacity warm variable must be 1");
  assert.ok(css.includes("--wedding-decoration-opacity-olive: 1;"), "Opacity olive variable must be 1");
  assert.ok(css.includes("--wedding-decoration-opacity-dark: 1;"), "Opacity dark variable must be 1");

  assert.ok(css.includes("opacity: var(--wedding-decoration-opacity-light, 1);"), "Tone light fallback must be 1");
  assert.ok(css.includes("opacity: var(--wedding-decoration-opacity-warm, 1);"), "Tone warm fallback must be 1");
  assert.ok(css.includes("opacity: var(--wedding-decoration-opacity-olive, 1);"), "Tone olive fallback must be 1");
  assert.ok(css.includes("opacity: var(--wedding-decoration-opacity-dark, 1);"), "Tone dark fallback must be 1");

  assert.ok(css.includes("z-index: 15;"), "Edge-overlap mode must use z-index: 15");
});

test("contract: TimelineSection contains WeddingDecoration imports and side-aware top-left/top-right sprigs", () => {
  const file = path.join(rootDir, "src/client/sections/TimelineSection.tsx");
  const content = fs.readFileSync(file, "utf8");

  assert.ok(content.includes("WeddingDecoration"), "TimelineSection must import WeddingDecoration");
  assert.ok(content.includes('position="top-left"'), "TimelineSection must include top-left sprigs");
  assert.ok(content.includes('position="top-right"'), "TimelineSection must include top-right sprigs");
  assert.ok(content.includes("wedding-decoration--target-timeline"), "TimelineSection must use target class");
});

test("contract: GuestbookSection attaches decorations directly to message cards, not section grid", () => {
  const file = path.join(rootDir, "src/client/sections/GuestbookSection.tsx");
  const content = fs.readFileSync(file, "utf8");

  assert.ok(content.includes("visibleMessages.map"), "GuestbookSection must map over visibleMessages");
  assert.ok(content.includes("wedding-decoration--target-guestbook"), "GuestbookSection must use target class");

  // Ensure decorations are inside map loop before visibleMessages.map closing tag
  const mapIndex = content.indexOf("visibleMessages.map");
  const decorationIndex = content.indexOf("WeddingDecoration", mapIndex);
  assert.ok(decorationIndex > mapIndex, "WeddingDecoration must be rendered inside visibleMessages.map");
});

test("contract: Entourage, Sponsors, ExtraInfo, and Gifts cards contain WeddingDecoration with target classes", () => {
  const targetSections = [
    { file: "src/client/sections/EntourageSection.tsx", target: "wedding-decoration--target-entourage" },
    { file: "src/client/sections/SponsorsSection.tsx", target: "wedding-decoration--target-sponsors" },
    { file: "src/client/sections/ExtraInfoSection.tsx", target: "wedding-decoration--target-extra-info" },
    { file: "src/client/sections/GiftsSection.tsx", target: "wedding-decoration--target-gifts" },
  ];

  for (const { file, target } of targetSections) {
    const fullPath = path.join(rootDir, file);
    const content = fs.readFileSync(fullPath, "utf8");
    assert.ok(content.includes("WeddingDecoration"), `${file} must import WeddingDecoration`);
    assert.ok(content.includes(target), `${file} must use target class ${target}`);
  }
});

test("contract: client-theme.css keeps floral overlap ownership on the theme selector at every breakpoint", () => {
  const cssPath = path.join(rootDir, "src/client/styles/client-theme.css");
  const css = fs.readFileSync(cssPath, "utf8");

  const themeSelector = '[data-wedding-theme="refined-midnight-garden"]';
  assert.ok(
    css.includes(`${themeSelector} {\n  --background:`),
    "Desktop floral token must be owned by the theme selector"
  );
  assert.ok(
    css.includes("--wedding-decoration-edge-offset-overlap: -32px;"),
    "Desktop theme overlap must remain -32px"
  );
  assert.match(
    css,
    /@media \(max-width: 639px\) \{\s*\[data-wedding-theme="refined-midnight-garden"\] \{\s*--wedding-decoration-edge-offset-overlap: -12px;/,
    "Mobile overlap must override the token on the same theme-owned subtree"
  );
  assert.ok(
    !css.includes(":root {\n    --wedding-decoration-edge-offset-overlap:"),
    "Mobile overlap must not rely on a weaker :root override"
  );
});

test("contract: floral offset fix introduces no optical translation, viewport JS, or per-section geometry", () => {
  const cssPath = path.join(rootDir, "src/client/styles/client-theme.css");
  const css = fs.readFileSync(cssPath, "utf8");
  const overlapRules = css.slice(
    css.indexOf("/* Positional Anchor Classes — Edge Overlap Mode */"),
    css.indexOf("/* Tone Opacity Variations")
  );
  const componentDir = path.join(rootDir, "src/client/components/decorations");
  const sectionFiles = [
    "CountdownSection.tsx",
    "TimelineSection.tsx",
    "ReceptionSection.tsx",
    "AttireSection.tsx",
    "GiftsSection.tsx",
  ];

  assert.doesNotMatch(css, /--wedding-decoration-optical-(?:x|y)-(?:tl|tr|bl|br)/);
  assert.ok(!overlapRules.includes("transform:"), "Edge-overlap positioning must stay transform-neutral");
  assert.ok(
    !fs.readFileSync(path.join(componentDir, "WeddingDecoration.tsx"), "utf8").includes("window.innerWidth"),
    "WeddingDecoration must not use viewport JavaScript"
  );
  for (const sectionFile of sectionFiles) {
    const section = fs.readFileSync(path.join(rootDir, "src/client/sections", sectionFile), "utf8");
    assert.ok(!section.includes("wedding-decoration-edge-offset-overlap"), `${sectionFile} must not own a floral offset`);
  }
});

test("contract: GallerySection renders WeddingDecoration inside rotated white Polaroid card container", () => {
  const file = path.join(rootDir, "src/client/sections/GallerySection.tsx");
  const content = fs.readFileSync(file, "utf8");

  assert.ok(content.includes("overflow-visible z-10"), "Polaroid card container must use overflow-visible z-10");
  assert.ok(content.includes("transform: `rotate(${GALLERY_ROTATIONS"), "Polaroid card container must apply rotation transform");

  // Ensure WeddingDecoration is inside the rotated container div
  const rotateIndex = content.indexOf("GALLERY_ROTATIONS");
  const decIndex = content.indexOf("WeddingDecoration", rotateIndex);
  assert.ok(decIndex > rotateIndex, "WeddingDecoration must be placed inside rotated Polaroid card container");
});

test("contract: TimelineSection card background uses z-10 and mobile uses alternating top-right/bottom-left pattern", () => {
  const file = path.join(rootDir, "src/client/sections/TimelineSection.tsx");
  const content = fs.readFileSync(file, "utf8");

  assert.ok(content.includes("group/card z-10"), "glassCardClasses must use z-10 for card surface");
  assert.ok(content.includes('position={isEven ? "top-right" : "bottom-left"}'), "Mobile timeline must use alternating top-right/bottom-left placement");
});

test("contract: GuestbookSection contains desktop 3-column grid-aware decoration variants", () => {
  const file = path.join(rootDir, "src/client/sections/GuestbookSection.tsx");
  const content = fs.readFileSync(file, "utf8");

  assert.ok(content.includes("lg:hidden"), "Must contain mobile/tablet decoration variant");
  assert.ok(content.includes("hidden lg:block"), "Must contain desktop 3-column decoration variant");
  assert.ok(content.includes("desktopCol === 0 || desktopCol === 2"), "Desktop variant must decorate only outer grid edges");
});
