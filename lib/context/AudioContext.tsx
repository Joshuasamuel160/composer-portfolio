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

  const safePlay = async () => {
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

    if (currentTrack?.id === track.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        safePlay();
      }
    } else {
      setCurrentTrack(track);
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.volume = volume;
        safePlay();
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      safePlay();
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
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
