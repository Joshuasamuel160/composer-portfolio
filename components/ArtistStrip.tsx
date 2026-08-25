"use client";

import React, { useRef } from "react";
import { ArtistData } from "@/lib/mockData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ArtistStripProps {
  artists: ArtistData[];
  selectedArtistId: string | null;
  onSelectArtist: (artistId: string | null) => void;
}

export const ArtistStrip: React.FC<ArtistStripProps> = ({
  artists,
  selectedArtistId,
  onSelectArtist,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll(".artist-badge");

      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="py-4 mb-8 border-b border-white/5">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* All Artists Reset Button */}
        <button
          onClick={() => onSelectArtist(null)}
          className={`artist-badge px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
            selectedArtistId === null
              ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 scale-105"
              : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20"
          }`}
        >
          ALL ARTISTS
        </button>

        {/* Individual Artist Badges */}
        {artists.map((artist) => {
          const isSelected = selectedArtistId === artist.id;
          return (
            <button
              key={artist.id}
              onClick={() => onSelectArtist(artist.id)}
              className={`artist-badge flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 ${
                isSelected
                  ? "bg-amber-500/10 border-amber-500 text-amber-400 scale-105 shadow-md shadow-amber-500/10"
                  : "grayscale-strip-item bg-zinc-900/60 border-white/5 text-zinc-300"
              }`}
            >
              {artist.photoUrl && (
                <img
                  src={artist.photoUrl}
                  alt={artist.name}
                  className="w-7 h-7 rounded-full object-cover border border-white/10"
                />
              )}
              <span className="text-xs tracking-wider uppercase font-medium">
                {artist.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
