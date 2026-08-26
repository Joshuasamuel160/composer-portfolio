"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { GlobalAudioPlayer } from "./GlobalAudioPlayer";
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
      <main className="flex-grow pt-20">{children}</main>
      <footer className="py-12 border-t border-white/5 text-center text-xs tracking-widest text-zinc-500 uppercase font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} JULIAN VANCE. ALL RIGHTS RESERVED.</span>
          <span>LOS ANGELES • LONDON</span>
        </div>
      </footer>
      <GlobalAudioPlayer />
      {/* Only render blue editing highlights inside Sanity Studio preview iframe */}
      {isInIframe && <VisualEditing portal={true} />}
    </>
  );
};
