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
          <div className="h-px w-10 bg-[color:var(--wedding-accent-line)] opacity-70" />
          <p className="wedding-section-label text-[11px] font-extrabold tracking-[0.26em] uppercase">
            {label}
          </p>
          <div className="h-px w-10 bg-[color:var(--wedding-accent-line)] opacity-70" />
        </div>
      )}
      <h2 className="wedding-display wedding-section-title text-4xl md:text-5xl font-semibold mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="wedding-section-subtitle text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
