"use client";

/**
 * AttireSection
 *
 * Dress code and color motif display.
 * Phase 5 Polish & Correction Pass:
 * - Fixed bottom-right flower copy-paste typo (changed lg:-left-20 to lg:-right-20) to display the bottom-right flower.
 * - Implemented responsive palm leaf framing:
 *   - Mobile/Tablet: Smaller leaves remain inside the attire image wrapper (w-[7rem] to md:w-[14rem]), hidden on desktop (lg:hidden).
 *   - Desktop: Larger leaves render at the section-level background (hidden lg:block), positioned at the outermost screen sides
 *     (lg:left-[-2rem] / lg:right-[-2rem]) and vertically aligned with the illustration area (lg:top-[40%]).
 * - All decorative PNGs render at original visual quality (opacity-100, no filters/blurs).
 * - Main attire image size is strictly preserved at the restored approved scale.
 * - Shitted bottom flowers to positive bottom offsets to prevent layout clipping and increased section bottom padding to prevent overlaps.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import { SpotlightCard } from "@/client/components/SpotlightCard";
import type { ClientAttireData } from "@/client/types/client-view-model";
import type { SectionSurface } from "@/client/client-section-registry";

type AttireSectionProps = {
  attireDressCode: ClientAttireData;
  surface: SectionSurface;
};

export function AttireSection({
  attireDressCode,
  surface,
}: AttireSectionProps) {
  if (!attireDressCode) return null;

  const displayColorMotif = attireDressCode.colorMotifNote || "";

  // Complete the cut-off intro text if present
  let displayIntro = attireDressCode.sectionIntro || "";
  if (displayIntro.trim().endsWith("reserved for")) {
    displayIntro = `${displayIntro.trim()} the bride.`;
  }

  const palette = attireDressCode.palette || [];

  return (
    <section
      id="attire"
      data-tone={surface}
      className="wedding-section pt-24 pb-28 md:pb-32 px-4 relative overflow-x-clip"
    >
      {/* Content Layer (z-10) - Kept at max-w-4xl for the approved scale */}
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-30">
        {/* Heading */}
        <SectionHeading
          label="Dress Code"
          title={attireDressCode.title || "Attire"}
          subtitle={attireDressCode.shortNote}
        />

        {/* Standalone Guideline Paragraph */}
        {displayIntro && (
          <p className="text-[#725d4f] text-center text-sm md:text-base leading-relaxed max-w-2xl mt-4 mb-12 px-4 relative z-10 transition-opacity duration-300">
            {displayIntro}
          </p>
        )}

        {/* Compact Dress Code Spotlight Glassmorphism Card */}
        <AnimatedContent>
          <SpotlightCard
            className="w-full max-w-2xl bg-white/65 backdrop-blur-md border border-sand/40 p-6 sm:p-8 rounded-3xl text-center shadow-[color:var(--wedding-shadow-panel)] hover:border-sand/60 transition-[border-color,box-shadow] duration-500"
            spotlightColor="rgba(232, 201, 122, 0.16)"
          >
            {/* Dress Code Title / Note */}
            {attireDressCode.dressCodeNote && (
              <h3 className="font-serif text-2xl md:text-3xl text-[#302722] font-semibold mb-2">
                {attireDressCode.dressCodeNote}
              </h3>
            )}

            {/* Color Motif Note Text */}
            {displayColorMotif && (
              <p className="text-coral text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold mb-6">
                {displayColorMotif}
              </p>
            )}

            {palette.length > 0 && (
              <>
                {/* Subtle Divider */}
                <div className="h-px w-20 bg-sand/30 mx-auto mb-6" />

                {/* Color Palette Chips */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                  {palette.map((color) => (
                    <div
                      key={color.name}
                      className="flex flex-col items-center group select-none"
                    >
                      <div
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-sand/30 shadow-sm transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                        aria-label={`Color swatch: ${color.name}`}
                      />
                      <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#725d4f] mt-2 uppercase">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </SpotlightCard>
        </AnimatedContent>
      </div>
    </section>
  );
}
