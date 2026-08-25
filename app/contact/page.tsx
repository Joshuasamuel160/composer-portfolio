"use client";

import React, { useState } from "react";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { Copy, Check, Mail, ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = "julian@julianvancemusic.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Currently featuring Instagram, YouTube, and IMDb.
  // Additional platforms (Spotify, Apple Music, SoundCloud) can be added here anytime.
  const socials = [
    { name: "Instagram", href: "https://instagram.com", handle: "@julianvancemusic" },
    { name: "YouTube", href: "https://youtube.com", handle: "Julian Vance Music" },
    { name: "IMDb", href: "https://imdb.com", handle: "Julian Vance (Composer)" },
  ];

  return (
    <div className="py-20 px-6 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <ScrollAnimation>
        <div className="border-b border-white/5 pb-8">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-2">
            CONTACT
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-2xl mt-4">
            For film/TV scoring inquiries, record production commissions, commercial licensing, or studio bookings.
          </p>
        </div>
      </ScrollAnimation>

      {/* Main Direct Email Card */}
      <ScrollAnimation delay={0.1}>
        <div className="cinematic-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-white/10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Mail size={28} />
          </div>

          <span className="text-xs font-mono tracking-[0.2em] text-zinc-400 uppercase">
            DIRECT EMAIL
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light font-mono text-zinc-100 tracking-tight break-all">
            {email}
          </h2>

          <div className="pt-2">
            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-xs uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105"
            >
              {copied ? (
                <>
                  <Check size={16} /> COPIED TO CLIPBOARD
                </>
              ) : (
                <>
                  <Copy size={16} /> COPY EMAIL ADDRESS
                </>
              )}
            </button>
          </div>
        </div>
      </ScrollAnimation>

      {/* Social Links Grid */}
      <ScrollAnimation delay={0.2} yOffset={30}>
        <div>
          <span className="text-xs font-mono tracking-[0.2em] text-zinc-500 uppercase block mb-6">
            DIGITAL & INDUSTRY PLATFORMS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cinematic-card rounded-2xl p-5 flex items-center justify-between group border border-white/5 hover:border-white/20 transition-all duration-300"
              >
                <div>
                  <h4 className="text-sm font-medium text-zinc-200 group-hover:text-amber-400 transition-colors uppercase tracking-wider">
                    {social.name}
                  </h4>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">
                    {social.handle}
                  </p>
                </div>
                <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
