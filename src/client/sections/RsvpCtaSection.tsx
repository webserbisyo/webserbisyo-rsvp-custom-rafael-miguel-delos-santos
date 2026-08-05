"use client";

/**
 * RsvpCtaSection
 *
 * Full-width gradient CTA block linking to the /rsvp page.
 * No data props needed — static content.
 */

import { FadeContent } from "@/client/libs/reactbits";
import Link from "next/link";
import { WeddingButton } from "@/client/components/ui/WeddingButton";

export function RsvpCtaSection() {
  return (
    <section
      id="rsvp"
      data-tone="dark"
      className="wedding-section relative overflow-x-clip -mt-px -mb-px py-20 px-4 text-center"
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
          className="absolute left-0 sm:left-[-1rem] md:left-[-2rem] lg:left-8 xl:left-12 -top-3 sm:-top-4 md:-top-6 lg:top-4 w-28 sm:w-32 md:w-36 lg:w-52 xl:w-60 h-auto object-contain pointer-events-none select-none z-0 rotate-[-10deg] opacity-90"
        />

        {/* Right Bird - Top/Right side, fully visible */}
        <img
          src="/beach%20assets%20finalized/8.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-0 sm:right-[-1rem] md:right-[-2rem] lg:right-8 xl:right-12 -top-3 sm:-top-4 md:-top-6 lg:top-4 w-28 sm:w-32 md:w-36 lg:w-52 xl:w-60 h-auto object-contain pointer-events-none select-none z-0 rotate-[10deg] opacity-90"
        />
      </div>

      <FadeContent>
        <div className="relative z-30 max-w-2xl mx-auto">
          <p className="wedding-section-label text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-[color:var(--wedding-label-on-dark)]">
            JOIN US
          </p>
          <h2 className="wedding-display wedding-section-title mb-6">
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
