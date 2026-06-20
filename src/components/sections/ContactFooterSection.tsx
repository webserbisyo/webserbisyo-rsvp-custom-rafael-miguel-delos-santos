import { Container } from "@/components/ui/Container";
import { field, records } from "@/components/sections/field-utils";
import type { WeddingSectionProps } from "@/components/sections/section-props";

export function ContactFooterSection({ section }: WeddingSectionProps) {
  const contactName = field(section.content, ["contactName", "name"]);
  const email = field(section.content, ["email"]);
  const phone = field(section.content, ["phone", "mobile"]);
  const socials = records(section.content.socials).filter((social) => field(social, ["label"]) && field(social, ["url"]));

  return (
    <section className="border-t border-cocoa/10 bg-charcoal py-10 text-white">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">Contact</p>
            {contactName ? <p className="mt-3 font-serif text-2xl">{contactName}</p> : null}
            <div className="mt-3 space-y-1 text-sm text-white/75">
              {email ? <p>{email}</p> : null}
              {phone ? <p>{phone}</p> : null}
            </div>
          </div>
          {socials.length ? (
            <div className="flex flex-wrap items-end gap-3 sm:justify-end">
              {socials.map((social) => (
                <a className="min-h-11 rounded-full border border-white/20 px-4 py-3 text-sm hover:border-coral" href={field(social, ["url"])} key={field(social, ["url"])}>
                  {field(social, ["label"])}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
