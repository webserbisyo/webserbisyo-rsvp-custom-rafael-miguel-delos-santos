"use client";

/**
 * CeremonySection
 *
 * Displays ceremony date and time with a card layout.
 * Extracted from ClientEventRenderer.tsx lines 319–339.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { FadeContent } from "@/client/libs/reactbits";
import { formatDate, formatTime } from "@/client/utils/formatters";
import type { ClientCeremonyData } from "@/client/types/client-view-model";

type CeremonySectionProps = {
  ceremony: ClientCeremonyData;
  mounted: boolean;
};

export function CeremonySection({ ceremony, mounted }: CeremonySectionProps) {
  if (!ceremony) return null;
  return (
    <section id="ceremony" className="py-20 px-4 bg-ivory">
      <div className="max-w-2xl mx-auto">
        <SectionHeading label="The Main Event" title={ceremony.eventLabel || "Wedding Ceremony"} subtitle={ceremony.scheduleNote} />
        <FadeContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-soft">
            <h3 className="font-serif text-2xl text-charcoal mb-4">{mounted ? formatDate(ceremony.eventDate) : ""}</h3>
            {ceremony.eventTime && (
              <p className="text-coral font-medium uppercase tracking-widest text-sm">
                Starts at {formatTime(ceremony.eventTime)}
              </p>
            )}
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
