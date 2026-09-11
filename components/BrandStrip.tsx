"use client";

import React, { useRef } from "react";
import { BrandData } from "@/lib/mockData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface BrandStripProps {
  brands: BrandData[];
}

export const BrandStrip: React.FC<BrandStripProps> = ({ brands }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const items = containerRef.current.querySelectorAll(".brand-item");

      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  if (!brands || brands.length === 0) return null;

  return (
    <section ref={containerRef} className="py-14 border-y border-white/5 bg-zinc-950/80 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[11px] tracking-[0.3em] text-zinc-500 uppercase mb-10 font-mono">
          CLIENTS & COLLABORATORS
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 md:gap-20">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="brand-item group flex items-center justify-center bg-transparent cursor-pointer transition-transform duration-300 ease-out hover:scale-105"
            >
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  className="h-7 sm:h-9 md:h-11 w-auto max-w-[140px] sm:max-w-[200px] object-contain brightness-0 invert opacity-80 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:brightness-100 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                />
              ) : (
                <span className="text-lg md:text-xl font-serif font-light text-zinc-200 group-hover:text-amber-400 transition-colors uppercase tracking-widest text-center truncate">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
