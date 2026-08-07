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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/client/components/SectionHeading";
import { formatTime } from "@/client/utils/formatters";
import { WeddingDecoration } from "@/client/components/decorations/WeddingDecoration";
import { getAlternatingDecorationOrientation } from "@/client/components/decorations/get-decoration-placement";
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
  const shouldReduceMotion = useReducedMotion();

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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-12 max-w-4xl mx-auto">
          {units.map(({ label, value }, index) => {
            const formattedValue = mounted
              ? String(value).padStart(label === "Days" && value >= 100 ? 3 : 2, "0")
              : "00";
            const orientation = getAlternatingDecorationOrientation(index);
            const position =
              orientation === "left" ? "top-left" : "top-right";

            return (
              <div key={label} className="relative overflow-visible">
                <div className="wedding-panel relative min-w-0 rounded-sm p-3 sm:p-4 md:px-4 md:py-6 text-center bg-[color:var(--wedding-surface-secondary)] hover:-translate-y-1.5 transition-[border-color,box-shadow,transform] duration-300">
                  <div className="relative z-20 flex justify-center items-center h-14 sm:h-16 md:h-20 lg:h-24 overflow-hidden w-full px-1">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.span
                        key={`${label}-${formattedValue}`}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { y: -12, opacity: 0 }
                        }
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { y: 0, opacity: 1 }
                        }
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { y: 12, opacity: 0 }
                        }
                        transition={
                          shouldReduceMotion
                            ? { duration: 0.1 }
                            : { duration: 0.25, ease: "easeOut" }
                        }
                        className="wedding-numeric-display wedding-countdown-number block whitespace-nowrap tabular-nums text-center"
                      >
                        {formattedValue}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <p className="relative z-20 text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase mt-2 md:mt-3 text-[color:var(--wedding-text-secondary)]">
                    {label}
                  </p>
                </div>

                <WeddingDecoration
                  family="frame-corner"
                  orientation={orientation}
                  position={position}
                  size="small"
                  tone="light"
                  placementMode="edge-overlap"
                  className="wedding-decoration--target-countdown"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


