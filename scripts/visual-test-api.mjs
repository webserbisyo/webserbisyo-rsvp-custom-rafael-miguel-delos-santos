import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const sampleEvent = JSON.parse(
  await readFile(new URL("../src/data/sample-event.json", import.meta.url), "utf8"),
);

const optionalSections = [
  "countdown",
  "music_effects",
  "secondary_event",
  "timeline_program",
  "entourage",
  "principal_sponsors",
  "attire_motif",
  "extra_info",
  "gift_details",
  "guestbook",
  "story_message",
  "contact_socials",
];

const disabledByScenario = {
  "all-optional-disabled": optionalSections,
  "all-sections": [],
  "countdown-and-music-disabled": ["countdown", "music_effects"],
  "countdown-disabled": ["countdown"],
  "music-disabled": ["music_effects"],
  "music-reenabled": [],
  "reception-and-timeline-disabled": ["secondary_event", "timeline_program"],
  "reception-disabled": ["secondary_event"],
  "story-disabled": ["story_message"],
  "three-consecutive-disabled": [
    "entourage",
    "principal_sponsors",
    "attire_motif",
  ],
};

function buildEvent(scenario) {
  const event = structuredClone(sampleEvent);
  const disabled = new Set(disabledByScenario[scenario] ?? []);

  event.eventSlug = scenario;
  event.savedRevision = 1;
  event.publishedRevision = 1;
  event.renderModel = {
    musicEffects: {
      musicLink: "https://www.youtube.com/watch?v=visual-test",
      musicTitle: "Visual Test Song - Visual Test Artist",
      shortNote: "Deterministic transition fixture",
    },
  };
  event.content.layout.enabledSections = Object.fromEntries(
    Object.keys(event.content.layout.enabledSections).map((key) => [key, !disabled.has(key)]),
  );

  return event;
}

createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1:4174");

  if (url.pathname === "/health") {
    response.writeHead(200, { "content-type": "text/plain" });
    response.end("ok");
    return;
  }

  const match = url.pathname.match(/^\/api\/public\/events\/([^/]+)$/);
  if (!match) {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": "application/json",
  });
  response.end(JSON.stringify({ data: buildEvent(decodeURIComponent(match[1])) }));
}).listen(4174, "127.0.0.1");
