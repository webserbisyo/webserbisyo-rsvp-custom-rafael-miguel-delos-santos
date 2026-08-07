"use client";

/**
 * AttireSection
 *
 * Dress code and color motif display.
 */

import Image from "next/image";
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

  // Retrieve client-local attire configuration
  const attireConfig = (
    clientConfig.sections as {
      attire?: {
        illustration?: {
          src: string;
          alt: string;
          width: number;
          height: number;
        };
        palette?: Array<{ label: string; color: string }>;
      };
    }
  )?.attire;

  const illustration = attireConfig?.illustration;
  const configuredPalette = attireConfig?.palette;
  const palette =
    configuredPalette && configuredPalette.length > 0
      ? configuredPalette
      : DEFAULT_PALETTE;

  return (
    <section
      id="attire"
      data-tone={surface}
      className="wedding-section pt-24 pb-28 md:pb-32 px-4 relative overflow-x-clip"
    >
      {/* Content Layer (z-30) */}
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-30">
        {/* Heading */}
        <SectionHeading
          label="Dress Code"
          title={attireDressCode.title || "Attire"}
          subtitle={attireDressCode.shortNote}
        />

        {/* Four-Model Fashion Illustration */}
        {illustration && (
          <div className="w-full max-w-[760px] md:max-w-[900px] mt-4 mb-6 sm:mt-6 sm:mb-8 px-2 flex justify-center">
            <Image
              src={illustration.src}
              alt={illustration.alt}
              width={illustration.width}
              height={illustration.height}
              sizes="(max-width: 768px) calc(100vw - 32px), 900px"
              className="h-auto w-full object-contain select-none pointer-events-none"
            />
          </div>
        )}

        {/* Standalone Guideline Paragraph */}
        {displayIntro && (
          <p className="text-[color:var(--wedding-attire-card-muted,#443d35)] text-center text-sm md:text-base leading-relaxed max-w-2xl mt-0 mb-8 sm:mb-10 px-4 relative z-10 transition-opacity duration-300">
            {displayIntro}
          </p>
        )}

        {/* Compact Warm Ivory Dress Code Card */}
        <AnimatedContent className="w-full max-w-2xl mx-auto">
          <div className="w-full bg-[color:var(--wedding-attire-card-surface,#fbf8f2)] border border-[color:var(--wedding-attire-card-border,#d8c8a9)] p-4 sm:p-6 rounded-3xl text-center shadow-floating transition-[border-color,box-shadow] duration-500">
            {/* Dress Code Title / Note */}
            {attireDressCode.dressCodeNote && (
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-[color:var(--wedding-attire-card-heading,#1f1c18)] font-semibold mb-1">
                {attireDressCode.dressCodeNote}
              </h3>
            )}

            {/* Clean Category Subtitle */}
            <p className="text-[color:var(--wedding-attire-accent,#72501b)] text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] font-semibold mb-3">
              SUGGESTED GUEST COLORS
            </p>

            {/* Subtle Divider */}
            <div className="h-px w-16 sm:w-20 bg-[color:var(--wedding-attire-card-border,#d8c8a9)] mx-auto mb-4 opacity-60" />

            {/* Color Palette Swatches (One horizontal row of 5 equal columns) */}
            <div className="grid grid-cols-5 gap-1 sm:gap-3 w-full max-w-xl mx-auto items-start">
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
