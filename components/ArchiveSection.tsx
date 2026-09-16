"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PortfolioItem, getAllPortfolioItems } from "@/lib/sanity/fetch";
import { CoverFlow } from "@/components/CoverFlow";

interface ArchiveSectionProps {
  initialItems?: PortfolioItem[];
}

const CATEGORY_PILLS = [
  "ALL",
  "FILM",
  "SOUND DESIGN",
  "COMMERCIAL",
  "MUSIC",
  "LIVE",
  "ARRANGEMENT",
  "PRODUCTION",
] as const;

type FilterCategory = (typeof CATEGORY_PILLS)[number];

export const ArchiveSection: React.FC<ArchiveSectionProps> = ({ initialItems }) => {
  const [allItems, setAllItems] = useState<PortfolioItem[]>(initialItems || []);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");

  useEffect(() => {
    if (!initialItems || initialItems.length === 0) {
      getAllPortfolioItems().then((res) => {
        if (res && res.length > 0) {
          setAllItems(res);
        }
      });
    } else {
      setAllItems(initialItems);
    }
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "ALL") return allItems;

    return allItems.filter((item) => {
      const cat = (item.category || "").toLowerCase();
      const role = (item.role || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const combinedText = `${cat} ${role} ${title} ${desc}`;

      switch (activeFilter) {
        case "FILM":
          return cat.includes("screen") || cat.includes("film") || role.includes("score") || combinedText.includes("film");
        case "SOUND DESIGN":
          return combinedText.includes("sound design") || combinedText.includes("sound");
        case "COMMERCIAL":
          return cat.includes("ad") || cat.includes("commercial") || combinedText.includes("campaign") || combinedText.includes("brand");
        case "MUSIC":
          return cat.includes("song") || cat.includes("music") || combinedText.includes("release") || combinedText.includes("track");
        case "LIVE":
          return combinedText.includes("live") || combinedText.includes("concert") || combinedText.includes("stage");
        case "ARRANGEMENT":
          return combinedText.includes("arrang") || combinedText.includes("orchestra");
        case "PRODUCTION":
          return combinedText.includes("produc");
        default:
          return true;
      }
    });
  }, [allItems, activeFilter]);

  // Fallback to allItems if filter yields zero items
  const displayItems = filteredItems.length > 0 ? filteredItems : allItems;

  return (
    <section id="archive" className="w-full bg-[#0C0C0D] py-24 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-500/90 font-medium">
            COMPLETE CATALOGUE
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#EDE8DE] tracking-tight">
            THE ARCHIVE
          </h2>
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            A collection of music, scores, sound design and productions by Joshua Samuel.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 pb-4">
          {CATEGORY_PILLS.map((pill) => {
            const isActive = activeFilter === pill;
            return (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 border ${
                  isActive
                    ? "bg-amber-500 text-zinc-950 font-bold border-amber-500 shadow-lg shadow-amber-500/20"
                    : "bg-zinc-950/60 text-zinc-400 border-white/10 hover:text-zinc-200 hover:border-white/25"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        {/* Cover Flow Component */}
        <div className="pt-4">
          <CoverFlow items={displayItems} />
        </div>
      </div>
    </section>
  );
};
