import { Section } from "@/components/ui/Section";
import { field, names, records } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function EntourageSection({ section }: WeddingSectionProps) {
  const groups = records(section.content.groups).filter((group) => field(group, ["title", "label"]) || names(group.names).length);

  return (
    <Section eyebrow="Entourage" title={field(section.content, ["title"]) || "Wedding entourage"} className="bg-linen">
      <div className="grid gap-5 sm:grid-cols-2">
        {groups.map((group, index) => (
          <div className="rounded-lg border border-cocoa/10 bg-white/70 p-6" key={`${field(group, ["title", "label"])}-${index}`}>
            <h3 className="font-serif text-2xl text-charcoal">{field(group, ["title", "label"])}</h3>
            <ul className="mt-4 space-y-2 text-sm leading-7">
              {names(group.names).map((name) => <li key={name}>{name}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
