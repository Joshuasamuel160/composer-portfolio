"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAudio, PlaylistItem } from "@/lib/context/AudioContext";
import { PortfolioItem, getAllPortfolioItems } from "@/lib/sanity/fetch";
import { formatVideoEmbedUrl, isDirectVideoFile } from "@/lib/utils/formatVideoUrl";
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles, Film, Music, Tv, Layers, Volume2 } from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeIndex, setActiveIndex] = useState(0);

  // Mouse Parallax Tilt state for active card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
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

  // If initialItems empty, fallback to client-side fetch or default items
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

  // Filter items by category tab
  const filteredItems = allItems.filter((item) => {
    if (selectedCategory === "ALL") return true;
    if (selectedCategory === "SCREEN") return item.category === "Screen";
    if (selectedCategory === "SONGS") return item.category === "Song";
    if (selectedCategory === "ADS") return item.category === "Ad";
    return true;
  });

  // Reset activeIndex when category tab changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  const activeItem = filteredItems[activeIndex] || filteredItems[0];
  const isThisPlaying = currentTrack?.id === activeItem?.id && isPlaying;

  // Handle Keyboard Arrow Key Navigation
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
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredItems.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
  };

  // Touch Swipe Handlers for mobile & tablet
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

  // Mouse Parallax Tilt Effect on Active Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handlePlayCurrentItem = () => {
    if (!activeItem) return;

    if (isThisPlaying) {
      togglePlay();
      return;
    }

    const queueList: PlaylistItem[] = filteredItems.map((it) => ({
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

    playMedia(
      {
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
      },
      queueList
    );
  };

  const handleStartFullReel = () => {
    if (filteredItems.length === 0) return;
    const queueList: PlaylistItem[] = filteredItems.map((it) => ({
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

  if (!filteredItems || filteredItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-10 space-y-8 select-none">
      {/* Header & Category Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6 px-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <Sparkles size={14} />
            <span>DISCOGRAPHY & PROJECT SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-1">
            COVER FLOW
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: "ALL WORKS", icon: Layers },
            { id: "SCREEN", label: "SCREEN & TV", icon: Film },
            { id: "SONGS", label: "DISCOGRAPHY", icon: Music },
            { id: "ADS", label: "ADS & CAMPAIGNS", icon: Tv },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 flex-shrink-0 ${
                  isActive
                    ? "bg-amber-500 text-zinc-950 font-semibold shadow-lg shadow-amber-500/20 scale-105"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5"
                }`}
              >
                <Icon size={13} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Cover Flow Stage Viewport - EXPANDED HEIGHT TO PREVENT TOP CLIPPING */}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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

        {/* 3D Curved Cards Track */}
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">
          {filteredItems.map((item, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);

            // Hide cards beyond 4 steps distance
            if (absOffset > 4) return null;

            const isCurrentActive = offset === 0;
            const isVideo = item.mediaType === "video";
            const isDirectVideo = isVideo && isDirectVideoFile(item.url);

            // Organic smooth perspective calculations
            const rotateY = isCurrentActive
              ? tilt.x
              : Math.sign(offset) * -Math.pow(absOffset, 0.7) * 30;

            const rotateX = isCurrentActive ? tilt.y : 0;

            const spacing = typeof window !== "undefined" && window.innerWidth < 640 ? 130 : 185;
            const translateX = isCurrentActive
              ? 0
              : offset * spacing + Math.sign(offset) * 45;

            const translateZ = isCurrentActive ? 150 : -Math.pow(absOffset, 1.2) * 90;
            const scale = isCurrentActive ? 1.06 : Math.max(0.68, 1 - absOffset * 0.12);
            const opacity = isCurrentActive ? 1 : Math.max(0.35, 1 - absOffset * 0.2);
            const blur = isCurrentActive ? 0 : Math.min(5, Math.pow(absOffset, 1.1) * 1.2);
            const zIndex = 50 - absOffset;

            return (
              <div
                key={item.id}
                onClick={() => setActiveIndex(index)}
                onMouseMove={isCurrentActive ? handleMouseMove : undefined}
                onMouseLeave={isCurrentActive ? handleMouseLeave : undefined}
                className="absolute top-1/2 left-1/2 -mt-32 sm:-mt-44 md:-mt-52 -ml-28 sm:-ml-36 md:-ml-48 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 transition-all duration-500 ease-out cursor-pointer group"
                style={{
                  transform: `translate3d(${translateX}px, -50%, ${translateZ}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  filter: blur > 0 ? `blur(${blur}px)` : "none",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Vinyl / Poster Container */}
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
                                height: `${Math.max(15, (h * (0.45 + (i % 4) * 0.15)))}%`,
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

                      {/* Play Button Overlay on Hover for Center Active Card */}
                      {isCurrentActive && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
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
        <div className="cinematic-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl bg-zinc-950/90 relative overflow-hidden">
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
        {filteredItems.map((it, idx) => (
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
