"use client";

/**
 * SponsorsSection
 *
 * Principal sponsors section with premium glassmorphism cards,
 * responsive balanced grid layouts, and section-level decorative birds
 * that act as elegant corner accents in the top-left and top-right.
 */

import { motion } from "framer-motion";
import { SectionHeading } from "@/client/components/SectionHeading";
import type { ClientSponsorData } from "@/client/types/client-view-model";

type SponsorsSectionProps = {
  principalSponsors: ClientSponsorData;
};

export function SponsorsSection({ principalSponsors }: SponsorsSectionProps) {
  if (!principalSponsors?.names) return null;

  // Robust parsing to split names by both commas and newlines, trim whitespace, and filter empty strings
  const namesList = principalSponsors.names
    .split(/[\n,]/)
    .map((n) => n.trim())
    .filter(Boolean);

  // Fallback state: if no valid names remain, hide the section entirely
  if (namesList.length === 0) return null;

  // Split names evenly into two columns if there are 3 or more sponsors
  const isMultiColumn = namesList.length >= 3;
  const half = Math.ceil(namesList.length / 2);
  const leftColumn = isMultiColumn ? namesList.slice(0, half) : [];
  const rightColumn = isMultiColumn ? namesList.slice(half) : [];

  return (
    <section 
      id="sponsors" 
      className="relative isolate overflow-x-clip bg-cream px-4 py-24 sm:py-28 lg:py-32"
    >
      {/* Decorative Bird Layer — Exactly two bird PNGs as top-corner accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 select-none"
      >
        {/* Left Bird - Top Left Corner */}
        <img
          src="/beach assets finalized/7.png"
          alt=""
          className="absolute left-2 md:left-6 lg:left-10 top-4 md:top-8 w-20 sm:w-24 md:w-48 lg:w-56 xl:w-64 h-auto opacity-95 pointer-events-none select-none z-0 rotate-[-5deg]"
          loading="lazy"
        />

        {/* Right Bird - Top Right Corner */}
        <img
          src="/beach assets finalized/8.png"
          alt=""
          className="absolute right-2 md:right-6 lg:right-10 top-4 md:top-8 w-20 sm:w-24 md:w-48 lg:w-56 xl:w-64 h-auto opacity-95 pointer-events-none select-none z-0 rotate-[5deg] scale-x-[-1]"
          loading="lazy"
        />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <SectionHeading 
          label="Principal Sponsors" 
          title="With the guidance of" 
          subtitle={principalSponsors.introLine} 
        />
        
        {isMultiColumn ? (
          /* Desktop 2-Column Grid / Mobile 1-Column Stack for 3+ Sponsors */
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 relative z-10">
            {/* Left Sponsor Column Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white/65 backdrop-blur-md border border-sand/40 rounded-2xl p-6 sm:p-8 shadow-soft text-center relative z-20 h-full flex flex-col justify-center transition-all duration-500 hover:border-sand/60 hover:-translate-y-1 hover:shadow-md"
            >
              <ul className="space-y-3">
                {leftColumn.map((name, i) => (
                  <li 
                    key={i} 
                    className="font-serif text-cocoa text-lg md:text-xl font-medium tracking-wide"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right Sponsor Column Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white/65 backdrop-blur-md border border-sand/40 rounded-2xl p-6 sm:p-8 shadow-soft text-center relative z-20 h-full flex flex-col justify-center transition-all duration-500 hover:border-sand/60 hover:-translate-y-1 hover:shadow-md"
            >
              <ul className="space-y-3">
                {rightColumn.map((name, i) => (
                  <li 
                    key={i} 
                    className="font-serif text-cocoa text-lg md:text-xl font-medium tracking-wide"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        ) : (
          /* Centered 1-Column Glass Card for 1-2 Sponsors */
          <div className="mt-12 max-w-md mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white/65 backdrop-blur-md border border-sand/40 rounded-2xl p-6 sm:p-8 shadow-soft text-center relative z-20 h-full flex flex-col justify-center transition-all duration-500 hover:border-sand/60 hover:-translate-y-1 hover:shadow-md"
            >
              <ul className="space-y-3">
                {namesList.map((name, i) => (
                  <li 
                    key={i} 
                    className="font-serif text-cocoa text-lg md:text-xl font-medium tracking-wide"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
