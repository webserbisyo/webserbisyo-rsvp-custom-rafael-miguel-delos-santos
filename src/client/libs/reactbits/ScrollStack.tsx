"use client";
import { useEffect } from "react";

export type ScrollStackItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function ScrollStackItem({ children, className = "" }: ScrollStackItemProps) {
  return <div className={`sticky top-20 mb-6 ${className}`}>{children}</div>;
}

type ScrollStackProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ScrollStack({ children, className = "" }: ScrollStackProps) {
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId: number;

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return <div className={className}>{children}</div>;
}
