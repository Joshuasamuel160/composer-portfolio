"use client";

import React, { useRef, useEffect } from "react";
import { ScreenProjectData } from "@/lib/mockData";
import { useAudio } from "@/lib/context/AudioContext";
import { formatVideoEmbedUrl, isDirectVideoFile } from "@/lib/utils/formatVideoUrl";
import { X, Play, Pause, Music, ExternalLink } from "lucide-react";

interface FilmDetailModalProps {
  project: ScreenProjectData | null;
  onClose: () => void;
}

export const FilmDetailModal: React.FC<FilmDetailModalProps> = ({ project, onClose }) => {
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const embedUrl = project ? formatVideoEmbedUrl(project.videoUrl) : "";
  const isVideoFile = project ? isDirectVideoFile(project.videoUrl) : false;

  // Add Netflix-style autoplay with ?autoplay=1 for embeds
  const autoPlayEmbedUrl = embedUrl
    ? embedUrl.includes("?")
      ? `${embedUrl}&autoplay=1`
      : `${embedUrl}?autoplay=1`
    : "";

  // Netflix-style scroll listener: pause video when scrolled out of view
  useEffect(() => {
    if (!videoContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(videoContainerRef.current);
    return () => observer.disconnect();
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/50">
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

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top: Video Trailer / Clip Embed or HTML5 Video */}
          {embedUrl && (
            <div className="space-y-2" ref={videoContainerRef}>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg group">
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
                  <>
                    <iframe
                      src={autoPlayEmbedUrl}
                      title={project.title}
                      className="w-full h-full border-0 scale-[1.02] transition-transform"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                    {/* Top Mask Overlay to hide YouTube channel title bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-zinc-950/90 via-zinc-950/40 to-transparent pointer-events-none z-10" />
                  </>
                )}
              </div>
              {project.videoUrl && !isVideoFile && (
                <div className="flex justify-end">
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    Watch video directly on YouTube / External Link <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Role, Credits & Description */}
          <div className="space-y-2">
            <p className="text-xs text-amber-500 font-mono tracking-widest uppercase">
              {project.role}
            </p>

            {/* Film Credits Strip */}
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

            <p className="text-sm text-zinc-300 font-light leading-relaxed pt-1">
              {project.description}
            </p>
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
                  const isCuePlaying = currentTrack?.id === cueTrackId && isPlaying;

                  return (
                    <div
                      key={cue.id}
                      onClick={() =>
                        playTrack({
                          id: cueTrackId,
                          title: cue.title,
                          artist: project.title,
                          role: `${project.role} (${project.year})`,
                          coverUrl: project.posterUrl,
                          audioUrl: cue.audioUrl,
                          year: project.year,
                        })
                      }
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
