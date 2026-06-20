"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { appendPrivateAccessToken, normalizePrivateAccessToken } from "@/lib/private-access";
import type { EventWebsiteRenderModel, NormalizedSection } from "@/types/public-event";
import { submitPublicRsvp, type PublicRsvpPayload } from "./submit-rsvp";

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
        <div className="rounded-2xl border border-cocoa/10 bg-ivory/60 p-8 text-center" id="rsvp-form">
          <h3 className="mb-2 text-xl font-semibold text-charcoal">Thank You!</h3>
          <p className="text-cocoa/80">Your RSVP has been submitted successfully.</p>
        </div>
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

      <form onSubmit={handleSubmit} className="rounded-2xl border border-cocoa/10 bg-ivory/60 p-5" id="rsvp-form">
        <div className="grid gap-4">
          {globalError ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {globalError}
            </div>
          ) : null}

          <Field
            label="Guest Name"
            required
            placeholder="Your full name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            disabled={isSubmitting}
            error={fieldErrors?.guestName?.[0]}
          />

          {(showFullForm || showCompactFields) && rsvpConfig.emailEnabled ? (
            <Field
              label="Email"
              required={rsvpConfig.emailRequired}
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              error={fieldErrors?.email?.[0]}
            />
          ) : null}

          {showFullForm && rsvpConfig.phoneEnabled ? (
            <Field
              label="Phone Number"
              required={rsvpConfig.phoneRequired}
              placeholder="09XXXXXXXXX"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              error={fieldErrors?.phone?.[0]}
            />
          ) : null}

          {showFullForm ? (
            <div className="grid gap-2">
              <span className="text-sm font-semibold text-charcoal">Attendance *</span>
              <div className="flex flex-wrap gap-2">
                <ChoiceButton
                  label="Yes, I will attend"
                  selected={attendanceStatus === "attending"}
                  onClick={() => setAttendanceStatus("attending")}
                  disabled={isSubmitting}
                />
                <ChoiceButton
                  label="Sorry, I can't attend"
                  selected={attendanceStatus === "not_attending"}
                  onClick={() => setAttendanceStatus("not_attending")}
                  disabled={isSubmitting}
                />
              </div>
              {fieldErrors?.attendanceStatus ? (
                <span className="text-xs text-red-500">{fieldErrors.attendanceStatus[0]}</span>
              ) : null}
            </div>
          ) : null}

          {showFullForm && rsvpConfig.plusOneEnabled ? (
            <div className="grid gap-2">
              <span className="text-sm font-semibold text-charcoal">Companions</span>
              <p className="text-sm leading-6 text-cocoa/70">
                Guests may bring up to {rsvpConfig.companionLimit} companion{rsvpConfig.companionLimit === 1 ? "" : "s"}.
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: rsvpConfig.companionLimit + 1 }, (_, index) => (
                  <ChoiceButton
                    key={index}
                    label={index === 0 ? "Just me" : `Me + ${index}`}
                    selected={companionCount === index}
                    onClick={() => setCompanionCount(index)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {rsvpConfig.companionNameEnabled && companionCount > 0 ? (
                Array.from({ length: companionCount }, (_, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl border border-cocoa/10 bg-white/70 p-4">
                    <Field
                      label={`Companion ${index + 1} Name`}
                      placeholder="Full name"
                      value={companions[index]?.fullName || ""}
                      onChange={(e) => updateCompanion(index, "fullName", e.target.value)}
                      disabled={isSubmitting}
                    />
                    {rsvpConfig.companionAgeEnabled ? (
                      <Field
                        label={`Companion ${index + 1} Age`}
                        placeholder="Adult, child, or age"
                        value={companions[index]?.ageLabel || ""}
                        onChange={(e) => updateCompanion(index, "ageLabel", e.target.value)}
                        disabled={isSubmitting}
                      />
                    ) : null}
                  </div>
                ))
              ) : null}
            </div>
          ) : null}

          {showFullForm && rsvpConfig.foodAllergiesEnabled ? (
            <TextArea
              label="Food Allergies / Dietary Restrictions"
              placeholder="List any allergies or dietary restrictions for your party."
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              disabled={isSubmitting}
            />
          ) : null}

          {(showFullForm || showCompactFields) && rsvpConfig.messageToHostEnabled ? (
            <TextArea
              label="Message to Host"
              placeholder="Leave a short message."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                isSubmitting
                  ? "border-cocoa/15 text-cocoa/60 cursor-not-allowed"
                  : "border-terracotta bg-terracotta text-white hover:bg-terracotta/90"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submit RSVP"}
            </button>
            {dedicatedPageEnabled && mode !== "cta-only" ? (
              <a
                className="text-sm font-semibold text-terracotta underline-offset-2 hover:underline"
                href={dedicatedPageHref}
              >
                Open the dedicated RSVP page
              </a>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  placeholder,
  required = false,
  type = "text",
  value,
  onChange,
  disabled,
  error,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "email" | "tel" | "text";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-charcoal">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        className={`rounded-2xl border bg-white px-4 py-3 text-sm text-cocoa/80 focus:outline-none focus:ring-2 focus:ring-terracotta/50 ${
          error ? "border-red-300" : "border-cocoa/10"
        } ${disabled ? "opacity-50" : ""}`}
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
      />
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}

function TextArea({
  label,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-charcoal">{label}</span>
      <textarea
        className={`min-h-[120px] rounded-2xl border border-cocoa/10 bg-white px-4 py-3 text-sm text-cocoa/80 focus:outline-none focus:ring-2 focus:ring-terracotta/50 ${
          disabled ? "opacity-50" : ""
        }`}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}

function ChoiceButton({
  label,
  selected,
  onClick,
  disabled
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        selected
          ? "border-terracotta bg-terracotta/10 text-terracotta"
          : "border-cocoa/10 text-cocoa/60 hover:border-cocoa/30"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
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
