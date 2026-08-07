"use client";

/**
 * CeremonySection
 *
 * Displays ceremony date and time with a premium layout,
 * a full monthly calendar grid visualizer centerpiece, and Timing/Deadline details.
 * Framed beautifully with ambient plumeria floral and candle lantern assets.
 */

import { useState } from "react";
import { SectionHeading } from "@/client/components/SectionHeading";
import { SpotlightCard } from "@/client/components/SpotlightCard";
import { FadeContent } from "@/client/libs/reactbits";
import { formatDate, formatTime } from "@/client/utils/formatters";
import { Clock3, MapPin, Heart } from "@/client/libs/icons";
import type {
  ClientCeremonyData,
  ClientVenueData,
} from "@/client/types/client-view-model";
import { motion, AnimatePresence } from "framer-motion";
import type { SectionSurface } from "@/client/client-section-registry";
import { WeddingDecoration } from "@/client/components/decorations/WeddingDecoration";

type CeremonySectionProps = {
  ceremony: ClientCeremonyData;
  venue?: ClientVenueData;
  mounted: boolean;
  surface: SectionSurface;
};

export function CeremonySection({
  ceremony,
  venue,
  mounted,
  surface,
}: CeremonySectionProps) {
  const [calendarFocus, setCalendarFocus] = useState<"ceremony" | "deadline">(
    "ceremony",
  );

  if (!ceremony) return null;

  const getCalendarMonthGrid = (targetDateString?: string) => {
    if (!targetDateString) return null;
    const targetDate = new Date(`${targetDateString}T00:00:00`);
    if (isNaN(targetDate.getTime())) return null;

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth(); // 0-indexed

    // Month name
    const monthName = targetDate.toLocaleDateString("en-US", { month: "long" });

    // Days in this month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Weekday of the 1st of this month (0 = Sunday, 6 = Saturday)
    const firstDayOffset = new Date(year, month, 1).getDay();

    // Check if wedding or RSVP falls in this focused month to highlight them
    let rsvpDayNumber: number | null = null;
    let weddingDayNumber: number | null = null;

    if (ceremony.eventDate) {
      const wDate = new Date(`${ceremony.eventDate}T00:00:00`);
      if (
        !isNaN(wDate.getTime()) &&
        wDate.getFullYear() === year &&
        wDate.getMonth() === month
      ) {
        weddingDayNumber = wDate.getDate();
      }
    }

    if (ceremony.rsvpDeadline) {
      const rsvpDate = new Date(ceremony.rsvpDeadline); // Using raw time string for correct date fallback
      if (
        !isNaN(rsvpDate.getTime()) &&
        rsvpDate.getFullYear() === year &&
        rsvpDate.getMonth() === month
      ) {
        rsvpDayNumber = rsvpDate.getDate();
      }
    }

    // Build the grid array:
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOffset; i++) {
      cells.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push(i);
    }

    return {
      monthName,
      year,
      weddingDay: weddingDayNumber,
      rsvpDay: rsvpDayNumber,
      cells,
    };
  };

  const focusDateString =
    calendarFocus === "ceremony"
      ? ceremony.eventDate
      : ceremony.rsvpDeadline
        ? ceremony.rsvpDeadline.split("T")[0]
        : ceremony.eventDate;
  const grid = mounted ? getCalendarMonthGrid(focusDateString) : null;

  return (
    <section
      id="ceremony"
      data-tone={surface}
      className="wedding-section relative pt-20 pb-40 sm:pb-48 lg:py-24 px-4 overflow-x-clip"
    >
      <div className="relative z-30 max-w-4xl mx-auto">
        {/* Heading container */}
        <div className="relative max-w-2xl mx-auto">
          <SectionHeading
            label="The Main Event"
            title={ceremony.eventLabel || "Wedding Ceremony"}
            subtitle={ceremony.scheduleNote}
          />
        </div>

        <FadeContent>
          <div className="relative overflow-visible">
            {/* Balanced 50/50 split on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch mt-8">
              {/* Left side: Calendar Grid Visualizer with soft glass / translucent styling */}
              <div className="flex justify-center items-stretch">
                <div className="relative flex flex-col justify-center bg-cream/80 backdrop-blur-md border border-sand/30 rounded-3xl p-6 sm:p-10 shadow-card w-full select-none overflow-hidden transform hover:-translate-y-1 transition-[border-color,box-shadow,transform] duration-300">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={grid ? `${grid.monthName}-${grid.year}` : "skeleton"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Month & Year header */}
                      <div className="text-center mb-6">
                        <span className="font-serif text-xl sm:text-2xl font-semibold text-[color:var(--wedding-text-primary)] block">
                          {grid ? `${grid.monthName} ${grid.year}` : "Month Year"}
                        </span>
                      </div>

                      {/* Weekdays header */}
                      <div className="grid grid-cols-7 gap-1 sm:gap-3 text-center mb-3">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] sm:text-xs font-bold tracking-[0.1em] text-[color:var(--wedding-text-secondary)]/70 uppercase"
                          >
                            {day}
                          </span>
                        ))}
                      </div>

                      {/* Day grid */}
                      <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4 gap-x-1 sm:gap-x-3 text-center text-sm sm:text-base">
                        {grid
                          ? grid.cells.map((dayNum, idx) => {
                              if (dayNum === null) {
                                return (
                                  <span
                                    key={`empty-${idx}`}
                                    className="block h-9 w-9 sm:h-10 sm:w-10 mx-auto"
                                  />
                                );
                              }

                              const isWeddingDay = dayNum === grid.weddingDay;
                              const isRsvpDay = dayNum === grid.rsvpDay;

                              return (
                                <div
                                  key={`day-${dayNum}`}
                                  className="relative flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 mx-auto"
                                >
                                  {isWeddingDay ? (
                                    <div className="absolute inset-0 bg-coral text-white font-bold rounded-full flex items-center justify-center shadow-md">
                                      {dayNum}
                                    </div>
                                  ) : isRsvpDay ? (
                                    <div className="absolute inset-0 border-2 border-coral border-dashed rounded-full flex items-center justify-center font-medium text-coral">
                                      {dayNum}
                                    </div>
                                  ) : (
                                    <span className="text-cocoa font-medium">
                                      {dayNum}
                                    </span>
                                  )}
                                </div>
                              );
                            })
                          : Array.from({ length: 35 }).map((_, idx) => (
                              <span
                                key={`skeleton-${idx}`}
                                className="block h-9 w-9 sm:h-10 sm:w-10 bg-cocoa/5 rounded-full mx-auto"
                              />
                            ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right side: Details Panel with soft glass / translucent styling */}
              <div className="flex">
                <SpotlightCard
                  className="w-full h-full bg-white/80 backdrop-blur-md border border-sand/30 p-6 sm:p-8 rounded-3xl flex flex-col justify-center shadow-soft text-left"
                  spotlightColor="rgba(116, 152, 171, 0.16)"
                >
                  <div className="space-y-6 relative z-20">
                    {/* Title & Kicker */}
                    <div>
                      <h3 className="font-serif text-2xl text-[color:var(--wedding-text-primary)] font-semibold mb-1">
                        Save Our Date
                      </h3>
                      <p className="text-xs text-[color:var(--wedding-text-secondary)] uppercase tracking-widest font-semibold">
                        We can&apos;t wait to celebrate with you
                      </p>
                    </div>

                    <hr className="border-t border-sand/20" />

                    {/* Timing details */}
                    <button
                      type="button"
                      onClick={() => setCalendarFocus("ceremony")}
                      className={`w-full text-left flex gap-4 items-start p-3 -mx-3 rounded-xl transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${calendarFocus === "ceremony" ? "bg-cream/50" : "hover:bg-cream/30"}`}
                    >
                      <div className="w-12 h-12 bg-cream rounded-2xl text-coral border border-sand/20 flex-shrink-0 flex items-center justify-center">
                        <Clock3 className="size-6" />
                      </div>
                      <div className="mt-1">
                        <h4 className="font-serif text-base font-semibold text-cocoa">
                          Timing & Hours
                        </h4>
                        {ceremony.eventTime && (
                          <p className="text-sm text-coral font-medium mt-1">
                            Starts at {formatTime(ceremony.eventTime)}
                            {ceremony.endTime &&
                              ` - ${formatTime(ceremony.endTime)}`}
                          </p>
                        )}
                        <p className="text-xs text-[color:var(--wedding-text-secondary)] mt-1">
                          {mounted ? formatDate(ceremony.eventDate) : ""}
                        </p>
                      </div>
                    </button>

                    {/* Minimal Venue details */}
                    {venue && venue.venueName && (
                      <div className="flex gap-4 items-start p-3 -mx-3">
                        <div className="w-12 h-12 bg-cream rounded-2xl text-coral border border-sand/20 flex-shrink-0 flex items-center justify-center">
                          <MapPin className="size-6" />
                        </div>
                        <div className="mt-1">
                          <h4 className="font-serif text-base font-semibold text-cocoa">
                            Location
                          </h4>
                          <p className="text-sm text-cocoa mt-1">
                            {venue.venueName}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* RSVP Deadline details */}
                    {ceremony.rsvpDeadline && (
                      <button
                        type="button"
                        onClick={() => setCalendarFocus("deadline")}
                        className={`w-full text-left flex gap-4 items-start p-3 -mx-3 rounded-xl transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${calendarFocus === "deadline" ? "bg-shell-pink/20" : "hover:bg-shell-pink/10"}`}
                      >
                        <div className="w-12 h-12 bg-cream rounded-2xl text-coral border border-sand/20 flex-shrink-0 flex items-center justify-center">
                          <Heart className="size-6 fill-current text-coral/70" />
                        </div>
                        <div className="mt-1">
                          <h4 className="font-serif text-base font-semibold text-cocoa">
                            RSVP Deadline
                          </h4>
                          {mounted ? (
                            ceremony.rsvpDeadline.includes("T") ? (
                              <>
                                <p className="text-sm text-coral font-medium mt-1">
                                  Kindly respond by{" "}
                                  {formatTime(
                                    ceremony.rsvpDeadline.split("T")[1],
                                  )}
                                </p>
                                <p className="text-xs text-[color:var(--wedding-text-secondary)] mt-1">
                                  {formatDate(
                                    ceremony.rsvpDeadline.split("T")[0],
                                  )}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-coral font-medium mt-1">
                                  Kindly respond by
                                </p>
                                <p className="text-xs text-[color:var(--wedding-text-secondary)] mt-1">
                                  {formatDate(ceremony.rsvpDeadline)}
                                </p>
                              </>
                            )
                          ) : null}
                        </div>
                      </button>
                    )}
                  </div>
                </SpotlightCard>
              </div>
            </div>

            {/* Diagonal pair: top-left sprig + bottom-right flourish */}
            <WeddingDecoration
              family="frame-corner"
              orientation="left"
              position="top-left"
              size="medium"
              tone="light"
              placementMode="edge-overlap"
              className="wedding-decoration--target-ceremony"
            />
            <WeddingDecoration
              family="card-edge"
              orientation="right"
              position="bottom-right"
              size="medium"
              tone="light"
              placementMode="edge-overlap"
              className="wedding-decoration--target-ceremony"
            />
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
