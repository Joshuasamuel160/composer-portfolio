"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Project } from "@/lib/sanity/fetch";
import { useAudio, PlaylistItem } from "@/lib/context/AudioContext";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface ReelTimelineProps {
  projects: Project[];
}

function formatSecondsToMinSec(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const ReelTimeline: React.FC<ReelTimelineProps> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  // Pointer/Touch swipe refs
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const lastDxRef = useRef(0);

  const { currentTrack, isPlaying, currentTime, duration, playMedia, togglePlay } = useAudio();

  const N = projects.length;
  const activeProject = projects[activeIndex] || projects[0];

  const isThisPlaying =
    Boolean(currentTrack) &&
    Boolean(activeProject) &&
    (currentTrack?.id === activeProject?.id ||
      currentTrack?.title?.toLowerCase() === activeProject?.title?.toLowerCase()) &&
    isPlaying;

  // Handle active index change & auto-play if previously playing
  const handleSelectIndex = useCallback(
    (index: number) => {
      if (N === 0) return;
      const targetIndex = (index + N) % N;
      setActiveIndex(targetIndex);

      const target = projects[targetIndex];
      if (target && target.audioPreviewUrl) {
        const queueList: PlaylistItem[] = projects.map((p) => ({
          id: p.id,
          title: p.title,
          artist: p.client,
          role: p.role,
          mediaType: p.mediaType || "audio",
          url: p.audioPreviewUrl || "",
          coverUrl: p.coverImage,
          year: p.year,
        }));

        const item: PlaylistItem = {
          id: target.id,
          title: target.title,
          artist: target.client,
          role: target.role,
          mediaType: target.mediaType || "audio",
          url: target.audioPreviewUrl,
          coverUrl: target.coverImage,
          year: target.year,
        };

        if (isPlaying) {
          playMedia(item, queueList);
        }
      }
    },
    [N, projects, isPlaying, playMedia]
  );

  const handlePrev = useCallback(() => {
    handleSelectIndex(activeIndex - 1);
  }, [activeIndex, handleSelectIndex]);

  const handleNext = useCallback(() => {
    handleSelectIndex(activeIndex + 1);
  }, [activeIndex, handleSelectIndex]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && ["INPUT", "TEXTAREA", "SELECT"].includes(activeEl.tagName)) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === " " && document.activeElement === stageRef.current) {
        e.preventDefault();
        handleTogglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Swipe / Drag physics
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    lastDxRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    lastDxRef.current = e.clientX - startXRef.current;
  };

  const handlePointerUp = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    const dx = lastDxRef.current;
    if (Math.abs(dx) > 30) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Trigger Play Cue
  const handleTogglePlay = () => {
    if (!activeProject || !activeProject.audioPreviewUrl) return;

    if (isThisPlaying) {
      togglePlay();
    } else {
      const queueList: PlaylistItem[] = projects.map((p) => ({
        id: p.id,
        title: p.title,
        artist: p.client,
        role: p.role,
        mediaType: p.mediaType || "audio",
        url: p.audioPreviewUrl || "",
        coverUrl: p.coverImage,
        year: p.year,
      }));

      const item: PlaylistItem = {
        id: activeProject.id,
        title: activeProject.title,
        artist: activeProject.client,
        role: activeProject.role,
        mediaType: activeProject.mediaType || "audio",
        url: activeProject.audioPreviewUrl,
        coverUrl: activeProject.coverImage,
        year: activeProject.year,
      };

      playMedia(item, queueList);
    }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 select-none flex flex-col items-center">
      {/* 3D PERSPECTIVE REEL STAGE */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="region"
        aria-label="Interactive Project Reel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[360px] sm:h-[440px] md:h-[480px] flex items-center justify-center overflow-visible touch-pan-y cursor-grab active:cursor-grabbing rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#B8863B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0C0C0D] transition-shadow"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Subtle Brass Ambient Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#B8863B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Reel Covers Track */}
        <div className="relative w-full h-full flex items-center justify-center overflow-visible">
          {projects.map((proj, idx) => {
            let offset = idx - activeIndex;
            if (N > 0) {
              if (offset > N / 2) offset -= N;
              if (offset < -N / 2) offset += N;
            }

            const absOffset = Math.abs(offset);
            const isVisible = absOffset <= 2;
            if (!isVisible) return null;

            const isCenter = offset === 0;

            // 3D positioning calculations
            const translateX = offset * (typeof window !== "undefined" && window.innerWidth < 640 ? 140 : 210);
            const translateZ = isCenter ? 0 : -180 - (absOffset - 1) * 60;
            const rotateY = isCenter ? 0 : offset > 0 ? -32 : 32;
            const scale = isCenter ? 1 : 0.82;
            const opacity = isCenter ? 1 : absOffset === 1 ? 0.45 : 0.2;
            const zIndex = 20 - absOffset;

            return (
              <div
                key={proj.id}
                onClick={() => handleSelectIndex(idx)}
                className="absolute top-1/2 left-1/2 -mt-36 sm:-mt-44 md:-mt-52 -ml-28 sm:-ml-36 md:-ml-44 w-56 h-72 sm:w-72 sm:h-88 md:w-88 md:h-[400px] cursor-pointer transition-all duration-500 ease-out group"
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className={`relative w-full h-full rounded-2xl overflow-hidden bg-[#131313] border transition-all duration-300 shadow-2xl ${
                    isCenter
                      ? "border-[#B8863B]/80 ring-1 ring-[#B8863B]/40 shadow-2xl shadow-black/80"
                      : "border-[#EDE8DE]/14 group-hover:border-[#EDE8DE]/40"
                  }`}
                >
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0D] via-transparent to-transparent opacity-60" />

                  {/* Play Indicator on Active Center Card */}
                  {isCenter && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePlay();
                        }}
                        className="w-14 h-14 rounded-full bg-[#B8863B] text-[#0C0C0D] flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
                      >
                        {isThisPlaying ? (
                          <Pause size={22} fill="currentColor" />
                        ) : (
                          <Play size={22} fill="currentColor" className="ml-0.5" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE PROJECT METADATA PANEL */}
      <div className="mt-8 text-center space-y-2 max-w-xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#EDE8DE] tracking-wide">
          {activeProject.title}
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#C9C4B8] tracking-widest uppercase">
          {activeProject.role} <span className="text-[#8C8A80] mx-1">·</span> {activeProject.client}{" "}
          <span className="text-[#8C8A80] mx-1">·</span> {activeProject.year}
        </p>
      </div>

      {/* DAW TIMELINE SCRUBBER & TIMECODE READOUT */}
      <div className="w-full max-w-2xl mt-8 px-2 space-y-3">
        {/* Scrubber Line Track */}
        <div className="relative w-full h-8 flex items-center">
          {/* Base Track Line */}
          <div className="absolute inset-x-0 h-[1.5px] bg-[#EDE8DE]/14 rounded-full" />

          {/* Tick Marks for Each Project */}
          <div className="absolute inset-x-0 flex items-center justify-between px-1">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleSelectIndex(i)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`w-2.5 h-2.5 rounded-full flex items-center justify-center transition-all ${
                  i === activeIndex ? "scale-125" : "hover:scale-110"
                }`}
                title={p.title}
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === activeIndex
                      ? "w-2.5 h-2.5 bg-[#B8863B] shadow-md shadow-[#B8863B]/50"
                      : "w-1.5 h-1.5 bg-[#8C8A80]/60 hover:bg-[#C9C4B8]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Diegetic Timecode Readouts (IBM Plex Mono) */}
        <div className="flex items-center justify-between text-xs font-mono text-[#8C8A80] px-1 tracking-widest">
          <span>{isThisPlaying ? formatSecondsToMinSec(currentTime) : "00:00"}</span>
          <span>{activeProject.duration}</span>
        </div>
      </div>

      {/* TRANSPORT CONTROLS ROW */}
      <div className="mt-6 flex items-center gap-6">
        {/* Prev Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-10 h-10 rounded-full border border-[#EDE8DE]/14 hover:border-[#B8863B]/60 text-[#C9C4B8] hover:text-[#EDE8DE] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Previous Project"
        >
          <ChevronLeft size={18} />
        </button>

        {/* PLAY CUE Pill Button */}
        <button
          onClick={handleTogglePlay}
          onPointerDown={(e) => e.stopPropagation()}
          className="px-6 py-2.5 rounded-full border border-[#B8863B] bg-[#131313] hover:bg-[#B8863B]/10 text-[#EDE8DE] font-sans text-xs tracking-widest uppercase font-medium flex items-center gap-2.5 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isThisPlaying ? "bg-[#B8863B] animate-pulse" : "bg-[#8A682F]"
            }`}
          />
          {isThisPlaying ? "PAUSE CUE" : "PLAY CUE"}
        </button>

        {/* Next Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-10 h-10 rounded-full border border-[#EDE8DE]/14 hover:border-[#B8863B]/60 text-[#C9C4B8] hover:text-[#EDE8DE] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Next Project"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};
