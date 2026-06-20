import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { field } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function VenueSection({ section }: WeddingSectionProps) {
  const name = field(section.content, ["name", "venue", "title"]);
  const address = field(section.content, ["address", "location"]);
  const mapsUrl = field(section.content, ["mapsUrl", "mapUrl", "googleMapsUrl"]);
  const note = field(section.content, ["note", "description"]);

  return (
    <Section eyebrow="Venue" title={name || "Venue"}>
      <div className="rounded-lg border border-cocoa/10 bg-white/70 p-6 shadow-soft">
        {address ? <p className="text-base leading-8 text-cocoa">{address}</p> : null}
        {note ? <p className="mt-3 text-sm leading-7 text-cocoa/75">{note}</p> : null}
        {mapsUrl ? <div className="mt-6"><Button href={mapsUrl} variant="secondary">Open map</Button></div> : null}
      </div>
    </Section>
  );
}
