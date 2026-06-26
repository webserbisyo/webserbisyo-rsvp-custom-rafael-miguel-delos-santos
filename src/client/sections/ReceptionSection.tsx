"use client";

/**
 * ReceptionSection
 *
 * Displays reception venue, date, time range, and map link.
 * Aligned with exact fields:
 *  - reception.receptionLabel
 *  - reception.startTime
 *  - reception.endTime
 *  - reception.receptionNote
 *  - reception.venueName
 *  - reception.fullAddress
 *  - reception.googleMapsLink
 *  - ceremony.eventDate (for deriving the full date display)
 *
 * Fixed:
 *  - Inner vertical scrollbar bug resolved by removing overflow-x-hidden from the section
 *    and wrapping large decorative assets in an absolute inset-0 clipping container.
 *  - Sourced bird assets using space-resolved paths.
 *  - Symmetrical large corner flower framing at bottom-left and bottom-right corners.
 *  - Scaled up decorative birds on desktop for enhanced visual impact while maintaining
 *    flawless responsive mobile scaling.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { FadeContent } from "@/client/libs/reactbits";
import { SpotlightCard } from "@/client/components/SpotlightCard";
import { MapPin, Clock3, Sparkles, ExternalLink } from "@/client/libs/icons";
import { formatTime, formatDate } from "@/client/utils/formatters";
import type { ClientReceptionData, ClientCeremonyData } from "@/client/types/client-view-model";

type ReceptionSectionProps = {
  reception: ClientReceptionData;
  ceremony?: ClientCeremonyData;
};

export function ReceptionSection({ reception, ceremony }: ReceptionSectionProps) {
  if (!reception) return null;

  const hasTimeRange = reception.startTime || reception.endTime;
  const hasMapLink = Boolean(reception.googleMapsLink);

  // Derive display date from the Ceremony event date source
  const derivedDate = ceremony?.eventDate ? formatDate(ceremony.eventDate) : "";

  // Format the time range display
  const formattedTimeRange = hasTimeRange
    ? `${reception.startTime ? formatTime(reception.startTime) : ""}${
        reception.startTime && reception.endTime ? " – " : ""
      }${reception.endTime ? formatTime(reception.endTime) : ""}`
    : "";

  return (
    <section 
      id="reception" 
      className="pt-32 pb-24 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 px-4 bg-ivory relative overflow-visible"
    >
      {/* Decorative Assets Wrapper - clips horizontal and vertical overflow of large assets 
          internally to prevent page-level horizontal scrolling or section-level inner vertical scrolling */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Decorative Bird Assets — large elegant top-side framing elements, scaled up on desktop */}
        <img
          src="/beach%20assets%20finalized/7.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute top-6 left-4 sm:top-8 sm:left-8 md:top-10 md:left-12 lg:top-12 lg:left-16 xl:top-16 xl:-left-8 w-28 sm:w-40 md:w-56 lg:w-80 xl:w-[380px] 2xl:w-[440px] h-auto object-contain select-none opacity-45 sm:opacity-50 transition-[opacity,transform] duration-300"
        />
        <img
          src="/beach%20assets%20finalized/8.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute top-6 right-4 sm:top-8 sm:right-8 md:top-10 md:right-12 lg:top-12 lg:right-16 xl:top-16 xl:-right-8 w-28 sm:w-40 md:w-56 lg:w-80 xl:w-[380px] 2xl:w-[440px] h-auto object-contain select-none opacity-45 sm:opacity-50 transition-[opacity,transform] duration-300"
        />

        {/* Decorative Corner Flowers — framing the lower portion of the section with tight compositional coupling */}
        {/* Bottom-Left Corner Flower */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -left-10 bottom-0 w-32 sm:w-56 md:w-72 lg:w-[350px] xl:w-[420px] h-auto object-contain select-none transform transition-[opacity,transform] duration-300"
        />

        {/* Bottom-Right Corner Flower */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -right-10 bottom-0 w-32 sm:w-56 md:w-72 lg:w-[350px] xl:w-[420px] h-auto object-contain select-none transform scale-x-[-1] transition-[opacity,transform] duration-300"
        />
      </div>

      {/* Main content — centered stack, layered above background elements */}
      <div className="max-w-2xl mx-auto relative z-20">
        <SectionHeading
          label="The Party"
          title={reception.receptionLabel || "Wedding Reception"}
        />

        <FadeContent>
          <SpotlightCard
            className="bg-white/65 backdrop-blur-md border border-sand/40 p-6 sm:p-10 rounded-3xl shadow-[0_12px_40px_rgba(139,104,58,0.06)] hover:border-sand/60 transition-[border-color,box-shadow] duration-500"
            spotlightColor="rgba(232, 201, 122, 0.08)"
          >
            <div className="space-y-6 sm:space-y-8">
              {/* Venue Name & Full Address */}
              {(reception.venueName || reception.fullAddress) && (
                <div className="flex gap-4 sm:gap-6 items-start p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-2xl transition-colors hover:bg-cream/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-cream flex items-center justify-center border border-sand/20 text-coral shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    {reception.venueName && (
                      <h3 className="font-serif text-lg font-bold text-cocoa leading-snug">
                        {reception.venueName}
                      </h3>
                    )}
                    {reception.fullAddress && (
                      <p className="text-driftwood text-sm md:text-base mt-1.5 leading-relaxed">
                        {reception.fullAddress}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Reconstructed Date & Time Row */}
              {(derivedDate || hasTimeRange) && (
                <div className="flex gap-4 sm:gap-6 items-start p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-2xl transition-colors hover:bg-cream/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-cream flex items-center justify-center border border-sand/20 text-coral shadow-sm">
                    <Clock3 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-base font-semibold text-cocoa">Time</h4>
                    {derivedDate && (
                      <p className="text-driftwood text-sm md:text-base mt-1.5 font-medium leading-relaxed">
                        {derivedDate}
                      </p>
                    )}
                    {formattedTimeRange && (
                      <p className="text-coral font-medium uppercase tracking-widest text-xs mt-1">
                        {formattedTimeRange}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Reception Note */}
              {reception.receptionNote && (
                <div className="flex gap-4 sm:gap-6 items-start p-2 sm:p-3 -mx-2 sm:-mx-3 rounded-2xl transition-colors hover:bg-cream/30">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-cream flex items-center justify-center border border-sand/20 text-coral shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-base font-semibold text-cocoa">Note</h4>
                    <p className="text-driftwood text-sm md:text-base mt-1.5 leading-relaxed">
                      {reception.receptionNote}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </SpotlightCard>

          {/* CTA Button — centered below the card */}
          {hasMapLink && (
            <div className="mt-8 flex justify-center relative z-30">
              <a
                href={reception.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-coral hover:bg-[#8C4520] text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:shadow-[0_0_20px_rgba(201,94,53,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out cursor-pointer"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>
          )}
        </FadeContent>
      </div>
    </section>
  );
}
