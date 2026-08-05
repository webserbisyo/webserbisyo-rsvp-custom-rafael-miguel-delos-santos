import assert from "node:assert/strict";
import test from "node:test";
import { getVisibleClientSectionKeys } from "../src/client/client-section-registry";
import {
  EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
  eventWebsiteSectionContract,
  validatePublicEventContract,
} from "../src/lib/event-website-section-contract";
import { fetchPublicEvent } from "../src/lib/public-event-api";
import type {
  EventWebsiteRenderModel,
  PublicEventDto,
} from "../src/types/public-event";

const apiBaseUrl = "https://platform.example.test";
const eventSlug = "synthetic-event";

function apiEvent(overrides: Partial<PublicEventDto> = {}): PublicEventDto {
  return {
    contractVersion: EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
    eventSlug,
    publishedRevision: 2,
    savedRevision: 3,
    sections: eventWebsiteSectionContract.map((section) => ({
      enabled: true,
      key: section.key,
    })),
    title: "Synthetic Event",
    ...overrides,
  };
}

function renderModel(
  sections: EventWebsiteRenderModel["sections"],
  source: EventWebsiteRenderModel["source"] = "live",
): EventWebsiteRenderModel {
  return {
    assets: {},
    contractVersion: EVENT_WEBSITE_SECTION_CONTRACT_VERSION,
    coupleDisplayName: "Synthetic Event",
    eventSlug,
    guestbookMessages: [],
    publishedRevision: 2,
    raw: apiEvent(),
    savedRevision: 3,
    sections,
    source,
    title: "Synthetic Event",
  };
}

test("the section contract has one unique canonical key set", () => {
  const keys = eventWebsiteSectionContract.map((section) => section.key);
  assert.equal(keys.length, 17);
  assert.equal(new Set(keys).size, keys.length);
  assert.equal(
    validatePublicEventContract(apiEvent() as Record<string, unknown>),
    true,
  );
  assert.equal(
    validatePublicEventContract({
      contractVersion: 1,
      sections: ["guestbook", "guestbook"],
    }),
    false,
  );
  assert.equal(
    validatePublicEventContract({
      contractVersion: 1,
      sections: ["unknown_section"],
    }),
    false,
  );
});

test("one visible registry excludes disabled optional sections and keeps required sections", () => {
  const visible = getVisibleClientSectionKeys(
    renderModel([
      { content: {}, enabled: false, key: "guestbook" },
      { content: {}, enabled: false, key: "host_info" },
      { content: {}, enabled: true, key: "venue" },
    ]),
  );

  assert.equal(visible.includes("guestbook"), false);
  assert.equal(visible.includes("host_info"), true);
  assert.equal(visible.includes("main_event"), true);
  assert.equal(visible.includes("venue"), true);
  assert.equal(visible.includes("rsvp_form"), true);
});

test("Gallery visibility follows its public enabled state", () => {
  const gallery = [{ content: {}, enabled: true, key: "gallery" }];
  assert.equal(
    getVisibleClientSectionKeys(renderModel(gallery)).includes("gallery"),
    true,
  );
  assert.equal(
    getVisibleClientSectionKeys(
      renderModel([{ content: {}, enabled: false, key: "gallery" }]),
    ).includes("gallery"),
    false,
  );
});

test("published mode uses only the published API", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  let authorization: string | null = null;
  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    authorization = new Headers(init?.headers).get("authorization");
    return Response.json({ data: apiEvent() });
  };

  try {
    const result = await fetchPublicEvent({ apiBaseUrl, eventSlug });
    assert.equal(result.status, "available");
    assert.equal(requestedUrl, `${apiBaseUrl}/api/public/events/${eventSlug}`);
    assert.equal(authorization, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("dashboard preview uses the secured draft API and requested revision", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  let authorization: string | null = null;
  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    authorization = new Headers(init?.headers).get("authorization");
    return Response.json({ data: apiEvent() });
  };

  try {
    const result = await fetchPublicEvent({
      apiBaseUrl,
      eventSlug,
      previewMode: "dashboard",
      previewToken: "synthetic-preview-token",
      revision: 3,
    });
    assert.equal(result.status, "available");
    assert.equal(
      requestedUrl,
      `${apiBaseUrl}/api/dashboard/event/preview/${eventSlug}?revision=3`,
    );
    assert.equal(authorization, "Bearer synthetic-preview-token");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("live API failure never substitutes design fixture data", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("unavailable", { status: 503 });

  try {
    const result = await fetchPublicEvent({ apiBaseUrl, eventSlug });
    assert.equal(result.status, "unavailable");
    assert.equal("event" in result, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

import { parseMusicMeta } from "../src/client/utils/music-meta";
import { buildClientViewModel } from "../src/client/types/build-client-view-model";

test("parseMusicMeta removes Wedding Ambience fallback when artist is omitted", () => {
  assert.deepEqual(parseMusicMeta("Golden Hour - JVKE"), {
    displayTitle: "Golden Hour",
    displayArtist: "JVKE",
  });
  assert.deepEqual(parseMusicMeta("Golden Hour by JVKE"), {
    displayTitle: "Golden Hour",
    displayArtist: "JVKE",
  });
  assert.deepEqual(parseMusicMeta("Perfect"), {
    displayTitle: "Perfect",
    displayArtist: "",
  });
  assert.deepEqual(parseMusicMeta(undefined), {
    displayTitle: "Our Wedding Song",
    displayArtist: "",
  });
});

test("buildClientViewModel extracts dynamic attire palette and falls back safely", () => {
  const vm = buildClientViewModel(renderModel([
    {
      enabled: true,
      key: "attire",
      content: {
        title: "Dress Code",
        palette: [
          { name: "Gold", hex: "#D8B76F" },
          { name: "Olive", hex: "#4F5A46" },
        ],
      },
    },
  ]));

  assert.equal(vm.attireDressCode.palette?.length, 2);
  assert.deepEqual(vm.attireDressCode.palette?.[0], { name: "Gold", hex: "#D8B76F" });
});
