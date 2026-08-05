import test from "node:test";
import assert from "node:assert";
import { deriveCoupleBranding } from "../src/client/utils/derive-couple-branding";

test("deriveCoupleBranding: derives initials when separate partner names exist", () => {
  const result = deriveCoupleBranding({
    partnerOneName: "John",
    partnerTwoName: "Dianne",
    displayAs: "John & Dianne",
    weddingDate: "2027-04-18",
  });

  assert.deepStrictEqual(result.monogram, ["J", "D"]);
  assert.strictEqual(result.coupleLabel, "John & Dianne");
  assert.strictEqual(result.copyrightYear, "2027");
});

test("deriveCoupleBranding: parses displayAs when separate partner names are missing", () => {
  const result = deriveCoupleBranding({
    displayAs: "Rafael & Isabella",
    weddingDate: "2026-12-31",
  });

  assert.deepStrictEqual(result.monogram, ["R", "I"]);
  assert.strictEqual(result.coupleLabel, "Rafael & Isabella");
  assert.strictEqual(result.copyrightYear, "2026");
});

test("deriveCoupleBranding: handles titles and multi-word names", () => {
  const result = deriveCoupleBranding({
    partnerOneName: "Dr. John Paul",
    partnerTwoName: "Dianne Marie",
  });

  assert.deepStrictEqual(result.monogram, ["J", "D"]);
  assert.strictEqual(result.coupleLabel, "Dr. John Paul & Dianne Marie");
});

test("deriveCoupleBranding: handles displayAs delimiters like and, +, /", () => {
  const r1 = deriveCoupleBranding({ displayAs: "Romeo and Juliet" });
  assert.deepStrictEqual(r1.monogram, ["R", "J"]);

  const r2 = deriveCoupleBranding({ displayAs: "Alex + Sam" });
  assert.deepStrictEqual(r2.monogram, ["A", "S"]);

  const r3 = deriveCoupleBranding({ displayAs: "Chris / Taylor" });
  assert.deepStrictEqual(r3.monogram, ["C", "T"]);
});

test("deriveCoupleBranding: returns null monogram for missing or single names", () => {
  const result = deriveCoupleBranding({
    displayAs: "Single Name Only",
  });

  assert.strictEqual(result.monogram, null);
  assert.strictEqual(result.coupleLabel, "Single Name Only");
});

test("deriveCoupleBranding: extracts 4-digit year from ISO date strings", () => {
  const result = deriveCoupleBranding({
    weddingDate: "2028-09-15T00:00:00.000Z",
  });
  assert.strictEqual(result.copyrightYear, "2028");
});
