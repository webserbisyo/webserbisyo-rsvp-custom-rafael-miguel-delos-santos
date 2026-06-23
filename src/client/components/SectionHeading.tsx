"use client";

/**
 * SectionHeading
 *
 * Reusable section header with optional eyebrow label,
 * serif title, and subtitle. Used by 10+ sections.
 * Extracted from ClientEventRenderer.tsx lines 47–69.
 *
 * All classNames, colors, and motion config are identical to the original.
 */

import { motion } from "framer-motion";

export function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="text-center mb-10 md:mb-14"
    >
      {label && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-10 bg-[#D47A5A]/40" />
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-[#D47A5A]">
            {label}
          </p>
          <div className="h-px w-10 bg-[#D47A5A]/40" />
        </div>
      )}
      <h2 className="font-serif text-cocoa text-4xl md:text-5xl font-medium mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed text-driftwood">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
