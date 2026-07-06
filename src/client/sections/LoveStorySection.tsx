"use client";

/**
 * LoveStorySection
 *
 * Displays the couple's love story with refined romantic typography and hierarchy.
 * Features an interactive "Folder" component from React Bits that fans out three photo cards.
 * Enables a controlled, user-friendly blur reveal animation using the pre-existing FadeContent component.
 */

import { useState } from "react";
import { SectionHeading } from "@/client/components/SectionHeading";
import { FadeContent, Folder } from "@/client/libs/reactbits";
import { FolderPhotoCard } from "@/client/components/media/FolderPhotoCard";
import type { ClientLoveStoryData } from "@/client/types/client-view-model";

type LoveStorySectionProps = {
  loveStory: ClientLoveStoryData;
};

export function LoveStorySection({ loveStory }: LoveStorySectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const folderSize = 1.0;

  if (!loveStory) return null;

  const sectionEyebrow = "LOVE STORY";
  const sectionHeading = loveStory.storyTitle?.trim() || "Our Story";
  const sectionIntro = loveStory.sectionIntro?.trim() || "A little story about how our journey began.";
  const storyBody = loveStory.storyBody?.trim();

  // The three wedding photos as Folder items, ordered for center/focus on The-arrival-moment.webp
  const folderPhotos = [
    {
      src: "/wedding-assets/male-solo-landscape.webp",
      alt: "Rafael before the ceremony",
      title: "The Groom",
      subtitle: "RAFAEL SOLO",
      aspectRatio: 1376 / 768,
    },
    {
      src: "/wedding-assets/female-solo-landscape.webp",
      alt: "Isabella before the ceremony",
      title: "The Bride",
      subtitle: "ISABELLA SOLO",
      aspectRatio: 1376 / 768,
    },
    {
      src: "/wedding-assets/The-arrival-moment.webp",
      alt: "Rafael and Isabella by the sea",
      title: "Our Story",
      subtitle: "BY THE SEA",
      aspectRatio: 1376 / 768,
    },
  ];

  const folderItems = folderPhotos.map((photo) => (
    <FolderPhotoCard
      key={photo.src}
      src={photo.src}
      alt={photo.alt}
      title={photo.title}
      subtitle={photo.subtitle}
      aspectRatio={photo.aspectRatio}
      loading="eager"
    />
  ));

  return (
    <section id="our-story" className="relative overflow-x-clip py-24 md:py-32 px-4 bg-ivory text-center animate-fade-in">
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
          className="absolute -top-4 left-0 w-24 sm:-top-6 sm:-left-8 md:-top-8 md:-left-12 lg:-top-16 lg:-left-20 sm:w-36 md:w-44 lg:w-[18rem] h-auto object-contain -rotate-12 opacity-100 transition-all duration-300"
        />

        {/* Top-Right Flower (16.webp) */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -top-4 right-0 w-24 sm:-top-6 sm:-right-8 md:-top-8 md:-right-12 lg:-top-16 lg:-right-20 sm:w-36 md:w-44 lg:w-[18rem] h-auto object-contain rotate-12 opacity-100 transition-all duration-300"
        />

        {/* Bottom-Left Flower (16.webp) - Contained bottom shelf/corner */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute left-0 bottom-4 w-24 sm:left-[-2rem] sm:bottom-4 sm:w-36 md:left-[-3rem] md:w-44 lg:bottom-0 lg:-left-20 lg:w-[18rem] h-auto object-contain rotate-12 opacity-100 transition-all duration-300"
        />

        {/* Bottom-Right Flower (17.webp) - Contained bottom shelf/corner */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute right-0 bottom-4 w-24 sm:right-[-2rem] sm:bottom-4 sm:w-36 md:right-[-3rem] md:w-44 lg:bottom-0 lg:-right-20 lg:w-[18rem] h-auto object-contain -rotate-12 opacity-100 transition-all duration-300"
        />

        {/* Left Palm Leaf (4.webp) - Desktop/Mobile Side Frame */}
        <img
          src="/beach%20assets%20finalized/4.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute top-1/2 -translate-y-1/2 left-[-2rem] sm:left-[-3rem] md:left-[-4rem] lg:left-[-2rem] xl:left-[-3rem] w-[8rem] sm:w-[11rem] md:w-[14rem] lg:w-[20rem] xl:w-[24rem] h-auto object-contain opacity-100 transition-[opacity,transform] duration-300"
        />

        {/* Right Palm Leaf (5.webp) - Desktop/Mobile Side Frame */}
        <img
          src="/beach%20assets%20finalized/5.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute top-1/2 -translate-y-1/2 right-[-2rem] sm:right-[-3rem] md:right-[-4rem] lg:right-[-2rem] xl:right-[-3rem] w-[8rem] sm:w-[11rem] md:w-[14rem] lg:w-[20rem] xl:w-[24rem] h-auto object-contain opacity-100 transition-[opacity,transform] duration-300"
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
        {/*
          Stage sizing rationale:
          - Closed: just tall enough to show folder + tab (144px base). No extra whitespace.
          - Open mobile: photos scale to 1.5× and stack vertically. Stage must accommodate
            the full visual height so cards don't overlap the narrative text below.
          - Open desktop: cards fan sideways (lg transform), needs vertical clearance for fan.
        */}
        <div className={`flex items-end justify-center overflow-visible select-none transition-all duration-500 ease-in-out ${
          isOpen
            ? "h-[540px] mt-44 mb-28 pb-6 sm:h-[24rem] sm:mt-20 sm:mb-20 sm:pb-4 md:h-[28rem] md:mt-20 md:mb-24 md:pb-4 lg:h-[34rem] lg:mt-24 lg:mb-24 lg:pb-4"
            : "h-40 mt-20 mb-16 pb-4 sm:h-52 sm:mt-12 sm:mb-14 sm:pb-4 md:h-60 md:mt-12 md:mb-14 md:pb-4 lg:h-72 lg:mt-12 lg:mb-16 lg:pb-4"
        }`}>
          <Folder
            color="#d65f3f"
            size={folderSize}
            items={folderItems}
            className="mx-auto"
            open={isOpen}
            onOpenChange={setIsOpen}
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
