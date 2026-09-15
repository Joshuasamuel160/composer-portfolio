"use client";

// Web Audio API Synthesizer for high-quality, lightweight UI sound effects (< 150ms)
let sfxAudioCtx: AudioContext | null = null;

function getSfxContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sfxAudioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      sfxAudioCtx = new AudioCtx();
    }
  }
  if (sfxAudioCtx && sfxAudioCtx.state === "suspended") {
    sfxAudioCtx.resume().catch(() => {});
  }
  return sfxAudioCtx;
}

export function isSfxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("portfolio_sfx_enabled");
  return stored !== "false"; // Default to true if not set
}

export function setSfxEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("portfolio_sfx_enabled", enabled ? "true" : "false");
}

// 1. Soft Analog Tape Click / Vinyl Cue Pop for Cover Flow Card Transitions
export function playCardSwitchSFX(): void {
  if (!isSfxEnabled()) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Filtered transient noise burst (simulating tape click / vinyl needle cue)
    const bufferSize = ctx.sampleRate * 0.04; // 40ms duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Highpass filter for crisp analog tape click
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(3, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now); // Quiet, non-fatiguing volume
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.04);
  } catch (e) {
    // Silent fail if AudioContext is blocked
  }
}

// 2. Subtle Soft Wood/Tape Click for Transport & UI Buttons
export function playButtonClickSFX(): void {
  if (!isSfxEnabled()) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Soft sine pop + low-pass filter
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch (e) {
    // Silent fail
  }
}
