import { generateSocialPreviewImage } from "@/lib/social-preview-image";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Wedding Celebration Invitation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return generateSocialPreviewImage();
}
