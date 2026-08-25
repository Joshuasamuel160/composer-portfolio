"use client";

import React, { useState } from "react";
import { AdCampaignData } from "@/lib/mockData";
import { VideoModal } from "./VideoModal";
import { Play } from "lucide-react";

interface AdsGridProps {
  ads: AdCampaignData[];
}

export const AdsGrid: React.FC<AdsGridProps> = ({ ads }) => {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="cinematic-card rounded-3xl overflow-hidden flex flex-col group border border-white/5 hover:border-white/20 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
              <img
                src={ad.thumbnailUrl}
                alt={ad.brandName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Play Commercial Spot Overlay Button */}
              {ad.videoUrl && (
                <button
                  onClick={() => setActiveVideo({ url: ad.videoUrl, title: ad.brandName })}
                  className="absolute inset-0 flex items-center justify-center group/btn"
                  aria-label={`Watch commercial spot for ${ad.brandName}`}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/90 text-zinc-950 flex items-center justify-center shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover/btn:scale-110">
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  </div>
                </button>
              )}
            </div>

            {/* Content Details */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-lg font-light text-zinc-100 uppercase tracking-wide mb-2">
                  {ad.brandName}
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {ad.description}
                </p>
              </div>

              {ad.videoUrl && (
                <button
                  onClick={() => setActiveVideo({ url: ad.videoUrl, title: ad.brandName })}
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors pt-2"
                >
                  PLAY SPOT →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <VideoModal
        isOpen={!!activeVideo}
        videoUrl={activeVideo?.url || ""}
        title={activeVideo?.title || ""}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
};
