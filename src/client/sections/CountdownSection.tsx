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
import type { ClientCountdownData, ClientCeremonyData } from "@/client/types/client-view-model";

type CountdownSectionProps = {
  countdown: ClientCountdownData;
  ceremony: ClientCeremonyData;
};

export function CountdownSection({ countdown, ceremony }: CountdownSectionProps) {
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
  const dateObj = new Date(Date.UTC(Number(yStr) || 2027, (Number(mStr) || 4) - 1, Number(dStr) || 19));
  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
  const month = dateObj.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const dayNum = (Number(dStr) || 19).toString();
  const yearNum = yStr || "2027";
  const timeStr = ceremony?.eventTime ? formatTime(ceremony.eventTime) : "4:00 PM";

  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    <section id="countdown" className="relative py-20 md:py-32 px-4 bg-cream">
      {/* Decorative Background Layer - Coconut Trees & Waves */}
      <div className="absolute inset-0 overflow-x-clip pointer-events-none select-none z-10" aria-hidden="true">
        {/* Decorative Coconut Trees on Sides */}
        <img
          src="/beach%20assets%20finalized/12.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-0 bottom-0 w-52 sm:w-64 md:w-80 lg:w-[450px] xl:w-[550px] h-auto object-contain pointer-events-none z-10 transform -translate-x-[35%] sm:-translate-x-[45%] lg:-translate-x-[35%] select-none opacity-100 transition-[opacity,transform] duration-300 origin-bottom-left"
        />
        <img
          src="/beach%20assets%20finalized/13.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-0 bottom-0 w-52 sm:w-64 md:w-80 lg:w-[450px] xl:w-[550px] h-auto object-contain pointer-events-none z-10 transform translate-x-[35%] sm:translate-x-[45%] lg:translate-x-[35%] select-none opacity-100 transition-[opacity,transform] duration-300 origin-bottom-right"
        />

        {/* Wave Dividers on top of Palm Trees */}
        <img
          src="/beach%20assets%20finalized/9.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-0 bottom-0 w-48 sm:w-60 md:w-[320px] lg:w-[400px] xl:w-[460px] h-auto object-contain pointer-events-none z-20 select-none transform -translate-x-[15%] sm:-translate-x-[20%] translate-y-[43%]"
        />
        <img
          src="/beach%20assets%20finalized/6.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-0 bottom-0 w-48 sm:w-60 md:w-[320px] lg:w-[400px] xl:w-[460px] h-auto object-contain pointer-events-none z-20 select-none transform translate-x-[15%] sm:translate-x-[20%] translate-y-[43%]"
        />

        {/* Center Flower Bouquet Motif on Divider */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-1/2 bottom-0 w-28 sm:w-36 md:w-44 lg:w-52 xl:w-60 h-auto object-contain pointer-events-none z-25 select-none transform -translate-x-1/2 translate-y-[55%]"
        />
      </div>

      <div className="relative z-30 max-w-4xl mx-auto transform -translate-y-6 md:-translate-y-12">
        <div className="mx-auto mb-8 sm:mb-12 flex flex-row items-center justify-center gap-4 sm:gap-10 text-[#5c4638]">
          <div className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#5c4638]">
            {weekday}
          </div>

          <div className="h-16 sm:h-24 w-px bg-[#d45f3f]/40" />

          <div className="flex min-w-[76px] sm:min-w-[100px] flex-col items-center leading-none">
            <span className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.2em] text-[#d45f3f]">
              {month}
            </span>
            <span className="font-poppins text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#302722] my-2 sm:my-3 tracking-tight">
              {dayNum}
            </span>
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] text-[#5c4638]">
              {yearNum}
            </span>
          </div>

          <div className="h-16 sm:h-24 w-px bg-[#d45f3f]/40" />

          <div className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#5c4638]">
            {timeStr}
          </div>
        </div>

        <SectionHeading
          label="Save the Date"
          title={countdown?.title || "Counting Down to Our Special Day"}
          subtitle={countdown?.shortNote}
        />

        <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 mt-12 max-w-3xl mx-auto">
          {units.map(({ label, value }) => {
            const digits = String(value).padStart(2, "0").split("");
            return (
              <div
                key={label}
                className="rounded-2xl md:rounded-3xl p-2 sm:p-4 md:p-6 text-center bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(59,42,26,0.05)] hover:shadow-[0_12px_40px_rgba(201,94,53,0.1)] hover:-translate-y-1.5 transition-[border-color,box-shadow,transform] duration-300"
              >
                <div className="flex justify-center gap-0.5 h-10 sm:h-14 md:h-18 lg:h-22 items-center overflow-hidden">
                  {digits.map((d, i) => (
                    <div key={i} className="h-full flex items-center overflow-hidden">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={`${label}-${i}-${d}`}
                          initial={{ y: -30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 30, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="font-poppins text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-coral block tracking-tight"
                        >
                          {mounted ? d : "0"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase mt-2 md:mt-3 text-[#725d4f]">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
