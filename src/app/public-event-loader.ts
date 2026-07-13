import { cache } from "react";
import { getPublicEnv } from "@/lib/env";
import { fetchPublicEvent } from "@/lib/public-event-api";
import { getDesignEvent } from "@/lib/placeholders";
import { getPreviewContext, type PreviewQuery } from "@/lib/preview-context";

const loadPublicEventForRequest = cache(
  async (
    apiBaseUrl: string | null,
    eventSlug: string,
    accessToken: string | undefined,
    previewMode: "dashboard" | undefined,
    previewToken: string | undefined,
    revision: number | undefined,
    designMode: boolean,
  ) => {
    const resolvedApiBaseUrl = apiBaseUrl || "https://webserbisyo.com";

    if (designMode) {
      return {
        status: "available" as const,
        event: await getDesignEvent(resolvedApiBaseUrl, eventSlug, previewMode),
      };
    }

    return fetchPublicEvent({
      accessToken,
      apiBaseUrl: resolvedApiBaseUrl,
      eventSlug,
      previewMode,
      previewToken,
      revision,
    });
  },
);

export async function loadPublicEvent(searchParams?: PreviewQuery) {
  const env = getPublicEnv();
  const preview = getPreviewContext(env, searchParams);

  return loadPublicEventForRequest(
    env.apiBaseUrl,
    preview.eventSlug,
    preview.accessToken,
    preview.previewMode,
    preview.previewToken,
    preview.revision,
    env.designMode,
  );
}
