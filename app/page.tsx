import { getBio, getHeroReels } from "@/lib/sanity/fetch";
import { Hero } from "@/components/Hero";

export default async function HomePage() {
  const bio = await getBio();
  const heroReels = await getHeroReels();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero with Multi-Track Showreel Player */}
      <Hero
        name={bio.name}
        tagline={bio.tagline}
        featuredReels={heroReels}
      />
    </div>
  );
}
