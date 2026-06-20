import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sampleEvent from "@/data/sample-event.json";
import { normalizePublicEvent } from "@/lib/normalize-public-event";
import type { EventWebsiteRenderModel, PublicEventApiResponse, PublicEventDto } from "@/types/public-event";

function isSnapshotResponse(value: unknown): value is PublicEventApiResponse {
  return Boolean(
    value &&
      typeof value === "object" &&
      "data" in value &&
      (value as { data?: unknown }).data &&
      typeof (value as { data?: unknown }).data === "object" &&
      !Array.isArray((value as { data?: unknown }).data)
  );
}

export function getSampleEvent(_apiBaseUrl: string, eventSlug: string, previewMode?: "dashboard"): EventWebsiteRenderModel {
  return normalizePublicEvent({
    event: sampleEvent as PublicEventDto,
    source: "design",
    previewMode,
    eventSlug: eventSlug || "sample-wedding"
  });
}

export async function getDesignEvent(_apiBaseUrl: string, eventSlug: string, previewMode?: "dashboard"): Promise<EventWebsiteRenderModel> {
  const snapshotPath = join(process.cwd(), ".webserbisyo", "event.snapshot.json");

  try {
    const snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as unknown;
    if (isSnapshotResponse(snapshot)) {
      return normalizePublicEvent({
        event: snapshot.data,
        source: "snapshot",
        previewMode,
        eventSlug: eventSlug || snapshot.data.slug || snapshot.data.eventSlug || "snapshot-wedding"
      });
    }
  } catch {
    // Snapshot mode is optional and local-only. Missing or malformed snapshots fall back to sample data.
  }

  return getSampleEvent(_apiBaseUrl, eventSlug, previewMode);
}
