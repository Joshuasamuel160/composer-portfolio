"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { GlobalAudioPlayer } from "./GlobalAudioPlayer";
import { PageTransition } from "./PageTransition";
import { VisualEditing } from "@sanity/visual-editing/react";

export const SiteFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsInIframe(window.self !== window.top);
    }
  }, []);

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20">
        <PageTransition>{children}</PageTransition>
      </main>
      <footer className="py-8 border-t border-[#EDE8DE]/14 text-center text-xs tracking-widest text-[#8C8A80] uppercase font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} JOSHUA SAMUEL. ALL RIGHTS RESERVED.</span>
          <span>LAGOS · NIGERIA</span>
        </div>
      </footer>
      <GlobalAudioPlayer />
      {/* Only render blue editing highlights inside Sanity Studio preview iframe */}
      {isInIframe && <VisualEditing portal={true} />}
    </>
  );
};
