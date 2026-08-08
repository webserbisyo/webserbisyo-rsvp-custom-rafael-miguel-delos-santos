"use client";

import React from "react";
import { clientConfig, PRINCESS_ANNE_COMPONENT_FLORAL_DECORATIONS } from "@/client/client.config";

export type DecorationFamily = "card-edge" | "frame-corner";
export type DecorationOrientation = "left" | "right";
export type DecorationPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "bottom-edge-left"
  | "bottom-edge-right";

export type DecorationSize = "small" | "medium" | "large";
export type DecorationTone = "light" | "warm" | "olive" | "dark";

export type DecorationPlacementMode = "inside" | "edge-overlap";

export interface WeddingDecorationProps {
  family: DecorationFamily;
  orientation: DecorationOrientation;
  position: DecorationPosition;
  size?: DecorationSize;
  tone?: DecorationTone;
  placementMode?: DecorationPlacementMode;
  className?: string;
}

export function WeddingDecoration({
  family,
  orientation,
  position,
  size = "medium",
  tone = "light",
  placementMode = "edge-overlap",
  className = "",
}: WeddingDecorationProps) {
  const decorationsConfig =
    clientConfig.componentFlorals || PRINCESS_ANNE_COMPONENT_FLORAL_DECORATIONS;

  if (!decorationsConfig) return null;

  const familyGroup =
    family === "frame-corner"
      ? decorationsConfig.frameCorner
      : decorationsConfig.cardEdge;

  const assetSpec = familyGroup?.[orientation];

  if (!assetSpec?.src) return null;

  const familyClass = `wedding-decoration--family-${family}`;
  const positionClass = `wedding-decoration--pos-${position}`;
  const sizeClass = `wedding-decoration--size-${size}`;
  const toneClass = `wedding-decoration--tone-${tone}`;
  const modeClass = `wedding-decoration--mode-${placementMode}`;

  return (
    <img
      src={assetSpec.src}
      alt=""
      aria-hidden="true"
      width={assetSpec.width}
      height={assetSpec.height}
      loading="lazy"
      decoding="async"
      className={`wedding-decoration ${familyClass} ${positionClass} ${sizeClass} ${toneClass} ${modeClass} ${className}`.trim()}
    />
  );
}
