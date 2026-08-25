"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { GlobalAudioPlayer } from "./GlobalAudioPlayer";

export const SiteFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

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
    </>
  );
};
