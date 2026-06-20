import { Section } from "@/components/ui/Section";
import { field } from "@/components/sections/field-utils";
import { formatDateTime } from "@/lib/formatters";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function ReceptionSection({ section, event }: WeddingSectionProps) {
  const label = field(section.content, ["label", "title"]) || "Reception";
  const dateTime = field(section.content, ["dateTime", "date"]);
  const venue = field(section.content, ["venue", "location"]);
  const note = field(section.content, ["note", "description", "body"]);

  return (
    <Section eyebrow="After Ceremony" title={label} className="bg-linen">
      <div className="space-y-3 rounded-lg border border-cocoa/10 bg-white/70 p-6">
        {dateTime && formatDateTime(dateTime, event.timezone) ? <p className="font-semibold text-charcoal">{formatDateTime(dateTime, event.timezone)}</p> : null}
        {venue ? <p>{venue}</p> : null}
        {note ? <p className="text-sm leading-7 text-cocoa/75">{note}</p> : null}
      </div>
    </Section>
  );
}
