"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAudio, PlaylistItem } from "@/lib/context/AudioContext";
import { PortfolioItem, getAllPortfolioItems } from "@/lib/sanity/fetch";
import { formatVideoEmbedUrl, isDirectVideoFile } from "@/lib/utils/formatVideoUrl";
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles, Volume2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface CoverFlowProps {
  items?: PortfolioItem[];
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const CoverFlow: React.FC<CoverFlowProps> = ({ items: initialItems }) => {
  const [allItems, setAllItems] = useState<PortfolioItem[]>(initialItems || []);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const detailsRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    videoRef,
    playMedia,
    startReel,
    togglePlay,
    playNext,
    seek,
  } = useAudio();

  // Fallback client-side fetch if initialItems empty
  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      getAllPortfolioItems().then((res) => {
        if (res && res.length > 0) {
          setAllItems(res);
        }
      });
    } else {
      setAllItems(initialItems);
    }
  }, [initialItems]);

  const items = allItems;
  const N = items.length;

  const activeItem = items[activeIndex] || items[0];

  // Match current active track with active item
  const isThisPlaying =
    Boolean(currentTrack) &&
    Boolean(activeItem) &&
    (currentTrack?.id === activeItem?.id || currentTrack?.title === activeItem?.title) &&
    isPlaying;

  // Infinite Circular Navigation Handlers
  const handlePrev = useCallback(() => {
    if (N === 0) return;
    setActiveIndex((prev) => (prev - 1 + N) % N);
  }, [N]);

  const handleNext = useCallback(() => {
    if (N === 0) return;
    setActiveIndex((prev) => (prev + 1) % N);
  }, [N]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch Drag & Swipe Physics
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 35) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // GSAP Ultra-Fluid 3D Animation for Card Motion
  useGSAP(
    () => {
      if (!items || items.length === 0) return;

      items.forEach((_, index) => {
        const card = cardsRef.current[index];
        if (!card) return;

        // Circular shortest distance
        let offset = index - activeIndex;
        if (N > 0) {
          if (offset > N / 2) offset -= N;
          if (offset < -N / 2) offset += N;
        }

        const absOffset = Math.abs(offset);
        const isCurrentActive = offset === 0;

        // Perspective 3D math
        const rotateY = isCurrentActive ? 0 : Math.sign(offset) * -Math.pow(absOffset, 0.72) * 32;
        const spacing = typeof window !== "undefined" && window.innerWidth < 640 ? 130 : 190;
        const translateX = isCurrentActive ? 0 : offset * spacing + Math.sign(offset) * 45;
        const translateZ = isCurrentActive ? 150 : -Math.pow(absOffset, 1.25) * 95;
        const scale = isCurrentActive ? 1.06 : Math.max(0.65, 1 - absOffset * 0.12);
        const opacity = absOffset > 4 ? 0 : isCurrentActive ? 1 : Math.max(0.3, 1 - absOffset * 0.22);
        const blur = isCurrentActive ? 0 : Math.min(6, Math.pow(absOffset, 1.1) * 1.3);
        const zIndex = 50 - absOffset;

        gsap.to(card, {
          x: translateX,
          z: translateZ,
          rotateY: rotateY,
          scale: scale,
          opacity: opacity,
          filter: blur > 0 ? `blur(${blur}px)` : "none",
          zIndex: zIndex,
          duration: 0.65,
          ease: "power3.out",
          overwrite: "auto",
        });
      });

      // Animate active details text fade-in
      if (detailsRef.current) {
        gsap.fromTo(
          detailsRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );
      }
    },
    { dependencies: [activeIndex, items.length], scope: containerRef }
  );

  const handlePlayCurrentItem = () => {
    if (!activeItem) return;

    if (isThisPlaying) {
      togglePlay();
      return;
    }

    const queueList: PlaylistItem[] = items.map((it) => ({
      id: it.id,
      title: it.title,
      artist: it.artist,
      role: it.role,
      mediaType: it.mediaType,
      url: it.url,
      posterUrl: it.coverUrl,
      coverUrl: it.coverUrl,
      year: it.year,
      category: it.category,
    }));

    const targetPlaylistItem: PlaylistItem = {
      id: activeItem.id,
      title: activeItem.title,
      artist: activeItem.artist,
      role: activeItem.role,
      mediaType: activeItem.mediaType,
      url: activeItem.url,
      posterUrl: activeItem.coverUrl,
      coverUrl: activeItem.coverUrl,
      year: activeItem.year,
      category: activeItem.category,
    };

    playMedia(targetPlaylistItem, queueList);
  };

  const handleStartFullReel = () => {
    if (items.length === 0) return;
    const queueList: PlaylistItem[] = items.map((it) => ({
      id: `reel-${it.id}`,
      title: it.title,
      artist: it.artist,
      role: it.role,
      mediaType: it.mediaType,
      url: it.url,
      posterUrl: it.coverUrl,
      coverUrl: it.coverUrl,
      year: it.year,
      category: it.category,
    }));
    startReel("FULL", queueList);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-2 space-y-6 select-none">
      {/* GSAP-Powered 3D Infinite Looping Cover Flow Stage */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-[480px] sm:h-[580px] md:h-[660px] w-full flex items-center justify-center overflow-visible py-12"
        style={{
          perspective: "1300px",
          perspectiveOrigin: "50% 48%",
        }}
      >
        {/* Ambient Stage Lighting Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Navigation Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 z-50 w-12 h-12 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-white/20 text-zinc-200 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform hover:scale-110 active:scale-95"
          aria-label="Previous Project"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 z-50 w-12 h-12 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-white/20 text-zinc-200 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform hover:scale-110 active:scale-95"
          aria-label="Next Project"
        >
          <ChevronRight size={24} />
        </button>

        {/* 3D Cards Track */}
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">
          {items.map((item, index) => {
            let offset = index - activeIndex;
            if (N > 0) {
              if (offset > N / 2) offset -= N;
              if (offset < -N / 2) offset += N;
            }

            const isCurrentActive = offset === 0;
            const isVideo = item.mediaType === "video";
            const isDirectVideo = isVideo && isDirectVideoFile(item.url);

            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onClick={() => {
                  if (!isCurrentActive) {
                    setActiveIndex(index);
                  }
                }}
                className="absolute top-1/2 left-1/2 -mt-32 sm:-mt-44 md:-mt-52 -ml-28 sm:-ml-36 md:-ml-48 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 cursor-pointer group"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Vinyl / Poster Card Container */}
                <div
                  className={`relative w-full h-full rounded-2xl overflow-hidden bg-zinc-950 border transition-all duration-300 shadow-2xl ${
                    isCurrentActive
                      ? "border-amber-500 ring-4 ring-amber-500/25 shadow-2xl shadow-amber-500/30"
                      : "border-white/10 group-hover:border-white/30"
                  }`}
                >
                  {/* INLINE MEDIA PLAYBACK DIRECTLY INSIDE ACTIVE COVER FLOW CARD */}
                  {isCurrentActive && isThisPlaying ? (
                    isVideo ? (
                      /* Video Plays Directly Inside Active Card */
                      <div className="relative w-full h-full bg-black flex items-center justify-center z-30">
                        {isDirectVideo ? (
                          <video
                            ref={videoRef}
                            src={item.url}
                            autoPlay
                            playsInline
                            controls
                            onEnded={playNext}
                            className="w-full h-full object-contain bg-black"
                          />
                        ) : (
                          <iframe
                            src={`${formatVideoEmbedUrl(item.url)}${item.url.includes("?") ? "&" : "?"}autoplay=1`}
                            title={item.title}
                            className="w-full h-full border-0 object-contain"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        )}
                      </div>
                    ) : (
                      /* Audio Song Waveform Spectrum Overlay Directly Over Active Card */
                      <div className="relative w-full h-full flex flex-col justify-between p-5 bg-zinc-950/90 border border-amber-500/50 rounded-2xl z-30 overflow-hidden shadow-2xl backdrop-blur-md">
                        {/* Background Artwork Blurred */}
                        <img
                          src={item.coverUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-sm pointer-events-none"
                        />

                        {/* Top Audio Playing Status */}
                        <div className="relative z-10 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-500 text-zinc-950 font-bold flex items-center gap-1.5 shadow-lg">
                            <Volume2 size={12} /> PLAYING AUDIO
                          </span>
                          <span className="text-xs font-mono text-amber-300 font-medium">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        {/* Center Animated 20-Bar Waveform Equalizer */}
                        <div className="relative z-10 flex items-center justify-center space-x-1.5 h-24 my-auto px-2">
                          {[35, 70, 50, 85, 60, 100, 75, 40, 90, 65, 80, 55, 75, 95, 60, 45, 85, 50, 75, 40].map((h, i) => (
                            <span
                              key={i}
                              className="w-1.5 bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300 rounded-full transition-all duration-300 shadow-md shadow-amber-500/30"
                              style={{
                                height: `${Math.max(15, h * (0.45 + (i % 4) * 0.15))}%`,
                                animation: `pulseBar 0.75s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.04}s`,
                              }}
                            />
                          ))}
                        </div>

                        {/* Bottom Track Meta & Interactive Waveform Progress Bar */}
                        <div className="relative z-10 space-y-2">
                          <p className="text-xs font-mono text-zinc-100 font-semibold uppercase tracking-wider truncate">
                            {item.title}
                          </p>
                          <div
                            className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden cursor-pointer border border-white/10"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const clickX = e.clientX - rect.left;
                              const pct = clickX / rect.width;
                              if (duration) seek(pct * duration);
                            }}
                          >
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all duration-100 shadow-md shadow-amber-500/50"
                              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    /* Default Cover Artwork Display */
                    <>
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest backdrop-blur-md border ${
                            item.category === "Screen"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              : item.category === "Song"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>

                      {/* Play Button Overlay on Active Card */}
                      {isCurrentActive && (
                        <div
                          onClick={handlePlayCurrentItem}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] cursor-pointer z-20"
                        >
                          <div className="w-16 h-16 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                            <Play size={24} fill="currentColor" className="ml-1" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Soft Glass Stage Floor Reflection */}
                <div
                  className="w-full h-full mt-3 rounded-2xl overflow-hidden opacity-20 pointer-events-none transform scale-y-[-1] blur-[2px]"
                  style={{
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 70%)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 70%)",
                  }}
                >
                  <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Project Details Card & Transport Buttons */}
      {activeItem && (
        <div
          ref={detailsRef}
          className="cinematic-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl bg-zinc-950/90 relative overflow-hidden"
        >
          {/* Ambient Accent Line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          <div className="space-y-2 min-w-0 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-semibold">
                {activeItem.category === "Screen" ? "FILM / TV SCORE" : activeItem.category === "Song" ? "DISCOGRAPHY RELEASE" : "COMMERCIAL CAMPAIGN"}
              </span>

              {activeItem.year && (
                <span className="text-xs font-mono text-zinc-500">
                  • {activeItem.year}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-light text-zinc-100 uppercase tracking-wide truncate">
              {activeItem.title}
            </h3>

            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {activeItem.artist} — {activeItem.role}
            </p>

            {activeItem.description && (
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed line-clamp-2">
                {activeItem.description}
              </p>
            )}
          </div>

          {/* Action Launchers */}
          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-center justify-end flex-shrink-0">
            {/* Play Current Selected Item directly inside Cover Flow */}
            <button
              onClick={handlePlayCurrentItem}
              className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
              {isThisPlaying ? (
                <>
                  <Pause size={16} fill="currentColor" /> PAUSE
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" className="ml-0.5" /> PLAY THIS ITEM
                </>
              )}
            </button>

            {/* Launch Continuous Full Reel */}
            <button
              onClick={handleStartFullReel}
              className="px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-500/40 font-semibold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all hover:scale-105"
            >
              <Sparkles size={16} className="text-amber-400" />
              PLAY FULL REEL
            </button>
          </div>
        </div>
      )}

      {/* Stage Dots Scrubber Indicator */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {items.map((it, idx) => (
          <button
            key={it.id}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === idx
                ? "w-8 bg-amber-500 shadow-md shadow-amber-500/40"
                : "w-2 bg-zinc-800 hover:bg-zinc-600"
            }`}
            aria-label={`Jump to cover ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
