"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    },
    { dependencies: [pathname], scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
};
