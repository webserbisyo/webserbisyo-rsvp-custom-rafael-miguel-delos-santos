"use client";

/**
 * GuestbookSection
 *
 * Displays approved guest notes on an elegant "note wall" grid layout.
 *
 * Refinement features:
 * - Centered card content containing only: message, flex divider, and guest name.
 * - Complete removal of relationship badges.
 * - Inline expand/collapse toggle for long messages (exceeding 180 characters).
 * - Background decoration framing copying the SponsorsSection bird treatment (7.webp and 8.webp).
 * - Bottom-left and bottom-right corner flowers (17.webp and 16.webp) with positive bottom offsets to avoid clipping.
 * - Increased bottom padding on the section wrapper to avoid flower-card overlaps.
 * - Complete removal of the old side palm leaves to prevent asset overcrowding.
 * - Gated mock data that only displays in development or design mode when real messages are absent.
 */

import { useState, useRef, useEffect } from "react";
import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientGuestbookData } from "@/client/types/client-view-model";
import type { GuestbookMessage } from "@/types/public-event";

type GuestbookSectionProps = {
  guestbook: ClientGuestbookData;
  guestbookMessages?: GuestbookMessage[];
  eventSource?: "design" | "snapshot" | "live";
};

interface DisplayMessage {
  id: string | number;
  name: string;
  message: string;
  createdAt?: string;
}

const MOCK_GUESTBOOK_MESSAGES = [
  {
    name: "Tito Ramon & Tita Elisa",
    message: "Wishing you both a lifetime filled with love, laughter, and quiet joy in every season of life. May your home always be full of warmth and grace."
  },
  {
    name: "Andrea Cruz",
    message: "Seeing your love story unfold has been such a beautiful blessing. Wishing you a marriage filled with patience, kindness, and unforgettable memories."
  },
  {
    name: "Miguel Santos",
    message: "Congratulations on this beautiful new chapter. May your partnership continue to grow stronger through every challenge and every celebration ahead."
  },
  {
    name: "Ninong Daniel",
    message: "May your union always be guided by faith, understanding, and deep respect for one another. Praying for a joyful and abundant married life."
  },
  {
    name: "Carla & Jen",
    message: "Your love is inspiring, and your wedding is such a wonderful reflection of who you are. Wishing you endless happiness and beautiful adventures together."
  },
  {
    name: "Lola Teresa",
    message: "Seeing the two of you surrounded by family, friends, and the beauty of this day has been such a heartfelt reminder of what love can become when it is patient, kind, and deeply rooted in friendship. May your marriage always be filled with laughter, understanding, quiet strength, and countless memories that make every season of life feel meaningful."
  }
];

export function GuestbookSection({
  guestbook,
  guestbookMessages,
  eventSource
}: GuestbookSectionProps) {
  const [expandedMessageId, setExpandedMessageId] = useState<string | number | null>(null);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const updateScrollFades = (element: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element;
    setShowTopFade(scrollTop > 2);
    setShowBottomFade(scrollHeight - scrollTop - clientHeight > 2);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    updateScrollFades(event.currentTarget);
  };

  useEffect(() => {
    const element = scrollContainerRef.current;

    if (!element) {
      setShowTopFade(false);
      setShowBottomFade(false);
      return;
    }

    requestAnimationFrame(() => {
      updateScrollFades(element);
    });
  }, [expandedMessageId]);

  if (!guestbook) return null;

  const realMessages = guestbookMessages ?? [];

  // Enable mock visualization only in local development or inside the dashboard designer
  const canShowMockMessages =
    realMessages.length === 0 &&
    (process.env.NODE_ENV === "development" || eventSource === "design");

  // Map real database messages to our card model safely
  const realDisplayMessages: DisplayMessage[] = realMessages.map((msg, idx) => ({
    id: msg.id ?? idx,
    name: msg.name ?? "Anonymous Guest",
    message: msg.message ?? "",
    createdAt: msg.createdAt ?? undefined
  }));

  // Map mock messages to the same card model
  const mockDisplayMessages: DisplayMessage[] = MOCK_GUESTBOOK_MESSAGES.map((msg, idx) => ({
    id: `mock-${idx}`,
    name: msg.name,
    message: msg.message
  }));

  // Resolve active dataset based on environment gating
  const messagesToRender =
    realMessages.length > 0
      ? realDisplayMessages
      : canShowMockMessages
      ? mockDisplayMessages
      : [];

  const handleToggle = (id: string | number) => {
    setExpandedMessageId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="guestbook"
      className="relative isolate overflow-x-clip bg-cream pt-24 pb-28 md:pb-32 px-4"
    >
      {/* 1. Absolute Decorative Background Layer (z-0, pointer-events-none, no lazy loading, opacity-100) */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none" aria-hidden="true">
        {/* Left Bird - Top Left Framing */}
        <img
          src="/beach%20assets%20finalized/7.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-2 md:left-6 lg:left-10 top-4 md:top-8 w-20 sm:w-24 md:w-48 lg:w-56 xl:w-64 h-auto pointer-events-none select-none z-0 rotate-[-5deg] opacity-100"
        />

        {/* Right Bird - Top Right Framing */}
        <img
          src="/beach%20assets%20finalized/8.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-2 md:right-6 lg:right-10 top-4 md:top-8 w-20 sm:w-24 md:w-48 lg:w-56 xl:w-64 h-auto pointer-events-none select-none z-0 rotate-[5deg] scale-x-[-1] opacity-100"
        />

        {/* Bottom-Left Flower - Anchors the base cleanly with positive bottom offset to prevent clipping */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -left-10 bottom-2 sm:-left-12 sm:bottom-4 md:-left-16 md:bottom-6 lg:-left-20 lg:bottom-8 w-[9rem] sm:w-[12rem] md:w-[16rem] lg:w-[19rem] h-auto object-contain rotate-12 pointer-events-none select-none z-0 opacity-100"
        />

        {/* Bottom-Right Flower - Anchors the base cleanly with positive bottom offset to prevent clipping */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -right-10 bottom-2 sm:-right-12 sm:bottom-4 md:-right-16 md:bottom-6 lg:-right-20 lg:bottom-8 w-[9rem] sm:w-[12rem] md:w-[16rem] lg:w-[19rem] h-auto object-contain -rotate-12 pointer-events-none select-none z-0 opacity-100"
        />
      </div>

      {/* 2. Main Content Wrapper (z-10) */}
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <SectionHeading
          label="Guestbook"
          title={guestbook.sectionTitle || "A Note from Our Guests"}
          subtitle={guestbook.sectionIntro || "Heartfelt notes shared by the people celebrating with us."}
        />

        <AnimatedContent>
          {messagesToRender.length > 0 ? (
            /* Note-card grid: 1-col mobile, 2-col tablet, 3-col desktop */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 w-full text-center items-start">
              {messagesToRender.map((msg) => {
                const isLong = msg.message.length > 180;
                const isExpanded = expandedMessageId === msg.id;

                // Mobile: expands inline
                const mobileDisplayText = isLong && !isExpanded
                  ? `${msg.message.slice(0, 175)}...`
                  : msg.message;

                // Desktop: always truncated in the grid card unless expanded
                const desktopDisplayText = isLong
                  ? `${msg.message.slice(0, 175)}...`
                  : msg.message;

                return (
                  <div
                    key={msg.id}
                    className="bg-white/65 backdrop-blur-md border border-sand/30 rounded-2xl p-6 sm:p-7 shadow-soft hover:border-sand/50 transition-[border-color,box-shadow] duration-300 flex flex-col justify-between items-center h-full text-center"
                  >
                    {/* Upper Part: Message & Inline Toggle */}
                    <div className="flex flex-col items-center w-full">
                      {/* Message Body (Mobile) */}
                      <p className="block md:hidden text-cocoa/90 font-serif italic text-sm sm:text-base leading-relaxed">
                        &ldquo;{mobileDisplayText}&rdquo;
                      </p>

                      {/* Message Body (Desktop/Tablet) */}
                      <div className="hidden md:block w-full">
                        {isLong && isExpanded ? (
                          <div className="relative w-full">
                            <div
                              ref={scrollContainerRef}
                              onScroll={handleScroll}
                              tabIndex={0}
                              className="guestbook-scrollarea max-h-[10rem] overflow-y-scroll pr-4 [scrollbar-gutter:stable] text-cocoa/90 font-serif italic text-sm sm:text-base leading-relaxed text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
                            >
                              &ldquo;{msg.message}&rdquo;
                            </div>
                            {showTopFade && (
                              <div
                                className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-6 bg-gradient-to-b from-white/90 to-transparent"
                                aria-hidden="true"
                              />
                            )}
                            {showBottomFade && (
                              <div
                                className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-8 bg-gradient-to-t from-white/95 to-transparent"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        ) : (
                          <p className="text-cocoa/90 font-serif italic text-sm sm:text-base leading-relaxed">
                            &ldquo;{desktopDisplayText}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Toggle Button directly below the message */}
                      {isLong && (
                        <div className="mt-2">
                          {/* Mobile Toggle */}
                          <button
                            onClick={() => handleToggle(msg.id)}
                            className="block md:hidden text-coral hover:text-cocoa text-xs font-bold uppercase tracking-wider underline focus:outline-none transition-colors cursor-pointer"
                            type="button"
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? "View less" : "View more"}
                          </button>

                          {/* Desktop/Tablet Toggle */}
                          <button
                            onClick={() => handleToggle(msg.id)}
                            className="hidden md:block text-coral hover:text-cocoa text-xs font-bold uppercase tracking-wider underline focus:outline-none transition-colors cursor-pointer"
                            type="button"
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? "View less" : "View more"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Lower Part: Divider & Name */}
                    <div className="flex flex-col items-center w-full mt-4">
                      {/* Centered Premium Flex Divider */}
                      <div className="mb-4 flex w-full items-center justify-center select-none" aria-hidden="true">
                        <span className="h-px w-12 sm:w-16 bg-sand/35" />
                        <span className="mx-3 text-xs text-coral/65">✦</span>
                        <span className="h-px w-12 sm:w-16 bg-sand/35" />
                      </div>

                      {/* Guest Name */}
                      <span className="text-coral text-xs sm:text-sm font-bold uppercase tracking-wider block">
                        {msg.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Polished empty state glass card for production */
            <div className="max-w-2xl mx-auto mt-12">
              <div className="bg-white/65 backdrop-blur-md border border-sand/30 rounded-3xl p-8 sm:p-10 text-center shadow-soft">
                <p className="text-cocoa/85 font-serif italic text-base sm:text-lg leading-relaxed">
                  {guestbook.emptyStateMessage || "This space will soon be filled with kind words and blessings from loved ones."}
                </p>
              </div>
            </div>
          )}
        </AnimatedContent>
      </div>
    </section>
  );
}
