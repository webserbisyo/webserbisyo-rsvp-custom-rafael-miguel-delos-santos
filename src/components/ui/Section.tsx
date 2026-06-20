import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ eyebrow, title, children, className = "" }: SectionProps) {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <Container>
        {(eyebrow || title) && (
          <div className="mb-7 max-w-2xl">
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">{eyebrow}</p> : null}
            {title ? <h2 className="mt-3 font-serif text-3xl text-charcoal sm:text-4xl">{title}</h2> : null}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
