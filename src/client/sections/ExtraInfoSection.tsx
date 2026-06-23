"use client";

/**
 * ExtraInfoSection
 *
 * Accordion-style FAQ with icon-based categories and expand/collapse.
 * Extracted from ClientEventRenderer.tsx lines 818–906.
 * Includes the getIconForTitle helper.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, Anchor, Bed, Sparkles, ChevronDown, HelpCircle, MapPin, Gift } from "lucide-react";
import { SectionHeading } from "@/client/components/SectionHeading";
import type { ClientExtraInfoItem } from "@/client/types/client-view-model";

function getIconForTitle(title: string) {
  const t = title.toLowerCase();
  if (t.includes("shuttle") || t.includes("transport") || t.includes("service")) return Bus;
  if (t.includes("parking") || t.includes("car")) return Anchor;
  if (t.includes("accommodation") || t.includes("hotel") || t.includes("stay") || t.includes("room")) return Bed;
  if (t.includes("confetti") || t.includes("policy") || t.includes("no ")) return Sparkles;
  if (t.includes("gift") || t.includes("registry")) return Gift;
  if (t.includes("venue") || t.includes("location") || t.includes("map")) return MapPin;
  return HelpCircle;
}

type ExtraInfoSectionProps = {
  extraInfo: {
    sectionTitle?: string;
    sectionIntro?: string;
    items: ClientExtraInfoItem[];
  };
};

export function ExtraInfoSection({ extraInfo }: ExtraInfoSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!extraInfo?.items?.length) return null;

  return (
    <section id="extra-info" className="py-24 px-4 bg-cream overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <SectionHeading label="Details" title={extraInfo.sectionTitle || "Additional Details"} subtitle={extraInfo.sectionIntro} />

        <div className="space-y-4 mt-12">
          {extraInfo.items.map((item, i) => {
            const IconComponent = getIconForTitle(item.title);
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-[#E6D5C3]/40 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <div className="p-6 md:p-8 flex items-center justify-between gap-4 select-none">
                  <div className="flex items-center gap-5 sm:gap-6">
                    {/* Icon Container */}
                    <div className="w-14 h-14 rounded-full bg-[#EBF7F5] flex items-center justify-center text-[#2D7A70] shrink-0 transition-transform duration-300 group-hover:scale-105">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <div>
                      <h4 className="font-serif text-xl md:text-2xl text-cocoa font-medium tracking-wide">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Chevron indicator */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-sand shrink-0 p-1"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Expanded Content with smooth height transition */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 pb-8 md:px-8 md:pb-10 pl-[80px] md:pl-[96px] pr-6 md:pr-12">
                        <div className="h-px bg-gradient-to-r from-[#E6D5C3]/30 via-[#E6D5C3]/10 to-transparent mb-5" />
                        <p className="text-driftwood text-sm md:text-base leading-relaxed text-balance">
                          {item.details}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
