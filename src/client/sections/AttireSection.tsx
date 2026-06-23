"use client";

/**
 * AttireSection
 *
 * Dress code and color motif display.
 * Extracted from ClientEventRenderer.tsx lines 799–816.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientAttireData } from "@/client/types/client-view-model";

type AttireSectionProps = {
  attireDressCode: ClientAttireData;
};

export function AttireSection({ attireDressCode }: AttireSectionProps) {
  if (!attireDressCode) return null;
  return (
    <section id="attire" className="py-20 px-4 bg-ivory">
      <div className="max-w-2xl mx-auto">
        <SectionHeading label="Dress Code" title={attireDressCode.title || "Attire"} subtitle={attireDressCode.shortNote} />
        <AnimatedContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-soft">
            {attireDressCode.sectionIntro && <p className="text-cocoa/80 text-sm mb-6">{attireDressCode.sectionIntro}</p>}
            {attireDressCode.dressCodeNote && <h3 className="font-serif text-2xl text-charcoal mb-2">{attireDressCode.dressCodeNote}</h3>}
            {attireDressCode.colorMotifNote && <p className="text-coral text-sm uppercase tracking-widest font-semibold">{attireDressCode.colorMotifNote}</p>}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
