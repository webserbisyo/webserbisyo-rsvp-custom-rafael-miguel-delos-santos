"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { X } from "@/client/libs/icons";
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
        <DrawerHeader className="relative border-b border-sand/25 pb-5">
          <DrawerTitle>Sitemap</DrawerTitle>
          <DrawerDescription>
            Explore all the details of our wedding celebration
          </DrawerDescription>

          <button
            onClick={onClose}
            className="wedding-drawer-close absolute top-5 right-5 p-2 rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
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
                          className="wedding-drawer-link group flex items-center gap-3 py-2 px-3 text-sm sm:text-[0.95rem] border border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 rounded-[4px] -mx-2"
                        >
                          {Icon && (
                            <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 transition-colors shrink-0" />
                          )}
                          <span className="font-medium truncate">
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
