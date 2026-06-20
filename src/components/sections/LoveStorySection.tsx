import { Section } from "@/components/ui/Section";
import { field } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function LoveStorySection({ section }: WeddingSectionProps) {
  return (
    <Section eyebrow="Story" title={field(section.content, ["title"]) || "Our story"} className="bg-cream">
      <p className="max-w-3xl text-base leading-8 text-cocoa/85">{field(section.content, ["body", "story", "message", "description"])}</p>
    </Section>
  );
}
