import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "var(--color-ivory)",
        cream: "var(--color-cream)",
        cocoa: "var(--color-cocoa)",
        charcoal: "var(--color-charcoal)",
        terracotta: "var(--color-terracotta)",
        coral: "var(--color-coral)",
        linen: "var(--color-linen)",
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        text: "var(--text)",
        muted: "var(--text-muted)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        sage: "var(--sage)",
        "sage-foreground": "var(--sage-foreground)",
        gold: "var(--gold)",
        border: "var(--border)",
        focus: "var(--focus)",
        success: "var(--success)",
        warning: "var(--warning)",
        "warning-foreground": "var(--warning-foreground)",
        error: "var(--error)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "var(--shadow-soft)"
      }
    }
  },
  plugins: []
};

export default config;
