"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FloatingMusicBubble } from "@/client/components/FloatingMusicBubble";
import { GuestDockToolbar, useGuestDockVisibility } from "@/client/components/FloatingGuestDock";
import { useAudio } from "@/client/components/audio-context";

export function FloatingControlsLayer() {
  const dockVisible = useGuestDockVisibility();
  const { playbackState } = useAudio();
  const musicVisible = playbackState !== "idle" && playbackState !== "stopped";
  const controlsVisible = dockVisible || musicVisible;
  const [isCompactDock, setIsCompactDock] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      setIsCompactDock(window.innerWidth < 900);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return (
    <AnimatePresence>
      {controlsVisible && (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-x-0 z-50 flex justify-center px-3 pointer-events-none"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
        >
          <div
            className={
              musicVisible
                ? "inline-flex w-max max-w-[calc(100vw-1.5rem)] items-end justify-center gap-2 sm:gap-3"
                : "flex w-full justify-center"
            }
          >
            <div
              className={
                musicVisible
                  ? "pointer-events-auto flex min-w-0 flex-none justify-center"
                  : "pointer-events-auto flex justify-center"
              }
            >
              <GuestDockToolbar
                compact={musicVisible || isCompactDock}
                className={musicVisible ? "max-w-[calc(100vw-6rem)]" : ""}
              />
            </div>

            {musicVisible && (
              <div className="pointer-events-auto flex flex-none justify-end">
                <FloatingMusicBubble layout="inline" />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
