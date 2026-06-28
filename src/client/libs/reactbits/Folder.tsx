"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
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

const Folder: React.FC<FolderProps> = ({ color = "#5227FF", size = 1, items = [], className = "" }) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [activePaperIndex, setActivePaperIndex] = useState<number | null>(null);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor("#ffffff", 0.1);
  const paper2 = darkenColor("#ffffff", 0.05);
  const paper3 = "#ffffff";

  const handleClick = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      setActivePaperIndex(2);
    } else {
      setActivePaperIndex(null);
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    if (!open) return;
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

  const getOpenTransform = (index: number) => {
    if (index === 0) return "translate(-175%, -90%) rotate(-12deg) scale(1.3)";
    if (index === 1) return "translate(75%, -90%) rotate(12deg) scale(1.3)";
    if (index === 2) return "translate(-50%, -120%) rotate(4deg) scale(1.4)";
    return "";
  };

  return (
    <div style={scaleStyle} className={className}>
      <style dangerouslySetInnerHTML={{ __html: `
        .folder-front-label {
          position: absolute;
          left: 50%;
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          user-select: none;
          pointer-events: none;
          transition: all 0.3s ease-out;
          transform-origin: center bottom;
          gap: 0.25rem;
        }
        
        @media (min-width: 640px) {
          .folder-front-label {
            gap: 0.375rem;
          }
        }
        
        .folder-front-label.is-closed {
          top: 58%;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        
        .group:hover .folder-front-label.is-closed {
          top: 62%;
          transform: translate(-50%, -50%) scaleY(0.72) scale(0.96);
          opacity: 0.9;
        }
        
        .folder-front-label.is-open {
          top: 62%;
          transform: translate(-50%, -50%) perspective(700px) rotateX(8deg) scaleY(0.78) scale(0.96);
          opacity: 0.75;
        }
      `}} />
      <div
        className={`group relative transition-all duration-300 ease-in cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${!open ? "hover:-translate-y-2" : ""
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
          className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0"
            style={{ backgroundColor: folderBackColor }}
          ></span>
          {papers.map((item, i) => {
            let sizeClasses = "";
            if (i === 0) sizeClasses = open ? "w-[85%] h-[95%]" : "w-[70%] h-[80%]";
            if (i === 1) sizeClasses = open ? "w-[85%] h-[95%]" : "w-[80%] h-[70%]";
            if (i === 2) sizeClasses = open ? "w-[100%] h-[95%]" : "w-[90%] h-[60%]";
            const transformStyle = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
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
                className={`absolute bottom-[10%] left-1/2 transition-all duration-500 ease-out ${!open ? "transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0" : "hover:scale-110"
                  } ${sizeClasses}`}
                style={{
                  ...(!open ? {} : { transform: transformStyle }),
                  backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
                  borderRadius: "10px",
                  zIndex: open ? (activePaperIndex === i ? 50 : 20) : 20,
                }}
              >
                {item}
              </div>
            );
          })}
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-out ${!open ? "group-hover:[transform:skew(15deg)_scaleY(0.6)]" : ""
              }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && { transform: "skew(15deg) scaleY(0.6)" }),
            }}
          ></div>
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-out ${!open ? "group-hover:[transform:skew(-15deg)_scaleY(0.6)]" : ""
              }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && { transform: "skew(-15deg) scaleY(0.6)" }),
            }}
          ></div>

          {/* Centered Heart Icon and Open/Close Text */}
          <div className={`folder-front-label ${open ? "is-open" : "is-closed"}`}>
            <Heart className="h-7 w-7 sm:h-8 sm:w-8 fill-white/20 text-white" aria-hidden="true" />
            <span className="text-base sm:text-lg font-bold tracking-[0.16em]">
              {open ? "CLOSE" : "OPEN"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folder;
