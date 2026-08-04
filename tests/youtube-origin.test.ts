import test from "node:test";
import assert from "node:assert/strict";
import { getSafeYoutubeOrigin } from "../src/client/components/audio-context.js";

test("getSafeYoutubeOrigin returns HTTPS origin for production domain", () => {
  assert.equal(
    getSafeYoutubeOrigin("https://rsvp.webserbisyo.com"),
    "https://rsvp.webserbisyo.com"
  );
});

test("getSafeYoutubeOrigin returns HTTPS origin for Vercel preview domain", () => {
  assert.equal(
    getSafeYoutubeOrigin("https://example.vercel.app"),
    "https://example.vercel.app"
  );
});

test("getSafeYoutubeOrigin returns HTTP origin for localhost", () => {
  assert.equal(
    getSafeYoutubeOrigin("http://localhost:3000"),
    "http://localhost:3000"
  );
});

test("getSafeYoutubeOrigin returns HTTP origin for 127.0.0.1", () => {
  assert.equal(
    getSafeYoutubeOrigin("http://127.0.0.1:3000"),
    "http://127.0.0.1:3000"
  );
});

test("getSafeYoutubeOrigin omits origin for plain-HTTP LAN IP", () => {
  assert.equal(
    getSafeYoutubeOrigin("http://192.168.68.111:3000"),
    null
  );
});

test("getSafeYoutubeOrigin handles null, undefined, empty, or malformed origins safely", () => {
  assert.equal(getSafeYoutubeOrigin(null), null);
  assert.equal(getSafeYoutubeOrigin(undefined), null);
  assert.equal(getSafeYoutubeOrigin(""), null);
  assert.equal(getSafeYoutubeOrigin("not-a-valid-url"), null);
});
