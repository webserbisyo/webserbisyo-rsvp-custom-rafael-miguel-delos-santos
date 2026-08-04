import test from "node:test";
import assert from "node:assert/strict";
// @ts-expect-error - JavaScript ESM guard script import without declaration file
import { isForbiddenRsvpIframe } from "../scripts/guard-neutral-starter.mjs";

test("isForbiddenRsvpIframe allows Google Maps iframe in VenueSection", () => {
  const googleMapsIframe = `<iframe src="https://maps.google.com/maps?q=Alfonso+Cavite&output=embed" width="100%" height="100%"></iframe>`;
  assert.equal(isForbiddenRsvpIframe(googleMapsIframe), false);
});

test("isForbiddenRsvpIframe allows YouTube ambient audio iframe", () => {
  const youtubeIframe = `<iframe src="https://www.youtube.com/embed/abc12345678?enablejsapi=1"></iframe>`;
  assert.equal(isForbiddenRsvpIframe(youtubeIframe), false);
});

test("isForbiddenRsvpIframe rejects legacy platform RSVP iframe routes", () => {
  const rsvpIframe1 = `<iframe src="https://webserbisyo.com/r/my-wedding/rsvp/embed"></iframe>`;
  const rsvpIframe2 = `<iframe src="/rsvp/embed"></iframe>`;
  const rsvpIframe3 = `const path = "/r/[slug]/rsvp/embed";`;
  assert.equal(isForbiddenRsvpIframe(rsvpIframe1), true);
  assert.equal(isForbiddenRsvpIframe(rsvpIframe2), true);
  assert.equal(isForbiddenRsvpIframe(rsvpIframe3), true);
});
