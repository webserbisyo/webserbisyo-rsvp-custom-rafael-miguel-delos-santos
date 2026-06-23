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
    <section id="rsvp" className="py-20 px-4 text-center bg-gradient-to-br from-coral to-[#8C4520]">
      <FadeContent>
        <p className="text-xs font-medium tracking-[0.25em] uppercase mb-4 text-white/70">Join Us</p>
        <h2 className="font-serif text-white text-3xl md:text-4xl font-medium mb-4">Confirm Your Attendance</h2>
        <p className="text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8 text-white/80">
          Please click below to visit our dedicated RSVP page and let us know if you can make it.
        </p>
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block rounded-full shadow-card"
        >
          <Link
            href="/rsvp"
            className="inline-block px-10 py-4 rounded-full text-sm font-medium tracking-wide bg-white text-coral cursor-pointer"
          >
            RSVP Now ✦
          </Link>
        </motion.div>
      </FadeContent>
    </section>
  );
}
