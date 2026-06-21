"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollRevealProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  start?: string;
  end?: string;
};

export default function ScrollReveal({
  text,
  className = "",
  wordClassName = "",
  start = "top 85%",
  end = "top 40%",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const words = el.querySelectorAll("[data-reveal-word]");

    const tween = gsap.fromTo(
      words,
      { opacity: 0.15, filter: "blur(6px)" },
      {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.04,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [start, end]);

  const words = text.split(" ");

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span key={i} data-reveal-word className={`inline-block ${wordClassName}`}>
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
}
