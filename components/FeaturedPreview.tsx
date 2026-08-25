"use client";

import React from "react";
import Link from "next/link";
import { FeaturedWorkItem } from "@/lib/mockData";
import { ArrowUpRight } from "lucide-react";

interface FeaturedPreviewProps {
  items: FeaturedWorkItem[];
}

export const FeaturedPreview: React.FC<FeaturedPreviewProps> = ({ items }) => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-white/5 pb-6">
        <div>
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase">
            SELECTED CREDITS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-2">
            FEATURED WORK
          </h2>
        </div>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2 sm:mt-0">
          MIXED MEDIA SELECTION
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="cinematic-card rounded-3xl overflow-hidden group flex flex-col justify-between border border-white/5 hover:border-amber-500/30 transition-all duration-300"
          >
            {/* Image Thumbnail */}
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-zinc-950/80 border border-white/10 text-amber-400 backdrop-blur-md">
                {item.category}
              </span>
            </div>

            {/* Meta */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xl font-light text-zinc-100 uppercase tracking-wide group-hover:text-amber-400 transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-amber-500 font-medium tracking-wider uppercase mb-2">
                  {item.role}
                </p>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium text-zinc-300 group-hover:text-amber-400 transition-colors pt-2">
                VIEW IN {item.category.toUpperCase()} <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
