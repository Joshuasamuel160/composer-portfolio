"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { SongData, mockScreenProjects, mockSongs, mockAds, mockHeroReels } from "../mockData";
import { formatVideoEmbedUrl, isDirectVideoFile } from "@/lib/utils/formatVideoUrl";

export interface PlaylistItem {
  id: string;
  title: string;
  artist: string;
  role?: string;
  mediaType: "audio" | "video";
  url: string;
  posterUrl?: string;
  coverUrl?: string; // alias
  audioUrl?: string; // alias
  year?: string;
  category?: string;
  scoreCues?: Array<{ id: string; title: string; duration: string; audioUrl: string }>;
  externalUrl?: string;
}

export type Track = PlaylistItem;

export type ReelCategory = "FULL" | "SCREEN" | "SONGS" | "ADS";

interface AudioContextType {
  currentItem: PlaylistItem | null;
  currentTrack: PlaylistItem | null; // Alias for backward compatibility
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  queue: PlaylistItem[];
  queueIndex: number;
  isReelMode: boolean;
  reelCategory: ReelCategory | null;
  isPipMinimized: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  playMedia: (item: PlaylistItem | SongData | any, queueList?: (PlaylistItem | SongData | any)[], isReel?: boolean) => void;
  playTrack: (track: PlaylistItem | SongData | any, queueList?: (PlaylistItem | SongData | any)[]) => void; // Alias
  startReel: (category?: ReelCategory, customQueue?: PlaylistItem[]) => void;
  exitReel: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  togglePip: () => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

function extractYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:music\.youtube\.com\/watch\?v=|youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function isExternalStreamingPage(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("spotify.com") ||
    url.includes("music.apple.com") ||
    url.includes("soundcloud.com")
  );
}

export function normalizePlaylistItem(raw: any): PlaylistItem {
  const url = raw.url || raw.audioUrl || raw.videoUrl || "";
  const isVideo = raw.mediaType === "video" || Boolean(raw.videoUrl) || isDirectVideoFile(url) || Boolean(extractYouTubeId(url));

  return {
    id: raw.id || `item-${Math.random().toString(36).substring(2, 9)}`,
    title: raw.title || raw.brandName || "Untitled Track",
    artist: raw.artist || raw.artistName || raw.brandName || "Joshua Samuel",
    role: raw.role || raw.description || "Composer",
    mediaType: isVideo ? "video" : "audio",
    url: url,
    posterUrl: raw.posterUrl || raw.coverUrl || raw.thumbnailUrl || "",
    coverUrl: raw.coverUrl || raw.posterUrl || raw.thumbnailUrl || "",
    audioUrl: url,
    year: raw.year || raw.releaseYear || "",
    category: raw.category || (isVideo ? "Screen" : "Song"),
    scoreCues: raw.scoreCues || [],
    externalUrl: raw.externalUrl || raw.embedUrl || "",
  };
}

// Helper to build curated combined reels
export function buildCuratedQueue(category: ReelCategory = "FULL"): PlaylistItem[] {
  const screenItems: PlaylistItem[] = mockScreenProjects.map((sp) => ({
    id: `reel-sp-${sp.id}`,
    title: sp.title,
    artist: sp.productionCompany || sp.director || "Joshua Samuel",
    role: `${sp.role} (${sp.year})`,
    mediaType: "video",
    url: sp.videoUrl,
    posterUrl: sp.posterUrl,
    year: sp.year,
    category: "Screen",
    scoreCues: sp.scoreCues,
  }));

  const songItems: PlaylistItem[] = mockSongs.map((song) => ({
    id: `reel-song-${song.id}`,
    title: song.title,
    artist: song.artistName,
    role: song.role,
    mediaType: "audio",
    url: song.audioUrl,
    posterUrl: song.coverUrl,
    year: song.releaseYear,
    category: "Song",
  }));

  const adItems: PlaylistItem[] = mockAds.map((ad) => ({
    id: `reel-ad-${ad.id}`,
    title: ad.brandName,
    artist: "Commercial Campaign",
    role: ad.description,
    mediaType: "video",
    url: ad.videoUrl,
    posterUrl: ad.thumbnailUrl,
    category: "Ad",
  }));

  if (category === "SCREEN") return screenItems;
  if (category === "SONGS") return songItems;
  if (category === "ADS") return adItems;

  // Combined FULL Reel: interleave screen, song, ad
  const combined: PlaylistItem[] = [];
  const maxLen = Math.max(screenItems.length, songItems.length, adItems.length);
  for (let i = 0; i < maxLen; i++) {
    if (screenItems[i]) combined.push(screenItems[i]);
    if (songItems[i]) combined.push(songItems[i]);
    if (adItems[i]) combined.push(adItems[i]);
  }
  return combined;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentItem, setCurrentItem] = useState<PlaylistItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [queue, setQueue] = useState<PlaylistItem[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const [isReelMode, setIsReelMode] = useState<boolean>(false);
  const [reelCategory, setReelCategory] = useState<ReelCategory | null>(null);
  const [isPipMinimized, setIsPipMinimized] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytTimerRef = useRef<any>(null);

  const ytId = currentItem ? extractYouTubeId(currentItem.url) : null;
  const isDirectVideo = currentItem?.mediaType === "video" && isDirectVideoFile(currentItem.url);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Poll YouTube player progress when playing YT video
  useEffect(() => {
    if (ytId && isPlaying) {
      ytTimerRef.current = setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
          const cur = ytPlayerRef.current.getCurrentTime();
          const dur = ytPlayerRef.current.getDuration();
          if (cur) setCurrentTime(cur);
          if (dur) setDuration(dur);
        }
      }, 300);
    } else {
      if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    }
    return () => {
      if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    };
  }, [ytId, isPlaying]);

  // Handle native HTML5 video element progress & duration
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleTimeUpdate = () => {
      if (currentItem?.mediaType === "video") {
        setCurrentTime(vid.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (currentItem?.mediaType === "video") {
        setDuration(vid.duration || 0);
      }
    };

    vid.addEventListener("timeupdate", handleTimeUpdate);
    vid.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      vid.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [currentItem]);

  const initYtPlayer = (videoId: string) => {
    if (typeof window === "undefined") return;

    const createNewPlayer = () => {
      if (window.YT && window.YT.Player) {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === "function") {
          ytPlayerRef.current.loadVideoById(videoId);
          ytPlayerRef.current.setVolume(volume * 100);
          setIsPlaying(true);
        } else {
          ytPlayerRef.current = new window.YT.Player("yt-media-player-container", {
            height: "100%",
            width: "100%",
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 1,
              modestbranding: 1,
              rel: 0,
            },
            events: {
              onReady: (event: any) => {
                event.target.setVolume(volume * 100);
                event.target.playVideo();
                setIsPlaying(true);
              },
              onStateChange: (event: any) => {
                if (window.YT && event.data === window.YT.PlayerState.ENDED) {
                  handleItemEnded();
                }
              },
            },
          });
        }
      } else {
        setTimeout(createNewPlayer, 200);
      }
    };

    createNewPlayer();
  };

  const playMedia = (rawItem: any, queueList?: any[], isReel: boolean = false) => {
    const item = normalizePlaylistItem(rawItem);
    if (!item.url) return;

    if (isExternalStreamingPage(item.url)) {
      if (typeof window !== "undefined") {
        window.open(item.url, "_blank");
      }
      return;
    }

    const newYtId = extractYouTubeId(item.url);

    if (queueList && queueList.length > 0) {
      const normalizedQueue = queueList.map(normalizePlaylistItem);
      setQueue(normalizedQueue);
      const idx = normalizedQueue.findIndex((t) => t.id === item.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else if (queue.length === 0) {
      setQueue([item]);
      setQueueIndex(0);
    }

    if (isReel) {
      setIsReelMode(true);
    }

    if (currentItem?.id === item.id) {
      togglePlay();
    } else {
      // Pause all active playing elements
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
        ytPlayerRef.current.pauseVideo();
      }

      setCurrentItem(item);
      setIsPlaying(true);

      if (newYtId) {
        initYtPlayer(newYtId);
      } else if (item.mediaType === "video" && isDirectVideoFile(item.url)) {
        if (videoRef.current) {
          videoRef.current.src = item.url;
          videoRef.current.volume = volume;
          videoRef.current.play().catch(() => {});
        }
      } else {
        if (audioRef.current) {
          audioRef.current.src = item.url;
          audioRef.current.volume = volume;
          audioRef.current.play().catch(() => {});
        }
      }
    }
  };

  const startReel = (category: ReelCategory = "FULL", customQueue?: PlaylistItem[]) => {
    const reelQueue = customQueue || buildCuratedQueue(category);
    if (reelQueue.length === 0) return;

    setIsReelMode(true);
    setReelCategory(category);
    setQueue(reelQueue);
    setQueueIndex(0);
    playMedia(reelQueue[0], reelQueue, true);
  };

  const exitReel = () => {
    setIsReelMode(false);
    setReelCategory(null);
  };

  const playNext = () => {
    if (queue.length > 0 && queueIndex + 1 < queue.length) {
      const nextIdx = queueIndex + 1;
      setQueueIndex(nextIdx);
      playMedia(queue[nextIdx], queue, isReelMode);
    }
  };

  const playPrevious = () => {
    if (queue.length > 0 && queueIndex - 1 >= 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      playMedia(queue[prevIdx], queue, isReelMode);
    }
  };

  const handleItemEnded = () => {
    if (queue.length > 0 && queueIndex + 1 < queue.length) {
      playNext();
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      if (isReelMode) {
        setIsReelMode(false);
      }
    }
  };

  const togglePlay = () => {
    if (!currentItem) return;

    if (isPlaying) {
      if (ytId && ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
        ytPlayerRef.current.pauseVideo();
      } else if (currentItem.mediaType === "video" && videoRef.current) {
        videoRef.current.pause();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (ytId && ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } else if (currentItem.mediaType === "video" && videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const seek = (time: number) => {
    setCurrentTime(time);
    if (ytId && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
      ytPlayerRef.current.seekTo(time, true);
    } else if (currentItem?.mediaType === "video" && videoRef.current) {
      videoRef.current.currentTime = time;
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (ytId && ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === "function") {
      ytPlayerRef.current.setVolume(vol * 100);
    }
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const togglePip = () => {
    setIsPipMinimized((prev) => !prev);
  };

  const closePlayer = () => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.stopVideo === "function") {
      ytPlayerRef.current.stopVideo();
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentItem(null);
    setCurrentTime(0);
    setQueue([]);
    setQueueIndex(-1);
    setIsReelMode(false);
    setReelCategory(null);
  };

  return (
    <AudioContext.Provider
      value={{
        currentItem,
        currentTrack: currentItem,
        isPlaying,
        duration,
        currentTime,
        volume,
        queue,
        queueIndex,
        isReelMode,
        reelCategory,
        isPipMinimized,
        audioRef,
        videoRef,
        playMedia,
        playTrack: playMedia,
        startReel,
        exitReel,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        setVolume,
        togglePip,
        closePlayer,
      }}
    >
      {children}

      {/* HTML5 Native Audio Player for MP3 files */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={() => {
          if (!ytId && currentItem?.mediaType !== "video" && audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (!ytId && currentItem?.mediaType !== "video" && audioRef.current) {
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={handleItemEnded}
      />

      {/* HTML5 Native Video Player for MP4 files */}
      <video
        ref={videoRef}
        preload="auto"
        playsInline
        className="hidden"
        onTimeUpdate={() => {
          if (currentItem?.mediaType === "video" && videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (currentItem?.mediaType === "video" && videoRef.current) {
            setDuration(videoRef.current.duration || 0);
          }
        }}
        onEnded={handleItemEnded}
      />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
