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
    <section ref={containerRef} className="py-16 border-y border-white/5 bg-zinc-950/80 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-[11px] tracking-[0.3em] text-zinc-500 uppercase mb-12 font-mono">
          CLIENTS & COLLABORATORS
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 md:gap-24">
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
                  style={{
                    filter: "brightness(0) saturate(100%) invert(82%)",
                  }}
                  className="h-9 sm:h-12 md:h-14 lg:h-16 w-auto max-w-[160px] sm:max-w-[220px] md:max-w-[260px] object-contain opacity-85 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-95"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-serif font-light text-[#C8C8C8] group-hover:text-[#E5E5E5] transition-colors uppercase tracking-widest text-center truncate">
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
