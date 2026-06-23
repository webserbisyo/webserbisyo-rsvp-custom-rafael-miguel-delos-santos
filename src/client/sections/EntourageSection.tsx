"use client";

/**
 * EntourageSection
 *
 * Wedding party grid with group cards.
 * Extracted from ClientEventRenderer.tsx lines 746–770.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientEntourageGroup } from "@/client/types/client-view-model";

type EntourageSectionProps = {
  entourage: { groups: ClientEntourageGroup[]; introLine?: string };
};

export function EntourageSection({ entourage }: EntourageSectionProps) {
  if (!entourage?.groups?.length) return null;
  return (
    <section id="entourage" className="py-20 px-4 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <SectionHeading label="Wedding Party" title="Entourage" subtitle={entourage.introLine} />
        <AnimatedContent>
          <div className="grid md:grid-cols-2 gap-8">
            {entourage.groups.map((g, i) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-soft text-center">
                <h4 className="text-coral font-medium tracking-widest uppercase mb-4 text-sm">{g.groupTitle || g.role}</h4>
                <ul className="space-y-2">
                  {(typeof g.names === "string" ? g.names.split(/[\n,]/).map((n: string) => n.trim()).filter(Boolean) : g.names ?? []).map((name: string, j: number) => (
                    <li key={j} className="text-cocoa font-serif text-lg">{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
