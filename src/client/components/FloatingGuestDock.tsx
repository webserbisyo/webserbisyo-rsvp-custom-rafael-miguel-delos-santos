"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from "framer-motion";
import React, { Children, cloneElement, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { dockItems } from "@/client/config/navigation";
import { scrollToHash } from "@/client/utils/navigation";

// ─── React Bits Dock Sub-Components ───────────────────────────────────

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  label?: React.ReactNode;
};

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center justify-center rounded-full shadow-md cursor-pointer transition-[border-color,background-color,box-shadow,transform] duration-300 ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={typeof label === "string" ? label : undefined}
    >
      {Children.map(children, child =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : child
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-ivory/20 bg-[#2D1B12] px-2.5 py-1 text-[10px] sm:text-xs font-semibold tracking-wider text-ivory`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

// ─── Semantic Floating Dock Wrapper ──────────────────────────────────

export function FloatingGuestDock() {
  const router = useRouter();
  const pathname = usePathname();
  const isRsvpPage = pathname === "/rsvp";
  const [isVisible, setIsVisible] = useState(false);

  // Fade in the dock past the Hero section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemClick = (href: string) => {
    if (href === "/rsvp") {
      if (isRsvpPage) {
        const element = document.getElementById("rsvp-form");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        router.push(href);
      }
      return;
    }

    if (href.startsWith("#")) {
      if (isRsvpPage) {
        // If on RSVP page, navigate back home to the anchor
        router.push(`/${href}`);
      } else {
        scrollToHash(href);
      }
    } else {
      router.push(href);
    }
  };

  const mouseX = useMotionValue(Infinity);
  const isHoveredVal = useMotionValue(0);

  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const magnification = 64;
  const distance = 140;
  const panelHeight = 60;
  const baseItemSize = 44;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 30, x: "-50%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 z-40 flex items-center pb-[env(safe-area-inset-bottom)] pointer-events-auto"
        >
          <motion.div
            onMouseMove={({ pageX }) => {
              isHoveredVal.set(1);
              mouseX.set(pageX);
            }}
            onMouseLeave={() => {
              isHoveredVal.set(0);
              mouseX.set(Infinity);
            }}
            className="flex items-end w-fit gap-3 rounded-full border border-ivory/15 bg-[#2D1B12]/80 backdrop-blur-md px-4 py-2 shadow-2xl"
            style={{ height: panelHeight }}
            role="toolbar"
            aria-label="Guest essentials navigation"
          >
            {dockItems.map((item, index) => {
              const Icon = item.icon;
              const isPrimary = item.isPrimary;

              return (
                <DockItem
                  key={index}
                  onClick={() => handleItemClick(item.href)}
                  className={
                    isPrimary
                      ? "bg-coral text-white border-coral shadow-[0_0_16px_rgba(201,94,53,0.35)] hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
                      : "bg-[#2D1B12]/60 border border-ivory/10 text-ivory/95 hover:border-ivory/30 hover:text-white hover:-translate-y-0.5 active:scale-95"
                  }
                  mouseX={mouseX}
                  spring={spring}
                  distance={distance}
                  magnification={magnification}
                  baseItemSize={baseItemSize}
                  label={item.label}
                >
                  <DockIcon>
                    {Icon && <Icon className="w-5 h-5" />}
                  </DockIcon>
                  <DockLabel>{item.label}</DockLabel>
                </DockItem>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
