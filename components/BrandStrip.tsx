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

// Global baseline default scale is 1.25x (scale(1.25)).
// Individual scale overrides created only when optically necessary.
const BRAND_SCALE_OVERRIDES: Record<string, string> = {
  "universal": "scale(1.4)",
  "universal pictures": "scale(1.4)",
  "a24": "scale(1.35)",
  "apple": "scale(1.15)",
  "apple tv+": "scale(1.15)",
  "warner bros": "scale(1.15)",
  "warnerbros": "scale(1.15)",
};

const getLogoScaleTransform = (name: string, logoUrl?: string) => {
  const normalized = name.toLowerCase().trim();
  if (BRAND_SCALE_OVERRIDES[normalized]) return BRAND_SCALE_OVERRIDES[normalized];
  for (const key of Object.keys(BRAND_SCALE_OVERRIDES)) {
    if (normalized.includes(key)) return BRAND_SCALE_OVERRIDES[key];
  }
  if (logoUrl) {
    const file = logoUrl.split("/").pop()?.replace(".svg", "").toLowerCase() || "";
    if (BRAND_SCALE_OVERRIDES[file]) return BRAND_SCALE_OVERRIDES[file];
  }
  return "scale(1.25)"; // Global Default Baseline Scale
};

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
    <section ref={containerRef} className="py-20 md:py-28 border-y border-white/5 bg-zinc-950/80 backdrop-blur-xs">
      <div className="max-w-[1400px] mx-auto px-6">
        <p className="text-center text-[11px] tracking-[0.35em] text-zinc-500 uppercase mb-16 font-mono">
          CLIENTS & COLLABORATORS
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16">
          {brands.map((brand) => {
            const scaleTransform = getLogoScaleTransform(brand.name, brand.logoUrl);
            return (
              <div
                key={brand.id}
                className="brand-item group flex items-center justify-center w-[150px] sm:w-[180px] md:w-[200px] h-[90px] sm:h-[100px] md:h-[110px] bg-transparent cursor-pointer transition-transform duration-300 ease-out hover:scale-105"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    loading="lazy"
                    style={{
                      filter: "brightness(0) saturate(100%) invert(82%)",
                      transform: scaleTransform,
                    }}
                    className="max-w-[90%] max-h-[70px] sm:max-h-[75px] md:max-h-[80px] w-auto h-auto object-contain opacity-85 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-95"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-serif font-light text-[#C8C8C8] group-hover:text-[#E5E5E5] transition-colors uppercase tracking-widest text-center truncate">
                    {brand.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
