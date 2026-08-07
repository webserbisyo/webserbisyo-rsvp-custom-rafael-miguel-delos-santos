import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import { WEDDING_BROWSER_THEME_COLOR } from "@/config/browser-theme";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: WEDDING_BROWSER_THEME_COLOR,
};

export const metadata: Metadata = {
  title: "WebSerbisyo RSVP Event",
  description: "A public event website powered by WebSerbisyo RSVP.",
  icons: {
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "1024x1024", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

import { clientConfig } from "@/client/client.config";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable}`}
      data-wedding-theme={clientConfig.theme.id}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      style={
        {
          "--wedding-browser-surface": WEDDING_BROWSER_THEME_COLOR,
          backgroundColor: WEDDING_BROWSER_THEME_COLOR,
        } as React.CSSProperties
      }
    >
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
