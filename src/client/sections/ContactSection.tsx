"use client";

/**
 * ContactSection
 *
 * Minimal, premium, full-bleed horizontal footer.
 * Displays couple initials, contact details, and social links in a dark-background section.
 */

import { Mail, Phone } from "lucide-react";
import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientContactData } from "@/client/types/client-view-model";

type ContactSectionProps = {
  contactSocials: ClientContactData;
};

export function ContactSection({ contactSocials }: ContactSectionProps) {
  // Use props if available, otherwise fallback to the approved values
  const email = contactSocials?.email || "official.musika.ph@gmail.com";
  const phone = contactSocials?.contactNumber || "09776441419";
  
  // Extract and trim URLs, treating empty or whitespace-only strings as missing
  const facebookUrl = contactSocials?.facebookUrl?.trim();
  const instagramUrl = contactSocials?.instagramUrl?.trim();
  const tikTokUrl = contactSocials?.tikTokUrl?.trim();

  const hasFacebook = !!facebookUrl;
  const hasInstagram = !!instagramUrl;
  const hasTikTok = !!tikTokUrl;
  const hasSocials = hasFacebook || hasInstagram || hasTikTok;

  return (
    <section id="contact" className="pt-8 pb-28 md:pt-10 md:pb-36 px-4 bg-cocoa text-cream relative overflow-x-clip">
      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatedContent>
          {/* Dynamically balanced grid layout based on whether socials are present */}
          <div className={`grid grid-cols-1 ${hasSocials ? "md:grid-cols-3" : "md:grid-cols-2"} gap-10 md:gap-8 items-center`}>
            
            {/* Left Column: Couple Initials */}
            <div className="flex flex-col items-center md:items-start select-none">
              <span className="font-serif text-4xl md:text-5xl tracking-wide text-cream">
                R <span className="text-coral font-sans">&amp;</span> I
              </span>
              <span className="text-xs tracking-[0.2em] uppercase text-cream/70 font-semibold mt-2">
                Rafael &amp; Isabella
              </span>
            </div>

            {/* Middle Column: Contact Details */}
            <div className="flex flex-col gap-4 items-center md:items-start text-sm">
              {/* Email Row */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-cream/10 flex items-center justify-center text-coral shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a href={`mailto:${email}`} className="hover:text-sand transition-colors font-medium break-all text-center md:text-left">
                  {email}
                </a>
              </div>

              {/* Phone Row */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-cream/10 flex items-center justify-center text-coral shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <a href={`tel:${phone}`} className="hover:text-sand transition-colors font-medium">
                  {phone}
                </a>
              </div>
            </div>

            {/* Right Column: Social Links (rendered only if at least one social link exists) */}
            {hasSocials && (
              <div className="flex gap-4 justify-center md:justify-end">
                {/* Facebook Button */}
                {hasFacebook && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-14 h-14 bg-cream rounded-full flex items-center justify-center hover:scale-105 hover:bg-white transition-all duration-300 shadow-sm group"
                  >
                    <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#1877F2] transition-transform duration-300 group-hover:scale-110 select-none pointer-events-none">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}

                {/* Instagram Button */}
                {hasInstagram && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-14 h-14 bg-cream rounded-full flex items-center justify-center hover:scale-105 hover:bg-white transition-all duration-300 shadow-sm group"
                  >
                    <svg viewBox="0 0 24 24" className="w-10 h-10 transition-transform duration-300 group-hover:scale-110 select-none pointer-events-none">
                      <defs>
                        <linearGradient id="instagram-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FEC564" />
                          <stop offset="25%" stopColor="#FD376F" />
                          <stop offset="75%" stopColor="#A436CA" />
                          <stop offset="100%" stopColor="#4A65E6" />
                        </linearGradient>
                      </defs>
                      <path fill="url(#instagram-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                )}

                {/* TikTok Button */}
                {hasTikTok && (
                  <a
                    href={tikTokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-14 h-14 bg-cream rounded-full flex items-center justify-center hover:scale-105 hover:bg-white transition-all duration-300 shadow-sm group"
                  >
                    <div className="relative w-10 h-10 flex items-center justify-center select-none pointer-events-none">
                      {/* Cyan offset layer */}
                      <svg viewBox="0 0 24 24" className="absolute w-10 h-10 fill-[#25F4EE] opacity-90" style={{ transform: "translate(-0.75px, -0.75px)" }}>
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.92-1.31 1.83-3.58 2.81-5.78 2.45-2.2-.36-4.11-1.9-4.82-4.01-.78-2.32-.2-4.97 1.47-6.71 1.35-1.4 3.39-2.07 5.3-1.77V12.1c-1-.22-2.08.04-2.89.67-.86.67-1.32 1.76-1.25 2.85.06 1.1.75 2.11 1.77 2.53 1.01.41 2.22.21 3.03-.48.45-.38.71-.93.77-1.5.07-1.35.03-2.7.04-4.05.01-4.07-.01-8.15.02-12.22z"/>
                      </svg>
                      {/* Red offset layer */}
                      <svg viewBox="0 0 24 24" className="absolute w-10 h-10 fill-[#FE2C55] opacity-90" style={{ transform: "translate(0.75px, 0.75px)" }}>
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.92-1.31 1.83-3.58 2.81-5.78 2.45-2.2-.36-4.11-1.9-4.82-4.01-.78-2.32-.2-4.97 1.47-6.71 1.35-1.4 3.39-2.07 5.3-1.77V12.1c-1-.22-2.08.04-2.89.67-.86.67-1.32 1.76-1.25 2.85.06 1.1.75 2.11 1.77 2.53 1.01.41 2.22.21 3.03-.48.45-.38.71-.93.77-1.5.07-1.35.03-2.7.04-4.05.01-4.07-.01-8.15.02-12.22z"/>
                      </svg>
                      {/* Main black layer */}
                      <svg viewBox="0 0 24 24" className="absolute w-10 h-10 fill-black transition-transform duration-300 group-hover:scale-110">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.92-1.31 1.83-3.58 2.81-5.78 2.45-2.2-.36-4.11-1.9-4.82-4.01-.78-2.32-.2-4.97 1.47-6.71 1.35-1.4 3.39-2.07 5.3-1.77V12.1c-1-.22-2.08.04-2.89.67-.86.67-1.32 1.76-1.25 2.85.06 1.1.75 2.11 1.77 2.53 1.01.41 2.22.21 3.03-.48.45-.38.71-.93.77-1.5.07-1.35.03-2.7.04-4.05.01-4.07-.01-8.15.02-12.22z"/>
                      </svg>
                    </div>
                  </a>
                )}
              </div>
            )}

          </div>

          {/* Bottom Strip */}
          <div className="w-full h-px bg-cream/10 my-8"></div>
          
          <div className="text-center text-xs text-cream/60 tracking-wider flex flex-col gap-1.5">
            <p>© 2027 Rafael &amp; Isabella. All rights reserved.</p>
            <p>
              Custom RSVP by{" "}
              <a
                href="https://rsvp.webserbisyo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral hover:underline font-semibold"
              >
                WebSerbisyo
              </a>
              .
            </p>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
