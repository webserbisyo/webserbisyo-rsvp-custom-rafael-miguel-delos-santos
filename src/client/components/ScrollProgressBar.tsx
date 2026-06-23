"use client";

/**
 * ScrollProgressBar
 *
 * Fixed top-of-page scroll progress indicator.
 * Extracted from ClientEventRenderer.tsx lines 71–80.
 */

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-coral z-[100] origin-left"
    />
  );
}
