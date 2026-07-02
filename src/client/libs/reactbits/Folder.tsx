"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder: React.FC<FolderProps> = ({
  color = "#5227FF",
  size = 1,
  items = [],
  className = "",
  open: controlledOpen,
  onOpenChange,
}) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : localOpen;
  
  const setOpen = (val: boolean) => {
    if (!isControlled) {
      setLocalOpen(val);
    }
    onOpenChange?.(val);
  };

  const [activePaperIndex, setActivePaperIndex] = useState<number | null>(null);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = "#ffffff";
  const paper2 = "#fafafa";
  const paper3 = "#ffffff";

  const handleClick = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      setActivePaperIndex(2);
    } else {
      // Delay resetting the active paper index until the closing animation (500ms) completes
      // to prevent sudden z-index popping of clicked photos.
      setTimeout(() => {
        setActivePaperIndex(null);
      }, 500);
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    if (!open) return;
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const folderStyle: React.CSSProperties = {
    "--folder-color": color,
    "--folder-back-color": folderBackColor,
    "--paper-1": paper1,
    "--paper-2": paper2,
    "--paper-3": paper3,
  } as React.CSSProperties;

  const scaleStyle = { transform: `scale(${size})` };

  return (
    <div style={scaleStyle} className={className}>
      <style dangerouslySetInnerHTML={{ __html: `
        .folder-front-label {
          position: absolute;
          left: 50%;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          user-select: none;
          pointer-events: none;
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
          transform-origin: center center;
          gap: 0.25rem;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .folder-front-label.is-closed {
          top: 58%;
          transform: translate(-50%, -50%);
          opacity: 1;
        }
        
        .folder-front-label.is-open {
          top: 58%;
          transform: translate(-50%, -50%) translateY(14px) perspective(700px) rotateX(14deg) scaleY(0.68);
          opacity: 0.75;
        }
        
        /* Default closed paper styling and transitions */
        .folder-paper {
          transform: translate(-50%, 10%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), scale 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Cover default styling */
        .folder-cover-left, .folder-cover-right {
          transform: none;
        }
        
        /* Cover open styling */
        .folder-container.is-open .folder-cover-left {
          transform: skew(15deg) scaleY(0.6);
        }
        .folder-container.is-open .folder-cover-right {
          transform: skew(-15deg) scaleY(0.6);
        }
        
        /* Desktop-only hover effects */
        @media (hover: hover) and (pointer: fine) {
          .folder-container.is-closed:hover {
            transform: translateY(-8px) !important;
          }
          
          .folder-container.is-closed:hover .folder-front-label.is-closed {
            top: 58%;
            transform: translate(-50%, -50%) translateY(10px) perspective(700px) rotateX(12deg) scaleY(0.72);
            opacity: 0.9;
          }
          
          .folder-container.is-closed:hover .folder-cover-left {
            transform: skew(15deg) scaleY(0.6);
          }
          .folder-container.is-closed:hover .folder-cover-right {
            transform: skew(-15deg) scaleY(0.6);
          }
          
          .folder-container.is-closed:hover .folder-paper {
            transform: translate(-50%, 0%);
          }
          
          .folder-container.is-open .folder-paper:hover {
            scale: 1.05;
          }
        }
        
        /* Responsive Open Transforms via CSS Variables */
        .folder-paper-0 {
          --paper-open-transform: translate(-132%, -80%) rotate(-12deg) scale(1.15);
        }
        .folder-paper-1 {
          --paper-open-transform: translate(47%, -80%) rotate(12deg) scale(1.15);
        }
        .folder-paper-2 {
          --paper-open-transform: translate(-50%, -110%) rotate(4deg) scale(1.2);
        }

        @media (max-width: 639px) {
          .folder-paper-0 {
            /* Translate -420% = -137px × 4.2 ≈ 575px up; at 1.5× scale cards are ~205px tall,
               so 575px / (205 × folderScale) leaves clear gaps between cards */
            --paper-open-transform: translate(-50%, -420%) rotate(-3deg) scale(1.5);
          }
          .folder-paper-1 {
            --paper-open-transform: translate(-50%, -280%) rotate(3deg) scale(1.5);
          }
          .folder-paper-2 {
            --paper-open-transform: translate(-50%, -140%) rotate(-1deg) scale(1.5);
          }
        }
      `}} />
      <div
        className={`folder-container relative transition-transform duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
          open ? "is-open" : "is-closed"
        }`}
        style={{
          ...folderStyle,
          transform: open ? "translateY(-8px)" : undefined,
        }}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={open ? "Close folder" : "Open folder"}
      >
        <div
          className="relative w-[180px] h-[144px] rounded-tl-none rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="absolute z-0 bottom-[calc(100%-1px)] left-0 w-[54px] h-[19px] rounded-tl-[5px] rounded-tr-[5px]"
            style={{ backgroundColor: folderBackColor }}
          ></span>
          {papers.map((item, i) => {
            let sizeClasses = "";
            if (i === 0) sizeClasses = open ? "w-[100%] h-[95%]" : "w-[70%] h-[80%]";
            if (i === 1) sizeClasses = open ? "w-[100%] h-[95%]" : "w-[80%] h-[70%]";
            if (i === 2) sizeClasses = open ? "w-[100%] h-[95%]" : "w-[90%] h-[60%]";
            const transformStyle = open
              ? `var(--paper-open-transform) translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
              : undefined;
            return (
              <div
                key={i}
                onMouseMove={(e) => handlePaperMouseMove(e, i)}
                onMouseLeave={(e) => handlePaperMouseLeave(e, i)}
                onClick={(e) => {
                  if (open) {
                    e.stopPropagation();
                    setActivePaperIndex(i);
                  }
                }}
                className={`absolute bottom-[10%] left-1/2 folder-paper folder-paper-${i} ${sizeClasses} flex items-center justify-center`}
                style={{
                  ...(!open ? {} : { transform: transformStyle }),
                  backgroundColor: open ? "transparent" : (i === 0 ? paper1 : i === 1 ? paper2 : paper3),
                  borderRadius: "10px",
                  zIndex: open ? (activePaperIndex === i ? 30 : (i === 0 ? 23 : i === 1 ? 24 : 25)) : 20,
                  backfaceVisibility: "hidden",
                }}
              >
                {item}
              </div>
            );
          })}
          <div
            className="absolute z-40 w-full h-full origin-bottom transition-transform duration-300 ease-out transform-gpu will-change-transform folder-cover-left"
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              backfaceVisibility: "hidden",
            }}
          ></div>
          <div
            className="absolute z-40 w-full h-full origin-bottom transition-transform duration-300 ease-out transform-gpu will-change-transform folder-cover-right"
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              backfaceVisibility: "hidden",
            }}
          ></div>

          {/* Centered Heart Icon and Open/Close Text */}
          <div className={`folder-front-label ${open ? "is-open" : "is-closed"}`}>
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-white/20 text-white" aria-hidden="true" />
            <span className="text-sm sm:text-base font-bold tracking-[0.14em]">
              {open ? "CLOSE" : "OPEN"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folder;
