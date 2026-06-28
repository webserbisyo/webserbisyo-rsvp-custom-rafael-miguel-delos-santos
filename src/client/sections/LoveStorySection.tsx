"use client";

/**
 * LoveStorySection
 *
 * Displays the couple's love story with refined romantic typography and hierarchy.
 * Features an interactive "Folder" component from React Bits that fans out three photo cards.
 * Enables a controlled, user-friendly blur reveal animation using the pre-existing FadeContent component.
 */

import { useEffect, useState } from "react";
import { SectionHeading } from "@/client/components/SectionHeading";
import { FadeContent, Folder } from "@/client/libs/reactbits";
import type { ClientLoveStoryData } from "@/client/types/client-view-model";

type LoveStorySectionProps = {
  loveStory: ClientLoveStoryData;
};

export function LoveStorySection({ loveStory }: LoveStorySectionProps) {
  const [folderSize, setFolderSize] = useState(2.2);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 768) {
        setFolderSize(3.2);
      } else if (window.innerWidth >= 640) {
        setFolderSize(2.8);
      } else {
        setFolderSize(2.2);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!loveStory) return null;

  const sectionEyebrow = "LOVE STORY";
  const sectionHeading = loveStory.storyTitle?.trim() || "Our Story";
  const sectionIntro = loveStory.sectionIntro?.trim() || "A little story about how our journey began.";
  const storyBody = loveStory.storyBody?.trim();

  // The three wedding photos as Folder items, ordered for center/focus on The-arrival-moment.webp
  const folderItems = [
    <img
      key="groom"
      src="/wedding-assets/male-solo-landscape.webp"
      alt="Rafael before the ceremony"
      decoding="async"
      className="w-full h-full object-cover rounded-[10px]"
    />,
    <img
      key="bride"
      src="/wedding-assets/female-solo-landscape.webp"
      alt="Isabella before the ceremony"
      decoding="async"
      className="w-full h-full object-cover rounded-[10px]"
    />,
    <img
      key="couple"
      src="/wedding-assets/The-arrival-moment.webp"
      alt="Rafael and Isabella at the arrival moment"
      decoding="async"
      className="w-full h-full object-cover rounded-[10px]"
    />,
  ];

  return (
    <section id="our-story" className="py-24 md:py-32 px-4 bg-ivory text-center animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Main Section Heading Group */}
        <SectionHeading
          label={sectionEyebrow}
          title={sectionHeading}
          subtitle={sectionIntro}
        />

        {/* Interactive Folder Component */}
        <div className="my-16 sm:my-24 h-48 sm:h-64 flex items-center justify-center overflow-visible select-none">
          <Folder
            color="#d65f3f"
            size={folderSize}
            items={folderItems}
            className="mx-auto"
          />
        </div>

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

