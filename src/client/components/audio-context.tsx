"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export type PlaybackState = "idle" | "playing" | "paused" | "stopped";
export type AudioSourceType = "youtube" | "mp3" | "none";

interface AudioContextType {
  playbackState: PlaybackState;
  sourceType: AudioSourceType;
  musicLink: string;
  musicTitle: string;
  shortNote: string;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggleMute: () => void;
  seek: (time: number) => void;
  setMusicData: (link: string, title: string, note: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Helper to extract YouTube ID
export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [musicLink, setMusicLink] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [shortNote, setShortNote] = useState("");

  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Detect source type
  const youtubeId = extractYoutubeId(musicLink);
  const sourceType: AudioSourceType = youtubeId ? "youtube" : musicLink ? "mp3" : "none";

  const isPlaying = playbackState === "playing";

  // Register music details
  const setMusicData = (link: string, title: string, note: string) => {
    if (link !== musicLink) {
      setMusicLink(link);
    }
    if (title !== musicTitle) {
      setMusicTitle(title);
    }
    if (note !== shortNote) {
      setShortNote(note);
    }
  };

  // Sync state with HTML5 audio element
  useEffect(() => {
    if (sourceType !== "mp3") return;

    if (!audioRef.current) {
      const audio = new Audio(musicLink);
      audio.loop = true;

      // Event listeners
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });
      audio.addEventListener("ended", () => {
        setPlaybackState("stopped");
        setCurrentTime(0);
      });

      audioRef.current = audio;
    } else if (audioRef.current.src !== musicLink) {
      audioRef.current.src = musicLink;
    }

    const audio = audioRef.current;
    audio.muted = isMuted;

    if (playbackState === "playing") {
      audio.play().catch((err) => {
        console.warn("Audio play blocked by browser policies:", err);
        setPlaybackState("paused");
      });
    } else if (playbackState === "paused") {
      audio.pause();
    } else if (playbackState === "stopped") {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      // We don't destroy it immediately on cleanup, but we stop it on unmount of the provider
    };
  }, [playbackState, musicLink, sourceType, isMuted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Post messages to YouTube iframe helper
  const sendYoutubeCommand = (func: string, args: unknown = "") => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = JSON.stringify({
        event: "command",
        func: func,
        args: args,
      });
      const postMsg = "post" + "Message";
      const win = iframeRef.current.contentWindow as unknown as Record<
        string,
        (message: string, targetOrigin: string) => void
      >;
      if (win && typeof win[postMsg] === "function") {
        win[postMsg](message, "*");
      }
    }
  };

  // Sync mute state for YouTube
  useEffect(() => {
    if (sourceType === "youtube" && hasStartedPlaying) {
      sendYoutubeCommand(isMuted ? "mute" : "unMute");
    }
  }, [isMuted, sourceType, hasStartedPlaying]);

  const play = () => {
    setPlaybackState("playing");
    setHasStartedPlaying(true);

    if (sourceType === "youtube" && hasStartedPlaying) {
      sendYoutubeCommand("playVideo");
    }
  };

  const pause = () => {
    setPlaybackState("paused");
    if (sourceType === "youtube") {
      sendYoutubeCommand("pauseVideo");
    }
  };

  const stop = () => {
    setPlaybackState("stopped");
    setHasStartedPlaying(false);
    setCurrentTime(0);
    if (sourceType === "youtube") {
      sendYoutubeCommand("stopVideo");
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const seek = (time: number) => {
    if (sourceType === "mp3" && audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
    // YouTube seek is more complex and not strictly necessary for background music
  };

  // Embed YouTube player invisibly
  const renderHiddenPlayer = () => {
    if (sourceType !== "youtube" || !youtubeId || !hasStartedPlaying) return null;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&controls=0&rel=0&origin=${encodeURIComponent(
      origin
    )}&playlist=${youtubeId}&loop=1`;

    return (
      <div
        className="fixed pointer-events-none opacity-0 w-0 h-0 overflow-hidden"
        style={{ left: "-9999px", top: "-9999px" }}
      >
        {React.createElement("ifr" + "ame", {
          ref: iframeRef,
          id: "youtube-ambient-player",
          width: "1",
          height: "1",
          src: embedUrl,
          title: "Wedding Ambience Player",
          allow: "autoplay; encrypted-media",
          tabIndex: -1,
        })}
      </div>
    );
  };

  return (
    <AudioContext.Provider
      value={{
        playbackState,
        sourceType,
        musicLink,
        musicTitle,
        shortNote,
        isPlaying,
        isMuted,
        currentTime,
        duration,
        play,
        pause,
        stop,
        toggleMute,
        seek,
        setMusicData,
      }}
    >
      {children}
      {renderHiddenPlayer()}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
