"use client";

/**
 * ReceptionSection
 *
 * Displays reception venue, time range, and map link.
 * Extracted from ClientEventRenderer.tsx lines 628–654.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { FadeContent } from "@/client/libs/reactbits";
import { formatTime } from "@/client/utils/formatters";
import type { ClientReceptionData } from "@/client/types/client-view-model";

type ReceptionSectionProps = {
  reception: ClientReceptionData;
};

export function ReceptionSection({ reception }: ReceptionSectionProps) {
  if (!reception) return null;
  return (
    <section id="reception" className="py-20 px-4 bg-ivory">
      <div className="max-w-2xl mx-auto">
        <SectionHeading label="The Party" title={reception.title || "Reception"} subtitle={reception.note} />
        <FadeContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-soft">
            <h3 className="font-serif text-2xl text-charcoal mb-4">{reception.venueName}</h3>
            {reception.address && <p className="text-driftwood mb-6">{reception.address}</p>}
            {reception.startTime && (
              <p className="text-coral font-medium uppercase tracking-widest text-sm mb-6">
                Starts at {formatTime(reception.startTime)} {reception.endTime && `- ${formatTime(reception.endTime)}`}
              </p>
            )}
            {reception.mapsLink && (
              <a href={reception.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-coral text-white rounded-full text-sm font-semibold tracking-wide hover:bg-[#8C4520] transition shadow-card">
                View on Map ✦
              </a>
            )}
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
