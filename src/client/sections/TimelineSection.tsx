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
import { WeddingDecoration } from "@/client/components/decorations/WeddingDecoration";

type TimelineSectionProps = {
  timelineProgram: { items: ClientTimelineItem[] };
  surface: SectionSurface;
};

const glassCardClasses =
  "wedding-timeline-card border p-6 md:p-5 lg:p-8 w-full max-w-[420px] hover:-translate-y-1 transition-transform duration-500 relative group/card z-10";

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
          <div className="wedding-timeline-line absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 z-10" />

          <div className="flex flex-col space-y-12 md:space-y-0">
            {timelineProgram.items.map((item, i) => {
              const isEven = i % 2 === 0;
              const formattedTime = formatTime(item.time) || item.time;
              const title = item.title || item.activity || "";

              const isImportant =
                title.toLowerCase().includes("ceremony") ||
                title.toLowerCase().includes("reception");
              const markerClass = isImportant
                ? "wedding-timeline-marker--emphasis w-[18px] h-[18px]"
                : "wedding-timeline-marker w-4 h-4";

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
                    className={`absolute left-6 md:left-1/2 top-[42px] md:top-1/2 rounded-full -translate-x-1/2 md:-translate-y-1/2 z-30 transition-transform duration-500 group-hover/row:scale-110 ${markerClass}`}
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
                      <div className="relative z-20">
                        <span className="wedding-timeline-badge">
                          {formattedTime}
                        </span>
                      </div>
                    </div>
                    <div className="relative overflow-visible max-w-[420px] w-full">
                      <div className={glassCardClasses}>
                        {title && (
                          <h4 className="wedding-timeline-card-title text-xl text-balance relative z-20">
                            {title}
                          </h4>
                        )}
                        {title && item.description && (
                          <div
                            className="wedding-timeline-divider"
                            aria-hidden="true"
                          />
                        )}
                        {item.description && (
                          <p className="wedding-timeline-card-body text-sm text-balance relative z-20">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <WeddingDecoration
                        family={isEven ? "frame-corner" : "card-edge"}
                        orientation={isEven ? "right" : "left"}
                        position={isEven ? "top-right" : "bottom-left"}
                        size="small"
                        tone="light"
                        placementMode="edge-overlap"
                        className="wedding-decoration--target-timeline"
                      />
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
                          <div className="z-20 transition-transform duration-300 group-hover/row:scale-105">
                            <span className="wedding-timeline-badge">
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
                          <div className="relative overflow-visible max-w-[420px] w-full">
                            <div className={glassCardClasses}>
                              {title && (
                                <h4 className="wedding-timeline-card-title text-[1.2rem] lg:text-[1.4rem] text-balance relative z-20">
                                  {title}
                                </h4>
                              )}
                              {title && item.description && (
                                <div
                                  className="wedding-timeline-divider"
                                  aria-hidden="true"
                                />
                              )}
                              {item.description && (
                                <p className="wedding-timeline-card-body text-sm lg:text-base text-balance relative z-20">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <WeddingDecoration
                              family="frame-corner"
                              orientation="right"
                              position="top-right"
                              size="small"
                              tone="light"
                              placementMode="edge-overlap"
                              className="wedding-decoration--target-timeline"
                            />
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
                          <div className="relative overflow-visible max-w-[420px] w-full flex justify-end">
                            <div className={glassCardClasses}>
                              {title && (
                                <h4 className="wedding-timeline-card-title text-[1.2rem] lg:text-[1.4rem] text-balance relative z-20">
                                  {title}
                                </h4>
                              )}
                              {title && item.description && (
                                <div
                                  className="wedding-timeline-divider"
                                  aria-hidden="true"
                                />
                              )}
                              {item.description && (
                                <p className="wedding-timeline-card-body text-sm lg:text-base text-balance relative z-20">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <WeddingDecoration
                              family="frame-corner"
                              orientation="left"
                              position="top-left"
                              size="small"
                              tone="light"
                              placementMode="edge-overlap"
                              className="wedding-decoration--target-timeline"
                            />
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
                          <div className="z-20 transition-transform duration-300 group-hover/row:scale-105">
                            <span className="wedding-timeline-badge">
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
