"use client";

/**
 * MusicSection
 *
 * Clean SpotlightCard container vinyl disc music player without WEBP collage assets.
 * Play/pause/stop controls, spinning vinyl disc, and centered card layout.
 * Integrated with centralized surface role architecture.
 */

import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAudio } from "@/client/components/audio-context";
import { SpotlightCard } from "@/client/components/SpotlightCard";
import { parseMusicMeta } from "@/client/utils/music-meta";
import { Play, Pause, Square, Music4 } from "@/client/libs/icons";
import type { ClientMusicData } from "@/client/types/client-view-model";
import type { SectionSurface } from "@/client/client-section-registry";
import { weddingButtonVariants } from "@/client/components/ui/WeddingButton";

type MusicSectionProps = {
  musicEffects: ClientMusicData;
  surface: SectionSurface;
};

export function MusicSection({ musicEffects, surface }: MusicSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { playbackState, isPlaying, play, pause, stop, setMusicData } =
    useAudio();

  // Register track details with audio context
  useEffect(() => {
    if (musicEffects?.musicLink) {
      setMusicData(
        musicEffects.musicLink,
        musicEffects.musicTitle || "",
        musicEffects.shortNote || "",
      );
    }
  }, [musicEffects, setMusicData]);

  if (!musicEffects?.musicLink) return null;

  const { displayTitle, displayArtist } = parseMusicMeta(
    musicEffects.musicTitle,
  );

  const idleLabel = musicEffects.playButtonLabel?.trim() || "Play Song";

  let playButtonText = idleLabel;
  let playButtonAction = play;
  let playIcon = <Play className="w-4 h-4 fill-current" />;
  let playAriaLabel = idleLabel;

  if (isPlaying) {
    playButtonText = "Pause";
    playButtonAction = pause;
    playIcon = <Pause className="w-4 h-4 fill-current" />;
    playAriaLabel = "Pause song";
  } else if (playbackState === "paused") {
    playButtonText = "Resume";
    playButtonAction = play;
    playIcon = <Play className="w-4 h-4 fill-current" />;
    playAriaLabel = "Resume song";
  }

  return (
    <section
      id="music"
      data-tone={surface}
      className="wedding-section relative py-20 md:py-28 px-4 text-center overflow-hidden"
    >
      <div className="max-w-md mx-auto relative z-10">
        <SpotlightCard
          className="wedding-panel p-8 md:p-12 text-center bg-[color:var(--wedding-surface-dark)] text-[color:var(--wedding-text-on-dark)] relative"
          spotlightColor="rgba(232, 201, 122, 0.20)"
        >
          {/* Eyebrow */}
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-sand/80 mb-6">
            OUR WEDDING SONG
          </p>

          {/* Disc Graphic */}
          <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
            {/* Pulsating outer light ring */}
            {isPlaying && !shouldReduceMotion && (
              <div className="absolute inset-0 rounded-full border border-cream/20 scale-110 animate-ping pointer-events-none" />
            )}

            {/* Spinning vinyl disk */}
            <motion.div
              animate={{ rotate: !shouldReduceMotion && isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-full h-full rounded-full bg-gradient-to-br from-[#1c1410] via-[#2d211a] to-[#1c1410] border-2 border-cream/20 shadow-xl flex items-center justify-center relative group"
            >
              {/* Record grooves */}
              <div className="absolute inset-2 rounded-full border border-cream/5 pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-cream/5 pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-cream/5 pointer-events-none" />

              {/* Center Label */}
              <div className="w-10 h-10 rounded-full wedding-music-disc-center flex items-center justify-center shadow-inner">
                <Music4 className="w-4 h-4 wedding-music-disc-icon" aria-hidden="true" />
              </div>
            </motion.div>
          </div>

          {/* Metadata */}
          <h3 className={`font-serif text-3xl font-medium truncate text-[#f9efe3] ${displayArtist ? "mb-1" : "mb-6"}`}>
            {displayTitle}
          </h3>
          {displayArtist ? (
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-coral mb-6">
              {displayArtist}
            </p>
          ) : null}

          {/* Short Note */}
          <p className="text-sm italic text-cream/70 max-w-xs mx-auto mb-8 font-serif leading-relaxed">
            &ldquo;
            {musicEffects.shortNote ||
              "A song that reminds us of our journey together."}
            &rdquo;
          </p>

          {/* Controls */}
          <div className="flex justify-center gap-3 items-center">
            <AnimatePresence mode="wait">
              <motion.button
                key={
                  isPlaying
                    ? "pause-btn"
                    : playbackState === "paused"
                      ? "resume-btn"
                      : "play-btn"
                }
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={playButtonAction}
                aria-label={playAriaLabel}
                className={weddingButtonVariants({
                  variant: "primary",
                  size: "md",
                  className: "shrink-0",
                })}
              >
                {playIcon}
                <span>{playButtonText}</span>
              </motion.button>
            </AnimatePresence>

            {(playbackState === "playing" || playbackState === "paused") && (
              <motion.button
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={stop}
                aria-label="Stop song"
                className={weddingButtonVariants({
                  variant: "secondary",
                  size: "md",
                  className: "shrink-0",
                })}
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

