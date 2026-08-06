"use client";

/**
 * ExtraInfoSection (Details)
 *
 * Displays additional guest reminder notes in a responsive glassmorphism grid.
 * Copies and adapts the clean, highly polished shell placement strategy from the
 * finalized Entourage section (EntourageSection.tsx) as the decorative source of truth.
 *
 * Features:
 * - Clean, non-accordion cards visible by default (no Lucide icons, no chevrons).
 * - Dynamically generated elegant numbered badges (NOTE 01 ✦, NOTE 02 ✦, etc.).
 * - **Gutter-based Desktop Framing**: mathematically calculated side offsets place 4 corner
 *   shells in the gutters completely outside the card/heading area (hidden lg:block).
 * - **Gap-based Mobile/Tablet Framing**: renders mobile-only shell accents (lg:hidden) inside
 *   card vertical gaps behind the cards (z-10) and a bottom closing shell under the last card.
 * - **Clean Heading Zone**: no decorations are rendered in the top area on mobile/tablet, keeping
 *   the section label, title, and intro 100% clean and uncompromised.
 * - Original PNG color and visual quality strictly preserved (opacity-100, no blurs/filters).
 * - Early return safety check for empty data states.
 */

import { motion } from "framer-motion";
import { SectionHeading } from "@/client/components/SectionHeading";
import type { ClientExtraInfoItem } from "@/client/types/client-view-model";
import type { SectionSurface } from "@/client/client-section-registry";

type ExtraInfoSectionProps = {
  extraInfo: {
    sectionTitle?: string;
    sectionIntro?: string;
    items: ClientExtraInfoItem[];
  };
  surface: SectionSurface;
};

export function ExtraInfoSection({
  extraInfo,
  surface,
}: ExtraInfoSectionProps) {
  if (!extraInfo?.items?.length) return null;

  return (
    <section
      id="extra-info"
      data-tone={surface}
      className="wedding-section relative overflow-x-clip px-4 pt-24 pb-28 sm:py-28 lg:py-32"
    >
      {/* 2. Main Content Wrapper (z-10) */}
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Heading — kept completely clean of background assets on mobile */}
        <SectionHeading
          label="Details"
          title={extraInfo.sectionTitle || "Additional Details"}
          subtitle={extraInfo.sectionIntro}
        />

        {/* 3. Cards Grid Layer - Mobile/Tablet 1-Column Stack, Desktop 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 mt-12 md:mt-16 w-full">
          {extraInfo.items.map((item, index) => {
            const badgeNumber = String(index + 1).padStart(2, "0");

            return (
              <div key={index} className="relative group/card-wrapper">
                {/* 4. Glassmorphism Note Card (z-20) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/65 backdrop-blur-md border border-sand/40 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-soft hover:border-sand/60 transition-[border-color,box-shadow] duration-300 relative z-20 h-full flex flex-col justify-center"
                >
                  {/* Badge Row */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] sm:text-xs font-semibold tracking-[0.24em] uppercase text-coral">
                      NOTE {badgeNumber}
                    </span>
                    <span className="text-sand text-xs select-none">✦</span>
                  </div>

                  {/* Card Title */}
                  <h4 className="font-serif text-xl md:text-2xl text-[#302722] font-semibold">
                    {item.title}
                  </h4>

                  {/* Elegant Divider */}
                  <div className="h-px w-16 bg-sand/35 my-4" />

                  {/* Card Body Description */}
                  {item.details && (
                    <p className="text-[#725d4f] text-sm md:text-base leading-relaxed text-balance">
                      {item.details}
                    </p>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
