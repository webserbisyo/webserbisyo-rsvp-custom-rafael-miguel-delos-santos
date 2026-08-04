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
import { WeddingButton } from "@/client/components/ui/WeddingButton";

export function RsvpCtaSection() {
  return (
    <section
      id="rsvp"
      data-tone="dark"
      className="wedding-section relative overflow-x-clip py-24 px-4 text-center text-white"
    >
      {/* Background Image Layer with Gradient Overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="/beach%20assets%20finalized/6.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          loading="lazy"
          className="w-full h-full object-cover object-center pointer-events-none select-none opacity-80"
        />
        {/* Soft dark vignette overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1410]/70 via-[#1C1410]/50 to-[#1C1410]/75" />
      </div>

      {/* Foreground Flowers Layer — Frame the top and bottom of the CTA section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 select-none">
        {/* Top-Right Corner Flower (17.png) */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          loading="lazy"
          className="absolute -right-4 sm:-right-8 -top-6 sm:-top-10 w-32 sm:w-48 md:w-60 h-auto object-contain pointer-events-none select-none z-10 opacity-90 rotate-[10deg]"
        />

        {/* Bottom-Left Corner Flower (16.png) */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          loading="lazy"
          className="absolute -left-4 sm:-left-8 -bottom-6 sm:-bottom-10 w-32 sm:w-48 md:w-60 h-auto object-contain pointer-events-none select-none z-10 opacity-90 rotate-[-10deg]"
        />
      </div>

      {/* Content Stack */}
      <FadeContent>
        <div className="relative z-30 max-w-2xl mx-auto">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-white/70">
            JOIN US
          </p>
          <h2 className="font-serif text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide mb-6">
            Confirm Your Attendance
          </h2>
          <p className="text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8 text-white/95">
            Please click below to visit our dedicated RSVP page and let us know if you can make it.
          </p>
          <div>
            <WeddingButton asChild variant="primary" size="lg">
              <Link href="/rsvp">
                RSVP Now ✦
              </Link>
            </WeddingButton>
          </div>
        </div>
      </FadeContent>
    </section>
  );
}
