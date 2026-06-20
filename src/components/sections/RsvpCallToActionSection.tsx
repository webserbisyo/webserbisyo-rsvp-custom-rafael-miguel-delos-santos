import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { field } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";
import { buildRsvpSectionHref } from "@/lib/rsvp-url";

export function RsvpCallToActionSection({ section, event }: WeddingSectionProps) {
  return (
    <Section className="bg-terracotta text-white">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-4xl">{field(section.content, ["title"]) || "Confirm your attendance"}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/85">
          {field(section.content, ["body", "description"]) || "Keep the RSVP experience inside the same page flow and connect submission only through an approved public contract."}
        </p>
        {event.rsvpDeadlineLabel ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">{event.rsvpDeadlineLabel}</p> : null}
        <div className="mt-7">
          <Button href={buildRsvpSectionHref()} variant="secondary">{field(section.content, ["buttonLabel", "ctaLabel"]) || "Go to RSVP Section"}</Button>
        </div>
      </div>
    </Section>
  );
}
