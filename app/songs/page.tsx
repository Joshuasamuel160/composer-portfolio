import type { Metadata } from "next";
import { getAlbums, getSongs } from "@/lib/sanity/fetch";
import { SongsClient } from "./SongsClient";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export const metadata: Metadata = {
  title: "Albums & Soundtracks | Julian Vance",
  description:
    "Explore curated film soundtracks, album productions, and discography releases grouped by production company and artist.",
};

export default async function SongsPage() {
  const albums = await getAlbums();
  const songs = await getSongs();

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <ScrollAnimation>
        <div className="border-b border-white/5 pb-8">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase">
            DISCOGRAPHY & PRODUCTIONS
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-2">
            ALBUMS & SOUNDTRACKS
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-2xl mt-4">
            Film motion picture soundtracks, album productions, and artist releases grouped by studio and company.
          </p>
        </div>
      </ScrollAnimation>

      {/* Album & Soundtrack Client Component */}
      <SongsClient albums={albums} songs={songs} />
    </div>
  );
}
