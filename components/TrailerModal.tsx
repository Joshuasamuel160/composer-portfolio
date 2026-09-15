"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { formatVideoEmbedUrl, isDirectVideoFile } from "@/lib/utils/formatVideoUrl";
import { useAudio } from "@/lib/context/AudioContext";
import { Play, Pause, Volume2, VolumeX, X, Maximize, Minimize } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  videoUrl: string;
  title: string;
  artist?: string;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  videoUrl,
  title,
  artist,
  onClose,
}) => {
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const { isPlaying: isGlobalPlaying, togglePlay: toggleGlobalPlay } = useAudio();

  // 1. Pause global background audio when trailer opens
  useEffect(() => {
    if (isOpen) {
      if (isGlobalPlaying) {
        toggleGlobalPlay();
      }
      setIsPlaying(true);
    }
  }, [isOpen]);

  // 2. Escape key listener & focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPlaying]);

  const togglePlay = () => {
    if (modalVideoRef.current) {
      if (isPlaying) {
        modalVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        modalVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (pct: number) => {
    if (modalVideoRef.current && duration) {
      const newTime = pct * duration;
      modalVideoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen || !videoUrl) return null;

  const isDirectVideo = isDirectVideoFile(videoUrl);
  const embedUrl = formatVideoEmbedUrl(videoUrl);

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} Trailer Modal`}
    >
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between z-20 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-500 text-zinc-950 font-bold shadow-lg">
            CINEMATIC PREVIEW
          </span>
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-serif text-zinc-100 uppercase tracking-wide truncate">
              {title}
            </h2>
            {artist && (
              <p className="text-xs font-mono text-zinc-400 truncate uppercase">
                {artist}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-zinc-900/90 border border-white/20 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-all hover:scale-110 shadow-2xl flex-shrink-0"
          aria-label="Close Trailer Modal"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Video Viewport */}
      <div className="relative flex-grow w-full max-w-6xl mx-auto my-auto flex items-center justify-center overflow-hidden py-4">
        <div className="relative w-full h-full max-h-[75vh] aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl flex items-center justify-center">
          {isDirectVideo ? (
            <video
              ref={modalVideoRef}
              src={videoUrl}
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
              onTimeUpdate={() => {
                if (modalVideoRef.current) setCurrentTime(modalVideoRef.current.currentTime);
              }}
              onLoadedMetadata={() => {
                if (modalVideoRef.current) setDuration(modalVideoRef.current.duration || 0);
              }}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <iframe
              src={embedUrl.includes("?") ? `${embedUrl}&autoplay=1` : `${embedUrl}?autoplay=1`}
              title={title}
              className="w-full h-full border-0 object-contain"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>

      {/* Bottom Cinema Transport Bar */}
      <div className="z-20 w-full max-w-4xl mx-auto bg-zinc-950/90 border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center transition-all shadow-lg hover:scale-105"
            aria-label={isPlaying ? "Pause Trailer" : "Play Trailer"}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          {isDirectVideo && (
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>

        {/* Video Scrubber */}
        {isDirectVideo && (
          <div
            className="flex-grow h-2 bg-zinc-800 rounded-full cursor-pointer overflow-hidden border border-white/5"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              handleSeek(pct);
            }}
          >
            <div
              className="h-full bg-amber-500 transition-all duration-100 shadow-md"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {isDirectVideo && (
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              aria-label="Toggle Mute"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
