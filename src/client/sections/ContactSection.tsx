"use client";

/**
 * ContactSection
 *
 * Contact info and social links in a dark-background section.
 * Extracted from ClientEventRenderer.tsx lines 1003–1040.
 */

import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientContactData } from "@/client/types/client-view-model";

type ContactSectionProps = {
  contactSocials: ClientContactData;
};

export function ContactSection({ contactSocials }: ContactSectionProps) {
  if (!contactSocials) return null;
  return (
    <section id="contact" className="py-20 px-4 bg-cocoa text-cream text-center">
      <div className="max-w-xl mx-auto">
        <AnimatedContent>
          <h2 className="font-serif text-3xl mb-4">{contactSocials.title || "Get in Touch"}</h2>
          <p className="text-cream/80 text-sm mb-8">{contactSocials.shortNote}</p>
          <div className="flex flex-col gap-3 text-sm items-center">
            {contactSocials.email && <p>Email: <a href={`mailto:${contactSocials.email}`} className="text-sand hover:underline">{contactSocials.email}</a></p>}
            {contactSocials.contactNumber && <p>Phone: {contactSocials.contactNumber}</p>}

            <div className="flex gap-4 mt-4 justify-center">
              {contactSocials.facebookUrl && (
                <a href={contactSocials.facebookUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-cream text-cocoa rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sand transition">
                  Facebook
                </a>
              )}
              {contactSocials.instagramUrl && (
                <a href={contactSocials.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-cream text-cocoa rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sand transition">
                  Instagram
                </a>
              )}
              {contactSocials.tikTokUrl && (
                <a href={contactSocials.tikTokUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-cream text-cocoa rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-sand transition">
                  TikTok
                </a>
              )}
            </div>

            {contactSocials.eventHashtag && <p className="mt-6 text-xl text-sand font-serif">{contactSocials.eventHashtag}</p>}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
