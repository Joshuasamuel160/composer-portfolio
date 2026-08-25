import type { Metadata } from "next";
import { getScreenProjects } from "@/lib/sanity/fetch";
import { ScreenGrid } from "@/components/ScreenGrid";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export const metadata: Metadata = {
  title: "Screen Work — Film & TV Scores | Julian Vance",
  description:
    "Explore feature film scores, television miniseries soundtracks, and narrative short film compositions by Julian Vance.",
};

export default async function ScreenPage() {
  const projects = await getScreenProjects();

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <ScrollAnimation>
        <div className="border-b border-white/5 pb-8">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase">
            FILM & TELEVISION
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-2">
            SCREEN WORK
          </h1>
          <p className="text-sm text-zinc-400 font-light max-w-2xl mt-4">
            Feature film scores, television miniseries, and narrative short films for theatrical and digital platforms.
          </p>
        </div>
      </ScrollAnimation>

      {/* Projects Grid */}
      <ScrollAnimation yOffset={30}>
        <ScreenGrid projects={projects} />
      </ScrollAnimation>
    </div>
  );
}
