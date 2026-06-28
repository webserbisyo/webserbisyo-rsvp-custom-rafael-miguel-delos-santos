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

type LoveStorySectionProps = {
  loveStory: ClientLoveStoryData;
};


export function LoveStorySection({ loveStory }: LoveStorySectionProps) {
  if (!loveStory) return null;

  const sectionEyebrow = "LOVE STORY";
  const sectionHeading = loveStory.storyTitle?.trim() || "Our Story";
  const sectionIntro = loveStory.sectionIntro?.trim() || "A little story about how our journey began.";
  const storyBody = loveStory.storyBody?.trim();

  return (
    <section id="our-story" className="py-24 md:py-32 px-4 bg-ivory text-center animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Main Section Heading Group */}
        <SectionHeading
          label={sectionEyebrow}
          title={sectionHeading}
          subtitle={sectionIntro}
        />

        {/* Story Narrative Content */}
        <div className="mt-12 sm:mt-16">
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
