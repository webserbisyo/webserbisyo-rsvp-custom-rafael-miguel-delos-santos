import { Section } from "@/components/ui/Section";
import { field } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function AttireMotifSection({ section }: WeddingSectionProps) {
  const dressCode = field(section.content, ["dressCode", "attire"]);
  const motif = field(section.content, ["motif", "colors"]);
  const notes = field(section.content, ["notes", "note", "description"]);

  return (
    <Section eyebrow="Attire" title={field(section.content, ["title"]) || "Attire and motif"} className="bg-cream">
      <div className="grid gap-5 sm:grid-cols-3">
        {dressCode ? <div className="rounded-lg bg-white/70 p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">Dress Code</p><p className="mt-3 text-charcoal">{dressCode}</p></div> : null}
        {motif ? <div className="rounded-lg bg-white/70 p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">Motif</p><p className="mt-3 text-charcoal">{motif}</p></div> : null}
        {notes ? <div className="rounded-lg bg-white/70 p-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">Notes</p><p className="mt-3 text-charcoal">{notes}</p></div> : null}
      </div>
    </Section>
  );
}
