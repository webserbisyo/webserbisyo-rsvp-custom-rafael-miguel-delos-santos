"use client";

/**
 * ClientEventRenderer — Composition Shell
 *
 * Orchestrates all client sections with typed data.
 * Previously a 1,097-line monolith; now a ~90-line composition-only file.
 *
 * All section logic, utilities, constants, and UI primitives have been
 * extracted into their own modules under src/client/sections/,
 * src/client/components/, src/client/utils/, and src/client/types/.
 */

import { useState, useEffect } from "react";
import type { ClientEventRendererProps } from "@/client/renderer/client-renderer-types";
import { buildClientViewModel } from "@/client/types/build-client-view-model";
import { WaveDivider, ScrollProgressBar } from "@/client/components";
import { AudioProvider } from "@/client/components/audio-context";
import { FloatingMusicBubble } from "@/client/components/FloatingMusicBubble";
import {
  HeroSection,
  CountdownSection,
  MusicSection,
  GallerySection,
  CeremonySection,
  VenueSection,
  ReceptionSection,
  TimelineSection,
  EntourageSection,
  SponsorsSection,
  AttireSection,
  ExtraInfoSection,
  RsvpCtaSection,
  GiftsSection,
  GuestbookSection,
  LoveStorySection,
  ContactSection,
} from "@/client/sections";

export function ClientEventRenderer({ event }: ClientEventRendererProps) {
  const vm = buildClientViewModel(
    (event.raw.renderModel ?? {}) as Record<string, unknown>
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <AudioProvider>
      <main className="flex min-h-screen w-full flex-col text-cocoa">
        <ScrollProgressBar />
        <HeroSection coupleInfo={vm.coupleInfo} ceremony={vm.ceremony} />
        <CountdownSection countdown={vm.countdown} ceremony={vm.ceremony} />
        <WaveDivider flip className="text-cream bg-[#E8F4F0]" />
        <MusicSection musicEffects={vm.musicEffects} />
        <WaveDivider flip className="text-[#8EC9BB] bg-[#FDECD0]" />
        <GallerySection />
        <WaveDivider className="text-[#FDF6ED] bg-[#EBC485]" />
        <CeremonySection ceremony={vm.ceremony} venue={vm.venue} mounted={mounted} />
        <WaveDivider />
        <VenueSection venue={vm.venue} />
        <WaveDivider flip />
        <ReceptionSection reception={vm.reception} ceremony={vm.ceremony} />
        <WaveDivider />
        <TimelineSection timelineProgram={vm.timelineProgram} />
        <WaveDivider flip />
        <EntourageSection entourage={vm.entourage} />
        <WaveDivider />
        <SponsorsSection principalSponsors={vm.principalSponsors} />
        <WaveDivider flip />
        <AttireSection attireDressCode={vm.attireDressCode} />
        <WaveDivider />
        <ExtraInfoSection extraInfo={vm.extraInfo} />
        <WaveDivider flip className="text-cream bg-coral" />
        <RsvpCtaSection />

        <WaveDivider flip className="text-[#8C4520] bg-ivory" />
        <GiftsSection giftDetails={vm.giftDetails} />
        <WaveDivider />
        <GuestbookSection 
          guestbook={vm.guestbook} 
          guestbookMessages={event.guestbookMessages}
          eventSource={event.source}
        />
        <WaveDivider flip />
        <LoveStorySection loveStory={vm.loveStory} />
        <WaveDivider className="text-cocoa bg-ivory" />
        <ContactSection contactSocials={vm.contactSocials} />
      </main>
      <FloatingMusicBubble />
    </AudioProvider>
  );
}
