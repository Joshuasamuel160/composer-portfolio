"use client";

import React, { useEffect, useRef } from "react";
import { PortfolioItem } from "@/lib/sanity/fetch";
import { useAudio } from "@/lib/context/AudioContext";
import { X, Play, Pause, Film, Music } from "lucide-react";
import { formatVideoEmbedUrl, isDirectVideoFile } from "@/lib/utils/formatVideoUrl";

interface ProjectDetailModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { currentTrack, isPlaying, playMedia, togglePlay, currentTime, duration, seek } = useAudio();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isOpen = Boolean(project);

  const isThisPlaying =
    Boolean(currentTrack) &&
    Boolean(project) &&
    (currentTrack?.id === project?.id ||
      currentTrack?.title?.toLowerCase() === project?.title?.toLowerCase()) &&
    isPlaying;

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const isVideo = project.mediaType === "video" || Boolean(project.url && (project.url.includes("youtube") || project.url.includes("vimeo") || isDirectVideoFile(project.url)));
  const isDirectVideo = isVideo && isDirectVideoFile(project.url);

  const handleTogglePlay = () => {
    if (isThisPlaying) {
      togglePlay();
    } else {
      playMedia({
        id: project.id,
        title: project.title,
        artist: project.artist,
        role: project.role,
        mediaType: project.mediaType || "audio",
        url: project.url,
        posterUrl: project.coverUrl,
        coverUrl: project.coverUrl,
        year: project.year,
        category: project.category,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0C0C0D] border border-[#EDE8DE]/14 rounded-2xl shadow-2xl overflow-y-auto text-[#EDE8DE] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDE8DE]/14">
          <div>
            <span className="text-[10px] font-mono text-[#B8863B] uppercase tracking-widest font-semibold block mb-1">
              {project.category || (isVideo ? "FILM SCORE" : "MUSIC RELEASE")}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-light uppercase tracking-wide">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#131313] border border-[#EDE8DE]/14 text-[#C9C4B8] hover:text-[#EDE8DE] hover:bg-[#0C0C0D] transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media / Artwork Display */}
        <div className="relative w-full aspect-video bg-[#131313] overflow-hidden flex items-center justify-center border-b border-[#EDE8DE]/14">
          {isVideo ? (
            isDirectVideo ? (
              <video
                ref={videoRef}
                src={project.url}
                controls
                className="w-full h-full object-contain"
                poster={project.coverUrl}
              />
            ) : (
              <iframe
                src={formatVideoEmbedUrl(project.url)}
                title={project.title}
                className="w-full h-full border-0 object-contain"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={project.coverUrl}
                alt={project.title}
                className="w-full h-full object-cover opacity-40 filter blur-sm"
              />
              <img
                src={project.coverUrl}
                alt={project.title}
                className="absolute h-full object-contain max-w-full z-10 shadow-2xl"
              />
            </div>
          )}
        </div>

        {/* Details & Interactive Audio Transport Bar */}
        <div className="p-6 space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#C9C4B8]">
            <div>
              <span className="text-[#8C8A80]">ROLE:</span> {project.role}
            </div>
            <div>
              <span className="text-[#8C8A80]">CLIENT / PRODUCTION:</span> {project.artist}
            </div>
            {project.year && (
              <div>
                <span className="text-[#8C8A80]">YEAR:</span> {project.year}
              </div>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm sm:text-base font-sans font-light text-[#C9C4B8] leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Non-Autoplay Audio Player Transport */}
          {project.url && (
            <div className="p-4 rounded-xl bg-[#131313] border border-[#EDE8DE]/14 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleTogglePlay}
                  className="px-5 py-2.5 rounded-full bg-[#B8863B] text-[#0C0C0D] font-sans text-xs tracking-widest uppercase font-medium flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                >
                  {isThisPlaying ? (
                    <>
                      <Pause size={16} fill="currentColor" /> PAUSE AUDIO
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="currentColor" className="ml-0.5" /> PLAY AUDIO CUE
                    </>
                  )}
                </button>

                <div className="text-xs font-mono text-[#8C8A80]">
                  {isThisPlaying ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "0:00"}
                </div>
              </div>

              {/* Progress Scrubber */}
              {isThisPlaying && duration > 0 && (
                <div
                  className="w-full bg-[#0C0C0D] h-2 rounded-full overflow-hidden cursor-pointer border border-[#EDE8DE]/14"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    if (duration) seek(pct * duration);
                  }}
                >
                  <div
                    className="bg-[#B8863B] h-full rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Score Cues (if available) */}
          {project.scoreCues && project.scoreCues.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono text-[#8C8A80] uppercase tracking-widest">
                RELEVANT SCORE CUES
              </h4>
              <div className="space-y-2">
                {project.scoreCues.map((cue) => (
                  <div
                    key={cue.id}
                    onClick={() =>
                      playMedia({
                        id: cue.id,
                        title: `${project.title} - ${cue.title}`,
                        artist: project.artist,
                        role: project.role,
                        mediaType: "audio",
                        url: cue.audioUrl,
                        coverUrl: project.coverUrl,
                        year: project.year,
                      })
                    }
                    className="flex items-center justify-between p-3 rounded-lg bg-[#131313] hover:bg-[#0C0C0D] border border-[#EDE8DE]/14 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Music size={16} className="text-[#B8863B]" />
                      <span className="text-xs font-sans text-[#EDE8DE] group-hover:text-[#B8863B] transition-colors">
                        {cue.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#8C8A80]">{cue.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
