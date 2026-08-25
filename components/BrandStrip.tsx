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

  return (
    <section ref={containerRef} className="py-12 border-y border-white/5 bg-zinc-950/40">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs tracking-[0.25em] text-zinc-500 uppercase mb-8 font-mono">
          CLIENTS & COLLABORATORS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="brand-item grayscale-strip-item px-4 py-2 cursor-pointer flex items-center justify-center"
            >
              <span className="text-xl md:text-2xl font-serif font-light text-zinc-300 tracking-wider hover:text-amber-400 transition-colors">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
