import { getBio, getAllPortfolioItems } from "@/lib/sanity/fetch";
import { Hero } from "@/components/Hero";
import { CoverFlow } from "@/components/CoverFlow";

export default async function HomePage() {
  const [bio, portfolioItems] = await Promise.all([
    getBio(),
    getAllPortfolioItems(),
  ]);

  return (
    <div className="space-y-12 pb-16">
      {/* Cinematic Hero Header */}
      <Hero name={bio.name} tagline={bio.tagline} />

      {/* 3D Discography Cover Flow Showcase & PLAY FULL REEL Feature */}
      <CoverFlow items={portfolioItems} />
    </div>
  );
}
