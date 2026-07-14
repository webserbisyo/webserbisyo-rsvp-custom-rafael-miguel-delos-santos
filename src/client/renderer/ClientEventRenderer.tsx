"use client";

import { Fragment, useEffect, useState } from "react";
import type { ClientEventRendererProps } from "@/client/renderer/client-renderer-types";
import { buildClientViewModel } from "@/client/types/build-client-view-model";
import {
  getVisibleClientSectionKeys,
  type ClientSectionKey,
} from "@/client/client-section-registry";
import { ScrollProgressBar, SectionTransition } from "@/client/components";
import { AudioProvider } from "@/client/components/audio-context";
import { FloatingControlsLayer } from "@/client/components/FloatingControlsLayer";
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
    (event.raw.renderModel ?? {}) as Record<string, unknown>,
  );
  const visibleSectionKeys = getVisibleClientSectionKeys(event);
  const visibleSectionKeySet = new Set(visibleSectionKeys);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The ceremony calendar decoration depends on browser-only layout measurements.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <AudioProvider>
      <main className="flex min-h-screen w-full flex-col text-cocoa">
        <ScrollProgressBar />
        {visibleSectionKeys.map((key, index) => (
          <Fragment key={key}>
            {renderSection(key)}
            {visibleSectionKeys[index + 1] ? (
              <SectionTransition from={key} to={visibleSectionKeys[index + 1]!} />
            ) : null}
          </Fragment>
        ))}
      </main>
      <FloatingControlsLayer visibleSectionKeys={visibleSectionKeys} />
    </AudioProvider>
  );

  function renderSection(key: ClientSectionKey) {
    switch (key) {
      case "host_info":
        return (
          <HeroSection
            coupleInfo={vm.coupleInfo}
            storyVisible={visibleSectionKeySet.has("story_message")}
          />
        );
      case "countdown":
        return (
          <CountdownSection countdown={vm.countdown} ceremony={vm.ceremony} />
        );
      case "music_effects":
        return <MusicSection musicEffects={vm.musicEffects} />;
      case "gallery":
        return <GallerySection />;
      case "main_event":
        return (
          <CeremonySection
            ceremony={vm.ceremony}
            venue={vm.venue}
            mounted={mounted}
          />
        );
      case "venue":
        return <VenueSection venue={vm.venue} />;
      case "secondary_event":
        return (
          <ReceptionSection reception={vm.reception} ceremony={vm.ceremony} />
        );
      case "timeline_program":
        return <TimelineSection timelineProgram={vm.timelineProgram} />;
      case "entourage":
        return <EntourageSection entourage={vm.entourage} />;
      case "principal_sponsors":
        return <SponsorsSection principalSponsors={vm.principalSponsors} />;
      case "attire_motif":
        return <AttireSection attireDressCode={vm.attireDressCode} />;
      case "extra_info":
        return <ExtraInfoSection extraInfo={vm.extraInfo} />;
      case "rsvp_form":
        return <RsvpCtaSection />;
      case "gift_details":
        return <GiftsSection giftDetails={vm.giftDetails} />;
      case "guestbook":
        return (
          <GuestbookSection
            guestbook={vm.guestbook}
            guestbookMessages={event.guestbookMessages}
            eventSource={event.source}
          />
        );
      case "story_message":
        return <LoveStorySection loveStory={vm.loveStory} />;
      case "contact_socials":
        return <ContactSection contactSocials={vm.contactSocials} />;
    }
  }
}
