import { appendPrivateAccessToken } from "@/lib/private-access";

export type PublicRsvpPayload = {
  guestName: string;
  attendanceStatus: "attending" | "not_attending";
  email?: string;
  phone?: string;
  companionCount?: number;
  companions?: Array<{
    fullName?: string;
    ageLabel?: string;
  }>;
  dietaryNotes?: string;
  message?: string;
};

export type PublicRsvpSubmitResult =
  | {
      data: {
        responseId: string;
        submittedAt: string;
      };
      error?: never;
    }
  | {
      data?: never;
      error: {
        code?: string;
        message?: string;
        fieldErrors?: Record<string, string[]>;
      };
    };

export async function submitPublicRsvp(
  eventSlug: string,
  payload: PublicRsvpPayload,
  accessToken?: string | null,
): Promise<PublicRsvpSubmitResult> {
  try {
    const response = await fetch(
      appendPrivateAccessToken(
        `/api/public/events/${encodeURIComponent(eventSlug)}/rsvp`,
        accessToken,
      ) ?? `/api/public/events/${encodeURIComponent(eventSlug)}/rsvp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          ...(accessToken ? { accessToken } : {}),
        }),
      },
    );

    const json = await response.json();

    if (!response.ok) {
      return {
        error: json.error || {
          message: "An unexpected error occurred while submitting your RSVP.",
        },
      };
    }

    return { data: json.data };
  } catch {
    return {
      error: {
        message: "Network error. Please check your connection and try again.",
      },
    };
  }
}
