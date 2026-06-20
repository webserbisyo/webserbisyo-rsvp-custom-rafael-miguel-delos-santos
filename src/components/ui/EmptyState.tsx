import { Container } from "@/components/ui/Container";

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <main className="min-h-screen bg-ivory py-20 text-cocoa">
      <Container>
        <div className="mx-auto max-w-xl rounded-lg border border-cocoa/10 bg-white/70 p-8 text-center shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">WebSerbisyo RSVP</p>
          <h1 className="mt-4 font-serif text-3xl text-charcoal">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-cocoa/80">{message}</p>
        </div>
      </Container>
    </main>
  );
}
