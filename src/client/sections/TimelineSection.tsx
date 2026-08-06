"use client";

/**
 * TimelineSection
 *
 * Alternating left/right timeline with glassmorphism cards,
 * responsive structural flow.
 */

import { motion } from "framer-motion";
import { SectionHeading } from "@/client/components/SectionHeading";
import { formatTime } from "@/client/utils/formatters";
import type { ClientTimelineItem } from "@/client/types/client-view-model";
import type { SectionSurface } from "@/client/client-section-registry";

type TimelineSectionProps = {
  timelineProgram: { items: ClientTimelineItem[] };
  surface: SectionSurface;
};

const glassCardClasses =
  "wedding-timeline-card border p-6 md:p-5 lg:p-8 w-full max-w-[420px] hover:-translate-y-1 transition-transform duration-500 relative group/card z-30";

export function TimelineSection({
  timelineProgram,
  surface,
}: TimelineSectionProps) {
  if (!timelineProgram?.items?.length) return null;

  return (
    <section
      id="timeline"
      data-tone={surface}
      className="wedding-section py-24 px-4 overflow-x-hidden relative"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeading
          label="Wedding Day Timeline"
          title="The flow of the day"
          subtitle="So our guests know what to expect — from sunlit arrivals to bonfire farewells."
        />

        <div className="relative mt-24 max-w-4xl mx-auto pb-12 sm:max-w-[560px] md:max-w-[760px] lg:max-w-4xl">
          {/* The softened vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-[color:var(--wedding-timeline-line)] opacity-70 md:-translate-x-1/2 z-10" />

          <div className="flex flex-col space-y-12 md:space-y-0">
            {timelineProgram.items.map((item, i) => {
              const isEven = i % 2 === 0;
              const formattedTime = formatTime(item.time) || item.time;
              const title = item.title || item.activity || "";

              const isImportant =
                title.toLowerCase().includes("ceremony") ||
                title.toLowerCase().includes("reception");
              const nodeClasses = isImportant
                ? "w-[18px] h-[18px] ring-8 ring-sand/40"
                : "w-4 h-4 ring-4 ring-sand/30";

              return (
                <div
                  key={i}
                  className="relative flex flex-col md:flex-row w-full group/row md:min-h-[190px] lg:min-h-[220px]"
                >
                  {/* Timeline Node */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    className={`absolute left-6 md:left-1/2 top-[42px] md:top-1/2 rounded-full bg-[color:var(--wedding-timeline-marker)] -translate-x-1/2 md:-translate-y-1/2 z-30 transition-transform duration-500 group-hover/row:scale-110 ${nodeClasses}`}
                  />

                  {/* Mobile and small-tablet layout — true single-column, badge always left */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      delay: 0.1,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="md:hidden w-full pl-16 z-20 py-2 relative"
                  >
                    {/* Badge row: time badge always on left */}
                    <div className="flex flex-row items-center justify-start mb-3">
                      <div className="text-coral font-serif text-2xl tracking-wide pl-2 relative z-20">
                        <span className="inline-flex rounded-full border border-sand/35 bg-cream/90 px-3 py-1 shadow-sm backdrop-blur-sm">
                          {formattedTime}
                        </span>
                      </div>
                    </div>
                    <div className={glassCardClasses}>
                      {title && (
                        <h4 className="font-serif text-xl text-[#302722] font-semibold mb-2 tracking-wide text-balance">
                          {title}
                        </h4>
                      )}
                      {item.description && (
                        <p className="text-[#725d4f] text-sm leading-relaxed text-balance">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Compact tablet and full desktop alternating layout */}
                  <div className="hidden md:flex w-full items-center py-4 lg:py-6">
                    {isEven ? (
                      <>
                        {/* Left Side: Time */}
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{
                            delay: 0.1,
                            duration: 0.7,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="w-1/2 flex justify-end pr-6 lg:pr-20 relative z-10"
                        >
                          <div className="text-coral font-serif text-[1.35rem] lg:text-[1.7rem] tracking-wide z-20 transition-transform duration-300 group-hover/row:scale-105 group-hover/row:text-[#c46949]">
                            <span className="inline-flex rounded-full border border-sand/30 bg-cream/80 px-3 py-1 lg:px-4 lg:py-1.5 shadow-sm backdrop-blur-sm">
                              {formattedTime}
                            </span>
                          </div>
                        </motion.div>
                        {/* Right Side: Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{
                            delay: 0.15,
                            duration: 0.7,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="w-1/2 flex justify-start pl-6 lg:pl-20 relative z-30"
                        >
                          <div className={glassCardClasses}>
                            {title && (
                              <h4 className="font-serif text-[1.2rem] lg:text-[1.4rem] text-[#302722] font-semibold mb-2 lg:mb-3 tracking-wide text-balance">
                                {title}
                              </h4>
                            )}
                            {item.description && (
                              <p className="text-[#725d4f] text-sm lg:text-base leading-relaxed text-balance">
                                {item.description}
                              </p>
                            )}
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
                          transition={{
                            delay: 0.15,
                            duration: 0.7,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="w-1/2 flex justify-end pr-6 lg:pr-20 relative z-30"
                        >
                          <div className={glassCardClasses}>
                            {title && (
                              <h4 className="font-serif text-[1.2rem] lg:text-[1.4rem] text-[#302722] font-semibold mb-2 lg:mb-3 tracking-wide text-balance">
                                {title}
                              </h4>
                            )}
                            {item.description && (
                              <p className="text-[#725d4f] text-sm lg:text-base leading-relaxed text-balance">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                        {/* Right Side: Time */}
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{
                            delay: 0.1,
                            duration: 0.7,
                            ease: [0.25, 0.46, 0.45, 0.94],
                          }}
                          className="w-1/2 flex justify-start pl-6 lg:pl-20 relative z-10"
                        >
                          <div className="text-coral font-serif text-[1.35rem] lg:text-[1.7rem] tracking-wide z-20 transition-transform duration-300 group-hover/row:scale-105 group-hover/row:text-[#c46949]">
                            <span className="inline-flex rounded-full border border-sand/30 bg-cream/80 px-3 py-1 lg:px-4 lg:py-1.5 shadow-sm backdrop-blur-sm">
                              {formattedTime}
                            </span>
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
