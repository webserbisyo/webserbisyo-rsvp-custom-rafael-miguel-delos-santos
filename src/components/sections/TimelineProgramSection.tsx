import { Section } from "@/components/ui/Section";
import { field, records } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function TimelineProgramSection({ section }: WeddingSectionProps) {
  const items = records(section.content.items).filter((item) => field(item, ["time"]) || field(item, ["label", "title"]));

  return (
    <Section eyebrow="Program" title={field(section.content, ["title"]) || "Wedding timeline"}>
      <div className="grid gap-4">
        {items.map((item, index) => (
          <div className="grid gap-2 rounded-lg border border-cocoa/10 bg-white/70 p-5 sm:grid-cols-[120px_1fr]" key={`${field(item, ["time"])}-${index}`}>
            <p className="text-sm font-semibold text-terracotta">{field(item, ["time"])}</p>
            <p className="font-medium text-charcoal">{field(item, ["label", "title"])}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
