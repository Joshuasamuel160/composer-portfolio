import { getReelProjects } from "@/lib/sanity/fetch";
import { ReelTimeline } from "@/components/ReelTimeline";

export default async function HomePage() {
  const projects = await getReelProjects();

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center items-center py-6 sm:py-10 space-y-6">
      {/* 1. Header & Typography Block */}
      <div className="text-center space-y-3 px-4 max-w-4xl mx-auto">
        {/* Italic Kicker Line in Fraunces Italic */}
        <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#C9C4B8] font-light tracking-wide">
          Composer & music producer for film, TV, and brands
        </p>

        {/* Large Serif Name / Headline (Fraunces Light, clamp sizing) */}
        <h1
          className="font-serif font-light text-[#EDE8DE] tracking-tight uppercase leading-tight"
          style={{
            fontSize: "clamp(38px, 7vw, 84px)",
          }}
        >
          JOSHUA SAMUEL
        </h1>
      </div>

      {/* 2. Reel-as-Timeline 3D Stage & Transport Scrubber */}
      <ReelTimeline projects={projects} />
    </div>
  );
}
