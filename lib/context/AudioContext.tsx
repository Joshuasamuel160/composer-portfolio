"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { SongData } from "../mockData";

export interface Track {
  id: string;
  title: string;
  artist: string;
  role?: string;
  audioUrl: string;
  coverUrl?: string;
  year?: string;
  category?: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  playTrack: (track: Track | SongData) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

function extractYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:music\.youtube\.com\/watch\?v=|youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function normalizeTrack(track: Track | SongData): Track {
  if ("artist" in track) {
    return track;
  }
  return {
    id: track.id,
    title: track.title,
    artist: track.artistName,
    role: track.role,
    audioUrl: track.audioUrl,
    coverUrl: track.coverUrl,
    year: track.releaseYear,
  };
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytTimerRef = useRef<any>(null);

  const ytId = currentTrack ? extractYouTubeId(currentTrack.audioUrl) : null;

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Poll YouTube player progress when playing YT track
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

  const initYtPlayer = (videoId: string) => {
    if (typeof window === "undefined") return;

    const createNewPlayer = () => {
      if (window.YT && window.YT.Player) {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === "function") {
          ytPlayerRef.current.loadVideoById(videoId);
          ytPlayerRef.current.setVolume(volume * 100);
          setIsPlaying(true);
        } else {
          ytPlayerRef.current = new window.YT.Player("yt-audio-player-container", {
            height: "0",
            width: "0",
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
            },
            events: {
              onReady: (event: any) => {
                event.target.setVolume(volume * 100);
                event.target.playVideo();
                setIsPlaying(true);
              },
              onStateChange: (event: any) => {
                if (window.YT && event.data === window.YT.PlayerState.ENDED) {
                  setIsPlaying(false);
                  setCurrentTime(0);
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

  const playTrack = (inputTrack: Track | SongData) => {
    const track = normalizeTrack(inputTrack);
    if (!track.audioUrl) return;

    const newYtId = extractYouTubeId(track.audioUrl);

    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      // Pause previous playing source
      if (audioRef.current) audioRef.current.pause();
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
        ytPlayerRef.current.pauseVideo();
      }

      setCurrentTrack(track);

      if (newYtId) {
        initYtPlayer(newYtId);
      } else {
        if (audioRef.current) {
          audioRef.current.src = track.audioUrl;
          audioRef.current.volume = volume;
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      }
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      if (ytId && ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
        ytPlayerRef.current.pauseVideo();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (ytId && ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } else if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const seek = (time: number) => {
    setCurrentTime(time);
    if (ytId && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
      ytPlayerRef.current.seekTo(time, true);
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (ytId && ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === "function") {
      ytPlayerRef.current.setVolume(vol * 100);
    }
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const closePlayer = () => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.stopVideo === "function") {
      ytPlayerRef.current.stopVideo();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        duration,
        currentTime,
        volume,
        playTrack,
        togglePlay,
        seek,
        setVolume,
        closePlayer,
      }}
    >
      {children}
      {/* HTML5 Native Audio Player for MP3 files */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={() => {
          if (!ytId && audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (!ytId && audioRef.current) setDuration(audioRef.current.duration || 0);
        }}
        onEnded={() => {
          if (!ytId) {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }}
      />
      {/* Hidden YouTube IFrame API Player Container */}
      <div id="yt-audio-player-container" className="hidden" />
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
