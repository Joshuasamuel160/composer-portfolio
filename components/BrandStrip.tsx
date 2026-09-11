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

const OPTICAL_SIZES: Record<string, string> = {
  "apple tv+": "h-[48px] sm:h-[62px] md:h-[74px] lg:h-[84px]",
  "apple": "h-[48px] sm:h-[62px] md:h-[74px] lg:h-[84px]",
  "warner bros": "h-[54px] sm:h-[68px] md:h-[80px] lg:h-[92px]",
  "netflix": "h-[50px] sm:h-[64px] md:h-[76px] lg:h-[86px]",
  "hbo": "h-[46px] sm:h-[58px] md:h-[72px] lg:h-[82px]",
  "sony pictures": "h-[52px] sm:h-[66px] md:h-[78px] lg:h-[90px]",
  "sony": "h-[52px] sm:h-[66px] md:h-[78px] lg:h-[90px]",
  "a24": "h-[46px] sm:h-[58px] md:h-[70px] lg:h-[80px]",
  "universal pictures": "h-[44px] sm:h-[56px] md:h-[68px] lg:h-[78px]",
  "universal": "h-[44px] sm:h-[56px] md:h-[68px] lg:h-[78px]",
};

const getOpticalClass = (name: string, logoUrl?: string) => {
  const normalized = name.toLowerCase().trim();
  if (OPTICAL_SIZES[normalized]) return OPTICAL_SIZES[normalized];
  for (const key of Object.keys(OPTICAL_SIZES)) {
    if (normalized.includes(key)) return OPTICAL_SIZES[key];
  }
  if (logoUrl) {
    const file = logoUrl.split("/").pop()?.replace(".svg", "").toLowerCase() || "";
    if (OPTICAL_SIZES[file]) return OPTICAL_SIZES[file];
  }
  return "h-[48px] sm:h-[60px] md:h-[74px] lg:h-[84px]";
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

        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 md:gap-20 lg:gap-24">
          {brands.map((brand) => {
            const opticalClass = getOpticalClass(brand.name, brand.logoUrl);
            return (
              <div
                key={brand.id}
                className="brand-item group flex items-center justify-center h-20 sm:h-24 md:h-28 lg:h-32 bg-transparent cursor-pointer transition-transform duration-300 ease-out hover:scale-105"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    loading="lazy"
                    style={{
                      filter: "brightness(0) saturate(100%) invert(82%)",
                    }}
                    className={`${opticalClass} w-auto max-w-[260px] sm:max-w-[380px] md:max-w-[480px] lg:max-w-[560px] object-contain opacity-85 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-95`}
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-serif font-light text-[#C8C8C8] group-hover:text-[#E5E5E5] transition-colors uppercase tracking-widest text-center truncate">
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
