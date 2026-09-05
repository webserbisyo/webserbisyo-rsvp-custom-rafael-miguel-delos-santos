import { ImageResponse } from "next/og";
import { loadPublicEvent } from "@/app/public-event-loader";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateSocialPreviewImage(): Promise<ImageResponse> {
  const result = await loadPublicEvent();
  const event = result.status === "available" ? result.event : undefined;

  const rawCouple = event?.raw?.sectionsByKey?.host_info as Record<string, unknown> | undefined;
  const partner1 =
    typeof rawCouple?.groomName === "string"
      ? rawCouple.groomName
      : typeof rawCouple?.partner1Name === "string"
        ? rawCouple.partner1Name
        : "";
  const partner2 =
    typeof rawCouple?.brideName === "string"
      ? rawCouple.brideName
      : typeof rawCouple?.partner2Name === "string"
        ? rawCouple.partner2Name
        : "";

  const couple =
    event?.coupleDisplayName ||
    (partner1 && partner2 ? `${partner1} & ${partner2}` : "") ||
    event?.title ||
    "Rafael & Isabella";

  const venueSection = event?.sections?.find(
    (s) => s.key === "venue" || s.key === "main_event" || s.key === "ceremony",
  );
  const vContent = venueSection?.content as Record<string, unknown> | undefined;
  const rawVenue =
    typeof vContent?.venueName === "string"
      ? vContent.venueName
      : typeof vContent?.name === "string"
        ? vContent.name
        : typeof (event?.raw?.venue as Record<string, unknown> | undefined)?.venueName === "string"
          ? ((event?.raw?.venue as Record<string, unknown>).venueName as string)
          : null;

  const date = event?.eventDateLabel || event?.eventDate || "Saturday Celebration";
  const venue = rawVenue?.trim() || "Beachfront Pavilion";
  const initial = couple.trim().charAt(0).toUpperCase() || "R";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#1c140e",
          backgroundImage: "radial-gradient(circle at 100% 0%, #2b1f17 0%, #1c140e 75%)",
          padding: "48px",
          fontFamily: "serif",
          position: "relative",
          border: "16px solid #1c140e",
        }}
      >
        {/* Dual Hairline Accent Border Frame */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            bottom: "20px",
            border: "2px solid #c96b48",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            border: "1px solid rgba(247, 210, 196, 0.25)",
            display: "flex",
          }}
        />

        {/* Left Column: Monogram Wax Seal */}
        <div
          style={{
            width: "360px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              backgroundColor: "#271b13",
              border: "4px solid #c96b48",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            <span style={{ fontSize: "96px", color: "#f7d2c4", fontWeight: 700, lineHeight: 1 }}>
              {initial}
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#c96b48",
                letterSpacing: "4px",
                marginTop: "4px",
                fontFamily: "sans-serif",
                fontWeight: 700,
              }}
            >
              WEDDING
            </span>
          </div>
        </div>

        {/* Right Column: Editorial Wedding Heading */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "32px",
          }}
        >
          {/* Eyebrow Label */}
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "6px",
              color: "#f7d2c4",
              textTransform: "uppercase",
              marginBottom: "16px",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            The Wedding Celebration Of
          </span>

          {/* Couple Display Name */}
          <h1
            style={{
              fontSize: "58px",
              color: "#fffaf5",
              lineHeight: 1.1,
              margin: "0 0 16px 0",
              fontWeight: "normal",
            }}
          >
            {couple}
          </h1>

          {/* Subtitle */}
          <span
            style={{
              fontSize: "18px",
              letterSpacing: "4px",
              color: "#c96b48",
              textTransform: "uppercase",
              marginBottom: "28px",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            Official Invitation & Guest Guide
          </span>

          {/* Date & Venue Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              borderTop: "1px solid rgba(201, 107, 72, 0.4)",
              paddingTop: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px", color: "#fffaf5" }}>📅 {date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px", color: "#e0d0c1" }}>📍 {venue}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
