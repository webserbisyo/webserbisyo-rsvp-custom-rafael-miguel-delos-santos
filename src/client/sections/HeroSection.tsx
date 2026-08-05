"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FadeContent } from "@/client/libs/reactbits";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { ClientCoupleInfo } from "@/client/types/client-view-model";
import { templateBranding } from "@/config/template-branding";

import { WeddingButton } from "@/client/components/ui/WeddingButton";

type HeroSectionProps = {
  coupleInfo: ClientCoupleInfo;
  storyVisible: boolean;
};

export function HeroSection({ coupleInfo, storyVisible }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 600], [0, 120]);
  const backgroundY = useSpring(rawY, { stiffness: 90, damping: 25, mass: 0.4 });

  const displayAs = coupleInfo?.displayAs?.trim() || "Rafael & Isabella";

  return (
    <section
      id="hero"
      data-tone="dark"
      className="wedding-section relative pt-24 pb-20 px-4 text-center overflow-hidden min-h-[95vh] min-h-[95svh] flex flex-col justify-center items-center"
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
        style={{
          background:
            "linear-gradient(to bottom, var(--wedding-hero-overlay-top), var(--wedding-hero-overlay-middle), var(--wedding-hero-overlay-bottom))",
        }}
      />

      <div className="wedding-hero-content relative z-20 max-w-4xl mx-auto w-full px-2 sm:px-4 my-auto translate-y-[clamp(0.75rem,2.5vh,2rem)]">
        <FadeContent>
          {/* Centered text stack — all elements stacked vertically and centered */}
          <div className="flex flex-col items-center gap-0">
            {/* Optional Host Line — centered pill above the couple names */}
            {coupleInfo?.hostLine && (
              <div className="wedding-hero-host-line mb-5 inline-flex items-center justify-center border px-4 py-2 text-center font-medium text-xs sm:text-sm tracking-[0.18em] uppercase text-[color:var(--wedding-label-on-dark)] bg-[rgb(23_21_18_/_62%)] border-[var(--wedding-nav-border)] backdrop-blur-sm rounded-[var(--wedding-button-radius)]">
                {coupleInfo.hostLine}
              </div>
            )}

            {/* Couple Names Card */}
            {displayAs ? (
              <div className="px-3 py-2 mb-4 max-w-full">
                <h1 className="wedding-display wedding-hero-name max-w-[min(100%,64rem)] text-balance text-[clamp(2.5rem,6vw,4.75rem)] font-medium leading-[1.08] tracking-[-0.025em] text-[color:var(--wedding-text-on-dark)]">
                  {displayAs}
                </h1>
              </div>
            ) : null}

            {/* Optional Short Host Message — centered card below names */}
            {coupleInfo?.shortHostMessage && (
              <div className="wedding-hero-message mt-4 mb-7 w-full max-w-xl border-y border-[var(--wedding-nav-border)] px-5 py-3 text-center">
                <p className="wedding-hero-message-text">
                  {coupleInfo.shortHostMessage}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full max-w-xl">
              <WeddingButton asChild variant="primary" size="lg" className="w-full sm:w-auto">
                <Link href="/rsvp" className="group">
                  <Heart
                    size={14}
                    className="fill-white/20 group-hover:scale-125 group-hover:fill-white transition-transform duration-300 ease-out"
                  />
                  <span>Reserve Your Seat</span>
                </Link>
              </WeddingButton>

              {storyVisible ? (
                <WeddingButton asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                  <a href="#our-story">
                    <span>Our Story</span>
                  </a>
                </WeddingButton>
              ) : null}
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
