"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface HeroProps {
  name: string;
  tagline: string;
}

export const Hero: React.FC<HeroProps> = ({ name, tagline }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 }
      ).fromTo(
        taglineRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.7"
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="pt-32 pb-8 px-6 max-w-5xl mx-auto text-center">
      {/* Name */}
      <h1
        ref={nameRef}
        className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-zinc-100 uppercase mb-6 font-serif"
      >
        {name}
      </h1>

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="text-base sm:text-xl md:text-2xl font-light tracking-widest text-zinc-400 max-w-3xl mx-auto uppercase"
      >
        {tagline}
      </p>
    </section>
  );
};
