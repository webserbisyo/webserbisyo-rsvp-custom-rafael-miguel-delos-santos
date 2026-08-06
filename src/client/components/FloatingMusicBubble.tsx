"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "./audio-context";
import { motion, AnimatePresence } from "framer-motion";
import { Music4, Play, Pause, Square, X } from "@/client/libs/icons";
import { parseMusicMeta } from "@/client/utils/music-meta";
import { WeddingButton } from "@/client/components/ui/WeddingButton";

type FloatingMusicBubbleProps = {
  layout?: "fixed" | "inline";
};

export function FloatingMusicBubble({ layout = "fixed" }: FloatingMusicBubbleProps) {
  const { playbackState, musicTitle, isPlaying, play, pause, stop } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMusicSectionVisible, setIsMusicSectionVisible] = useState(false);

  // Recede floating bubble when main #music section is in viewport
  useEffect(() => {
    const musicSec = document.querySelector("#music");
    if (!musicSec) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsMusicSectionVisible(entry.isIntersecting && entry.intersectionRatio >= 0.3);
      },
      { threshold: [0, 0.3, 0.6] }
    );

    observer.observe(musicSec);
    return () => observer.disconnect();
  }, []);

  // Do not render anything if music hasn't started yet
  if (playbackState === "idle" || playbackState === "stopped") {
    return null;
  }

  const { displayTitle, displayArtist } = parseMusicMeta(musicTitle);
  const isInline = layout === "inline";

  return (
    <div
      className={
        isInline
          ? "relative z-10 flex shrink-0 flex-col items-end"
          : `fixed bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] right-4 z-50 flex flex-col items-end sm:right-6 transition-opacity duration-300 ${
              isMusicSectionVisible ? "opacity-0 pointer-events-none" : "opacity-100"
            }`
      }
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={
              isInline
                ? "absolute bottom-full right-0 mb-3 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white/85 backdrop-blur-md border border-[#E6D5C3]/40 p-4 shadow-soft text-cocoa select-none"
                : "mb-3 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white/80 backdrop-blur-md border border-[#E6D5C3]/40 p-4 shadow-soft text-cocoa select-none"
            }
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3 items-center min-w-0">
                {/* Spinning vinyl disc indicator */}
                <div
                  className={`w-9 h-9 rounded-full bg-cocoa flex items-center justify-center text-cream shrink-0 ${
                    isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "6s" }}
                >
                  <Music4 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm font-semibold truncate leading-tight text-cocoa">
                    {displayTitle}
                  </h4>
                  <p className="text-[10px] text-coral uppercase tracking-widest truncate">
                    {displayArtist}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-cocoa/40 hover:text-cocoa p-1 rounded-full hover:bg-[#E6D5C3]/20 transition"
                aria-label="Minimize player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-[#E6D5C3]/30 to-transparent mb-3" />

            <div className="flex gap-2 justify-center">
              {isPlaying ? (
                <WeddingButton
                  variant="primary"
                  size="sm"
                  onClick={pause}
                  type="button"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </WeddingButton>
              ) : (
                <WeddingButton
                  variant="primary"
                  size="sm"
                  onClick={play}
                  type="button"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </WeddingButton>
              )}
              <WeddingButton
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => {
                  stop();
                  setIsExpanded(false);
                }}
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </WeddingButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating bubble trigger */}
      <motion.button
        type="button"
        layout
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-[color:var(--wedding-control-primary-bg)] text-[color:var(--wedding-control-primary-fg)] shadow-[0_8px_24px_rgb(216_183_111_/_35%)] hover:brightness-105 flex items-center justify-center relative group cursor-pointer transition-all duration-300"
        aria-label="Wedding song controls"
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing-music"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Pulsating border rings when playing */}
              <div className="absolute inset-0 -m-1.5 rounded-full border border-coral opacity-50 animate-ping pointer-events-none" />
              <Music4 className="w-6 h-6 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="paused-music"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Music4 className="w-6 h-6 opacity-75" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export default FloatingMusicBubble;
