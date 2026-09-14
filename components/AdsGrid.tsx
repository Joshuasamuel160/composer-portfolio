"use client";

import React from "react";
import { AdCampaignData } from "@/lib/mockData";
import { useAudio } from "@/lib/context/AudioContext";
import { Play, Sparkles } from "lucide-react";

interface AdsGridProps {
  ads: AdCampaignData[];
}

export const AdsGrid: React.FC<AdsGridProps> = ({ ads }) => {
  const { startReel, playMedia } = useAudio();

  const handleStartAdsReel = () => {
    const adQueue = ads.map((ad) => ({
      id: `ad-reel-${ad.id}`,
      title: ad.brandName,
      artist: "Commercial Campaign",
      role: ad.description,
      mediaType: "video" as const,
      url: ad.videoUrl,
      posterUrl: ad.thumbnailUrl,
      category: "Ad",
    }));
    startReel("ADS", adQueue);
  };

  const handlePlayAd = (ad: AdCampaignData) => {
    const adQueue = ads.map((a) => ({
      id: `ad-${a.id}`,
      title: a.brandName,
      artist: "Commercial Campaign",
      role: a.description,
      mediaType: "video" as const,
      url: a.videoUrl,
      posterUrl: a.thumbnailUrl,
      category: "Ad",
    }));

    playMedia(
      {
        id: `ad-${ad.id}`,
        title: ad.brandName,
        artist: "Commercial Campaign",
        role: ad.description,
        mediaType: "video",
        url: ad.videoUrl,
        posterUrl: ad.thumbnailUrl,
        category: "Ad",
      },
      adQueue
    );
  };

  return (
    <div className="space-y-8">
      {/* Category Reel Launcher Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <Sparkles size={14} />
            <span>CONTINUOUS COMMERCIAL REEL</span>
          </div>
          <p className="text-xs text-zinc-400 font-light">
            Autoplay through high-end commercial campaigns and luxury brand sound design spots continuously.
          </p>
        </div>

        <button
          onClick={handleStartAdsReel}
          className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all hover:scale-105 flex-shrink-0"
        >
          <Play size={14} fill="currentColor" /> PLAY ADS REEL
        </button>
      </div>

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
                  onClick={() => handlePlayAd(ad)}
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
                  onClick={() => handlePlayAd(ad)}
                  className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors pt-2"
                >
                  PLAY SPOT →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

