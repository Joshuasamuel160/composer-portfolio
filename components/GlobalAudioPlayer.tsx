"use client";

import React, { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAudio } from "@/lib/context/AudioContext";
import { formatVideoEmbedUrl, isDirectVideoFile } from "@/lib/utils/formatVideoUrl";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Tv,
  Film,
  Music,
  Radio,
  Minimize2,
  Maximize2,
  ListMusic,
  Sparkles,
} from "lucide-react";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const GlobalAudioPlayer: React.FC = () => {
  const pathname = usePathname();
  const {
    currentItem,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    closePlayer,
    audioRef,
    videoRef,
    queue,
    queueIndex,
    isReelMode,
    reelCategory,
    exitReel,
    isPipMinimized,
    togglePip,
    getFrequencyData,
  } = useAudio();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showUpNext, setShowUpNext] = useState(false);

  // Real-time Canvas Frequency Visualizer Animation driven by Web Audio API
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 28;
      const barWidth = canvas.width / bars - 1.5;
      const now = Date.now();
      const freqData = isPlaying ? getFrequencyData() : null;

      for (let i = 0; i < bars; i++) {
        let height = 3;
        if (isPlaying) {
          let val = 0;
          if (freqData && freqData.length > 0) {
            const sampleIdx = Math.floor((i / bars) * (freqData.length / 2));
            val = freqData[sampleIdx] || 0;
          }
          if (val > 0) {
            height = Math.max(3, (val / 255) * (canvas.height - 2));
          } else {
            const freq = Math.sin(now * 0.008 + i * 0.4) * 0.5 + 0.5;
            height = Math.max(3, freq * (canvas.height - 2));
          }
        }

        const x = i * (barWidth + 1.5);
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, "#B8863B");
        gradient.addColorStop(1, "#8A682F");

        ctx.fillStyle = isPlaying ? gradient : "rgba(237, 232, 222, 0.15)";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, getFrequencyData]);

  // Keyboard Shortcuts: Space (Play/Pause), Left/Right Arrows (Seek 5s), M (Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentItem) return;
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
  }, [currentItem, isPlaying, currentTime, duration, volume, togglePlay, seek, setVolume]);

  if (!currentItem) return null;

  const hasNext = queue.length > 0 && queueIndex + 1 < queue.length;
  const hasPrev = queue.length > 0 && queueIndex - 1 >= 0;
  const nextItem = hasNext ? queue[queueIndex + 1] : null;

  const isVideo = currentItem.mediaType === "video";
  const embedUrl = isVideo ? formatVideoEmbedUrl(currentItem.url) : "";
  const isDirectVideo = isVideo && isDirectVideoFile(currentItem.url);

  // Hide corner floating PiP window on home page (`/`) since video plays directly inside Cover Flow card stage
  const showFloatingPip = isVideo && !isPipMinimized && pathname !== "/";

  return (
    <>
      {/* FLOATING PICTURE-IN-PICTURE (PiP) VIDEO PLAYER WINDOW */}
      {showFloatingPip && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-72 sm:w-96 aspect-video bg-[#0C0C0D] border border-[#EDE8DE]/14 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 group">
          {/* PiP Header Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#131313] border-b border-[#EDE8DE]/14 text-xs font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#B8863B] animate-pulse flex-shrink-0" />
              <span className="text-[10px] text-[#C9C4B8] uppercase tracking-widest truncate">
                {currentItem.title}
              </span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={togglePip}
                className="p-1 rounded text-[#8C8A80] hover:text-[#EDE8DE] hover:bg-[#0C0C0D] transition-colors"
                title="Minimize Video"
              >
                <Minimize2 size={14} />
              </button>
              <button
                onClick={closePlayer}
                className="p-1 rounded text-[#8C8A80] hover:text-[#EDE8DE] hover:bg-[#0C0C0D] transition-colors"
                title="Close Player"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Persistent Video Container */}
          <div className="relative w-full flex-grow bg-black overflow-hidden flex items-center justify-center">
            {isDirectVideo ? (
              <video
                ref={videoRef}
                src={currentItem.url}
                autoPlay
                playsInline
                controls={false}
                onEnded={playNext}
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <iframe
                src={embedUrl.includes("?") ? `${embedUrl}&autoplay=1` : `${embedUrl}?autoplay=1`}
                title={currentItem.title}
                className="w-full h-full border-0 object-contain"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
          </div>
        </div>
      )}

      {/* PERSISTENT BOTTOM MINI-PLAYER BAR */}
      <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl z-50 bg-[#0C0C0D]/95 backdrop-blur-2xl border border-[#EDE8DE]/14 rounded-2xl p-3.5 shadow-2xl transition-all duration-300">
        {/* REEL / COVER FLOW CONTROLLER BADGE STRIP */}
        {isReelMode ? (
          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#B8863B]/20 text-[10px] font-mono text-[#B8863B]">
            <span className="flex items-center gap-1.5 uppercase tracking-widest font-semibold">
              <Sparkles size={12} className="animate-spin" />
              FULL REEL MODE ACTIVE — {reelCategory || "CONTINUOUS QUEUE"} ({queueIndex + 1} OF {queue.length})
            </span>

            <button
              onClick={exitReel}
              className="px-2 py-0.5 rounded-full bg-[#B8863B]/10 hover:bg-[#B8863B]/20 border border-[#B8863B]/30 text-[#EDE8DE] uppercase tracking-widest transition-colors"
            >
              EXIT REEL
            </button>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4">
          {/* Left: Thumbnail, Titles & Category Badge */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink-0 max-w-[200px] sm:max-w-xs">
            <div className="relative flex-shrink-0">
              {(currentItem.posterUrl || currentItem.coverUrl) ? (
                <img
                  src={currentItem.posterUrl || currentItem.coverUrl}
                  alt={currentItem.title}
                  className="w-12 h-12 rounded-xl object-cover border border-[#EDE8DE]/14 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#131313] border border-[#EDE8DE]/14 flex items-center justify-center text-[#B8863B]">
                  {isVideo ? <Film size={20} /> : <Music size={20} />}
                </div>
              )}

              {/* Animated DAW Soundwave Equalizer overlay badge */}
              {isPlaying && (
                <div className="absolute inset-0 bg-[#0C0C0D]/60 rounded-xl flex items-center justify-center gap-0.5 p-1 backdrop-blur-[1px]">
                  <span className="w-1 bg-[#B8863B] rounded-full animate-[bounce_0.6s_infinite_100ms] h-4" />
                  <span className="w-1 bg-[#B8863B] rounded-full animate-[bounce_0.6s_infinite_300ms] h-6" />
                  <span className="w-1 bg-[#B8863B] rounded-full animate-[bounce_0.6s_infinite_200ms] h-3" />
                  <span className="w-1 bg-[#B8863B] rounded-full animate-[bounce_0.6s_infinite_400ms] h-5" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-widest border bg-[#B8863B]/15 text-[#B8863B] border-[#B8863B]/30"
                >
                  {currentItem.category || (isVideo ? "Video" : "Audio")}
                </span>
                {currentItem.year && (
                  <span className="text-[10px] font-mono text-[#8C8A80]">{currentItem.year}</span>
                )}
              </div>
              <h4 className="text-xs sm:text-sm font-medium text-[#EDE8DE] truncate tracking-wide font-sans">
                {currentItem.title}
              </h4>
              <p className="text-[11px] text-[#C9C4B8] truncate font-sans">
                {currentItem.artist} {currentItem.role ? `• ${currentItem.role}` : ""}
              </p>
            </div>
          </div>

          {/* Center: Controls, Scrubber & Visualizer */}
          <div className="flex items-center gap-3 flex-grow max-w-md px-1">
            {/* Skip Previous */}
            <button
              onClick={playPrevious}
              disabled={!hasPrev}
              className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${
                hasPrev ? "text-[#EDE8DE] hover:text-[#B8863B] hover:bg-[#131313]" : "text-[#8C8A80]/40 cursor-not-allowed"
              }`}
              aria-label="Previous track"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>

            {/* Play / Pause Main Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#B8863B] hover:bg-[#B8863B]/90 text-[#0C0C0D] flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 flex-shrink-0"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={playNext}
              disabled={!hasNext}
              className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${
                hasNext ? "text-[#EDE8DE] hover:text-[#B8863B] hover:bg-[#131313]" : "text-[#8C8A80]/40 cursor-not-allowed"
              }`}
              aria-label="Next track"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>

            {/* Scrubber Bar & Real-Time Canvas Spectrum */}
            <div className="flex-grow flex items-center gap-2 min-w-0 hidden sm:flex">
              <span className="text-[11px] text-[#8C8A80] font-mono w-9 text-right flex-shrink-0">
                {formatTime(currentTime)}
              </span>

              <div className="flex-grow flex flex-col gap-1 min-w-0">
                {/* Reactive Spectrum Canvas */}
                <div className="h-2.5 w-full flex items-center justify-center">
                  <canvas ref={canvasRef} width={200} height={10} className="w-full h-full" />
                </div>

                {/* Progress Seek Scrubber */}
                <div
                  className="relative flex-grow h-1.5 bg-[#131313] rounded-full cursor-pointer group overflow-hidden border border-[#EDE8DE]/14"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickPos = (e.clientX - rect.left) / rect.width;
                    seek(clickPos * duration);
                  }}
                >
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-[#B8863B] rounded-full transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <span className="text-[11px] text-[#8C8A80] font-mono w-9 flex-shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: "Up Next" Tooltip, PiP Video Toggle & Volume / Close */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* UP NEXT PREVIEW BADGE */}
            {nextItem && (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowUpNext(true)}
                  onMouseLeave={() => setShowUpNext(false)}
                  onClick={playNext}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 hover:border-amber-500/40 text-[10px] font-mono text-zinc-400 hover:text-amber-300 transition-all"
                >
                  <ListMusic size={12} />
                  <span>UP NEXT</span>
                </button>

                {showUpNext && (
                  <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-zinc-900 border border-white/20 rounded-xl shadow-2xl text-xs space-y-1 z-50 pointer-events-none">
                    <p className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">
                      UP NEXT IN QUEUE
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {nextItem.posterUrl && (
                        <img
                          src={nextItem.posterUrl}
                          alt={nextItem.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-light truncate text-zinc-100">{nextItem.title}</p>
                        <p className="text-[10px] font-mono text-zinc-400 truncate">
                          {nextItem.artist}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Video PiP Window Toggle (Off-home pages only) */}
            {isVideo && pathname !== "/" && (
              <button
                onClick={togglePip}
                className="p-2 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 transition-colors"
                title={isPipMinimized ? "Expand Video Window" : "Minimize Video Window"}
              >
                {isPipMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
            )}

            {/* Volume Button */}
            <button
              onClick={() => setVolume(volume === 0 ? 0.85 : 0)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors hidden sm:block"
              aria-label="Toggle mute"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Close Player (Only on non-Home pages, since Home Cover Flow uses player as transport bar) */}
            {pathname !== "/" && (
              <button
                onClick={closePlayer}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Close player"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
