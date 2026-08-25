import type { Metadata } from "next";
import { getAds } from "@/lib/sanity/fetch";
import { AdsGrid } from "@/components/AdsGrid";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export const metadata: Metadata = {
  title: "Ads & Commercial Sound Design | Julian Vance",
  description:
    "Bespoke original compositions, sonic branding, and audio post-production for luxury and global commercial campaigns.",
};

export default async function AdsPage() {
  const ads = await getAds();

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <ScrollAnimation>
        <div className="border-b border-white/5 pb-8">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase">
            COMMERCIAL & BRAND IDENTITIES
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-2">
            ADS & CAMPAIGNS
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-2xl mt-4">
            Bespoke original compositions, sonic branding, and audio post-production for high-end global advertising spots.
          </p>
        </div>
      </ScrollAnimation>

      {/* Ads Grid */}
      <ScrollAnimation yOffset={30}>
        <AdsGrid ads={ads} />
      </ScrollAnimation>
    </div>
  );
}
