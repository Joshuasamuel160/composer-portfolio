"use client";

import React from "react";

export const WhatIDo: React.FC = () => {
  const services = [
    {
      number: "01",
      title: "FILM SCORING",
      description:
        "Original thematic scores and music composition crafted specifically for narrative feature films, documentaries, and television.",
    },
    {
      number: "02",
      title: "SOUND DESIGN",
      description:
        "Creating immersive sonic worlds, custom audio synthesis, soundscapes, and textural sound design for visual media.",
    },
    {
      number: "03",
      title: "MUSIC PRODUCTION",
      description:
        "Full-scale music production, orchestral arrangement, mixing guidance, and additional music for artist releases and brand films.",
    },
  ];

  return (
    <section id="services" className="w-full bg-[#0C0C0D] py-24 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-500/90 font-medium">
            SERVICES & CRAFT
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#EDE8DE] tracking-tight">
            WHAT I DO
          </h2>
        </div>

        {/* 3-Column Typographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-4">
          {services.map((service) => (
            <div
              key={service.number}
              className="group flex flex-col justify-between p-8 rounded-2xl bg-zinc-950/40 border border-white/5 hover:border-amber-500/30 transition-all duration-300 hover:bg-zinc-950/80"
            >
              <div className="space-y-6">
                <span className="text-xs font-mono text-zinc-500 tracking-widest block">
                  [{service.number}]
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-light text-[#EDE8DE] tracking-wide group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-8">
                <div className="w-8 h-[1px] bg-zinc-800 group-hover:w-16 group-hover:bg-amber-500/60 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
