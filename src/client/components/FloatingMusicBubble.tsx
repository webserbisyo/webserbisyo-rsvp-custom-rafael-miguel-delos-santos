"use client";

import React, { useState } from "react";
import { useAudio } from "./audio-context";
import { motion, AnimatePresence } from "framer-motion";
import { Music4, Play, Pause, Square, X } from "@/client/libs/icons";
import { parseMusicMeta } from "@/client/utils/music-meta";

export function FloatingMusicBubble() {
  const { playbackState, musicTitle, isPlaying, play, pause, stop } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  // Do not render anything if music hasn't started yet
  if (playbackState === "idle" || playbackState === "stopped") {
    return null;
  }

  const { displayTitle, displayArtist } = parseMusicMeta(musicTitle);

  return (
    <div className="fixed bottom-6 right-6 z-[99] flex flex-col items-end">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-3 w-72 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E6D5C3]/40 p-4 shadow-soft text-cocoa select-none"
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
                <button
                  onClick={pause}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-coral text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#b24d26] transition shadow-sm active:scale-95"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={play}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-coral text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#b24d26] transition shadow-sm active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </button>
              )}
              <button
                onClick={() => {
                  stop();
                  setIsExpanded(false);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 border border-cocoa/15 text-cocoa/80 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#E6D5C3]/20 transition active:scale-95"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating bubble trigger */}
      <motion.button
        layout
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-coral hover:bg-[#b24d26] text-white flex items-center justify-center shadow-soft relative group cursor-pointer"
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
