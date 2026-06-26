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

type ExtraInfoSectionProps = {
  extraInfo: {
    sectionTitle?: string;
    sectionIntro?: string;
    items: ClientExtraInfoItem[];
  };
};

// Rotation and transform variations for mobile gap-based shells
const MOBILE_SHELL_TRANSFORMS = [
  "rotate-[-10deg]",
  "rotate-[12deg] scale-x-[-1]",
  "rotate-[6deg] scale-y-[-1]",
  "rotate-[-14deg] scale-x-[-1]"
];

export function ExtraInfoSection({ extraInfo }: ExtraInfoSectionProps) {
  if (!extraInfo?.items?.length) return null;

  return (
    <section
      id="extra-info"
      className="relative isolate overflow-x-clip bg-cream px-4 pt-24 pb-28 sm:py-28 lg:py-32"
    >
      {/* 1. Gallery-style Global Desktop Shell Layer (z-0, hidden lg:block) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden lg:block select-none"
      >
        {/* Top-Left Shell (14.png) - top side, left gutter */}
        <img
          src="/beach%20assets%20finalized/14.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-[max(1rem,calc((100vw-64rem)/2-12rem))] top-24 w-72 rotate-[-10deg] opacity-100 lg:w-80 xl:w-96"
        />

        {/* Top-Right Shell (15.png) - top side, right gutter */}
        <img
          src="/beach%20assets%20finalized/15.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-[max(1rem,calc((100vw-64rem)/2-12rem))] top-24 w-72 rotate-[10deg] opacity-100 lg:w-80 xl:w-96"
        />

        {/* Bottom-Left Shell (15.png) - bottom side, left gutter */}
        <img
          src="/beach%20assets%20finalized/15.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute bottom-24 left-[max(1rem,calc((100vw-64rem)/2-12rem))] w-72 rotate-[12deg] opacity-100 lg:w-80 xl:w-96"
        />

        {/* Bottom-Right Shell (14.png) - bottom side, right gutter */}
        <img
          src="/beach%20assets%20finalized/14.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute bottom-24 right-[max(1rem,calc((100vw-64rem)/2-12rem))] w-72 rotate-[-12deg] opacity-100 lg:w-80 xl:w-96"
        />
      </div>

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
            const isLastCard = index === extraInfo.items.length - 1;

            return (
              <div key={index} className="relative group/card-wrapper">
                
                {/* Mobile/Tablet Gap Shells (lg:hidden, z-10) - extending into the vertical gaps */}
                {!isLastCard && (
                  <img
                    src={index % 2 === 0 ? "/beach%20assets%20finalized/14.webp" : "/beach%20assets%20finalized/15.webp"}
                    alt=""
                    aria-hidden="true"
                    width={2048}
                    height={2048}
                    decoding="async"
                    className={`pointer-events-none absolute -bottom-14 z-10 block w-48 h-auto object-contain select-none opacity-100 lg:hidden ${
                      index % 2 === 0 
                        ? `-left-8 ${MOBILE_SHELL_TRANSFORMS[index % MOBILE_SHELL_TRANSFORMS.length]}` 
                        : `-right-8 ${MOBILE_SHELL_TRANSFORMS[index % MOBILE_SHELL_TRANSFORMS.length]}`
                    }`}
                  />
                )}

                {/* Mobile/Tablet bottom closing shell accent under the very last card */}
                {isLastCard && (
                  <img
                    src="/beach%20assets%20finalized/14.webp"
                    alt=""
                    aria-hidden="true"
                    width={2048}
                    height={2048}
                    decoding="async"
                    className="pointer-events-none absolute left-1/2 -bottom-20 z-10 w-44 h-auto object-contain -translate-x-1/2 rotate-[6deg] select-none opacity-100 lg:hidden"
                  />
                )}

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
                  <h4 className="font-serif text-xl md:text-2xl text-cocoa font-medium">
                    {item.title}
                  </h4>

                  {/* Elegant Divider */}
                  <div className="h-px w-16 bg-sand/35 my-4" />

                  {/* Card Body Description */}
                  {item.details && (
                    <p className="text-cocoa/80 text-sm md:text-base leading-relaxed text-balance">
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
