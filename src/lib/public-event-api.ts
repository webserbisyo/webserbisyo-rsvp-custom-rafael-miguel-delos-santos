import { normalizePublicEvent } from "@/lib/normalize-public-event";
import { appendPrivateAccessToken } from "@/lib/private-access";
import { joinDraftPreviewApiUrl, joinPublicApiUrl } from "@/lib/urls";
import { validatePublicEventContract } from "@/lib/event-website-section-contract";
import type {
  PublicEventApiError,
  PublicEventApiResponse,
  PublicEventResult,
} from "@/types/public-event";

type FetchInput = {
  accessToken?: string;
  apiBaseUrl: string;
  eventSlug: string;
  previewMode?: "dashboard";
  previewToken?: string;
  revision?: number;
};

function isApiResponse(value: unknown): value is PublicEventApiResponse {
  return Boolean(
    value &&
    typeof value === "object" &&
    "data" in value &&
    (value as { data?: unknown }).data &&
    typeof (value as { data?: unknown }).data === "object" &&
    !Array.isArray((value as { data?: unknown }).data),
  );
}

function isApiError(value: unknown): value is PublicEventApiError {
  return Boolean(value && typeof value === "object" && "error" in value);
}

function debugFetchIssue(
  message: string,
  details?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV !== "development") return;
  console.warn(`[webserbisyo-public-api] ${message}`, details ?? {});
}

export async function fetchPublicEvent({
  accessToken,
  apiBaseUrl,
  eventSlug,
  previewMode,
  previewToken,
  revision,
}: FetchInput): Promise<PublicEventResult> {
  if (!apiBaseUrl || !eventSlug) {
    return {
      status: "setup_error",
      message:
        "Missing NEXT_PUBLIC_WEBSERBISYO_API_URL or NEXT_PUBLIC_EVENT_SLUG.",
    };
  }

  if (previewMode === "dashboard" && !previewToken) {
    return {
      status: "unavailable",
      code: "preview_access_required",
      message: "Draft preview access is missing or expired.",
    };
  }

  try {
    const publicUrl =
      appendPrivateAccessToken(
        joinPublicApiUrl(apiBaseUrl, eventSlug),
        accessToken,
      ) ?? joinPublicApiUrl(apiBaseUrl, eventSlug);
    const draftPreviewUrl = new URL(
      joinDraftPreviewApiUrl(apiBaseUrl, eventSlug),
    );
    if (typeof revision === "number") {
      draftPreviewUrl.searchParams.set("revision", String(revision));
    }
    const requestUrl =
      previewMode === "dashboard" ? draftPreviewUrl.toString() : publicUrl;
    const response = await fetch(requestUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(previewMode === "dashboard"
          ? { Authorization: `Bearer ${previewToken}` }
          : {}),
      },
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const error = isApiError(payload) ? payload.error : undefined;
      return {
        status: "unavailable",
        code: error?.code,
        message: error?.message ?? "This event website is unavailable.",
      };
    }

    if (!isApiResponse(payload)) {
      debugFetchIssue("Malformed public API response.", {
        status: response.status,
      });
      return {
        status: "malformed_response",
        message: "The public event API returned an unexpected response.",
      };
    }

    if (!validatePublicEventContract(payload.data as Record<string, unknown>)) {
      debugFetchIssue("Event Website section contract validation failed.");
      return {
        status: "malformed_response",
        message: "The event website data contract is not supported.",
      };
    }

    return {
      status: "available",
      event: normalizePublicEvent({
        event: payload.data,
        source: "live",
        previewMode,
        eventSlug,
      }),
    };
  } catch (error) {
    debugFetchIssue("Public API request failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      status: "network_error",
      message: "Could not reach the WebSerbisyo public API.",
    };
  }
}
