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
import { FallingPetals } from "@/client/components/FallingPetals";
import type { ClientLoveStoryData } from "@/client/types/client-view-model";

type LoveStorySectionProps = {
  loveStory: ClientLoveStoryData;
};

export function LoveStorySection({ loveStory }: LoveStorySectionProps) {
  const [folderSize, setFolderSize] = useState(1.38);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth >= 768) {
        setFolderSize(1.98);
      } else if (window.innerWidth >= 640) {
        setFolderSize(1.72);
      } else {
        setFolderSize(1.38);
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
      width={1376}
      height={768}
      decoding="async"
      loading="eager"
      className="w-full h-full object-cover object-[58%_center] rounded-[10px]"
    />,
    <img
      key="bride"
      src="/wedding-assets/female-solo-landscape.webp"
      alt="Isabella before the ceremony"
      width={1376}
      height={768}
      decoding="async"
      loading="eager"
      className="w-full h-full object-cover object-[42%_center] rounded-[10px]"
    />,
    <img
      key="couple"
      src="/wedding-assets/The-arrival-moment.webp"
      alt="Rafael and Isabella at the arrival moment"
      width={1376}
      height={768}
      decoding="async"
      loading="eager"
      className="w-full h-full object-cover object-center rounded-[10px]"
    />,
  ];

  return (
    <section id="our-story" className="relative isolate overflow-x-clip py-24 md:py-32 px-4 bg-ivory text-center animate-fade-in">
      {/* Ambient section-scoped petals */}
      <FallingPetals className="absolute inset-0 pointer-events-none z-[2] select-none" />

      {/* Absolute Decorative Background Layer - Corner Flowers and Palm Leaves (z-0) */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none" aria-hidden="true">
        {/* Top-Left Flower (17.webp) */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -top-14 -left-20 sm:-top-16 sm:-left-24 md:-top-24 md:-left-32 lg:-top-20 lg:-left-24 w-[7rem] sm:w-[9rem] md:w-[11rem] lg:w-[18rem] h-auto object-contain -rotate-12 opacity-70 lg:opacity-95 transition-[opacity,transform] duration-300"
        />

        {/* Top-Right Flower (16.webp) */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -top-14 -right-20 sm:-top-16 sm:-right-24 md:-top-24 md:-right-32 lg:-top-20 lg:-right-24 w-[7rem] sm:w-[9rem] md:w-[11rem] lg:w-[18rem] h-auto object-contain rotate-12 opacity-70 lg:opacity-95 transition-[opacity,transform] duration-300"
        />

        {/* Bottom-Left Flower (16.webp) - Tucked behind lower area with positive bottom offset */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -left-20 -bottom-20 sm:-left-24 sm:-bottom-24 md:-left-32 md:-bottom-28 lg:-left-24 lg:bottom-0 w-[7rem] sm:w-[9rem] md:w-[11rem] lg:w-[18rem] h-auto object-contain rotate-12 opacity-60 lg:opacity-90 transition-[opacity,transform] duration-300"
        />

        {/* Bottom-Right Flower (17.webp) - Tucked behind lower area with positive bottom offset */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -right-20 -bottom-20 sm:-right-24 sm:-bottom-24 md:-right-32 md:-bottom-28 lg:-right-24 lg:bottom-0 w-[7rem] sm:w-[9rem] md:w-[11rem] lg:w-[18rem] h-auto object-contain -rotate-12 opacity-60 lg:opacity-90 transition-[opacity,transform] duration-300"
        />

        {/* Left Palm Leaf (4.webp) */}
        <img
          src="/beach%20assets%20finalized/4.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute top-1/2 -translate-y-1/2 left-[-2rem] sm:left-[-3rem] md:left-[-4rem] lg:left-[-2rem] xl:left-[-3rem] w-[7rem] sm:w-[11rem] md:w-[14rem] lg:w-[20rem] xl:w-[24rem] h-auto object-contain opacity-100 transition-[opacity,transform] duration-300 hidden lg:block"
        />

        {/* Right Palm Leaf (5.webp) */}
        <img
          src="/beach%20assets%20finalized/5.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute top-1/2 -translate-y-1/2 right-[-2rem] sm:right-[-3rem] md:right-[-4rem] lg:right-[-2rem] xl:right-[-3rem] w-[7rem] sm:w-[11rem] md:w-[14rem] lg:w-[20rem] xl:w-[24rem] h-auto object-contain opacity-100 transition-[opacity,transform] duration-300 hidden lg:block"
        />
      </div>


      <div className="max-w-3xl mx-auto relative z-30">
        {/* Main Section Heading Group */}
        <SectionHeading
          label={sectionEyebrow}
          title={sectionHeading}
          subtitle={sectionIntro}
        />

        {/* Interactive Folder Component */}
        <div className="mt-16 mb-10 sm:mt-24 sm:mb-16 h-44 sm:h-56 md:h-64 flex items-center justify-center overflow-visible select-none">
          <Folder
            color="#d65f3f"
            size={folderSize}
            items={folderItems}
            className="mx-auto"
          />
        </div>

        {/* Story Narrative Content */}
        <div className="mt-8 sm:mt-12">
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
