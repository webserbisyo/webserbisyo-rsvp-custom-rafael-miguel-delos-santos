import { Section } from "@/components/ui/Section";
import { field, records } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function GuestbookSection({ section, event }: WeddingSectionProps) {
  const sectionMessages = records(section.content.messages).filter((message) => message.isApproved !== false && field(message, ["message"]));
  const messages = event.guestbookMessages.length ? event.guestbookMessages : sectionMessages;

  return (
    <Section eyebrow="Guestbook" title={field(section.content, ["title"]) || "Messages from guests"}>
      <div className="grid gap-5 sm:grid-cols-2">
        {messages.map((message, index) => (
          <blockquote className="rounded-lg border border-cocoa/10 bg-white/70 p-6" key={`${field(message, ["name"])}-${index}`}>
            <p className="text-sm leading-7 text-cocoa/85">&ldquo;{field(message, ["message"])}&rdquo;</p>
            {field(message, ["name"]) ? <footer className="mt-4 text-sm font-semibold text-charcoal">{field(message, ["name"])}</footer> : null}
          </blockquote>
        ))}
      </div>
    </Section>
  );
}
