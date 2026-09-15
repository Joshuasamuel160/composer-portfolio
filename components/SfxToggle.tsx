"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSfxEnabled, setSfxEnabled, playButtonClickSFX } from "@/lib/utils/soundFX";

export const SfxToggle: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(isSfxEnabled());
  }, []);

  if (!mounted) return null;

  const toggle = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    setSfxEnabled(nextState);
    if (nextState) {
      setTimeout(() => playButtonClickSFX(), 50);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase border flex items-center gap-1.5 transition-all ${
        enabled
          ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 shadow-md shadow-amber-500/10"
          : "bg-zinc-900/80 text-zinc-500 border-white/5 hover:text-zinc-300 hover:bg-zinc-800"
      }`}
      title={enabled ? "UI Sound Effects Active (Click to Mute)" : "UI Sound Effects Muted (Click to Enable)"}
      aria-label="Toggle UI Sound FX"
    >
      {enabled ? <Volume2 size={12} className="text-amber-400" /> : <VolumeX size={12} />}
      <span>SFX: {enabled ? "ON" : "OFF"}</span>
    </button>
  );
};
