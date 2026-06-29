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

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FadeContent } from "@/client/libs/reactbits";
import { Heart } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/client/utils/formatters";
import { WaveDivider } from "@/client/components/WaveDivider";
import type { ClientCoupleInfo, ClientCeremonyData } from "@/client/types/client-view-model";

type HeroSectionProps = {
  coupleInfo: ClientCoupleInfo;
  ceremony: ClientCeremonyData;
};

export function HeroSection({ coupleInfo, ceremony }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 600], [0, 120]);
  const backgroundY = useSpring(rawY, { stiffness: 90, damping: 25, mass: 0.4 });

  const displayAs = coupleInfo?.displayAs || "Rafael & Isabella";
  const nameParts = displayAs.split(/\s*(?:&|and|❤️|❤)\s*/i);
  const firstName = nameParts[0]?.trim() || "Rafael";
  const lastName = nameParts[1]?.trim() || "Isabella";

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative pt-20 pb-16 px-4 text-center overflow-hidden bg-ivory min-h-[95vh] flex flex-col justify-start"
    >
      {/* Smooth Parallax Background Image */}
      <motion.div
        style={{
          y: backgroundY,
          backgroundImage: "url('/wedding-assets/The-ceremony-arch.webp')",
          backgroundPosition: "center 40%",
        }}
        className="absolute inset-x-0 bottom-0 top-[74px] z-0 bg-cover bg-no-repeat scale-120 pointer-events-none"
      />
      {/* Soft gradient overlay for styling and high text readability */}
      <div className="absolute inset-x-0 bottom-0 top-[74px] z-1 bg-gradient-to-b from-black/25 via-[#2D1B12]/15 to-[#2D1B12]/30 pointer-events-none" />

      <div className="relative z-20 max-w-4xl mx-auto w-full px-4 mb-4 mt-[42vh] sm:mt-[45vh]">
        <FadeContent>
          {coupleInfo?.hostLine && (
            <div className="inline-block px-6 py-2 rounded-full border border-coral/30 text-coral text-xs font-semibold tracking-[0.2em] uppercase mb-6 bg-[#FDF6ED]/30 backdrop-blur-md">
              {coupleInfo.hostLine}
            </div>
          )}

          {/* Title Card */}
          <div className="inline-block px-6 py-4 md:px-8 md:py-5 rounded-2xl bg-[#FDF6ED]/40 backdrop-blur-md border border-[#FDF6ED]/25 shadow-soft mb-6 max-w-full">
            <h1 className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 font-serif text-charcoal text-3xl sm:text-4xl md:text-6xl font-medium leading-none">
              <span>{firstName}</span>
              <span className="text-coral text-2xl sm:text-3xl md:text-5xl my-1 sm:my-0">❤️</span>
              <span>{lastName}</span>
            </h1>
          </div>


          {/* Message Card */}
          {coupleInfo?.shortHostMessage && (
            <div className="block max-w-xl mx-auto px-6 py-4 rounded-xl bg-[#FDF6ED]/35 backdrop-blur-md border border-[#FDF6ED]/20 shadow-soft mb-10">
              <p className="text-sm md:text-base leading-relaxed text-charcoal/80">
                {coupleInfo.shortHostMessage}
              </p>
            </div>
          )}

          {/* Action Buttons (no container) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 max-w-xl mx-auto">
            <Link
              href="/rsvp"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-coral text-white border border-transparent rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-md hover:bg-coral hover:brightness-105 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(201,94,53,0.38)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 focus-visible:ring-offset-2 transition-all duration-300 ease-out cursor-pointer"
            >
              <Heart size={14} className="fill-white/20 group-hover:scale-125 group-hover:fill-white transition-transform duration-300 ease-out" />
              <span>Reserve Your Seat</span>
            </Link>

            <a
              href="#our-story"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border border-white/40 text-white bg-transparent rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/10 hover:border-white hover:shadow-[0_0_16px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-[0.97] backdrop-blur-sm transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out cursor-pointer"
            >
              <span>Our Story</span>
            </a>
          </div>
        </FadeContent>
      </div>
      {/* Wave divider at bottom to cut the image in a wavy shape */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <WaveDivider className="text-cream" />
      </div>
    </section>
  );
}
