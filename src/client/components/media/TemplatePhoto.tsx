"use client";

import type { CSSProperties } from "react";

type PhotoFit = "contain" | "cover";

type PhotoVariant =
  | "folder-paper"
  | "gallery-thumb"
  | "gallery-full"
  | "hero"
  | "card";

type TemplatePhotoProps = {
  src: string;
  alt: string;
  fit?: PhotoFit;
  variant?: PhotoVariant;
  focalPoint?: {
    x: number;
    y: number;
  };
  loading?: "lazy" | "eager";
  className?: string;
};

export function TemplatePhoto({
  src,
  alt,
  fit = "contain",
  variant = "card",
  focalPoint,
  loading = "lazy",
  className = "",
}: TemplatePhotoProps) {
  const objectFitClass = fit === "contain" ? "object-contain" : "object-cover";

  // Calculate object-position style if focalPoint is provided (useful for cover mode)
  const style: CSSProperties = {};
  if (fit === "cover" && focalPoint) {
    style.objectPosition = `${focalPoint.x}% ${focalPoint.y}%`;
  }

  // Base sizing and quality constraints based on variants if needed in the future
  let variantClasses = "";
  if (variant === "folder-paper") {
    variantClasses = "w-full h-full";
  } else if (variant === "gallery-thumb") {
    variantClasses = "w-full h-full";
  } else if (variant === "gallery-full") {
    variantClasses = "max-w-full max-h-full";
  } else if (variant === "hero") {
    variantClasses = "w-full h-full";
  } else if (variant === "card") {
    variantClasses = "w-full h-full";
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={`${objectFitClass} ${variantClasses} ${className}`}
      style={style}
    />
  );
}
