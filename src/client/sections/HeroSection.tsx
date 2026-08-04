"use client";

/**
 * HeroSection
 *
 * Full-viewport hero with parallax background, couple name,
 * date card, host message, and CTA buttons.
 * Extracted from ClientEventRenderer.tsx lines 82–180.
 *
 * All classNames, motion configs, and asset paths are identical.
 */

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FadeContent } from "@/client/libs/reactbits";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { ClientCoupleInfo } from "@/client/types/client-view-model";
import { templateBranding } from "@/config/template-branding";
import { ClientMonogram } from "@/client/components/ClientMonogram";
import { clientConfig } from "@/client/client.config";

type HeroSectionProps = {
  coupleInfo: ClientCoupleInfo;
  storyVisible: boolean;
};

export function HeroSection({ coupleInfo, storyVisible }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 600], [0, 120]);
  const backgroundY = useSpring(rawY, { stiffness: 90, damping: 25, mass: 0.4 });

  const displayAs = coupleInfo?.displayAs || "Rafael & Isabella";
  const nameParts = displayAs.split(/\s*(?:&|and|❤️|❤)\s*/i);
  const firstName = nameParts[0]?.trim() || "Rafael";
  const lastName = nameParts[1]?.trim() || "Isabella";
  const fallbackMonogram = [firstName.charAt(0).toUpperCase() || "W", lastName.charAt(0).toUpperCase() || "S"] as const;

  return (
    <section
      ref={heroRef}
      id="hero"
      data-tone="dark"
      className="wedding-section relative pt-20 pb-16 px-4 text-center overflow-hidden min-h-[95vh] flex flex-col justify-start"
    >
      {/* Smooth Parallax Background Image */}
      <motion.div
        style={{
          y: backgroundY,
          backgroundImage: `url('${templateBranding.hero.imagePath}')`,
          backgroundPosition: templateBranding.hero.websitePosition,
          opacity: "var(--wedding-hero-image-opacity)",
        }}
        className="absolute inset-0 z-0 bg-cover bg-no-repeat scale-120 pointer-events-none"
      />
      {/* Soft gradient overlay for styling and high text readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--wedding-hero-overlay-top), var(--wedding-hero-overlay-middle), var(--wedding-hero-overlay-bottom))" }}
      />

      <div className="relative z-20 max-w-4xl mx-auto w-full px-4 mb-4 mt-[42vh] sm:mt-[45vh]">
        <FadeContent>
          {/* Centered text stack — all elements stacked vertically and centered */}
          <div className="flex flex-col items-center gap-0">

            {/* Optional Host Line — centered pill above the couple names */}
            {coupleInfo?.hostLine && (
              <div className="px-6 py-2 rounded-full border border-[var(--wedding-nav-border)] text-[color:var(--wedding-label-on-dark)] text-xs font-semibold tracking-[0.2em] uppercase mb-4 text-center">
                {coupleInfo.hostLine}
              </div>
            )}

            {/* Couple Names Card */}
            <div className="px-3 py-4 md:px-6 md:py-5 mb-6 max-w-full">
              <ClientMonogram initials={clientConfig.theme.monogram ?? fallbackMonogram} withRules className="mb-5" />
              <h1 className="wedding-display flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-3xl sm:text-4xl md:text-6xl font-medium leading-none">
                <span>{firstName}</span>
                <span className="text-[color:var(--wedding-label-on-dark)] text-2xl sm:text-3xl md:text-5xl my-1 sm:my-0">❤️</span>
                <span>{lastName}</span>
              </h1>
            </div>

            {/* Optional Short Host Message — centered card below names */}
            {coupleInfo?.shortHostMessage && (
              <div className="w-full max-w-xl px-6 py-4 border-y border-[var(--wedding-nav-border)] mb-6 text-center">
                <p className="text-sm md:text-base leading-relaxed text-[color:var(--wedding-text-on-dark-secondary)]">
                  {coupleInfo.shortHostMessage}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full max-w-xl">
              <Link
                href="/rsvp"
                className="wedding-editorial-button group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 text-xs font-bold tracking-[0.2em] uppercase active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 transition-all duration-300 ease-out cursor-pointer"
              >
                <Heart size={14} className="fill-white/20 group-hover:scale-125 group-hover:fill-white transition-transform duration-300 ease-out" />
                <span>Reserve Your Seat</span>
              </Link>

              {storyVisible ? (
                <a
                  href="#our-story"
                  className="wedding-hero-secondary group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border text-xs font-bold tracking-[0.2em] uppercase hover:scale-[1.03] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out cursor-pointer"
                >
                  <span>Our Story</span>
                </a>
              ) : null}
            </div>

          </div>
        </FadeContent>
      </div>
    </section>
  );
}
