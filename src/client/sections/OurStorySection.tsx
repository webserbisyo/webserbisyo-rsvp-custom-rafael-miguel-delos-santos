"use client";

/**
 * OurStorySection
 *
 * Love story with ScrollReveal text animation.
 * Extracted from ClientEventRenderer.tsx lines 984–1001.
 */

import { SectionHeading } from "@/client/components/SectionHeading";
import { ScrollReveal } from "@/client/libs/reactbits";
import type { ClientLoveStoryData } from "@/client/types/client-view-model";

type OurStorySectionProps = {
  loveStory: ClientLoveStoryData;
};

export function OurStorySection({ loveStory }: OurStorySectionProps) {
  if (!loveStory) return null;
  return (
    <section id="our-story" className="py-24 px-4 bg-ivory">
      <div className="max-w-3xl mx-auto text-center">
        <SectionHeading label="Our Story" title={loveStory.storyTitle || "How We Met"} subtitle={loveStory.sectionIntro} />
        <div className="mt-8 text-lg md:text-xl font-serif text-cocoa leading-relaxed">
          {loveStory.storyBody ? (
            <ScrollReveal text={loveStory.storyBody} />
          ) : (
            <p>Our story is being written...</p>
          )}
        </div>
      </div>
    </section>
  );
}
