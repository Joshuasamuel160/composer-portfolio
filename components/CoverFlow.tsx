"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAudio, PlaylistItem } from "@/lib/context/AudioContext";
import { mockScreenProjects, mockSongs, mockAds } from "@/lib/mockData";
import { Play, Pause, ChevronLeft, ChevronRight, Sparkles, Film, Music, Tv } from "lucide-react";

export interface CoverFlowItem {
  id: string;
  title: string;
  artist: string;
  role: string;
  category: "Screen" | "Song" | "Ad";
  coverUrl: string;
  year?: string;
  description?: string;
  mediaType: "video" | "audio";
  url: string;
}

export function getAllPortfolioItems(): CoverFlowItem[] {
  const screenItems: CoverFlowItem[] = mockScreenProjects.map((sp) => ({
    id: sp.id,
    title: sp.title,
    artist: sp.productionCompany || sp.director || "Joshua Samuel",
    role: sp.role,
    category: "Screen",
    coverUrl: sp.posterUrl,
    year: sp.year,
    description: sp.description,
    mediaType: "video",
    url: sp.videoUrl,
  }));

  const songItems: CoverFlowItem[] = mockSongs.map((s) => ({
    id: s.id,
    title: s.title,
    artist: s.artistName,
    role: s.role,
    category: "Song",
    coverUrl: s.coverUrl,
    year: s.releaseYear,
    description: `Original record production & release with ${s.artistName}.`,
    mediaType: "audio",
    url: s.audioUrl,
  }));

  const adItems: CoverFlowItem[] = mockAds.map((ad) => ({
    id: ad.id,
    title: ad.brandName,
    artist: "Commercial Campaign",
    role: "Original Music & Sonic Branding",
    category: "Ad",
    coverUrl: ad.thumbnailUrl,
    description: ad.description,
    mediaType: "video",
    url: ad.videoUrl,
  }));

  // Interleave for rich variety in Cover Flow
  const combined: CoverFlowItem[] = [];
  const maxLen = Math.max(screenItems.length, songItems.length, adItems.length);
  for (let i = 0; i < maxLen; i++) {
    if (screenItems[i]) combined.push(screenItems[i]);
    if (songItems[i]) combined.push(songItems[i]);
    if (adItems[i]) combined.push(adItems[i]);
  }

  return combined;
}

export const CoverFlow: React.FC = () => {
  const items = getAllPortfolioItems();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const { currentTrack, isPlaying, playMedia, startReel } = useAudio();

  const activeItem = items[activeIndex] || items[0];
  const isThisPlaying = currentTrack?.id === activeItem.id && isPlaying;

  // Handle keyboard navigation when inside component scope
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid stealing input from search/form inputs
      if (
        document.activeElement &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  // Touch Swipe Handlers for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const handlePlayCurrentItem = () => {
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

  return (
    <div className="w-full max-w-6xl mx-auto py-10 space-y-8 select-none">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 px-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <Sparkles size={14} />
            <span>PROJECT DISCOGRAPHY COVER FLOW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-1">
            EXPLORE ALL WORKS
          </h2>
        </div>

        {/* Home Page Showcase PLAY FULL REEL Launcher */}
        <button
          onClick={handleStartFullReel}
          className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs uppercase tracking-widest flex items-center gap-2.5 shadow-xl shadow-amber-500/20 transition-all hover:scale-105 flex-shrink-0"
        >
          <Sparkles size={16} fill="currentColor" />
          PLAY FULL REEL
        </button>
      </div>

      {/* 3D Cover Flow Viewport */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-64 sm:h-80 md:h-96 w-full flex items-center justify-center overflow-hidden py-4 cursor-grab active:cursor-grabbing"
        style={{
          perspective: "1100px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Left & Right Chevron Overlay Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 z-50 w-11 h-11 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-white/20 text-zinc-200 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform hover:scale-110"
          aria-label="Previous Cover"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 z-50 w-11 h-11 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-white/20 text-zinc-200 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform hover:scale-110"
          aria-label="Next Cover"
        >
          <ChevronRight size={24} />
        </button>

        {/* Render Cover Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {items.map((item, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);

            // Limit rendering distance to keep DOM light
            if (absOffset > 5) return null;

            // Compute 3D transforms
            const rotateY = offset === 0 ? 0 : offset < 0 ? 42 : -42;
            const translateX = offset * (typeof window !== "undefined" && window.innerWidth < 640 ? 110 : 160);
            const translateZ = offset === 0 ? 110 : -absOffset * 85;
            const scale = offset === 0 ? 1.08 : Math.max(0.65, 1 - absOffset * 0.14);
            const opacity = offset === 0 ? 1 : Math.max(0.25, 1 - absOffset * 0.25);
            const zIndex = 50 - absOffset;

            const isCurrentActive = offset === 0;

            return (
              <div
                key={item.id}
                onClick={() => setActiveIndex(index)}
                className="absolute top-1/2 left-1/2 -mt-24 sm:-mt-32 md:-mt-40 -ml-20 sm:-ml-28 md:-ml-36 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 transition-all duration-500 ease-out cursor-pointer group"
                style={{
                  transform: `translate3d(${translateX}px, -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Artwork Container */}
                <div
                  className={`relative w-full h-full rounded-2xl overflow-hidden bg-zinc-900 border transition-all duration-300 shadow-2xl ${
                    isCurrentActive
                      ? "border-amber-500 ring-4 ring-amber-500/20 shadow-amber-500/20"
                      : "border-white/10 group-hover:border-white/30"
                  }`}
                >
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Reflection Overlay Effect */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none"
                  />

                  {/* Active Equalizer Motion Indicator */}
                  {isCurrentActive && isThisPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex items-end space-x-1.5 h-8 p-3 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-amber-500/40">
                        <span className="w-1.5 bg-amber-400 animate-pulse-bar-1" />
                        <span className="w-1.5 bg-amber-400 animate-pulse-bar-2" />
                        <span className="w-1.5 bg-amber-400 animate-pulse-bar-3" />
                        <span className="w-1.5 bg-amber-400 animate-pulse-bar-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Flow Reflection Effect below */}
                <div
                  className="w-full h-full mt-2 rounded-2xl overflow-hidden opacity-25 pointer-events-none transform scale-y-[-1] blur-[1px]"
                  style={{
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
                  }}
                >
                  <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Project Card Details & Controls Banner */}
      <div className="cinematic-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl bg-zinc-950/90">
        <div className="space-y-2 min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 border ${
                activeItem.category === "Screen"
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : activeItem.category === "Song"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  : "bg-purple-500/15 text-purple-300 border-purple-500/30"
              }`}
            >
              {activeItem.category === "Screen" && <Film size={12} />}
              {activeItem.category === "Song" && <Music size={12} />}
              {activeItem.category === "Ad" && <Tv size={12} />}
              {activeItem.category}
            </span>

            {activeItem.year && (
              <span className="text-xs font-mono text-zinc-500">{activeItem.year}</span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl font-light text-zinc-100 uppercase tracking-wide truncate">
            {activeItem.title}
          </h3>

          <p className="text-xs font-mono text-amber-400 uppercase tracking-wider">
            {activeItem.artist} • {activeItem.role}
          </p>

          {activeItem.description && (
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed line-clamp-2">
              {activeItem.description}
            </p>
          )}
        </div>

        {/* Action Controls for Selected Item */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-center justify-end flex-shrink-0">
          <button
            onClick={handlePlayCurrentItem}
            className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all hover:scale-105"
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
        </div>
      </div>

      {/* Scrubber Dots Indicator */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {items.map((it, idx) => (
          <button
            key={it.id}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === idx
                ? "w-8 bg-amber-500"
                : "w-2 bg-zinc-800 hover:bg-zinc-600"
            }`}
            aria-label={`Jump to cover ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
