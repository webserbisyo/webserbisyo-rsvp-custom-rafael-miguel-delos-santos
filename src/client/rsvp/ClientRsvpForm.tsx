"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { appendPrivateAccessToken, normalizePrivateAccessToken } from "@/lib/private-access";
import type { EventWebsiteRenderModel, NormalizedSection } from "@/types/public-event";
import { submitPublicRsvp, type PublicRsvpPayload } from "./submit-rsvp";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Textarea } from "@/client/components/ui/textarea";
import { Label } from "@/client/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/client/components/ui/card";

type ClientRsvpFormProps = {
  dedicatedPageEnabled: boolean;
  dedicatedPagePath: string;
  event: EventWebsiteRenderModel;
  mode: "compact-form" | "cta-only" | "inline-form";
};

type StarterRsvpConfig = {
  companionAgeEnabled: boolean;
  companionLimit: number;
  companionNameEnabled: boolean;
  emailEnabled: boolean;
  emailRequired: boolean;
  foodAllergiesEnabled: boolean;
  messageToHostEnabled: boolean;
  phoneEnabled: boolean;
  phoneRequired: boolean;
  plusOneEnabled: boolean;
};

const defaultRsvpConfig: StarterRsvpConfig = {
  companionAgeEnabled: false,
  companionLimit: 1,
  companionNameEnabled: false,
  emailEnabled: true,
  emailRequired: false,
  foodAllergiesEnabled: false,
  messageToHostEnabled: true,
  phoneEnabled: false,
  phoneRequired: false,
  plusOneEnabled: false,
};

export function ClientRsvpForm({
  dedicatedPageEnabled,
  dedicatedPagePath,
  event,
  mode,
}: ClientRsvpFormProps) {
  const searchParams = useSearchParams();
  const accessToken = normalizePrivateAccessToken(searchParams.get("access"));
  const dedicatedPageHref = appendPrivateAccessToken(dedicatedPagePath, accessToken) ?? dedicatedPagePath;
  const rsvpConfig = getStarterRsvpConfig(event.sections.find((section) => section.key === "rsvp_form"));
  const showFullForm = mode === "inline-form";
  const showCompactFields = mode === "compact-form";

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<"attending" | "not_attending" | null>(null);
  const [companionCount, setCompanionCount] = useState(0);
  const [companions, setCompanions] = useState<Array<{ fullName?: string; ageLabel?: string }>>([]);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting" || status === "success") return;

    const errors: Record<string, string[]> = {};
    if (!guestName.trim()) {
      errors.guestName = ["Guest name is required"];
    }
    if ((showFullForm || showCompactFields) && rsvpConfig.emailEnabled && rsvpConfig.emailRequired && !email.trim()) {
      errors.email = ["Email is required"];
    }
    if (showFullForm && rsvpConfig.phoneEnabled && rsvpConfig.phoneRequired && !phone.trim()) {
      errors.phone = ["Phone is required"];
    }
    if (showFullForm && !attendanceStatus) {
      errors.attendanceStatus = ["Please select attendance status"];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus("submitting");
    setGlobalError(null);
    setFieldErrors(null);

    const payload: PublicRsvpPayload = {
      guestName,
      attendanceStatus: attendanceStatus || "attending",
    };

    if ((showFullForm || showCompactFields) && rsvpConfig.emailEnabled && email.trim()) {
      payload.email = email.trim();
    }
    if (showFullForm && rsvpConfig.phoneEnabled && phone.trim()) {
      payload.phone = phone.trim();
    }
    if (showFullForm && rsvpConfig.plusOneEnabled && companionCount > 0) {
      payload.companionCount = companionCount;
      if (rsvpConfig.companionNameEnabled) {
        payload.companions = companions.slice(0, companionCount);
      }
    }
    if (showFullForm && rsvpConfig.foodAllergiesEnabled && dietaryNotes.trim()) {
      payload.dietaryNotes = dietaryNotes.trim();
    }
    if ((showFullForm || showCompactFields) && rsvpConfig.messageToHostEnabled && message.trim()) {
      payload.message = message.trim();
    }

    const result = await submitPublicRsvp(event.eventSlug, payload, accessToken);

    if (result.error) {
      setStatus("idle");
      setGlobalError(result.error.message || "An error occurred.");
      setFieldErrors(result.error.fieldErrors || null);
    } else {
      setStatus("success");
    }
  };

  const updateCompanion = (index: number, key: "fullName" | "ageLabel", value: string) => {
    const next = [...companions];
    if (!next[index]) next[index] = {};
    next[index][key] = value;
    setCompanions(next);
  };

  if (status === "success") {
    return (
      <div className="space-y-4">
        <Card id="rsvp-form" className="border-cocoa/10 bg-ivory/60 p-8 text-center">
          <CardHeader className="p-0 mb-2">
            <CardTitle>Thank You!</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-cocoa/80">Your RSVP has been submitted successfully.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <div className="space-y-4">
      {dedicatedPageEnabled && mode !== "cta-only" ? (
        <div className="space-y-2">
          <p className="text-sm leading-7 text-cocoa/70">
            The dedicated RSVP page is available at{" "}
            <a className="font-semibold text-terracotta underline-offset-2 hover:underline" href={dedicatedPageHref}>
              {dedicatedPageHref}
            </a>
            .
          </p>
        </div>
      ) : null}

      <Card id="rsvp-form" className="border-cocoa/10 bg-ivory/60 p-5">
        <form onSubmit={handleSubmit} className="grid gap-4">
          {globalError ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {globalError}
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label>Guest Name *</Label>
            <Input
              required
              placeholder="Your full name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={isSubmitting}
              className={fieldErrors?.guestName?.[0] ? "border-red-300" : ""}
            />
            {fieldErrors?.guestName?.[0] && <span className="text-xs text-red-500">{fieldErrors.guestName[0]}</span>}
          </div>

          {(showFullForm || showCompactFields) && rsvpConfig.emailEnabled ? (
            <div className="grid gap-2">
              <Label>Email{rsvpConfig.emailRequired ? " *" : ""}</Label>
              <Input
                required={rsvpConfig.emailRequired}
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={fieldErrors?.email?.[0] ? "border-red-300" : ""}
              />
              {fieldErrors?.email?.[0] && <span className="text-xs text-red-500">{fieldErrors.email[0]}</span>}
            </div>
          ) : null}

          {showFullForm && rsvpConfig.phoneEnabled ? (
            <div className="grid gap-2">
              <Label>Phone Number{rsvpConfig.phoneRequired ? " *" : ""}</Label>
              <Input
                required={rsvpConfig.phoneRequired}
                placeholder="09XXXXXXXXX"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                className={fieldErrors?.phone?.[0] ? "border-red-300" : ""}
              />
              {fieldErrors?.phone?.[0] && <span className="text-xs text-red-500">{fieldErrors.phone[0]}</span>}
            </div>
          ) : null}

          {showFullForm ? (
            <div className="grid gap-2">
              <Label>Attendance *</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={attendanceStatus === "attending" ? "secondary" : "outline"}
                  onClick={() => setAttendanceStatus("attending")}
                  disabled={isSubmitting}
                  type="button"
                >
                  Yes, I will attend
                </Button>
                <Button
                  variant={attendanceStatus === "not_attending" ? "secondary" : "outline"}
                  onClick={() => setAttendanceStatus("not_attending")}
                  disabled={isSubmitting}
                  type="button"
                >
                  Sorry, I can&apos;t attend
                </Button>
              </div>
              {fieldErrors?.attendanceStatus ? (
                <span className="text-xs text-red-500">{fieldErrors.attendanceStatus[0]}</span>
              ) : null}
            </div>
          ) : null}

          {showFullForm && rsvpConfig.plusOneEnabled ? (
            <div className="grid gap-2">
              <Label>Companions</Label>
              <p className="text-sm leading-6 text-cocoa/70">
                Guests may bring up to {rsvpConfig.companionLimit} companion{rsvpConfig.companionLimit === 1 ? "" : "s"}.
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: rsvpConfig.companionLimit + 1 }, (_, index) => (
                  <Button
                    key={index}
                    variant={companionCount === index ? "secondary" : "outline"}
                    onClick={() => setCompanionCount(index)}
                    disabled={isSubmitting}
                    type="button"
                  >
                    {index === 0 ? "Just me" : `Me + ${index}`}
                  </Button>
                ))}
              </div>

              {rsvpConfig.companionNameEnabled && companionCount > 0 ? (
                Array.from({ length: companionCount }, (_, index) => (
                  <Card key={index} className="grid gap-3 bg-white/70 p-4">
                    <div className="grid gap-2">
                      <Label>Companion {index + 1} Name</Label>
                      <Input
                        placeholder="Full name"
                        value={companions[index]?.fullName || ""}
                        onChange={(e) => updateCompanion(index, "fullName", e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    {rsvpConfig.companionAgeEnabled ? (
                      <div className="grid gap-2">
                        <Label>Companion {index + 1} Age</Label>
                        <Input
                          placeholder="Adult, child, or age"
                          value={companions[index]?.ageLabel || ""}
                          onChange={(e) => updateCompanion(index, "ageLabel", e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                    ) : null}
                  </Card>
                ))
              ) : null}
            </div>
          ) : null}

          {showFullForm && rsvpConfig.foodAllergiesEnabled ? (
            <div className="grid gap-2">
              <Label>Food Allergies / Dietary Restrictions</Label>
              <Textarea
                placeholder="List any allergies or dietary restrictions for your party."
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          ) : null}

          {(showFullForm || showCompactFields) && rsvpConfig.messageToHostEnabled ? (
            <div className="grid gap-2">
              <Label>Message to Host</Label>
              <Textarea
                placeholder="Leave a short message."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button disabled={isSubmitting} type="submit" variant="default">
              {isSubmitting ? "Submitting..." : "Submit RSVP"}
            </Button>
            {dedicatedPageEnabled && mode !== "cta-only" ? (
              <a
                className="text-sm font-semibold text-terracotta underline-offset-2 hover:underline"
                href={dedicatedPageHref}
              >
                Open the dedicated RSVP page
              </a>
            ) : null}
          </div>
        </form>
      </Card>
    </div>
  );
}

function getStarterRsvpConfig(section?: NormalizedSection): StarterRsvpConfig {
  const content = section?.content ?? {};

  return {
    companionAgeEnabled: booleanValue(content.companionAgeEnabled),
    companionLimit: numberValue(content.companionLimit, defaultRsvpConfig.companionLimit),
    companionNameEnabled: booleanValue(content.companionNameEnabled),
    emailEnabled: booleanValue(content.emailEnabled, defaultRsvpConfig.emailEnabled),
    emailRequired: booleanValue(content.emailRequired),
    foodAllergiesEnabled: booleanValue(content.foodAllergiesEnabled),
    messageToHostEnabled: booleanValue(content.messageToHostEnabled, defaultRsvpConfig.messageToHostEnabled),
    phoneEnabled: booleanValue(content.phoneEnabled),
    phoneRequired: booleanValue(content.phoneRequired),
    plusOneEnabled: booleanValue(content.plusOneEnabled),
  };
}

function booleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function numberValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
