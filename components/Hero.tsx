"use client";

import React, { useRef, useState } from "react";
import { useAudio } from "@/lib/context/AudioContext";
import { SongData } from "@/lib/mockData";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface HeroProps {
  name: string;
  tagline: string;
  featuredReels: SongData[];
}

export const Hero: React.FC<HeroProps> = ({ name, tagline, featuredReels }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const { currentTrack, isPlaying, playTrack } = useAudio();

  const currentReel = featuredReels[activeTrackIndex] || featuredReels[0];
  const isThisPlaying = currentTrack?.id === currentReel.id && isPlaying;

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 }
      )
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.7"
        )
        .fromTo(
          playerRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6"
        );
    },
    { scope: containerRef }
  );

  const handleNextTrack = () => {
    const nextIdx = (activeTrackIndex + 1) % featuredReels.length;
    setActiveTrackIndex(nextIdx);
    playTrack(featuredReels[nextIdx]);
  };

  const handlePrevTrack = () => {
    const prevIdx = (activeTrackIndex - 1 + featuredReels.length) % featuredReels.length;
    setActiveTrackIndex(prevIdx);
    playTrack(featuredReels[prevIdx]);
  };

  const handleSelectTrack = (idx: number) => {
    setActiveTrackIndex(idx);
    playTrack(featuredReels[idx]);
  };

  return (
    <section ref={containerRef} className="pt-36 pb-20 px-6 max-w-5xl mx-auto text-center">
      {/* Name */}
      <h1
        ref={nameRef}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-zinc-100 uppercase mb-6 font-serif"
      >
        {name}
      </h1>

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="text-base sm:text-xl md:text-2xl font-light tracking-widest text-zinc-400 max-w-3xl mx-auto uppercase mb-16"
      >
        {tagline}
      </p>

      {/* Featured Music Tab Player Card */}
      <div
        ref={playerRef}
        className="max-w-2xl mx-auto cinematic-card rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden space-y-6"
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-amber-700/5 to-transparent blur-2xl pointer-events-none opacity-50" />

        {/* Top Header & Track Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-500 uppercase">
            <Music size={14} />
            <span>FEATURED HIGHLIGHTS</span>
            <span className="text-zinc-600 font-normal">
              ({activeTrackIndex + 1} / {featuredReels.length})
            </span>
          </div>

          {/* Quick Track Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto justify-center">
            {featuredReels.map((reel, idx) => (
              <button
                key={reel.id}
                onClick={() => handleSelectTrack(idx)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase transition-all duration-300 ${
                  activeTrackIndex === idx
                    ? "bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20 scale-105"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-white/5"
                }`}
              >
                TRACK 0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Track Display & Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
          {/* Cover Art */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-xl group">
            <img
              src={currentReel.coverUrl}
              alt={currentReel.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {isThisPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="flex items-end space-x-1 h-6">
                  <span className="w-1 bg-amber-400 animate-pulse-bar-1" />
                  <span className="w-1 bg-amber-400 animate-pulse-bar-2" />
                  <span className="w-1 bg-amber-400 animate-pulse-bar-3" />
                  <span className="w-1 bg-amber-400 animate-pulse-bar-4" />
                </div>
              </div>
            )}
          </div>

          {/* Track Meta & Transport Buttons */}
          <div className="flex-grow w-full space-y-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block mb-2">
                {currentReel.artistName}
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-zinc-100 tracking-wide">
                {currentReel.title}
              </h3>
              <p className="text-xs text-zinc-400 font-light mt-0.5">
                {currentReel.role}
              </p>
            </div>

            {/* Music Player Transport Buttons (Prev, Play/Pause, Next) */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handlePrevTrack}
                className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
                aria-label="Previous Track"
                title="Previous Track"
              >
                <SkipBack size={16} fill="currentColor" />
              </button>

              <button
                onClick={() => playTrack(currentReel)}
                className="px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all hover:scale-105"
              >
                {isThisPlaying ? (
                  <>
                    <Pause size={15} fill="currentColor" /> PAUSE
                  </>
                ) : (
                  <>
                    <Play size={15} fill="currentColor" /> PLAY SONG
                  </>
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
                aria-label="Next Track"
                title="Next Track"
              >
                <SkipForward size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
