"use client";

/**
 * SponsorsSection
 *
 * Principal sponsors list with staggered animation.
 * Extracted from ClientEventRenderer.tsx lines 772–797.
 */

import { motion } from "framer-motion";
import { SectionHeading } from "@/client/components/SectionHeading";
import type { ClientSponsorData } from "@/client/types/client-view-model";

type SponsorsSectionProps = {
  principalSponsors: ClientSponsorData;
};

export function SponsorsSection({ principalSponsors }: SponsorsSectionProps) {
  if (!principalSponsors?.names) return null;
  const namesList = principalSponsors.names.split("\n").filter(Boolean);
  return (
    <section id="sponsors" className="py-20 px-4 bg-cream">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading label="Principal Sponsors" title="With the guidance of" subtitle={principalSponsors.introLine} />
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
          {namesList.map((name: string, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="font-serif text-lg text-cocoa"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
