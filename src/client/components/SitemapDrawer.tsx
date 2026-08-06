"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { X, ChevronDown } from "@/client/libs/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  clientSectionRegistry,
  type ClientNavigationGroup,
  type ClientSectionKey,
} from "@/client/config/navigation";
import { scrollToHash } from "@/client/utils/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/client/components/ui/drawer";

type SitemapDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  visibleSectionKeys: ClientSectionKey[];
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const groupVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.02,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 22 },
  },
};

export function SitemapDrawer({
  isOpen,
  onClose,
  visibleSectionKeys,
}: SitemapDrawerProps) {
  const pathname = usePathname();
  const isRsvpPage = pathname === "/rsvp";
  const sitemapGroups = buildSitemapGroups(visibleSectionKeys);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
    setHasMoreBelow(hasOverflow && !isAtBottom);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let rafId: number;
    const updateScroll = () => {
      rafId = requestAnimationFrame(() => {
        checkScroll();
      });
    };

    updateScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScroll, { passive: true });
    }
    window.addEventListener("resize", updateScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (el) el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [isOpen, checkScroll]);

  const getResolvedHref = (href: string) => {
    if (href.startsWith("#")) {
      return isRsvpPage ? `/${href}` : href;
    }
    return href;
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    onClose();
    if (href === "/rsvp" && isRsvpPage) {
      e.preventDefault();
      const element = document.getElementById("rsvp-form");
      setTimeout(() => {
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 300);
      return;
    }

    if (href.startsWith("#") && !isRsvpPage) {
      e.preventDefault();
      // Allow drawer transition to finish before scrolling for smoothness
      setTimeout(() => {
        scrollToHash(href);
      }, 300);
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      direction="right"
    >
      <DrawerContent className="wedding-drawer border-l">
        {/* Header */}
        <DrawerHeader className="flex-none relative border-b border-[color:var(--wedding-drawer-border,var(--wedding-divider))] pb-5">
          <DrawerTitle>Sitemap</DrawerTitle>
          <DrawerDescription>
            Explore all the details of our wedding celebration
          </DrawerDescription>

          <button
            onClick={onClose}
            className="wedding-drawer-close absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wedding-drawer-accent,var(--wedding-label-on-light))]"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </DrawerHeader>

        {/* Content - Compact Sitemap Grid */}
        <motion.div
          ref={scrollRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          data-vaul-no-drag
          className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y px-6 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))] select-none"
        >
          <div className="flex flex-col gap-6">
            {sitemapGroups.map((group) => (
              <motion.div
                key={group.title}
                variants={groupVariants}
                className="flex flex-col gap-3"
              >
                <h4 className="wedding-drawer-heading text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] border-b pb-1.5">
                  {group.title}
                </h4>

                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.li key={item.label} variants={itemVariants}>
                        <Link
                          href={getResolvedHref(item.anchor)}
                          onClick={(e) => handleLinkClick(e, item.anchor)}
                          className="wedding-drawer-link group flex items-center gap-3 min-h-[44px] py-2 px-3 text-sm sm:text-[0.95rem] border border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--wedding-drawer-accent,var(--wedding-label-on-light))] rounded-lg -mx-2.5 active:bg-cream/60"
                        >
                          {Icon && (
                            <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 transition-colors shrink-0 group-hover:scale-105" />
                          )}
                          <span className="wedding-drawer-link-label font-medium truncate relative py-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-200 group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
                            {item.label}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile Scroll Overflow Indicator */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[color:var(--wedding-drawer-surface,var(--wedding-surface-ivory))] via-[color:var(--wedding-drawer-surface,var(--wedding-surface-ivory))]/80 to-transparent flex items-end justify-center pb-2.5 transition-opacity duration-300 ${
            isOpen && hasMoreBelow ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronDown className="w-4 h-4 text-[color:var(--wedding-drawer-accent,var(--wedding-label-on-light))]" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function buildSitemapGroups(visibleSectionKeys: ClientSectionKey[]) {
  const groupOrder: ClientNavigationGroup[] = [
    "Explore",
    "Guest Essentials",
    "Wedding Info",
    "Support",
  ];

  return groupOrder
    .map((title) => ({
      title,
      items: visibleSectionKeys
        .map((key) => clientSectionRegistry[key])
        .filter((section) => section.group === title),
    }))
    .filter((group) => group.items.length > 0);
}
