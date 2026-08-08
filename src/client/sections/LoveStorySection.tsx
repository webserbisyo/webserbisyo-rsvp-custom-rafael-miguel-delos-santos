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
import type { SectionSurface } from "@/client/client-section-registry";

type LoveStorySectionProps = {
  loveStory: ClientLoveStoryData;
  surface: SectionSurface;
};

export function LoveStorySection({
  loveStory,
  surface,
}: LoveStorySectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const folderSize = 1.0;

  if (!loveStory) return null;

  const sectionEyebrow = "LOVE STORY";
  const sectionHeading = loveStory.storyTitle?.trim() || "Our Story";
  const sectionIntro =
    loveStory.sectionIntro?.trim() ||
    "A little story about how our journey began.";
  const storyBody = loveStory.storyBody?.trim();

  // The three wedding photos as Folder items (Groom -> Bride -> Couple)
  const folderPhotos = [
    {
      src: "/wedding-assets/dianne/dianne-gallery-03-groom.webp",
      alt: "Portrait of Novio in a refined garden setting",
      title: "The Groom",
      subtitle: "NOVIO SOLO",
      aspectRatio: 0.85,
      focalPoint: { x: 50, y: 15 },
    },
    {
      src: "/wedding-assets/dianne/dianne-gallery-02-bride.webp",
      alt: "Portrait of Dianne in a refined garden setting",
      title: "The Bride",
      subtitle: "DIANNE SOLO",
      aspectRatio: 0.85,
      focalPoint: { x: 50, y: 15 },
    },
    {
      src: "/wedding-assets/dianne/dianne-gallery-04-silhouette.webp",
      alt: "Dianne and Novio together in a romantic evening portrait",
      title: "Our Story",
      subtitle: "DIANNE & NOVIO",
      aspectRatio: 2752 / 1536,
      focalPoint: { x: 50, y: 50 },
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
      focalPoint={photo.focalPoint}
      loading="eager"
    />
  ));

  return (
    <section
      id="our-story"
      data-tone={surface}
      className="wedding-section relative overflow-x-clip py-24 md:py-32 px-4 text-center animate-fade-in"
    >
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
        <div
          className={`flex items-end justify-center overflow-visible select-none transition-all duration-500 ease-in-out ${
            isOpen
              ? "h-[540px] mt-44 mb-28 pb-6 sm:h-[24rem] sm:mt-20 sm:mb-20 sm:pb-4 md:h-[28rem] md:mt-20 md:mb-24 md:pb-4 lg:h-[34rem] lg:mt-24 lg:mb-24 lg:pb-4"
              : "h-40 mt-20 mb-16 pb-4 sm:h-52 sm:mt-12 sm:mb-14 sm:pb-4 md:h-60 md:mt-12 md:mb-14 md:pb-4 lg:h-72 lg:mt-12 lg:mb-16 lg:pb-4"
          }`}
        >
          {/* Folder derives a darker shade in JavaScript, so it needs a parseable
              client-theme value instead of a CSS variable string. */}
          <Folder
            color="#4F5A46"
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
            <FadeContent
              blur={true}
              duration={0.8}
              delay={0.1}
              threshold={0.05}
            >
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
