"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { X } from "@/client/libs/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sitemapGroups } from "@/client/config/navigation";
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

export function SitemapDrawer({ isOpen, onClose }: SitemapDrawerProps) {
  const pathname = usePathname();
  const isRsvpPage = pathname === "/rsvp";

  const getResolvedHref = (href: string) => {
    if (href.startsWith("#")) {
      return isRsvpPage ? `/${href}` : href;
    }
    return href;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="right">
      <DrawerContent className="bg-[#FDFBF7] border-l border-sand/30 shadow-2xl">
        {/* Header */}
        <DrawerHeader className="relative border-b border-sand/25 pb-5">
          <DrawerTitle>Sitemap</DrawerTitle>
          <DrawerDescription>
            Explore all the details of our wedding celebration
          </DrawerDescription>
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full border border-cocoa/10 text-cocoa hover:text-coral hover:border-coral hover:bg-coral/[0.04] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </DrawerHeader>

        {/* Content - Compact Sitemap Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 px-6 py-6 flex flex-col justify-center select-none"
        >
          <div className="flex flex-col gap-6">
            {sitemapGroups.map((group) => (
              <motion.div
                key={group.title}
                variants={groupVariants}
                className="flex flex-col gap-3"
              >
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-coral border-b border-sand/20 pb-1.5">
                  {group.title}
                </h4>
                
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.li key={item.label} variants={itemVariants}>
                        <Link
                          href={getResolvedHref(item.href)}
                          onClick={(e) => handleLinkClick(e, item.href)}
                          className="group flex items-center gap-3 py-2 px-3 text-sm sm:text-[0.95rem] text-cocoa/85 hover:text-coral hover:bg-coral/[0.04] border border-transparent hover:border-coral/10 hover:shadow-[0_2px_8px_rgba(201,94,53,0.05)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 rounded-xl -mx-2"
                        >
                          {Icon && (
                            <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-driftwood/60 group-hover:text-coral transition-colors shrink-0" />
                          )}
                          <span className="font-medium truncate">{item.label}</span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
