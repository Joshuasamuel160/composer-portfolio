"use client";

import React, { useState } from "react";
import { PortfolioItem } from "@/lib/sanity/fetch";
import { ProjectDetailModal } from "./ProjectDetailModal";

interface SelectedWorkProps {
  items: PortfolioItem[];
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ items }) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Ensure Onobiren & Meltdown are prioritized at the top of Selected Work grid
  const prioritizeItems = (list: PortfolioItem[]) => {
    if (!list || list.length === 0) return [];

    const onobiren = list.find((it) => it.title.toLowerCase().includes("onobiren")) || {
      id: "sel-onobiren",
      title: "ONOBIREN",
      artist: "Laju Iren Films",
      role: "Film Score · Sound Design",
      category: "Screen" as const,
      coverUrl: "https://cdn.sanity.io/images/50173b3c/production/b9c22afc4357fd8509578a5bd41cb036a3df2baf-1440x1920.webp",
      year: "2026",
      description: "Original motion picture score and cinematic sound design for Laju Iren Films.",
      mediaType: "audio" as const,
      url: "https://raw.githubusercontent.com/goldfire/howler.js/master/examples/player/audio/rave_digger.mp3",
    };

    const meltdown = list.find((it) => it.title.toLowerCase().includes("meltdown")) || {
      id: "sel-meltdown",
      title: "MELTDOWN",
      artist: "Film Production",
      role: "Film Score",
      category: "Screen" as const,
      coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200",
      year: "2025",
      description: "Dramatic orchestral motion picture score.",
      mediaType: "audio" as const,
      url: "https://raw.githubusercontent.com/goldfire/howler.js/master/examples/player/audio/80s_vibe.mp3",
    };

    const remaining = list.filter(
      (it) =>
        !it.title.toLowerCase().includes("onobiren") &&
        !it.title.toLowerCase().includes("meltdown")
    );

    return [onobiren, meltdown, ...remaining].slice(0, 6);
  };

  const selectedList = prioritizeItems(items);

  return (
    <section id="work" className="py-16 sm:py-24 px-6 max-w-7xl mx-auto select-none">
      {/* Editorial Header */}
      <div className="mb-12 text-left space-y-2 border-b border-[#EDE8DE]/14 pb-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#EDE8DE] uppercase tracking-wider">
          SELECTED WORK
        </h2>
        <p className="text-xs sm:text-sm font-sans text-[#8C8A80] tracking-wide">
          A selection of film, sound and music projects.
        </p>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {selectedList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedProject(item)}
            className="group cursor-pointer space-y-3 flex flex-col transition-all duration-300"
          >
            {/* Project Artwork / Film Still */}
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#131313] border border-[#EDE8DE]/14 transition-all duration-300 group-hover:border-[#B8863B]/60 group-hover:shadow-2xl">
              <img
                src={item.coverUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Project Meta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-[#8C8A80]">
                <span>{item.year || "2025"}</span>
                <span className="uppercase tracking-widest text-[#B8863B] text-[10px]">
                  {item.category === "Screen" ? "FILM SCORE" : item.category === "Ad" ? "COMMERCIAL" : "SONG"}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-light text-[#EDE8DE] uppercase tracking-wide group-hover:text-[#B8863B] transition-colors truncate">
                {item.title}
              </h3>

              <p className="text-xs font-sans text-[#C9C4B8] truncate">
                {item.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal View */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
