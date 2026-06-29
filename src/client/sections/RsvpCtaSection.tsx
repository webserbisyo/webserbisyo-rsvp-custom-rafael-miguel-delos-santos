"use client";

/**
 * RsvpCtaSection
 *
 * Full-width gradient CTA block linking to the /rsvp page.
 * Extracted from ClientEventRenderer.tsx lines 908–932.
 * No data props needed — static content.
 */

import { motion } from "framer-motion";
import { FadeContent } from "@/client/libs/reactbits";
import Link from "next/link";

export function RsvpCtaSection() {
  return (
    <section
      id="rsvp"
      className="relative overflow-x-clip -mt-px -mb-px py-20 px-4 text-center bg-gradient-to-b from-coral to-[#8C4520]"
    >
      {/* Decorative Bird Layer — Airy top corner/side accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        {/* Left Bird - Top/Left side, fully visible */}
        <img
          src="/beach%20assets%20finalized/7.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-2 sm:left-4 md:left-8 lg:left-12 xl:left-16 top-6 sm:top-8 w-20 sm:w-32 md:w-44 lg:w-56 xl:w-64 h-auto object-contain pointer-events-none select-none z-0 rotate-[-10deg] opacity-100"
        />

        {/* Right Bird - Top/Right side, fully visible */}
        <img
          src="/beach%20assets%20finalized/8.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-2 sm:right-4 md:right-8 lg:right-12 xl:right-16 top-6 sm:top-8 w-20 sm:w-32 md:w-44 lg:w-56 xl:w-64 h-auto object-contain pointer-events-none select-none z-0 rotate-[10deg] opacity-100"
        />
      </div>

      <FadeContent>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-white/70">
            JOIN US
          </p>
          <h2 className="font-serif text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide mb-6">
            Confirm Your Attendance
          </h2>
          <p className="text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8 text-white/95">
            Please click below to visit our dedicated RSVP page and let us know if you can make it.
          </p>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block rounded-full shadow-card"
          >
            <Link
              href="/rsvp"
              className="inline-block px-10 py-4 rounded-full text-sm font-medium tracking-wide bg-white text-coral hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 transition-all duration-300 cursor-pointer"
            >
              RSVP Now ✦
            </Link>
          </motion.div>
        </div>
      </FadeContent>
    </section>
  );
}
