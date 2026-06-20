import type { ClientConfig } from "@/client/client.config";

type ClientFooterProps = {
  config: ClientConfig;
};

export function ClientFooter({ config }: ClientFooterProps) {
  const text = config.footer.text.trim() || "Powered by WebSerbisyo RSVP.";

  return (
    <footer className="border-t border-cocoa/10 bg-ivory/80">
      <div className="mx-auto w-full max-w-5xl px-5 py-6 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cocoa/60">{text}</p>
      </div>
    </footer>
  );
}
