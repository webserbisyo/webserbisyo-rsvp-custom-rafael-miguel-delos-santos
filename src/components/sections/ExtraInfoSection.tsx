import { Section } from "@/components/ui/Section";
import { field, records } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function ExtraInfoSection({ section }: WeddingSectionProps) {
  const items = records(section.content.items).filter((item) => field(item, ["title"]) || field(item, ["body", "description"]));

  return (
    <Section eyebrow="Details" title={field(section.content, ["title"]) || "Extra information"}>
      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((item, index) => (
          <article className="rounded-lg border border-cocoa/10 bg-white/70 p-6" key={`${field(item, ["title"])}-${index}`}>
            <h3 className="font-serif text-2xl text-charcoal">{field(item, ["title"])}</h3>
            <p className="mt-3 text-sm leading-7 text-cocoa/80">{field(item, ["body", "description"])}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
