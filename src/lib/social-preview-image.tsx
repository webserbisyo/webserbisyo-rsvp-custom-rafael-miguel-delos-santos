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

  let displayName = "Wedding Invitation";
  let dateLabel: string | null = null;

  if (eventResult.status === "available" && eventResult.event) {
    const event = eventResult.event;
    displayName =
      event.coupleDisplayName?.trim() ||
      event.title?.trim() ||
      "Wedding Invitation";
    dateLabel = event.eventDateLabel || event.eventDate || null;
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
          backgroundColor: "#1a120c",
          overflow: "hidden",
        }}
      >
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
              objectPosition: templateBranding.hero.socialPosition,
            }}
          />
        ) : null}

        {/* Dark overlay for contrast */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            display: "flex",
            backgroundColor: "rgba(20, 15, 12, 0.45)",
          }}
        />

        {/* Content Container */}
        <div
          style={{
            position: "absolute",
            bottom: "44px",
            left: "0px",
            right: "0px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            paddingLeft: "48px",
            paddingRight: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "52px",
              fontWeight: 600,
              color: "#fff9f5",
              marginBottom: "8px",
            }}
          >
            {displayName}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: "#f7d2c4",
              marginBottom: "6px",
            }}
          >
            {dateLabel ? `${dateLabel.toUpperCase()} • WEDDING INVITATION` : "WEDDING INVITATION"}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            {templateBranding.social.brandLabel.toUpperCase()}
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
