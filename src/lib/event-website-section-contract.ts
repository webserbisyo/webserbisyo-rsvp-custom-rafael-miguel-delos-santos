import contractJson from "../../contracts/event-website-sections.v1.json";

export const EVENT_WEBSITE_SECTION_CONTRACT_VERSION = 1 as const;

export type WeddingSectionKey =
  | "host_info"
  | "countdown"
  | "music_effects"
  | "main_event"
  | "venue"
  | "secondary_event"
  | "timeline_program"
  | "entourage"
  | "principal_sponsors"
  | "attire_motif"
  | "extra_info"
  | "rsvp_form"
  | "gift_details"
  | "guestbook"
  | "story_message"
  | "contact_socials";

export type SectionContractEntry = {
  key: WeddingSectionKey;
  label: string;
  navigationEligible: boolean;
  visibility: "optional" | "required";
};

const canonicalKeys: WeddingSectionKey[] = [
  "host_info",
  "countdown",
  "music_effects",
  "main_event",
  "venue",
  "secondary_event",
  "timeline_program",
  "entourage",
  "principal_sponsors",
  "attire_motif",
  "extra_info",
  "rsvp_form",
  "gift_details",
  "guestbook",
  "story_message",
  "contact_socials",
];

function loadContract() {
  const entries = contractJson.sections as SectionContractEntry[];
  const expected = new Set(canonicalKeys);
  const received = new Set(entries.map((entry) => entry.key));

  if (
    contractJson.contractVersion !== EVENT_WEBSITE_SECTION_CONTRACT_VERSION ||
    entries.length !== canonicalKeys.length ||
    received.size !== entries.length ||
    canonicalKeys.some((key) => !received.has(key)) ||
    entries.some((entry) => !expected.has(entry.key))
  ) {
    throw new Error("The Event Website section contract is invalid.");
  }

  return entries;
}

export const eventWebsiteSectionContract = loadContract();
export const eventWebsiteSectionKeys = canonicalKeys;
export const eventWebsiteSectionKeySet = new Set<string>(canonicalKeys);
export const requiredWeddingSections = eventWebsiteSectionContract
  .filter((entry) => entry.visibility === "required")
  .map((entry) => entry.key);

export function validatePublicEventContract(event: Record<string, unknown>) {
  const version = event.contractVersion;

  if (
    version !== undefined &&
    version !== EVENT_WEBSITE_SECTION_CONTRACT_VERSION
  ) {
    return false;
  }

  const sections = event.sections;
  if (
    !Array.isArray(sections) ||
    !sections.every((key) => typeof key === "string")
  ) {
    return true;
  }

  const unique = new Set(sections);
  return (
    unique.size === sections.length &&
    sections.every((key) => eventWebsiteSectionKeySet.has(key))
  );
}
