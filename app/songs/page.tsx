import type { Metadata } from "next";
import { getArtists, getSongs } from "@/lib/sanity/fetch";
import { SongsClient } from "./SongsClient";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export const metadata: Metadata = {
  title: "Records & Productions | Julian Vance",
  description:
    "Curated song productions, arrangements, and artist collaborations across a diverse range of genres.",
};

export default async function SongsPage() {
  const artists = await getArtists();
  const songs = await getSongs();

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <ScrollAnimation>
        <div className="border-b border-white/5 pb-8">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase">
            RECORDS AND PRODUCTIONS
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-2">
            SONGS & DISCOGRAPHY
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-2xl mt-4">
            Curated song productions, arrangements, and artist collaborations across a diverse range of genres.
          </p>
        </div>
      </ScrollAnimation>

      {/* Artist Filter Badges & Track List */}
      <SongsClient artists={artists} songs={songs} />
    </div>
  );
}
