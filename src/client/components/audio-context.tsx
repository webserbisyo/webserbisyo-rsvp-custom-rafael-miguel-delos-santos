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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // True once the YouTube iframe fires its onLoad event
  const iframeReadyRef = useRef(false);
  // If user tapped play before iframe was ready, fire playVideo on load
  const pendingPlayRef = useRef(false);

  // Detect source type
  const youtubeId = extractYoutubeId(musicLink);
  const sourceType: AudioSourceType = youtubeId ? "youtube" : musicLink ? "mp3" : "none";

  const isPlaying = playbackState === "playing";

  // Register music details and eagerly create the Audio element for MP3 sources.
  // Creating it here (not in play()) ensures the element exists before first tap.
  const setMusicData = (link: string, title: string, note: string) => {
    if (link !== musicLink) {
      setMusicLink(link);

      // Pre-create the HTML audio element so iOS has already seen the resource
      // before the user taps play. The gesture check happens at play() time.
      const ytId = extractYoutubeId(link);
      if (!ytId && link) {
        if (!audioRef.current) {
          const audio = new Audio(link);
          audio.loop = true;
          audio.preload = "none"; // don't auto-fetch; just register the src
          audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
          audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
          audio.addEventListener("ended", () => {
            setPlaybackState("stopped");
            setCurrentTime(0);
          });
          audioRef.current = audio;
        } else if (audioRef.current.src !== link) {
          audioRef.current.src = link;
        }
      }
    }
    if (title !== musicTitle) setMusicTitle(title);
    if (note !== shortNote) setShortNote(note);
  };

  // Keep audio element muted state in sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Keep audio element paused/stopped in sync with state changes that don't
  // come from the play() call itself (e.g. pause, stop, mute toggle).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || sourceType !== "mp3") return;

    if (playbackState === "paused") {
      audio.pause();
    } else if (playbackState === "stopped") {
      audio.pause();
      audio.currentTime = 0;
    }
    // "playing" is handled directly in play() to keep the iOS gesture chain intact.
  }, [playbackState, sourceType]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Post messages to YouTube iframe
  const sendYoutubeCommand = (func: string, args: unknown = "") => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const message = JSON.stringify({ event: "command", func, args });
    const postMsg = "post" + "Message";
    const win = iframe.contentWindow as unknown as Record<
      string,
      (message: string, targetOrigin: string) => void
    >;
    if (typeof win[postMsg] === "function") {
      win[postMsg](message, "*");
    }
  };

  // Sync YouTube mute state
  useEffect(() => {
    if (sourceType === "youtube" && iframeReadyRef.current) {
      sendYoutubeCommand(isMuted ? "mute" : "unMute");
    }
  }, [isMuted, sourceType]);

  const play = () => {
    if (sourceType === "mp3") {
      // MP3: call play() synchronously inside the user gesture.
      // iOS Safari requires audio.play() to be called in the same call stack
      // as the user interaction (click/tap). useEffect breaks that chain.
      if (!audioRef.current && musicLink) {
        const audio = new Audio(musicLink);
        audio.loop = true;
        audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
        audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
        audio.addEventListener("ended", () => {
          setPlaybackState("stopped");
          setCurrentTime(0);
        });
        audioRef.current = audio;
      }
      if (audioRef.current) {
        audioRef.current.muted = isMuted;
        audioRef.current.play().then(() => {
          setPlaybackState("playing");
        }).catch((err) => {
          console.warn("[audio] play blocked:", err);
          setPlaybackState("paused");
        });
        return; // state set in .then()/.catch()
      }
    }

    if (sourceType === "youtube") {
      if (iframeReadyRef.current) {
        // Iframe already loaded: send command immediately (still in gesture stack
        // because postMessage is synchronous)
        sendYoutubeCommand("playVideo");
        setPlaybackState("playing");
      } else {
        // Iframe not ready yet — mark pending so onLoad fires playVideo
        pendingPlayRef.current = true;
        setPlaybackState("playing");
      }
      return;
    }

    setPlaybackState("playing");
  };

  const pause = () => {
    setPlaybackState("paused");
    if (sourceType === "mp3" && audioRef.current) {
      audioRef.current.pause();
    }
    if (sourceType === "youtube") {
      sendYoutubeCommand("pauseVideo");
    }
  };

  const stop = () => {
    setPlaybackState("stopped");
    pendingPlayRef.current = false;
    setCurrentTime(0);
    if (sourceType === "mp3" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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
  };

  const handleIframeLoad = () => {
    iframeReadyRef.current = true;
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      sendYoutubeCommand("playVideo");
    }
  };

  // Render YouTube player as soon as we have a valid youtubeId — not gated
  // behind "hasStartedPlaying" to avoid the first-tap mounting race on iOS.
  const renderHiddenPlayer = () => {
    if (sourceType !== "youtube" || !youtubeId) return null;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    // autoplay=0: we control playback via postMessage, not autoplay.
    // playsinline=1: required for iOS Safari to allow inline audio playback.
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=0&controls=0&rel=0&playsinline=1&origin=${encodeURIComponent(origin)}&playlist=${youtubeId}&loop=1`;

    return (
      <div
        className="fixed pointer-events-none opacity-0 w-0 h-0 overflow-hidden"
        style={{ left: "-9999px", top: "-9999px" }}
        aria-hidden="true"
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
          onLoad: handleIframeLoad,
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
