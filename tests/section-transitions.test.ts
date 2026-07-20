import assert from "node:assert/strict";
import test from "node:test";
import {
  clientSectionRegistry,
  getVisibleClientSectionKeys,
  type ClientSectionKey,
} from "../src/client/client-section-registry";
import {
  getVisibleSectionTransitions,
  resolveSectionTransition,
} from "../src/client/section-transitions";
import {
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionContract,
} from "../src/lib/event-website-section-contract";
import type { EventWebsiteRenderModel } from "../src/types/public-event";

const canonicalOrder = eventWebsiteSectionContract.map((entry) => entry.key);
const optionalKeys = eventWebsiteSectionContract
  .filter((entry) => entry.visibility === "optional")
  .map((entry) => entry.key);

function renderModel(disabled: ClientSectionKey[] = []): EventWebsiteRenderModel {
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

test("every canonical section has one visual theme in the shared registry", () => {
  for (const key of canonicalOrder) {
    assert.equal(clientSectionRegistry[key].key, key);
    assert.ok(clientSectionRegistry[key].visual.background);
  }
});

test("visible pairs preserve canonical keys and always total N minus one", () => {
  const visible = getVisibleClientSectionKeys(renderModel());
  const transitions = getVisibleSectionTransitions(visible);

  assert.deepEqual(visible, canonicalOrder);
  assert.equal(transitions.length, visible.length - 1);
  transitions.forEach((transition, index) => {
    assert.equal(transition.from, visible[index]);
    assert.equal(transition.to, visible[index + 1]);
  });
});

test("each disabled optional section is excluded before neighbor resolution", () => {
  for (const key of optionalKeys) {
    const visible = getVisibleClientSectionKeys(renderModel([key]));
    const transitions = getVisibleSectionTransitions(visible);

    assert.equal(visible.includes(key), false, key);
    assert.equal(transitions.length, visible.length - 1, key);
    assert.equal(
      transitions.some((transition) => transition.from === key || transition.to === key),
      false,
      key,
    );
  }
});

test("adjacent and consecutive disabled sections produce only real visible pairs", () => {
  for (const disabled of [
    ["secondary_event", "timeline_program"],
    ["entourage", "principal_sponsors", "attire_motif"],
    optionalKeys,
  ] as ClientSectionKey[][]) {
    const visible = getVisibleClientSectionKeys(renderModel(disabled));
    const transitions = getVisibleSectionTransitions(visible);

    assert.equal(transitions.length, visible.length - 1);
    assert.equal(
      transitions.some((transition) =>
        disabled.includes(transition.from) || disabled.includes(transition.to),
      ),
      false,
    );
  }
});

test("section-owned preferences survive optional neighbor changes", () => {
  const withoutMusic = getVisibleClientSectionKeys(renderModel(["music_effects"]));
  assert.deepEqual(
    getVisibleSectionTransitions(withoutMusic).find(
      (transition) => transition.from === "countdown",
    ),
    {
      from: "countdown",
      fromBackground: "cream",
      to: "gallery",
      toBackground: "gallery-peach",
      variant: "gradient",
    },
  );

  const restored = getVisibleClientSectionKeys(renderModel());
  assert.equal(restored[2], "music_effects");
});

test("preferred transitions belong to the section, not a specific pair", () => {
  assert.deepEqual(resolveSectionTransition("countdown", "music_effects"), {
    from: "countdown",
    fromBackground: "cream",
    to: "music_effects",
    toBackground: "seafoam-light",
    variant: "gradient",
  });
  assert.deepEqual(resolveSectionTransition("venue", "secondary_event"), {
    from: "venue",
    fromBackground: "cream",
    to: "secondary_event",
    toBackground: "ivory",
    variant: "bouquet",
  });
  assert.equal(resolveSectionTransition("countdown", "main_event").variant, "gradient");
  assert.equal(resolveSectionTransition("venue", "timeline_program").variant, "bouquet");
  assert.equal(resolveSectionTransition("host_info", "main_event").variant, "wave");
});

test("gradient edges and generic waves resolve exact canonical colors", () => {
  const expectations = [
    ["music_effects", "main_event", "seafoam", "ivory", "wave"],
    ["host_info", "music_effects", "ivory", "seafoam-light", "wave"],
    ["host_info", "main_event", "ivory", "ivory", "wave"],
    ["extra_info", "rsvp_form", "cream", "coral", "wave"],
    ["rsvp_form", "guestbook", "coral-deep", "cream", "wave"],
    ["guestbook", "contact_socials", "cream", "cocoa", "wave"],
  ] as const;

  for (const [from, to, fromBackground, toBackground, variant] of expectations) {
    const transition = resolveSectionTransition(from, to);
    assert.equal(transition.fromBackground, fromBackground);
    assert.equal(transition.toBackground, toBackground);
    assert.equal(transition.variant, variant);
  }
});

test("same-background neighbors never introduce a third color", () => {
  for (const [from, to] of [
    ["timeline_program", "principal_sponsors"],
    ["gift_details", "story_message"],
  ] as const) {
    const transition = resolveSectionTransition(from, to);
    assert.equal(transition.fromBackground, transition.toBackground);
    assert.equal(transition.variant, "none");
  }
});

test("Gallery participates in exactly one transition on each visible edge", () => {
  const visible = getVisibleClientSectionKeys(renderModel());
  assert.equal(visible.indexOf("gallery"), visible.indexOf("music_effects") + 1);

  const transitions = getVisibleSectionTransitions(visible);
  assert.equal(
    transitions.filter((transition) => transition.to === "gallery").length,
    1,
  );
  assert.equal(
    transitions.filter((transition) => transition.from === "gallery").length,
    1,
  );

  const withoutGallery = getVisibleClientSectionKeys(renderModel(["gallery"]));
  assert.equal(withoutGallery.includes("gallery"), false);
  assert.equal(
    getVisibleSectionTransitions(withoutGallery).some(
      (transition) => transition.from === "gallery" || transition.to === "gallery",
    ),
    false,
  );
});
