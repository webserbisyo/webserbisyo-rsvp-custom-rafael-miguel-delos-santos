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
import { FolderPhotoCard } from "@/client/components/media/FolderPhotoCard";
import type { ClientLoveStoryData } from "@/client/types/client-view-model";

type LoveStorySectionProps = {
  loveStory: ClientLoveStoryData;
};

export function LoveStorySection({ loveStory }: LoveStorySectionProps) {
  const [folderSize, setFolderSize] = useState(1.0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setFolderSize(2.0);
      } else if (w >= 768) {
        setFolderSize(1.6);
      } else if (w >= 640) {
        setFolderSize(1.35);
      } else if (w >= 410) {
        setFolderSize(1.2);
      } else if (w >= 360) {
        setFolderSize(1.1);
      } else {
        setFolderSize(0.95);
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
          className="absolute -top-4 left-0 w-20 sm:-top-6 sm:-left-8 md:-top-8 md:-left-12 lg:-top-16 lg:-left-20 sm:w-36 md:w-44 lg:w-[18rem] h-auto object-contain -rotate-12 opacity-95 sm:opacity-100 transition-all duration-300"
        />

        {/* Top-Right Flower (16.webp) */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute -top-4 right-0 w-20 sm:-top-6 sm:-right-8 md:-top-8 md:-right-12 lg:-top-16 lg:-right-20 sm:w-36 md:w-44 lg:w-[18rem] h-auto object-contain rotate-12 opacity-95 sm:opacity-100 transition-all duration-300"
        />

        {/* Bottom-Left Flower (16.webp) - Contained bottom shelf/corner */}
        <img
          src="/beach%20assets%20finalized/16.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute bottom-2 left-2 w-20 sm:bottom-4 sm:left-4 md:-bottom-8 md:-left-12 lg:bottom-0 lg:-left-20 sm:w-36 md:w-44 lg:w-[18rem] h-auto object-contain rotate-12 opacity-100 transition-all duration-300"
        />

        {/* Bottom-Right Flower (17.webp) - Contained bottom shelf/corner */}
        <img
          src="/beach%20assets%20finalized/17.webp"
          alt=""
          aria-hidden="true"
          width={2048}
          height={2048}
          decoding="async"
          className="absolute bottom-2 right-2 w-20 sm:bottom-4 sm:right-4 md:-bottom-8 md:-right-12 lg:bottom-0 lg:-right-20 sm:w-36 md:w-44 lg:w-[18rem] h-auto object-contain -rotate-12 opacity-100 transition-all duration-300"
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
        <div className={`mb-16 sm:mb-16 flex items-end justify-center overflow-visible select-none transition-all duration-500 ease-in-out ${
          isOpen 
            ? "h-[480px] mt-44 pb-6 sm:h-56 sm:mt-24 sm:pb-4 md:h-64 md:mt-24 md:pb-4" 
            : "h-44 mt-24 pb-4 sm:h-56 sm:mt-24 sm:pb-4 md:h-64 md:mt-24 md:pb-4"
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
