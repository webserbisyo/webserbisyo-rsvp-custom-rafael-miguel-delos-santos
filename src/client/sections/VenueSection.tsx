"use client";

/**
 * VenueSection
 *
 * Displays venue name, address, and map link.
 * Extracted from ClientEventRenderer.tsx lines 341–361.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { FadeContent } from "@/client/libs/reactbits";
import type { ClientVenueData } from "@/client/types/client-view-model";

type VenueSectionProps = {
  venue: ClientVenueData;
};

export function VenueSection({ venue }: VenueSectionProps) {
  if (!venue) return null;
  return (
    <section id="venue" className="py-20 px-4 bg-cream">
      <div className="max-w-2xl mx-auto">
        <SectionHeading label="Location" title={venue.venueName || "Venue"} subtitle={venue.arrivalNote} />
        <FadeContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 text-center shadow-soft">
            <p className="text-driftwood mb-6">{venue.address}</p>
            {venue.mapsLink && (
              <a href={venue.mapsLink} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-coral text-white rounded-full text-sm font-semibold tracking-wide hover:bg-[#8C4520] transition shadow-card">
                View on Map ✦
              </a>
            )}
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
