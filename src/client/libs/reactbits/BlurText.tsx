"use client";
import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation, type Variants } from "framer-motion";

type BlurTextProps = {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom";
  onAnimationComplete?: () => void;
};

const buildVariants = (direction: "top" | "bottom"): Variants => ({
  hidden: { filter: "blur(10px)", opacity: 0, y: direction === "top" ? -20 : 20 },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] },
  },
});

export default function BlurText({
  text,
  delay = 100,
  className = "",
  animateBy = "words",
  direction = "bottom",
  onAnimationComplete,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });
  const controls = useAnimation();
  const variants = buildVariants(direction);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial="hidden"
          animate={controls}
          variants={variants}
          transition={{ delay: i * (delay / 1000) }}
          onAnimationComplete={i === elements.length - 1 ? onAnimationComplete : undefined}
          className="inline-block will-change-transform"
        >
          {el}
          {animateBy === "words" && i < elements.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </p>
  );
}
