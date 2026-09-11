"use client";

import React, { useState } from "react";
import { AlbumData, SongData } from "@/lib/mockData";
import { useAudio } from "@/lib/context/AudioContext";
import { Play, Pause, Music, Disc, ChevronDown, ChevronUp } from "lucide-react";

interface SongsClientProps {
  albums: AlbumData[];
  songs: SongData[];
}

export const SongsClient: React.FC<SongsClientProps> = ({ albums, songs }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStudio, setSelectedStudio] = useState<string>("ALL");
  const [expandedAlbumId, setExpandedAlbumId] = useState<string | null>(albums[0]?.id || null);
  const { currentTrack, isPlaying, playTrack } = useAudio();

  // Extract unique Film Companies / Studios / Artists
  const uniqueStudios = Array.from(new Set(albums.map((a) => a.artistName))).filter(Boolean);

  // Filter Albums by Category & Studio
  const filteredAlbums = albums.filter((alb) => {
    const matchesCategory =
      selectedCategory === "ALL"
        ? true
        : selectedCategory === "SOUNDTRACKS"
        ? alb.category === "Film Soundtrack"
        : alb.category !== "Film Soundtrack";

    const matchesStudio = selectedStudio === "ALL" || alb.artistName === selectedStudio;

    return matchesCategory && matchesStudio;
  });

  const toggleAlbumExpand = (id: string) => {
    setExpandedAlbumId(expandedAlbumId === id ? null : id);
  };

  return (
    <div className="space-y-10">
      {/* Category & Studio Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-white/5">
        {/* Left Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: "ALL", label: "ALL DISCOGRAPHY" },
            { id: "SOUNDTRACKS", label: "FILM SOUNDTRACKS" },
            { id: "ALBUMS", label: "ALBUMS & EPs" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex-shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-zinc-950 font-semibold shadow-lg shadow-amber-500/20"
                  : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Studio / Company Filter Dropdown */}
        {uniqueStudios.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
              ARTIST / STUDIO:
            </span>
            <select
              value={selectedStudio}
              onChange={(e) => setSelectedStudio(e.target.value)}
              className="bg-zinc-900 text-xs font-mono text-zinc-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50"
            >
              <option value="ALL">ALL STUDIOS & ARTISTS ({uniqueStudios.length})</option>
              {uniqueStudios.map((studio) => (
                <option key={studio} value={studio}>
                  {studio}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Album & Soundtrack Grid */}
      {filteredAlbums.length === 0 ? (
        <div className="py-20 text-center text-zinc-500 font-light font-mono">
          No albums or soundtracks found for this selected filter.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredAlbums.map((album) => {
            const isExpanded = expandedAlbumId === album.id;
            const hasTracks = album.tracks && album.tracks.length > 0;

            return (
              <div
                key={album.id}
                className={`cinematic-card rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isExpanded ? "border-amber-500/40 bg-zinc-950/80" : "border-white/5 bg-zinc-950/40 hover:border-white/20"
                }`}
              >
                {/* Album Header Banner */}
                <div
                  onClick={() => toggleAlbumExpand(album.id)}
                  className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer group"
                >
                  {/* Cover Artwork & Titles */}
                  <div className="flex items-center gap-6 min-w-0">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10 group-hover:border-amber-500/30 transition-all shadow-xl">
                      {album.coverUrl ? (
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Disc size={32} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {album.category}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">
                          {album.releaseYear}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-light text-zinc-100 uppercase tracking-wide group-hover:text-amber-400 transition-colors truncate">
                        {album.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-amber-500/90 font-mono tracking-wider uppercase">
                        {album.artistName}
                      </p>
                    </div>
                  </div>

                  {/* Right Track Count & Expand Button */}
                  <div className="flex items-center gap-4 sm:flex-shrink-0 self-end sm:self-center">
                    <span className="text-xs font-mono text-zinc-400">
                      {album.tracks.length} {album.tracks.length === 1 ? "TRACK" : "TRACKS"}
                    </span>

                    <button
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                        isExpanded
                          ? "bg-amber-500 text-zinc-950 border-amber-500"
                          : "bg-zinc-900 text-zinc-400 border-white/10 group-hover:border-white/30 group-hover:text-white"
                      }`}
                      aria-label="Toggle album tracks"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Dropdown Tracklist for Album */}
                {isExpanded && hasTracks && (
                  <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-white/5 space-y-3 bg-zinc-900/30">
                    <div className="flex items-center justify-between py-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      <span>TRACK TITLE</span>
                      <span>ROLE & DURATION</span>
                    </div>

                    <div className="space-y-2">
                      {album.tracks.map((track) => {
                        const trackGlobalId = track.id.startsWith("cue-") || track.id.includes("-") ? track.id : `alb-${album.id}-${track.id}`;
                        const isCurrentPlaying = currentTrack?.id === trackGlobalId && isPlaying;

                        return (
                          <div
                            key={track.id}
                            onClick={() =>
                              playTrack({
                                id: trackGlobalId,
                                title: track.title,
                                artist: album.artistName,
                                role: track.role,
                                coverUrl: album.coverUrl,
                                audioUrl: track.audioUrl,
                                year: album.releaseYear,
                              })
                            }
                            className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all duration-200 ${
                              isCurrentPlaying
                                ? "bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10"
                                : "bg-zinc-900/90 border-white/5 text-zinc-300 hover:bg-zinc-900 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isCurrentPlaying ? "bg-amber-500 text-zinc-950" : "bg-zinc-800 text-zinc-300"
                                }`}
                              >
                                {isCurrentPlaying ? (
                                  <Pause size={14} fill="currentColor" />
                                ) : (
                                  <Play size={14} fill="currentColor" className="ml-0.5" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="font-light truncate text-zinc-100">{track.title}</p>
                                <p className="text-[11px] text-zinc-500 font-mono sm:hidden">{track.role}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                              <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
                                {track.role}
                              </span>
                              {track.duration && (
                                <span className="font-mono text-xs text-zinc-500">
                                  {track.duration}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
