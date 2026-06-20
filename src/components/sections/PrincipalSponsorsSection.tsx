import { Section } from "@/components/ui/Section";
import { field, names } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function PrincipalSponsorsSection({ section }: WeddingSectionProps) {
  const sponsorNames = names(section.content.names ?? section.content.sponsors);

  return (
    <Section eyebrow="Sponsors" title={field(section.content, ["title"]) || "Principal sponsors"}>
      <div className="grid gap-3 sm:grid-cols-2">
        {sponsorNames.map((name) => (
          <div className="rounded-lg border border-cocoa/10 bg-white/70 px-5 py-4 text-sm font-medium text-charcoal" key={name}>{name}</div>
        ))}
      </div>
    </Section>
  );
}
