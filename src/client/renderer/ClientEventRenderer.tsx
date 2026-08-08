"use client";

import { Fragment, useEffect, useState } from "react";
import type { ClientEventRendererProps } from "@/client/renderer/client-renderer-types";
import { buildClientViewModel } from "@/client/types/build-client-view-model";
import {
  clientSectionRegistry,
  getVisibleClientSectionKeys,
  type ClientSectionKey,
  type SectionSurface,
} from "@/client/client-section-registry";
import { ScrollProgressBar } from "@/client/components";
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

import { SectionFloralPatternContext } from "@/client/components/SectionFloralPatternContext";

export function ClientEventRenderer({ event }: ClientEventRendererProps) {
  const vm = buildClientViewModel(
    (event.raw.renderModel ?? {}) as Record<string, unknown>,
  );
  const visibleSectionKeys = getVisibleClientSectionKeys(event);
  const visibleSectionKeySet = new Set(visibleSectionKeys);
  const [mounted, setMounted] = useState(false);

  const eligibleVisibleKeys = visibleSectionKeys.filter(
    (key) => key !== "host_info",
  );

  useEffect(() => {
    // The ceremony calendar decoration depends on browser-only layout measurements.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <AudioProvider>
      <main className="flex min-h-screen w-full flex-col text-cocoa">
        <ScrollProgressBar />
        {visibleSectionKeys.map((key) => {
          if (key === "host_info") {
            return <Fragment key={key}>{renderSection(key)}</Fragment>;
          }
          const eligibleIndex = eligibleVisibleKeys.indexOf(key);
          const variant =
            eligibleIndex % 2 === 0 ? "dense-allover" : "open-framed";
          return (
            <SectionFloralPatternContext key={key} variant={variant}>
              {renderSection(key)}
            </SectionFloralPatternContext>
          );
        })}
      </main>
      <FloatingControlsLayer visibleSectionKeys={visibleSectionKeys} />
    </AudioProvider>
  );

  function renderSection(key: ClientSectionKey) {
    // Read the canonical surface role from the registry — the single source of truth.
    const surface: SectionSurface = clientSectionRegistry[key].surface;

    switch (key) {
      case "host_info":
        return (
          <HeroSection
            coupleInfo={vm.coupleInfo}
            storyVisible={visibleSectionKeySet.has("story_message")}
            surface={surface}
          />
        );
      case "countdown":
        return (
          <CountdownSection
            countdown={vm.countdown}
            ceremony={vm.ceremony}
            surface={surface}
          />
        );
      case "music_effects":
        return (
          <MusicSection musicEffects={vm.musicEffects} surface={surface} />
        );
      case "gallery":
        return <GallerySection surface={surface} />;
      case "main_event":
        return (
          <CeremonySection
            ceremony={vm.ceremony}
            venue={vm.venue}
            mounted={mounted}
            surface={surface}
          />
        );
      case "venue":
        return <VenueSection venue={vm.venue} surface={surface} />;
      case "secondary_event":
        return (
          <ReceptionSection
            reception={vm.reception}
            ceremony={vm.ceremony}
            surface={surface}
          />
        );
      case "timeline_program":
        return (
          <TimelineSection
            timelineProgram={vm.timelineProgram}
            surface={surface}
          />
        );
      case "entourage":
        return <EntourageSection entourage={vm.entourage} surface={surface} />;
      case "principal_sponsors":
        return (
          <SponsorsSection
            principalSponsors={vm.principalSponsors}
            surface={surface}
          />
        );
      case "attire_motif":
        return (
          <AttireSection
            attireDressCode={vm.attireDressCode}
            surface={surface}
          />
        );
      case "extra_info":
        return <ExtraInfoSection extraInfo={vm.extraInfo} surface={surface} />;
      case "rsvp_form":
        return <RsvpCtaSection surface={surface} />;
      case "gift_details":
        return <GiftsSection giftDetails={vm.giftDetails} surface={surface} />;
      case "guestbook":
        return (
          <GuestbookSection
            guestbook={vm.guestbook}
            guestbookMessages={event.guestbookMessages}
            eventSource={event.source}
            surface={surface}
          />
        );
      case "story_message":
        return <LoveStorySection loveStory={vm.loveStory} surface={surface} />;
      case "contact_socials":
        return (
          <ContactSection
            contactSocials={vm.contactSocials}
            branding={vm.branding}
            surface={surface}
          />
        );
    }
  }
}
