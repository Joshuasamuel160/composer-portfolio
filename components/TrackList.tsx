"use client";

import React, { useRef, useEffect, useState } from "react";
import { SongData } from "@/lib/mockData";
import { useAudio } from "@/lib/context/AudioContext";
import { Play, Pause, Music } from "lucide-react";
import gsap from "gsap";

interface TrackListProps {
  songs: SongData[];
  selectedArtistId: string | null;
}

export const TrackList: React.FC<TrackListProps> = ({ songs, selectedArtistId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedSongs, setDisplayedSongs] = useState<SongData[]>(songs);
  const { currentTrack, isPlaying, playTrack } = useAudio();

  useEffect(() => {
    if (!containerRef.current) return;

    // Quick GSAP fade out -> update list -> fade in
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        const filtered = selectedArtistId
          ? songs.filter((s) => s.artistId === selectedArtistId)
          : songs;
        setDisplayedSongs(filtered);

        gsap.to(containerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        });
      },
    });
  }, [selectedArtistId, songs]);

  if (displayedSongs.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-500 font-light">
        No tracks found for this selected artist.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {displayedSongs.map((song) => {
        const isCurrentPlaying = currentTrack?.id === song.id && isPlaying;

        return (
          <div
            key={song.id}
            className={`cinematic-card rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-300 group ${
              isCurrentPlaying ? "border-amber-500/40 bg-amber-950/10" : ""
            }`}
          >
            {/* Left Cover & Meta */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10 group-hover:border-amber-500/30 transition-colors">
                {song.coverUrl ? (
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    <Music size={20} />
                  </div>
                )}
                <button
                  onClick={() => playTrack(song)}
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    isCurrentPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  aria-label={`Play ${song.title}`}
                >
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-lg">
                    {isCurrentPlaying ? (
                      <Pause size={16} fill="currentColor" />
                    ) : (
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    )}
                  </div>
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-light text-zinc-100 truncate tracking-wide">
                    {song.title}
                  </h4>
                  {isCurrentPlaying && (
                    <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      PLAYING
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-light truncate">
                  <span className="text-zinc-200 font-medium">{song.artistName}</span>
                  <span className="mx-2 text-zinc-600">•</span>
                  <span>{song.role}</span>
                </p>
              </div>
            </div>

            {/* Right Release Year & Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline-block">
                {song.releaseYear}
              </span>
              <button
                onClick={() => playTrack(song)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all ${
                  isCurrentPlaying
                    ? "bg-amber-500 text-zinc-950"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10"
                }`}
              >
                {isCurrentPlaying ? "PAUSE" : "LISTEN"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
