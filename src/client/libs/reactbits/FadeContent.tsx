"use client";
import { useRef, useEffect, useState } from "react";

type FadeContentProps = {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
};

export default function FadeContent({
  children,
  blur = false,
  duration = 0.7,
  delay = 0,
  threshold = 0.1,
  className = "",
}: FadeContentProps) {
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

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform,filter] ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        filter: blur ? (visible ? "blur(0px)" : "blur(8px)") : undefined,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
