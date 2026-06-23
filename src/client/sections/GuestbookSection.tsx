"use client";

/**
 * GuestbookSection
 *
 * Displays guestbook placeholder/entries.
 * Extracted from ClientEventRenderer.tsx lines 967–982.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientGuestbookData } from "@/client/types/client-view-model";

type GuestbookSectionProps = {
  guestbook: ClientGuestbookData;
};

export function GuestbookSection({ guestbook }: GuestbookSectionProps) {
  if (!guestbook) return null;
  return (
    <section id="guestbook" className="py-20 px-4 bg-cream">
      <div className="max-w-2xl mx-auto text-center">
        <SectionHeading label="Guestbook" title={guestbook.sectionTitle || "Leave a Message"} subtitle={guestbook.sectionIntro} />
        <AnimatedContent>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-soft">
            <p className="text-driftwood italic font-serif">{guestbook.emptyStateMessage || "Guestbook entries will appear here."}</p>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
