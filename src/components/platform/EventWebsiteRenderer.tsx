"use client";

/* eslint-disable @next/next/no-img-element -- Public media hosts are controlled by the platform API; broad next/image remotePatterns are intentionally avoided in the starter. */
import { useEffect, useMemo, useState } from "react";
import {
  PlatformCalendarIcon,
  PlatformGiftIcon,
  PlatformMailIcon,
  PlatformMapPinIcon,
  PlatformMessageIcon,
  PlatformMusicIcon,
  PlatformPhoneIcon,
  PlatformPlayIcon,
  PlatformUsersIcon
} from "@/components/platform/platform-icons";
import { RSVP_FORM_ID, RSVP_SECTION_ID } from "@/lib/rsvp-url";
import type {
  PlatformGuestbookMessage,
  PlatformRenderModel,
  PlatformSectionKey
} from "@/lib/platform-render-model";

const RSVP_GUEST_NAME_LABEL = "Guest Name";
const RSVP_EMAIL_LABEL = "Email Address";
const RSVP_PHONE_LABEL = "Phone Number";
const RSVP_ATTENDANCE_LABEL = "Attendance";
const RSVP_GUEST_COUNT_LABEL = "Guest Count";
const RSVP_MESSAGE_LABEL = "Message to Host";
const RSVP_MESSAGE_HELPER = "Optional note, greeting, or guestbook message.";
const RSVP_MESSAGE_PRIVACY_COPY = "Private by default. The host may show approved messages in the Guestbook.";

type EventWebsiteRendererProps = {
  draft: PlatformRenderModel;
  guestbookMessages?: PlatformGuestbookMessage[];
  hideEmptyGuestbook?: boolean;
  sections: PlatformSectionKey[];
};

const supportedSectionKeySet = new Set<PlatformSectionKey>([
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
  "contact_socials"
]);

export function EventWebsiteRenderer({
  draft,
  guestbookMessages = [],
  hideEmptyGuestbook = false,
  sections
}: EventWebsiteRendererProps) {
  const visibleSections = sections.filter(
    (sectionKey) =>
      supportedSectionKeySet.has(sectionKey) &&
      !(sectionKey === "guestbook" && hideEmptyGuestbook && guestbookMessages.length === 0)
  );

  return (
    <>
      {visibleSections.map((sectionKey, index) => (
        <SectionRouter
          key={sectionKey}
          draft={draft}
          guestbookMessages={guestbookMessages}
          sectionKey={sectionKey}
          showDivider={index > 0}
        />
      ))}
    </>
  );
}

function SectionRouter({
  draft,
  guestbookMessages,
  sectionKey,
  showDivider
}: {
  draft: PlatformRenderModel;
  guestbookMessages: PlatformGuestbookMessage[];
  sectionKey: PlatformSectionKey;
  showDivider: boolean;
}) {
  return (
    <>
      {showDivider ? <MajorDivider /> : null}
      <div className="event-preview-section-anchor" data-preview-section={sectionKey} id={sectionKey === "rsvp_form" ? RSVP_SECTION_ID : undefined}>
        {sectionKey === "host_info" ? <CoupleInfoSection draft={draft} /> : null}
        {sectionKey === "countdown" ? <CountdownSection draft={draft} /> : null}
        {sectionKey === "music_effects" ? <MusicSection draft={draft} /> : null}
        {sectionKey === "main_event" ? <CeremonySection draft={draft} /> : null}
        {sectionKey === "venue" ? <VenueSection draft={draft} /> : null}
        {sectionKey === "secondary_event" ? <ReceptionSection draft={draft} /> : null}
        {sectionKey === "timeline_program" ? <TimelineSection draft={draft} /> : null}
        {sectionKey === "entourage" ? <EntourageSection draft={draft} /> : null}
        {sectionKey === "principal_sponsors" ? <PrincipalSponsorsSection draft={draft} /> : null}
        {sectionKey === "attire_motif" ? <AttireSection draft={draft} /> : null}
        {sectionKey === "extra_info" ? <ExtraInfoSection draft={draft} /> : null}
        {sectionKey === "rsvp_form" ? <RsvpFormSection draft={draft} /> : null}
        {sectionKey === "gift_details" ? <GiftDetailsSection draft={draft} /> : null}
        {sectionKey === "guestbook" ? (
          <GuestbookSection draft={draft} guestbookMessages={guestbookMessages} />
        ) : null}
        {sectionKey === "story_message" ? <LoveStorySection draft={draft} /> : null}
        {sectionKey === "contact_socials" ? <ContactSocialsSection draft={draft} /> : null}
      </div>
    </>
  );
}

function CoupleInfoSection({ draft }: { draft: PlatformRenderModel }) {
  const coupleInfo = draft.coupleInfo;
  const displayAs = coupleInfo.displayAs.trim() || "WebSerbisyo RSVP Event";
  const hostLine = coupleInfo.hostLine.trim();
  const message = coupleInfo.shortHostMessage.trim();

  return (
    <section className="event-preview-section event-preview-section--hero">
      <SectionLabel>Couple Info</SectionLabel>
      {hostLine ? <p className="event-preview-host-line">{hostLine}</p> : null}
      <h2>{displayAs}</h2>
      {message ? <p className="event-preview-copy">{message}</p> : null}
      <InternalDivider />
      <div className="event-preview-couple-grid">
        <span>
          <strong>Groom</strong>
          {coupleInfo.groomName || "To be announced"}
        </span>
        <span>
          <strong>Bride</strong>
          {coupleInfo.brideName || "To be announced"}
        </span>
      </div>
    </section>
  );
}

function CountdownSection({ draft }: { draft: PlatformRenderModel }) {
  const title = draft.countdown.title.trim() || "Counting down to the celebration";
  const shortNote = draft.countdown.shortNote.trim();
  const [now, setNow] = useState(0);
  const countdownItems = useMemo(
    () =>
      now === 0
        ? createZeroCountdownItems()
        : buildCountdownItems(draft.ceremony.eventDate, draft.ceremony.eventTime, now),
    [draft.ceremony.eventDate, draft.ceremony.eventTime, now]
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="event-preview-section">
      <SectionLabel>Countdown</SectionLabel>
      <h3>{title}</h3>
      {shortNote ? <p className="event-preview-copy">{shortNote}</p> : null}
      <div className="event-preview-countdown-grid">
        {countdownItems.map((item) => (
          <div key={item.label} className="event-preview-countdown-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MusicSection({ draft }: { draft: PlatformRenderModel }) {
  const values = draft.musicEffects;
  const title = values.musicTitle.trim() || "Wedding ambience";
  const buttonLabel = values.playButtonLabel.trim() || "Play";
  const note = values.shortNote.trim();
  const musicLink = values.musicLink.trim();

  return (
    <section className="event-preview-section event-preview-section--compact">
      <SectionLabel>Music</SectionLabel>
      <div className="event-preview-music-card">
        <div className="event-preview-music-icon" aria-hidden="true">
          <PlatformMusicIcon className="size-4" />
        </div>
        <div className="event-preview-music-copy">
          <h4>{title}</h4>
          {note ? <p>{note}</p> : null}
        </div>
        {musicLink ? (
          <a className="event-preview-button event-preview-music-button" href={musicLink} target="_blank" rel="noreferrer">
            <PlatformPlayIcon className="size-3.5" />
            {buttonLabel}
          </a>
        ) : (
          <button className="event-preview-button event-preview-music-button" type="button" disabled>
            <PlatformPlayIcon className="size-3.5" />
            {buttonLabel}
          </button>
        )}
      </div>
    </section>
  );
}

function CeremonySection({ draft }: { draft: PlatformRenderModel }) {
  const ceremony = draft.ceremony;
  const date = formatDisplayDate(ceremony.eventDate);
  const startTime = formatDisplayTime(ceremony.eventTime);
  const endTime = formatDisplayTime(ceremony.endTime);
  const scheduleNote = ceremony.scheduleNote.trim();
  const rsvpDeadline = formatDisplayDateTime(ceremony.rsvpDeadline) || ceremony.rsvpDeadline.trim();

  return (
    <section className="event-preview-section">
      <SectionLabel>Ceremony</SectionLabel>
      <h3>{ceremony.eventLabel.trim() || "Wedding Ceremony"}</h3>
      <dl className="event-preview-detail-list">
        <div>
          <dt>Date</dt>
          <dd>{date || "Date to be announced"}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{[startTime, endTime].filter(Boolean).join(" - ") || "Time to be announced"}</dd>
        </div>
      </dl>
      {scheduleNote ? <p className="event-preview-copy">{scheduleNote}</p> : null}
      {rsvpDeadline ? (
        <>
          <InternalDivider />
          <p className="event-preview-deadline">Kindly RSVP by {rsvpDeadline}.</p>
        </>
      ) : null}
    </section>
  );
}

function VenueSection({ draft }: { draft: PlatformRenderModel }) {
  const venue = draft.venue;
  const mapsLink = venue.mapsLink.trim();
  const arrivalNote = venue.arrivalNote.trim();

  return (
    <section className="event-preview-section">
      <SectionLabel>Venue</SectionLabel>
      <h3>{venue.venueName.trim() || "Venue"}</h3>
      {venue.address.trim() ? (
        <p className="event-preview-address-copy">
          <PlatformMapPinIcon className="size-4" />
          <span className="event-preview-address-text">{venue.address}</span>
        </p>
      ) : null}
      {mapsLink ? (
        <a className="event-preview-button event-preview-map-button" href={mapsLink} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      ) : null}
      {arrivalNote ? (
        <>
          <InternalDivider />
          <p className="event-preview-copy">{arrivalNote}</p>
        </>
      ) : null}
    </section>
  );
}

function ReceptionSection({ draft }: { draft: PlatformRenderModel }) {
  const values = draft.reception;
  const startTime = formatDisplayTime(values.startTime);
  const endTime = formatDisplayTime(values.endTime);
  const note = values.note.trim();
  const venueName = values.venueName.trim();
  const address = values.address.trim();
  const mapsLink = values.mapsLink.trim();
  const hasLocation = Boolean(venueName || address);

  return (
    <section className="event-preview-section">
      <SectionLabel>Reception</SectionLabel>
      <h3>{values.title.trim() || "Reception"}</h3>
      {[startTime, endTime].some(Boolean) ? (
        <div className="event-preview-inline-card">
          <PlatformCalendarIcon className="size-4" />
          <span>{[startTime, endTime].filter(Boolean).join(" - ")}</span>
        </div>
      ) : null}
      {note ? <p className="event-preview-copy">{note}</p> : null}
      {hasLocation ? (
        <div className="event-preview-location-card">
          {venueName ? <strong>{venueName}</strong> : null}
          {address ? <span>{address}</span> : null}
          {mapsLink ? (
            <a className="event-preview-button event-preview-map-button" href={mapsLink} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function TimelineSection({ draft }: { draft: PlatformRenderModel }) {
  const items = draft.timelineProgram.items.filter((item) => item.time || item.title || item.description);

  return (
    <section className="event-preview-section">
      <SectionLabel>Timeline / Program</SectionLabel>
      <h3>Wedding Day Timeline</h3>
      <p className="event-preview-copy">Here is the flow of the day so guests know what to expect.</p>
      <div className="event-preview-timeline-list">
        {items.map((item, index) => (
          <div key={item.id || `timeline-${index + 1}`} className="event-preview-timeline-item">
            <div className="event-preview-timeline-rail" aria-hidden="true" />
            <div className="event-preview-timeline-card">
              {item.time ? <span className="event-preview-timeline-time">{formatDisplayTime(item.time) || item.time}</span> : null}
              <strong>{item.title || "Program Item"}</strong>
              {item.description ? <p>{item.description}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EntourageSection({ draft }: { draft: PlatformRenderModel }) {
  const intro = draft.entourage.introLine.trim();
  const groups = draft.entourage.groups.filter((group) => group.groupTitle || group.names);

  return (
    <section className="event-preview-section">
      <SectionLabel>Entourage</SectionLabel>
      <h3>Wedding Entourage</h3>
      {intro ? <p className="event-preview-copy">{intro}</p> : null}
      <div className="event-preview-party-grid">
        {groups.map((group, index) => (
          <div key={group.id || `entourage-${index + 1}`} className="event-preview-party-card">
            <strong>{group.groupTitle}</strong>
            {group.names ? <p>{group.names}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function PrincipalSponsorsSection({ draft }: { draft: PlatformRenderModel }) {
  const intro = draft.principalSponsors.introLine.trim();
  const names = normalizeLineList(draft.principalSponsors.names);

  return (
    <section className="event-preview-section">
      <SectionLabel>Principal Sponsors</SectionLabel>
      <h3>Principal Sponsors</h3>
      {intro ? <p className="event-preview-copy">{intro}</p> : null}
      <div className="event-preview-sponsor-list">
        {names.map((name, index) => (
          <span key={`${name}-${index}`}>{name}</span>
        ))}
      </div>
    </section>
  );
}

function AttireSection({ draft }: { draft: PlatformRenderModel }) {
  const values = draft.attireDressCode;
  const intro = values.sectionIntro.trim();
  const cards = [
    { body: values.dressCodeNote.trim(), title: "Dress Code" },
    { body: values.colorMotifNote.trim(), title: "Color / Motif" }
  ].filter((card) => card.body);

  return (
    <section className="event-preview-section">
      <SectionLabel>Attire / Dress Code</SectionLabel>
      <h3>Attire / Dress Code</h3>
      {intro ? <p className="event-preview-copy">{intro}</p> : null}
      <div className="event-preview-guidance-grid">
        {cards.map((card) => (
          <div key={card.title} className="event-preview-guidance-card">
            <strong>{card.title}</strong>
            <p>{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExtraInfoSection({ draft }: { draft: PlatformRenderModel }) {
  const values = draft.extraInfo;
  const intro = values.sectionIntro.trim();
  const items = values.items.filter((item) => item.title || item.details);

  return (
    <section className="event-preview-section">
      <SectionLabel>Extra Info</SectionLabel>
      <h3>{values.sectionTitle.trim() || "Extra Info"}</h3>
      {intro ? <p className="event-preview-copy">{intro}</p> : null}
      <div className="event-preview-note-grid">
        {items.map((item, index) => (
          <div key={item.id || `extra-info-${index + 1}`} className="event-preview-note-card">
            <strong>{item.title}</strong>
            {item.details ? <p>{item.details}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function RsvpFormSection({ draft }: { draft: PlatformRenderModel }) {
  const values = draft.rsvpForm;
  const [previewCompanionCount, setPreviewCompanionCount] = useState(0);
  const title = values.title.trim() || "Confirm Your Attendance";
  const body =
    values.body.trim() ||
    "Please confirm your attendance so we can prepare your seat and celebration details.";
  const maxCompanions = Math.max(1, Number(values.companionLimit) || 1);
  const companionOptions = Array.from({ length: maxCompanions + 1 }, (_, i) => i);
  const shouldShowCompanions = values.plusOneEnabled;
  const shouldShowEmail = values.emailEnabled;
  const shouldShowPhone = values.phoneEnabled;
  const shouldShowMessage = values.messageToHostEnabled;

  return (
    <section className="event-preview-section">
      <SectionLabel>RSVP</SectionLabel>
      <h3>{title}</h3>
      <p className="event-preview-copy">{body}</p>
      <div className="event-preview-rsvp-public-shell" id={RSVP_FORM_ID}>
        <form className="event-preview-rsvp-card" aria-describedby="starter-rsvp-note">
          <label className="event-preview-field">
            <span>{RSVP_GUEST_NAME_LABEL}</span>
            <input type="text" placeholder="Your full name" />
          </label>

          {shouldShowEmail ? (
            <label className="event-preview-field">
              <span>{RSVP_EMAIL_LABEL}</span>
              <input type="email" placeholder="you@example.com" required={values.emailRequired} />
            </label>
          ) : null}

          {shouldShowPhone ? (
            <label className="event-preview-field">
              <span>{RSVP_PHONE_LABEL}</span>
              <input type="tel" placeholder="09XXXXXXXXX" required={values.phoneRequired} />
            </label>
          ) : null}

          <div className="event-preview-field">
            <span>{RSVP_ATTENDANCE_LABEL}</span>
            <div className="event-preview-choice-group" aria-label={RSVP_ATTENDANCE_LABEL}>
              <button type="button" className="is-selected">
                Yes, I will attend
              </button>
              <button type="button">Sorry, I can&apos;t attend</button>
            </div>
          </div>

          {shouldShowCompanions ? (
            <div className="event-preview-field">
              <span>{RSVP_GUEST_COUNT_LABEL}</span>
              <p className="event-preview-rsvp-helper-copy">
                Choose how many companions you will bring. You may bring up to {maxCompanions}.
              </p>
              {maxCompanions >= 4 ? (
                <div className="event-preview-select-shell">
                  <select value={previewCompanionCount} onChange={(event) => setPreviewCompanionCount(Number(event.target.value))}>
                    {companionOptions.map((count) => (
                      <option key={count} value={count}>
                        {count === 0 ? "Just me" : `Me + ${count}`}
                      </option>
                    ))}
                  </select>
                  <span className="event-preview-select-chevron" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </span>
                </div>
              ) : (
                <div className="event-preview-choice-group" aria-label="Guest count">
                  {companionOptions.map((count) => (
                    <button
                      key={count}
                      type="button"
                      className={count === previewCompanionCount ? "is-selected" : ""}
                      onClick={() => setPreviewCompanionCount(count)}
                    >
                      {count === 0 ? "Just me" : `Me + ${count}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {shouldShowCompanions &&
          (values.companionNameEnabled || values.companionAgeEnabled) &&
          previewCompanionCount > 0 ? (
            <div className="event-preview-field">
              <span>Companion Details</span>
              <div className="event-preview-companion-stack">
                {Array.from({ length: previewCompanionCount }).map((_, index) => (
                  <div key={index} className="event-preview-companion-card">
                    <span className="event-preview-companion-title">Companion {index + 1}</span>
                    {values.companionNameEnabled ? <input type="text" placeholder="Full Name" className="event-preview-companion-input" /> : null}
                    {values.companionAgeEnabled ? <input type="text" placeholder="Age" className="event-preview-companion-input" /> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {values.foodAllergiesEnabled ? (
            <label className="event-preview-field">
              <span>Food Allergies / Dietary Restrictions</span>
              <textarea placeholder="List any allergies or dietary restrictions for you or your companions." />
            </label>
          ) : null}

          {shouldShowMessage ? (
            <label className="event-preview-field">
              <span>{RSVP_MESSAGE_LABEL}</span>
              <p className="event-preview-rsvp-helper-copy">{RSVP_MESSAGE_HELPER}</p>
              <textarea placeholder="Leave a short message." />
              <p className="event-preview-rsvp-helper-copy">{RSVP_MESSAGE_PRIVACY_COPY}</p>
            </label>
          ) : null}

          <button type="button" className="event-preview-button event-preview-submit-button" disabled>
            Submit RSVP
          </button>
          <p className="event-preview-rsvp-helper-copy" id="starter-rsvp-note">
            {values.note.trim() || "Submission stays platform-owned. Connect this form only through an approved public RSVP contract."}
          </p>
        </form>
      </div>
    </section>
  );
}

function GiftDetailsSection({ draft }: { draft: PlatformRenderModel }) {
  const values = draft.giftDetails;
  const intro = values.sectionIntro.trim();
  const note = values.giftNote.trim();
  const options = values.options.filter((option) => option.title || option.description || option.imageUrl);

  return (
    <section className="event-preview-section">
      <SectionLabel>Gift Details</SectionLabel>
      <h3>Gift Details</h3>
      {intro ? <p className="event-preview-copy">{intro}</p> : null}
      {note ? <p className="event-preview-copy">{note}</p> : null}
      <div className="event-preview-gift-grid">
        {options.map((option, index) => (
          <div key={option.id || `gift-option-${index + 1}`} className="event-preview-gift-card">
            <GiftPreviewMedia option={option} />
            <strong>{option.title}</strong>
            {option.description ? <p>{option.description}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function GuestbookSection({
  draft,
  guestbookMessages
}: {
  draft: PlatformRenderModel;
  guestbookMessages: PlatformGuestbookMessage[];
}) {
  const title = draft.guestbook.sectionTitle.trim() || "A Note from Our Guests";
  const intro = draft.guestbook.sectionIntro.trim();
  const emptyState = draft.guestbook.emptyStateMessage.trim() || "Approved guest messages will appear here soon.";

  return (
    <section className="event-preview-section event-preview-section--guestbook">
      <SectionLabel>Guestbook</SectionLabel>
      <h3>{title}</h3>
      {intro ? <p className="event-preview-copy">{intro}</p> : null}
      {guestbookMessages.length > 0 ? (
        <div className="event-preview-guestbook-stack">
          {guestbookMessages.map((message) => (
            <GuestbookMessageCard key={message.id} message={message} />
          ))}
        </div>
      ) : (
        <div className="event-preview-message-card event-preview-message-card--empty">
          <p>{emptyState}</p>
        </div>
      )}
    </section>
  );
}

function GuestbookMessageCard({ message }: { message: PlatformGuestbookMessage }) {
  const isExpandable = message.message.length > 180 || /\n.{0,}\n/.test(message.message);
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedDate = message.submittedAt ?? message.approvedAt;

  return (
    <article className="event-preview-message-card">
      <div className="event-preview-message-card-inner">
        <span className="event-preview-message-icon" aria-hidden="true">
          <PlatformMessageIcon className="size-4" />
        </span>
        <div className="event-preview-message-body">
          <strong>{message.guestName}</strong>
          <p className={`event-preview-message-text${isExpandable ? " is-expandable" : ""}${isExpanded ? " is-expanded" : ""}`}>
            {message.message}
          </p>
          {isExpandable ? (
            <button
              type="button"
              className="event-preview-message-toggle"
              onClick={() => setIsExpanded((current) => !current)}
            >
              {isExpanded ? "Show less" : "View more"}
            </button>
          ) : null}
          {displayedDate ? <p className="event-preview-message-date">{formatGuestbookDate(displayedDate)}</p> : null}
        </div>
      </div>
    </article>
  );
}

function LoveStorySection({ draft }: { draft: PlatformRenderModel }) {
  const intro = draft.loveStory.sectionIntro.trim();
  const title = draft.loveStory.storyTitle.trim() || "Our Story";
  const body = draft.loveStory.storyBody.trim();

  return (
    <section className="event-preview-section">
      <SectionLabel>Love Story</SectionLabel>
      <h3>Love Story</h3>
      {intro ? <p className="event-preview-copy">{intro}</p> : null}
      <div className="event-preview-story-card">
        <strong>{title}</strong>
        {body ? <p>{body}</p> : null}
      </div>
    </section>
  );
}

function ContactSocialsSection({ draft }: { draft: PlatformRenderModel }) {
  const values = draft.contactSocials;
  const contactPerson = values.contactPerson.trim();
  const contactNumber = values.contactNumber.trim();
  const email = values.email.trim();
  const socialLinks = [
    { label: "Facebook", value: values.facebookUrl.trim() },
    { label: "Instagram", value: values.instagramUrl.trim() },
    { label: "TikTok", value: values.tikTokUrl.trim() }
  ].filter((item) => item.value);
  const brandLine = draft.coupleInfo.displayAs.trim() || "WebSerbisyo RSVP Event";

  return (
    <footer className="event-preview-section event-preview-section--footer">
      <SectionLabel>Contact & Socials</SectionLabel>
      <h3>Need help?</h3>
      <p className="event-preview-copy">
        Reach out if you need help with directions, RSVP details, or event updates.
      </p>
      <div className="event-preview-footer-card">
        {contactPerson ? (
          <span className="event-preview-footer-line">
            <PlatformUsersIcon className="size-4" />
            <span className="event-preview-footer-text">{contactPerson}</span>
          </span>
        ) : null}
        {contactNumber ? (
          <span className="event-preview-footer-line">
            <PlatformPhoneIcon className="size-4" />
            <span className="event-preview-footer-text">{contactNumber}</span>
          </span>
        ) : null}
        {email ? (
          <span className="event-preview-footer-line">
            <PlatformMailIcon className="size-4" />
            <span className="event-preview-footer-text">{email}</span>
          </span>
        ) : null}
      </div>
      {socialLinks.length > 0 ? (
        <div className="event-preview-social-row">
          {socialLinks.map((item) => (
            <a key={item.label} className="event-preview-button event-preview-social-button" href={item.value} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      ) : null}
      <p className="event-preview-footer-brand">{brandLine} - WEBserbisyo RSVP</p>
    </footer>
  );
}

function GiftPreviewMedia({ option }: { option: { imageAlt: string; imageUrl: string; title: string } }) {
  if (!option.imageUrl) {
    return (
      <div className="event-preview-gift-placeholder" aria-hidden="true">
        <PlatformGiftIcon className="size-5" />
      </div>
    );
  }

  return (
    <div className="event-preview-gift-image">
      <img
        src={option.imageUrl}
        alt={option.imageAlt || `${option.title || "Gift option"} image`}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <span className="event-preview-section-label">{children}</span>;
}

function MajorDivider() {
  return (
    <div className="event-preview-major-divider" aria-hidden="true">
      <span className="event-preview-major-divider-line" />
      <span className="event-preview-major-divider-marker" />
      <span className="event-preview-major-divider-line" />
    </div>
  );
}

function InternalDivider() {
  return <div className="event-preview-internal-divider" aria-hidden="true" />;
}

function buildCountdownItems(eventDate: string, eventTime: string, now: number) {
  const targetTime = parseCountdownTarget(eventDate, eventTime);

  if (targetTime === null) {
    return createZeroCountdownItems();
  }

  const remainingMs = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "Days", value: formatCountdownValue(days) },
    { label: "Hours", value: formatCountdownValue(hours) },
    { label: "Minutes", value: formatCountdownValue(minutes) },
    { label: "Seconds", value: formatCountdownValue(seconds) }
  ];
}

function createZeroCountdownItems() {
  return [
    { label: "Days", value: "00" },
    { label: "Hours", value: "00" },
    { label: "Minutes", value: "00" },
    { label: "Seconds", value: "00" }
  ];
}

function parseCountdownTarget(eventDate: string, eventTime: string) {
  const normalizedDate = eventDate.trim();
  const normalizedTime = eventTime.trim();

  if (!normalizedDate) {
    return null;
  }

  const parsedDate = normalizedDate.includes("T")
    ? new Date(normalizedDate)
    : new Date(`${normalizedDate}${normalizedTime ? `T${normalizedTime}` : ""}`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.getTime();
}

function formatCountdownValue(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDisplayDate(value: string) {
  const date = parseDate(value);
  if (!date) return value.trim();

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "long",
    timeZone: "Asia/Manila"
  }).format(date);
}

function formatDisplayTime(value: string) {
  const date = parseDate(value);
  if (!date) return value.trim();

  return new Intl.DateTimeFormat("en-PH", {
    timeStyle: "short",
    timeZone: "Asia/Manila"
  }).format(date);
}

function formatDisplayDateTime(value: string) {
  const date = parseDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila"
  }).format(date);
}

function formatGuestbookDate(value: string | null) {
  const date = parseDate(value ?? "");
  if (!date) return "";

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeZone: "Asia/Manila"
  }).format(date);
}

function parseDate(value: string) {
  const normalized = value.trim();
  if (!normalized) return null;

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeLineList(value: string): string[] {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
