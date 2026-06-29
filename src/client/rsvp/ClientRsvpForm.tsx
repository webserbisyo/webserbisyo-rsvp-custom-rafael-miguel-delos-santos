"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { appendPrivateAccessToken, normalizePrivateAccessToken } from "@/lib/private-access";
import type { EventWebsiteRenderModel, NormalizedSection } from "@/types/public-event";
import { submitPublicRsvp, type PublicRsvpPayload } from "./submit-rsvp";
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
  dedicatedPageEnabled,
  dedicatedPagePath,
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
        <div className="w-14 h-14 bg-[#4f7d5a]/10 text-[#4f7d5a] rounded-full flex items-center justify-center mb-5 text-3xl select-none" aria-hidden="true">
          ✓
        </div>
        <h2 className="font-serif text-3xl text-[#302722] mb-3">Thank You!</h2>
        <p className="text-sm text-[#725d4f]/85 max-w-sm leading-relaxed">
          Your RSVP has been submitted successfully. We look forward to celebrating with you!
        </p>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <div className="w-full">
      <form id="rsvp-form" onSubmit={handleSubmit} className="grid gap-6">
        {globalError ? (
          <div className="rounded-xl bg-[#a84f45]/10 border border-[#a84f45]/20 p-4 text-sm text-[#a84f45]">
            {globalError}
          </div>
        ) : null}

        {/* Guest Name */}
        <div className="grid gap-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
            Guest Name *
          </Label>
          <Input
            required
            placeholder="Your full name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            disabled={isSubmitting}
            className={`w-full bg-[#fffaf1]/85 border-[rgba(201,114,88,0.18)] text-[#302722] placeholder-[#725d4f]/55 focus:outline-none focus-visible:outline-none focus:border-[#c97258]/65 focus:ring-2 focus:ring-[#c97258]/15 focus-visible:border-[#c97258]/70 focus-visible:ring-2 focus-visible:ring-[#c97258]/20 focus:bg-white rounded-xl py-3 px-4 transition-all duration-300 ${
              fieldErrors?.guestName?.[0] ? "border-[#a84f45] bg-[#a84f45]/5" : ""
            }`}
          />
          {fieldErrors?.guestName?.[0] && (
            <span className="text-xs text-[#a84f45]">{fieldErrors.guestName[0]}</span>
          )}
        </div>

        {/* Email Address */}
        {(showFullForm || showCompactFields) && rsvpConfig.emailEnabled ? (
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
              Email{rsvpConfig.emailRequired ? " *" : ""}
            </Label>
            <Input
              required={rsvpConfig.emailRequired}
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`w-full bg-[#fffaf1]/85 border-[rgba(201,114,88,0.18)] text-[#302722] placeholder-[#725d4f]/55 focus:outline-none focus-visible:outline-none focus:border-[#c97258]/65 focus:ring-2 focus:ring-[#c97258]/15 focus-visible:border-[#c97258]/70 focus-visible:ring-2 focus-visible:ring-[#c97258]/20 focus:bg-white rounded-xl py-3 px-4 transition-all duration-300 ${
                fieldErrors?.email?.[0] ? "border-[#a84f45] bg-[#a84f45]/5" : ""
              }`}
            />
            {fieldErrors?.email?.[0] && (
              <span className="text-xs text-[#a84f45]">{fieldErrors.email[0]}</span>
            )}
          </div>
        ) : null}

        {/* Phone Number */}
        {showFullForm && rsvpConfig.phoneEnabled ? (
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
              Phone Number{rsvpConfig.phoneRequired ? " *" : ""}
            </Label>
            <Input
              required={rsvpConfig.phoneRequired}
              placeholder="09XXXXXXXXX"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              className={`w-full bg-[#fffaf1]/85 border-[rgba(201,114,88,0.18)] text-[#302722] placeholder-[#725d4f]/55 focus:outline-none focus-visible:outline-none focus:border-[#c97258]/65 focus:ring-2 focus:ring-[#c97258]/15 focus-visible:border-[#c97258]/70 focus-visible:ring-2 focus-visible:ring-[#c97258]/20 focus:bg-white rounded-xl py-3 px-4 transition-all duration-300 ${
                fieldErrors?.phone?.[0] ? "border-[#a84f45] bg-[#a84f45]/5" : ""
              }`}
            />
            {fieldErrors?.phone?.[0] && (
              <span className="text-xs text-[#a84f45]">{fieldErrors.phone[0]}</span>
            )}
          </div>
        ) : null}

        {/* Attendance Toggles */}
        {showFullForm ? (
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
              Will you attend? *
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAttendanceStatus("attending")}
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-soft active:scale-[0.97] ${
                  attendanceStatus === "attending"
                    ? "bg-[#c97258] text-white border-[#c97258] shadow-[0_4px_12px_rgba(201,114,88,0.2)]"
                    : "bg-[#fffaf1]/85 text-[#725d4f] border-[rgba(201,114,88,0.18)] hover:border-[#c97258]/40 hover:-translate-y-0.5"
                }`}
              >
                Yes, Attending
              </button>
              <button
                type="button"
                onClick={() => setAttendanceStatus("not_attending")}
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-soft active:scale-[0.97] ${
                  attendanceStatus === "not_attending"
                    ? "bg-[#c97258] text-white border-[#c97258] shadow-[0_4px_12px_rgba(201,114,88,0.2)]"
                    : "bg-[#fffaf1]/85 text-[#725d4f] border-[rgba(201,114,88,0.18)] hover:border-[#c97258]/40 hover:-translate-y-0.5"
                }`}
              >
                Declining
              </button>
            </div>
            {fieldErrors?.attendanceStatus ? (
              <span className="text-xs text-[#a84f45]">{fieldErrors.attendanceStatus[0]}</span>
            ) : null}
          </div>
        ) : null}

        {/* Companions (Conditional) */}
        {showFullForm && rsvpConfig.plusOneEnabled && attendanceStatus === "attending" ? (
          <div className="grid gap-4 p-5 bg-[#fffaf1]/30 border border-[rgba(201,114,88,0.1)] rounded-2xl animate-fadeIn">
            <div className="grid gap-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
                Companions
              </Label>
              <p className="text-xs text-[#725d4f]/70 mb-1">
                You may bring up to {rsvpConfig.companionLimit} companion{rsvpConfig.companionLimit === 1 ? "" : "s"}.
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: rsvpConfig.companionLimit + 1 }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCompanionCount(index)}
                    disabled={isSubmitting}
                    className={`flex-1 py-2.5 rounded-lg border text-xs font-bold transition-all duration-300 cursor-pointer active:scale-[0.97] ${
                      companionCount === index
                        ? "bg-[#b8644a] text-white border-[#b8644a]"
                        : "bg-[#fffaf1]/50 text-[#725d4f] border-[rgba(201,114,88,0.18)] hover:border-[#b8644a]/40 hover:-translate-y-0.5"
                    }`}
                  >
                    {index === 0 ? "Just me" : `Me + ${index}`}
                  </button>
                ))}
              </div>
            </div>

            {rsvpConfig.companionNameEnabled && companionCount > 0 ? (
              <div className="grid gap-4 mt-2">
                {Array.from({ length: companionCount }, (_, index) => (
                  <div key={index} className="grid gap-3 p-4 bg-white/50 border border-[rgba(201,114,88,0.12)] rounded-xl">
                    <div className="grid gap-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
                        Companion {index + 1} Name
                      </Label>
                      <Input
                        placeholder="Full name"
                        value={companions[index]?.fullName || ""}
                        onChange={(e) => updateCompanion(index, "fullName", e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-[#fffaf1]/85 border-[rgba(201,114,88,0.18)] text-[#302722] placeholder-[#725d4f]/55 focus:outline-none focus-visible:outline-none focus:border-[#c97258]/65 focus:ring-2 focus:ring-[#c97258]/15 focus-visible:border-[#c97258]/70 focus-visible:ring-2 focus-visible:ring-[#c97258]/20 focus:bg-white rounded-xl py-2 px-3"
                      />
                    </div>
                    {rsvpConfig.companionAgeEnabled ? (
                      <div className="grid gap-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
                          Companion {index + 1} Age
                        </Label>
                        <Input
                          placeholder="Adult, child, or age"
                          value={companions[index]?.ageLabel || ""}
                          onChange={(e) => updateCompanion(index, "ageLabel", e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-[#fffaf1]/85 border-[rgba(201,114,88,0.18)] text-[#302722] placeholder-[#725d4f]/55 focus:outline-none focus-visible:outline-none focus:border-[#c97258]/65 focus:ring-2 focus:ring-[#c97258]/15 focus-visible:border-[#c97258]/70 focus-visible:ring-2 focus-visible:ring-[#c97258]/20 focus:bg-white rounded-xl py-2 px-3"
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
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
              Food Allergies / Dietary Restrictions
            </Label>
            <Textarea
              placeholder="List any allergies or dietary restrictions for your party."
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              disabled={isSubmitting}
              className="w-full min-h-[100px] bg-[#fffaf1]/85 border-[rgba(201,114,88,0.18)] text-[#302722] placeholder-[#725d4f]/55 focus:outline-none focus-visible:outline-none focus:border-[#c97258]/65 focus:ring-2 focus:ring-[#c97258]/15 focus-visible:border-[#c97258]/70 focus-visible:ring-2 focus-visible:ring-[#c97258]/20 focus:bg-white rounded-xl py-3 px-4 transition-all duration-300 resize-none"
            />
          </div>
        ) : null}

        {/* Message to Host */}
        {(showFullForm || showCompactFields) && rsvpConfig.messageToHostEnabled ? (
          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-[#725d4f]">
              Message to the Couple
            </Label>
            <Textarea
              placeholder="Leave a warm note for the couple."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="w-full min-h-[100px] bg-[#fffaf1]/85 border-[rgba(201,114,88,0.18)] text-[#302722] placeholder-[#725d4f]/55 focus:outline-none focus-visible:outline-none focus:border-[#c97258]/65 focus:ring-2 focus:ring-[#c97258]/15 focus-visible:border-[#c97258]/70 focus-visible:ring-2 focus-visible:ring-[#c97258]/20 focus:bg-white rounded-xl py-3 px-4 transition-all duration-300 resize-none"
            />
          </div>
        ) : null}

        {/* Submit Button */}
        <div className="mt-4">
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#b8644a] to-[#c97258] hover:opacity-95 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer shadow-[0_16px_34px_rgba(201,114,88,0.32)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c97258]/40"
          >
            {isSubmitting ? "Submitting..." : "Submit RSVP"}
          </button>
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
