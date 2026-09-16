"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface HeroProps {
  name?: string;
  tagline?: string;
}

export const Hero: React.FC<HeroProps> = ({
  name = "JOSHUA SAMUEL",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          statementRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-6 max-w-5xl mx-auto text-center select-none flex flex-col items-center justify-center"
    >
      {/* Subtle Grain / Film Lighting Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#B8863B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Name */}
      <h1
        ref={titleRef}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-[#EDE8DE] uppercase leading-tight mb-4"
      >
        {name}
      </h1>

      {/* Title / Role */}
      <p
        ref={subtitleRef}
        className="text-xs sm:text-sm md:text-base font-sans font-medium tracking-[0.25em] text-[#C9C4B8] uppercase mb-6"
      >
        Film Composer <span className="text-[#8C8A80] mx-2">·</span> Producer{" "}
        <span className="text-[#8C8A80] mx-2">·</span> Sound Designer
      </p>

      {/* Primary Statement */}
      <p
        ref={statementRef}
        className="text-lg sm:text-2xl font-serif italic text-[#8C8A80] font-light tracking-wide max-w-xl mx-auto"
      >
        Music and sound for stories.
      </p>
    </section>
  );
};
