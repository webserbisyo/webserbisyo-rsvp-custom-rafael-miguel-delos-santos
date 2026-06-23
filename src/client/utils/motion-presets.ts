/**
 * Motion Presets
 *
 * Centralized Framer Motion animation configurations used
 * across 6+ sections. Changing values here updates all sections.
 */

/** Standard fade-in-up animation triggered on scroll. */
export const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
} as const;

/** Creates a staggered fade-in-up variant with per-item delay. */
export function staggerChild(index: number, baseDelay = 0.05) {
  return {
    ...fadeInUp,
    transition: { ...fadeInUp.transition, delay: index * baseDelay },
  } as const;
}

/** Quick fade-in-up for smaller UI elements. */
export const fadeInUpFast = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
} as const;
