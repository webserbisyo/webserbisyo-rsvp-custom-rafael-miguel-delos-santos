"use client";

import { Fragment, useEffect, useState } from "react";
import type { ClientEventRendererProps } from "@/client/renderer/client-renderer-types";
import { buildClientViewModel } from "@/client/types/build-client-view-model";
import {
  getVisibleClientSectionKeys,
  type ClientSectionKey,
} from "@/client/client-section-registry";
import { WaveDivider, ScrollProgressBar } from "@/client/components";
import { AudioProvider } from "@/client/components/audio-context";
import { FloatingControlsLayer } from "@/client/components/FloatingControlsLayer";
import { CountdownToMusicDivider } from "@/client/components/CountdownToMusicDivider";
import { CenterBouquetDivider } from "@/client/components/CenterBouquetDivider";
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
            {index > 0
              ? renderSectionTransition(visibleSectionKeys[index - 1]!, key)
              : null}
            {renderSection(key)}
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
          <HeroSection coupleInfo={vm.coupleInfo} ceremony={vm.ceremony} />
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

function renderSectionTransition(
  previous: ClientSectionKey,
  next: ClientSectionKey,
) {
  if (previous === "countdown" && next === "music_effects") {
    return <CountdownToMusicDivider />;
  }

  if (previous === "venue") {
    return (
      <>
        <CenterBouquetDivider />
        <WaveDivider flip className="text-cream bg-ivory" />
      </>
    );
  }

  if (previous === "music_effects") {
    return <WaveDivider flip className="text-[#8EC9BB] bg-[#FDECD0]" />;
  }

  if (previous === "gallery") {
    return <WaveDivider className="text-[#FDF6ED] bg-[#EBC485]" />;
  }

  if (previous === "main_event") {
    return <WaveDivider className="text-cream bg-ivory" />;
  }

  if (previous === "extra_info") {
    return <WaveDivider flip className="text-cream bg-coral" />;
  }

  if (previous === "rsvp_form") {
    return <WaveDivider flip className="text-[#8C4520] bg-ivory" />;
  }

  if (previous === "story_message") {
    return <WaveDivider className="text-cocoa bg-ivory" />;
  }

  return <WaveDivider flip={next === "entourage" || next === "attire_motif"} />;
}
