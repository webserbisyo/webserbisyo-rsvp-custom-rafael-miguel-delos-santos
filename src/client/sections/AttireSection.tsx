"use client";

/**
 * AttireSection
 *
 * Dress code and color motif display.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import { AttireColorSwatch } from "@/client/components/attire/AttireColorSwatch";
import { clientConfig } from "@/client/client.config";
import type { ClientAttireData } from "@/client/types/client-view-model";
import type { SectionSurface } from "@/client/client-section-registry";

type AttireSectionProps = {
  attireDressCode: ClientAttireData;
  surface: SectionSurface;
};

const DEFAULT_PALETTE = [
  { label: "Champagne", color: "#D8C8A9" },
  { label: "Muted Gold", color: "#9A7B45" },
  { label: "Sage Olive", color: "#7A836B" },
  { label: "Warm Taupe", color: "#A99583" },
  { label: "Cocoa Black", color: "#3A302A" },
];

export function AttireSection({
  attireDressCode,
  surface,
}: AttireSectionProps) {
  if (!attireDressCode) return null;

  // Complete the cut-off intro text if present
  let displayIntro = attireDressCode.sectionIntro || "";
  if (displayIntro.trim().endsWith("reserved for")) {
    displayIntro = `${displayIntro.trim()} the bride.`;
  }

  // Retrieve client-local attire palette
  const configuredPalette =
    (clientConfig.sections as { attire?: { palette?: Array<{ label: string; color: string }> } })
      ?.attire?.palette;
  const palette = configuredPalette && configuredPalette.length > 0
    ? configuredPalette
    : DEFAULT_PALETTE;

  return (
    <section
      id="attire"
      data-tone={surface}
      className="wedding-section pt-24 pb-28 md:pb-32 px-4 relative overflow-x-clip"
    >
      {/* Content Layer (z-10) */}
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-30">
        {/* Heading */}
        <SectionHeading
          label="Dress Code"
          title={attireDressCode.title || "Attire"}
          subtitle={attireDressCode.shortNote}
        />

        {/* Standalone Guideline Paragraph */}
        {displayIntro && (
          <p className="text-[color:var(--wedding-attire-card-muted,#443d35)] text-center text-sm md:text-base leading-relaxed max-w-2xl mt-4 mb-12 px-4 relative z-10 transition-opacity duration-300">
            {displayIntro}
          </p>
        )}

        {/* Compact Warm Ivory Dress Code Card */}
        <AnimatedContent>
          <div className="w-full max-w-2xl bg-[color:var(--wedding-attire-card-surface,#fbf8f2)] border border-[color:var(--wedding-attire-card-border,#d8c8a9)] p-6 sm:p-8 rounded-3xl text-center shadow-floating transition-[border-color,box-shadow] duration-500">
            {/* Dress Code Title / Note */}
            {attireDressCode.dressCodeNote && (
              <h3 className="font-serif text-2xl md:text-3xl text-[color:var(--wedding-attire-card-heading,#1f1c18)] font-semibold mb-2">
                {attireDressCode.dressCodeNote}
              </h3>
            )}

            {/* Clean Category Subtitle */}
            <p className="text-[color:var(--wedding-attire-accent,#72501b)] text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold mb-6">
              SUGGESTED GUEST COLORS
            </p>

            {/* Subtle Divider */}
            <div className="h-px w-20 bg-[color:var(--wedding-attire-card-border,#d8c8a9)] mx-auto mb-6 opacity-60" />

            {/* Color Palette Swatches */}
            <div className="flex flex-wrap justify-center gap-y-6 gap-x-4 sm:gap-y-8 sm:gap-x-6 max-w-lg mx-auto">
              {palette.map((item) => (
                <AttireColorSwatch
                  key={item.label}
                  label={item.label}
                  color={item.color}
                />
              ))}
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
