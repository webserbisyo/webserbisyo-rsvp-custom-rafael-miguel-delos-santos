import type { ClientConfig } from "@/client/client.config";

type ClientFooterProps = {
  config: ClientConfig;
};

/**
 * ClientFooter
 *
 * Visually continues the Contact section's dark closing surface.
 * Background and border are driven by CSS theme variables, not
 * hardcoded Tailwind utility colors.
 */
export function ClientFooter({ config }: ClientFooterProps) {
  const text = config.footer.text.trim() || "Powered by WebSerbisyo RSVP.";

  return (
    <footer
      style={{
        borderTopColor: "var(--wedding-divider)",
        background: "var(--wedding-surface-dark)",
      }}
      className="border-t"
    >
      <div className="mx-auto w-full max-w-5xl px-5 py-6 text-center sm:px-8">
        <p
          style={{ color: "var(--wedding-text-on-dark)" }}
          className="text-xs font-semibold uppercase tracking-[0.18em] opacity-50"
        >
          {text}
        </p>
      </div>
    </footer>
  );
}
