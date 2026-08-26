"use client";

import React, { useState } from "react";
import { ScreenProjectData } from "@/lib/mockData";
import { FilmDetailModal } from "./FilmDetailModal";
import { Play, Film, Music } from "lucide-react";

interface ScreenGridProps {
  projects: ScreenProjectData[];
}

export const ScreenGrid: React.FC<ScreenGridProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<ScreenProjectData | null>(null);
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  const toggleCardExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Don't trigger modal pop-up when toggling read more
    setExpandedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Clean Film Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="cinematic-card rounded-3xl overflow-hidden flex flex-col group border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            {/* Poster / Still Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
              <img
                src={project.posterUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Category Badge: Cinema vs YouTube vs Custom */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest backdrop-blur-md border ${
                    project.category === "Cinema"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : project.category === "YouTube"
                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                      : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  }`}
                >
                  <Film size={12} />
                  {project.category}
                </span>
              </div>

              {/* Play / View Overlay Button */}
              <div className="absolute inset-0 flex items-center justify-center group/btn">
                <div className="w-14 h-14 rounded-full bg-amber-500/90 text-zinc-950 flex items-center justify-center shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover/btn:scale-110">
                  <Play size={24} fill="currentColor" className="ml-1" />
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xl sm:text-2xl font-light text-zinc-100 uppercase tracking-wide group-hover:text-amber-400 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">{project.year}</span>
                </div>
                <p className="text-xs text-amber-500 font-medium tracking-wider uppercase mb-3">
                  {project.role}
                </p>

                {/* Description with Read More / Show Less Toggle */}
                {project.description && (
                  <div className="space-y-1">
                    <p
                      className={`text-sm text-zinc-400 font-light leading-relaxed transition-all duration-300 ${
                        !expandedCardIds[project.id] ? "line-clamp-2" : ""
                      }`}
                    >
                      {project.description}
                    </p>
                    {project.description.length > 90 && (
                      <button
                        onClick={(e) => toggleCardExpand(e, project.id)}
                        className="text-xs font-mono text-amber-400 hover:text-amber-300 underline underline-offset-4 focus:outline-none transition-colors"
                      >
                        {expandedCardIds[project.id] ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-zinc-300 group-hover:text-amber-400 transition-colors">
                  WATCH TRAILER & LISTEN TO SCORE →
                </span>
                {project.scoreCues && project.scoreCues.length > 0 && (
                  <span className="text-[10px] font-mono text-amber-400/80 flex items-center gap-1">
                    <Music size={12} /> {project.scoreCues.length} CUES
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Film Detail Modal: Shows Trailer Video + Score Cues Directly Beneath It */}
      <FilmDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};
