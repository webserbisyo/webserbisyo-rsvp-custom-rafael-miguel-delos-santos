"use client";

import { TemplatePhoto } from "@/client/components/media/TemplatePhoto";

type PhotoFit = "contain" | "cover";

type PhotoDisplayCardProps = {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: number;
  fit?: PhotoFit;
  variant?: "folder" | "gallery" | "hero" | "card";
  loading?: "lazy" | "eager";
  className?: string;
};

export function PhotoDisplayCard({
  src,
  alt,
  title,
  subtitle,
  aspectRatio,
  fit = "contain",
  loading = "lazy",
  className = "",
}: PhotoDisplayCardProps) {
  // Clamp extreme aspect ratios to prevent portrait/landscape replacements from breaking layout fanning
  // Min aspect ratio: 0.75 (3:4 portrait)
  // Max aspect ratio: 1.8 (16:9 landscape)
  const safeAspectRatio = Math.min(1.8, Math.max(0.75, aspectRatio ?? 4 / 3));

  return (
    <div className={`flex max-h-full max-w-full flex-col rounded border border-white bg-white p-1 shadow-[0_4px_12px_rgba(63,45,35,0.08)] select-none pointer-events-none transition-shadow duration-300 ${className}`}>
      {/* Inner Image Frame matching the image's safe aspect ratio */}
      <div
        className="relative w-full overflow-hidden rounded-sm bg-transparent"
        style={{ aspectRatio: safeAspectRatio }}
      >
        <TemplatePhoto
          src={src}
          alt={alt}
          fit={fit}
          variant="folder-paper"
          loading={loading}
          className="h-full w-full rounded-sm"
        />
      </div>

      {/* Caption block sits below the aspect ratio box, naturally adjusting card height */}
      {(title || subtitle) && (
        <div className="px-1 pb-0.5 pt-1 text-center truncate">
          {title && (
            <p className="font-serif italic text-cocoa text-[10px] sm:text-[9px] leading-tight truncate">
              {title}
            </p>
          )}
          {subtitle && (
            <p className="mt-0.5 text-[6px] sm:text-[6px] leading-none tracking-widest uppercase text-driftwood truncate">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
