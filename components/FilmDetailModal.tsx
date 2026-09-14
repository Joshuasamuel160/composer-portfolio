"use client";

import React, { useRef, useEffect, useState } from "react";
import { ScreenProjectData } from "@/lib/mockData";
import { useAudio } from "@/lib/context/AudioContext";
import { formatVideoEmbedUrl, isDirectVideoFile } from "@/lib/utils/formatVideoUrl";
import { X, Play, Pause, Music, Tv, ExternalLink } from "lucide-react";

interface FilmDetailModalProps {
  project: ScreenProjectData | null;
  onClose: () => void;
}

export const FilmDetailModal: React.FC<FilmDetailModalProps> = ({ project, onClose }) => {
  const { currentItem, isPlaying, playMedia, togglePlay } = useAudio();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const modalOverlayRef = useRef<HTMLDivElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const embedUrl = project ? formatVideoEmbedUrl(project.videoUrl) : "";
  const isVideoFile = project ? isDirectVideoFile(project.videoUrl) : false;

  const autoPlayEmbedUrl = embedUrl
    ? embedUrl.includes("?")
      ? `${embedUrl}&autoplay=1&mute=0`
      : `${embedUrl}?autoplay=1&mute=0`
    : "";

  useEffect(() => {
    if (project) {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      if (modalOverlayRef.current) {
        modalOverlayRef.current.scrollTop = 0;
      }
    }
  }, [project]);

  useEffect(() => {
    if (project && isPlaying && embedUrl) {
      togglePlay();
    }
    setIsDescriptionExpanded(false);
  }, [project]);

  const handlePlayInPersistentPlayer = () => {
    if (!project || !project.videoUrl) return;
    if (videoRef.current) videoRef.current.pause();

    playMedia({
      id: `screen-video-${project.id}`,
      title: project.title,
      artist: project.productionCompany || project.director || "Joshua Samuel",
      role: `${project.role} (${project.year})`,
      mediaType: "video",
      url: project.videoUrl,
      posterUrl: project.posterUrl,
      year: project.year,
      category: "Screen",
      scoreCues: project.scoreCues,
    });
    onClose();
  };

  const handlePlayScoreCue = (cue: { id: string; title: string; duration: string; audioUrl: string }) => {
    if (!project) return;

    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }

    const cueQueue = (project.scoreCues || []).map((c) => ({
      id: `${project.id}-${c.id}`,
      title: c.title,
      artist: project.title,
      role: `${project.role} (${project.year})`,
      mediaType: "audio" as const,
      url: c.audioUrl,
      posterUrl: project.posterUrl,
      audioUrl: c.audioUrl,
      year: project.year,
    }));

    const cueTrackId = `${project.id}-${cue.id}`;
    const targetTrack = cueQueue.find((t) => t.id === cueTrackId) || cueQueue[0];

    playMedia(targetTrack, cueQueue);
  };

  if (!project) return null;

  return (
    <div
      ref={modalOverlayRef}
      onClick={() => {
        if (videoRef.current) videoRef.current.pause();
        onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-scroll bg-black/90 backdrop-blur-md p-4 sm:p-6 sm:py-12 flex justify-center items-start"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-auto text-left"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest border ${
                project.category === "Cinema"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : project.category === "YouTube"
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : "bg-purple-500/20 text-purple-300 border-purple-500/30"
              }`}
            >
              {project.category}
            </span>
            <h3 className="text-base sm:text-lg font-light text-zinc-100 uppercase tracking-wide truncate">
              {project.title} ({project.year})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {project.videoUrl && (
              <button
                onClick={handlePlayInPersistentPlayer}
                className="px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                title="Keep playing trailer while browsing other pages"
              >
                <Tv size={12} /> PIP PLAYER
              </button>
            )}
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.pause();
                onClose();
              }}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Top: Video Trailer OR Clean Film Poster */}
          {embedUrl ? (
            <div className="space-y-2" ref={videoContainerRef}>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg flex items-center justify-center">
                {isVideoFile ? (
                  <video
                    ref={videoRef}
                    src={embedUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <iframe
                    src={autoPlayEmbedUrl}
                    title={project.title}
                    className="w-full h-full border-0 object-contain"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg flex items-center justify-center">
                <img
                  src={project.posterUrl}
                  alt={project.title}
                  className="w-full h-full object-contain bg-black"
                />
              </div>
            </div>
          )}

          {/* Role, Credits & Description */}
          <div className="space-y-2">
            <p className="text-xs text-amber-500 font-mono tracking-widest uppercase">
              {project.role}
            </p>

            {(project.director || project.executiveProducer || project.productionCompany) && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-mono text-zinc-400 py-2 border-y border-white/5">
                {project.director && (
                  <span>
                    <strong className="text-zinc-200 uppercase font-normal">DIR:</strong> {project.director}
                  </span>
                )}
                {project.executiveProducer && (
                  <span>
                    <strong className="text-zinc-200 uppercase font-normal">EP:</strong> {project.executiveProducer}
                  </span>
                )}
                {project.productionCompany && (
                  <span>
                    <strong className="text-zinc-200 uppercase font-normal">STUDIO:</strong> {project.productionCompany}
                  </span>
                )}
              </div>
            )}

            {project.description && (
              <div className="space-y-1 pt-1">
                <p
                  className={`text-sm text-zinc-300 font-light leading-relaxed transition-all duration-300 ${
                    !isDescriptionExpanded ? "line-clamp-2" : ""
                  }`}
                >
                  {project.description}
                </p>
                {project.description.length > 100 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 underline underline-offset-4 focus:outline-none transition-colors"
                  >
                    {isDescriptionExpanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Under Video: Film Score Cues Playlist */}
          {project.scoreCues && project.scoreCues.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2">
                  <Music size={14} /> FILM SCORE CUES
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {project.scoreCues.length} TRACKS AVAILABLE
                </span>
              </div>

              <div className="space-y-2">
                {project.scoreCues.map((cue) => {
                  const cueTrackId = `${project.id}-${cue.id}`;
                  const isCuePlaying = currentItem?.id === cueTrackId && isPlaying;

                  return (
                    <div
                      key={cue.id}
                      onClick={() => handlePlayScoreCue(cue)}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-xs sm:text-sm cursor-pointer transition-all duration-200 ${
                        isCuePlaying
                          ? "bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10"
                          : "bg-zinc-900/80 border-white/5 text-zinc-300 hover:bg-zinc-900 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            isCuePlaying ? "bg-amber-500 text-zinc-950" : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {isCuePlaying ? (
                            <Pause size={14} fill="currentColor" />
                          ) : (
                            <Play size={14} fill="currentColor" className="ml-0.5" />
                          )}
                        </div>
                        <span className="truncate font-light">{cue.title}</span>
                      </div>

                      <span className="font-mono text-xs text-zinc-500 flex-shrink-0 ml-3">
                        {cue.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
