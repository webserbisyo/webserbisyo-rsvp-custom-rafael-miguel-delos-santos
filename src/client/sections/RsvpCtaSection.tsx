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
import type { SectionSurface } from "@/client/client-section-registry";

export function RsvpCtaSection({ surface }: { surface: SectionSurface }) {
  return (
    <section
      id="rsvp"
      data-tone={surface}
      className="wedding-section relative overflow-x-clip -mt-px -mb-px py-20 px-4 text-center"
    >
      <FadeContent>
        <div className="relative z-30 max-w-2xl mx-auto">
          <p className="wedding-section-label text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-[color:var(--wedding-label-on-dark)]">
            JOIN US
          </p>
          <h2 className="wedding-display wedding-section-title mb-6">
            Confirm Your Attendance
          </h2>
          <p className="text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8 text-white/95">
            Please click below to visit our dedicated RSVP page and let us know
            if you can make it.
          </p>
          <div>
            <WeddingButton asChild variant="primary" size="lg">
              <Link href="/rsvp">RSVP Now ✦</Link>
            </WeddingButton>
          </div>
        </div>
      </FadeContent>
    </section>
  );
}
