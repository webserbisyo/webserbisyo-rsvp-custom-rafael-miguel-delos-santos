import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { loadPublicEvent } from "@/app/public-event-loader";
import { templateBranding } from "@/config/template-branding";

function getHeroDataBase64(imagePath: string): string | null {
  try {
    const cleanPath = imagePath.replace(/^\//, "");
    const fullPath = path.join(process.cwd(), "public", cleanPath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const buffer = fs.readFileSync(fullPath);
    const base64 = buffer.toString("base64");
    const ext = path.extname(cleanPath).toLowerCase().replace(".", "");
    const mimeType = ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg";
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
}

export async function generateSocialPreviewImage(): Promise<ImageResponse> {
  const eventResult = await loadPublicEvent();

  let displayName = "Rafael & Isabella";
  let dateLabel: string | null = null;
  let venueName: string | null = null;

  if (eventResult.status === "available" && eventResult.event) {
    const event = eventResult.event;
    displayName =
      event.coupleDisplayName?.trim() ||
      event.title?.trim() ||
      "Rafael & Isabella";
    dateLabel = event.eventDateLabel || event.eventDate || null;

    const venueSection = event.sections.find(
      (s) => s.key === "venue" || s.key === "main_event" || s.key === "ceremony",
    );
    if (venueSection?.content) {
      const vContent = venueSection.content as Record<string, unknown>;
      const rawVenue =
        typeof vContent.venueName === "string"
          ? vContent.venueName
          : typeof vContent.name === "string"
            ? vContent.name
            : typeof vContent.locationName === "string"
              ? vContent.locationName
              : typeof vContent.placeName === "string"
                ? vContent.placeName
                : null;
      if (rawVenue && rawVenue.trim()) {
        venueName = rawVenue.trim();
      }
    }
  }

  const heroDataUrl = getHeroDataBase64(templateBranding.hero.imagePath);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          position: "relative",
          backgroundColor: "#1c140e",
          overflow: "hidden",
          fontFamily: "serif",
        }}
      >
        {/* Background Image if available */}
        {heroDataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroDataUrl}
            alt="Hero background"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
              objectPosition: templateBranding.hero.socialPosition || "center 30%",
            }}
          />
        ) : null}

        {/* Multi-layered cinematic gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(20, 14, 10, 0.45) 0%, rgba(20, 14, 10, 0.70) 55%, rgba(15, 10, 7, 0.92) 100%)",
          }}
        />

        {/* Decorative inner border */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            display: "flex",
            border: "1px solid rgba(247, 210, 196, 0.28)",
            borderRadius: "6px",
            pointerEvents: "none",
          }}
        />

        {/* Main Content Card Container */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "54px 60px",
            textAlign: "center",
          }}
        >
          {/* Top Kicker / Brand Header with diamond icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            {/* Inline SVG diamond icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e89874"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 22 12 12 22 2 12" />
            </svg>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "0.26em",
                color: "#f7d2c4",
                textTransform: "uppercase",
                fontFamily: "sans-serif",
              }}
            >
              WEDDING CELEBRATION
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e89874"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 22 12 12 22 2 12" />
            </svg>
          </div>

          {/* Couple Display Name */}
          <div
            style={{
              display: "flex",
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#fffaf5",
              letterSpacing: "0.01em",
              marginBottom: "20px",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              maxWidth: "1050px",
            }}
          >
            {displayName}
          </div>

          {/* Metadata Badges (Date & Venue) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginTop: "4px",
              marginBottom: "20px",
            }}
          >
            {dateLabel ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  border: "1px solid rgba(247, 210, 196, 0.35)",
                  borderRadius: "9999px",
                  color: "#fffaf5",
                  fontSize: "17px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  fontFamily: "sans-serif",
                }}
              >
                {/* Calendar SVG */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f7d2c4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{dateLabel}</span>
              </div>
            ) : null}

            {venueName ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  border: "1px solid rgba(247, 210, 196, 0.35)",
                  borderRadius: "9999px",
                  color: "#fffaf5",
                  fontSize: "17px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  fontFamily: "sans-serif",
                }}
              >
                {/* Map pin SVG */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f7d2c4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{venueName}</span>
              </div>
            ) : null}
          </div>

          {/* Bottom Branding Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "rgba(255, 245, 238, 0.8)",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
            }}
          >
            <span>{templateBranding.social.brandLabel}</span>
            <span>•</span>
            <span>ONLINE RSVP & EVENT DETAILS</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
