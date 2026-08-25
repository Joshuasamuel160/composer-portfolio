"use client";

import React from "react";
import { formatVideoEmbedUrl } from "@/lib/utils/formatVideoUrl";
import { X, ExternalLink } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  title: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  videoUrl,
  title,
  onClose,
}) => {
  if (!isOpen) return null;

  const embedUrl = formatVideoEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-base font-light text-zinc-100 uppercase tracking-widest truncate">
            {title} — TRAILER / CLIP
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Close video player"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Embed Container */}
        <div className="p-4 space-y-3">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          {videoUrl && (
            <div className="flex justify-end px-2">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-amber-400 transition-colors"
              >
                Watch video directly on YouTube / External Link <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
