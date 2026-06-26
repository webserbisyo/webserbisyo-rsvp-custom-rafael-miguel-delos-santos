"use client";

/**
 * LoveStorySection
 *
 * Displays the couple's love story with refined romantic typography and hierarchy.
 * Features an interactive "Love Mail / Envelope Memory Folder" that fans out three photo cards.
 * Enables a controlled, user-friendly blur reveal animation using the pre-existing FadeContent component.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { FadeContent } from "@/client/libs/reactbits";
import type { ClientLoveStoryData } from "@/client/types/client-view-model";
import { Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type LoveStorySectionProps = {
  loveStory: ClientLoveStoryData;
};

interface LoveMailEnvelopeProps {
  isOpen: boolean;
  onToggle: () => void;
  envelopeRef: React.RefObject<HTMLButtonElement | null>;
}

function LoveMailEnvelope({ isOpen, onToggle, envelopeRef }: LoveMailEnvelopeProps) {
  return (
    <div className="relative w-full overflow-visible px-4 py-12 sm:py-16 flex justify-center items-center select-none">
      <button
        type="button"
        ref={envelopeRef}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close love story photos" : "Open love story photos"}
        className="relative w-64 h-40 sm:w-[360px] sm:h-[220px] transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sand/50 focus-visible:ring-offset-4 rounded-xl"
        style={{
          transform: isOpen ? "translateY(-8px)" : undefined
        }}
      >
        {/* 1. Envelope Back Panel (z-0) */}
        <div className="absolute inset-0 bg-[#E3DEC9]/75 border border-sand/40 rounded-xl z-0 shadow-[inset_0_4px_12px_rgba(139,104,58,0.08),0_4px_20px_rgba(0,0,0,0.04)]" />

        {/* 2. Three Photo Cards fanning out (z-10 / z-12) */}
        {/* Left Card */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-28 sm:w-[170px] aspect-[4/3] bg-white border border-white rounded p-1 pb-4 sm:pb-6 shadow-md transition-all duration-700 ease-out z-10 ${
            isOpen
              ? "translate-x-[-90%] sm:translate-x-[-105%] -translate-y-[35%] sm:-translate-y-[45%] rotate-[-10deg] opacity-100"
              : "translate-y-4 opacity-0 scale-95 pointer-events-none rotate-0"
          }`}
        >
          <div className="w-full h-full bg-[#E5E3DF] rounded-sm overflow-hidden relative">
            <img
              src="/wedding-assets/male-solo-landscape.webp"
              alt="Rafael by the shore"
              decoding="async"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <span className="font-serif italic text-[10px] sm:text-xs text-cocoa/80 mt-1 sm:mt-1.5 block text-center">
            The Groom
          </span>
        </div>

        {/* Right Card */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-28 sm:w-[170px] aspect-[4/3] bg-white border border-white rounded p-1 pb-4 sm:pb-6 shadow-md transition-all duration-700 ease-out z-10 ${
            isOpen
              ? "translate-x-[-10%] sm:translate-x-[5%] -translate-y-[35%] sm:-translate-y-[45%] rotate-[10deg] opacity-100"
              : "translate-y-4 opacity-0 scale-95 pointer-events-none rotate-0"
          }`}
        >
          <div className="w-full h-full bg-[#E5E3DF] rounded-sm overflow-hidden relative">
            <img
              src="/wedding-assets/female-solo-landscape.webp"
              alt="Isabella by the shore"
              decoding="async"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <span className="font-serif italic text-[10px] sm:text-xs text-cocoa/80 mt-1 sm:mt-1.5 block text-center">
            The Bride
          </span>
        </div>

        {/* Center Card (z-12, dominant) */}
        <div
          className={`absolute bottom-4 left-1/2 w-28 sm:w-[170px] aspect-[4/3] bg-white border border-white rounded p-1 pb-4 sm:pb-6 shadow-md transition-all duration-700 ease-out z-12 ${
            isOpen
              ? "-translate-x-1/2 -translate-y-[55%] sm:-translate-y-[65%] rotate-[-2deg] scale-105 opacity-100"
              : "translate-y-4 -translate-x-1/2 opacity-0 scale-95 pointer-events-none rotate-0"
          }`}
        >
          <div className="w-full h-full bg-[#E5E3DF] rounded-sm overflow-hidden relative">
            <img
              src="/wedding-assets/The-arrival-moment.webp"
              alt="Rafael and Isabella arrival moment"
              decoding="async"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <span className="font-serif italic text-[10px] sm:text-xs text-cocoa/80 mt-1 sm:mt-1.5 block text-center">
            Our Moment
          </span>
        </div>

        {/* 3. Envelope Front Pocket (z-20) */}
        <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-white/95 backdrop-blur-sm border-t-0 border-x border-b border-sand/35 rounded-b-xl z-20 shadow-[0_4px_12px_rgba(0,0,0,0.03)]" />

        {/* 4. Triangular Top Flap (z-30 when closed, z-5 when open) */}
        <div
          className="absolute top-0 left-0 right-0 h-[60%] origin-top transition-transform duration-700 ease-in-out"
          style={{
            transform: isOpen ? "rotateX(-110deg)" : "rotateX(0deg)",
            transformStyle: "preserve-3d",
            zIndex: isOpen ? 5 : 30
          }}
        >
          {/* Flap SVG Triangle with fine border */}
          <svg
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(139,104,58,0.05)]"
            aria-hidden="true"
          >
            <polygon
              points="0,0 50,60 100,0"
              fill="#FAF8F5"
              stroke="#e3decb"
              strokeWidth="0.8"
            />
          </svg>

          {/* Coral Heart Seal wax stamp */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-40 bg-white border border-sand/40 p-1.5 rounded-full shadow-soft hover:scale-110 transition-transform duration-300">
            <Heart className="w-4 h-4 text-coral fill-coral/20" aria-hidden="true" />
          </div>
        </div>
      </button>
    </div>
  );
}

export function LoveStorySection({ loveStory }: LoveStorySectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const envelopeRef = useRef<HTMLButtonElement | null>(null);

  // One-time auto-open viewport entry observer
  useEffect(() => {
    const el = envelopeRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoOpened && !userInteracted) {
          setIsOpen(true);
          setHasAutoOpened(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAutoOpened, userInteracted]);

  if (!loveStory) return null;

  const sectionEyebrow = "LOVE STORY";
  const sectionHeading = loveStory.storyTitle?.trim() || "Our Story";
  const sectionIntro = loveStory.sectionIntro?.trim() || "A little story about how our journey began.";
  const storyBody = loveStory.storyBody?.trim();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    setUserInteracted(true);
  };

  return (
    <section id="our-story" className="py-24 md:py-32 px-4 bg-ivory text-center animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Main Section Heading Group */}
        <SectionHeading
          label={sectionEyebrow}
          title={sectionHeading}
          subtitle={sectionIntro}
        />

        {/* Interactive Envelope Memory Folder */}
        <LoveMailEnvelope
          isOpen={isOpen}
          onToggle={handleToggle}
          envelopeRef={envelopeRef}
        />

        {/* Story Narrative Content */}
        <div className="mt-14 sm:mt-16">
          {storyBody ? (
            <FadeContent blur={true} duration={0.8} delay={0.1} threshold={0.05}>
              {/* Romantic Narrative Body */}
              <p className="text-cocoa/90 font-serif italic text-base sm:text-lg md:text-xl leading-8 md:leading-9 whitespace-pre-line text-center">
                {storyBody}
              </p>
            </FadeContent>
          ) : (
            <p className="text-cocoa/65 font-serif italic text-base">
              Our story is being written...
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
