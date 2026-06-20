import { Section } from "@/components/ui/Section";
import { field } from "@/components/sections/field-utils";
import { formatDateTime } from "@/lib/formatters";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function CeremonySection({ section, event }: WeddingSectionProps) {
  const label = field(section.content, ["label", "title"]) || "Ceremony";
  const dateTime = field(section.content, ["dateTime", "date"]) || event.eventDate;
  const deadline = field(section.content, ["deadline", "arrival"]) || event.rsvpDeadlineLabel || "";
  const note = field(section.content, ["note", "description", "body"]);

  return (
    <Section eyebrow="Main Event" title={label}>
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-lg border border-cocoa/10 bg-white/70 p-6 sm:col-span-2">
          <p className="text-lg font-semibold text-charcoal">{event.eventDateTimeLabel || formatDateTime(dateTime, event.timezone) || "Date and time unavailable"}</p>
          {deadline ? <p className="mt-3 text-sm leading-6 text-cocoa/80">{deadline}</p> : null}
        </div>
        {note ? <div className="rounded-lg bg-terracotta p-6 text-sm leading-7 text-white">{note}</div> : null}
      </div>
    </Section>
  );
}
