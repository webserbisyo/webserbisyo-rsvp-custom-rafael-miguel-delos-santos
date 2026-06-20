import { AttireMotifSection } from "@/components/sections/AttireMotifSection";
import { CeremonySection } from "@/components/sections/CeremonySection";
import { ContactFooterSection } from "@/components/sections/ContactFooterSection";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { CoupleInfoSection } from "@/components/sections/CoupleInfoSection";
import { EntourageSection } from "@/components/sections/EntourageSection";
import { ExtraInfoSection } from "@/components/sections/ExtraInfoSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { GiftDetailsSection } from "@/components/sections/GiftDetailsSection";
import { GuestbookSection } from "@/components/sections/GuestbookSection";
import { LoveStorySection } from "@/components/sections/LoveStorySection";
import { MusicEffectsSection } from "@/components/sections/MusicEffectsSection";
import { PrincipalSponsorsSection } from "@/components/sections/PrincipalSponsorsSection";
import { ReceptionSection } from "@/components/sections/ReceptionSection";
import { RsvpCallToActionSection } from "@/components/sections/RsvpCallToActionSection";
import { TimelineProgramSection } from "@/components/sections/TimelineProgramSection";
import { VenueSection } from "@/components/sections/VenueSection";

export const weddingSectionRegistry = {
  host_info: CoupleInfoSection,
  countdown: CountdownSection,
  music_effects: MusicEffectsSection,
  main_event: CeremonySection,
  venue: VenueSection,
  secondary_event: ReceptionSection,
  timeline_program: TimelineProgramSection,
  entourage: EntourageSection,
  principal_sponsors: PrincipalSponsorsSection,
  attire_motif: AttireMotifSection,
  extra_info: ExtraInfoSection,
  gallery: GallerySection,
  rsvp_form: RsvpCallToActionSection,
  gift_details: GiftDetailsSection,
  guestbook: GuestbookSection,
  story_message: LoveStorySection,
  contact_socials: ContactFooterSection
} as const;
