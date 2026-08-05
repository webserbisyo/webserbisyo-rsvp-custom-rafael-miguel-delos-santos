"use client";

import { PhotoDisplayCard } from "@/client/components/media/PhotoDisplayCard";

type FolderPhotoCardProps = {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: number;
  fit?: "contain" | "cover";
  focalPoint?: {
    x: number;
    y: number;
  };
  loading?: "lazy" | "eager";
};

export function FolderPhotoCard({
  src,
  alt,
  title,
  subtitle,
  aspectRatio,
  fit = "cover",
  focalPoint,
  loading = "eager",
}: FolderPhotoCardProps) {
  return (
    <div className="flex h-full w-full items-center justify-center select-none pointer-events-none">
      <PhotoDisplayCard
        src={src}
        alt={alt}
        title={title}
        subtitle={subtitle}
        aspectRatio={aspectRatio}
        fit={fit}
        focalPoint={focalPoint}
        variant="folder"
        loading={loading}
        className="max-h-full max-w-full"
      />
    </div>
  );
}
