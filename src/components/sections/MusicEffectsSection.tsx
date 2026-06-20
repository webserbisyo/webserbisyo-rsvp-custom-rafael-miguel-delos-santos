import { Section } from "@/components/ui/Section";
import { field } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function MusicEffectsSection({ section }: WeddingSectionProps) {
  const title = field(section.content, ["title"]);
  const description = field(section.content, ["description", "body", "note"]);

  return (
    <Section eyebrow="Mood" title={title || "Wedding ambience"} className="bg-linen">
      {description ? <p className="max-w-2xl text-base leading-8 text-cocoa/80">{description}</p> : null}
    </Section>
  );
}
