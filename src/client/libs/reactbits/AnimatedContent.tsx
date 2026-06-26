"use client";
import { useRef, useEffect, useState } from "react";

type AnimatedContentProps = {
  children: React.ReactNode;
  direction?: "vertical" | "horizontal";
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
};

export default function AnimatedContent({
  children,
  direction = "vertical",
  distance = 40,
  delay = 0,
  duration = 0.6,
  className = "",
  threshold = 0.15,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const tx = direction === "horizontal" ? (visible ? 0 : distance) : 0;
  const ty = direction === "vertical" ? (visible ? 0 : distance) : 0;

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate(${tx}px, ${ty}px)`,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
