"use client";

/**
 * MusicSection
 *
 * Vinyl disc music player with SpotlightCard, play/pause/stop controls,
 * and animated visual states.
 * Extracted from ClientEventRenderer.tsx lines 182–316.
 *
 * All classNames, vinyl animation, SpotlightCard usage, and button
 * animations are identical to the original.
 */

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/client/components/audio-context";
import { SpotlightCard } from "@/client/components/SpotlightCard";
import { parseMusicMeta } from "@/client/utils/music-meta";
import { Play, Pause, Square, Music4 } from "@/client/libs/icons";
import type { ClientMusicData } from "@/client/types/client-view-model";

type MusicSectionProps = {
  musicEffects: ClientMusicData;
};

export function MusicSection({ musicEffects }: MusicSectionProps) {
  const { playbackState, isPlaying, play, pause, stop, setMusicData } = useAudio();

  // Register track details with audio context
  useEffect(() => {
    if (musicEffects?.musicLink) {
      setMusicData(musicEffects.musicLink, musicEffects.musicTitle || "", musicEffects.shortNote || "");
    }
  }, [musicEffects, setMusicData]);

  if (!musicEffects?.musicLink) return null;

  const { displayTitle, displayArtist } = parseMusicMeta(musicEffects.musicTitle);

  return (
    <section
      id="music"
      className="py-20 md:py-28 px-4 bg-gradient-to-b from-[#E8F4F0] via-[#C5E5DC] to-[#8EC9BB] text-cocoa text-center relative overflow-hidden"
    >
      <div className="max-w-md mx-auto relative z-10">
        <SpotlightCard 
          className="p-8 md:p-12 shadow-soft border border-[#5c4638]/10 text-center bg-[#4a3528]/95 text-cream relative"
          spotlightColor="rgba(232, 201, 122, 0.20)"
        >
          {/* Eyebrow */}
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-sand/80 mb-6">
            OUR WEDDING SONG
          </p>

          {/* Disc Graphic */}
          <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
            {/* Pulsating outer light ring */}
            {isPlaying && (
              <div className="absolute inset-0 rounded-full border border-cream/20 scale-110 animate-ping pointer-events-none" />
            )}

            {/* Spinning vinyl disk */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-full h-full rounded-full bg-gradient-to-br from-[#1c1410] via-[#2d211a] to-[#1c1410] border-2 border-cream/20 shadow-xl flex items-center justify-center relative group"
            >
              {/* Record grooves */}
              <div className="absolute inset-2 rounded-full border border-cream/5 pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-cream/5 pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-cream/5 pointer-events-none" />

              {/* Center Label */}
              <div className="w-10 h-10 rounded-full bg-[#f9efe3] flex items-center justify-center text-cocoa shadow-inner">
                <Music4 className="w-4 h-4" />
              </div>
            </motion.div>
          </div>

          {/* Metadata */}
          <h3 className="font-serif text-3xl font-medium mb-1 truncate text-[#f9efe3]">
            {displayTitle}
          </h3>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-coral mb-6">
            {displayArtist}
          </p>

          {/* Short Note */}
          <p className="text-sm italic text-cream/70 max-w-xs mx-auto mb-8 font-serif leading-relaxed">
            &ldquo;{musicEffects.shortNote || "A song that reminds us of our journey together."}&rdquo;
          </p>

          {/* Controls */}
          <div className="flex justify-center gap-3 items-center">
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.button
                  key="pause-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={pause}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-[#f9efe3] text-cocoa rounded-full text-xs font-bold uppercase tracking-wider hover:bg-sand transition active:scale-95 shadow-md cursor-pointer shrink-0"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </motion.button>
              ) : (
                <motion.button
                  key="play-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={play}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-[#f9efe3] text-cocoa rounded-full text-xs font-bold uppercase tracking-wider hover:bg-sand transition active:scale-95 shadow-md cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Song</span>
                </motion.button>
              )}
            </AnimatePresence>

            {(playbackState === "playing" || playbackState === "paused") && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={stop}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-cream/30 text-cream rounded-full text-xs font-bold uppercase tracking-wider hover:bg-cream/10 transition active:scale-95 cursor-pointer shrink-0"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </motion.button>
            )}
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
