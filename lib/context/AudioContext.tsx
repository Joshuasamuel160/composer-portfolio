"use client";

import React, { createContext, useContext, useState, useRef } from "react";
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

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.85);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytId = currentTrack ? extractYouTubeId(currentTrack.audioUrl) : null;

  const safePlay = async () => {
    if (ytId) {
      setIsPlaying(true);
      return;
    }
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn("Audio playback error:", err);
      setIsPlaying(false);
    }
  };

  const playTrack = (inputTrack: Track | SongData) => {
    const track = normalizeTrack(inputTrack);
    if (!track.audioUrl) {
      console.warn("No audio URL provided for track:", track.title);
      return;
    }

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        if (audioRef.current && !ytId) audioRef.current.pause();
        setIsPlaying(false);
      } else {
        safePlay();
      }
    } else {
      // Pause existing native audio if switching
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentTrack(track);
      const newYtId = extractYouTubeId(track.audioUrl);
      if (!newYtId && audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.volume = volume;
      }
      safePlay();
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      if (audioRef.current && !ytId) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      safePlay();
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current || ytId) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const closePlayer = () => {
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
      {!ytId && (
        <audio
          ref={audioRef}
          preload="auto"
          onTimeUpdate={() => {
            if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) setDuration(audioRef.current.duration || 0);
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}
      {/* Hidden YouTube Stream Iframe for YouTube Music links */}
      {ytId && isPlaying && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1`}
          allow="autoplay"
          className="hidden"
          title="YouTube Audio Stream"
        />
      )}
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
