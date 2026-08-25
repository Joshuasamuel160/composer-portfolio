import type { Metadata } from "next";
import { getBio } from "@/lib/sanity/fetch";
import { ScrollAnimation } from "@/components/ScrollAnimation";

export const metadata: Metadata = {
  title: "Biography & About | Julian Vance",
  description:
    "Read the background, classical training, and scoring philosophy of composer and music producer Julian Vance.",
};

export default async function AboutPage() {
  const bio = await getBio();

  return (
    <div className="py-20 px-6 max-w-5xl mx-auto space-y-16">
      {/* Header Title */}
      <ScrollAnimation>
        <div className="border-b border-white/5 pb-8">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase">
            BIOGRAPHY
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-light text-zinc-100 uppercase tracking-wide mt-2">
            ABOUT {bio.name}
          </h1>
        </div>
      </ScrollAnimation>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Photo */}
        <ScrollAnimation className="md:col-span-5" delay={0.1}>
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl cinematic-card">
            <img
              src={bio.photoUrl}
              alt={bio.name}
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </ScrollAnimation>

        {/* Story Text */}
        <ScrollAnimation className="md:col-span-7 space-y-6 text-zinc-300 font-light text-lg sm:text-xl leading-relaxed" delay={0.2}>
          {bio.paragraphs.map((p, idx) => (
            <p key={idx} className="first-letter:text-4xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2">
              {p}
            </p>
          ))}

          <div className="pt-8 border-t border-white/5 text-xs font-mono tracking-widest text-zinc-500 uppercase space-y-1">
            <p>REPRESENTATION: UNITED TALENT AGENCY (UTA)</p>
            <p>PUBLISHING: UNIVERSAL MUSIC PUBLISHING GROUP</p>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
