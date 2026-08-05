"use client";

/**
 * CountdownSection
 *
 * Animated countdown timer with digit-flip animation, decorative
 * palm trees, wave dividers, and flower motif.
 * Extracted from ClientEventRenderer.tsx lines 363–468.
 *
 * All classNames, asset paths, and animation configs are identical.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/client/components/SectionHeading";
import { formatTime } from "@/client/utils/formatters";
import type {
  ClientCountdownData,
  ClientCeremonyData,
} from "@/client/types/client-view-model";

import type { SectionSurface } from "@/client/client-section-registry";

type CountdownSectionProps = {
  countdown: ClientCountdownData;
  ceremony: ClientCeremonyData;
  surface: SectionSurface;
};

export function CountdownSection({
  countdown,
  ceremony,
  surface,
}: CountdownSectionProps) {
  const getTimeLeft = () => {
    const target = ceremony?.eventDate
      ? new Date(`${ceremony.eventDate}T${ceremony.eventTime || "16:00"}:00`)
      : new Date();
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const dateStr = ceremony?.eventDate || "2027-04-19";
  const [yStr, mStr, dStr] = dateStr.split("-");
  const dateObj = new Date(
    Date.UTC(Number(yStr) || 2027, (Number(mStr) || 4) - 1, Number(dStr) || 19),
  );
  const weekday = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  const month = dateObj.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const dayNum = (Number(dStr) || 19).toString();
  const yearNum = yStr || "2027";
  const timeStr = ceremony?.eventTime
    ? formatTime(ceremony.eventTime)
    : "4:00 PM";

  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section
      id="countdown"
      data-tone={surface}
      className="wedding-section relative py-20 md:py-32 px-4 pb-24 sm:pb-20 md:pb-32 overflow-x-clip"
    >
      <div className="relative z-30 max-w-4xl mx-auto">
        <div className="mx-auto mb-8 sm:mb-12 flex flex-row items-center justify-center gap-4 sm:gap-10 text-[color:var(--wedding-text-secondary)]">
          <div className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[color:var(--wedding-text-secondary)]">
            {weekday}
          </div>

          <div className="h-16 sm:h-24 w-px bg-[color:var(--wedding-accent-line)]/40" />

          <div className="flex min-w-[76px] sm:min-w-[100px] flex-col items-center leading-none">
            <span className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.2em] text-[color:var(--wedding-label-on-light)]">
              {month}
            </span>
            <span className="wedding-display text-5xl sm:text-6xl md:text-7xl font-semibold text-[color:var(--wedding-text-primary)] my-2 sm:my-3 tracking-tight">
              {dayNum}
            </span>
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] text-[color:var(--wedding-text-secondary)]">
              {yearNum}
            </span>
          </div>

          <div className="h-16 sm:h-24 w-px bg-[color:var(--wedding-accent-line)]/40" />

          <div className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[color:var(--wedding-text-secondary)]">
            {timeStr}
          </div>
        </div>

        <SectionHeading
          label="Save the Date"
          title={countdown?.title || "Counting Down to Our Special Day"}
          subtitle={countdown?.shortNote}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-12 max-w-3xl mx-auto">
          {units.map(({ label, value }) => {
            const digits = String(value).padStart(2, "0").split("");
            return (
              <div
                key={label}
                className="wedding-panel rounded-sm p-3 sm:p-4 md:p-6 text-center bg-[color:var(--wedding-surface-secondary)] hover:-translate-y-1.5 transition-[border-color,box-shadow,transform] duration-300"
              >
                <div className="flex justify-center gap-0.5 h-12 sm:h-16 md:h-20 lg:h-24 items-center overflow-hidden">
                  {digits.map((d, i) => (
                    <div
                      key={i}
                      className="h-full flex items-center overflow-hidden"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${label}-${i}-${d}`}
                          initial={{ y: -14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 14, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="wedding-numeric-display block leading-none"
                        >
                          {mounted ? d : "0"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs tracking-[0.2em] font-bold uppercase mt-2 md:mt-3 text-[color:var(--wedding-text-secondary)]">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
