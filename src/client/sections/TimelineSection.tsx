"use client";

/**
 * TimelineSection
 *
 * Alternating left/right timeline with glassmorphism cards,
 * responsive structural flow, and integrated decorative asset loops.
 * Fixed image quality and mobile structure consistency.
 */

import { motion } from "framer-motion";
import { SectionHeading } from "@/client/components/SectionHeading";
import { formatTime } from "@/client/utils/formatters";
import type { ClientTimelineItem } from "@/client/types/client-view-model";

type TimelineSectionProps = {
  timelineProgram: { items: ClientTimelineItem[] };
};

const ASSET_LOOP = [
  { src: "/beach%20assets%20finalized/20.webp", opacityClass: "opacity-90", rotateClass: "rotate-[15deg]", desktopWidth: "w-48", mobileWidth: "w-20" },
  { src: "/beach%20assets%20finalized/2.webp", opacityClass: "opacity-85", rotateClass: "-rotate-12", desktopWidth: "w-56", mobileWidth: "w-24" },
  { src: "/beach%20assets%20finalized/19.webp", opacityClass: "opacity-100", rotateClass: "scale-x-[-1]", desktopWidth: "w-40", mobileWidth: "w-16" },
  { src: "/beach%20assets%20finalized/21.webp", opacityClass: "opacity-90", rotateClass: "-rotate-[20deg]", desktopWidth: "w-56", mobileWidth: "w-24" },
  { src: "/beach%20assets%20finalized/3.webp", opacityClass: "opacity-85", rotateClass: "rotate-12", desktopWidth: "w-64", mobileWidth: "w-24" },
  { src: "/beach%20assets%20finalized/19.webp", opacityClass: "opacity-100", rotateClass: "", desktopWidth: "w-40", mobileWidth: "w-16" }
];

export function TimelineSection({ timelineProgram }: TimelineSectionProps) {
  if (!timelineProgram?.items?.length) return null;

  return (
    <section id="timeline" className="py-24 px-4 bg-cream overflow-x-hidden relative isolate">
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeading label="Wedding Day Timeline" title="The flow of the day" subtitle="So our guests know what to expect — from sunlit arrivals to bonfire farewells." />

        <div className="relative mt-24 max-w-4xl mx-auto pb-12">
          {/* The softened vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sand/20 via-coral/30 to-sand/20 md:-translate-x-1/2 z-10" />

          <div className="flex flex-col space-y-12 md:space-y-0">
            {timelineProgram.items.map((item, i) => {
              const isEven = i % 2 === 0;
              const formattedTime = formatTime(item.time) || item.time;
              const title = item.title || item.activity || "";
              const asset = ASSET_LOOP[i % ASSET_LOOP.length];
              
              const isImportant = title.toLowerCase().includes("ceremony") || title.toLowerCase().includes("reception");
              const nodeClasses = isImportant
                ? "w-[18px] h-[18px] ring-8 ring-sand/40"
                : "w-4 h-4 ring-4 ring-sand/30";

              const glassCardClasses = "bg-white/70 backdrop-blur-md border border-sand/40 rounded-[24px] shadow-md shadow-cocoa/5 p-6 md:p-8 w-full max-w-[420px] hover:-translate-y-1 transition-transform duration-500 relative group/card z-30";

              // Mobile alternating structure helpers
              const flexRowClass = isEven ? "flex-row" : "flex-row-reverse";
              const timePaddingClass = isEven ? "pl-2" : "pr-2";
              const assetJustifyClass = isEven ? "justify-end" : "justify-start";

              return (
                <div
                  key={i}
                  className="relative flex flex-col md:flex-row w-full group/row md:min-h-[220px]"
                >
                  {/* Timeline Node */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    className={`absolute left-6 md:left-1/2 top-[42px] md:top-1/2 rounded-full bg-coral -translate-x-1/2 md:-translate-y-1/2 z-30 transition-transform duration-500 group-hover/row:scale-110 ${nodeClasses}`}
                  />

                  {/* Mobile Layout */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="md:hidden w-full pl-16 z-20 py-2 relative"
                  >
                    <div className={`flex ${flexRowClass} justify-between items-center mb-3 pr-2`}>
                      <div className={`text-coral font-serif text-2xl tracking-wide ${timePaddingClass} relative z-20`}>
                        {formattedTime}
                      </div>
                      <div className={`relative z-10 pointer-events-none select-none flex items-center ${assetJustifyClass}`}>
                        <img src={asset.src} alt="" aria-hidden="true" width={2048} height={2048} decoding="async" className={`pointer-events-none select-none object-contain ${asset.opacityClass} ${asset.rotateClass} ${asset.mobileWidth} h-auto`} />
                      </div>
                    </div>
                    <div className={glassCardClasses}>
                      {title && <h4 className="font-serif text-xl text-cocoa mb-2 tracking-wide text-balance">{title}</h4>}
                      {item.description && <p className="text-driftwood text-sm leading-relaxed text-balance">{item.description}</p>}
                    </div>
                  </motion.div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex w-full items-center py-6">
                    {isEven ? (
                      <>
                        {/* Left Side: Time + Asset */}
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="w-1/2 flex justify-end pr-20 relative z-10"
                        >
                          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none flex items-center justify-center">
                            <img src={asset.src} alt="" aria-hidden="true" width={2048} height={2048} decoding="async" className={`pointer-events-none select-none object-contain ${asset.opacityClass} ${asset.rotateClass} ${asset.desktopWidth}`} />
                          </div>
                          <div className="text-coral font-serif text-[1.7rem] tracking-wide z-20 transition-transform duration-300 group-hover/row:scale-105 group-hover/row:text-[#c46949]">
                            {formattedTime}
                          </div>
                        </motion.div>
                        {/* Right Side: Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="w-1/2 flex justify-start pl-20 relative z-30"
                        >
                          <div className={glassCardClasses}>
                            {title && <h4 className="font-serif text-[1.4rem] text-cocoa mb-3 tracking-wide text-balance">{title}</h4>}
                            {item.description && <p className="text-driftwood text-base leading-relaxed text-balance">{item.description}</p>}
                          </div>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        {/* Left Side: Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="w-1/2 flex justify-end pr-20 relative z-30"
                        >
                          <div className={glassCardClasses}>
                            {title && <h4 className="font-serif text-[1.4rem] text-cocoa mb-3 tracking-wide text-balance">{title}</h4>}
                            {item.description && <p className="text-driftwood text-base leading-relaxed text-balance">{item.description}</p>}
                          </div>
                        </motion.div>
                        {/* Right Side: Time + Asset */}
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className="w-1/2 flex justify-start pl-20 relative z-10"
                        >
                          <div className="text-coral font-serif text-[1.7rem] tracking-wide z-20 transition-transform duration-300 group-hover/row:scale-105 group-hover/row:text-[#c46949]">
                            {formattedTime}
                          </div>
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none flex items-center justify-center">
                            <img src={asset.src} alt="" aria-hidden="true" width={2048} height={2048} decoding="async" className={`pointer-events-none select-none object-contain ${asset.opacityClass} ${asset.rotateClass} ${asset.desktopWidth}`} />
                          </div>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
