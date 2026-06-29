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

type AttireSectionProps = {
  attireDressCode: ClientAttireData;
};

const COLOR_PALETTE = [
  { name: "Sand", hex: "#E8C97A" },
  { name: "Taupe", hex: "#B0A496" },
  { name: "Sage Green", hex: "#7A9E7E" },
  { name: "Dusty Blue", hex: "#9AB8C2" },
  { name: "Shell Pink", hex: "#FCD5CE" },
];

export function AttireSection({ attireDressCode }: AttireSectionProps) {
  if (!attireDressCode) return null;

  // Format the color motif note at the presentation layer to resolve the ivory contradiction
  const rawMotif = attireDressCode.colorMotifNote || "";
  let displayColorMotif = rawMotif;
  
  if (rawMotif.toLowerCase().includes("ivory")) {
    // Replace Ivory with Taupe
    displayColorMotif = displayColorMotif.replace(/Ivory/gi, "Taupe");
    
    // If it's the exact old motif, replace the end to add Shell Pink
    if (displayColorMotif.toLowerCase().includes("dusty blue") && !displayColorMotif.toLowerCase().includes("shell pink")) {
      displayColorMotif = displayColorMotif.replace(/and\s+Dusty\s+Blue/i, "Dusty Blue, and Shell Pink");
    }
  }

  // Complete the cut-off intro text if present
  let displayIntro = attireDressCode.sectionIntro || "";
  if (displayIntro.trim().endsWith("reserved for")) {
    displayIntro = `${displayIntro.trim()} the bride.`;
  }

  return (
    <section id="attire" className="pt-24 pb-28 md:pb-32 px-4 bg-ivory relative overflow-x-clip">
      
      {/* Absolute Decorative Background Layer - Corner Flowers and Desktop-Only Palm Leaves (z-0) */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none" aria-hidden="true">
        
        {/* Top-Left Flower (17.webp) */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -top-10 -left-10 sm:-top-12 sm:-left-12 md:-top-16 md:-left-16 lg:-top-20 lg:-left-20 w-[9rem] sm:w-[12rem] md:w-[16rem] lg:w-[19rem] h-auto object-contain -rotate-12 opacity-100 transition-[opacity,transform] duration-300"
        />

        {/* Top-Right Flower (16.webp) */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -top-10 -right-10 sm:-top-12 sm:-right-12 md:-top-16 md:-right-16 lg:-top-20 lg:-right-20 w-[9rem] sm:w-[12rem] md:w-[16rem] lg:w-[19rem] h-auto object-contain rotate-12 opacity-100 transition-[opacity,transform] duration-300"
        />

        {/* Bottom-Left Flower (16.webp) - Tucked behind lower card area with positive bottom offset */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -left-10 bottom-2 sm:-left-12 sm:bottom-4 md:-left-16 md:bottom-6 lg:-left-20 lg:bottom-8 w-[9rem] sm:w-[12rem] md:w-[16rem] lg:w-[19rem] h-auto object-contain rotate-12 opacity-100 transition-[opacity,transform] duration-300"
        />

        {/* Bottom-Right Flower (17.webp) - Tucked behind lower card area with positive bottom offset */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -right-10 bottom-2 sm:-right-12 sm:bottom-4 md:-right-16 md:bottom-6 lg:-right-20 lg:bottom-8 w-[9rem] sm:w-[12rem] md:w-[16rem] lg:w-[19rem] h-auto object-contain -rotate-12 opacity-100 transition-[opacity,transform] duration-300"
        />

        {/* Desktop-Only Left Palm Leaf (4.webp) - Framed to the outermost left screen edge */}
        <img
          src="/beach%20assets%20finalized/4.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute lg:top-[40%] xl:top-[42%] -translate-y-1/2 lg:left-[-2rem] xl:left-[-3rem] lg:w-[20rem] xl:w-[24rem] h-auto object-contain opacity-100 z-0 pointer-events-none select-none transition-[opacity,transform] duration-300 hidden lg:block"
        />

        {/* Desktop-Only Right Palm Leaf (5.webp) - Framed to the outermost right screen edge */}
        <img
          src="/beach%20assets%20finalized/5.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute lg:top-[40%] xl:top-[42%] -translate-y-1/2 lg:right-[-2rem] xl:right-[-3rem] lg:w-[20rem] xl:w-[24rem] h-auto object-contain opacity-100 z-0 pointer-events-none select-none transition-[opacity,transform] duration-300 hidden lg:block"
        />
      </div>

      {/* Content Layer (z-10) - Kept at max-w-4xl for the approved scale */}
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Heading */}
        <SectionHeading 
          label="Dress Code" 
          title={attireDressCode.title || "Attire"} 
          subtitle={attireDressCode.shortNote} 
        />

        {/* Featured Attire Illustration & Framing Leaves Wrapper */}
        <div className="relative w-full flex justify-center mb-10 select-none">
          
          {/* Mobile/Tablet Left Side Palm Leaf (4.png) - Aligned to frame the illustration, hidden on desktop */}
          <img
            src="/beach%20assets%20finalized/4.webp"
            alt=""
            aria-hidden="true"
            width={2048}
            height={2048}
            decoding="async"
            className="absolute left-[-2rem] sm:left-[-3rem] md:left-[-4rem] top-1/2 -translate-y-1/2 w-[7rem] sm:w-[11rem] md:w-[14rem] h-auto object-contain opacity-100 z-0 pointer-events-none select-none transition-[opacity,transform] duration-300 lg:hidden"
          />

          {/* Mobile/Tablet Right Side Palm Leaf (5.png) - Aligned to frame the illustration, hidden on desktop */}
          <img
            src="/beach%20assets%20finalized/5.webp"
            alt=""
            aria-hidden="true"
            width={2048}
            height={2048}
            decoding="async"
            className="absolute right-[-2rem] sm:right-[-3rem] md:right-[-4rem] top-1/2 -translate-y-1/2 w-[7rem] sm:w-[11rem] md:w-[14rem] h-auto object-contain opacity-100 z-0 pointer-events-none select-none transition-[opacity,transform] duration-300 lg:hidden"
          />

          {/* Soft warm radial glow backdrop */}
          <div className="absolute inset-0 m-auto w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-coral/10 via-sand/15 to-transparent blur-3xl pointer-events-none z-0" />
          
          {/* Main Attire Image - Strictly preserved approved visual scale */}
          <img
            src="/beach%20assets%20finalized/attire.webp"
            alt="Tropical formal attire examples"
            width={2752}
            height={1536}
            decoding="async"
            className="relative z-10 w-[92vw] max-w-[420px] sm:max-w-[560px] md:max-w-[680px] lg:max-w-[760px] h-auto object-contain pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Standalone Guideline Paragraph */}
        {displayIntro && (
          <p className="text-[#725d4f] text-center text-sm md:text-base leading-relaxed max-w-2xl mt-4 mb-12 px-4 relative z-10 transition-opacity duration-300">
            {displayIntro}
          </p>
        )}

        {/* Compact Dress Code Spotlight Glassmorphism Card */}
        <AnimatedContent>
          <SpotlightCard 
            className="w-full max-w-2xl bg-white/65 backdrop-blur-md border border-sand/40 p-6 sm:p-8 rounded-3xl text-center shadow-[0_12px_40px_rgba(139,104,58,0.06)] hover:border-sand/60 transition-[border-color,box-shadow] duration-500"
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

            {/* Subtle Divider */}
            <div className="h-px w-20 bg-sand/30 mx-auto mb-6" />

            {/* Color Palette Chips */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              {COLOR_PALETTE.map((color) => (
                <div key={color.name} className="flex flex-col items-center group select-none">
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-sand/30 shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#725d4f] mt-2 uppercase">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </AnimatedContent>

      </div>
    </section>
  );
}
