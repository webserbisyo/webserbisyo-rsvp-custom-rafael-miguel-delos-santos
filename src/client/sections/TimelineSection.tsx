"use client";

/**
 * TimelineSection
 *
 * Alternating left/right timeline with vertical line, dots,
 * and hover animations.
 * Extracted from ClientEventRenderer.tsx lines 656–744.
 */

import { motion } from "framer-motion";
import { SectionHeading } from "@/client/components/SectionHeading";
import { formatTime } from "@/client/utils/formatters";
import type { ClientTimelineItem } from "@/client/types/client-view-model";

type TimelineSectionProps = {
  timelineProgram: { items: ClientTimelineItem[] };
};

export function TimelineSection({ timelineProgram }: TimelineSectionProps) {
  if (!timelineProgram?.items?.length) return null;
  return (
    <section id="timeline" className="py-24 px-4 bg-ivory overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeading label="Wedding Day Timeline" title="The flow of the day" subtitle="So our guests know what to expect — from sunlit arrivals to bonfire farewells." />

        <div className="relative mt-24 max-w-4xl mx-auto pb-8">
          {/* The vertical line */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#D47A5A]/30 md:-translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {timelineProgram.items.map((item, i) => {
              const isEven = i % 2 === 0;
              const formattedTime = formatTime(item.time) || item.time;
              const title = item.title || item.activity;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative flex flex-col md:flex-row items-center w-full group/row"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[24px] md:left-1/2 top-[34px] md:top-1/2 w-4 h-4 rounded-full bg-[#D47A5A] -translate-x-1/2 md:-translate-y-1/2 shadow-[0_0_0_8px_#FDF6ED] z-10 transition-transform duration-500 group-hover/row:scale-125" />

                  {/* Mobile Layout */}
                  <div className="md:hidden w-full pl-16">
                    <div className="text-[#D47A5A] font-serif text-2xl tracking-wide mb-3 mt-2">
                      {formattedTime}
                    </div>
                    <div className="bg-white border border-[#E6D5C3]/40 rounded-[20px] p-6 shadow-sm w-full relative overflow-hidden group hover:shadow-md transition-all duration-300">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-coral/60 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-out" />
                      {title && <h4 className="font-serif text-xl text-cocoa mb-2">{title}</h4>}
                      {item.description && <p className="text-driftwood text-sm leading-relaxed">{item.description}</p>}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex w-full items-center">
                    {isEven ? (
                      <>
                        {/* Time on Left */}
                        <div className="w-1/2 flex justify-end pr-20">
                          <div className="text-[#D47A5A] font-serif text-3xl tracking-wide transition-colors duration-300 group-hover/row:text-coral">
                            {formattedTime}
                          </div>
                        </div>
                        {/* Card on Right */}
                        <div className="w-1/2 flex justify-start pl-20">
                          <div className="bg-white border border-[#E6D5C3]/40 rounded-[24px] p-8 shadow-sm w-full max-w-[420px] hover:-translate-y-2 hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#D47A5A] to-coral scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-700 ease-out" />
                            {title && <h4 className="font-serif text-[1.4rem] text-cocoa mb-3 tracking-wide">{title}</h4>}
                            {item.description && <p className="text-driftwood text-sm md:text-base leading-relaxed text-balance">{item.description}</p>}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Card on Left */}
                        <div className="w-1/2 flex justify-end pr-20">
                          <div className="bg-white border border-[#E6D5C3]/40 rounded-[24px] p-8 shadow-sm w-full max-w-[420px] hover:-translate-y-2 hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-[#D47A5A] to-coral scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-700 ease-out" />
                            {title && <h4 className="font-serif text-[1.4rem] text-cocoa mb-3 tracking-wide">{title}</h4>}
                            {item.description && <p className="text-driftwood text-sm md:text-base leading-relaxed text-balance">{item.description}</p>}
                          </div>
                        </div>
                        {/* Time on Right */}
                        <div className="w-1/2 flex justify-start pl-20">
                          <div className="text-[#D47A5A] font-serif text-3xl tracking-wide transition-colors duration-300 group-hover/row:text-coral">
                            {formattedTime}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
