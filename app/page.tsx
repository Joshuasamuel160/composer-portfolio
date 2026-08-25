import { getBio, getBrands, getHeroReels } from "@/lib/sanity/fetch";
import { Hero } from "@/components/Hero";
import { BrandStrip } from "@/components/BrandStrip";

export default async function HomePage() {
  const bio = await getBio();
  const brands = await getBrands();
  const heroReels = await getHeroReels();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero with Multi-Track Showreel Player */}
      <Hero
        name={bio.name}
        tagline={bio.tagline}
        featuredReels={heroReels}
      />

      {/* Client / Collaborators Brand Strip */}
      <BrandStrip brands={brands} />
    </div>
  );
}
