"use client";

import React from "react";
import { useAudio } from "@/lib/context/AudioContext";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const GlobalAudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, currentTime, duration, seek, volume, setVolume, closePlayer } = useAudio();

  // Keyboard Shortcuts: Spacebar (Play/Pause), Left/Right Arrows (Seek 5s), M (Mute)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentTrack) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seek(Math.min(duration || 0, currentTime + 5));
      } else if (e.code === "KeyM") {
        e.preventDefault();
        setVolume(volume === 0 ? 0.85 : 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTrack, isPlaying, currentTime, duration, volume, togglePlay, seek, setVolume]);

  if (!currentTrack) return null;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl z-50 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Track Thumbnail & Meta + Soundwave Equalizer */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            {currentTrack.coverUrl && (
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover border border-white/10 shadow-md"
              />
            )}
            {/* Animated DAW Soundwave Equalizer overlay badge */}
            {isPlaying && (
              <div className="absolute inset-0 bg-zinc-950/60 rounded-lg flex items-center justify-center gap-0.5 p-1 backdrop-blur-[1px]">
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-4" />
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-6" />
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_200ms] h-3" />
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_400ms] h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-zinc-100 truncate tracking-wide flex items-center gap-2">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-zinc-400 truncate">
              {currentTrack.artist} {currentTrack.role ? `• ${currentTrack.role}` : ""}
            </p>
          </div>
        </div>

        {/* Play / Pause & Scrubber Controls */}
        <div className="flex items-center gap-4 flex-grow max-w-md px-2">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 flex-shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          {/* DAW Scrubber Bar */}
          <div className="flex-grow flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-mono w-9 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              className="relative flex-grow h-2 bg-zinc-800 rounded-full cursor-pointer group overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                seek(clickPos * duration);
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all group-hover:brightness-110"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-zinc-400 font-mono w-9">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Side: Volume & Close Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 border-r border-white/10 pr-3">
            <button
              onClick={() => setVolume(volume === 0 ? 0.85 : 0)}
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 accent-amber-500 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Close Player Button */}
          <button
            onClick={closePlayer}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
            aria-label="Close music player"
            title="Close music player"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
