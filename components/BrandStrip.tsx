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
    <section ref={containerRef} className="py-14 border-y border-white/5 bg-zinc-950/60 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[11px] tracking-[0.3em] text-zinc-500 uppercase mb-10 font-mono">
          CLIENTS & COLLABORATORS
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="brand-item group px-3 py-2 flex items-center justify-center h-12 w-28 sm:w-36 md:w-40 transition-transform duration-300 ease-out hover:scale-105"
            >
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain filter grayscale opacity-50 transition-all duration-300 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-110"
                />
              ) : (
                <span className="text-base sm:text-lg font-serif font-light text-zinc-400 group-hover:text-amber-400 transition-colors uppercase tracking-widest text-center truncate">
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
