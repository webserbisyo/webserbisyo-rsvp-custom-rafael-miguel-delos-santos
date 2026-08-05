import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { weddingButtonVariants } from "../src/client/components/ui/WeddingButton.js";

test("weddingButtonVariants composes primary variant and md size by default", () => {
  const result = weddingButtonVariants();
  assert.ok(result.includes("wedding-button"));
  assert.ok(result.includes("wedding-button--primary"));
  assert.ok(result.includes("wedding-button--md"));
});

test("weddingButtonVariants composes secondary variant and lg size", () => {
  const result = weddingButtonVariants({ variant: "secondary", size: "lg" });
  assert.ok(result.includes("wedding-button"));
  assert.ok(result.includes("wedding-button--secondary"));
  assert.ok(result.includes("wedding-button--lg"));
});

test("weddingButtonVariants composes ghost variant and sm size", () => {
  const result = weddingButtonVariants({ variant: "ghost", size: "sm" });
  assert.ok(result.includes("wedding-button"));
  assert.ok(result.includes("wedding-button--ghost"));
  assert.ok(result.includes("wedding-button--sm"));
});

test("weddingButtonVariants incorporates custom className", () => {
  const result = weddingButtonVariants({ variant: "primary", size: "md", className: "custom-class" });
  assert.ok(result.includes("custom-class"));
});

test("client-theme.css contains all required semantic button and choice CSS rules", () => {
  const cssPath = path.join(process.cwd(), "src/client/styles/client-theme.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  const requiredSelectors = [
    ".wedding-button",
    ".wedding-button--primary",
    ".wedding-button--secondary",
    ".wedding-button--ghost",
    ".wedding-button--sm",
    ".wedding-button--md",
    ".wedding-button--lg",
    ".wedding-button--icon",
    ".wedding-choice",
    'data-selected="true"',
  ];

  for (const selector of requiredSelectors) {
    assert.ok(
      cssContent.includes(selector),
      `Expected client-theme.css to contain selector: ${selector}`
    );
  }
});

test("RsvpCtaSection references bird assets and omits ocean/floral replacements", () => {
  const rsvpCtaPath = path.join(process.cwd(), "src/client/sections/RsvpCtaSection.tsx");
  const sectionContent = fs.readFileSync(rsvpCtaPath, "utf-8");

  assert.ok(sectionContent.includes("7.webp"), "RsvpCtaSection must include left bird asset (7.webp)");
  assert.ok(sectionContent.includes("8.webp"), "RsvpCtaSection must include right bird asset (8.webp)");

  assert.ok(!sectionContent.includes("6.webp"), "RsvpCtaSection must not include ocean background (6.webp)");
  assert.ok(!sectionContent.includes("16.webp"), "RsvpCtaSection must not include floral corner asset (16.webp)");
  assert.ok(!sectionContent.includes("17.webp"), "RsvpCtaSection must not include floral corner asset (17.webp)");
});
