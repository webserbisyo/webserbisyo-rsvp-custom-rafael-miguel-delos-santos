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
 * - Gated mock data that only displays in development when NEXT_PUBLIC_USE_MOCK_GUESTBOOK is true and real messages are absent.
 */

import { useState, useRef, useEffect } from "react";
import { SectionHeading } from "@/client/components/SectionHeading";
import { AnimatedContent } from "@/client/libs/reactbits";
import type { ClientGuestbookData } from "@/client/types/client-view-model";
import type { GuestbookMessage } from "@/types/public-event";
import { MOCK_GUESTBOOK_MESSAGES } from "@/client/mock/guestbook.mock";

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

export function GuestbookSection({
  guestbook,
  guestbookMessages,
  eventSource
}: GuestbookSectionProps) {
  const [expandedMessageId, setExpandedMessageId] = useState<string | number | null>(null);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const INITIAL_VISIBLE_MESSAGES = 6;

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

  // Enable mock visualization only in local development when NEXT_PUBLIC_USE_MOCK_GUESTBOOK is true and real messages are empty
  const canShowMockMessages =
    realMessages.length === 0 &&
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_USE_MOCK_GUESTBOOK === "true";

  // Map real database messages to our card model safely, filtering out empty ones
  const realDisplayMessages: DisplayMessage[] = realMessages
    .filter((msg) => msg.message && msg.message.trim() !== "")
    .map((msg, idx) => ({
      id: msg.id ?? `guestbook-${idx}`,
      name: msg.name?.trim() || "A Guest",
      message: msg.message!.trim(),
      createdAt: msg.createdAt ?? undefined
    }));

  // Map mock messages to the same card model, preserving their custom IDs and timestamps
  const mockDisplayMessages: DisplayMessage[] = MOCK_GUESTBOOK_MESSAGES.map((msg) => ({
    id: msg.id,
    name: msg.name,
    message: msg.message,
    createdAt: msg.createdAt
  }));

  // Resolve active dataset based on environment gating
  const messagesToRender =
    realMessages.length > 0
      ? realDisplayMessages
      : canShowMockMessages
      ? mockDisplayMessages
      : [];

  // Sort messages newest first based on createdAt
  const sortedMessages = [...messagesToRender].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : NaN;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : NaN;

    const hasA = !isNaN(timeA);
    const hasB = !isNaN(timeB);

    if (hasA && hasB) return timeB - timeA;
    if (hasA) return -1; // A has timestamp, place it before B (which has none)
    if (hasB) return 1;  // B has timestamp, place it before A (which has none)
    return 0; // Keep original order if both are missing timestamps
  });

  const visibleMessages = showAllMessages
    ? sortedMessages
    : sortedMessages.slice(0, INITIAL_VISIBLE_MESSAGES);

  const handleToggle = (id: string | number) => {
    setExpandedMessageId((prev) => (prev === id ? null : id));
  };

  const handleSectionToggle = () => {
    if (showAllMessages) {
      setShowAllMessages(false);
      setExpandedMessageId(null); // Clear card-level expansion
      document.getElementById("guestbook")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setShowAllMessages(true);
    }
  };

  return (
    <section
      id="guestbook"
      className="relative overflow-x-clip bg-cream pt-24 pb-28 md:pb-32 px-4"
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
          className="absolute h-auto pointer-events-none select-none z-0 rotate-[-5deg] opacity-75 left-0 top-2 w-24 sm:left-[-1rem] sm:w-28 md:left-[-2rem] md:w-36 lg:left-0 lg:top-2 lg:w-48 xl:left-6 xl:w-56"
        />

        {/* Right Bird - Top Right Framing */}
        <img
          src="/beach%20assets%20finalized/8.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute h-auto pointer-events-none select-none z-0 rotate-[5deg] scale-x-[-1] opacity-75 right-0 top-2 w-24 sm:right-[-1rem] sm:w-28 md:right-[-2rem] md:w-36 lg:right-0 lg:top-2 lg:w-48 xl:right-6 xl:w-56"
        />

        {/* Bottom-Left Flower - Anchors the base cleanly with positive bottom offset to prevent clipping */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-0 bottom-4 w-24 sm:left-[-2rem] sm:w-32 md:left-[-3rem] md:w-44 lg:-left-20 lg:bottom-8 lg:w-[19rem] h-auto object-contain rotate-12 pointer-events-none select-none z-0 opacity-100"
        />

        {/* Bottom-Right Flower - Anchors the base cleanly with positive bottom offset to prevent clipping */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-0 bottom-4 w-24 sm:right-[-2rem] sm:w-32 md:right-[-3rem] md:w-44 lg:-right-20 lg:bottom-8 lg:w-[19rem] h-auto object-contain -rotate-12 pointer-events-none select-none z-0 opacity-100"
        />
      </div>

      {/* 2. Main Content Wrapper (z-10) */}
      <div className="max-w-5xl mx-auto text-center relative z-30">
        <SectionHeading
          label="Guestbook"
          title={guestbook.sectionTitle || "A Note from Our Guests"}
          subtitle={guestbook.sectionIntro || "Heartfelt notes shared by the people celebrating with us."}
        />

        <AnimatedContent>
          {visibleMessages.length > 0 ? (
            /* Note-card grid: 1-col mobile, 2-col tablet, 3-col desktop */
            <div className="flex flex-col items-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 w-full text-center items-start">
                {visibleMessages.map((msg) => {
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

              {/* Section-level View More/Less Button */}
              {sortedMessages.length > INITIAL_VISIBLE_MESSAGES && (
                <div className="mt-12 flex flex-col items-center gap-3">
                  <span className="text-xs text-driftwood/75 font-medium tracking-wide">
                    {showAllMessages 
                      ? `Showing all ${sortedMessages.length} messages` 
                      : `Showing ${INITIAL_VISIBLE_MESSAGES} of ${sortedMessages.length} messages`
                    }
                  </span>
                  <button
                    onClick={handleSectionToggle}
                    className="group px-6 py-3 rounded-full border border-coral text-coral hover:bg-coral/[0.04] active:scale-95 transition-all duration-300 font-bold text-xs uppercase tracking-widest cursor-pointer shadow-[0_4px_12px_rgba(201,94,53,0.08)] hover:shadow-[0_8px_20px_rgba(201,94,53,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
                    type="button"
                  >
                    {showAllMessages ? "View Less" : "View More Messages"}
                  </button>
                </div>
              )}
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
