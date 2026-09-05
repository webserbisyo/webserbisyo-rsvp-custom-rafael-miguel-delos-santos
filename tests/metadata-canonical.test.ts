import test from "node:test";
import assert from "node:assert/strict";
import { safePublicCanonicalUrl } from "../src/lib/metadata.js";

test("safePublicCanonicalUrl returns valid production HTTPS canonical URL for custom domains", () => {
  assert.equal(
    safePublicCanonicalUrl("https://princessanneandquilang.com"),
    "https://princessanneandquilang.com/",
  );
});

test("safePublicCanonicalUrl returns undefined for localhost, 127.0.0.1, Vercel, platform domains, and LAN IP dev origins", () => {
  assert.equal(safePublicCanonicalUrl("http://localhost:3000"), undefined);
  assert.equal(safePublicCanonicalUrl("http://127.0.0.1:3000"), undefined);
  assert.equal(safePublicCanonicalUrl("https://my-app.vercel.app"), undefined);
  assert.equal(safePublicCanonicalUrl("http://192.168.68.111:3000"), undefined);
  assert.equal(safePublicCanonicalUrl("http://10.0.0.15:3000"), undefined);
  assert.equal(safePublicCanonicalUrl("https://rafael-and-isabella.rsvp.webserbisyo.com"), undefined);
  assert.equal(safePublicCanonicalUrl("https://rsvp.webserbisyo.com"), undefined);
  assert.equal(safePublicCanonicalUrl("https://webserbisyo.com"), undefined);
});
