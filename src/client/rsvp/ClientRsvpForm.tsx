"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { normalizePrivateAccessToken } from "@/lib/private-access";
import type { EventWebsiteRenderModel, NormalizedSection } from "@/types/public-event";
import { submitPublicRsvp, type PublicRsvpPayload } from "./submit-rsvp";
import { WeddingButton } from "@/client/components/ui/WeddingButton";
import { Input } from "@/client/components/ui/input";
import { Textarea } from "@/client/components/ui/textarea";
import { Label } from "@/client/components/ui/label";

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
  event,
  mode,
}: ClientRsvpFormProps) {
  const searchParams = useSearchParams();
  const accessToken = normalizePrivateAccessToken(searchParams.get("access"));
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
      <div id="rsvp-form" className="py-12 text-center flex flex-col items-center justify-center animate-fadeIn">
        <div className="w-14 h-14 bg-[color:var(--wedding-status-success-bg,rgba(79,125,90,0.1))] text-[color:var(--wedding-status-success,#4f7d5a)] rounded-full flex items-center justify-center mb-5 text-3xl select-none" aria-hidden="true">
          ✓
        </div>
        <h2 className="wedding-display text-3xl text-[color:var(--wedding-text-primary)] mb-3">Thank You!</h2>
        <p className="text-sm text-[color:var(--wedding-text-secondary)] max-w-sm leading-relaxed">
          Your RSVP has been submitted successfully. We look forward to celebrating with you!
        </p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";  return (
    <div className="w-full">
      <form id="rsvp-form" onSubmit={handleSubmit} className="grid gap-6">
        {globalError ? (
          <div className="rounded-xl bg-[color:var(--wedding-status-error-bg,rgba(168,79,69,0.1))] border border-[color:var(--wedding-status-error-border,rgba(168,79,69,0.2))] p-4 text-sm text-[color:var(--wedding-status-error,#a84f45)]">
            {globalError}
          </div>
        ) : null}

        {/* Guest Name */}
        <div className="grid gap-2">
          <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
            Guest Name *
          </Label>
          <Input
            required
            placeholder="Your full name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            disabled={isSubmitting}
            className={`wedding-rsvp-field w-full placeholder-[color:var(--wedding-rsvp-field-placeholder,var(--wedding-text-tertiary))] focus:outline-none focus-visible:outline-none py-3 px-4 transition-all duration-300 ${
              fieldErrors?.guestName?.[0] ? "border-[color:var(--wedding-status-error,#a84f45)] bg-[color:var(--wedding-status-error-bg,rgba(168,79,69,0.05))]" : ""
            }`}
          />
          {fieldErrors?.guestName?.[0] && (
            <span className="text-xs text-[color:var(--wedding-status-error,#a84f45)]">{fieldErrors.guestName[0]}</span>
          )}
        </div>

        {/* Email Address */}
        {(showFullForm || showCompactFields) && rsvpConfig.emailEnabled ? (
          <div className="grid gap-2">
            <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
              Email{rsvpConfig.emailRequired ? " *" : ""}
            </Label>
            <Input
              required={rsvpConfig.emailRequired}
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`wedding-rsvp-field w-full placeholder-[color:var(--wedding-rsvp-field-placeholder,var(--wedding-text-tertiary))] focus:outline-none focus-visible:outline-none py-3 px-4 transition-all duration-300 ${
                fieldErrors?.email?.[0] ? "border-[color:var(--wedding-status-error,#a84f45)] bg-[color:var(--wedding-status-error-bg,rgba(168,79,69,0.05))]" : ""
              }`}
            />
            {fieldErrors?.email?.[0] && (
              <span className="text-xs text-[color:var(--wedding-status-error,#a84f45)]">{fieldErrors.email[0]}</span>
            )}
          </div>
        ) : null}

        {/* Phone Number */}
        {showFullForm && rsvpConfig.phoneEnabled ? (
          <div className="grid gap-2">
            <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
              Phone Number{rsvpConfig.phoneRequired ? " *" : ""}
            </Label>
            <Input
              required={rsvpConfig.phoneRequired}
              placeholder="09XXXXXXXXX"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              className={`wedding-rsvp-field w-full placeholder-[color:var(--wedding-rsvp-field-placeholder,var(--wedding-text-tertiary))] focus:outline-none focus-visible:outline-none py-3 px-4 transition-all duration-300 ${
                fieldErrors?.phone?.[0] ? "border-[color:var(--wedding-status-error,#a84f45)] bg-[color:var(--wedding-status-error-bg,rgba(168,79,69,0.05))]" : ""
              }`}
            />
            {fieldErrors?.phone?.[0] && (
              <span className="text-xs text-[color:var(--wedding-status-error,#a84f45)]">{fieldErrors.phone[0]}</span>
            )}
          </div>
        ) : null}

        {/* Attendance Toggles */}
        {showFullForm ? (
          <div className="grid gap-2">
            <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
              Will you attend? *
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAttendanceStatus("attending")}
                disabled={isSubmitting}
                aria-pressed={attendanceStatus === "attending"}
                data-selected={attendanceStatus === "attending"}
                className="wedding-choice w-full py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                Yes, Attending
              </button>
              <button
                type="button"
                onClick={() => setAttendanceStatus("not_attending")}
                disabled={isSubmitting}
                aria-pressed={attendanceStatus === "not_attending"}
                data-selected={attendanceStatus === "not_attending"}
                className="wedding-choice w-full py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                Declining
              </button>
            </div>
            {fieldErrors?.attendanceStatus ? (
              <span className="text-xs text-[color:var(--wedding-status-error,#a84f45)]">{fieldErrors.attendanceStatus[0]}</span>
            ) : null}
          </div>
        ) : null}

        {/* Companions (Conditional) */}
        {showFullForm && rsvpConfig.plusOneEnabled && attendanceStatus === "attending" ? (
          <div className="wedding-rsvp-companion-card grid gap-4 p-5 rounded-2xl border transition-colors duration-300 animate-fadeIn">
            <div className="grid gap-2">
              <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
                Companions
              </Label>
              <p className="text-xs text-[color:var(--wedding-rsvp-muted,var(--wedding-text-secondary))] mb-1">
                You may bring up to {rsvpConfig.companionLimit} companion{rsvpConfig.companionLimit === 1 ? "" : "s"}.
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: rsvpConfig.companionLimit + 1 }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCompanionCount(index)}
                    disabled={isSubmitting}
                    aria-pressed={companionCount === index}
                    data-selected={companionCount === index}
                    className="wedding-choice flex-1 py-2.5 text-xs font-bold"
                  >
                    {index === 0 ? "Just me" : `Me + ${index}`}
                  </button>
                ))}
              </div>
            </div>

            {rsvpConfig.companionNameEnabled && companionCount > 0 ? (
              <div className="grid gap-4 mt-2">
                {Array.from({ length: companionCount }, (_, index) => (
                  <div key={index} className="grid gap-3 p-4 bg-white/80 border border-[color:var(--wedding-divider)] rounded-xl">
                    <div className="grid gap-2">
                      <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
                        Companion {index + 1} Name
                      </Label>
                      <Input
                        placeholder="Full name"
                        value={companions[index]?.fullName || ""}
                        onChange={(e) => updateCompanion(index, "fullName", e.target.value)}
                        disabled={isSubmitting}
                        className="wedding-rsvp-field w-full placeholder-[color:var(--wedding-rsvp-field-placeholder,var(--wedding-text-tertiary))] focus:outline-none focus-visible:outline-none py-2 px-3"
                      />
                    </div>
                    {rsvpConfig.companionAgeEnabled ? (
                      <div className="grid gap-2">
                        <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
                          Companion {index + 1} Age
                        </Label>
                        <Input
                          placeholder="Adult, child, or age"
                          value={companions[index]?.ageLabel || ""}
                          onChange={(e) => updateCompanion(index, "ageLabel", e.target.value)}
                          disabled={isSubmitting}
                          className="wedding-rsvp-field w-full placeholder-[color:var(--wedding-rsvp-field-placeholder,var(--wedding-text-tertiary))] focus:outline-none focus-visible:outline-none py-2 px-3"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Food Allergies */}
        {showFullForm && rsvpConfig.foodAllergiesEnabled ? (
          <div className="grid gap-2">
            <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
              Food Allergies / Dietary Restrictions
            </Label>
            <Textarea
              placeholder="List any allergies or dietary restrictions for your party."
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              disabled={isSubmitting}
              className="wedding-rsvp-field w-full min-h-[100px] placeholder-[color:var(--wedding-text-tertiary)] focus:outline-none focus-visible:outline-none py-3 px-4 transition-all duration-300 resize-none"
            />
          </div>
        ) : null}

        {/* Message to Host */}
        {(showFullForm || showCompactFields) && rsvpConfig.messageToHostEnabled ? (
          <div className="grid gap-2">
            <Label className="wedding-rsvp-label text-xs font-semibold uppercase tracking-wider">
              Message to the Couple
            </Label>
            <Textarea
              placeholder="Leave a warm note for the couple."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="wedding-rsvp-field w-full min-h-[100px] placeholder-[color:var(--wedding-text-tertiary)] focus:outline-none focus-visible:outline-none py-3 px-4 transition-all duration-300 resize-none"
            />
          </div>
        ) : null}

        {/* Submit Button */}
        <div className="mt-4">
          <WeddingButton
            disabled={isSubmitting}
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit RSVP"}
          </WeddingButton>
        </div>
      </form>
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
