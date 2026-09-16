import { getAllPortfolioItems } from "@/lib/sanity/fetch";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { WhatIDo } from "@/components/WhatIDo";
import { ArchiveSection } from "@/components/ArchiveSection";

export const revalidate = 0;

export default async function HomePage() {
  const items = await getAllPortfolioItems();

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-[#EDE8DE]">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. SELECTED WORK SECTION */}
      <SelectedWork items={items} />

      {/* 3. WHAT I DO (SERVICES & CRAFT) SECTION */}
      <WhatIDo />

      {/* 4. THE ARCHIVE (COVER FLOW & CATALOGUE) SECTION */}
      <ArchiveSection initialItems={items} />
    </div>
  );
}
