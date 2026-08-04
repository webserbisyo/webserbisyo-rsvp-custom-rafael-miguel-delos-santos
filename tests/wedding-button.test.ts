import test from "node:test";
import assert from "node:assert/strict";
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
