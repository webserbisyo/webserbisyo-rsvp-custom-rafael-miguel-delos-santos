"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FloatingMusicBubble } from "@/client/components/FloatingMusicBubble";
import { GuestDockToolbar } from "@/client/components/FloatingGuestDock";
import { useAudio } from "@/client/components/audio-context";
import { useAutoHideDock } from "@/client/hooks/useAutoHideDock";
import type { ClientSectionKey } from "@/client/config/navigation";

export function FloatingControlsLayer({
  visibleSectionKeys,
}: {
  visibleSectionKeys: ClientSectionKey[];
}) {
  const { isVisible: isDockVisible, dockHandlers } = useAutoHideDock();
  const { playbackState } = useAudio();
  const musicVisible = playbackState !== "idle" && playbackState !== "stopped";
  const [isCompactDock, setIsCompactDock] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateLayout = () => {
      setIsCompactDock(window.innerWidth < 900);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const dockVariants = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      pointerEvents: "auto" as const,
    },
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 28,
      scale: shouldReduceMotion ? 1 : 0.98,
      pointerEvents: "none" as const,
    },
  };

  const dockTransition = {
    duration: isDockVisible ? 0.28 : 0.35,
    ease: isDockVisible ? ([0.16, 1, 0.3, 1] as const) : ([0.4, 0, 0.2, 1] as const),
  };

  return (
    <div
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
              ? "flex min-w-0 flex-none justify-center"
              : "flex justify-center"
          }
        >
          <motion.div
            variants={dockVariants}
            initial="visible"
            animate={isDockVisible ? "visible" : "hidden"}
            transition={dockTransition}
            {...dockHandlers}
            className="flex justify-center pointer-events-auto"
          >
            <GuestDockToolbar
              compact={musicVisible || isCompactDock}
              className={musicVisible ? "max-w-[calc(100vw-6rem)]" : ""}
              visibleSectionKeys={visibleSectionKeys}
            />
          </motion.div>
        </div>

        {musicVisible && (
          <div className="pointer-events-auto flex flex-none justify-end">
            <FloatingMusicBubble layout="inline" />
          </div>
        )}
      </div>
    </div>
  );
}
